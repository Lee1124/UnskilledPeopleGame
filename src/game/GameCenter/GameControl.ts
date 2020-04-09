/**游戏控制中心 */
// import NetClient from '../common/NetClient';//websoket
import websoket from '../Fuction/webSoketSend';
import MyCenter from '../common/MyCenter';
import InitGameData from '../Fuction/InitGameData';
import DealOrPlayPoker from '../Fuction/play/DealOrPlayPoker';
import DiuPoker from '../Fuction/diuPoker';
import Main from '../common/Main';

import OpenDiaLog from '../Fuction/OpenDiaLog';
import SlideSeledct from '../common/SlideSelect';

import ReloadData from '../Fuction/ReloadData';
import step_0_initGameNews from '../Fuction/play/step_2_startNewGame';

import set_content_chat from '../Fuction/set_content_chat';//聊天

import time from "../Fuction/play/time/time";//倒计时
import showHandleBtns from "../Fuction/play/showHandleBtns/showHandleBtns";//玩家显示按钮
// import chipengangtuDealData from "../Fuction/play/chipengangtuDealData/chipengangtuDealData";

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

//打牌阶段（起牌,偷牌,打牌）
enum playstage {
    qi,
    tou,
    da
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
        if (resData._t == "G2C_StartNewWheel") {//开始新的一轮
            this.startNewGame(resData);
        } else if (resData._t == "G2C_DealHand") {//开始发牌
            MyCenter.keep('playstage', playstage.qi);
            this.dealPlayerPoker(resData);
        } else if (resData._t == "G2C_StandPoker") {//玩家起牌  
            if (MyCenter.getKeep('showHandle'))
                this.player_standPoker(resData);
            else
                MyCenter.req('qiPoker', () => {
                    this.player_standPoker(resData);
                })
        } else if (resData._t == "G2C_BuBankerPoker") {//玩家起牌
            this.player_buPoker(resData);
        } else if (resData._t == "G2C_StandPokerOpt") {//起牌处操作结果
            this.player_standPokerOpt(resData);
        } else if (resData._t == "G2C_StealPokerOpts") {//偷牌
            MyCenter.keep('playstage', playstage.tou);
            if (MyCenter.getKeep('allowStealPoker')) {
                this.player_stealPokerOpt(resData);
            } else {
                MyCenter.req('allowStealPoker', () => {
                    this.player_stealPokerOpt(resData);
                })
            }
        } else if (resData._t == "G2C_StealPokerResult") {//偷牌返回的结果
            this.player_stealPokerResult(resData);
        } else if (resData._t == "G2C_NoticePlayAPoker") {//开始打牌
            MyCenter.keep('playstage', playstage.da);
            this.player_noticePlayAPoker(resData);
        } else if (resData._t == "S2C_PlayAPoker") {//非自己玩家打牌之后
            this.palyer_playAPoker(resData);
        } else if (resData._t == "G2C_ActionPokerOpts") {//玩家出牌后的操作
            this.palyer_actionPokerOpts(resData);
        } else if (resData._t == "G2C_FlopAPoker") {//玩家翻牌
            this.palyer_flopAPoker(resData);
        } else if (resData._t == "G2C_ActionPokerResult") {//玩家操作返回结果
            this.palyer_actionPokerResult(resData);
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
        MyCenter.keep('dealPCount', data.players.length);
        this.players.forEach((itemJS: any) => {
            data.players.forEach((item: any) => {
                if (itemJS.userId == item.uid) {
                    itemJS.dealPoker(item);
                }
            })
        })
    }

