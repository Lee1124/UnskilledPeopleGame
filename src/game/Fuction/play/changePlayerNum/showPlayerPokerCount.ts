/**
 * 显示玩家牌的数量
 */
class showPlayerPokerCount{
    /**
     * 
     * @param that 玩家脚本
     * @param show 是否显示
     * @param value 值
     */
    show(that:any,show:boolean,value:number){
        let pokerCount:any=that.owner.getChildByName('pokerCount');
        pokerCount.visible=show;
        let val:any=pokerCount.getChildByName('val');
        val.text=show?value:0;
        that.pokerCount=value;
    }
}

export default new showPlayerPokerCount();