/**
 * 公用数据模块
 */
import TIP from '../common/SuspensionTips';
class Main {

    //亲友圈信息
    familyRoomInfo: any = {
        joinUserId: null,//要加入的玩家id
        IsRoot: false,//是否是第一个创建的推广员
        IsSuper: false,//是否是盟主
        IsJoin: false,//是否加入了某个推广员（即加入了亲友团）
        IsProm: false,//是否是推广员
    }
    //手机信息
    phoneNews: any = {
        statusHeight: 0,//手机系统栏的高度
        deviceNews: '',//系统名称：Android / iOS
    }
    //是否自动测试环境
    AUTO: boolean = false;
    // //websoket请求地址 

    // //websoket请求地址
    // websoketApi: string = '192.168.101.109:8082';
    // //http请求的地址
    // requestApi: string = 'http://192.168.101.109:8081';

    //websoket请求地址
     websoketApi: string = '132.232.34.32:8092';
     //http请求的地址
     requestApi: string = 'http://132.232.34.32:8091';

    //资源获取地址
    // resourseHttp:string='http://132.232.34.32/ydr/'
    //用户信息
    userInfo: any = null;
    //是否是微信端
    wxGame: false
    //debug
    debug: boolean = true;
    //牌的宽度
    pokerWidth: number = 128;
    //牌的张数
    count: number = 105;
    //客服链接
    serviceUrl: string;
    //关于牌的参数
    pokerParam: any = {
        alpha: 0.7,
        // bgColor1: [
        //     0.6, 0.5, 0.5, 0.2, 0, //R
        //     0.6, 0.5, 0.5, 0.2, 0, //G
        //     0.6, 0.5, 0.5, 0.2, 0, //B
        //     1, 1, 1, 1, 1, //A
        // ],
        color1: 'res/img/common/1.png',
        color2: 'res/img/common/2.png',
        color3: 'res/img/common/2.png'
    }
    //关于发牌的时候的接受牌的参数
    deal: object = {
        otherBottom: -220,
        meBottom: 340
    }
    //默认数据
    defaultData: any = {
        head1: 'res/img/common/defaultHead.png'
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
        changePage: 200,//切换页面速度
        openDiaLogSpeed: 200//打开弹框的速度
    }
    //跳转划出界面标志
    sign: any = {
        signOut: 1,
        register: 2,
        changePwd: 3,
        shop: 4
    }
    // //用户信息
    // userInfo: object = {
    //     userId: 123450
    // }
    //预加载的牌
    loadPokerArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    //预加载菜单的图片资源
    loadMenuImgArr: any[] = ['res/img/menu/menu_1.png', 'res/img/menu/menu_2.png', 'res/img/menu/menu_3.png', 'res/img/menu/menu_4.png', 'res/img/menu/menu_5.png', 'res/img/menu/menu_6.png'];
    //‘我的’页面列表数据
    meListData: any[] = [
        { id: 1, src: 'res/img/me/me_text1.png', isShow: true },
        { id: 2, src: 'res/img/me/me_text2.png', isShow: true },
        { id: 3, src: 'res/img/me/me_text3.png', isShow: false },
        { id: 4, src: 'res/img/me/me_text4.png', isShow: true },
        { id: 5, src: 'res/img/me/me_text5.png', isShow: true },
        { id: 6, src: 'res/img/me/me_text6.png', isShow: true }
    ]
    //预加载的场景
    loadScene: any[] = ['Game.scene', 'TabPages.scene', 'Register.scene', 'Set.scene',
        'CoinRecord.scene', 'RealTimeResult.scene', 'Friends.scene', 'EditUserNews.scene',
        'Record.scene', 'Share.scene', 'Give.scene'
    ]
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
        page2: 'FriendsPage',
        page3: 'HallPage',
        page4: 'WalletPage',
        page5: 'MePage',
        page6: 'login'
    }
    //弹框对象
    diaLog: any = null;
    //弹框的遮罩
    diaLogMask: any = null;
    //弹框数组1
    diaLogArr1: any[] = [];
    //弹框数组2
    diaLogArr2: any[] = [];
    //加载类型
    loadingType: any = {
        one: 'loading1',
        two: 'loading2',
        three: 'loading3',
        four: 'loading4',
    }
    //加载数组1
    loadAniArr1: any[] = [];
    //加载数组2
    loadAniArr2: any[] = [];
    //控制台打印console.log
    $LOG(...data: any) {
        if (this.debug)
            console.log(data)
    }
    //控制台打印console.error
    $ERROR(...data: any) {
        if (this.debug)
            console.error(...data);
    }

    //表情聊天列表
    expressionChat: any[] = [
        { id: 0, icon: 'res/img/Expression/0_0.png' },
        { id: 1, icon: 'res/img/Expression/1_0.png' },
        { id: 2, icon: 'res/img/Expression/2_0.png' },
        { id: 3, icon: 'res/img/Expression/3_0.png' },
        { id: 4, icon: 'res/img/Expression/4_0.png' },
        { id: 5, icon: 'res/img/Expression/5_0.png' },
        { id: 6, icon: 'res/img/Expression/6_0.png' },
        { id: 7, icon: 'res/img/Expression/7_0.png' },
        { id: 8, icon: 'res/img/Expression/8_0.png' },
        { id: 9, icon: 'res/img/Expression/9_0.png' },
        { id: 10, icon: 'res/img/Expression/10_0.png' },
        { id: 11, icon: 'res/img/Expression/11_0.png' },
        { id: 12, icon: 'res/img/Expression/12_0.png' },
        { id: 13, icon: 'res/img/Expression/13_0.png' },
        { id: 14, icon: 'res/img/Expression/14_0.png' }
    ];

    /**
    * 获取状态栏高度入口
    */
    getStatusHeight() {
        if (window['plus']) {
            this.plusReady();
            this.getDeviceInfo();
        } else {
            document.addEventListener('plusready', this.plusReady, false);
            document.addEventListener('getDeviceInfo', this.getDeviceInfo, false);
        }
    }

    /**
        * 获取状态栏高度值
        */
    plusReady() {
        // 获取系统状态栏样式
        var lh = window['plus'].navigator.getStatusbarHeight();
        this.phoneNews.statusHeight = lh * window['plus'].screen.scale;
    }

    getDeviceInfo() {
        this.phoneNews.deviceNews = window['plus'].os.name;
        document.getElementById('ceshi').innerHTML=this.phoneNews.deviceNews+'====>'+this.phoneNews.statusHeight
    }

    /**
     * 根据状态栏设置元素的top值
     * @param nodeArr 节点对象 数组
     */
    setNodeTop(nodeArr:any) {
        // console.log('手机系统：',this.phoneNews.deviceNews,this.phoneNews.statusHeight)
        if (this.phoneNews.deviceNews == 'Android') {
            nodeArr.forEach((node:any) => {
                node.top = node.top + this.phoneNews.statusHeight;
            })
        }
        // if (this.wxGame) {
        //     nodeArr.forEach(node => {
        //         node.top = node.top + 30;
        //     })
        // }
    }

    /**
     * 根据stage的高度设置节点的bottom值（小于2208时）或者高度（大于2208时）
     * @param nodeArr 节点对象 数组 (包括大于2208时需要设置的高度)
     */
    setNodeBOrH(nodeArr:any){
        let myHeight:number=2210;
        let stageHeight:number=Laya.stage.height;
        let myHeightRate:number=myHeight/stageHeight;
        if(stageHeight<=myHeight){
            nodeArr.forEach((item:any) => {
                console.log(item.node.height)
                item.node.bottom=item.node.bottom/myHeightRate;
            })
        }else{
            nodeArr.forEach((item:any) => {
                item.node.bottom='auto';
                // item.node.height=item.height;
                // console.log('====================',item.node,item.height)
            })
        }
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
        this.loadMenuImgArr.forEach(item => {
            Laya.loader.load([item]);
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
        this.$LOG('预加载的场景', res, res.url)
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
    $openScene(url: string, closeOther: boolean, data?: any, fn?: Function, fn2?: Function) {
        let flag: boolean = true;
        this.loadSceneResourcesArr.forEach(item => {
            if (item === url) {
                Laya.Scene.open(url, closeOther, data, Laya.Handler.create(this, fn));
                flag = false;
            }
        })
        if (flag)
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

    /**
     * 预创建弹框
     */
    createDiaLog() {
        let that = this;
        //弹框遮罩
        let myMask = Laya.stage.getChildByName("dialogMask");
        if (myMask) {
            myMask.removeSelf();
        }
        let Mask = new Laya.Sprite();
        this.diaLogMask = Mask;
        Mask.visible = false;
        Mask.zOrder = 4;
        Mask.pos(0, 0);
        Mask.size(Laya.stage.width, Laya.stage.height);
        //弹框对象
        this.diaLog = new Laya.Dialog();
        this.diaLog.pos((Laya.stage.width - 1132) / 2, (Laya.stage.height - 764) / 2);
        this.diaLog.size(1132, 754);
        this.diaLog.zOrder = 5;
        //弹框背景
        let dialogBg = new Laya.Image();
        dialogBg.pos(0, 0);
        dialogBg.loadImage('res/img/diglog/bg.png');
        //弹框文字内容
        let dialogContent = new Laya.Label();
        dialogContent.fontSize = 60;
        dialogContent.color = '#935F13';
        dialogContent.size(1132, 180);
        dialogContent.align = 'center';
        dialogContent.valign = 'middle';
        dialogContent.wordWrap = true;
        dialogContent.y = 250;
        dialogContent.text = '112222';
        //创建一个确认按钮
        let btn_one = new Laya.Image();
        btn_one.size(450, 146);
        btn_one.loadImage('res/img/diglog/btn_comfirm.png', Laya.Handler.create(this, () => {
            btn_one.pos((1132 - btn_one.width) / 2, 764 - btn_one.height - 60);
        }));

        //创建一个确认按钮和一个取消按钮
        let btn_cancel = new Laya.Image();
        let btn_comfirm = new Laya.Image();
        btn_cancel.size(450, 146);
        btn_comfirm.size(450, 146);
        btn_cancel.loadImage('res/img/diglog/btn_cancel.png', Laya.Handler.create(this, () => {
            btn_cancel.pos(72, 764 - btn_cancel.height - 60);
        }))
        btn_comfirm.loadImage('res/img/diglog/btn_comfirm.png', Laya.Handler.create(this, () => {
            btn_comfirm.pos(600, 764 - btn_comfirm.height - 60);
        }))
        dialogBg.addChild(dialogContent);
        dialogBg.addChild(btn_one);
        dialogBg.addChild(btn_cancel);
        dialogBg.addChild(btn_comfirm);
        this.diaLog.addChild(dialogBg);
        Mask.addChild(this.diaLog);
        Laya.stage.addChild(Mask);
        this.diaLogArr1 = [{ btn1: btn_one, btn2: btn_cancel, btn3: btn_comfirm, msg: dialogContent }];
        this.diaLogCommon();
    }
    //弹框的公用函数
    diaLogCommon() {
        let arr1 = this.diaLogArr1[0];
        this.diaLogArr2.forEach(item => {
            arr1.btn1.visible = item.type == 1 ? true : false;
            arr1.btn2.visible = item.type == 2 ? true : false;
            arr1.btn3.visible = item.type == 2 ? true : false;
            arr1.msg.text = item.msg;
            arr1.msg.color = item.color;
            this.diaLogMask.visible = true;
            this.diaLog.show();
            arr1.btn1.on(Laya.Event.CLICK, this, () => {
                if (item.comfirmFn)
                    item.comfirmFn('点击了确定按钮');
                this.closeDiaLog();
            })
            arr1.btn2.on(Laya.Event.CLICK, this, () => {
                if (item.cancelFn)
                    item.cancelFn('点击了取消按钮');
                this.closeDiaLog();
            })
            arr1.btn3.on(Laya.Event.CLICK, this, () => {
                if (item.comfirmFn)
                    item.comfirmFn('点击了确定按钮');
                this.closeDiaLog();
            })
            this.diaLogMask.on(Laya.Event.CLICK, this, () => {
                if (item.cancelFn)
                    item.cancelFn('点击了取消按钮');
                this.closeDiaLog();
            })
        })
        this.diaLogArr2 = [];
    }
    //关闭弹框
    closeDiaLog() {
        this.diaLog.close();
        this.diaLogMask.visible = false;
        let arr = this.diaLogArr1[0];
        arr.btn1.off(Laya.Event.CLICK);
        arr.btn2.off(Laya.Event.CLICK);
        arr.btn3.off(Laya.Event.CLICK);
    }

    /**
     * 对话框
     * @param {*} msg 提示内容
     * @param {*} type 显示类型(注意：1--一个确定按钮,2--确定按钮和取消按钮)
     * @param {*} comfirmFn 确认回调
     * @param {*} cancelFn 取消回调
     * @param {*} textColor 文字颜色
     */
    showDiaLog(msg: string, type?: number, comfirmFn?: Function, cancelFn?: Function, textColor?: string) {
        let myMsg = msg ? msg : '';
        let myType = type ? type : 1;
        let myMsgColor = textColor ? textColor : '#B2A638';
        if (this.diaLogArr1.length > 0) {
            this.diaLogArr1.forEach(item => {
                item.btn1.visible = myType == 1 ? true : false;
                item.btn2.visible = myType == 2 ? true : false;
                item.btn3.visible = myType == 2 ? true : false;
                item.msg.text = myMsg;
                item.msg.color = myMsgColor;
                this.diaLogMask.visible = true;
                this.diaLog.show();
                item.btn1.on(Laya.Event.CLICK, this, () => {
                    if (comfirmFn)
                        comfirmFn('点击了确定按钮');
                    this.closeDiaLog();
                })
                item.btn2.on(Laya.Event.CLICK, this, () => {
                    if (cancelFn)
                        cancelFn('点击了取消按钮');
                    this.closeDiaLog();
                })
                item.btn3.on(Laya.Event.CLICK, this, () => {
                    if (comfirmFn)
                        comfirmFn('点击了确定按钮');
                    this.closeDiaLog();
                })
                this.diaLogMask.on(Laya.Event.CLICK, this, () => {
                    if (cancelFn)
                        cancelFn('点击了取消按钮');
                    this.closeDiaLog();
                })
            })
            return;
        } else {
            this.diaLogArr2 = [{ msg: myMsg, type: myType, comfirmFn: comfirmFn, cancelFn: cancelFn, color: myMsgColor }]
        }
    }

    /**
    * 创建加载图标到stage
    * @param type 加载图标类型
    */
    createLoading(Type?: any) {
        let type = Type ? Type : this.loadingType.one;
        Laya.loader.load("res/atlas/images/common.atlas", Laya.Handler.create(this, onMyLoaded));
        function onMyLoaded() {
            let loadingMask = new Laya.Image();
            loadingMask.visible = false;
            loadingMask.left = 0;
            loadingMask.top = 0;
            loadingMask.bottom = 0;
            loadingMask.right = 0;
            loadingMask.zOrder = 10;
            loadingMask.name = 'loadingMask-' + type;
            loadingMask.on(Laya.Event.CLICK, this, () => { });
            let animationBox = new Laya.Sprite();
            let animationText = new Laya.Label();
            if (type == this.loadingType.three) {
                animationText.name = 'loadingText';
                animationText.width = 220;
                animationText.centerX = 0;
                animationText.align = 'center';
                animationText.zOrder = 10;
                animationText.bottom = -85;
                let aniText = this.setText(animationText, 30, '#FFFFFF');
                animationBox.addChild(aniText);
            }
            animationBox.name = 'loadingBox';
            animationBox.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            let ani = new Laya.Animation();
            ani.name = 'loadingAni';
            ani.loadAnimation("animation/loading/" + type + ".ani");
            animationBox.addChild(ani);
            loadingMask.addChild(animationBox);
            Laya.stage.addChild(loadingMask);
            this.loadAniArr1.push(type);
            this.loadAniArr2.forEach(item => {
                if (item.key == type) {
                    let $loadingMask: any = Laya.stage.getChildByName('loadingMask-' + item.type);
                    $loadingMask.visible = item.show;
                    animationText.text = '';
                    if (item.show) {
                        animationText.text = item.text;
                        ani.play();
                    } else {
                        ani.stop();
                    }
                }
            })
        }
    }

    /**
     * 显示或隐藏加载图标
     * @param isShow 是否显示
     * @param type 显示类型
     * @param msg 显示文字
     */
    showLoading(isShow: boolean = true, type: any = this.loadingType.one, msg: string = '') {
        this.loadAniArr1.forEach(item => {
            if (item == type) {
                let loadingMask: any = Laya.stage.getChildByName('loadingMask-' + type);
                let loadingBox: any = loadingMask.getChildByName('loadingBox');
                let loadingAni: any = loadingBox.getChildByName('loadingAni');
                let loadingText: any;
                if (type == this.loadingType.three) {
                    loadingText = loadingBox.getChildByName('loadingText');
                    loadingText.text = '';
                }
                if (!loadingMask.visible && isShow) {
                    if (type == this.loadingType.three)
                        loadingText.text = msg;
                    loadingAni.play();
                } else if (!isShow) {
                    loadingAni.stop();
                }
                loadingMask.visible = isShow;
                return;
            }
        })
        this.loadAniArr2 = [{ key: type, show: isShow, type: type, text: msg }];
    }

    /**
     * 隐藏所有的加载
     */
    hideAllLoading() {
        this.showLoading(false, this.loadingType.one);
        this.showLoading(false, this.loadingType.two);
        this.showLoading(false, this.loadingType.three);
    }

    /**
    * 加载图片资源,判断加载失败则显示默认图片(默认图片分多种，根据需要)
    * @param {*} node 加载图片的节点
    * @param {*} url 加载图片资源地址
    * @param {*} type 默认的图片类型 
    * @param {*} type2 加载图片方式  skin 和 loadImage两种方式 
    */
    $LoadImage(node: any, url: string = '', type: string = this.defaultData.head1, type2: string = 'loadImage') {
        if (url.indexOf('.png') != -1 || url.indexOf('.jpg') != -1 || url.indexOf('.jpeg') != -1) {
            Laya.loader.load(url, Laya.Handler.create(this, (res: any) => {
                if (res) {
                    if (type2 == 'loadImage') {
                        node.loadImage(url);
                    } else if (type2 == 'skin') {
                        node.skin = url;
                    }
                } else {
                    if (type2 == 'loadImage') {
                        node.loadImage(type);
                    } else if (type2 == 'skin') {
                        node.skin = type;
                    }
                }
            }))
        } else {
            if (type2 == 'loadImage') {
                node.loadImage(type);
            } else if (type2 == 'skin') {
                node.skin = type;
            }
        }
    }

    /**
     * 获取当前时间戳(以S为单位)
     */
    getTimeChuo() {
        return Math.round((new Date()).getTime() / 1000)
    }

    /**
     * 将秒转化为时分秒
     */
    secondToDate(result: any) {
        var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
        return result = h + ":" + m + ":" + s;
    }

    /**
     * 判断字符是否位空 为空返回true 不为空返回false
     */
    strIsNull(str: any) {
        return (str == '' || str.trim() == '') ? true : false;
    }

    getDate(format: any, timeNum: any, isOnlyD?: boolean) {
        let _format = !format ? 'yyyy/mm/dd' : format;
        let oTime: any;
        let oDate: any = new Date(timeNum * 1000);
        let oYear: any = oDate.getFullYear();
        let oMonth: any = oDate.getMonth() + 1;
        let oDay: any = oDate.getDate();
        let oHour: any = oDate.getHours();
        let oMin: any = oDate.getMinutes();
        let oSec: any = oDate.getSeconds();
        if (_format == 'yyyy-mm-dd') {
            if (isOnlyD)
                oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay);
            else
                oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSec);//最后拼接时间
        } else if (_format == 'yyyy/mm/dd') {
            if (isOnlyD)
                oTime = oYear + '/' + this.getzf(oMonth) + '/' + this.getzf(oDay);
            else
                oTime = oYear + '/' + this.getzf(oMonth) + '/' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSec);//最后拼接时间
        }
        return oTime;
    }
    //补0操作  
    getzf(num: any) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }

    /**
    * 获取地址栏信息
    * @param {String} name 名称
    */
    GetUrlString(name: string) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}
export default new Main();