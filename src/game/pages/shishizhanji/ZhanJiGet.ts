import HTTP from '../../common/HttpRequest';
import Main from '../../common/Main';
import Back from '../../common/Back';
import MyCenter from '../../common/MyCenter';
export default class zhanji extends Laya.Script {
    //时间ID
    TimeID:any;
    onStart() {
        let that = this;
        Main.$LOG('组件信息：', this);
        this.initJS();
        console.log(this.owner.scene.url)
        MyCenter.req('sceneUrl', (res: any) => {
            if (res == this.owner.scene.url)
                that.getPageData();
        });
    }

    /**
     * 初始化脚本数据
     */
    initJS(): void {
        let backJS: any = this.owner['diaLogMask'].getComponent(Back);
        backJS.initBack(0, 1);
    }

    // 显示菜单完成
    getPageData() {
        HTTP.$request({
            that: this,
            url: '/M.Games.YDR.Ext/YDRRecord/RealTimeRecord',
            data: {
                uid: Main.userInfo.userId,
                roomid: MyCenter.GameControlObj.roomId
            },
            success(res: any) {
                console.log(res)
                if (res.data.ret.type == 0) {
                    this.setPageData(res.data.data);
                } else {
                    Main.showTip(res.data.ret.msg);
                }
            }
        })
    }

    setPageData(data:any) {
        Main.$LOG('获取实时战绩的表格1数据：', data);
        if (this.TimeID) {
            clearInterval(this.TimeID);
        }
        this.TimeID = setInterval(() => {
            data.end_time--;
            this.owner['roomLastTime'].text = Main.secondToDate(data.end_time);
            if (data.end_time == 0) {
                clearInterval(this.TimeID);
            }
        }, 1000);
        this.owner['allDaiRuValue'].text = data.all_dairu;
        this.owner['allGetScore'].text = data.all_sf;
        setTimeout(() => {
            this.owner['weiGuanTitle'].width = this.owner['weiGuanTitle'].getChildAt(0).textWidth;
        })
        this.owner['weiGuanTitle'].text = '（' + data.onlooker.length + '）';
        this.setList1(data.dairu);
        this.setList2(data.onlooker);
    }

    setList1(data) {
        let list1 = this.owner['zhanjiList'];
        list1.visible = true;
        list1.vScrollBarSkin = "";//运用滚动
        list1.array = data;
        list1.renderHandler = new Laya.Handler(this, this.list1OnRender);
    }

    list1OnRender(cell:any, index:number) {
        let name = cell.getChildByName("name");
        let dairu = cell.getChildByName("dairu");
        let score = cell.getChildByName("score");
        name.text = cell.dataSource.nick;
        dairu.text = cell.dataSource.dairu;
        score.text = cell.dataSource.sf;
        if (parseInt(score.text) === 0) {
            score.color = '#935F13';
        } else if (score.text.indexOf('+') != -1) {
            score.color = '#c53233';
        } else if (score.text.indexOf('-') != -1) {
            score.color = '#599E73';
        }
    }

    setList2(data:any) {
        let list2 = this.owner['PersonList'];
        list2.visible = true;
        list2.vScrollBarSkin = "";//运用滚动
        list2.array = data;
        list2.renderHandler = new Laya.Handler(this, this.list2OnRender);
    }

    list2OnRender(cell:any, index:number) {
        let name = cell.getChildByName("name");
        let head = cell.getChildByName("headBg").getChildByName("head");
        // let headUrl = 'res/img/head/' + cell.dataSource.head + '.png';
        Main.$LoadImage(head, cell.dataSource.head, Main.defaultData.head1, 'skin');
        name.text = cell.dataSource.nick;
    }
}