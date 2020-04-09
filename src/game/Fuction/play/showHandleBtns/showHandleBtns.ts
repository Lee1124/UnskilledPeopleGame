/**
 * 显示玩家操作按钮
 */
import MyCenter from "../../../common/MyCenter";
import websoket from '../../../Fuction/webSoketSend';
import Main from "../../../common/Main";
import time from "../../../Fuction/play/time/time";//倒计时
import chipengangtuDealData from "../../../Fuction/play/chipengangtuDealData/chipengangtuDealData";
//操作按钮的类型
enum handleBtn {
    none,
    qi,
    tou,
    kou,
    guo,
    play,
    chi,
    pen,
    sha,
    tu,
    hu
}

//打牌阶段（起牌,偷牌,打牌）
enum playstage {
    qi,
    tou,
    da
}

class showHandleBtns {
    //初始化的值
    // data: any;
    /**
     * 显示玩家操作按钮
     * @param data 数据
     * @param opts 显示按钮的数组  (数组为空的话就是全部隐藏)
     */
    show(data: any, opts: any) {
        let players: any = MyCenter.GameControlObj.players;
        players.forEach((itemJS: any) => {
            if (itemJS.userId == data.userId) {
                Main.$LOG('玩家' + data.userId + '操作列表Array：', opts);
                itemJS.playerHandle(opts, data);
            }
        })
    }

    /**
     * 隐藏全部操作按钮
     * @param data 
     */
    hideAll(data: any) {
        this.show(data, []);
    }

    /**
    * 只显示扣按钮
    * @param data 数据
    */
    onlyKouBtn(data: any) {
        let opts: any = [{ h: handleBtn.kou, o: 1 }]
        this.show(data, opts);
    }

    //初始化
    showBtns(that: any, opts: any, data: any): void {
        // this.data = opts;
        if (that.userId == Main.userInfo.userId) {//我
            this.showMeHandleView(that, opts, data);
        }
    }
    /**
     * 
     * @param that 
     * @param data (1-吃  2-碰  3-杀/杠  4-吐火  5-偷  6-起牌 7-扣牌 8-过  9-胡牌)
     */
    showMeHandleView(that: any, opt: any, data: any): void {
        let meHandleView: any = MyCenter.GameUIObj.meHandleView;
        meHandleView._children.forEach((item: any) => {
            item.visible = false;
            opt.forEach((item2: any) => {
                if (item.name == 'h_' + item2.h) {
                    item.alpha = item2.o;
                    item.visible = true;
                    item.zOrder = 10;
                    item.off(Laya.Event.CLICK);
                    if (item2.o == 1)
                        item.on(Laya.Event.CLICK, this, this.clickHandle, [item2.h, data])
                }
            })
        });
    }
    /**玩家操作 */
    clickHandle(handleId: any, data: any) {
        let that:any=this;
        console.log('操作id+data：', handleId, data,MyCenter.getKeep('playstage'));
        // console.log('play:', MyCenter.getKeep('play'))
        let nowPlaystage: any = MyCenter.getKeep('playstage');
        // alert(nowPlaystage);
        if (nowPlaystage == playstage.qi) {
            let name: string;
            switch (handleId) {
                case handleBtn.qi://起
                    name = 'M.Games.YDR.C2G_StandPokerOpt';
                    break;
                case handleBtn.guo://过
                    name = 'M.Games.YDR.C2G_StandPokerOpt';
                    break;
            }
            websoket.beforePlayHandle(handleId, name);
        } else if (nowPlaystage == playstage.tou) {
            let name: string;
            switch (handleId) {
                case handleBtn.tou://偷
                    name = 'M.Games.YDR.C2G_StealPokerOpt';
                    break;
                case handleBtn.guo://过
                    name = 'M.Games.YDR.C2G_StealPokerOpt';
                    break;
            }
            websoket.beforePlayHandle(handleId, name);
        }
        if (nowPlaystage == playstage.da) {
            // this.daHandleShow(data,handleId);
            websoket.afterPlayHandle(handleId, []);
        }
        time.hide({ userId: data.userId });
        if (!MyCenter.getKeep('play'))
            this.hideAll({ userId: Main.userInfo.userId });//打牌之前隐藏操作按钮
        else
            this.onlyKouBtn({ userId: Main.userInfo.userId });
    }

    /**
     * 显示操作后的结果
     * @param data 数据{userId:xxxxxx}
     * @param handleId 
     */
    daHandleShow(data:any,handleId:any){
        switch (handleId) {
            case handleBtn.chi://吃
                chipengangtuDealData.chi(data);
                break;
            case handleBtn.pen://碰
                chipengangtuDealData.pen(data);
                break;
            case handleBtn.sha://杀/杠
                chipengangtuDealData.gang(data);
                break;
            case handleBtn.tu://吐火
                chipengangtuDealData.tuhuo(data);
                break;
        }
    }
}

export default new showHandleBtns();