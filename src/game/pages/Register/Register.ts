/**
 * 注册(修改密码)
 */
import Back from '../../common/Back';
import Main from '../../common/Main';
import HTTP from '../../common/HttpRequest';
export default class RegisterUI extends Laya.Script {
    //页面标志(2.注册 3.修改密码)
    page: number;
    //开关
    flag:boolean=true;
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
        let backJS:any = this.owner['back_btn'].getComponent(Back);
        backJS.initBack(1, 0,'Login.scene', Main.sign.signOut);
        return backJS;
    }

    comfirmRegisterOrChange(): void{
        let that = this;
        let user:any = this.owner['phone_value'].text;
        let pwd :any= this.owner['pwd_value'].text;
        let code :any= this.owner['code_value'].text;
        Main.showLoading(true);
        if (user == "") {
            this.flag = true;
            Main.showLoading(false);
            Main.showDiaLog('手机号不能为空！!');
            return
        } else if (pwd == "") {
            this.flag = true;
            Main.showLoading(false);
            Main.showDiaLog('密码不能为空!');
            return
        } else if (code == "") {
            this.flag = true;
            Main.showLoading(false);
            Main.showDiaLog('验证码不能为空!');
            return
        }
        let data:any = {
            name: user,
            pws: pwd,
            code: code
        }
        if (this.page == Main.sign.changePwd) {
            data = {
                name: user,
                now: pwd,
                code: code
            }
        }
        let url = this.page == Main.sign.register ? "/M.Acc/Register" : "/M.Acc/ModifyPws";
        HTTP.$request({
            that: this,
            url: url,
            data: data,
            success(res:any) {
                if (res.data.ret.type == 0) {
                    this.flag = true;
                    Main.showLoading(false);
                    let data:any = {
                        user: user,
                        pwd: pwd,
                    }
                    if (Main.wxGame) {
                        // wx.setStorageSync('userInfo', data);
                    } else {
                        localStorage.setItem('userInfo', JSON.stringify(data)); //转化为JSON字符串)
                    }
                    // localStorage.setItem('userInfo', JSON.stringify(data)); //转化为JSON字符串)
                    if (this.page == Main.sign.register) {
                        Main.showDiaLog('注册成功,返回登录', 1, () => {
                            that.back();
                        });
                    } else {
                        Main.showDiaLog('修改成功');
                    }
                } else {
                    this.flag = true;
                    Main.showLoading(false);
                    Main.showDiaLog(res.data.ret.msg);
                }
            },
            fail() {
                this.flag = true;
                Main.showLoading(false);
            },
            timeout() {
                this.flag = true;
            }
        })
    }
    //返回等登录页
    back() {
        let backJS:any = this.initBack();
        backJS.back();
    }
}