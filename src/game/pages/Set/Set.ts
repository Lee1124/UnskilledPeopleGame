/**
 * 设置
 */
import Back from '../../common/Back';
import Switch from '../../common/MySwitch';
import Main from '../../common/Main';
export default class Set extends Laya.Script {
    //打开传的数据
    openDta:any;
    //列表
    list:any;
    onStart() {
        this.initBack();
        this.setList();
        if (Main.wxGame)
            this.initPage();
    }
    /**初始化页面(加载背景) */
    initPage() {
        // let bg=this.owner.getChildByName('bg');
        // bg.skin = 'res/img/common/login_bg.jpg';
    }

    initBack() {
        let backJS:any = this.owner['back'].getComponent(Back);
        backJS.initBack();
    }

    setList() {
        this.list = this.owner['ctList'];
        this.list.array = [
            { id: 1, label: 'res/img/common/set_text1.png' },
            { id: 2, label: 'res/img/common/set_text2.png' },
            { id: 3, label: 'res/img/common/set_text3.png', BanBenVal: '1.0.0' },
        ];
        this.list.renderHandler = new Laya.Handler(this, this.listRender);
        this.list.mouseHandler = new Laya.Handler(this, this.listSelect);
    }

    listRender(cell:any,index:number) {
        let label:any = cell.getChildByName('label');
        label.skin = cell.dataSource.label;
        if (cell.dataSource.id != 1) {
            let selectView:any = cell.getChildByName('selectView');
            selectView.removeSelf();
        }
        if (cell.dataSource.id == 1) {
            //初始化游戏声音的状态
            this.initSwitch(cell);
        }
        if (cell.dataSource.id != 2) {
            let goIconBox:any = cell.getChildByName('goIconBox');
            goIconBox.removeSelf();
        }
        if (cell.dataSource.id != 3) {
            let testBox:any = cell.getChildByName('testBox');
            testBox.removeSelf();
        }

        if(index==this.list.length-1){
            let line:any = cell.getChildByName('line');
            line.removeSelf();
        }
    }

    listSelect(Event:any, index:number) {
        if (Event.type == 'click') {
            let ID:any = Event.target.dataSource.id;
            if (ID == 2) {
                Main.$openScene('aboutOur.scene', false, this.openDta, (res:any) => {
                    res.x = Laya.stage.width;
                    res.zOrder = 10;
                    Laya.Tween.to(res, { x: 0 }, Main.Speed['changePage']);
                })
            }
        }
    }
    /**
     * 初始化游戏声音的状态
     */
    initSwitch(cell:any) {
        let selectView = cell.getChildByName('selectView');
        let SwitchJS:any = selectView.getComponent(Switch);
        let gameMusicState = localStorage.getItem('gameMusic') ? localStorage.getItem('gameMusic') : 1;
        let isOpened = gameMusicState == 0 ? false : true;
        SwitchJS.initSwitch(this, isOpened, (bool:boolean) => {
            let isOpen:any = bool ? 1 : 0;
            localStorage.setItem('gameMusic', isOpen);
        });
    }
}