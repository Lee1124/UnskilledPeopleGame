/**
 * 留坐
 */
import Main from '../common/Main';
import OpenDiaLog from '../Fuction/OpenDiaLog';
import MyCenter from '../common/MyCenter';
import MyClickSelect from '../common/MyClickSelect';
import websoket from '../Fuction/webSoketSend';
class setLiuZuo {
    //留坐选择的时间对应积分
    selectScore: number = 150;
    //对应的脚本
    liuzuoJS: any;
    open(): void {
        this.liuzuoJS = MyCenter.GameControlObj.owner['LiuZuo'].getComponent(OpenDiaLog);
        this.initLiuZuoList();
        this.initSelect();
        this.registerEvent(true);
        this.liuzuoJS.init(2, 0, this, null, () => {
            this.registerEvent(false);
        }, () => {
            this.liuzuoJS.open();
        })
    }

    /** 
     * 注册确定事件
    */
    registerEvent(isRegistr: boolean) {
        let comfrimBtn: any = this.liuzuoJS.owner.getChildByName("confrimBtn");
        if (isRegistr)
            comfrimBtn.on(Laya.Event.CLICK, this, this.comfrim);
        else
            comfrimBtn.off(Laya.Event.CLICK);
    }

    /**
     * 初始化留坐内容
     * @param liuzuoJS 脚本
     */
    initLiuZuoList(): void {
        let list = this.liuzuoJS.owner.getChildByName("selectListBox").getChildByName("selectList");
        list.visible = true;
        list.array = [
            { img: 'res/img/liuzuo/l_120.png', value: 150 },
            { img: 'res/img/liuzuo/l_300.png', value: 300 }
        ]
        list.renderHandler = new Laya.Handler(this, this.listRenderHandler);
    }

    initSelect(): void {
        this.selectScore = 150;
        let selectListBox = this.liuzuoJS.owner.getChildByName("selectListBox");
        let $MyClickSelect = selectListBox.getComponent(MyClickSelect);
        $MyClickSelect.MySelect(this, 0, (val: number) => {
            this.selectScore = val;
        })
    }

    listRenderHandler(cell: any): void {
        let $label: any = cell.getChildByName("listRow").getChildByName("label");
        $label.skin = cell.dataSource.img;
    }

    /**
     * 确定留坐
     */
    comfrim(): void {
        this.liuzuoJS.close();
        websoket.liuzuoRequest(true, this.selectScore);
    }

    /**
     * 留坐设置
     * @param thisPlayer 该玩家脚本对象
     * @param data 数据
     */
    palyerLiuZuoSet(thisPlayer: any, data: any) {
        let liuzuoView: any = thisPlayer.owner.getChildByName('liuzuo');
        let returnSeatBtn: any = liuzuoView.getChildByName('returnSeatBtn');
        let scoreView: any = thisPlayer.owner.getChildByName('score');
        returnSeatBtn.visible = data.userId == Main.userInfo.userId ? true : false;
        liuzuoView.visible = true;
        thisPlayer.liuzuoAllTime = data.seatAtTime - Main.getTimeChuo();
        thisPlayer.liuzuoAllTime = thisPlayer.liuzuoAllTime > data.totalTime ? data.totalTime : thisPlayer.liuzuoAllTime;
        scoreView.text = '留座' + thisPlayer.liuzuoAllTime + 's';
        Laya.timer.loop(1000, thisPlayer, thisPlayer.palyerLiuZuoTime, [scoreView]);
        if (data.userId == Main.userInfo.userId)
            this.returnBtnEvent(thisPlayer, true);
    }

    liuzuoTime(thisPlayer: any, scoreView: any): void {
        thisPlayer.liuzuoAllTime--;
        scoreView.text = '留座' + thisPlayer.liuzuoAllTime + 's';
        if (thisPlayer.liuzuoAllTime <= 0)
            Laya.timer.clear(thisPlayer, thisPlayer.palyerLiuZuoTime);
    }

    /**
     * 注册返回按钮事件
     */
    returnBtnEvent(thisPlayer: any, isRegistr: boolean): void {
        let returnSeatBtn: any = thisPlayer.owner.getChildByName('liuzuo').getChildByName('returnSeatBtn');
        if (isRegistr)
            returnSeatBtn.on(Laya.Event.CLICK, this, (e:any) => {
                e.stopPropagation();
                websoket.liuzuoRequest(false, 0);
            })
        else
            returnSeatBtn.off(Laya.Event.CLICK);
    }

    /**
     * 玩家留坐后回到座位上
     */
    playerReturnSeatSet(thisPlayer: any, data: any): void {
        let liuzuoView: any = thisPlayer.owner.getChildByName('liuzuo');
        let scoreView: any = thisPlayer.owner.getChildByName('score');
        Laya.timer.clear(thisPlayer, thisPlayer.palyerLiuZuoTime);
        scoreView.text = data.score;
        liuzuoView.visible = false;
        this.returnBtnEvent(thisPlayer,false);
    }
}
export default new setLiuZuo();