/**
 * 初始化游戏数据
 */
import Main from '../common/Main';
class InitGameData {
    /**初始化 */
    Init(seatObj: any, conObj: any) {
        seatObj.Index = conObj.Index;
        seatObj.SeatId = conObj.Index;
        // seatObj.IsMe = conObj.Index==0?true:false;
        //玩家位置的初始位置
        let startSeat = seatObj.owner;
        // setTimeout(()=>{
        conObj.owner.startSeatXY.push({ x: startSeat.x, y: startSeat.y });
        // },1000)
        //摸牌的位置
        let feelSeat = seatObj.owner.getChildByName('feelView');
        conObj.owner.startFeelSeatXY.push({ x: feelSeat.x, y: feelSeat.y });
        //发牌的位置
        let dealPokerSeat = conObj.owner.dealSeat;
        let dealPokerSeatXY = dealPokerSeat.parent.localToGlobal(new Laya.Point(dealPokerSeat.x, dealPokerSeat.y));
        conObj.owner.dealPokerSeatXY = { x: dealPokerSeatXY.x, y: dealPokerSeatXY.y };
        //摸牌的最初位置
        let feelPokerSeat = conObj.owner.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        let feelPokerSeatXY = feelPokerSeat.parent.localToGlobal(new Laya.Point(feelPokerSeat.x, feelPokerSeat.y));
        conObj.owner.feelPokerSeatXY = { x: feelPokerSeatXY.x, y: feelPokerSeatXY.y };
        //发其他玩家牌效果接受牌的位置
        // let getPokerSeat = seatObj.owner.getChildByName('getOtherPokerSeat');
        // let getPokerSeatXY = getPokerSeat.parent.localToGlobal(new Laya.Point(getPokerSeat.x, getPokerSeat.y));
        // seatObj.getOtherPokerSeat = { x: getPokerSeatXY.x, y: getPokerSeatXY.y };
        // //发玩家自己牌效果接受牌的位置
        // let getMePokerSeat = conObj.owner.getMePokerSeat;
        // let getMePokerSeatXY = getMePokerSeat.parent.localToGlobal(new Laya.Point(getMePokerSeat.x, getMePokerSeat.y));
        // conObj.owner.mePokerGetSeat = { x: getMePokerSeatXY.x, y: getMePokerSeatXY.y };

        //====================测试=================
        if (conObj.Index == 1 || conObj.Index == 2) {
            seatObj.userId = `12345${conObj.Index}`;
            seatObj.owner.getChildByName('head').visible = true;
            seatObj.owner.getChildByName('head').skin = 'res/img/common/defaultIcon.png';
            seatObj.owner.getChildByName('name').visible = true;
            seatObj.owner.getChildByName('name').text = `用户名${(conObj.Index + 1)}`;
            seatObj.owner.getChildByName('score').visible = true;
            seatObj.owner.getChildByName('score').text = parseInt(String(Math.random() * 100 + 100));
        }
    }
}
export default new InitGameData();