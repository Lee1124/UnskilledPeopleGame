/**
 * 显示操作的牌
 */
import MyCenter from '../common/MyCenter';
import Main from '../common/Main';
class ShowHanldePoker {
    //玩家
    players: any;
    //玩家操作展示的牌每行的索引
    rowIndex: number;
    //玩家操作展示的牌每列的索引
    cellIndex: number;
    open(): void {
        this.players = MyCenter.GameControlObj.players;
        let showData = [
            { userId: 123450, data: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }] },
            { userId: 123451, data: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }] },
            { userId: 123452, data: [{ data: [1, 1, 1] },{ data: [1, 1, 1] }] }
        ]
        this.players.forEach((item, index) => {
            let handlePokerView = item.owner.getChildByName('show' + item.SeatId);
            handlePokerView.visible = true;
            showData.forEach((item2, index2) => {
                if (item.userId == item2.userId) {
                    item2.data.forEach((item3, index3) => {
                        this.cellIndex = index3;
                        
                        /**=====row===== */
                        if (item.SeatId == 0 && index3 % 5 == 0) {
                            this.createRowFn(item.SeatId, index3, handlePokerView);
                        } else if (item.SeatId != 0 && index3 % 4 == 0) {
                            this.createRowFn(item.SeatId, index3, handlePokerView);
                        }
                        /**=====row===== */                       

                        /**=====cell===== */
                        let cellPokerBox = new Laya.Image();
                        cellPokerBox.name = item.SeatId == 0 ? 'cellBox' + parseInt(String(index3 / 5)) : 'cellBox' + parseInt(String(index3 / 4));
                        cellPokerBox.width = Main.pokerWidth;
                        let cellPokerBoxX = Main.pokerWidth * this.cellIndex;
                        if (item.SeatId == 0 && Main.pokerWidth * this.cellIndex >= 640) {
                            cellPokerBoxX = Main.pokerWidth * this.cellIndex - 640;
                        } else if (item.SeatId != 0 && Main.pokerWidth * this.cellIndex >= 512) {
                            cellPokerBoxX = Main.pokerWidth * this.cellIndex - 512;
                        }
                        cellPokerBox.pos(cellPokerBoxX, 0);
                        let rowBoxName = item.SeatId == 0 ? 'row' + parseInt(String(index3 / 5)) : 'row' + parseInt(String(index3 / 4));
                        let rowBox = handlePokerView.getChildByName(rowBoxName);
                        rowBox.width = Main.pokerWidth + Main.pokerWidth * this.cellIndex;
                        if (item.SeatId != 0 && parseInt(String(index3 / 4)) > 0) {
                            rowBox.width = Main.pokerWidth * 4;
                        }
                        rowBox.addChild(cellPokerBox);
                        /**=====cell===== */

                        /**=====content===== */
                        item3.data.forEach((item4, index4) => {
                            let cellPoker = new Laya.Image();
                            cellPoker.visible = index4 <= 2 ? true : false;
                            cellPoker.skin = 'res/img/poker/duan/' + item4 + '.png';
                            cellPoker.name = 'poker' + (index4 + 1);
                            cellPoker.zOrder = index4;
                            cellPoker.size(Main.pokerWidth, Main.pokerWidth);
                            cellPoker.pos(0, Main.pokerWidth * index4 - 45 * index4);
                            cellPokerBox.addChild(cellPoker);
                        })
                        /**=====content===== */
                    })
                }
            })
        });
    }

    /**
     * 创建行(公用)
     * @param index3 索引
     * @param handlePokerView 最大盒子对象
     */
    createRowFn(SeatId: number, index3: number, handlePokerView: any): void {
        this.cellIndex = 0;
        let rowBox = new Laya.Image();
        rowBox.name = SeatId == 0 ? 'row' + parseInt(String(index3 / 5)) : 'row' + parseInt(String(index3 / 4));
        let posY = SeatId == 0 ? 310 * parseInt(String(index3 / 5)) : 310 * parseInt(String(index3 / 4));
        rowBox.pos(0, posY);
        if (SeatId == 1) {
            rowBox.centerX = -10;
        } else if (SeatId == 2) {
            rowBox.centerX = 10;
        }
        handlePokerView.addChild(rowBox);
    }
}
export default new ShowHanldePoker();