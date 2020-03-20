/**
 * 钱包
 */
import Main from '../../../common/Main';
import HTTP from '../../../common/HttpRequest';
export default class Wallet extends Laya.Script{
    //选中的类型,默认充值
    private _selectNavType: number = 1;

    onStart():void{

    }
    onAwake(): void {
        // this.pageList = this.owner.scene.hall_list;
        this.registerEvent();
    }
    openThisPage() {
        if (this.owner['visible']) {
            console.log('进来wallet',this);
            this.selectThisTab(this.owner.scene.wallet_nav_bg._children[0], 1);//默认选择第一项
            // this.UI = this.owner.scene;
            // this.requestPageData();
            // this.initOpenView();
        }
    }

    /**
     * 注册点击事件
     */
    registerEvent() {
        this.owner.scene.wallet_nav_bg._children.forEach((item: any, index: number) => {
            item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index+1])
        });
    }

    /**
     * 重置选中状态
     */
    reloadNavSelectZT() {
        this.owner.scene.wallet_nav_bg._children.forEach((item: any, index: number) => {
            item.getChildByName("selectedBox").visible = false;
        });
    }

    /**
     * 选中当前
     * @param {*} itemObj 选中对象
     */
    selectThisTab(itemObj: any, pageNum: number): void {
        this.reloadNavSelectZT();
        itemObj.getChildByName("selectedBox").visible = true;
        this._selectNavType = pageNum;
        this.owner.scene.wallet_view_bg._children.forEach((item: any, index: number) => {
            item.visible = item.name.split('view')[1]==pageNum?true:false;
        });

        // this.requestPageData(true);
    }
}