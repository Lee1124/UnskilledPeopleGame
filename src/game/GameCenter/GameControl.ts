/**游戏控制中心 */
// import NetClient from '../common/NetClient';//websoket
import websoket from '../Fuction/webSoketSend';
import MyCenter from '../common/MyCenter';
import InitGameData from '../Fuction/InitGameData';
import DealOrPlayPoker from '../Fuction/DealOrPlayPoker';
import DiuPoker from '../Fuction/diuPoker';
import ShowHandlePoker from '../Fuction/ShowHandlePoker';
import FeelPoker from '../Fuction/FeelPoker';
import Main from '../common/Main';

import OpenDiaLog from '../Fuction/OpenDiaLog';
import SlideSeledct from '../common/SlideSelect';

import ReloadData from '../Fuction/ReloadData';
import step_0_initGameNews from '../Fuction/step_2_startNewGame';

import set_content_chat from '../Fuction/set_content_chat';//聊天
export default class GameControl extends Laya.Script {
    /** @prop {name:dealPoker,tips:"发牌的牌",type:Prefab}*/
    //房间密钥
    roomPwd: number;
    //房间ID
    roomId: number;
    //websoket对象
    // netClient: any;
    // //soket连接次数
    // soketConnetNum: number = 0;
    //玩家数组
    players: any[] = [];
    //位置索引
    private Index: number = 0;
    //游戏规则等信息
    GameNews: any;
    //===========摸牌测试===========
    num2: number = 0;
    data1: any[] = [
        { userId: 123450, data: [1] },
        { userId: 123451, data: [4] },
        { userId: 123452, data: [10] }
    ];
    onEnable(): void {
        // /**===测试=== */
        // Main.beforeReload();
        // Main.createTipBox();
        // /**===测试=== */
        this.KeepSeatObj();
        this.InitGameData();
    }
    /**初始化数据 */
    InitGameData() {
        MyCenter.InitGameData(this);
    }
    /**保存玩家位置对象 */
    KeepSeatObj() {
        let that = this;
        MyCenter.req('seat', (res: any) => {
            that.players.push(res);
            InitGameData.Init(res, this);
            this.Index++;
        });
    }

    onStart(): void {
        this.setGameParamInit();
    }

    /**
    * 初始化游戏参数
    */
    setGameParamInit() {
        this.roomPwd = this.owner['openData'] ? this.owner['openData'].roomPws : 0;
        websoket.open();
    }

    /**
    * 处理websoket收到的消息
    */
    dealSoketMessage(sign: any, resData: any): void {
        Main.$LOG(sign, resData);
        try {
            if (resData._t == 'R2C_IntoRoom') {
                if (resData.ret.type == 0) {
                    this.requestRoomUpdateData(resData);
                } else {
                    Main.showTip(resData.ret.msg);
                    this.leaveRoomOpenView();
                }
            }

            //更新数据
            if (resData._t == 'R2C_UpdateRoom') {
                Main.showLoading(false, Main.loadingType.two);
                if (resData.ret.type == 0) {
                    ReloadData.init();
                    resData.param.json.forEach((item: any) => {
                        if (item._t == "YDRIntoRoom") {
                            this.getGameNews(item);//获取游戏信息
                            this.updateRoomData(item, resData);
                        } else if (item._t == "UpdateRoomData") {
                            // this.updateCurData(item, resData);//更新当前数据
                        }
                    })
                } else {
                    Main.showTip(resData.ret.msg);
                }
            }

            // 起立
            if (resData._t == 'R2C_SeatUp') {
                if (resData.ret.type == 0) {
                    this.playerSeatUp(resData);
                } else {
                    Main.showTip(resData.ret.msg);
                }
            }

            if (resData._t == 'R2C_SeatAt') {
                if (resData.ret.type == 0) {
                    resData.param.json.forEach((item: any) => {
                        if (item._t == "YDRSeatAt") {//占位
                            this.playerSeatAt(item);
                        } else if (item._t == "YDRSitDown") {//坐下
                            this.playerSeatDown(item);
                        }
                    })
                } else {
                    Main.showTip(resData.ret.msg);
                }
            }

            //带入积分坐下(或补充金币)
            if (resData._t == "R2C_AddDairu"||resData._t=="R2C_SitDown") {
                if (resData.ret.type == 0 || resData.ret.type == 4) {
                    // this.setMeMakeBOBO(resData);
                    resData.param.json.forEach((item: any) => {
                        if (item._t == "YDRAddBobo") {
                            this.playerDairu(item);
                        }
                    })
                }
                if (resData.ret.type != 0) {
                    Main.showTip(resData.ret.msg);
                    let makeUpBOBO: any = this.owner['makeUpCoin'].getComponent(OpenDiaLog);
                    makeUpBOBO.close();
                }
            }

            //留坐
            if (resData._t == "R2C_Reservation") {
                if (resData.ret.type == 0) {
                    resData.param.json.forEach((item: any) => {
                        if (item._t == "YDRSeatReservation") {//留坐
                            this.palyerLiuZuo(item);
                        } else if (item._t == "YDRSitDown") {//回到座位上
                            this.playerReturnSeat(item);
                        }
                    })
                } else {
                    Main.showTip(resData.ret.msg);
                }
            }

            //离开房间
            if (resData._t == "R2C_LeaveRoom") {
                if (resData.ret.type == 4) {
                    Main.showTip(resData.ret.msg);
                } else {
                    this.leaveRoomDeal(resData);
                }
            }

            //聊天
            if(resData._t == "G2C_GameChat"){
                if (resData.ret.type == 0) {
                    this.playerChat(resData);
                } else {
                    Main.showTip(resData.ret.msg);
                }
            }

            //====开始游戏部分====
            if (resData._t == "G2C_StartNewWheel") {
                this.startNewGame(resData);
            }else if(resData._t == "G2C_DealHand"){
                this.dealPlayerPoker(resData);
            }


        } catch (error) {
            Main.$LOG(error)
        }
    }
    
