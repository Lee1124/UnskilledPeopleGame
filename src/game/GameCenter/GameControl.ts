/**游戏控制中心 */
// import NetClient from '../common/NetClient';//websoket
import websoket from '../Fuction/webSoketSend';
import MyCenter from '../common/MyCenter';
import InitGameData from '../Fuction/InitGameData';
import DealOrPlayPoker from '../Fuction/play/DealOrPlayPoker';
import DiuPoker from '../Fuction/diuPoker';
import ShowHandlePoker from '../Fuction/ShowHandlePoker';
// import FeelPoker from '../Fuction/FeelPoker';
import Main from '../common/Main';

import OpenDiaLog from '../Fuction/OpenDiaLog';
import SlideSeledct from '../common/SlideSelect';

import ReloadData from '../Fuction/ReloadData';
import step_0_initGameNews from '../Fuction/play/step_2_startNewGame';

import set_content_chat from '../Fuction/set_content_chat';//聊天

// //打牌之前的操作
// enum playBeforeH {
//     qi = 1,
//     tou,
//     kou,
//     guo,
//     frist
// }

// //打牌之后的操作 (1-吃  2-碰  3-杀/杠  4-吐火  5-偷  6-起牌 7-扣牌 8-过  9-胡牌)
// enum playAfterH {
//     none,
//     da,
//     chi,
//     pen,
//     sha,
//     tu,
//     kou,
//     guo,
//     hu,
// }

//   //无
//   None = 0,
//   //起牌
//   Stand,1
//   //偷牌
//   Steal,2
//   //扣牌
//   Kou,3
//   //过牌
//   Guo,4
//   //玩家出一张牌
//   Play,5
//   //吃牌
//   Eat,6
//   //碰牌
//   Touch,7
//   //杀/杠牌
//   Kill,8
//   //吐火
//   SpitFire,9
//   //胡牌
//   Hu,10

