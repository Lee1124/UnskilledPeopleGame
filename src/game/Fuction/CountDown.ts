import Main from '../common/Main';
import MyCenter from '../common/MyCenter';
class CountDown {
    /**
     * 开启倒计时
     */
    open(seatThis: any, data: any) {
        seatThis.conutDownData = data;
        let conutDown = seatThis.owner.getChildByName("conutDown");
        conutDown.visible = true;
        //Imgnode
        seatThis._imgNode = conutDown.getChildByName('timeMask');
        //图片
        seatThis._imgNode.loadImage('res/img/common/progress1.png', Laya.Handler.create(this, () => {
            Laya.timer.frameLoop(1, seatThis, seatThis.seat_drawPie);
        }));
        //总时间
        seatThis._allTime = data.endTime - data.startTime - 2;
        //绘画pie角度
        seatThis._rotation = 360 * (((new Date().getTime() / 1000 - data.startTime)) / seatThis._allTime) + 2;
        seatThis.timeText = conutDown.getChildByName("timeText");
        seatThis.timeText.text = `${seatThis._allTime}s`;
        //开关
        seatThis._timeOutFlag = true;
    }

    drawPie(seatThis: any) {
        //剩余时间(变化的)
        let time = seatThis._allTime - parseInt(String(((new Date().getTime() / 1000 - seatThis.conutDownData.startTime))));
        seatThis.timeText.text = time + 's';
        if (time == 5 && seatThis.IsMe && seatThis._timeOutFlag) {
            seatThis._timeOutFlag = false;
            seatThis._imgNode.loadImage('res/img/common/progress2.png');
        }
        //绘画pie角度(变化的)
        seatThis._rotation = 360 * (((new Date().getTime() / 1000 - seatThis.conutDownData.startTime)) / seatThis._allTime);
        //判断角度大于等于360度的时候就停止
        if (seatThis._rotation >= 360) {
            seatThis._rotation = 360;
            Laya.timer.clear(seatThis, seatThis.seat_drawPie);
            this.close(seatThis);
        }
        seatThis._mask.graphics.clear();
        seatThis._mask.graphics.drawPie(83, 83, 83, seatThis._rotation, 360, '#000000');
        seatThis._imgNode.mask = seatThis._mask;
    }
    /**
     * 关闭倒计时
     */
    close(seatThis: any) {
        let countDownBox = seatThis.owner.getChildByName("conutDown");
        countDownBox.visible = false;
        Laya.timer.clear(seatThis, seatThis.seat_drawPie);
    }
}
export default new CountDown();