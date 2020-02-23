/**
 * 设置菜单内容
 */
import Main from '../common/Main';
import websoket from '../Fuction/webSoketSend';
import OpenDiaLog from '../Fuction/OpenDiaLog';
import MyCenter from '../common/MyCenter';
import step_1 from '../Fuction/step_1_seatAtOrDown';
import setLiuZuo from '../Fuction/set_content_liuzuo';
class setMenu {
    //菜单列表
    menuList: any;
    init(thisUI: any): void {
        this.menuList = thisUI.menu.getChildByName('menuList');
        this.menuList.array = Main.loadMenuImgArr;
        this.menuList.renderHandler = new Laya.Handler(this, this.menuListOnRender);
        this.menuList.mouseHandler = new Laya.Handler(this, this.menuListOnClick);

    }

    menuListOnRender(cell: any, index: number): void {
        cell.id = index + 1;
        let line: any = cell.getChildByName('line');
        let ct: any = cell.getChildByName('content');
        line.visible = index == this.menuList.length - 1 ? false : true;
        Main.$LoadImage(ct, cell.dataSource, null, 'skin');
    }

    menuListOnClick(Event: any): void {
        if (Event.type == 'click') {
            let menuJS = MyCenter.GameControlObj.owner['menu'].getComponent(OpenDiaLog);
            let isMeArr: any = MyCenter.GameControlObj.players.filter((item: any) => item.IsMe);
            let clicId: number = Event.target.id;
            let onlyColseSelf: boolean = (clicId == 3 || clicId == 4) && isMeArr.length > 0 ? true : false;
            menuJS.close(onlyColseSelf);
            switch (Event.target.id) {
                case 1:
                    websoket.playerSeatUpSend();
                    break;
                case 2:
                    console.log('1')
                    break;
                case 3:
                    if (isMeArr.length > 0) {
                        step_1.diaLogState(true, null);
                    } else {
                        Main.showTip('您当前为观战模式,无法补充金币!');
                    }
                    break;
                case 4:
                    if (isMeArr.length > 0) {
                        setLiuZuo.open();
                    } else {
                        Main.showTip('您当前为观战模式,无法留坐!');
                    }
                    break;
                case 5:
                    Main.$openScene('Shop.scene', false, { isTabPage: false }, (res) => {
                        res.zOrder = 30;
                        res.x = Laya.stage.width;
                        Laya.Tween.to(res, { x: 0 }, Main.Speed['changePage']);
                    })
                    break;
                case 6:
                    websoket.playerLeaveRoomSend();
                    break;
            }
        }
    }
}
export default new setMenu();