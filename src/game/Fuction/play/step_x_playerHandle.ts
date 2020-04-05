import Main from "../../common/Main";
import myCenter from '../../common/MyCenter';
import websoket from '../../Fuction/webSoketSend';
/**
 * 玩家操作
 */
class step_x_playerHandle {
   //初始化的值
   data: any;
   //初始化
   show(that: any, data: any): void {
      this.data = data;
      if (that.userId == Main.userInfo.userId) {//我
         this.showMeHandleView(that, data);
      }
   }
   //隐藏操作
   hide(isAll:boolean=false){
      let meHandleView: any = myCenter.GameUIObj.meHandleView;
      if(isAll){
         meHandleView.visible = false;
      }else{
         meHandleView._children.forEach((item: any) => {
            item.off(Laya.Event.CLICK);
            if(item.name!='h_7'){
               item.visible = false;
            }else{
               item.on(Laya.Event.CLICK,this,this.clickHandle,[7]);
            }
         })
      }
   }
   /**
    * 
    * @param that 
    * @param data (1-吃  2-碰  3-杀/杠  4-吐火  5-偷  6-起牌 7-扣牌 8-过  9-胡牌)
    */
   showMeHandleView(that: any, data: any): void {
      let meHandleView: any = myCenter.GameUIObj.meHandleView;
      meHandleView.visible = true;
      let handle: any[] = data.handle;
      meHandleView._children.forEach((item: any) => {
         item.visible = false;
         handle.forEach((item2: any) => {
            if (item.name == 'h_' + item2.h){
               item.alpha=item2.o?1:0.5;
               item.visible = true;
               item.zOrder=10;
               item.off(Laya.Event.CLICK);
               if(item2.o)
                  item.on(Laya.Event.CLICK,this,this.clickHandle,[item2])
            }
         })
      });
      // setTimeout(()=>{
      //    this.hide(false);
      // },3000)
   }

   /**玩家操作 */
   clickHandle(item2:any){
      console.log('操作id：',item2);
      websoket.beforePlayHandle(item2.opt);
   }
}
export default new step_x_playerHandle();