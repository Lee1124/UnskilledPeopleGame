/**
 * 公用数据模块
 */
import TIP from '../common/SuspensionTips';
class Main {
    //debug
    debug: boolean = true;
    //牌的宽度
    pokerWidth: number = 128;
    //牌的张数
    count: number = 105;
    //关于牌的参数
    pokerParam: any = {
        alpha: 0.7
    }
    tipArr1: any[] = [];
    tipArr2: any[] = [];
    //配置速度
    Speed: object = {
        changeSeat: 200,
        dealPoker: 40,
        dealPoker2: 120,//发牌结束整理牌的速度
        feelPoker: 200,//摸牌的速度
        feelFan: 100,//摸后翻牌的速度
        pokerHeight: 50,//出牌时变化高度的速度
        mePlay: 100,//‘我’出牌的速度
        otherPlay: 50,//‘其他’出牌的速度
    }

    //用户信息
    userInfo: object = {
        userId: 123450
    }
    //预加载的牌
    loadPokerArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    //控制台打印console.log
    $LOG(...data) {
        if (this.debug)
            console.log(data)
    }

    /**
     * 预加载数据
     */
    beforeReload() {
        Laya.loader.load(['res/img/poker/chang/-1.png']);
        this.loadPokerArr.forEach(item => {
            Laya.loader.load(['res/img/poker/chang/' + item + '.png']);
            Laya.loader.load(['res/img/poker/duan/' + item + '.png']);
        })
    }

    /**
    * 创建一个tip节点
    */
    createTipBox() {
        let tipBox = new Laya.Image();
        tipBox.zOrder = 40;
        tipBox.name = 'tipBox';
        tipBox.height = 300;
        tipBox.left = 0;
        tipBox.right = 0;
        tipBox.pivot(tipBox.width / 2, tipBox.height / 2);
        tipBox.pos((Laya.stage.width - tipBox.width) / 2, (Laya.stage.height - tipBox.height) / 2)
        Laya.stage.addChild(tipBox);
        tipBox.addComponent(TIP);
        this.tipArr1 = ['tipBox'];
        this.tipArr2.forEach(item => {
            let tipJS = tipBox.getComponent(TIP);
            tipJS.add(item.msg);
            this.tipArr2 = [];
            return;
        })
    }

    /**
    * 显示提示
    * @param {*} msg 提示文字
    */
    showTip(msg) {
        this.tipArr1.forEach(item => {
            let tipBox = Laya.stage.getChildByName(item);
            if (tipBox) {
                let tipJS = tipBox.getComponent(TIP);
                tipJS.add(msg);
            }
        })
        if (this.tipArr1.length == 0)
            this.tipArr2 = [{ msg: msg }];
    }
}
export default new Main();