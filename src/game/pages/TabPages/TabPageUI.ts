/**
 * tab界面UI
 */
import Main from '../../common/Main';
import Me from '../../pages/TabPages/Me/Me';
import Hall from '../../pages/TabPages/GameHall/GameHall';
import Notice from '../../pages/TabPages/Notice/Notice';
import Wallet from '../../pages/TabPages/Wallet/Wallet';
import Friends from '../../pages/TabPages/Friends/Friends';
export default class TabPageUI extends Laya.Scene {
    //页面值
    pageData: any;
    //选中的页面
    selectedPage: any;
    //默认显示的页面
    defaultPage:any;
    onAwake(): void {
        this.registerEvent();
        this.defaultPage=Main.pages.page3;
    }
    onOpened(options: any): void {
        Main.$LOG('tab页面所收到的值：', options);
        this.pageData = options;
        this.selectedPage = options ? options.page ? options.page : this.defaultPage : this.defaultPage;
        this.openView(this.selectedPage);
    }

    /**
     * 注册事件
     */
    registerEvent(): void {
        let navList:any[]=this['tabNav']._children;
        navList.forEach((item:any)=>{
            item.on(Laya.Event.CLICK,this,this.openView,[item.name])
        })
    }

    /**
     * 切换页面时候先关闭所有页面
     */
    closeAllpages(): void {
        let allPages = this['pages']._children;
        allPages.forEach((item: any) => {
            item.visible = false;
        });
    }

    openView(page:any): void {
        Main.hall.allowRepuest = false;
        this.closeAllpages();
        this[page].visible = true;
        this.reloadNavSelect();
        this.setTabSelect(page);
        if (page === Main.pages.page5) {
            let MeJS: any = this[page].getComponent(Me);
            MeJS.openThisPage();
        } else if (page === Main.pages.page3) {
            Main.hall.allowRepuest = true;
            let HallJS: any = this[page].getComponent(Hall);
            HallJS.openThisPage();
        }else if (page === Main.pages.page1) {
            let NoticeJS: any = this[page].getComponent(Notice);
            NoticeJS.openThisPage();
        }else if (page === Main.pages.page4) {
            let WalleteJS: any = this[page].getComponent(Wallet);
            WalleteJS.openThisPage();
        }else if (page === Main.pages.page2) {
            let FriendsJS: any = this[page].getComponent(Friends);
            FriendsJS.openThisPage();
        }
    }

    /**
     * 重置下面导航栏的文字样式
     */
    reloadNavSelect(): void {
        // this.notice.visible = true;
        // this.notice_selected.visible = false;
        // this.paiju.visible = true;
        // this.paiju_selected.visible = false;
        // this.data.visible = true;
        // this.data_selected.visible = false;
        // this.me.visible = true;
        // this.me_selected.visible = false;
    }

    /**
    * 设置下面导航栏的选项
    * @param {*} type 类型
    */
    setTabSelect(type: any): void {
        // switch (type) {
        //     case Main.pages.page1:
        //         this.notice.visible = false;
        //         this.notice_selected.visible = true;
        //         break;
        //     case Main.pages.page2:
        //         this.paiju.visible = false;
        //         this.paiju_selected.visible = true;
        //         break;
        //     case Main.pages.page4:
        //         this.data.visible = false;
        //         this.data_selected.visible = true;
        //         break;
        //     case Main.pages.page5:
        //         this.me.visible = false;
        //         this.me_selected.visible = true;
        //         break;
        // }
    }
}