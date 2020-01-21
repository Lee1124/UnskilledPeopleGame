/**
 * 公用数据模块
 */
import TIP from '../common/SuspensionTips';
class Main {
    //是否是微信端
    wxGame: false
    //debug
    debug: boolean = true;
    //牌的宽度
    pokerWidth: number = 128;
    //牌的张数
    count: number = 105;
    //关于牌的参数
    pokerParam: any = {
        alpha: 0.7,
        bgColor1: [
            0.6, 0.5, 0.5, 0.2, 0, //R
            0.6, 0.5, 0.5, 0.2, 0, //G
            0.6, 0.5, 0.5, 0.2, 0, //B
            1, 1, 1, 1, 1, //A
        ],
        color1: 'res/img/common/1.png',
        color2: 'res/img/common/2.png'
    }
    //关于发牌的时候的接受牌的参数
    deal: object = {
        otherBottom: -220,
        meBottom: 340
    }
    tipArr1: any[] = [];
    tipArr2: any[] = [];
    //配置速度
    Speed: object = {
        changeSeat: 200,
        dealPoker: 20,
        dealPoker2: 120,//发牌结束整理牌的速度
        feelPoker: 200,//摸牌的速度
        feelFan: 100,//摸后翻牌的速度
        pokerHeight: 50,//出牌时变化高度的速度
        mePlay: 100,//‘我’出牌的速度
        otherPlay: 50,//‘其他’出牌的速度
        changePage:200,//切换页面速度
    }
     //跳转划出界面标志
     sign:any = {
        signOut: 1,
        register: 2,
        changePwd: 3,
        shop: 4
    }
    //用户信息
    userInfo: object = {
        userId: 123450
    }
    //预加载的牌
    loadPokerArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    //‘我的’页面列表数据
    meListData: any[] = [
        { id: 1, src: 'res/img/me/me_text1.png' },
        { id: 2, src: 'res/img/me/me_text2.png' },
        { id: 3, src: 'res/img/me/me_text3.png' },
        { id: 4, src: 'res/img/me/me_text4.png' },
        { id: 5, src: 'res/img/me/me_text5.png' },
        { id: 6, src: 'res/img/me/me_text6.png' }
    ]
    //预加载的场景
    loadScene: any[] = ['Game.scene', 'TabPages.scene','Register.scene']
    loadSceneResourcesArr: any[] = []
    openSceneViewArr: any[] = []
    //预加载指向
    beforeLoadThat: any;
    //预加载回调
    beforeLoadCallback: any;
    //关于游戏大厅的数据
    hall: any = {
        allowRepuest: true
    }
    //tab界面数据
    //界面
    pages = {
        page1: 'NoticePage',
        page2: 'FamilyPage',
        page3: 'HallPage',
        page4: 'MoneyPage',
        page5: 'MePage',
        page6: 'login'
    }
    //控制台打印console.log
    $LOG(...data) {
        if (this.debug)
            console.log(data)
    }

    /**
     * 预加载数据
     */
    beforeReloadResources(that?: any, loadFn?: Function) {
        this.beforeLoadThat = that;
        this.beforeLoadCallback = loadFn;
        Laya.loader.load(['res/img/poker/chang/-1.png']);
        this.loadPokerArr.forEach(item => {
            Laya.loader.load(['res/img/poker/chang/' + item + '.png']);
            Laya.loader.load(['res/img/poker/duan/' + item + '.png']);
        })
        this.meListData.forEach(item => {
            Laya.loader.load([item.src]);
        })
        this.loadScene.forEach(item => {
            Laya.Scene.load(item, Laya.Handler.create(this, this.openView));
        })
    }

    /**
     * 加载资源回调
     * @param {*} res 加载资源结束回调参数
     */
    openView(res: any): void {
        this.beforeLoadCallback.call(this.beforeLoadThat, res);
        this.$LOG('预加载的场景', res)
        this.loadSceneResourcesArr.push(res.url);
        this.openSceneViewArr.forEach((item, index) => {
            if (item.url.indexOf(res.url) != -1) {
                Laya.Scene.open(res.url, item.closeOther, item.data);
                this.openSceneViewArr.splice(index, 1);
                return;
            }
        })
    }
    /**
     * 打开场景
     * @param url 场景地址
     * @param closeOther 是否关闭
     * @param data 参数
     * @param fn 打开回调函数
     * @param fn2 正在打开回调函数
     */
    $openScene(url?: string, closeOther?: boolean, data?: any, fn?: Function, fn2?: Function) {
        this.loadSceneResourcesArr.forEach(item => {
            if (item.indexOf(url) != -1) {
                Laya.Scene.open(url, closeOther, data, Laya.Handler.create(this, fn));
                return;
            }
        })
        this.openSceneViewArr = [{ url: url, closeOther: closeOther, data: data, fn: fn, fn2: fn2 }];
    }

    /**
     * 改变节点的层级
     */
    changeNodeZOrder(jsonArr: any[]) {
        jsonArr.forEach(item => {
            item.nodeName.zOrder = item.val;
        })
    }

    /**
    * 创建一个tip节点
    */
    createTipBox() {
        let tipBox = new Laya.Image();
        tipBox.zOrder = 40;
        tipBox.name = 'tipBox';
        tipBox.height = 300;
        tipBox.left = 0;
        tipBox.right = 0;
        tipBox.pivot(tipBox.width / 2, tipBox.height / 2);
        tipBox.pos((Laya.stage.width - tipBox.width) / 2, (Laya.stage.height - tipBox.height) / 2)
        Laya.stage.addChild(tipBox);
        tipBox.addComponent(TIP);
        this.tipArr1 = ['tipBox'];
        this.tipArr2.forEach(item => {
            let tipJS = tipBox.getComponent(TIP);
            tipJS.add(item.msg);
            this.tipArr2 = [];
            return;
        })
    }

    /**
    * 显示提示
    * @param {*} msg 提示文字
    */
    showTip(msg) {
        this.tipArr1.forEach(item => {
            let tipBox = Laya.stage.getChildByName(item);
            if (tipBox) {
                let tipJS = tipBox.getComponent(TIP);
                tipJS.add(msg);
            }
        })
        if (this.tipArr1.length == 0)
            this.tipArr2 = [{ msg: msg }];
    }
}
export default new Main();