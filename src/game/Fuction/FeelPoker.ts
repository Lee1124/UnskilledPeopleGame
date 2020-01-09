/**
 * 摸牌功能
 */
import MyCenter from '../common/MyCenter';
import Main from '../common/Main';
class FeelPoker {
    //玩家
    players: any;
    //摸牌的开始位置
    feelStartSeatXY: any;
    //摸牌的样牌对象
    feelObj: any;
    //摸的牌
    feelPoker: any;
    feel(num: number): void {
        this.players = MyCenter.GameControlObj.players;
        this.feelStartSeatXY = MyCenter.GameUIObj.feelPokerSeatXY;
        this.feelObj = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        this.initParam(true);
        let data = {
            userId: '12345' + num,
            poker: parseInt(String(Math.random() * 21)) + 1
        }
        this.players.forEach((item, index) => {
            if (item.userId == data.userId) {
                console.log(item)
                this.moveFeelPoker(item, data);
            }
        });
    }

    /**
     * 摸牌的移动动效
     */
    moveFeelPoker(item: any, data: any): void {
        //摸后放入牌
        this.initParam2(item, data);
        let feelSeat = item.owner.getChildByName('feelView');
        let feelSeatXY = feelSeat.parent.localToGlobal(new Laya.Point(feelSeat.x, feelSeat.y));
        let moveX = (feelSeatXY.x - this.feelStartSeatXY.x) + feelSeat.width / 2;
        let moveY = (feelSeatXY.y - this.feelStartSeatXY.y) + feelSeat.height / 2;
        let alpha=item.IsMe?0:1;
        Laya.Tween.to(this.feelObj, { x: moveX, y: moveY, alpha: alpha }, Main.Speed['feelPoker'], null, Laya.Handler.create(this, () => {
            if (item.IsMe) {
                // Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                //     this.initParam(false);
                //     Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main.Speed['feelFan'])
                // }));
                this.initParam(true);
                Laya.Tween.to(this.feelObj, { scaleX: 0 ,alpha:1}, Main.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                    this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                    Laya.Tween.to(this.feelPoker, { scaleX: 1 }, Main.Speed['feelFan']);
                }));
            } else {
                Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                    this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                    this.initParam(false);
                    Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main.Speed['feelFan'])
                }));
            }
        }));
    }

    /**
     * 初始化数据
     * @param isShow 是否显示
     */
    initParam(isShow: boolean = true): void {
        this.feelObj.visible = isShow;
        this.feelObj.scale(1, 1);
        this.feelObj.pos(this.feelObj.width / 2, this.feelObj.height / 2);
    }

    /**
     * 初始化数据2
     */
    initParam2(item: any, data: any): void {
        let dealSeat_feelPoker = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        let feelView = item.IsMe ? MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards') : item.owner.getChildByName('feelView');
        feelView.visible = true;
        this.feelPoker = feelView.getChildByName('feelPoker');
        this.feelPoker.alpha = 0;
        this.feelPoker.skin = 'res/img/poker/chang/-1.png';
        dealSeat_feelPoker.skin = 'res/img/poker/chang/-1.png';
        this.feelPoker.scaleX = 1;
    }
}
export default new FeelPoker();