    /**
     * ========游戏部分=========
     */

     /**
      * 开始游戏
      * @param data 
      */
    startNewGame(data:any):void{
        this.players.forEach((itemJS:any)=>{
            data.players.forEach((itemData:any)=>{
                if(itemJS.userId==itemData.uid){
                    itemJS.startNewGame(data);
                }
            })
        })
    }

    /**
     * 发牌
     */
    dealPlayerPoker(data:any):void{
        DealOrPlayPoker.deal(data);
    }

    /**
     * 离开房间处理
     * @param data 数据
     */
    leaveRoomDeal(data: any): void {
        if (data.userid == Main.userInfo.userId) {
            websoket.close();
            Main.$openScene('TabPages.scene', true,{ page: this.owner['openData'].page });//
        } else {
            this.playerSeatUp(data);
        }
    }

    /**
     * 获取游戏规则等信息
     * @param data 数据
     */
    getGameNews(data: any): void {
        this.GameNews = data;
        // step_0_initGameNews.init_addCoin(this, data);
    }

    //更新当前数据
    updateCurData(item: any, data: any): void {

    }

    //更新玩家数据
    updateRoomData(itemData: any, data: any): void {
        let roomSeat: any[] = itemData.roomSeat;
        this.changePlayerSeatId(roomSeat);
        roomSeat.forEach((item: any) => {
            this.players.forEach((JSitem: any) => {
                if (JSitem.SeatId == item.seat_idx) {
                    item.userId = item._id;
                    if (item.score == 0 && item.seatAtTime > 0) {//占座中...
                        JSitem.playerSeatAtFn(item);
                    } else if (item.score > 0 && item.seatAtTime <= 0) {//在座位...
                        JSitem.playerSeatDownFn(item);
                    }else if (item.score > 0 && item.seatAtTime > 0) {//留坐中...
                        JSitem.playerSeatDownFn(item);
                        JSitem.palyerLiuZuo(item);
                    }
                }
            })
        })
    }

    /**
     * 重置玩家为之id
     * @param roomSeat 房间数据
     */
    changePlayerSeatId(roomSeat: any): void {
        let meSeatArr: any[] = roomSeat.filter((item: any) => item._id == Main.userInfo.userId);
        if (meSeatArr.length > 0) {
            let meSeatId: number = meSeatArr[0].seat_idx;
            let seatIndexArr: number[] = [0, 1, 2];
            let NewSeatSeatArr = seatIndexArr.splice(meSeatId, seatIndexArr.length).concat(seatIndexArr.splice(0, meSeatId + 1));
            this.players.forEach((item: any, index: number) => {
                item.SeatId = NewSeatSeatArr[index];
            });
            Main.$LOG('重置玩家为之id',this.players);
        }
    }


