export default class SetViewWH extends Laya.Script {
    onEnable() {
        this.owner['width']=parseInt((this.owner['width']/(1242/Laya.stage.width)).toFixed(0));//设置座位适配width
        this.owner['height']=parseInt((this.owner['height']/(2208/Laya.stage.height)).toFixed(0));//设置座位适配height
    }
}