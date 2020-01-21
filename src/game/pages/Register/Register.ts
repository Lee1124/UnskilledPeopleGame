/**
 * 注册(修改密码)
 */
import Back from '../../common/Back';
import Main from '../../common/Main';
export default class RegisterUI extends Laya.Script {
    //页面标志(2.注册 3.修改密码)
    page: number;
    onStart(): void {
        this.page = this.owner['pageData'].page;
        this.setPageData();
        this.initBack();
    }
    /**设置页面参数 */
    setPageData(): void {
        this.owner['title_1'].visible = this.page == Main.sign.register ? true : false;
        this.owner['title_2'].visible = this.page == Main.sign.changePwd ? true : false;
        this.owner['register_btn'].visible = this.page == Main.sign.register ? true : false;
        this.owner['change_btn'].visible = this.page == Main.sign.changePwd ? true : false;
    }
    //初始化返回
    initBack(): void {
        let backJS = this.owner['back_btn'].getComponent(Back);
        backJS.initBack(1, 'Login.scene', Main.sign.signOut);
        return backJS;
    }
}