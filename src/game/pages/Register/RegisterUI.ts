/**
 * 注册(修改密码)
 */
import Main from '../../common/Main';
import Register from './Register';
export default class RegisterUI extends Laya.Scene {
    //场景传的值
    pageData:any;
    //注册界面的脚本
    private _RegisterJS:any;
    onAwake(): void {
        this._RegisterJS = this.getComponent(Register);
        this['register_btn'].on(Laya.Event.CLICK, this, this.comfirmRegisterOrChange);
        this['change_btn'].on(Laya.Event.CLICK, this, this.comfirmRegisterOrChange);
    }
    onOpened(options:any){
        this.pageData=options;
        this.setUI();
    }

    comfirmRegisterOrChange():void{
        this._RegisterJS.comfirmRegisterOrChange();
    }

    setUI(){
        let nodeArr = [this['register_list']]
        Main.setNodeTop(nodeArr);
    }
}