/**
 * 该脚本是设置节点的bottom值，根据屏幕的高度
 * stage高度<=2210 时根据比率来设置bottom值
 * stage高度>2210 时bottom值设为‘auto’。
 */
 export default class SetNodeB extends Laya.Script{
    onEnable(){
        let myHeight:number=2210;
        let view:any=this.owner;
        let stageHeight:number=Laya.stage.height;
        let myHeightRate:number=myHeight/stageHeight;
        view.bottom=(stageHeight<=myHeight)?(view.bottom/myHeightRate):'auto';
     }
 }