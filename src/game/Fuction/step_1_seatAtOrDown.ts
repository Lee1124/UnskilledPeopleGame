import Main from "../common/Main";
import MyCenter from '../common/MyCenter';
import OpenDiaLog from '../Fuction/OpenDiaLog';
import SlideSeledct from '../common/SlideSelect';
import HTTP from '../common/HttpRequest';
import websoket from '../Fuction/webSoketSend';
/**
 * 玩家占位功能
 */
class step_1_seatAtOrDown {
    flag1: boolean = true;
    //可用积分
    useScore: number;
    //带入积分
    dairuScore: number;
    //所占位置seatId
    seatIndex: number;
    /**
     * 占座设置
     * @param thisPlayer 玩家脚本
     * @param data 数据
     */
    playerSeatAtSet(thisPlayer: any, data: any) {
        // console.log('playerSeatAt', data)
        this.seatIndex = data.seatidx;
        let isMe: boolean = data.userId == Main.userInfo.userId ? true : false;
        let userId: number = data.userId;
        let nameShow: boolean = data.userId == Main.userInfo.userId ? false : true;
        let nameText: string = data.userId == Main.userInfo.userId ? '' : data.name;
        thisPlayer.seatAtlastTime = data.seatAtTime - Main.getTimeChuo();//占座剩余时间
        if (thisPlayer.seatAtlastTime > data.totalTime) {
            thisPlayer.seatAtlastTime = data.totalTime;
        }
        let scoreText: string = `等待${thisPlayer.seatAtlastTime}s`;
        Laya.timer.loop(1000, thisPlayer, thisPlayer.palyerSeatAtTime);
        this.commonSet(thisPlayer, userId, isMe, nameShow, nameText, true, scoreText, true, data.head);
        if (data.userId == Main.userInfo.userId)
            this.diaLogState(true, thisPlayer);
    }

    /**
     * 弹框的状态
     * @param show 是否显示
     * @param thisPlayer 玩家脚本
     */
    diaLogState(show: boolean = true, thisPlayer: any): void {
        let makeUpBOBO: any = MyCenter.GameControlObj.owner['makeUpCoin'].getComponent(OpenDiaLog);
        let slideJS: any = MyCenter.GameControlObj.owner['makeUpCoin'].getChildByName('sliderView').getComponent(SlideSeledct);
        switch (show) {
            case true:
                this.openedMakeUpCoin();
                this.flag1 = true;
                makeUpBOBO.init(1, 0, this, () => {
                    this.registerEvent();
                }, () => {
                    this.closeEvent();
                    if (this.flag1&&thisPlayer) {
                        Laya.timer.clear(thisPlayer, thisPlayer.palyerSeatAtTime);
                        websoket.playerSeatUpSend();
                    }
                }, () => {
                    //滑动选择初始化
                    slideJS.init(this.dairuScore, 2, 6, this, (val: number) => {
                        this.dairuScoreFn(val)
                    });
                    //打开补充钵钵弹框
                    makeUpBOBO.open();
                });
                break;
            case false:
                makeUpBOBO.close();
                break;
        }

    }

    /**
     * 起立设置
     * @param thisPlayer 玩家脚本
     * @param data 数据
     */
    playerSeatUpSet(thisPlayer: any, data: any): void {
        this.commonSet(thisPlayer, null, false, false, '', false, '', false, '');
        if (data.userId == Main.userInfo.userId) {
            this.flag1 = false;
            this.diaLogState(false, thisPlayer);
        }
    }

    //公用设置
    commonSet(thisPlayer: any, userId: number, isMe: boolean, nameShow: boolean, nameText: string, scoreShow: boolean, scoreText: string, headShow: boolean, headUrl: string): void {
        thisPlayer.IsMe = isMe;
        thisPlayer.userId = userId;
        //name
        let headName: any = thisPlayer.owner.getChildByName('name');
        headName.visible = nameShow;
        headName.text = nameText;
        //积分
        let scoreBox: any = thisPlayer.owner.getChildByName('score');
        scoreBox.visible = scoreShow;
        scoreBox.text = scoreText;
        //头像
        let head: any = thisPlayer.owner.getChildByName('head');
        head.visible = headShow;
        Main.$LoadImage(head, headUrl, Main.defaultData.head1, 'skin');
        //留坐标志设置
        let liuzuoView: any = thisPlayer.owner.getChildByName('liuzuo');
        liuzuoView.visible=false;
    }

