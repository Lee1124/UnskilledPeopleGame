/**
 * 亲友圈
 */
import Main from '../../../common/Main';
import HTTP from '../../../common/HttpRequest';
import OpenView from '../../../common/openView';
import HttpReqContent from '../../../common/HttpReqContent';
export default class Friends extends Laya.Script {
    //红利余额
    allHLNum: number = 0;
    onStart(): void {
        this.initOpenView();
    }
    onAwake(): void {
        // this.pageList = this.owner.scene.hall_list;
        this.registerEvent();
    }
    openThisPage() {
        if (this.owner['visible']) {
            Main.$LOG('进来亲友圈friends', this, Main.familyRoomInfo);
            this.setPageView();
            if (Main.familyRoomInfo.IsJoin && Main.familyRoomInfo.IsProm)
                this.reqPageData();
        }
    }

    /**设置页面 */
    setPageView(): void {
        this.owner.scene.f1_view0.visible = !Main.familyRoomInfo.IsProm ? true : false;
        this.owner.scene.f1_view1.visible = Main.familyRoomInfo.IsProm ? true : false;
        if (!Main.familyRoomInfo.IsProm) {
            let createBtn: any = this.owner.scene.f1_view0.getChildByName('createBtn');
            createBtn.off(Laya.Event.CLICK);
            createBtn.on(Laya.Event.CLICK, this, () => {
                Main.showDiaLog('确定创建亲友圈?', 2, () => {
                    HttpReqContent.createFamily(this, (res: any) => {
                        Main.$LOG('创建亲友圈：', res);
                        Main.familyRoomInfo.IsProm = true;
                        this.openThisPage();
                    })
                })
            })
        }
    }

    initOpenView(): void {
        //我的玩家详情
        let OpenViewJS1 = this.owner.scene.xq1.getComponent(OpenView);
        OpenViewJS1.initOpen(0, 'Friends.scene', false, 1, 0);

        //我的玩家详情
        let OpenViewJS2 = this.owner.scene.xq2.getComponent(OpenView);
        OpenViewJS2.initOpen(0, 'Friends.scene', false, 2, 0);

        //我的玩家详情
        let OpenViewJS3 = this.owner.scene.xq3.getComponent(OpenView);
        OpenViewJS3.initOpen(0, 'Friends.scene', false, 3, 0);
    }

    /**
     * 注册点击事件
     */
    registerEvent() {
        this.owner.scene.tqhlBtn.on(Laya.Event.CLICK, this, this.tqhl)
    }

    /**
     * 提取红利
     */
    tqhl(): void {
        if (this.allHLNum > 0)
            Main.showDiaLog('提取红利', 2, () => {
                HttpReqContent.reqHLOut(this, (res: any) => {
                    Main.$LOG('红利提现申请：', res);
                    Main.showDiaLog('红利成功提现至钱包', 1, () => {
                        this.reqPageData();
                    });
                })
            });
        else
            Main.showDiaLog('红利余额必须大于0才能提取!', 1);
    }

    /**获取页面信息 */
    reqPageData(): void {
        HttpReqContent.getFriendsNew(this, (res: any) => {
            Main.$LOG('获取亲友圈一级页面内容：', res)
            let data: any = res.data;
            this.allHLNum = data.Money;
            let view1: any = this.owner.scene.f_view1.getChildByName('viewBox');
            let view2: any = this.owner.scene.f_view2;
            console.log(view2.height)
            let view2_listBox:any=view2.getChildByName('listBox');
            view2_listBox.vScrollBarSkin='';
            let hlye: any = view1.getChildByName('hlShow');
            let allOutPrice: any = view1.getChildByName('ljtx').getChildByName('val');
            let zs: any = view2_listBox.getChildByName('v2_box1').getChildByName('zs').getChildByName('val');
            let jrxz: any = view2_listBox.getChildByName('v2_box1').getChildByName('jrxz').getChildByName('val');
            let ljsy: any = view2_listBox.getChildByName('v2_box2').getChildByName('ljsy').getChildByName('val');
            let jrxzM: any = view2_listBox.getChildByName('v2_box2').getChildByName('jrxz').getChildByName('val');
            let sqzje: any = view2_listBox.getChildByName('v2_box3').getChildByName('sqzje').getChildByName('val');
            let sbje: any = view2_listBox.getChildByName('v2_box3').getChildByName('sbje').getChildByName('val');
            let Money: string = String(data.Money);
            for (let i = 0; i < hlye._children.length; i++) {
                let textVal: any = hlye.getChildAt(hlye._children.length - i - 1).getChildByName('val');
                textVal.text = Money.substr(Money.length - 1 - i, 1);
            }
            allOutPrice.text = data.AllOutMoney;
            zs.text = data.MemberCount;
            jrxz.text = data.DayAddMemberCount;
            ljsy.text = data.AllAddMoney;
            jrxzM.text = data.DayAddMoney;
            sqzje.text = data.ReOutMoney;
            sbje.text = data.FailOutMoney;
        });
    }
}