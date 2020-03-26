/**
 * 提现交易处的键盘设置
 */
export default class PwdKeyBoard extends Laya.Script {
    //输入的密码
    pwd: any = '';
    //callback回调函数
    callback: any;
    //执行域
    that: any;
    /**
     * 初始化
     * @param that 执行域
     * @param fn 回调函数
     */
    init(that: any, fn: Function) {
        this.that = that;
        this.callback = fn;
        this.pwd='';
        this.showPwd();
    }
    onAwake() {
        this.setKeyBoard();
    }

    setKeyBoard(): void {
        let list: any = this.owner.getChildByName('keyboardView').getChildByName('list');
        list.array = [
            { id: 1, icon: 'res/img/keyBoard/1.png' },
            { id: 2, icon: 'res/img/keyBoard/2.png' },
            { id: 3, icon: 'res/img/keyBoard/3.png' },
            { id: 4, icon: 'res/img/keyBoard/4.png' },
            { id: 5, icon: 'res/img/keyBoard/5.png' },
            { id: 6, icon: 'res/img/keyBoard/6.png' },
            { id: 7, icon: 'res/img/keyBoard/7.png' },
            { id: 8, icon: 'res/img/keyBoard/8.png' },
            { id: 9, icon: 'res/img/keyBoard/9.png' },
            { id: 10, icon: 'res/img/keyBoard/qc.png' },
            { id: 0, icon: 'res/img/keyBoard/0.png' },
            { id: 11, icon: 'res/img/keyBoard/return.png' },
        ];
        list.renderHandler = new Laya.Handler(this, this.listRender);
        list.mouseHandler = new Laya.Handler(this, this.listClick);
    }

    listRender(cell: any, index: number): void {
        let text: any = cell.getChildByName('numBg').getChildByName('text');
        text.skin = cell.dataSource.icon;
    }

    listClick(Event: any): void {
        if (Event.type == 'click') {
            let clickId: number = Event.target.dataSource.id;
            if (clickId != 10 && clickId != 11 && this.pwd.length < 6) {
                this.pwd += clickId;
                this.showPwd();
            }
            if (clickId == 10) {
                this.pwd = '';
                this.showPwd();
            }
            if (clickId == 11) {
                this.pwd = this.pwd.substr(0, this.pwd.length - 1);
                this.showPwd();
            }
        }
    }

    showPwd(): void {
        let pwdView: any = this.owner.getChildByName('pwdView').getChildByName('box');
        for (let i = 0; i < 6; i++) {
            let pwdIcon: any = pwdView.getChildAt(i).getChildByName('pwd');
            pwdIcon.visible = false;
        }
        for (let i = 0; i < this.pwd.length; i++) {
            let pwdIcon: any = pwdView.getChildAt(i).getChildByName('pwd');
            pwdIcon.visible = true;
        }
        if (this.callback && this.pwd.length >= 6) {
            this.callback.call(this.that, this.pwd);
        }
    }
}