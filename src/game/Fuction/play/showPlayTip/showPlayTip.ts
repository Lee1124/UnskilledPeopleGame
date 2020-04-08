/**
 * 显示玩家的出牌提示(只有自己才能看见)
 */
import MyCenter from '../../../common/MyCenter';
class showPlayTip{
    show(that:any,show:boolean){
        if(that.IsMe){
            let tip:any=MyCenter.GameUIObj.mePlayTip;
            tip.zOrder=99;
            tip.visible=show;
        }
    }
}
export default new showPlayTip();