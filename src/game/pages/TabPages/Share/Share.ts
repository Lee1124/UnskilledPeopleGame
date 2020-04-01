/**
 * 分享/推广脚本
 */
import Main from '../../../common/Main';
import Back from '../../../common/Back';
import MyCenter from '../../../common/MyCenter';
export default class Notice extends Laya.Script {
    //二维码链接
    QRcodeuRL: String;
    //生产二维码对象
    qrcode:any;
    onStart(): void {
        // this.owner['shareUrl'].text='http://132.232.34.32/ydr/?joinUserId='+Main.userInfo.userId;
        MyCenter.req('meOpen',(url:string)=>{
            if(url==this.owner.scene.url){
                Main.showLoading(true);
                const ShareView: any = document.getElementById('Share');
                ShareView.classList.add('ShareShow');
                Main.showLoading(false);
            }
        })
        this.initShare();
        this.initBack();
    }

    //初始化返回
    initBack(): void {
        let backJS: any = this.owner['back_btn'].getComponent(Back);
        const Share: any = document.getElementById('Share');
        Share.classList.remove('ShareShow');
        backJS.initBack(null, null, null, null, null, null, null, (res: any) => {
            Share.classList.remove('ShareShow');
        });
    }

    initShare(): void {
        this.QRcodeuRL = 'http://' + Main.websoketApi.split(':')[0] + '/ydr/?joinUserId=' + Main.userInfo.userId;
        let copyBtn: any = document.getElementsByClassName('copyBtn')[0];
        let copyContent: any = document.getElementsByClassName('copyContent')[0];
        copyContent.innerHTML = this.QRcodeuRL;
        copyBtn.setAttribute('data-clipboard-text', this.QRcodeuRL);

        copyBtn.removeEventListener('click',this.copy,false);
        copyBtn.onclick = this.copy;
        
        //生产二维码
        let QRcode = document.getElementById("QRcode");
        QRcode.innerHTML='';
        this.qrcode = new QRCode(QRcode, {
            text: this.QRcodeuRL,
            width: (QRcode.style.width).split('px')[0],
            height: (QRcode.style.height).split('px')[0],
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
    }

    copy() {
        //实例化 ClipboardJS对象;
        var copyBtn = new ClipboardJS('.copyBtn');
        copyBtn.on("success", (e: any)=> {
            // 复制成功
            e.clearSelection();
        });
        copyBtn.on("error", (e: any)=> {
            //复制失败；
            alert(e.action)
        });

    }
}
