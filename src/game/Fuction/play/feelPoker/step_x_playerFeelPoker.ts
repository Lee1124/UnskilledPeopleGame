/**
 * 玩家摸牌功能
 */
import MyCenter from '../../../common/MyCenter';
import Main from '../../../common/Main';
class FeelPoker {
    //玩家
    players: any;
    //摸牌的开始位置
    feelStartSeatXY: any;
    //摸牌的样牌对象
    feelObj: any;
    //摸的牌
    feelPoker: any;
    /**===测试=== */
    // t1: any;
    // t2: any;
    /**===测试=== */

    /**
     * 玩家翻牌的显示
     * @param data 
     */
    show(data: any) {
        let players: any = MyCenter.GameControlObj.players;
        players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId)
                itemJS.playerFeel(data);
        });
    }
    /**
     * 玩家翻牌的隐藏
     * @param data 数据（主要包含userId）
     * @param isAll 是否全部隐藏
     */
    hide(data: any, isAll: boolean = false) {
        let players: any = MyCenter.GameControlObj.players;
        Main.$LOG('翻牌隐藏：',data)
        players.forEach((itemJS: any) => {
            // if(itemJS.userId==data.userId)
            //     itemJS.playerHideFeel(data);
            if (itemJS.userId == data.userId && !isAll) {
                Main.$LOG('翻牌隐藏2：',data.userId)
                itemJS.playerHideFeel();
            } else if (isAll) {
                itemJS.playerHideFeel();
            }
        });
    }

    /**
     * 玩家摸牌
     * @param that 执行域
     * @param data 数据
     */
    feel(that: any, data: any): void {
        this.players = MyCenter.GameControlObj.players;
        this.feelStartSeatXY = MyCenter.GameUIObj.feelPokerSeatXY;
        this.feelObj = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        this.initParam(true);
        this.moveFeelPoker(that, data);
    }

    /**
     * 隐藏翻的牌
     * @param that 
     */
    hideFeelPoker(that: any) {
        this.initParam2(that);
        if (that.IsMe) {
            let changeArr = [{ nodeName: that.owner, val: 0 }];
            Main.changeNodeZOrder(changeArr);
        }
    }

    /**
     * 摸牌的移动动效
     */
    moveFeelPoker(seatItem: any, data: any): void {
        //摸后放入牌
        this.initParam2(seatItem);
        let feelSeat = seatItem.owner.getChildByName('feelView');
        let feelSeatXY = feelSeat.parent.localToGlobal(new Laya.Point(feelSeat.x, feelSeat.y));
        let moveX = (feelSeatXY.x - this.feelStartSeatXY.x) + feelSeat.width / 2;
        let moveY = (feelSeatXY.y - this.feelStartSeatXY.y) + feelSeat.height / 2;
        // let alpha=item.IsMe?0:1;
        let alpha = 1;
        if (seatItem.IsMe) {
            let changeArr = [{ nodeName: seatItem.owner, val: 2 }];
            Main.changeNodeZOrder(changeArr);
        }
        Laya.Tween.to(this.feelObj, { x: moveX, y: moveY, alpha: alpha }, Main.Speed['feelPoker'], null, Laya.Handler.create(this, () => {
            let pokerName: any = parseInt(String(data.folpPoker / 10000));
            if (seatItem.IsMe) {
                Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                    // let pokerName:any=parseInt(String(data.poker/10000));
                    this.feelPoker.skin = 'res/img/poker/chang/' + pokerName + '.png';
                    this.initParam(false);
                    Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main.Speed['feelFan']);
                    /**====测试==== */
                    // if (this.t1)
                    //     clearTimeout(this.t1)
                    // this.t1 = setTimeout(() => {
                    //     this.clearFeelPoker();
                    // }, 1000)
                }));
                // this.initParam(true);
                // Laya.Tween.to(this.feelObj, { scaleX: 0 ,alpha:0.7}, Main.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                //     this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                //     Laya.Tween.to(this.feelPoker, { scaleX: 1 }, Main.Speed['feelFan']);
                // }));
            } else {
                Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                    this.feelPoker.skin = 'res/img/poker/chang/' + pokerName + '.png';
                    this.initParam(false);
                    Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main.Speed['feelFan'])
                    /**====测试==== */
                    // if (this.t2)
                    //     clearTimeout(this.t2)
                    // this.t2 = setTimeout(() => {
                    //     this.clearFeelPoker();
                    // }, 1000)
                }));
            }
        }));
    }

    /**
     * 初始化数据
     * @param isShow 是否显示
     */
    initParam(isShow: boolean = true): void {
        this.feelObj.alpha = 0;
        this.feelObj.scale(1, 1);
        this.feelObj.pos(this.feelObj.width / 2, this.feelObj.height / 2);
    }

    /**
     * 初始化数据2
     */
    initParam2(item: any): void {
        // let meFeelView = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards');
        let dealSeat_feelPoker = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        // let feelView = item.IsMe ? MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards') : item.owner.getChildByName('feelView');
        this.feelPoker = item.owner.getChildByName('feelView').getChildByName('feelPoker');
        this.feelPoker.alpha = 0;
        this.feelPoker.skin = 'res/img/poker/chang/-1.png';
        // dealSeat_feelPoker.skin = 'res/img/poker/chang/-1.png';
        // this.feelObj.scaleX=1;
    }
}
export default new FeelPoker();