/**
 * 分享/推广脚本
 */
import Main from '../../../common/Main';
import Back from '../../../common/Back';
export default class Notice extends Laya.Script {

    onStart(): void {
        this.owner['shareUrl'].text='http://132.232.34.32/ydr/?joinUserId='+Main.userInfo.userId;
        this.initBack();
    }

    //初始化返回
    initBack(): void {
        let backJS:any = this.owner['back_btn'].getComponent(Back);
        const QRcode:any=document.getElementById('QRcode');
        backJS.initBack(null,null,null,null,null,null,null,(res:any)=>{
            QRcode.classList.remove('QRcodeShow');
        });
    }
}
