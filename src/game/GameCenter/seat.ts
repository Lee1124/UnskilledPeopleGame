/**位置脚本 */
import MyCenter from '../common/MyCenter';//中转站
import ChangeSeat from '../Fuction/ChangeSeat';//切换位置
export default class seat extends Laya.Script {
    //该位置对应的所索引
    Index: number;
    //该位置对应的位置id
    SeatId: number;
    //是否是自己
    IsMe: boolean = false;
    // //接受牌的位置
    // getOtherPokerSeat: any;
    constructor() {
        super();
        this.Index = 0;
        this.SeatId = 0;
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
        // console.log(Event, this)
        ChangeSeat.change(Event, this);
    }
}