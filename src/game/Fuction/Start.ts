/**
* 该脚本为资源预加载界面
*/
import Main from '../common/Main';
export default class sliderSelect extends Laya.Script {
      //预加载资源的数量
      loadArrLength:number = 0;
      //预加载返回的对象数组
      loadReturnArr:any[] = [];
    onEnable():void {
        //隐藏默认的虚拟键
        
        this.getForm();
        //初始化laya相关设置
        if (Main.wxGame) {
            // this.InitLaya();
            // this.initPage();
        }
        // /**===测试=== */
        // this.isAuto();
        // if (Main.AUTO)
        //     this.setUser();
        // /**===测试=== */
        // if (!Main.AUTO)
        //     this.getUserInfo();
        this.hideLoadingView();
        
    }


    /**初始化页面(加载背景) */
    initPage() {
        // let bg = this.owner.getChildByName('bg');
        // let proBg = bg.getChildByName('progressBg');
        // let pro = proBg.getChildByName('progress');
        // bg.skin = 'res/img/common/login_bg.jpg';
        // proBg.skin = 'res/img/common/progress_bg.png';
        // pro.skin = 'res/img/common/progress_line.png';
    }

    /**初始化laya相关设置 */
    InitLaya() {
        // Laya.URL.basePath = Main.resourseHttp;
    }

    isAuto() {
        // if (!Main.wxGame) {
        //     let isAuto = Main.GetUrlString('auto');
        //     Main.AUTO = isAuto == 1 ? true : false;
        // }
    }

    /**测试 获取url中所带的账户和密码 */
    setUser() {
        // let user = Main.GetUrlString('user');
        // let pwd = Main.GetUrlString('pwd');
        // if (user && pwd) {
        //     let data = {
        //         user: user,
        //         pwd: pwd
        //     }
        //     Main.userInfo = data;
        // }
    }

    /**获取是不是微信小游戏平台 */
    getForm() {
        // Main.wxGame = Laya.Browser.onWeiXin;
        // Main.$LOG('是不是微信平台===:', Main.wxGame);
    }

    /**获取玩家信息 */
    getUserInfo() {
        // Main.userInfo = Main.wxGame ? wx.getStorageSync('userInfo') : JSON.parse(localStorage.getItem("userInfo"));
    }

    hideLoadingView() {
        if (!Main.wxGame)
            setTimeout(() => {
                // if (document.getElementById('startImg'))
                //     document.getElementById('startImg').style.opacity = 0;
                this.onLoading();
            }, 1000)
        else {
            // this.onLoading();
        }
    }

    onLoading() {
        Main.beforeReloadResources(this, (res:any) => {
            this.dealWithBeforeLoadScene(res);
        });
        Main.createLoading(Main.loadingType.one);//预创建HTTP请求加载中的资源
        // Main.createLoading(Main.loadingType.two);//预创建断线重连加载中的资源
        // Main.createLoading(Main.loadingType.three);//预创建带文字加载中的资源
        Main.createTipBox();
        // Main.getStatusHeight();
        Main.createDiaLog();
        this.loadArrLength = Main.loadScene.length;
    }

    dealWithBeforeLoadScene(res:any) {
        let progress = this.owner['progressBg'].getChildByName('progress');
        this.loadReturnArr.push(res);
        let $loadRate = parseInt(String((this.loadReturnArr.length / this.loadArrLength) * 100));
        progress.width = this.owner['progressBg'].width * ($loadRate / 100);
        this.owner['loadRate'].text = $loadRate + '%';
        if ($loadRate >= 100) {
            this.owner['loadText'].text = '加载完成,祝您好运!';
            setTimeout(() => {
                // if (!Main.wxGame && document.getElementById('startImg'))
                //     document.getElementById('startImg').style.display = 'none';
                Laya.Scene.open('Login.scene', true);
            }, 500);
        }
    }
}