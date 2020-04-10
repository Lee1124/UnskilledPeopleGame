/**
 * 切换位置
 *  */
import MyCenter from '../common/MyCenter';
import Main from '../common/Main';
import websoket from '../Fuction/webSoketSend';
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
        let that = this;
        this.selectSeatIndex = thisObj.Index;
        this.selectSeatId = thisObj.SeatId;
        this.seatIndexArr = [0, 1, 2];
        this.playerSeatArr = MyCenter.GameControlObj.players;
        this.playerSeatXYArr = MyCenter.GameUIObj.startSeatXY;
        this.playerFeelSeatXYArr = MyCenter.GameUIObj.startFeelSeatXY;
        console.log(this.playerSeatArr)
        if (thisObj.userId == '' || !thisObj.userId) {
            websoket.seatAt(thisObj.Index,this,(res:any)=>{
                if (res.ret.type == 0) {
                    //选中时预设的位置索引重新排序
                    let NewSeatIndexArr = that.seatIndexArr.splice(that.selectSeatIndex, that.seatIndexArr.length).concat(that.seatIndexArr.splice(0, that.selectSeatIndex + 1));
                    // console.log(NewSeatIndexArr)
                    NewSeatIndexArr.forEach((item: number, index: number) => {
                        // that.playerSeatArr[index].IsMe = false;
                        that.playerSeatArr[item].SeatId = index;
                        Laya.Tween.to(that.playerSeatArr[item].owner, { x: that.playerSeatXYArr[index].x, y: that.playerSeatXYArr[index].y }, Main.Speed['changeSeat']);
                        that.changeSeatNodeParam(that.playerSeatArr[item].owner, index);
                    })
                }
            });
            // MyCenter.GameControlObj.onSend({
            //     name: 'M.Room.C2R_SeatAt',
            //     data: {
            //         roomid: MyCenter.GameControlObj.roomId,
            //         idx: thisObj.SeatId
            //     },
            //     success(res: any) {
            //         MyCenter.GameControlObj.dealSoketMessage('占位：', res)
            //         if (res.ret.type == 0) {
            //             //选中时预设的位置索引重新排序
            //             let NewSeatIndexArr = that.seatIndexArr.splice(that.selectSeatIndex, that.seatIndexArr.length).concat(that.seatIndexArr.splice(0, that.selectSeatIndex + 1));
            //             NewSeatIndexArr.forEach((item: number, index: number) => {
            //                 that.playerSeatArr[index].IsMe = false;
            //                 that.playerSeatArr[item].SeatId = index;
            //                 // this.playerSeatArr[item].userId = `12345${index}`;
            //                 Laya.Tween.to(that.playerSeatArr[item].owner, { x: that.playerSeatXYArr[index].x, y: that.playerSeatXYArr[index].y }, Main.Speed['changeSeat']);
            //                 that.changeSeatNodeParam(that.playerSeatArr[item].owner, index);
            //             })
            //         }
            //         // thisObj.IsMe = true;
            //     }
            // })
        }

    }

    setSeatContent(seatObj: any) {
        // seatObj.owner.getChildByName('head').visible = true;
        // seatObj.owner.getChildByName('head').skin = 'res/img/common/defaultHead.png';
        // seatObj.owner.getChildByName('name').visible = true;
        // seatObj.owner.getChildByName('name').text = `用户名-0`;
        // seatObj.owner.getChildByName('score').visible = true;
        // seatObj.owner.getChildByName('score').text = parseInt(String(Math.random() * 100 + 100));
    }

    /**
     * 修改位置下的参数
     */
    changeSeatNodeParam(seatObj: any, index: number) {
        console.log('进来===========================修改位置下的参数')
        //重置摸牌的位置
        let feelPokerNode = seatObj.getChildByName('feelView');
        feelPokerNode.pos(this.playerFeelSeatXYArr[index].x, this.playerFeelSeatXYArr[index].y);
        //玩家播放动画的位置
        // let handleAniSeat = seatObj.getChildByName('handleAniBox');
        // let handleAniSeatXY=MyCenter.getKeep('handleAniSeat');
        // handleAniSeat.pos(handleAniSeatXY[index].x, handleAniSeatXY[index].y);
    }
}
export default new ChangeSeat();