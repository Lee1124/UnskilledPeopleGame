/**
 * 分享/推广脚本
 */
import Main from '../../../common/Main';
export default class Notice extends Laya.Script {
    onStart(): void {
        this.owner['shareUrl'].text='http://132.232.34.32/ydr/?joinUserId='+Main.userInfo.userId;
        
    }
}
