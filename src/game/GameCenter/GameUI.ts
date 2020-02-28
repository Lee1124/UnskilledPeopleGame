/**游戏中心的UI脚本 */
import MyCenter from '../common/MyCenter';
import GameControl from '../GameCenter/GameControl';
import OpenDiaLog from '../Fuction/OpenDiaLog';
import setMenuContent from '../Fuction/set_content_menu';
import setChatContent from '../Fuction/set_content_chat';

import openView from '../common/openView';
export default class GameUI extends Laya.Scene {
    //打开场景所接受的参数
    openData:any;
    //初始位置坐标
    startSeatXY: any[] = [];
    //初始摸牌的位置
    startFeelSeatXY:any[]=[];
    //发牌的位置坐标
    dealPokerSeatXY:any;
    //摸牌的最初位置
    feelPokerSeatXY:any;
    // //玩家自己牌的接受位置坐标
    // mePokerGetSeat:any;
    //发牌接受牌的位置坐标
    // getPokerSeatXY: any[] = [];
    //控制中心的脚本对象
    GameControlJS: any;
    onEnable(): void {
        this.InitGameUIData();
        this.RegisterEvent();
    }
    onOpened(options:any){
        this.openData=options;
        this.initJS();
        setMenuContent.init(this);
        setChatContent.init(this);
    }
    /**初始化数据 */
    InitGameUIData() {
        // console.log('==---999',this)
        this.GameControlJS = this.getComponent(GameControl);
        MyCenter.InitGameUIData(this);
    }
    initJS():void{
        let RealTimeResultJS:any=this['btnView'].getChildByName('btn_look1').getComponent(openView);
        RealTimeResultJS.initOpen(0, 'RealTimeResult.scene', false, null, 2);
    }
    /**注册事件 */
    RegisterEvent(): void {
        /**===测试=== */
        this['startBtn'].on(Laya.Event.CLICK, this, () => {
            this.GameControlJS.dealPokerFn();
        })
        this['diuBtn'].on(Laya.Event.CLICK, this, () => {
            this.GameControlJS.diuPoker();
        })
        this['handleBtn'].on(Laya.Event.CLICK, this, () => {
            this.GameControlJS.handlePoker();
        })
        this['handleBtn2'].on(Laya.Event.CLICK, this, () => {
            this.GameControlJS.feelPoker();
        })
        this['playBtn'].on(Laya.Event.CLICK, this, () => {
            this.GameControlJS.otherPlay();
        })
        this['timeBtn'].on(Laya.Event.CLICK, this, () => {
            this.GameControlJS.countDown();
        })
        /**===测试=== */


        /**====正式==== */
        this['btnView']._children.forEach((item:any)=>{
            item.on(Laya.Event.CLICK, this, () => {
                switch(item.name){
                    case 'btn_menu':
                        this.openMenu();
                    break;
                    // case 'btn_look2':

                    // break;
                    // case 'btn_look1':

                    // break;
                    case 'btn_chat':
                        this.openChat();
                    break;
                }
            })
        })
        /**====正式==== */
    }

    /**
     * 设置菜单的内容
     */
    openMenu():void{
        let menu: any = MyCenter.GameControlObj.owner['menu'].getComponent(OpenDiaLog);
        menu.init(3,0,this,null,null,()=>{
            menu.open();
        });
    }
    /**
     * 设置聊天菜单的内容
     */
    openChat():void{
        let chatJS: any = MyCenter.GameControlObj.owner['chat'].getComponent(OpenDiaLog);
        chatJS.init(4,0,this,null,null,()=>{
            chatJS.open();
        });
    }
}