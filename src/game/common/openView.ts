/**
 * 该脚本为打开某场景功能
 */
import Main from '../common/Main';
export default class openView extends Laya.Script {
     //打开类型(0：打开后不销毁其他场景 1：打开后销毁当前场景)
     openType:number = 0;
     //打开场景地址
     openSceneUrl:string = '';
     //打开场景时是否销毁其他场景
     openCloseOtherScene:boolean = false;
     //打开所传参数
     openDta:any = null;
     //打开方式(0：右边划出 1：直接显示)
     openMethod:number = 0;
     //所属场景
     selfScene:string = '';
    /**
     * 打开某场景
     * @param {*} openType 打开类型(0：打开后不销毁其他场景 1：打开后销毁当前场景)
     * @param {*} openSceneUrl 打开场景地址
     * @param {*} openCloseOtherScene 打开场景时是否销毁其他场景
     * @param {*} openDta 打开所传参数
     * @param {*} openMethod 打开方式(0：右边划出 1：直接显示)
     */
    initOpen(openType?:number, openSceneUrl?:string, openCloseOtherScene?:boolean, openDta?:any, openMethod?:number):void {
        this.openType = openType ? openType : 0;
        this.openSceneUrl = openSceneUrl ? openSceneUrl : '';
        this.openCloseOtherScene = openCloseOtherScene ? openCloseOtherScene : false;
        this.openDta = openDta ? openDta : null;
        this.openMethod = openMethod ? openMethod : 0;
    }

    onEnable():void {
        this.selfScene = this.owner.scene;
        this.initOpen();
        this.bindEvent();
    }

    bindEvent():void {
        this.owner.on(Laya.Event.CLICK, this, this.openView)
    }
    openView():void {
        Main.$LOG(this.openSceneUrl);
        Main.$openScene(this.openSceneUrl, this.openCloseOtherScene, this.openDta, (res) => {
            if (this.openMethod == 0) {
                res.x = Laya.stage.width;
                res.zOrder = 10;
                Laya.Tween.to(res, { x: 0 }, Main.Speed['changePage'], null, Laya.Handler.create(this, () => {
                    if (this.openType == 1)
                        this.selfScene['removeSelf']();
                }));
            }
        })
    }
}