/**
 * 显示或隐藏倒计时
 */
import MyCenter from '../../../common/MyCenter';
class time {
    /**
     * 显示单个倒计时时间
     * @param data 数据 {userId:xxxxxx,ttime:20,time:20}
     */
    show(data: any) {
        this.common(data, true);
    }
    /**
     * 隐藏单个倒计时时间
     * @param data 数据 {userId:xxxxxx,ttime:20,time:20}
     */
    hide(data: any) {
        this.common(data, false);
    }
    common(data: any, show: boolean) {
        let players: any = MyCenter.GameControlObj.players;
        players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId)
                itemJS.playerCountDown(show, data);
        })
    }

    /**
     * 显示多个倒计时时间
     * @param data 数据{userId:xxxxxx,uids:[xxxxxx,xxxxxx],ttime:20,time:20}
     */
    shows(data: any) {
        let players: any = MyCenter.GameControlObj.players;
        players.forEach((itemJS: any) => {
            data.uids.forEach((item: any) => {
                if (itemJS.userId == item) {
                    itemJS.playerCountDown(true, data);
                }
            })
        })
    }

    /**
     * 开启倒计时
     */
    open(seatThis: any, data: any) {
        seatThis.conutDownData = data;
        // debugger;
        let conutDown = seatThis.owner.getChildByName("conutDown");

        //Imgnode
        seatThis._imgNode = conutDown.getChildByName('timeMask');
        //图片
        seatThis._imgNode.loadImage('res/img/common/progress1.png', Laya.Handler.create(this, () => {
            Laya.timer.frameLoop(1, seatThis, seatThis.seat_drawPie);
        }));
        //总时间
        // seatThis._allTime = data.endTime - data.startTime - 2;
        seatThis._allTime = data.ttime;
        // seatThis._allTime = data.endTime - data.startTime - 2;
        seatThis._startTime = new Date().getTime() / 1000;
        //绘画pie角度
        // seatThis._rotation = 360 * (((new Date().getTime() / 1000 - data.startTime)) / seatThis._allTime) + 2;
        seatThis._rotation = 360 * ((seatThis.conutDownData.ttime - seatThis.conutDownData.time) / seatThis._allTime) + 2;
        seatThis.timeText = conutDown.getChildByName("timeText");
        seatThis.timeText.text = `${seatThis._allTime}s`;
        //开关
        seatThis._timeOutFlag = true;
        seatThis.seat_drawPie();
        conutDown.visible = true;
        // seatThis._allTime=data.time;
    }

    drawPie(seatThis: any) {
        //剩余时间(变化的)
        // let time = seatThis._allTime - parseInt(String(((new Date().getTime() / 1000 - seatThis.conutDownData.startTime)))) - ;
        let time = seatThis._allTime - parseInt(String(((new Date().getTime() / 1000 - seatThis._startTime)))) - (seatThis.conutDownData.ttime - seatThis.conutDownData.time);
        // console.log(seatThis._allTime,parseInt(String(((new Date().getTime() / 1000 - seatThis._startTime)))),(seatThis.conutDownData.ttime-seatThis.conutDownData.time))
        seatThis.timeText.text = time + 's';
        if (time == 5 && seatThis.IsMe && seatThis._timeOutFlag) {
            seatThis._timeOutFlag = false;
            seatThis._imgNode.loadImage('res/img/common/progress2.png');
        }
        //绘画pie角度(变化的)
        // seatThis._rotation = 360 * (((new Date().getTime() / 1000 - seatThis._startTime)) / seatThis._allTime);
        let endS: number = ((new Date().getTime() / 1000 - seatThis._startTime)) + (seatThis.conutDownData.ttime - seatThis.conutDownData.time);
        seatThis._rotation = 360 * (endS / seatThis._allTime);
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
export default new time();