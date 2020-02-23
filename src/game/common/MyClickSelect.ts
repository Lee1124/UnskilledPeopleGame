/**
 * 该脚本为点击选中功能
 */
export default class MyClickSelect extends Laya.Script {
    //列表
    list:any;
    //回调函数
    returnFn:Function;
    //执行域
    thisJS:any;
    onEnable() {
        this.bindEvent();
        this.init();
    }

    bindEvent() {
        this.list = this.owner.getChildByName("selectList");
        this.list.cells.forEach((item:any) => {
            let $select = item.getChildByName("listRow").getChildByName("select");
            $select.on(Laya.Event.CLICK, this, this.clickSelectBox, [$select, item]);
        });
    }

    clearAllSelect() {
        this.list.cells.forEach((item:any) => {
            let $yes = item.getChildByName("listRow").getChildByName("select").getChildByName("yes");
            $yes.visible = false;
        });
    }
    clickSelectBox(selectBox:any, cell:any) {
        this.clearAllSelect();
        let yes = selectBox.getChildByName("yes");
        yes.visible = !yes.visible;
        if (this.returnFn)
            this.returnFn.call(this.thisJS, cell.dataSource.value);
    }
    init(isSelectIndex:number = 0) {
        this.clearAllSelect();
        this.list.cells.forEach((item:any, index:number) => {
            if (index == isSelectIndex) {
                let $yes = item.getChildByName("listRow").getChildByName("select").getChildByName("yes");
                $yes.visible = true;
            }
        });
    }
    /**
     * @param {*} that 执行域
     * @param {*} isSelectIndex 选中下标 默认为下标为0的
     * @param {*} fn 回调
     */
    MySelect(thisJS:any, isSelectIndex:number = 0, fn:Function):void {
        this.thisJS = thisJS;
        this.returnFn = fn;
        this.init(isSelectIndex);
    }
}