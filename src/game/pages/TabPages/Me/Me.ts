/**
 * 我的
 */
import Main from '../../../common/Main';
import HTTP from '../../../common/HttpRequest';
import HttpReqContent from '../../../common/HttpReqContent';
export default class Me extends Laya.Script {
    //me列表
    meList: any;
    //脚本所属的scene
    UI: any;
    //所属场景
    toScene:any;
    onStart(): void {
        this.toScene=this.owner.scene;
        this.meList = this.owner.getChildByName('list_bg').getChildByName('list_bg2').getChildByName('me_list');
        this.setPage();
    }
    openThisPage() {
        if (this.owner['visible']) {
            this.UI = this.owner.scene;
            this.requestPageData();
            // this.initOpenView();
        }
    }
    /**设置页面数据 */
    setPage(): void {
        this.meList.array = Main.meListData;
        this.meList.renderHandler = new Laya.Handler(this, this.meListOnRender);
        this.meList.mouseHandler = new Laya.Handler(this, this.meListOnClick);
    }

    meListOnRender(cell: any, index: number): void {
        if (index == Main.meListData.length - 1) {
            let line: any = cell.getChildByName("line");
            line.visible = false;
        }
        let textImg: any = cell.getChildByName("textImg");
        textImg.skin = cell.dataSource.src;
    }

    meListOnClick(e: any): void {
        if (e.type == 'click') {
            //点击选择的id
            let clickId: number = e.target.dataSource.id;
            console.log(clickId)
            switch (clickId) {
                case 1:///商城
                    this.goShop();
                    break;
                case 5:///设置
                    this.goSet();
                    break;
                case 6://退出登录
                    this.signOut();
                    break;
            }
        }
    }
    //商城
    goShop():void{
        Main.$openScene('Shop.scene',false,null,(res:any)=>{
            res.x = Laya.stage.width;
            res.zOrder = 10;
            Laya.Tween.to(res, { x: 0 }, Main.Speed['changePage'],null,Laya.Handler.create(this,()=>{
                this.toScene.removeSelf();
            }));
        })
    }

    //设置
    goSet():void{
        Main.$openScene('Set.scene',false,null,(res:any)=>{
            res.x = Laya.stage.width;
            res.zOrder = 10;
            Laya.Tween.to(res, { x: 0 }, Main.Speed['changePage']);
        })
    }

    //退出登录
    signOut(): void {
        Main.showDiaLog('是否退出重新登录?', 2, () => {
            // Main.allowGameHallSetInterval = false;
            Laya.Scene.open('login.scene', true, Main.sign.signOut);
        })
    }

    //获取页面数据
    requestPageData(): void {
        HttpReqContent.getUserNews(this, (res: any) => {
            Main.$LOG('我页面数据：',res);
            let data:any=res.data;
            Main.$LoadImage(this.UI.headImg, data.head, Main.defaultData.head1, 'skin');
            this.UI.userNameValue.text = data.nick;
            this.UI.userIDValue.text = data.userId;
            this.UI.userScoreValue.text = data.score;
            this.UI.me_sex0.visible = data.sex == 0 ? true : false;
            this.UI.me_sex1.visible = data.sex == 1 ? true : false;
            Main.serviceUrl = data.service;
        })
    }
}
