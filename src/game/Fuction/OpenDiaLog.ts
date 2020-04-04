import Main from "../common/Main";

/**
 * 弹框脚本（打开或关闭）
 * 使用方法：
 * let makeUpBOBO:any=this.owner['makeUpCoin'].getComponent(OpenDiaLog);
        makeUpBOBO.init(1,0,this,()=>{
            console.log('打开了')
        },()=>{
            console.log('关闭了')
        },()=>{
            makeUpBOBO.open();
        });
 */
export default class OpenDiaLog extends Laya.Script {
    //开关
    flag: boolean = true;
    //打开方式(1.从上到下，2.从下到上)
    openType: number = 1;
    //打开弹框的速度(单位：ms)
    openSpeed: number = 200;
    //弹框view
    dialogView: any;
    //mask遮罩层
    dialogMask: any;
    //打开的回调
    openFn: Function;
    //关闭的回调
    closeFn: Function;
    //执行域
    JSthis: any;
    onStart(): void {
        this.init();
    }
    /**
     * 初始化
     * @param type 打开方式(1.从上到下，2.从下到上,3.到上滑倒上面顶部,4.到下滑倒下面顶部)
     * @param opacity 遮罩透明度
     * @param JSthis 执行域
     * @param openFn 打开回调
     * @param closeFn 关闭回调
     * @param endFn 初始化结束回调
     *  */
    init(type: number = 1, opacity: number = 0, JSthis?: any, openFn?: Function, closeFn?: Function, endFn?: Function): void {
        this.JSthis = JSthis;
        this.openFn = openFn;
        this.closeFn = closeFn;
        this.dialogView = this.owner.scene.dialogView;
        this.dialogMask = this.owner.scene.dialogMask;
        this.dialogMask.alpha = opacity;
        this.openType = type;
        this.owner['visible'] = false;
        switch (this.openType) {
            case 1:
                this.owner['y'] = -this.owner['height'];
                break;
            case 2:
                this.owner['y'] = Laya.stage.height;
                break;
            case 3:
                this.owner['y'] = -this.owner['height'];
                break;
            case 4:
                this.owner['y'] = Laya.stage.height;
                break;
        }
        if (endFn)
            endFn.call(JSthis);
    }
    /**打开 */
    open(): void {
        this.registerEvent();
        this.dialogView.visible = true;
        this.dialogMask.visible = true;
        let $y: any;
        switch (this.openType) {
            case 1:
                $y = (Laya.stage.height - this.owner['height']) / 2;
                break;
            case 2:
                $y = (Laya.stage.height - this.owner['height']) / 2;
                break;
            case 3:
                $y = 0 ;//+ Main.phoneNews.statusHeight;
                break;
            case 4:
                $y = Laya.stage.height - this.owner['height'];
                break;
        }
        this.owner['visible'] = true;
        Laya.Tween.to(this.owner, { y: $y }, this.openSpeed, null, Laya.Handler.create(this, () => {
            if (this.openFn)
                this.openFn.call(this.JSthis);
        }));
    }
    /**关闭 */
    close(onlyColseSelf: boolean = false): void {
        let $y: any;
        switch (this.openType) {
            case 1:
                $y = -this.owner['height'];
                break;
            case 2:
                $y = Laya.stage.height;
                break;
            case 3:
                $y = -this.owner['height'];
                break;
            case 4:
                $y = Laya.stage.height;
                break;
        }
        if (this.owner['visible'])
            Laya.Tween.to(this.owner, { y: $y }, this.openSpeed, null, Laya.Handler.create(this, () => {
                this.owner['visible'] = false;
                if (!onlyColseSelf) {//如果为false
                    this.dialogMask.visible = false;
                    this.dialogView.visible = false;
                    this.dialogMask.off(Laya.Event.CLICK);
                }
                if (this.closeFn)
                    this.closeFn.call(this.JSthis);
            }));
    }

    /**注册事件 */
    registerEvent(): void {
        this.dialogMask.off(Laya.Event.CLICK);
        this.dialogMask.on(Laya.Event.CLICK, this, this.close, [false]);
    }
}