/**游戏中心的UI脚本 */
import MyCenter from '../common/MyCenter';
import GameControl from '../GameCenter/GameControl';
export default class GameUI extends Laya.Scene {
    //初始位置坐标
    startSeatXY: any[] = [];
    //初始摸牌的位置
    startFeelSeatXY:any[]=[];
    //发牌的位置坐标
    dealPokerSeatXY:any;
    //摸牌的最初位置
    feelPokerSeatXY:any;
    //玩家自己牌的接受位置坐标
    mePokerGetSeat:any;
    //发牌接受牌的位置坐标
    // getPokerSeatXY: any[] = [];
    //控制中心的脚本对象
    GameControlJS: any;
    onEnable(): void {
        this.InitGameUIData();
        this.RegisterEvent();
    }
    /**初始化数据 */
    InitGameUIData() {
        console.log(this)
        this.GameControlJS = this.getComponent(GameControl);
        MyCenter.InitGameUIData(this);
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
        /**===测试=== */
    }
}