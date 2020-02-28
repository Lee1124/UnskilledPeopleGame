/**
 * websoket发送
 */
import NetClient from '../common/NetClient';//websoket
import MyCenter from '../common/MyCenter';
import Main from '../common/Main';
class websketSend {
    //websoket对象
    netClient: any;
    //soket连接次数
    soketConnetNum: number = 0;
    //控制中心脚本
    conThis: any;
    //初始化soket
    open(): void {
        this.conThis = MyCenter.GameControlObj;
        this.netClient = new NetClient("ws://" + Main.websoketApi);
        this.onConnect();
    }

    /**
    * soket关闭
    */
    close() {
        Main.showLoading(false, Main.loadingType.two);
        this.netClient.close();
    }

    /**
     * soket发送消息
     */
    onSend(obj: any) {
        let that = this;
        let name = obj.name;
        let data = obj.data;
        this.netClient.send({
            name: name,
            data: data,
            callback: function (name: any, msg: any) {
                obj.success.call(that, msg);
            }
        });
        Main.$LOG('soket发送消息:', obj);
    }

    /**
     * 开始连接
     */
    onConnect(): void {
        let that = this;
        this.netClient.open();
        this.netClient.onConnectSucc = () => {
            Main.$LOG('连接成功');
            that.connetRoom();
            that.getSoketNews();
            that.reloadConnet();
        }
    }

    /**
     * 接受soket消息
     */
    getSoketNews(): void {
        let that=this;
        /* 接受消息 */
        this.netClient.onMessage = function (name: any, resMsg: any) {
            that.conThis.dealSoketMessage('onMessage公共消息：', resMsg); //进入处理函数
        }
    }

    //连接房间
    connetRoom(): void {
        let that = this;
        this.onSend({
            name: 'M.User.C2G_Connect',
            data: {
                uid: Main.userInfo ? Main.userInfo.userId : 0,
                key: Main.userInfo ? Main.userInfo.key : 0,
                devid: Laya.Browser.onAndroid ? "Android" : "PC",
                ip: "60.255.161.15"
            },
            success(resMsg: any) {
                Main.$LOG('初始化---[Rpc回调]:', resMsg);
                if (resMsg._t == "G2C_Connect") {
                    if (resMsg.ret.type == 0) {
                        Main.showLoading(false, Main.loadingType.two);
                        this.soketConnetNum = 0;
                        this.onSend({
                            name: 'M.Room.C2R_IntoRoom',
                            data: {
                                roomPws: this.conThis.roomPwd
                            },
                            success(res: any) {
                                Main.showLoading(true, Main.loadingType.two);
                                this.conThis.dealSoketMessage('初始化---C2R_IntoRoom进入房间', res);
                            }
                        })
                    } else {
                        Main.showDiaLog(resMsg.ret.msg, 1, () => {
                            that.close();
                            Laya.Scene.open('Login.scene', true, Main.sign.signOut);
                        })
                    }
                }
            }
        });
    }
    /**
         * 检测断线重连
         */
    reloadConnet(): void {
        let that = this;
        this.netClient.onStartConnect = function (res) {
            // Main.errList = [];
            Main.$LOG('soket重新连接开始')
            Main.showLoading(true, Main.loadingType.two);
            that.soketConnetNum++;
            if (that.soketConnetNum >= 15) {
                Main.showLoading(false, Main.loadingType.two);
                that.soketConnetNum = 0;
                Main.showDiaLog('网络错误,请重新登录', 1, () => {
                    that.close();
                    Laya.Scene.open('login.scene', true, Main.sign.signOut);
                })
            } else if (that.soketConnetNum == 1) {
                Main.showTip('检测到网络丢失!');
            }
        }
    }

    /**
     * 请求房间初始数据
     */
    roomUpdate() {
        this.onSend({
            name: 'M.Room.C2R_UpdateRoom',
            data: {
                roomId: this.conThis.roomId
            },
            success(upDateRes: any) {
                this.conThis.dealSoketMessage('进入房间收到的消息：', upDateRes); //进入处理函数
            }
        })
    }

    /**
     * 占座请求
     * @param seatId 位置Id
     * @param JSthis 执行域
     * @param callBack 回调函数
     *
     */
    seatAt(seatId: number, JSthis: any, callBack?: Function) {
        this.onSend({
            name: 'M.Room.C2R_SeatAt',
            data: {
                roomid: this.conThis.roomId,
                idx: seatId
            },
            success(res: any) {
                this.conThis.dealSoketMessage('占位：', res)
                callBack.call(JSthis, res);
            }
        })
    }

    /**
     * 玩家起立请求
     */
    playerSeatUpSend() {
        this.onSend({
            name: 'M.Room.C2R_SeatUp',
            data: {
                roomid: this.conThis.roomId
            },
            success(resData: any) {
                this.conThis.dealSoketMessage('占位未坐下起立：', resData)
            }
        })
    }

    //离开房间
    playerLeaveRoomSend() {
        this.onSend({
            name: 'M.Room.C2R_LeaveRoom',
            data: {
                roomid: this.conThis.roomId
            },
            success(res:any) {
                this.conThis.dealSoketMessage('离开房间：', res);
            }
        })
    }

   /**
    * 确定带入积分
    * @param seatIndex 位置索引
    * @param dairuScore 带入的积分
    */
    comfirmIntoScore(seatIndex:number,dairuScore:number,type?:any,isComfirm?:boolean):void{
        let sendName:any=type==2?'M.Room.C2R_AddDairu':'M.Room.C2R_SitDown';
        this.onSend({
            name: sendName,
            data: {
                roomid: this.conThis.roomId,
                idx: seatIndex,
                score: dairuScore
            },
            success(res:any) {
                this.conThis.dealSoketMessage('补充钵钵：', res);
                if(res.ret.type==0&&isComfirm){
                    Main.showTip('带入成功');
                }
            }
        })
    }

    /**
     * 留坐请求
     * @param isLiuZuo 是否留坐状态
     * @param selectScore 先择的时间对应的分数
     */
    liuzuoRequest(isLiuZuo:boolean,selectScore:number):void{
        this.onSend({
            name: 'M.Room.C2R_Reservation',
            data: {
                roomid: this.conThis.roomId,
                reservation: isLiuZuo,
                consume: selectScore
            },
            success(res:any) {
                this.conThis.dealSoketMessage('留座：', res);
            }
        })
    }


    /**
     * 聊天
     * @param msgType 类型（1.为表情，2.为文字）
     * @param content 内容
     * @param msgId 消息id
     */
    chatReq(msgType:any=1,content:any,msgId:any):void{
        this.onSend({
            name: 'M.Games.CX.C2G_GameChat',
            data: {
                chat: {
                    "recipient": -1,
                    "sender": Main.userInfo.userId,
                    "content": content,
                    "msgType": msgType,
                    "msgId": msgId,
                },
                roomId: this.conThis.roomId,
                chatType: 0,
            },
            success(res:any) {
                this.conThis.dealSoketMessage('发送表情：', res);
            }
        })
    }
}
export default new websketSend();