/**
 * 该脚本是做返回功能
 */
import Main from '../common/Main';
import myCenter from '../common/MyCenter';
export default class Back extends Laya.Script {
    //返回类型 （0：表示直接返回,不需要打开场景 1：表示打开场景再返回）
    backType: number = 0;
    //返回方式（0：从左往右划出 1.从右往左划出 2.从上往下划出)
    backMode: number = 0;
    //返回场景地址
    backScene: string = '';
    //返回场景所传参数
    backData: any = null;
    //需要移除的html节点
    removeNode: any = null;
    //通知的页面key值
    toPageKey:any;

    //回调
    callback:Function

    /**
     * 初始化返回参数
     * @param {*} backType 返回类型（0：表示直接返回,不需要打开场景 1：表示打开场景再返回）
     * @param {*} backMode 返回方式（0：从左往右划出 1.从右往左划出 2.从上往下划出)
     * @param {*} backScene 返回场景地址
     * @param {*} backData 返回场景所传参数
     * @param {*} node 需要移除的节点
     */
    initBack(backType?: number, backMode?: number, backScene?: string, backData?: any, node?: any, updatePage?: any,pageKey?:any,callback?:Function): void {
        this.backType = backType ? backType : 0;
        this.backMode = backMode ? backMode : 0;
        this.backScene = backScene ? backScene : '';
        this.backData = backData ? backData : null;
        this.removeNode = node ? node : null;
        this.toPageKey = pageKey ? pageKey : null;
        this.callback=callback ? callback : null;
    }
    onEnable() {
        this.initBack();
        this.bindEvent();
    }
    bindEvent() {
        this.owner.on(Laya.Event.CLICK, this, this.back);
    }
    back() {
        myCenter.send(this.toPageKey,true);
        //所属场景
        let thisScene = this.owner.scene;
        let moveXY: any;
        switch (this.backMode) {
            case 0:
                moveXY = { x: Laya.stage.width };
                break;
            case 1:
                moveXY =  { x: -Laya.stage.width };
                break;
            case 2:
                moveXY =  { y: Laya.stage.height };
                break;
        }
        if (this.backType == 0) {
            Laya.Tween.to(thisScene, moveXY, Main.Speed['changePage'], null, Laya.Handler.create(this, () => {
                thisScene.removeSelf();
            }));
            if(this.callback)
                this.callback('回来了');
        } else if (this.backType == 1) {
            Laya.Scene.open(this.backScene, false, this.backData, Laya.Handler.create(this, (res: any) => {
                Laya.Tween.to(thisScene, moveXY, Main.Speed['changePage'], null, Laya.Handler.create(this, () => {
                    thisScene.removeSelf();
                }))
            }))
        }
        // if (this.removeNode) {
        //     Laya.Browser.document.body.removeChild(this.removeNode)
        // }
    }
}