    //玩家起牌
    player_standPoker(data: any): void {
        data.userId = data.uid;
        time.show(data);
        let opt: any = [];
        if (data.pokers.length == 0 && data.baozi) {//包子,只有扣
            opt = [{ h: handleBtn.kou, o: 1 }];
        } else if (data.pokers.length == 0 && !data.baozi) {//不是包子，可以过，不能起牌
            opt = [{ h: handleBtn.kou, o: 1 }, { h: handleBtn.guo, o: 1 }];
        } else if (data.pokers.length >= 0) {//可以起牌
            opt = [{ h: handleBtn.qi, o: 1 }, { h: handleBtn.guo, o: 1 }];
        }
        showHandleBtns.show(data, opt);
    }

    //玩家补牌
    player_buPoker(data: any) {
        MyCenter.keep('play', true);
        data.userId = data.uid;
        //玩家摸牌效果显示
        this.feelPoker(data);
        // DealOrPlayPoker.buPoker(buPokerArr);
        //庄家补牌
        this.bankerBuPoker(data);
        // this.onlyShowKouBtn(data);//补牌的时候就显示扣按钮
        showHandleBtns.onlyKouBtn(data);
    }

    //庄家补牌
    bankerBuPoker(data: any): void {
        let buPokerArr: any[] = data.poker ? [data.poker] : [];
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId) {
                itemJS.buPoker(buPokerArr);
            }
        })
    }

    //玩家起牌处返回的结果
    player_standPokerOpt(data: any) {
        data.userId = data.uid;
        time.hide(data);
        showHandleBtns.hideAll(data);
    }

    //玩家偷牌
    player_stealPokerOpt(data: any) {
        data.userId = data.uid;
        // this.showTime(data, true);
        time.show(data);
        let opts: any = this.setOptData(data.opts);
        // this.addKou(opts);
        let touArr: any = opts.filter((item: any) => item.h == handleBtn.tou);
        if (touArr.length == 0) {
            opts.push({ h: handleBtn.tou, o: 0.4 });
        }
        // this.showHandle(data, opts);
        showHandleBtns.show(data, opts);
        // DealOrPlayPoker.buPoker(null);
        //使补牌标记去掉
        this.bankerBuPoker(data);
        this.playerHideFeel(data);
    }

    //设置opt数据
    setOptData(data: any) {
        let opts: any = [];
        data.forEach((item: any) => {
            opts.push({ h: item, o: 1 })
        });
        return opts;
    }

    addKou(data: any) {
        data.push({ h: handleBtn.kou, o: 1 });
    }

    //偷牌返回结果
    player_stealPokerResult(data: any) {
        data.userId = data.uid;
        this.stealPokerResult(data);
    }

    //偷牌返回的结果
    stealPokerResult(data: any): void {
        // this.onlyShowKouBtn(data);
        showHandleBtns.onlyKouBtn(data);//补牌的时候就显示扣按钮
        this.players.forEach((item: any) => {
            if (data.userId == item.userId) {
                let touPokers: any[] = data.pokers;
                if (touPokers.length > 0 && item.IsMe) {//只有自己进
                    MyCenter.keep('allowStealPoker', false);
                    item.buPoker(touPokers, () => {
                        if (data.spitfires.length > 0) {//如果开始有吐火就吐火
                            setTimeout(() => {
                                MyCenter.send('allowStealPoker', true);
                                MyCenter.keep('allowStealPoker', true);
                                this.stealPokerResultCoomon(item, data);
                            }, 1000)
                        }
                    })
                }
                else if (data.spitfires.length > 0 && !item.IsMe)//非自己进
                    this.stealPokerResultCoomon(item, data);
            }
        })
    }

    //接上，公用
    stealPokerResultCoomon(item: any, data: any) {
        let arr: any = [];
        let obj: any = {};
        let arr2: any = [];
        data.spitfires.forEach(((item: any) => {
            arr.push({ type: 3, data_inner: [item, item, item] });
            arr2.push(item, item, item, item, item);
        }));
        obj = {
            userId: data.userId,
            data: arr
        }
        item.showHandleAni({ opt: 3 });
        this.showHandlePokerDealData(item, data, obj, arr2);
    }

    /**
     * 显示吃碰杠吐火时候的数据处理
     * @param item 
     * @param data 
     */
    showHandlePokerDealData(item: any, data: any, concatData: any, removePokers: any): void {
        data.concatData = concatData;
        data.removePokers = removePokers;
        item.showHandlePoker(data);
    }


    // /**
    //  * 清除玩家操作的牌的显示处
    //  */
    // clearHandlePoker(): void {
    //     this.players.forEach((itemJS: any) => {
    //         itemJS.clearHandlePoker();
    //     })
    // }

    /**
     * 开始打牌
     * @param data 数据
     */
    player_noticePlayAPoker(data: any) {
        data.userId = data.uid;
        this.playerPlaySet(data, true);
    }

    /**
     * 玩家打牌设置 打和刚打过公用
     * @param data 数据
     * @param isMePlay 是否自己该打
     */
    playerPlaySet(data: any, isMePlay: boolean): void {
        // this.showTime(data, isMePlay);
        if (isMePlay)
            time.show(data);
        else
            time.hide(data);
        time.hide(data);
        MyCenter.keep('isMePlay', isMePlay);
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId) {
                itemJS.showPlayTip(isMePlay);
            }
        })
    }

    /**
     * 非自己玩家打了牌之后
     * @param data 数据
     */
    palyer_playAPoker(data: any) {
        data.userId = data.uid;
        // this.showTime(data, false);
        time.hide(data);
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId)
                itemJS.showNoMePlayPoker(data.poker);
        })
    }

    /**
     * 玩家(出牌后/摸牌后)该显示的操作
     * @param data 
     */
    palyer_actionPokerOpts(data: any) {
        data.userId = data.uid;
        // this.showTime(data, true);
        this.dealWithOptData(data);
        let opts: any = this.setOptData(data.opts);
        // this.showHandle(data, opts);
        showHandleBtns.show(data, opts);
        // MyCenter.keep('isAction', true);
        // this.aterFeelPokerShowTime(data);
        time.shows(data);
    }

    /**
     * 玩家出牌后该显示的操作数据处理
     * @param data 
     */
    dealWithOptData(data: any) {
        console.log('玩家出牌后该显示的操作数据处理:', data)

    }

    /**
     * 玩家翻牌
     * @param data 数据
     */
    palyer_flopAPoker(data: any) {
        data.userId = data.uid;
        this.playerHideFeel(data, true);
        this.feelPoker(data);
    }

    /**摸牌 */
    feelPoker(data: any) {
        // FeelPoker.feel();
        // let data={userId:100018,poker:51006}
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId) {
                itemJS.playerFeel(data);
            }
        })
    }

    /**
     * 隐藏摸得牌
     * @param data 数据
     * @param isAll 是不是先全部清除
     */
    playerHideFeel(data: any, isAll: boolean = false) {
        this.players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId && !isAll) {
                itemJS.playerHideFeel();
            } else if (isAll) {
                itemJS.playerHideFeel();
            }
        })
    }

    /**
     * 玩家操作返回的结果
     */
    palyer_actionPokerResult(data: any) {
        data.userId=data.uid;
        showHandleBtns.daHandleShow(data,data.opt);
        this.playerHideFeel(data,true);
        
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
        // console.log('占位=====data.seatidx:',data.seatidx)
        this.players.forEach((JSitem: any) => {
            if (JSitem.Index == data.seatidx) {
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
            // if (JSitem.SeatId == data.seatidx) {
            //     JSitem.playerSeatDownFn(data);
            // }
            if (JSitem.Index == data.seatidx) {
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
        // let data={
        //     opt:1
        // }
        // this.players[0].showHandleAni(data);
        // let data2={
        //     opt:2
        // }
        // this.players[1].showHandleAni(data2);
        // let data3={
        //     opt:3
        // }
        // this.players[2].showHandleAni(data3);
        // this.showHandle({userId:100014},null,null);
        this.players.forEach((item:any)=>{
            if(item.userId==Main.userInfo.userId){
                alert(item.SeatId)
            }
        })
        // console.log('进来了')
        // let data0: any = [
        //     { uid: 100006, banker: false, pokers: null },
        //     { uid: 100008, banker: false, pokers: null },
        //     {
        //         uid: 100007, banker: true, pokers: [11002, 31004, 51006, 61006, 61006, 71007, 91008, 101009, 111010, 111010, 111010, 162007,
        //             162007, 172008, 172008, 172008, 172008, 182008, 192009, 202010]
        //     }
        // ]
        // this.players[1].userId = 100006;
        // this.players[2].userId = 100008;
        // MyCenter.keep('dealPCount', data0.length);
        // this.players.forEach((itemJS: any) => {
        //     data0.forEach((item: any) => {
        //         if (itemJS.userId == item.uid) {
        //             itemJS.dealPoker(item);
        //         }
        //     })
        // })

        // // this.aterFeelPokerShowTime({uids:[100018,100021,100007],ttime:20,time:20})

        // let data2: any = {
        //     ttime: 20,
        //     time: 20,
        //     uid: 100007,
        //     uids: [100006, 100007, 100008],
        //     poker: 172008,
        //     opts: [6, 3, 4, 7],
        //     optpokers: [202010, 31004],
        //     userId: 100007
        // }
        // MyCenter.keep('playstage',2)
        // this.palyer_actionPokerOpts(data2);

        // setTimeout(() => {
        //     let data = {
        //         uid: 100010,
        //         pokers: [172008],
        //         spitfires: [172008],
        //         userId: 100010,
        //         concatData: {},
        //         removePokers: []
        //     };

        //     this.players.forEach((itemJS:any)=>{
        //         if(itemJS.userId==data.userId){
        //             itemJS.buPoker(data.pokers,()=>{
        //                 console.log('补牌结束')
        //         //     if (data.spitfires.length > 0) {
        //         //     let arr: any = [];
        //         //     let obj: any = {};
        //         //     let arr2: any = [];
        //         //     data.spitfires.forEach(((item: any) => {
        //         //         arr.push({ type: 3, data_inner: [item, item, item] });
        //         //         arr2.push(item, item, item, item, item);
        //         //     }));
        //         //     obj = {
        //         //         userId: data.userId,
        //         //         data: arr
        //         //     }
        //         //     data.concatData = obj;
        //         //     data.removePokers = arr2;
        //         //     this.players.forEach((item: any) => {
        //         //         if (item.userId == data.userId)
        //         //             item.showHandlePoker(data);
        //         //     })
        //         // }
        //             })
        //         }
        //     })

        //     // let that: any = this;
        //     // DealOrPlayPoker.buPoker(data.pokers, () => {
        //     //     console.log('补牌结束')
        //     //     if (data.spitfires.length > 0) {
        //     //         let arr: any = [];
        //     //         let obj: any = {};
        //     //         let arr2: any = [];
        //     //         data.spitfires.forEach(((item: any) => {
        //     //             arr.push({ type: 3, data_inner: [item, item, item] });
        //     //             arr2.push(item, item, item, item, item);
        //     //         }));
        //     //         obj = {
        //     //             userId: data.userId,
        //     //             data: arr
        //     //         }
        //     //         data.concatData = obj;
        //     //         data.removePokers = arr2;
        //     //         this.players.forEach((item: any) => {
        //     //             if (item.userId == data.userId)
        //     //                 item.showHandlePoker(data);
        //     //         })
        //     //     }
        //     // });
        // }, 3000)
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
        this.players.forEach((itemJS: any) => {
            // if(itemJS.userId==100021)
            itemJS.showNoMePlayPoker(172008);
        })

        setTimeout(() => {
            this.players.forEach((itemJS: any) => {
                itemJS.hideNoMePlayPoker();
            })
        }, 3000)
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