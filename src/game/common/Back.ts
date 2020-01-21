/**
 * 该脚本是做返回功能
 */
import Main from '../common/Main';
export default class Back extends Laya.Script {
    //返回类型 （0：表示直接返回,不需要打开场景 1：表示打开场景再返回）
    backType: number = 0;
    //返回场景地址
    backScene: string = '';
    //返回场景所传参数
    backData: any = null;
    //需要移除的html节点
    removeNode: any = null;

    /**
     * 初始化返回参数
     * @param {*} backType 返回类型（0：表示直接返回,不需要打开场景 1：表示打开场景再返回）
     * @param {*} backScene 返回场景地址
     * @param {*} backData 返回场景所传参数
     * @param {*} node 需要移除的节点
     */
    initBack(backType?:number, backScene?:string, backData?:any, node?:any, updatePage?:any):void {
        this.backType = backType ? backType : 0;
        this.backScene = backScene ? backScene : '';
        this.backData = backData ? backData : null;
        this.removeNode = node ? node : null;
    }
    onEnable() {
        this.initBack();
        this.bindEvent();
    }
    bindEvent() {
        this.owner.on(Laya.Event.CLICK, this, this.back);
    }
    back() {
        //所属场景
        let thisScene = this.owner.scene;
        if (this.backType == 0) {
            Laya.Tween.to(thisScene, { x: Laya.stage.width }, Main.Speed['changePage'], null, Laya.Handler.create(this, () => {
                thisScene.removeSelf();
            }))
        } else if (this.backType == 1) {
            Laya.Scene.open(this.backScene, false, this.backData, Laya.Handler.create(this, (res:any) => {
                Laya.Tween.to(thisScene, { x: Laya.stage.width }, Main.Speed['changePage'], null, Laya.Handler.create(this, () => {
                    thisScene.removeSelf();
                }))
            }))
        }
        if (this.removeNode) {
            Laya.Browser.document.body.removeChild(this.removeNode)
        }
    }
}