import Main from '../../common/Main';
import LOGIN from './Login';
// import MyCenter from '../../common/MyCenter'

/**
 * 该脚本继承登录页面的场景，为了方便获取UI组件等...
 */
export default class Login extends Laya.Scene {
    //登录状态
    loginState:any= null;
    onAwake() {
        this.registerEvent();
    }
    /**注册事件 */
    registerEvent():void{
        this['login_btn'].on(Laya.Event.CLICK, this, this.login,[this.getComponent(LOGIN)]);
    }
    onOpened(options:any) {
        // this.opendNumber = 0;
        this.loginState = options ? options : null;
        // this.initPage();
    }
    login(loginJS:any) {
        loginJS.login();
    }
}