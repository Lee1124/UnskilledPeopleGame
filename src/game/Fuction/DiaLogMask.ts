/**
 * 游戏中的弹框mask脚本
 */
export default class DiaLogMask extends Laya.Script{
    onStart():void{
        this.registerEvent();
    }
    /**注册事件 */
    registerEvent():void{
        this.owner.on(Laya.Event.CLICK,this,this.clickMask)
    }

    clickMask():void{
        this.owner['visible']=false;
        console.log('点击遮罩')
    }
}