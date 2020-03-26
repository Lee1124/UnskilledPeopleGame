/**
 * 打开全局的弹框（上下左右划出,比如弹出密码输入键盘）
 */
import Main from './Main';
export default class OutDiaLog extends Laya.Script {
    //mask透明度
    maskAlpha: number = 0;
    onAwake() {
        console.log(this);
        this.init1();
    }
    onStart() {
    }

    init1(): void {
        this.owner['visible'] = false;
        let mask: any = this.owner.getChildByName('diaLogMask');
        mask.alpha = this.maskAlpha;
        let pwdkeyboard: any = this.owner.getChildByName('pwdkeyboard');
        pwdkeyboard.bottom = -pwdkeyboard.height;
        this.registerEVENT('pwdkeyboard');
        // setTimeout(()=>{
        //     this.open1()
        // },500)
    }

    registerEVENT(nodeName:any):void{
        let mask: any = this.owner.getChildByName('diaLogMask');
        mask.off(Laya.Event.CLICK);
        mask.on(Laya.Event.CLICK,this,this.clickMask,[nodeName]);
    }

    clickMask(nodeName:any){
        switch(nodeName){
            case 'pwdkeyboard':
                let pwdkeyboard: any = this.owner.getChildByName('pwdkeyboard');
                this.moveCoomon(false,pwdkeyboard, 'bottom', -pwdkeyboard.height);
            break;
        }
    }
    

    open1(): void {
        this.owner['visible'] = true;
        let pwdkeyboard: any = this.owner.getChildByName('pwdkeyboard');
        this.moveCoomon(true,pwdkeyboard, 'bottom', 0);
    }
    moveCoomon(isOpen:any,moveNode: any, moveXYType: any, moveNum: number): void {
        let moveType: any;
        switch (moveXYType) {
            case 'x':
                moveType = { left: moveNum };
                break;
            case 'bottom':
                moveType = { bottom: moveNum };
                break;
        }
        Laya.Tween.to(moveNode, moveType, Main.Speed['openDiaLogSpeed'],null,Laya.Handler.create(this,()=>{
            if(!isOpen)
                this.owner['visible']=false;
        }));
    }
}