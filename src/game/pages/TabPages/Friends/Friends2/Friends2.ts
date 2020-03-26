/**
 * 亲友圈得二级页面(我的玩家，我的收益，我的提现记录)
 */
import Main from '../../../../common/Main';
import Back from '../../../../common/Back';
import HTTP from '../../../../common/HttpRequest';
export default class Friends2 extends Laya.Script {

    onStart() {
        this.setBack();
        this.registerEvent();
    }

    setBack() {
        let backJS:any = this.owner['back_btn'].getComponent(Back);
        console.log(backJS)
        backJS.initBack();
    }

    /**
     * 注册点击事件
     */
    registerEvent() {
        this.owner['tab_title']._children.forEach((item: any, index: number) => {
            item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index + 1])
        });
    }

     /**
     * 重置选中状态
     */
    reloadNavSelectZT() {
        this.owner['v2_tab_select']._children.forEach((item: any, index: number) => {
            item.visible = false;
        });
    }

    /**
     * 选中当前
     * @param {*} itemObj 选中对象
     */
    selectThisTab(itemObj: any, pageNum: number): void {
        this.reloadNavSelectZT();
        this.owner['v2_tab_select'].getChildByName('s'+pageNum).visible=true;
        // this._selectNavType = pageNum;
        // this.changePages(pageNum);
        // this.requestPageData(true);
    }
}