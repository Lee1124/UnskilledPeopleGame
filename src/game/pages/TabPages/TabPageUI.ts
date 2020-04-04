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
    defaultPage: any;
    onAwake(): void {
        this.registerEvent();
        this.defaultPage = Main.pages.page3;
    }
    onOpened(options: any): void {
        Main.$LOG('tab页面所收到的值：', options);
        this.pageData = options;
        this.selectedPage = options ? options.page ? options.page : this.defaultPage : this.defaultPage;
        this.openView(this.selectedPage, 0);
        this.setUI();
    }

    setUI():void{
        let nodeArr:any = [this['me_content'],this['hall_content'],this['notice_content'],this['wallet_content'],this['friends_content']];
        Main.setNodeTop(nodeArr);
    }

    /**
     * 注册事件
     */
    registerEvent(): void {
        let navList: any[] = this['tabNav']._children;
        navList.forEach((item: any) => {
            item.on(Laya.Event.CLICK, this, this.openView, [item.name, 100])
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

    /**
     * 设置当前选中的tab状态
     * @param page 选中的tab页面
     */
    setCurrentTab(page: any, speed: number): void {
        let navList: any[] = this['tabNav']._children;
        navList.forEach((item: any) => {
            item.top = 0;
            item.getChildByName('icon0').visible = false;
        })
        let thisTab: any = this['tabNav'].getChildByName(page);
        thisTab.top = -20;
        thisTab.getChildByName('icon0').visible = true;
    }

    openView(page: any, speed: number): void {
        this.setCurrentTab(page, speed);
        Main.hall.allowRepuest = false;
        this.closeAllpages();
        this[page].visible = true;
        if (page === Main.pages.page5) {
            let MeJS: any = this[page].getComponent(Me);
            MeJS.openThisPage();
        } else if (page === Main.pages.page3) {
            Main.hall.allowRepuest = true;
            let HallJS: any = this[page].getComponent(Hall);
            HallJS.openThisPage();
        } else if (page === Main.pages.page1) {
            let NoticeJS: any = this[page].getComponent(Notice);
            NoticeJS.openThisPage();
        } else if (page === Main.pages.page4) {
            let WalleteJS: any = this[page].getComponent(Wallet);
            WalleteJS.openThisPage();
        } else if (page === Main.pages.page2) {
            let FriendsJS: any = this[page].getComponent(Friends);
            FriendsJS.openThisPage();
        }
    }
}