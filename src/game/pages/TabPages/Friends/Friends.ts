/**
 * 亲友圈
 */
import Main from '../../../common/Main';
import HTTP from '../../../common/HttpRequest';
export default class Friends extends Laya.Script {
    onStart(): void {

    }
    onAwake(): void {
        // this.pageList = this.owner.scene.hall_list;
        // this.registerEvent();
     
    }
    openThisPage() {
        if (this.owner['visible']) {
            console.log('进来亲友圈friends', this);
            // this.selectThisTab(this.owner.scene.wallet_nav_bg._children[0], 1);//默认选择第一项
            // this.UI = this.owner.scene;
            // this.requestPageData();
            // this.initOpenView();
        }
    }

    // /**
    //  * 注册点击事件
    //  */
    // registerEvent() {
    //     this.owner.scene.wallet_nav_bg._children.forEach((item: any, index: number) => {
    //         item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index + 1])
    //     });
    // }

    // /**
    //  * 重置选中状态
    //  */
    // reloadNavSelectZT() {
    //     this.owner.scene.wallet_nav_bg._children.forEach((item: any, index: number) => {
    //         item.getChildByName("selectedBox").visible = false;
    //     });
    // }

    // /**
    //  * 选中当前
    //  * @param {*} itemObj 选中对象
    //  */
    // selectThisTab(itemObj: any, pageNum: number): void {
    //     this.reloadNavSelectZT();
    //     itemObj.getChildByName("selectedBox").visible = true;
    //     this._selectNavType = pageNum;
    //     this.changePages(pageNum);

    //     // this.requestPageData(true);
    // }

    // //页面的切换
    // changePages(num: number): void {
    //     //显示选中的页面，隐藏非选中的页面
    //     this.owner.scene.wallet_view_bg._children.forEach((item: any, index: number) => {
    //         item.visible = item.name.split('view')[1] == num ? true : false;
    //         this.changePageData(num);
    //     });
    // }

    // //切换页面时请求的数据
    // changePageData(num: number): void {
    //     switch (num) {
    //         case 1:
    //             this.setView1Data();
    //             break;
    //         case 2:
    //             this.setView2Data();
    //             break;
    //         case 3:
    //             this.setView3Data();
    //             break;
    //     }
    // }

    // /**
    //  * 页面1的数据
    //  */
    // setView1Data():void{

    // }
    // /**
    //  * 页面2的数据
    //  */
    // setView2Data():void{

    // }
    // /**
    //  * 页面3的数据
    //  */
    // setView3Data():void{
    //     let v3List:any=this.owner.scene.wallets_view3.getChildByName('tbodyView').getChildByName('v3List');
    //     v3List.visible=true;
    //     v3List.vScrollBarSkin='';
    //     v3List.array=[{type:'类型1',price:'100',time:'2020.01.01',state:'成功'},{type:'类型1',price:'100',time:'2020.01.01',state:'成功'}];
    //     v3List.renderHandler=new Laya.Handler(this,this.v3ListRender);
    // }

    // //查询表格的渲染
    // v3ListRender(cell:any,index:number):void{
    //     let c1:any=cell.getChildByName('c1');
    //     let c2:any=cell.getChildByName('c2');
    //     let c3:any=cell.getChildByName('c3');
    //     let c4:any=cell.getChildByName('c4');
    //     c1.text=cell.dataSource.type;
    //     c2.text=cell.dataSource.price;
    //     c3.text=cell.dataSource.time;
    //     c4.text=cell.dataSource.state;
    // }
}