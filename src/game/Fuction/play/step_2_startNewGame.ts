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
    }
}
export default new step_2_startNewGame();