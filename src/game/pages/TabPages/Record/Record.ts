/**
 * 分享/推广脚本
 */
import Main from '../../../common/Main';
import MyCenter from '../../../common/MyCenter';
export default class Notice extends Laya.Script {

    onStart(): void {
        this.registerEvent();
        MyCenter.req('meOpen',(res:any)=>{
            if(res==this.owner.scene.url)
                this.selectThisTab(1);
        })
    }

    /**
     * 注册点击事件
     */
    registerEvent() {
        this.owner['tab_title']._children.forEach((item: any, index: number) => {
            item.on(Laya.Event.CLICK, this, this.selectThisTab, [index + 1])
        });
    }

    /**
    * 重置选中状态
    */
    reloadNavSelectZT() {
        this.owner['tab_select']._children.forEach((item: any, index: number) => {
            item.visible = false;
        });
    }

    /**
     * 选中当前
     * @param {*} itemObj 选中对象
     */
    selectThisTab(pageNum: number): void {
        this.reloadNavSelectZT();
        this.owner['tab_select'].getChildByName('s' + pageNum).visible = true;
        this.reqPageData(pageNum);
    }

    reqPageData(num:number):void{
        console.log(num)
    }

}
