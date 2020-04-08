/**
 * 非自己玩家的出牌
 */
import Main from '../../../common/Main';
import showPlayerPokerCount from '../../play/changePlayerNum/showPlayerPokerCount';//实时显示玩家牌的数量
class otherPlay {
    startX:number;
    startY:number;
   /**
    * 其他玩家出牌的效果
    * @param that 玩家脚本对象
    * @param pokerNum 出的牌
    */
    play(that: any, pokerNum: number): void {
        let item: any = that;
        showPlayerPokerCount.show(item,true,that.pokerCount-1);
        let poker: any = parseInt(String(pokerNum / 10000));
        let playPokerSeatFeelView = item.owner.getChildByName('feelView');
        let playPokerSeat = playPokerSeatFeelView.getChildByName('feelPoker');
        let playPokerSeatXY = playPokerSeat.parent.localToGlobal(new Laya.Point(playPokerSeat.x, playPokerSeat.y));
        let playerSeat = item.owner;
        let playerSeatXY = playerSeat.parent.localToGlobal(new Laya.Point(playerSeat.x, playerSeat.y));
        this.startX = playerSeatXY.x - playPokerSeatXY.x;
        this.startY = playerSeatXY.y - playPokerSeatXY.y;
        this.initOtherPlay(true, this.startX, this.startY, 1, 1, 1, playPokerSeatFeelView, playPokerSeat);
        Laya.Tween.to(playPokerSeat, { centerX: 0, centerY: 0, alpha: Main.pokerParam['alpha'] }, Main.Speed['otherPlay'], null, Laya.Handler.create(this, () => {
            Laya.Tween.to(playPokerSeat, { scaleX: 0 }, Main.Speed['otherPlay'] / 2, null, Laya.Handler.create(this, () => {
                playPokerSeat.skin = 'res/img/poker/chang/' + poker + '.png';
                Laya.Tween.to(playPokerSeat, { scaleX: 1 }, Main.Speed['otherPlay'] / 2);
            }))
        }))
    }

    /**
     * 其他玩家还原出牌的效果
     * @param that 
     */
    hidePlay(that: any){
        let playPokerSeatFeelView = that.owner.getChildByName('feelView');
        let playPokerSeat = playPokerSeatFeelView.getChildByName('feelPoker');
        this.initOtherPlay(true, 0, 0, 0, 0, 0, playPokerSeatFeelView, playPokerSeat);
    }
    /**
     * 初始化其他玩家出牌对象
     */
    initOtherPlay(isShow: boolean, centerX: number, centerY: number, scaleX: number, scaleY: number, alpha: number, playPokerParent: any, playPoker: any) {
        playPokerParent.visible = isShow;
        playPoker.centerX = centerX;
        playPoker.centerY = centerY;
        playPoker.scale(scaleX, scaleY);
        playPoker.alpha = alpha;
        playPoker.skin = 'res/img/poker/chang/-1.png';
    }
}

export default new otherPlay();