/**
 * 切换位置
 *  */
import MyCenter from '../common/MyCenter';
import Main from '../common/Main';
class ChangeSeat {
    //预设的位置索引
    seatIndexArr: number[] = [0, 1, 2];
    //选中位置索引
    selectSeatIndex: any = null;
    //选中位置id
    selectSeatId: any = null;
    //玩家位置对象数组
    playerSeatArr: any[];
    //玩家位置坐标数组
    playerSeatXYArr: any[];
    //玩家摸牌坐标数组
    playerFeelSeatXYArr: any[];
    change(CLICKOBJ: any, thisObj: any) {
        this.selectSeatIndex = thisObj.Index;
        this.selectSeatId = thisObj.SeatId;
        this.seatIndexArr = [0, 1, 2];
        this.playerSeatArr = MyCenter.GameControlObj.players;
        this.playerSeatXYArr = MyCenter.GameUIObj.startSeatXY;
        this.playerFeelSeatXYArr = MyCenter.GameUIObj.startFeelSeatXY;
        // console.log(MyCenter.GameUIObj)
        // console.log(thisObj.Index,thisObj.SeatId,this.playerSeatArr)
        //选中时预设的位置索引重新排序
        let NewSeatIndexArr = this.seatIndexArr.splice(this.selectSeatIndex, this.seatIndexArr.length).concat(this.seatIndexArr.splice(0, this.selectSeatIndex + 1));
        this.setSeatContent(thisObj);
        NewSeatIndexArr.forEach((item: number, index: number) => {
            this.playerSeatArr[index].IsMe = false;
            this.playerSeatArr[item].SeatId = index;
            this.playerSeatArr[item].userId = `12345${index}`;
            Laya.Tween.to(this.playerSeatArr[item].owner, { x: this.playerSeatXYArr[index].x, y: this.playerSeatXYArr[index].y }, Main.Speed['changeSeat']);
            this.changeSeatNodeParam(this.playerSeatArr[item].owner, index);
        })
        thisObj.IsMe = true;
    }

    setSeatContent(seatObj: any) {
        seatObj.owner.getChildByName('head').visible = true;
        seatObj.owner.getChildByName('head').skin = 'res/img/common/defaultIcon.png';
        seatObj.owner.getChildByName('name').visible = true;
        seatObj.owner.getChildByName('name').text = `用户名-0`;
        seatObj.owner.getChildByName('score').visible = true;
        seatObj.owner.getChildByName('score').text = parseInt(String(Math.random() * 100 + 100));
    }

    /**
     * 修改位置下的参数
     */
    changeSeatNodeParam(seatObj: any, index: number) {
        //重置摸牌的位置
        let feelPokerNode = seatObj.getChildByName('feelView');
        feelPokerNode.pos(this.playerFeelSeatXYArr[index].x, this.playerFeelSeatXYArr[index].y);
    }
}
export default new ChangeSeat();