    //占位
    playerSeatAt(data: any): void {
        // console.log(this.players)
        this.players.forEach((JSitem: any) => {
            if (JSitem.SeatId == data.seatidx) {
                JSitem.playerSeatAtFn(data);
            }
        })
    }

    //起立
    playerSeatUp(data: any): void {
        this.players.forEach((JSitem: any) => {
            if (JSitem.userId == data.userid) {
                data.userId = data.userid;
                JSitem.playerSeatUpFn(data);
            }
        })
    }

    /**
     * 带入积分坐下
     * @param data 数据
     */
    playerDairu(data: any): void {
        this.players.forEach((JSitem: any) => {
            if (JSitem.userId == data.userId) {
                JSitem.playerDairu(data);
            }
        })
    }

    /**
     * 玩家留坐
     * @param data 数据
     */
    palyerLiuZuo(data: any): void {
        this.players.forEach((JSitem: any) => {
            if (JSitem.userId == data.userId) {
                JSitem.palyerLiuZuo(data);
            }
        })
    }

    /**
     * 玩家回到座位上
     * @param data 数据
     */
    playerReturnSeat(data: any): void {
        this.players.forEach((JSitem: any) => {
            if (JSitem.userId == data.userId) {
                JSitem.playerReturnSeatFn(data);
            }
        })
    }

    /**
     * 直接坐下(之前带入过)
     * @param data 数据
     */
    playerSeatDown(data: any): void {
        this.players.forEach((JSitem: any) => {
            if (JSitem.SeatId == data.seatidx) {
                JSitem.playerSeatDownFn(data);
            }
        })
    }
    
    /**
     * 玩家聊天
     * @param data 数据
     */
    playerChat(data:any):void{
        if(data.chat.msgType==1){
            this.players.forEach((JSitem: any) => {
                if (JSitem.userId == data.chat.sender) {
                    JSitem.playerChat(data);
                }
            })
        }else if(data.chat.msgType==2){
            set_content_chat.playerTextChat(data);
        }
    }

    /**请求房间数据 */
    requestRoomUpdateData(data: any): void {
        this.roomId = data.roomId;
        websoket.roomUpdate();
    }

    /**离开房间 */
    leaveRoomOpenView(): void {

    }

    /**发牌 */
    dealPokerFn() {

        websoket.playerSeatUpSend();

        // let seatIndexArr:number[] = [0, 1, 2];
        // let NewSeatSeatArr = seatIndexArr.splice(2, seatIndexArr.length).concat(seatIndexArr.splice(0, 2 + 1));
        // console.log(NewSeatSeatArr)


        // let makeUpBOBO:any=this.owner['makeUpCoin'].getComponent(OpenDiaLog);
        // let slideJS:any=this.owner['makeUpCoin'].getChildByName('sliderView').getComponent(SlideSeledct);
        // makeUpBOBO.init(1,0,this,()=>{
        //     console.log('打开了')
        // },()=>{
        //     console.log('关闭了')
        // },()=>{
        //     //滑动选择初始化
        //     slideJS.init(100,2,6,this,(res:number)=>{
        //         console.log(res)
        //     });
        //     //打开补充钵钵弹框
        //     makeUpBOBO.open();
        // });

        // Main.showTip('游戏开始...');
        // setTimeout(() => {
        //     DealOrPlayPoker.deal();
        // }, 1000)
    }
    /**丢的牌 */
    diuPoker() {
        let num = parseInt(String(Math.random() * 21)) + 1;
        this.data1[0].data.push(num);
        this.data1[1].data.push(num);
        this.data1[2].data.push(num);
        DiuPoker.open(this.data1);
    }
    /**操作的牌 */
    handlePoker() {
        ShowHandlePoker.open();
    }
    /**摸牌 */
    feelPoker() {
        FeelPoker.feel();
    }
    /**非自己玩家出牌 */
    otherPlay() {
        this.num2++;
        DealOrPlayPoker.otherPlay(this.num2);
    }
    /**
     * 倒计时
     */
    countDown() {
        // countDown.open();
        let index = parseInt(String(Math.random() * 3));
        this.players[index].playerCountDown(true, {
            startTime: Math.round(new Date().getTime() / 1000),
            endTime: Math.round(new Date().getTime() / 1000) + 20
        });
    }



}