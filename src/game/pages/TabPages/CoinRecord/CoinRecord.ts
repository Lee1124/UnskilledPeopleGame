/**
 * 金币流向 
 */
import Main from '../../../common/Main';
import Back from '../../../common/Back';
import HTTP from '../../../common/HttpRequest';
export default class CoinRecord extends Laya.Script {
    //是不是tab页面
    // isTabPage: boolean = true;

    onStart() {
        // this.setBack();
        //获取页面数据
        // this.getPageData();
        // if (Main.wxGame)
        //     this.initPage();
    }

    // /**初始化页面(加载背景) */
    // initPage() {
    //     // let bg = this.owner.getChildByName('bg');
    //     // bg.skin = 'res/img/common/login_bg.jpg';
    // }

    // setBack() {
    //     this.isTabPage = this.owner['openedData'] ? this.owner['openedData'].isTabPage : true;
    //     let backJS:any = this.owner['shop_back_btn'].getComponent(Back);
    //     backJS.initBack(null,null,null,null,null,null,'mePage');
    //     // if (this.isTabPage) {
    //     //     backJS.initBack(1,0 ,'TabPages.scene', { page: Main.pages.page5 });
    //     // } else {
    //     //     backJS.initBack();
    //     // }
    // }

    // getPageData() {
    //     HTTP.$request({
    //         that: this,
    //         url: '/M.Shop/GetShopInfo',
    //         data: {
    //             uid: Main.userInfo.userId
    //         },
    //         success(res:any) {
    //             // console.log(res)
    //             if (res.data.ret.type == 0) {
    //                 this.setList(res.data.shopList._v[0].shopTemplates);
    //             }
    //         }
    //     })
    // }

    // setList(data:any):void {
    //     let list:any = this.owner['s_list'];
    //     data.forEach((item:any) => {
    //         item.text = 'res/img/shop/' + item.score + '.png';
    //         item.btn = 'res/img/shop/' + item.money + '_btn.png';
    //     });
    //     list.array = data;
    //     list.vScrollBarSkin = "";//运用滚动
    //     list.renderHandler = new Laya.Handler(this, this.listRender)
    // }

    // listRender(cell:any, index:number) {
    //     let text = cell.getChildByName('text');
    //     let btn = cell.getChildByName('btn').getChildByName('value');
    //     text.skin = cell.dataSource.text;
    //     btn.skin = cell.dataSource.btn;
    //     this.bindEvent(btn, cell);
    // }

    // bindEvent(btn:any, value:any) {
    //     btn.on(Laya.Event.CLICK, this, this.clickBtn, [value])
    // }
    // clickBtn(cell:any) {
    //     Main.showDiaLog('您确认充值' + cell.dataSource.score + '积分?', 1, () => {
    //         HTTP.$request({
    //             that: this,
    //             url: '/M.Shop/PlayerRecharge',
    //             data: {
    //                 uid: Main.userInfo.userId,
    //                 shopId: cell.dataSource.shopId,
    //                 shopType: 1000
    //             },
    //             success(res:any) {
    //                 if (res.data.ret.type == 0) {
    //                     Main.showDiaLog(res.data.ret.msg);
    //                 }
    //             }
    //         })
    //     })
    // }
}