/**
 * 亲友圈得二级页面(我的玩家，我的收益，我的提现记录)
 */
import Main from '../../../../common/Main';
import Back from '../../../../common/Back';
import HttpReqContent from '../../../../common/HttpReqContent';
import MyCenter from '../../../../common/MyCenter';
export default class Friends2 extends Laya.Script {

    onStart() {
        this.setBack();
        this.registerEvent();
        MyCenter.req('sceneUrl1', (url: string) => {
            if (url == this.owner.scene.url)
                this.setPage();
        })
    }

    setBack() {
        let backJS: any = this.owner['back_btn'].getComponent(Back);
        backJS.initBack();
    }

    /**
     * 注册点击事件
     */
    registerEvent() {
        this.owner['tab_title']._children.forEach((item: any, index: number) => {
            item.on(Laya.Event.CLICK, this, this.selectThisTab, [index + 1])
        });
    }

    /**
    * 重置选中状态
    */
    reloadNavSelectZT() {
        this.owner['v2_tab_select']._children.forEach((item: any, index: number) => {
            item.visible = false;
        });
    }

    /**
     * 选中当前
     * @param {*} itemObj 选中对象
     */
    selectThisTab(pageNum: number): void {
        this.reloadNavSelectZT();
        this.owner['v2_tab_select'].getChildByName('s' + pageNum).visible = true;
        this.reqPage2Data();
    }

    setPage(): void {
        switch (this.owner['openedData']) {
            case 1:/**我的玩家 */
                this.reqPage1Data();
                break;
            case 2: /**我的收益 */
                this.selectThisTab(1);
                break;
            case 3:/**提现记录 */
                this.reqPage3Data();
                break;
        }
    }

    /**我的玩家 */
    reqPage1Data(): void {
        HttpReqContent.getMyPlayerNews(this, (res: any) => {
            Main.$LOG('亲友圈-我的玩家', res);
            let data: any = res.data;
            let view1: any = this.owner['view1'];
            let view1_1_box: any = view1.getChildByName('view1_1').getChildByName('view1_1_box');
            let view1_2_box: any = view1.getChildByName('view1_2').getChildByName('view1_2_box');
            let sjwjID: any = view1_1_box.getChildByName('sjwjID').getChildByName('val');
            let xjsl: any = view1_1_box.getChildByName('xjsl').getChildByName('val');
            let jrxz: any = view1_1_box.getChildByName('jrxz').getChildByName('val');
            let list: any = view1_2_box.getChildByName('tbody').getChildByName('list');
            sjwjID.text = data.JoinUid == -1 ? '暂无上级玩家' : data.JoinUid;
            xjsl.text = data.MemberCount;
            jrxz.text = data.DayAddMemberCount;
            list.array = data.Players;//[{Uid:111,Nick:'xm',PlayTimes:100,Time:1585652083},{Uid:111,Nick:'xm',PlayTimes:100,Time:1585652083}]
            list.vScrollBarSkin = '';
            list.renderHandler = new Laya.Handler(this, this.page1ListRender);
        })
    }
    page1ListRender(cell: any, index: number) {
        let c1: any = cell.getChildByName('c1');
        let c2: any = cell.getChildByName('c2');
        let c3: any = cell.getChildByName('c3');
        let c4: any = cell.getChildByName('c4');
        c1.text = cell.dataSource.Uid;
        c2.text = cell.dataSource.Nick;
        c3.text = cell.dataSource.PlayTimes;
        c4.text = Main.getDate(null, cell.dataSource.Time, true);
    }

    /**我的收益 */
    reqPage2Data(): void {
        HttpReqContent.getMyIncome(this, (res: any) => {
            Main.$LOG('亲友圈-我的收益', res);
            let data: any = res.data;
            this.owner['title_income1'].text = data.Income0;
            this.owner['title_income2'].text = data.Income1;
            this.owner['title_income3'].text = data.Income2;
            this.owner['nowPersonNumVal'].text = data.MemberCount;
            this.owner['todayGXVal'].text = data.TodayGX;
            this.owner['totalGXVal'].text = data.TotalGX;
            let list: any = this.owner['incomeList'];
            list.array = data.PlayersGX;
            list.vScrollBarSkin = '';
            list.renderHandler = new Laya.Handler(this, this.page2ListRender);
        })
    }

    page2ListRender(cell: any, index: number) {
        let c1: any = cell.getChildByName('c1');
        let c2: any = cell.getChildByName('c2');
        let c3: any = cell.getChildByName('c3');
        let c4: any = cell.getChildByName('c4');
        c1.text = cell.dataSource.Nick;
        c2.text = cell.dataSource.ToadyGX;
        c3.text = cell.dataSource.TotalGX;
        switch (cell.dataSource.State) {
            case 0:
                c4.text = '一级玩家';
                break;
            case 1:
                c4.text = '二级玩家';
                break;
            case 2:
                c4.text = '三级玩家';
                break;
        }
    }

    /**提现记录 */
    reqPage3Data(): void {
        HttpReqContent.getOutRecord(this, (res: any) => {
            Main.$LOG('亲友圈-提现记录', res);
            let data: any = res.data;
            let list: any = this.owner['outRecordList'];
            list.array = data.records;
            list.vScrollBarSkin = '';
            list.renderHandler = new Laya.Handler(this, this.page3ListRender);
        });
    }

    page3ListRender(cell: any, index: number) {
        let c1: any = cell.getChildByName('c1');
        let c2: any = cell.getChildByName('c2');
        let c3: any = cell.getChildByName('c3');
        c1.text = Main.getDate(null, cell.dataSource.RequestTime);
        c2.text = cell.dataSource.Money;
        switch (cell.dataSource.State) {
            case 0:
                c3.text = '申请中';
                break;
            case 1:
                c3.text = '审核中';
                break;
            case 2:
                c3.text = '已提现';
                break;
        }
    }
}