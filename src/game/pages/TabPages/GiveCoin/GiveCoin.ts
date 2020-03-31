/**
 * 分享/推广脚本
 */
import Main from '../../../common/Main';
import MyCenter from '../../../common/MyCenter';
export default class Notice extends Laya.Script {

    onStart(): void {
        MyCenter.req('meOpen',(res:any)=>{
            // if(res==this.owner.scene.url)
                // this.selectThisTab(1);
        })
    }
}