//操作按钮的类型
enum handleBtn {
    none,
    qi,
    tou,
    kou,
    guo,
    play,
    chi,
    pen,
    sha,
    tu,
    hu
}

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
        // try {
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
        if (resData._t == "R2C_AddDairu" || resData._t == "R2C_SitDown") {
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
        if (resData._t == "G2C_GameChat") {
            if (resData.ret.type == 0) {
                this.playerChat(resData);
            } else {
                Main.showTip(resData.ret.msg);
            }
        }

        //====开始游戏部分====
        if (resData._t == "G2C_StartNewWheel") {
            this.startNewGame(resData);
        } else if (resData._t == "G2C_DealHand") {
            this.dealPlayerPoker(resData);
        } else if (resData._t == "G2C_StandPoker") {//玩家起牌  
            if (MyCenter.getKeep('showHandle'))
                this.player_standPoker(resData);
            else
                MyCenter.req('qiPoker', () => {
                    this.player_standPoker(resData);
                })
        }else if(resData._t=="G2C_BuBankerPoker"){//玩家起牌
            this.player_buPoker(resData);
        }else if(resData._t=="G2C_StandPokerOpt"){//起牌处操作结果
            this.player_standPokerOpt(resData);
        }else if(resData._t=="G2C_StealPokerOpts"){//偷牌
            this.player_stealPokerOpt(resData);
        }

        // } catch (error) {
        //     Main.$LOG(error)
        // }
    }

    /**
     * 正式========游戏部分============================
     */

    /**
     * 开始游戏
     * @param data 
     */
    startNewGame(data: any): void {
        this.players.forEach((itemJS: any) => {
            data.players.forEach((itemData: any) => {
                if (itemJS.userId == itemData.uid) {
                    itemJS.startNewGame(data);
                }
            })
        })
    }

    /**
     * 发牌
     */
    dealPlayerPoker(data: any): void {
        DealOrPlayPoker.deal(data.players);
    }

    //玩家起牌
    player_standPoker(data: any): void {
        data.userId = data.uid;
        this.showTime(data, true);
        let opt:any=[];
        if (data.pokers.length == 0 && data.baozi) {//包子,只有扣
            opt=[{ h: handleBtn.kou, o: 1 }];
        } else if (data.pokers.length == 0 && !data.baozi) {//不是包子，可以过，不能起牌
            opt=[{ h: handleBtn.kou, o: 1 },{ h: handleBtn.guo, o: 1 }];
        } else if (data.pokers.length >= 0) {//可以起牌
            opt=[{ h: handleBtn.qi, o: 1 },{ h: handleBtn.guo, o: 1 }];
        }
        this.showHandle(data, opt);
    }

    //玩家补牌
    player_buPoker(data:any){
        data.userId=data.uid;
        this.feelPoker(data);
        DealOrPlayPoker.buPoker(data);
        this.onlyShowKouBtn(data);//补牌的时候就显示扣按钮
    }

    //玩家起牌处返回的结果
    player_standPokerOpt(data:any){
        data.userId=data.uid;
        this.showTime(data,false);
        this.showHandle(data,[]);
    }

    //玩家偷牌
    player_stealPokerOpt(data:any){
        data.userId=data.uid;
        this.showTime(data,true);
        let opts:any=this.setOptData(data.opts);
        // this.addKou(opts);
        let touArr:any=opts.filter((item:any)=>item.h==handleBtn.tou);
        if(touArr.length==0){
            opts.push({h:handleBtn.tou,o:0.4});
        }
        this.showHandle(data, opts);
        DealOrPlayPoker.buPoker(null);
        this.playerHideFeel(data);
    }

    //设置opt数据
    setOptData(data:any){
        let opts:any=[];
        data.forEach((item:any) => {
            opts.push({h:item,o:1})
        });
        return opts;
    }

    addKou(data:any){
        data.push({h:handleBtn.kou,o:1});
    }

    /**
     * 显示玩家的操作按钮
     * @param data 数据
     * @param opts 操作按钮的数据
     */
    showHandle(data: any,opts:any) {
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId) {
                console.log('opts=====玩家偷牌',opts)
                itemJS.playerHandle(opts);
            }
        })
    }

    /**
     * 只显示扣按钮
     * @param data 数据
     */
    onlyShowKouBtn(data: any){
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId) {
                // itemJS.playerHandle(show1, show2, data);
                let opts:any=[{h:handleBtn.kou,o:1}]
                itemJS.playerHandle(opts);
            }
        })
    }

    /**
     * 显示玩家的倒计时
     * @param data 数据
     * @param show 是否显示时间
     */
    showTime(data: any, show: boolean) {
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId)
                itemJS.playerCountDown(show, data);
        })
    }


    /**摸牌 */
    feelPoker(data:any) {
        // FeelPoker.feel();
        // this.players[1].userId=100011;this.players[2].userId=100012;
        // let data={userId:100012,poker:51006}
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId){
                itemJS.playerFeel(data);
                // setTimeout(()=>{
                //     itemJS.playerHideFeel();
                // },2000)
            }
        })

    }

    /** 隐藏摸得牌*/

    playerHideFeel(data:any){
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId){
                itemJS.playerHideFeel();
            }
        })
    }


    //正式========游戏部分============================

    /**
     * 离开房间处理
     * @param data 数据
     */
    leaveRoomDeal(data: any): void {
        if (data.userid == Main.userInfo.userId) {
            websoket.close();
            Main.$openScene('TabPages.scene', true, { page: this.owner['openData'].page });//
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
                    } else if (item.score > 0 && item.seatAtTime > 0) {//留坐中...
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
            Main.$LOG('重置玩家为之id', this.players);
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
    playerChat(data: any): void {
        if (data.chat.msgType == 1) {
            this.players.forEach((JSitem: any) => {
                if (JSitem.userId == data.chat.sender) {
                    JSitem.playerChat(data);
                }
            })
        } else if (data.chat.msgType == 2) {
            set_content_chat.playerTextChat(data);
            // set_content_chat.playerDeskTextChat(data);
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

        // this.showHandle({userId:100014},null,null);


//         let data={
//             ttime: 10,
// time: 5,
// uid: 100010,
// opts:  [4, 3]
//         }
//         this.setHandleData(data);
        // let data={
        //     ttime: 18,
        //     time: 9,
        //     uid: 100010,
        //     pokers: [111010,111010,132004,132004],
        //     baozi: false,
        //     userId: 100010,
        // }
        // this.player_standPoker(data);

        // setTimeout(()=>{
        //     this.showHandle(data, false, false);
        // },2000)
        // 类型
        // console.log('进来');
        // let data:any={uid:Main.userInfo.userId,handle:[1,2,8,7]};
        // this.players.forEach((item:any)=>{
        //     if(data.uid==item.userId){
        //         item.playerHandle(data);
        //     }
        // })  

        // this.players[0].playerCountDown(false);
        // this.players[0].
        // let data: any = [
        //     { uid: 100018, banker: false, pokers: null },
        //     { uid: 100021, banker: false, pokers: null },
        //     {
        //         uid: 100014, banker: true, pokers: [11002, 31004, 51006, 61006, 61006, 71007, 91008, 101009, 111010, 111010, 121012, 162007,
        //             162007, 172008, 172008, 172008, 182008, 192009, 202010, 212011]
        //     }
        // ]
        // DealOrPlayPoker.deal(data);

        // setTimeout(()=>{
        //     // data.forEach((item:any)=>{
        //     //     if(item.uid==100014){
        //     //         item.pokers.push(212011);
        //     //     }
        //     // })
        //     let data={
        //         poker:212011
        //     }
        //     DealOrPlayPoker.buPoker(data);
        //     setTimeout(()=>{
        //         DealOrPlayPoker.buPoker(null);
        //     },2000)
        // },2000)

        // let data = [212011, 212011, 212011, 111010, 41005, 101009, 101009, 41005, 41005, 41005, 41005, 81007, 81007, 81007, 81007, 91008, 111010, 121012, 121012, 162007];
        // //红色1 黑色2 
        // //类型1-21
        // //点数

        // let newArr = [];
        // data.forEach((item, index) => {
        //     let Type = parseInt(item / 10000);
        //     let Color = parseInt((item % 10000) / 1000);
        //     let Point = item - Type * 10000 - Color * 1000;
        //     let groupP = Point > 7 ? (14 - 7) : Point;
        //     newArr.push({ type: Type, Color: Color, seatPoint: groupP, Point: Point, id: (index + 1) })
        //     //     console.log(item,'牌名字type：'+Type,'牌颜色Color：'+Color,'牌点数Point：'+Point);
        // })

        // // console.log(newArr)

        // //进行分组
        // var map = {},
        //     dest = [];
        // for (var i = 0; i < newArr.length; i++) {
        //     var ai = newArr[i];
        //     if (!map[ai.seatPoint]) {
        //         dest.push({
        //             seatPoint: ai.seatPoint,
        //             data: [ai]
        //         });
        //         map[ai.seatPoint] = ai;
        //     } else {
        //         for (var j = 0; j < dest.length; j++) {
        //             var dj = dest[j];
        //             if (dj.seatPoint == ai.seatPoint) {
        //                 dj.data.push(ai);
        //                 break;
        //             }
        //         }
        //     }
        // }

        // //排序
        // dest.sort((a, b) => {
        //     return a.seatPoint - b.seatPoint;
        // })

        // //根据type排序
        // dest.forEach(item => {
        //     item.data.sort((a, b) => {
        //         return a.type - b.type;
        //     })
        // })

        // function getNewArr(item, filterArr) {
        //     console.log('filterArr', filterArr)
        //     let myIndexArr = [];
        //     filterArr.forEach((item0, index0) => {
        //         let falg = true;
        //         item.data.forEach((item2, index2) => {
        //             if ((item0.type == item2.type) && falg) {
        //                 falg = false
        //                 myIndexArr.push(index2);
        //             }
        //         })
        //     })
        //     myIndexArr.unshift(0);
        //     myIndexArr.push(item.data.length);
        //     console.log('myIndexArr', myIndexArr)
        //     let newReturnArr = [];
        //     for (let i = 0; i < myIndexArr.length; i++) {
        //         if (myIndexArr[i + 1]) {
        //             let myData = item.data.slice(myIndexArr[i], myIndexArr[i + 1]);
        //             newReturnArr.push({ seatPoint: myData[0].seatPoint, data: myData })
        //         }
        //     }
        //     return newReturnArr;
        // }

        // //每列超过6张 就另起一列 若前面有一样的牌一起跟着走
        // let colNum = 6;//规定每列的数量
        // let bigArr;
        // console.log(dest)
        // dest.forEach((item, index) => {
        //     let filterArr = item.data.filter((item2, index2) => (index2 + 1) % colNum == 0);
        //     if (filterArr.length > 0) {
        //         console.log(index)
        //         bigArr = getNewArr(item, filterArr);
        //         for (let i = dest.length - 1; i >= 0; i--) {
        //             if (index == i) {
        //                 dest.splice(index, 1);
        //             }
        //         }
        //         dest = dest.concat(bigArr)
        //     }
        // })
        // console.log('====++', bigArr);

        // //排序
        // dest.sort((a, b) => {
        //     return a.seatPoint - b.seatPoint;
        // })
        // console.log(dest);

        // websoket.playerSeatUpSend();

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
    // /**摸牌 */
    // feelPoker() {
    //     FeelPoker.feel();
    // }
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
        // let index = parseInt(String(Math.random() * 3));
        this.players[0].playerCountDown(true, {
            ttime: 20,
            time: 10
        });
    }
}