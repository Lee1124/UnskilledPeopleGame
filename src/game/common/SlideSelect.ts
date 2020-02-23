/**
 * 滑动选择脚本
 * 该脚本实现根据初始值依次增加
 * 例如初始值：100 后面选择的值依次乘以倍数
 */
export default class SlideSelect extends Laya.Script {
    //初始值
    startValue: number;
    //增加的倍数
    addNum: number = 2;
    //选择的总格数
    slideAllNum: number = 6;
    //每段的距离
    space: number;
    //滑动按钮
    slideBtn: any;
    //获取最后的值的回调函数
    getEndValFn: Function;
    //执行域
    JSthis: any;
    onStart(): void {
        this.slideBtn = this.owner.getChildByName('slider_btn');
        this.registerEvent();
    }
    /**
     * 注册事件
     */
    registerEvent(): void {
        this.slideBtn.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
    }
    /**
   * 按下事件
   */
    onMouseDown(): void {
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
    }

    /**
   * 移动事件
   */
    onMouseMove(): void {
        this.slideBtn.x = Math.max(Math.min(this.owner['mouseX'], this.owner['width']), 0);
        let endVal:number=(parseInt(String(this.slideBtn.x / this.space))+1)*this.startValue;
        if (this.getEndValFn)
            this.getEndValFn.call(this.JSthis, endVal)
    }
    onMouseUp() {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
    }
    
    /**
     * 滑动选择初始化
     * @param startVal 初始值
     * @param addNum 增加的倍数
     * @param slideAllNum 选择的总格数
     * @param JSthis 执行域
     * @param getEndValFn 获取最后的值的回调函数
     */
    init(startVal: number, addNum: number = 2, slideAllNum: number = 6, JSthis: any, getEndValFn?: Function): void {
        if (getEndValFn)
            this.getEndValFn = getEndValFn;
        this.JSthis=JSthis;
        this.startValue = startVal;
        this.addNum = addNum ? addNum : 2;
        this.slideAllNum = slideAllNum ? slideAllNum : 6;
        this.slideBtn.x = 0;
        this.space = this.owner['width'] / (this.slideAllNum - 1);
    }
}