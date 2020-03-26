/**
 * 钱包
 */
import Main from '../../../common/Main';
import HttpReqContent from '../../../common/HttpReqContent';
import openOutDiaLog from '../../../common/openOutDiaLog';
import outPwdKeyBoard from '../../../common/outPwdKeyBoard';
export default class Wallet extends Laya.Script {
    //选中的类型,默认充值
    private _selectNavType: number = 1;
    //可提现金额
    allowMoney: number = 0;
    //是否设置过提现密码
    private isSetPwd: boolean = false;
    //提现类型 0=银行卡 1=支付宝 2=微信
    private outType: number = 0;
    // //提现密码
    // private outPwd: number = 111111;
    onStart(): void {

    }
    onAwake(): void {
        // this.pageList = this.owner.scene.hall_list;
        this.registerEvent();
    }
    openThisPage() {
        if (this.owner['visible']) {
            console.log('进来wallet', this);
            this.selectThisTab(this.owner.scene.wallet_nav_bg._children[0], 1);//默认选择第一项
            // this.UI = this.owner.scene;
            // this.requestPageData();
            // this.initOpenView();
        }
    }

    /**
     * 注册点击事件
     */
    registerEvent() {
        this.owner.scene.wallet_nav_bg._children.forEach((item: any, index: number) => {
            item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index + 1])
        });
    }

    /**
     * 重置选中状态
     */
    reloadNavSelectZT() {
        this.owner.scene.wallet_nav_bg._children.forEach((item: any, index: number) => {
            item.getChildByName("selectedBox").visible = false;
        });
    }

    /**
     * 选中当前
     * @param {*} itemObj 选中对象
     */
    selectThisTab(itemObj: any, pageNum: number): void {
        this.reloadNavSelectZT();
        itemObj.getChildByName("selectedBox").visible = true;
        this._selectNavType = pageNum;
        this.changePages(pageNum);

        // this.requestPageData(true);
    }

    //页面的切换
    changePages(num: number): void {
        //显示选中的页面，隐藏非选中的页面
        this.owner.scene.wallet_view_bg._children.forEach((item: any, index: number) => {
            item.visible = item.name.split('view')[1] == num ? true : false;
            if (item.name.split('view')[1] == num)
                this.changePageData(num);
        });
    }

    //切换页面时请求的数据
    changePageData(num: number): void {
        switch (num) {
            case 1:
                this.setView1Data();
                break;
            case 2:
                this.setView2Data();
                break;
            case 3:
                this.setView3Data();
                break;
        }
    }

    /**
     * 页面1的数据
     */
    setView1Data(): void {
        HttpReqContent.getUserNews(this, (res: any) => {
            Main.$LOG('设置提现页面数据：', res);
            let data: any = res.data;
            let userNewsView: any = this.owner.scene.wallets_view1.getChildByName('userNews');
            let head: any = userNewsView.getChildByName('headBg').getChildByName('head');
            let userId: any = userNewsView.getChildByName('userId').getChildByName('userIdVal');
            let userCoin: any = userNewsView.getChildByName('userCoin').getChildByName('userCoinVal');
            Main.$LoadImage(head, data.head, Main.defaultData.head1, 'skin');
            userId.text = data.userId;
            userCoin.text = data.score;
        })
    }
    /**
     * 页面2的数据
     */
    setView2Data(): void {
        HttpReqContent.walletSearch(this, (res: any) => {
            Main.$LOG('钱包查询：', res);
            this.isSetPwd = res.data.IsPsw;
            this.allowMoney = res.data.Money;
            this.setView2Page();
        });
    }
    /**
     * 设置
     */
    setView2Page(): void {
        let view2_1: any = this.owner.scene.wallets_view2.getChildByName('view2_1');
        let view2_2: any = this.owner.scene.wallets_view2.getChildByName('view2_2');
        let allowMoney: any = view2_2.getChildByName('allowOut').getChildByName('allowVal');
        allowMoney.text = this.allowMoney;
        view2_1.visible = false;
        view2_2.visible = false;
        view2_1.visible = this.isSetPwd ? false : true;
        view2_2.visible = this.isSetPwd ? true : false;
        if (!this.isSetPwd) {
            let setPwdBtn: any = view2_1.getChildByName('comfrimBtn');
            setPwdBtn.off(Laya.Event.CLICK);
            setPwdBtn.on(Laya.Event.CLICK, this, this.setPwdComfrim, [view2_1]);
        } else {
            let reqOutBtn: any = view2_2.getChildByName('btn');
            let inputView: any = view2_2.getChildByName('inputView');
            let name: any = inputView.getChildByName('view1').getChildByName('input');
            let cardNum: any = inputView.getChildByName('view2').getChildByName('input');
            let bankName: any = inputView.getChildByName('view3').getChildByName('input');
            let outPrice: any = inputView.getChildByName('view4').getChildByName('input');
            name.text = cardNum.text = bankName.text = outPrice.text = '';
            reqOutBtn.off(Laya.Event.CLICK);
            reqOutBtn.on(Laya.Event.CLICK, this, this.reqOut, [view2_2]);
        }
    }
    /**
     * 申请提现
     * @param view2_2
     */
    reqOut(view2_2: any) {
        let inputView: any = view2_2.getChildByName('inputView');
        let name: any = inputView.getChildByName('view1').getChildByName('input').text;
        let cardNum: any = inputView.getChildByName('view2').getChildByName('input').text;
        let bankName: any = inputView.getChildByName('view3').getChildByName('input').text;
        let outPrice: any = inputView.getChildByName('view4').getChildByName('input').text;
        if (Main.strIsNull(name)) {
            Main.showDiaLog('请您输入真实姓名!');
            return false;
        } else if (Main.strIsNull(cardNum)) {
            Main.showDiaLog('请您输入银行卡号!');
            return false;
        } else if (Main.strIsNull(bankName)) {
            Main.showDiaLog('请您输入银行名字!');
            return false;
        } else if (Main.strIsNull(outPrice)) {
            Main.showDiaLog('请您输入金额!');
            return false;
        }
        if (outPrice > this.allowMoney) {
            Main.showDiaLog('提现金额不能大于可用提现金额!');
            return false;
        }
        

        let diaLogJS: any = Laya.stage.getChildByName('diaLog').getComponent(openOutDiaLog);
        diaLogJS.open1();
        let keyboardJS = Laya.stage.getChildByName('diaLog').getChildByName('pwdkeyboard').getComponent(outPwdKeyBoard);
        keyboardJS.init(this, (val: any) => {
            let data: any = {
                uid: Main.userInfo.userId,
                psw: val,
                money: outPrice,
                type: this.outType,
                username: name,
                cardnumber: cardNum,
                bankname: bankName
            }
            HttpReqContent.reqOutMoney(this, data, (res: any) => {
                Main.$LOG('提现申请：', res);
                diaLogJS.clickMask('pwdkeyboard');
                Main.showDiaLog('提现申请成功!', 1, () => {
                    this.setView2Data();
                })
            })
        })
    }

    /**
     * 设置提现密码确认
     */
    setPwdComfrim(view2_1: any) {
        let pwd1Text: any = view2_1.getChildByName('inputView').getChildByName('input1').getChildByName('input').text;
        let pwd2Text: any = view2_1.getChildByName('inputView').getChildByName('input2').getChildByName('input').text;
        if (/^\d{6}$/.test(pwd1Text) && /^\d{6}$/.test(pwd2Text)) {
            if (pwd1Text === pwd2Text) {
                let data = {
                    uid: Main.userInfo.userId,
                    psw: parseInt(pwd2Text)
                }
                HttpReqContent.setOutPwd(this, data, (res: any) => {
                    Main.$LOG('设置密码：', res);
                    Main.showDiaLog('设置成功!', 1, () => {
                        this.isSetPwd = true;
                        this.setView2Page();
                    })
                })
            } else {
                Main.showDiaLog('您输入的两次密码不相同!');
            }
        } else {
            Main.showDiaLog('请您输入6位数字密码!');
        }
    }
    /**
     * 页面3的数据
     */
    setView3Data(): void {
        HttpReqContent.searchReqOutList(this, (res: any) => {
            Main.$LOG('查询申请提现列表：', res);
            let v3List: any = this.owner.scene.wallets_view3.getChildByName('tbodyView').getChildByName('v3List');
            v3List.visible = true;
            v3List.vScrollBarSkin = '';
            v3List.array = res.data.records;
            v3List.renderHandler = new Laya.Handler(this, this.v3ListRender);
        });
    }

    //查询表格的渲染
    v3ListRender(cell: any, index: number): void {
        let c1: any = cell.getChildByName('c1');
        let c2: any = cell.getChildByName('c2');
        let c3: any = cell.getChildByName('c3');
        let c4: any = cell.getChildByName('c4');
        c2.text = cell.dataSource.Money;
        c3.text = Main.getDate(null, cell.dataSource.RequestTime);
        switch (cell.dataSource.Type) {//类型 0=银行卡 1=支付宝 2=微信  
            case 0:
                c1.text = '银行卡';
                break;
            case 1:
                c1.text = '支付宝';
                break;
            case 2:
                c1.text = '微信';
                break;
        }
        switch (cell.dataSource.State) {//该条记录的状态 =0申请中，=1生何种 =2已提现
            case 0:
                c4.text = '申请中';
                break;
            case 1:
                c4.text = '审核中';
                break;
            case 2:
                c4.text = '已提现';
                break;
        }

    }
}