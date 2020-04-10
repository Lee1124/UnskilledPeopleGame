/**
 * ‘我’出牌
 */
import MyCenter from '../../../common/MyCenter';
import Main from '../../../common/Main';
class mePlay {
    /**
     * 手动出牌
     * @param pokerObj 
     */
    play(pokerObj: any) {
        let pokerObjSeatXY = pokerObj.parent.localToGlobal(new Laya.Point(pokerObj.x, pokerObj.y));
        let showMePlayPoker = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        let showMePlayPokerXY = showMePlayPoker.parent.localToGlobal(new Laya.Point(showMePlayPoker.x, showMePlayPoker.y));
        let startX = pokerObjSeatXY.x - showMePlayPokerXY.x + showMePlayPoker.width;
        let startY = pokerObjSeatXY.y - showMePlayPokerXY.y + showMePlayPoker.height / 2;
        showMePlayPoker.pos(startX, startY);
        showMePlayPoker.skin = 'res/img/poker/chang/' + pokerObj.name.type + '.png';
        Laya.Tween.to(showMePlayPoker, { alpha: 1, x: showMePlayPoker.width / 2, y: showMePlayPoker.height / 2 }, Main.Speed['mePlay']);
    }

    /**
     * 自动出牌
     */
    autoPlay(data: any) {
        let players: any = MyCenter.GameControlObj.players;
        players.forEach((itemJS: any) => {
            if (itemJS.IsMe && data.userId == itemJS.userId) {
                let mePokerView: any = itemJS.owner.getChildByName('mePokerView');
                console.log(mePokerView, mePokerView._children)
                mePokerView._children.forEach((item1: any) => {
                    let item1Childs: any = item1._children;
                    for (let i = item1Childs.length - 1; i >= 0; i--) {
                        if (item1Childs[i].name.oldName == data.poker) {
                            let pokerObj:any=item1Childs[i];
                            this.play(pokerObj);
                            itemJS.removePoker([data.poker]);
                            break;
                        }
                    }
                });
               
            }
        });
    }
}

export default new mePlay();