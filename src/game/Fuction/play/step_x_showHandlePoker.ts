/**
 * 显示操作的牌
 */
import MyCenter from '../../common/MyCenter';
import Main from '../../common/Main';
// import DealOrPlayPoker from '../../Fuction/play/DealOrPlayPoker';
import showPlayerPokerCount from '../play/changePlayerNum/showPlayerPokerCount';//实时显示玩家牌的数量
enum showType {
    chi,
    pen,
    sha,
    tu
}
class step_x_showHandlePoker {
    //玩家操作展示的牌每行的索引
    rowIndex: number;
    //玩家操作展示的牌每列的索引
    cellIndex: number;
    show(that: any, data: any): void {
        let showData: any = data.concatData;
        //更新自己显示牌的数据
        if (that.IsMe)
            // DealOrPlayPoker.removeMePoker(data.removePokers);
            that.removePoker(data.removePokers);
        //开始显示操作后的牌
        if (that.userId == showData.userId) {
            this.showHandleView(that, showData);
        }
    }

    /**
     * 清除玩家操作的牌
     * @param that 
     */
    hide(that: any):void{
        let item:any=that;
        that.handlePokerArr=[];
        let handlePokerView = item.owner.getChildByName('show' + item.SeatId);
        handlePokerView.visible = false;
        handlePokerView._children=[];
    }

    /**
     * 全部清除
     */
    hideAll(){
        MyCenter.GameControlObj.players.forEach((itemJS: any) => {
            itemJS.clearHandlePoker();
        })
    }

    /**
     * 显示玩家剩余牌的数量
     * @param that 
     */
    showPokerNum(that: any){
        let value:any=20-(that.handlePokerArr.length)*3+1;
        console.log('显示玩家剩余牌的数量:'+that.userId,value,that.handlePokerArr)
        showPlayerPokerCount.show(that,true,value);
    }

    /**
     * 开始显示操作后的牌
     * @param that 座位组件
     * @param data 数据
     */
    showHandleView(that: any, data: any): void {
        let item: any = that;
        that.handlePokerArr = that.handlePokerArr.concat(data.data);
        this.showPokerNum(that);
        let handlePokerView = item.owner.getChildByName('show' + item.SeatId);
        // console.log('show-item.SeatId:','show'+item.SeatId)
        handlePokerView.visible = true;
        that.handlePokerArr.forEach((item3: any, index3: number) => {
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
            item3.data_inner.forEach((item4: any, index4: number) => {
                let cellPoker = new Laya.Image();
                cellPoker.visible = index4 <= 2 ? true : false;
                let pokerName: any = parseInt(String(item4 / 10000));
                cellPoker.skin = 'res/img/poker/duan/' + pokerName + '.png';
                cellPoker.name = 'poker' + (index4 + 1);
                cellPoker.zOrder = index4;
                cellPoker.size(Main.pokerWidth, Main.pokerWidth);
                cellPoker.pos(0, Main.pokerWidth * index4 - 45 * index4);
                cellPokerBox.addChild(cellPoker);
            })

            if(item3.type==showType.sha||item3.type==showType.tu){
                let signImg:any= new Laya.Image();
                signImg.skin='res/img/game/h_'+item3.type+'.jpg';
                signImg.size(cellPokerBox.width,300);
                signImg.zOrder=99;
                signImg.pos(0,0);
                signImg.alpha=0.8;
                cellPokerBox.addChild(signImg);
            }
            /**=====content===== */
        })
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
export default new step_x_showHandlePoker();