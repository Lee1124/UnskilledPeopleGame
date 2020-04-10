/**
 * 显示玩家的出牌提示(只有自己才能看见)
 */
import MyCenter from '../../../common/MyCenter';
class showPlayTip{
    /**
     * 显示该我打牌提示
     * @param data 数据 {userId:xxxxxx}
     * @param isShow 是否显示
     */
    show(data:any,isShow:boolean=true){
        let players:any=MyCenter.GameControlObj.players;
        players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId) {
                itemJS.showPlayTip(isShow);
            }
        })
    }
    hide(data:any){
        this.show(data,false);
    }
    showOrHide(that:any,show:boolean){
        if(that.IsMe){
            let tip:any=MyCenter.GameUIObj.mePlayTip;
            tip.zOrder=99;
            tip.visible=show;
        }
    }
}
export default new showPlayTip();