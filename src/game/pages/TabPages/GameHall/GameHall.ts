import Main from '../../../common/Main';
import HTTP from '../../../common/HttpRequest';
// import dropDownReload from '../../common/dropDownReload';
// import AUTO from '../../../common/AUTO';
// import TabPagesUI from '../TabPages/TabPagesUI'
export default class GameHall extends Laya.Script {
    //游戏大厅页面类型  全部， 小 ，中， 大
    private _navType: any = {
        all: 1,
        small: 2,
        center: 3,
        big: 4
    }
    //选中的类型
    private _selectNavType: number = 1;
    //脚本所属的scene
    UI: any;
    //页面列表
    pageList: any;

    onAwake(): void {
        this.pageList = this.owner.scene.hall_list;
        this.registerEvent();
    }
    onEnable(): void {
        Main.$LOG('Hall游戏大厅脚本：', this);
    }

    openThisPage(): void {
        if (this.owner['visible']) {
            this.UI = this.owner.scene;
            this.selectThisTab(this.owner.scene.hall_nav_bg._children[0], 1);//默认选择第一项
            if (Main.hall['allowRepuest'])
                Laya.timer.loop(60000, this, this.requestPageData, [false]);
        }
    }



    /**
     * 注册点击事件
     */
    registerEvent() {
        this.owner.scene.hall_nav_bg._children.forEach((item: any, index: number) => {
            item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index])
        });
    }
    /**
     * 重置选中状态
     */
    reloadNavSelectZT() {
        this.owner.scene.hall_nav_bg._children.forEach((item: any, index: number) => {
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
        this.requestPageData(true);
    }

    /**
     * 设置全页面的数据
     */
    setPage1Data(data:any):void {
        // if (Main.AUTO&&(this.UI.pageData.roomPws<=0||!this.UI.pageData.roomPws))
        //     AUTO.initHall(this, data);
        let page1List = this.UI.hall_list;
        // page1List.top=100;
        // let hallListHeight=page1List.height;
        page1List.vScrollBarSkin = "";
        page1List.array = data;
        page1List.renderHandler = new Laya.Handler(this, this.page1ListOnRender);
        page1List.mouseHandler = new Laya.Handler(this, this.rowOnClick);
        // this.watchListMove(page1List);
        page1List.visible = true;
    }

    /**
     * 监听列表下拉事件
     * @param {*} list 列表
     */
    // watchListMove(list) {
    //     let listJS = list.getComponent(dropDownReload);
    //     listJS.initCall(this, (val, fn) => {
    //         // console.log(val)
    //         this.callFn = fn;
    //         setTimeout(() => {
    //             this.selectThisTab(this.UI.hall_nav_bg._children[this._selectNavType], this._selectNavType);//默认选择第一项
    //         }, 500);
    //     });
    // }

    page1ListOnRender(cell:any, index:number):void {
        // let contentBg = cell.getChildByName("content_bg");
        // let roomId = contentBg.getChildByName("roomID").getChildByName("value");
        // let pi = contentBg.getChildByName("num1").getChildByName("value");
        // let online = contentBg.getChildByName("online").getChildByName("value");
        // let time = contentBg.getChildByName("time").getChildByName("value");
        // let roomLastTime = contentBg.getChildByName("lastTime").getChildByName("value");
        // let state_0 = contentBg.getChildByName("state").getChildByName("state_0");
        // let state_1 = contentBg.getChildByName("state").getChildByName("state_1");
        // let state_2 = contentBg.getChildByName("state").getChildByName("state_2");
        // let state_dairu = contentBg.getChildByName("yidairuState");
        // roomId.text = cell.dataSource.roomPws;
        // pi.text = cell.dataSource.dizhu;
        // online.text = cell.dataSource.participate + '/' + cell.dataSource.number;
        // if (cell.dataSource.participate == 0) {
        //     online.color = '#d59b2a';
        // } else if (cell.dataSource.participate > 0 && cell.dataSource.participate < cell.dataSource.number) {
        //     online.color = '#66ce38';
        // } else if (cell.dataSource.participate == cell.dataSource.number) {
        //     online.color = '#FF0000';
        // }
        // time.text = cell.dataSource.roomTime + '分钟';
        // state_0.visible = cell.dataSource.participate == 0 && !cell.dataSource.gameStatus ? true : false;
        // state_1.visible = cell.dataSource.participate > 0 && !cell.dataSource.gameStatus ? true : false;
        // state_2.visible = cell.dataSource.gameStatus ? true : false;
        // state_dairu.visible = cell.dataSource.dairu ? cell.dataSource.dairu : false;
        // let roomEndTime = (cell.dataSource.time - Main.getTimeChuo()) < 0 ? 0 : cell.dataSource.time - Main.getTimeChuo();
        // roomLastTime.text = Main.secondToDate(roomEndTime);
    }

    rowOnClick(Event, index) {
        // Main.$LOG('游戏大厅点击列表0:', Event);
        // if (Event.type == 'click') {
        //     // Main.$LOG('游戏大厅点击列表:', Event.target, Event.target.dataSource);
        //     let data = {
        //         roomPws: Event.target.dataSource.roomPws,
        //         page: Main.pages.page3
        //     }
        //     Main.showLoading(true, Main.loadingType.three, '正在进入房间...');
        //     Main.$openScene('cheXuanGame_8.scene', true, data, () => {
        //         Main.showLoading(false, Main.loadingType.three, '');
        //     });
        // }

        if (Event.type == 'click') {
            // Main.$LOG('游戏大厅点击列表:', Event.target, Event.target.dataSource);
            // let data = {
            //     roomPws: Event.target.dataSource.roomPws,
            //     page: Main.pages.page3
            // }
            // Main.showLoading(true, Main.loadingType.three, '正在进入房间...');
            Main.$openScene('Game.scene', true, null, () => {
                // Main.showLoading(false, Main.loadingType.three, '');
            });
        }
    }

    /**
     * 获取页面数据
     * @param isShowLoading 是否显示加载图标
     */
    requestPageData(isShowLoading: boolean): void {
        // this.pageList.visible = true;
        // this.pageList.array = [1,2,3,4,5,6];
        // this.pageList.vScrollBarSkin = "";
        // this.pageList.mouseHandler = new Laya.Handler(this, this.rowOnClick);
        if (!Main.hall.allowRepuest)
            Laya.timer.clear(this, this.requestPageData);//, [false]
        else {
            if (isShowLoading)
                Main.showLoading(true);
            let data = {
                uid: Main.userInfo.userId
            }
            HTTP.$request({
                that: this,
                url: '/M.Games.CX/GetRoomList',
                data: data,
                success(res: any) {
                    Main.$LOG('获取大厅列表数据：', res);
                    if (isShowLoading)
                        Main.showLoading(false);
                    if (res.data.ret.type == 0) {
                        if (this.callFn) {
                            this.callFn('刷新成功');
                            this.callFn = null;
                            setTimeout(() => {
                                this.dealWithResData(res.data.rooms);
                            }, 500)
                        } else {
                            this.dealWithResData(res.data.rooms);
                        }
                        this.openGameView();
                    } else {
                        Main.showDiaLog(res.data.ret.msg, 1);
                    }
                },
                fail() {
                    if (isShowLoading)
                        Main.showLoading(false);
                    Main.showDiaLog('网络异常!', 1);
                    if (this.callFn) {
                        this.callFn('刷新失败');
                        this.callFn = null;
                    }
                }
            })
        }
    }

    /**
  * 是否打开游戏界面
  */
    openGameView():void {
        let data:any = this.UI.pageData;
        if (data.roomPws && data.roomPws > 0) {
            Main.showLoading(true, Main.loadingType.three, '正在进入房间...');
            let pageData = {
                roomPws: data.roomPws,
                page: Main.pages.page3
            }
            Main.$openScene('cheXuanGame_8.scene', true, pageData, () => {
                Main.showLoading(false, Main.loadingType.three, '');
            })
        }
    }

    /**
     * 处理请求回来的数据
     * @param {*} data 返回的数据
     */
    dealWithResData(data:any):void {
        let listData:any = data;
        let getYESdairudata = listData.filter((item:any)=> item.dairu);
        let getNOdairudata = listData.filter((item:any) => !item.dairu);
        let getYESdairudata_pi = getYESdairudata.sort(this.compare('dizhu'));
        let getNOdairudata_pi = getNOdairudata.sort(this.compare('dizhu'));
        let getYESdairudata_pi_youkongwei = getYESdairudata_pi.filter((item:any) => item.participate > 0 && item.participate < item.number);
        let getYESdairudata_pi_yiman = getYESdairudata_pi.filter((item:any) => item.participate == item.number);
        let getYESdairudata_pi_kongfangjian = getYESdairudata_pi.filter((item:any) => item.participate == 0);
        let getYESdairudata_pi_lastData = (getYESdairudata_pi_youkongwei.concat(getYESdairudata_pi_yiman)).concat(getYESdairudata_pi_kongfangjian);
        let getNOdairudata_pi_youkongwei = getNOdairudata_pi.filter((item:any) => item.participate > 0 && item.participate < item.number);
        let getNOdairudata_pi_yiman = getNOdairudata_pi.filter((item:any) => item.participate == item.number);
        let getNOdairudata_pi_kongfangjian = getNOdairudata_pi.filter((item:any) => item.participate == 0);
        let getNOdairudata_pi_lastData = (getNOdairudata_pi_youkongwei.concat(getNOdairudata_pi_yiman)).concat(getNOdairudata_pi_kongfangjian);
        listData = getYESdairudata_pi_lastData.concat(getNOdairudata_pi_lastData);
        // console.log(getYESdairudata_pi_lastData.concat(getNOdairudata_pi_lastData))
        if (this._selectNavType == this._navType.all) { //全部
            listData = listData;
            this.setPage1Data(listData);
        } else if (this._selectNavType == this._navType.small) {//小
            listData = listData.filter((item:any) => item.dizhu >= 1 && item.dizhu <= 5);
            this.setPage1Data(listData);
        } else if (this._selectNavType == this._navType.center) {//中
            listData = listData.filter((item:any) => item.dizhu >= 10 && item.dizhu <= 20);
            this.setPage1Data(listData);
        } else if (this._selectNavType == this._navType.big) {//大s
            listData = listData.filter((item:any) => item.dizhu >= 50 && item.dizhu <= 100);
            this.setPage1Data(listData);
        }
    }

    compare(property, desc = true) {
        return function (a:any, b:any) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc == true) {
                // 升序排列
                return value1 - value2;
            } else {
                // 降序排列
                return value2 - value1;
            }
        }
    }
}