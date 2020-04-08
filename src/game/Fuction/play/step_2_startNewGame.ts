/**
 * 初始化游戏部分数据
 */
import Main from '../../common/Main';
import MyCenter from '../../common/MyCenter';
class step_2_startNewGame {
    start(JSthis:any,data:any):void{
        let meDealView:any = JSthis.owner.getChildByName('mePokerView');
        meDealView.removeChildren();
        let banker:any=JSthis.owner.getChildByName('banker');
        banker.visible=data.bankerUid==JSthis.userId?true:false;
        MyCenter.keep('bankerUid',data.bankerUid);
        MyCenter.keep('showHandle',false);
        MyCenter.keep('play',false);
        MyCenter.keep('isAction',false);
        //清除玩家显示的按钮
        MyCenter.GameControlObj.showHandle({userId:Main.userInfo.userId},[]);
        //清除玩家操作的牌的显示处
        MyCenter.GameControlObj.clearHandlePoker();
    }
}
export default new step_2_startNewGame();