/**
 * 初始化游戏部分数据
 */
import Main from '../../common/Main';
import MyCenter from '../../common/MyCenter';
import showHandleBtns  from "../../Fuction/play/showHandleBtns/showHandleBtns";//玩家显示按钮
import step_x_showHandlePoker from '../../Fuction/play/step_x_showHandlePoker';//第x步(玩家操作的牌)
class step_2_startNewGame {
    start(JSthis:any,data:any):void{
        let meDealView:any = JSthis.owner.getChildByName('mePokerView');
        meDealView.removeChildren();
        let banker:any=JSthis.owner.getChildByName('banker');
        banker.visible=data.bankerUid==JSthis.userId?true:false;
        MyCenter.keep('bankerUid',data.bankerUid);
        MyCenter.keep('showHandle',false);
        MyCenter.keep('play',false);
        // MyCenter.keep('isAction',false);
        MyCenter.keep('playstage',null);
        MyCenter.keep('isMePlay',false);
        MyCenter.send('allowStealPoker',true);
        MyCenter.keep('allowStealPoker',true);
        //清除玩家显示的按钮
        showHandleBtns.hideAll({userId:Main.userInfo.userId});
        //清除玩家操作的牌的显示处
        step_x_showHandlePoker.hideAll();
    }
}
export default new step_2_startNewGame();