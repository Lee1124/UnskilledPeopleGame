
/**
 * 悬浮提示
 */
export default class SuspensionTips extends Laya.Script {
    //提示内容
    tipsContent: any[] = [];
    targets: any[] = [];
    targetY: number = 300;
    constructor() {
        super();
        //  /** @prop {name:tip,tips:"预制体TIP",type:Prefab}*/
    }

    onEnable() {
        //初始化数组删除方式
        this.InitArr(0);
    }

    /**
     * 自定义数组删除方法
     * @param {*} val 
     */
    InitArr(val) {
        (Array as any).prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        (Array as any).prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
    };


    // onClick()  {
    //     this.add(Math.random() * 1000);
    // }

    /**
     * 添加提示信息
     */
    add(content) {
        //添加信息
        this.tipsContent.push(content);
        //播放
        this.play();
    }

    /**
     * 创建对象
     * @param {} char 
     */
    createTarget(parent, char) {


        //测试先创建简单的字体
        let targetParent = new Laya.Image;

        targetParent.name = "parent"
        targetParent.anchorX = 0.5;
        targetParent.anchorY = 0.5;
        // Laya.loader.create('prefab/tip.json',Laya.Handler.create(this,(e)=>{
        //     let pre=e.create();
        //     console.log(pre)
        // }))
        // let tip = Laya.Pool.getItemByCreateFun("tip", this.tip.create, this.tip);
        // console.log(tip)
        let tipBg = new Laya.Sprite();
        tipBg.name = "child";
        tipBg.size(770, 110);
        tipBg.scale(0, 0);
        tipBg.y = this.targetY;
        tipBg.loadImage('res/img/common/tip.png', Laya.Handler.create(this, () => {
            tipBg.pivot(tipBg.width / 2, tipBg.height / 2);
            tipBg.x = parent.width / 2;
        }))
        let msg = new Laya.Label;
        msg.size(770, 110);
        msg.align = 'center';
        msg.valign = 'middle'
        msg.text = char;
        msg.color = "#FFFFFF";
        msg.font = "Impact";
        msg.fontSize = 40;
        tipBg.addChild(msg);
        targetParent.addChild(tipBg);
        parent.addChild(targetParent);
        return targetParent;
    }

    /**
     * 播放
     */
    play() {
        if (this.tipsContent.length > 0)
            this.setTween();
    }

    /**
     * 设置缓动信息
     */
    setTween() {
        let content = this.tipsContent.shift();
        let endY = 0;
        //创建目标对象
        let target = this.createTarget(this.owner, content);
        //开始执行缓动
        this.setScale(target.getChildByName("child"), 1, 1, 300);
        //更新对象坐标
        this.UpdateTargets();
        //插入数据
        this.targets.unshift(target);
    }

    /**
     * 更新缓动对象
     */
    UpdateTargets() {
        // console.log("UpdateTargets:start");
        let offsetY = 0;
        let lastItem = null;
        this.targets.forEach((item, index) => {
            let tar = item.getChildByName("child");
            let lastTar = lastItem != null ? lastItem.getChildByName("child") : null;

            //首个对象不会重叠的位置
            // let curY = this.targetY - tar.height;

            //当前item坐标转换
            let point = new Laya.Point(tar.x, tar.y);
            let localPoint = item.localToGlobal(point);
            //上一个item或者初始坐标位置 - 坐标转换
            let point2 = lastTar != null ? new Laya.Point(lastTar.x, lastTar.y - tar.height) : new Laya.Point(0, this.targetY - tar.height);
            let localPoint2 = lastTar == null ? item.localToGlobal(point2) : lastItem.localToGlobal(point2);

            //与生成对象重叠
            if (localPoint.y > localPoint2.y) {
                offsetY = localPoint.y - localPoint2.y;
                item.y -= offsetY;
            }

            lastItem = item;
        });

        // console.log("UpdateTargets:end");
    }

    /**
     * 设置缩放
     * @param {*} target 
     */
    setScale(target, sX, sY, time) {
        Laya.Tween.to(target,
            { scaleX: sX, scaleY: sX },
            time, null, Laya.Handler.create(this, this.setMove, [target, 0, 1000]));
    }

    /**
     * 设置移动
     * @param {*} target 
     */
    setMove(target, endY, time) {
        this.play()
        Laya.Tween.to(target,
            { y: endY },
            time, null, Laya.Handler.create(this, this.tweenEnd, [target]));
    }

    /**
     * 更新对象移动
     */
    UpdateMove(target, endY, time) {
        Laya.Tween.to(target,
            { y: endY },
            time);
    }

    /**
     * 缓动结束
     */
    tweenEnd(target) {
        this.owner.removeChild(target.parent);
        // this.targets['remove'](target.parent);
    }

    /**
     * 删除目标对象
     */
    removeTarget() {

    }

    /**
     * update
     */
    onUpdate() {

    }
}