    /**
     * 带入坐下设置
     */
    playerSeatDownSet(thisPlayer: any, data: any): void {
        Laya.timer.clear(thisPlayer, thisPlayer.palyerSeatAtTime);
        thisPlayer.IsMe = data.userId == Main.userInfo.userId ? true : false;
        thisPlayer.userId = data.userId;
        let scoreBox: any = thisPlayer.owner.getChildByName('score');
        scoreBox.visible = true;
        scoreBox.text = data.score;
        if (data.userId == Main.userInfo.userId) {
            this.flag1 = false;
            this.diaLogState(false, thisPlayer);
        }
    }
    /**
    * 坐下设置(之前带入过)
    */
    playerSeatDown2Set(thisPlayer: any, data: any): void {
        Laya.timer.clear(thisPlayer, thisPlayer.palyerSeatAtTime);
        let isMe: boolean = data.userId == Main.userInfo.userId ? true : false;
        let userId: number = data.userId;
        let nameShow: boolean = data.userId == Main.userInfo.userId ? false : true;
        let nameText: string = data.userId == Main.userInfo.userId ? '' : data.name;
        let scoreText: string = data.score;
        this.commonSet(thisPlayer, userId, isMe, nameShow, nameText, true, scoreText, true, data.head);
    }


    /**
     * 打开补充钵钵弹框，初始化数据
     */
    openedMakeUpCoin(): void {
        this.getPlayerUsableScore(() => {
            let useScoreBox: any = MyCenter.GameControlObj.owner.bobo_trueScore;
            useScoreBox.text = this.useScore;
        });
        let IDBox: any = MyCenter.GameControlObj.owner.bobo_ID;
        IDBox.text = Main.userInfo.userId;
        let startdairuScore: number = MyCenter.GameControlObj.GameNews?MyCenter.GameControlObj.GameNews.option.dairu:0;
        this.dairuScoreFn(startdairuScore);
    }

    dairuScoreFn(dairuScore: number) {
        let dairujifenBox: any = MyCenter.GameControlObj.owner.bobo_daiRuScore;
        dairujifenBox.text = dairuScore;
        let fuwufeiBox: any = MyCenter.GameControlObj.owner.bobo_fuwufei;
        fuwufeiBox.text = dairujifenBox.text * (1 / 10);
        this.dairuScore = dairujifenBox.text;
    }

    /**
   * 请求获取玩家的可用积分等信息
   */
    getPlayerUsableScore(fn: Function): void {
        let that = this;
        HTTP.$request({
            that: this,
            url: '/M.User/GetInfo',
            data: {
                uid: Main.userInfo.userId,
                // tuid: Main.userInfo.userId
            },
            success(res: any) {
                if (res.data.ret.type == 0) {
                    that.useScore = res.data.score;
                    fn.call(that);
                } else {
                    Main.showTip(res.data.ret.msg);
                }
            },
            fail() {
            }
        })
    }

    /**
     * 打开弹框注册事件
     */
    registerEvent(): void {
        let dairuBtn: any = MyCenter.GameControlObj.owner.makeUpCoin.getChildByName('confirmDaiRuBtn');
        dairuBtn.on(Laya.Event.CLICK, this, () => {
            websoket.comfirmIntoScore(this.seatIndex, this.dairuScore);
        })
    }
    /**
     * 关闭弹框去除事件
     */
    closeEvent(): void {
        let dairuBtn: any = MyCenter.GameControlObj.owner.makeUpCoin.getChildByName('confirmDaiRuBtn');
        dairuBtn.off(Laya.Event.CLICK);
    }
}

export default new step_1_seatAtOrDown();