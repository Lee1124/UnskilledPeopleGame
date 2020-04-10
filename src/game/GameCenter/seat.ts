/**位置脚本 */
import MyCenter from '../common/MyCenter';//中转站
import ChangeSeat from '../Fuction/ChangeSeat';//切换位置
import time from '../Fuction/play/time/time';//倒计时
import step_1_seatAtOrDown from '../Fuction/step_1_seatAtOrDown';//第一步
import step_1_dealPoker from '../Fuction/play/dealPoker/step_1_dealPoker';//第一步(开始发牌)
import step_2_startNewGame from '../Fuction/play/step_2_startNewGame';//第二步(开始一局新游戏)
// import step_x_playerHandle from '../Fuction/play/step_x_playerHandle';//第x步(玩家操作显示及操作)
import step_x_playerFeelPoker from '../Fuction/play/feelPoker/step_x_playerFeelPoker';//第x步(玩家摸牌)
import step_x_showHandlePoker from '../Fuction/play/step_x_showHandlePoker';//第x步(玩家操作的牌)
import step_x_showHandleGIF from '../Fuction/play/step_x_showHandleGIF';//第x步(玩家操作动画)
import showPlayTip from '../Fuction/play/showPlayTip/showPlayTip';//显示玩家的出牌提示
import otherPlayerPlay from '../Fuction/play/playerPlay/otherPlay';//非自己玩家出牌
import set_content_liuzuo from '../Fuction/set_content_liuzuo';//留坐
import set_content_chat from '../Fuction/set_content_chat';//表情聊天
import showHandleBtns  from "../Fuction/play/showHandleBtns/showHandleBtns";//玩家显示按钮
import DiuPoker from '../Fuction/play/diuPoker/diuPoker';
export default class seat extends Laya.Script {
    //丢的牌
    diuPokers:any[]=[];
    //是不是包子
    isBaoZi:false;
    // //分好的牌
    // meConcatPokerArr:any[]=[];
    //操作的牌数据
    handlePokerArr:any[]=[];
    //玩家位置动画的定时器id
    aniTimeID:number;
    //玩家Id
    userId:number;
    //占座剩余时间
    seatAtlastTime:any;
    //留坐时间
    liuzuoAllTime:number;
    //该位置对应的所索引
    Index: number;
    //该位置对应的位置id
    SeatId: number;
    //是否是自己
    IsMe: boolean = false;
    //倒计时
    _mask = new Laya.Sprite();
    // //接受牌的位置
    // getOtherPokerSeat: any;
    constructor() {
        super();
        // this.Index = 0;
        // this.SeatId = 0;
    }

    onEnable(): void {

        //注册事件
        this.RegisterEvent();

        // console.log(this)
    }

    onStart() {
        setTimeout(() => {
            //发送对象
            this.Send();
        })
    }

    /**注册事件 */
    RegisterEvent() {
        this.owner.on(Laya.Event.CLICK, this, this.CLICK_SEAT);
    }

    /**向控制中心发送位置对象 */
    private Send(): void {
        MyCenter.send('seat', this);
    }

    /**点击位置事件 */
    CLICK_SEAT(Event: any) {
        ChangeSeat.change(Event, this);
    }

    //==============正式===============
    //玩家占座
    playerSeatAtFn(data:any):void{
        step_1_seatAtOrDown.playerSeatAtSet(this,data);
    }

    //玩家等待事件循环
    palyerSeatAtTime():void{
         //积分
        let scoreBox: any = this.owner.getChildByName('score');
        this.seatAtlastTime--;
        scoreBox.text = `等待${this.seatAtlastTime}s`;
        if (this.seatAtlastTime <= 0)
            Laya.timer.clear(this, this.palyerSeatAtTime);
    }

    //玩家起立
    playerSeatUpFn(data:any):void{
        step_1_seatAtOrDown.playerSeatUpSet(this,data);
    }

    /**
     * 带入积分坐下
     * @param data 数据
     */
    playerDairu(data:any):void{
        step_1_seatAtOrDown.playerSeatDownSet(this,data);
    }

     /**
     * 直接坐下(之前带入过)
     * @param data 数据
     */
    playerSeatDownFn(data:any):void{
        step_1_seatAtOrDown.playerSeatDown2Set(this,data);
    }

    /**
     * 留坐
     * @param data 数据
     */
    palyerLiuZuo(data:any):void{
        set_content_liuzuo.palyerLiuZuoSet(this,data);
    }

     /**
     * 留坐后回到座位上
     * @param data 数据
     */
    playerReturnSeatFn(data:any):void{
        set_content_liuzuo.playerReturnSeatSet(this,data);
    }
    
    /**
     * 玩家留坐倒计时处理
     */
    palyerLiuZuoTime(scoreView:any):void{
        set_content_liuzuo.liuzuoTime(this,scoreView);
    }

    /**
     * 玩家聊天
     * @param data 
     */
    playerChat(data:any):void{
        set_content_chat.playerChat(this,data);
    }


    /**
     * =====游戏部分=============================
     */
     /**
     * ===关于玩家位置上倒计时===
     * @param isShow {boolean} 是否显示时间
     * @param data {object} 数据
     */
    playerCountDown(isShow: boolean, data: any) {
        if (isShow)
            time.open(this,data);
        else
            time.close(this);
    }
    //接上
    seat_drawPie():void{
        time.drawPie(this);
    }

    startNewGame(data:any):void{
        step_2_startNewGame.start(this,data);
    }

    //发牌
    dealPoker(data:any):void{
        step_1_dealPoker.init(this,data);
    }

    //补牌
    buPoker(data:any,fn?:Function){
        step_1_dealPoker.buPoker(this,data,fn);
    }

    //清除补牌的标记
    clearBuPokerSign(){
        step_1_dealPoker.clearBuPokerSign(this);
    }

    //删除牌的数据
    removePoker(data:any){
        step_1_dealPoker.removeMePoker(this,data);
    }

    //显示非自己玩家出的牌
    showNoMePlayPoker(data:any){
        otherPlayerPlay.play(this,data);
    }

    //显示非自己玩家出的牌
    hideNoMePlayPoker(){
        otherPlayerPlay.hidePlay(this);
    }

    /**玩家操作 */
    // playerHandle(show1:boolean,show2:boolean,data?:any):void{
    //     // step_x_playerHandle.show(this,data,show1,show2);

    //     step_x_playerHandle.show(this,data,show1,show2);
    // }

    //玩家操作显示
    playerHandle(opt:any,data:any):void{
        showHandleBtns.showBtns(this,opt,data);
    }

    /**
     * 玩家摸牌
     * @param data 
     */
    playerFeel(data:any){
        step_x_playerFeelPoker.feel(this,data);
    }

    /**
     * 隐藏玩家的摸牌
     */
    playerHideFeel(){
        step_x_playerFeelPoker.hideFeelPoker(this);
    }

    //玩家操作动画播放
    showHandleAni(data:any):void{
        step_x_showHandleGIF.show(this,data);
    }

    //显示玩家操作的牌
    showHandlePoker(data:any):void{
        step_x_showHandlePoker.show(this,data);
    }

    //清除玩家操作的牌
    clearHandlePoker():void{
        step_x_showHandlePoker.hide(this);
    }

    //显示玩家的出牌提示
    showPlayTip(show:boolean):void{
        showPlayTip.showOrHide(this,show);
    }

    //显示玩家不要的牌
    showPlayerDiuPoker(data:any){
        DiuPoker.open(this,data);
    }

    

    //==============正式===============
    
}