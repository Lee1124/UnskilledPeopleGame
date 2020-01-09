/**
 * 丢牌功能
 */
import MyCenter from '../common/MyCenter';
import Main from '../common/Main';
class DiuPoker {
    //玩家
    players: any;
    //玩家丢的牌每列的索引
    diuCellIndex: number;
    /**
     * 开启丢牌
     */
    open(data:any): void {
        this.players = MyCenter.GameControlObj.players;
        let diuPokerData =data;
        this.players.forEach((item, index) => {
            let diuView = item.owner.getChildByName('diu' + item.SeatId);
            diuView.visible = true;
            diuPokerData.forEach((item2, index2) => {
                if (item.userId == item2.userId) {
                    item2.data.forEach((item3, index3) => {
                        if (item.SeatId != 0 && index3 % 7 == 0) {
                            this.createDiuCell(index3, diuView, 7, item.SeatId);
                        } else if ((item.SeatId == 0 && index3 % 8 == 0)) {
                            this.createDiuCell(index3, diuView, 8, item.SeatId);
                        }
                        let pokerObj = new Laya.Image();
                        pokerObj.skin = 'res/img/poker/duan/' + item3 + '.png';
                        if (item.SeatId != 0 && ((index3 + 1) % 7 == 0 || index3 == item2.data.length - 1))
                            pokerObj.skin = 'res/img/poker/chang/' + item3 + '.png';
                        // else if (item.SeatId == 0 && ((index3 + 1) % 3 == 0 || index3 == item2.data.length - 1))
                        //     pokerObj.skin = 'res/img/poker/chang/' + item3 + '.png';

                        pokerObj.top = Main.pokerWidth * this.diuCellIndex - (45 * this.diuCellIndex);
                        // if(item.SeatId==1&&(index3<=9||index3>=5)){
                        //     console.log(pokerObj.y,this.diuCellIndex,pokerObj,index3 % 4)
                        // }
                        pokerObj.zOrder = this.diuCellIndex;
                        pokerObj.name = 'poker' + (index3 + 1);
                        let chidName = item.SeatId == 0 ? 'cellBox' + parseInt(String(index3 / 8)) : 'cellBox' + parseInt(String(index3 / 7));
                        let pokerCellViewObj = diuView.getChildByName(chidName);
                        if (pokerCellViewObj.name == chidName) {
                            pokerCellViewObj.addChild(pokerObj);
                        }
                        this.diuCellIndex++;
                    })
                }
            })
        });
    }

    /**
     * 创建'丢'容器中的列对象
     */
    createDiuCell(index: number, diuView: any, num: number, SeatId: any) {
        this.diuCellIndex = 0;
        let pokerBoxObj = new Laya.Image();
        pokerBoxObj.name = 'cellBox' + parseInt(String(index / num));
        pokerBoxObj.width = Main.pokerWidth;
        pokerBoxObj.x = SeatId == 1 ? Main.pokerWidth * parseInt(String(index / num)) : -Main.pokerWidth * parseInt(String(index / num));
        diuView.addChild(pokerBoxObj);
    }
}
export default new DiuPoker();
