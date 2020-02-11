/**
 * 选择开关功能
 */
export default class MySwitch extends Laya.Script {
     //回调函数
     callback:any = null;
     //回调执行函数
     callbackThis:any = null;
     //选择状态(false：关闭 true：打开)
     switchState:boolean = true;

    onEnable() {
        this.bindEvent();
        this.initSwitch(null, true);
    }
    /**
     * 初始化
     * @param {*} that 执行域
     * @param {*} isSelect 是否选中
     * @param {*} callback 回调函数
     */
    initSwitch(that:any, isSelect:boolean = true, callback?:any) {
        this.callbackThis = that;
        this.callback = callback;
        let yes:any = this.owner.getChildByName("yes");
        yes.visible = isSelect ? true : false;
    }

    bindEvent() {
        this.owner.on(Laya.Event.CLICK, this, this.clickSwitch)
    }

    clickSwitch(Event:any) {
        Event.stopPropagation();
        let yes:any = this.owner.getChildByName("yes");
        yes.visible = !yes.visible;
        this.switchState = yes.visible;
        if (this.callback)
            this.callback.call(this.callbackThis, this.switchState)
    }
}