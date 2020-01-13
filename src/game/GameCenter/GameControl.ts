/**游戏控制中心 */
import MyCenter from '../common/MyCenter';
import InitGameData from '../Fuction/InitGameData';
import DealOrPlayPoker from '../Fuction/DealOrPlayPoker';
import DiuPoker from '../Fuction/diuPoker';
import ShowHandlePoker from '../Fuction/ShowHandlePoker';
import FeelPoker from '../Fuction/FeelPoker';
import Main from '../common/Main';
export default class GameControl extends Laya.Script {
    /** @prop {name:dealPoker,tips:"发牌的牌",type:Prefab}*/

    //玩家数组
    players: any[] = [];
    //位置索引
    private Index: number = 0;
    //===========摸牌测试===========
    num2: number = 0;
    data1:any[]=[
        { userId: 123450, data: [1] },
        { userId: 123451, data: [4] },
        { userId: 123452, data: [10] }
    ];
    constructor() { super(); }
    onEnable(): void {
        /**===测试=== */
        Main.beforeReload();
        Main.createTipBox();
        /**===测试=== */
        this.KeepSeatObj();
        this.InitGameData();
    }
    /**初始化数据 */
    InitGameData() {
        MyCenter.InitGameData(this);
    }
    /**保存玩家位置对象 */
    KeepSeatObj() {
        let that = this;
        MyCenter.req('seat', (res) => {
            that.players.push(res);
            InitGameData.Init(res, this);
            this.Index++;
        });
    }

    /**发牌 */
    dealPokerFn() {
        Main.showTip('游戏开始...');
        setTimeout(()=>{
            DealOrPlayPoker.deal();
        },1000)
    }
    /**丢的牌 */
    diuPoker() {
        let num=parseInt(String(Math.random()*21))+1;
        this.data1[0].data.push(num);
        this.data1[1].data.push(num);
        this.data1[2].data.push(num);
        DiuPoker.open(this.data1);
    }
    /**操作的牌 */
    handlePoker() {
        ShowHandlePoker.open();
    }
    /**摸牌 */
    feelPoker() {
        FeelPoker.feel();
    }
    /**非自己玩家出牌 */
    otherPlay() {
        this.num2++;
        DealOrPlayPoker.otherPlay(this.num2);
    }
}