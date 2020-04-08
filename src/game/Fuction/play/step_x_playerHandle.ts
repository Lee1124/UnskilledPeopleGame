import Main from "../../common/Main";
import myCenter from '../../common/MyCenter';
import websoket from '../../Fuction/webSoketSend';
import MyCenter from "../../common/MyCenter";

/**
 * 玩家操作
 */
class step_x_playerHandle {
   //初始化的值
   data: any;
   //初始化
   show(that: any, opts: any): void {
      this.data = opts;
      if (that.userId == Main.userInfo.userId) {//我
         // if (show1 || show2)
         //    this.showMeHandleView(that, data, show1, show2);
         // else if (!show1 || !show2)
         //    this.hide(!show1, !show2);
         this.showMeHandleView(that, opts);
      }
   }
   // //隐藏操作
   // hide(hide1: boolean, hide2: boolean) {
   //    if (hide1) {
   //       let meHandleView1: any = myCenter.GameUIObj.meHandleView.getChildByName('h_view1');
   //       this.hideCommon(meHandleView1, hide1);
   //    } else if (hide2) {
   //       let meHandleView2: any = myCenter.GameUIObj.meHandleView.getChildByName('h_view2');
   //       this.hideCommon(meHandleView2, hide1);
   //    }
   // }
   // hideCommon(node: any, hide: boolean) {
   //    node.visible = !hide;
   //    node._children.forEach((item: any) => {
   //       item.off(Laya.Event.CLICK);
   //    })
   // }
   /**
    * 
    * @param that 
    * @param data (1-吃  2-碰  3-杀/杠  4-吐火  5-偷  6-起牌 7-扣牌 8-过  9-胡牌)
    */
   showMeHandleView(that: any, opt: any): void {
      // if (show1) {
      //    let meHandleView1: any = myCenter.GameUIObj.meHandleView.getChildByName('h_view1');
      //    let handle: any[] = data.handle1;
      //    this.showCommon(meHandleView1, show1, handle);
      // }
      // if (show2) {
      //    let meHandleView2: any = myCenter.GameUIObj.meHandleView.getChildByName('h_view2');
      //    let handle: any[] = data.handle2;
      //    this.showCommon(meHandleView2, show2, handle);
      // }
      let meHandleView: any = myCenter.GameUIObj.meHandleView;
      meHandleView._children.forEach((item: any) => {
         item.visible = false;
         opt.forEach((item2: any) => {
            if (item.name == 'h_' + item2.h) {
               item.alpha = item2.o;
               item.visible = true;
               item.zOrder = 10;
               item.off(Laya.Event.CLICK);
               if (item2.o == 1)
                  item.on(Laya.Event.CLICK, this, this.clickHandle, [item2.h])
            }
         })
      });
   }
   // showCommon(node: any, show: boolean, handleArr: any, ) {
   //    node.visible = show;
   //    node._children.forEach((item: any) => {
   //       item.visible = false;
   //       handleArr.forEach((item2: any) => {
   //          if (item.name == 'h_' + item2.h) {
   //             item.alpha = item2.o ? 1 : 0.5;
   //             item.visible = true;
   //             item.zOrder = 10;
   //             item.off(Laya.Event.CLICK);
   //             if (item2.o)
   //                item.on(Laya.Event.CLICK, this, this.clickHandle, [item2])
   //          }
   //       })
   //    });
   // }

   /**玩家操作 */
   clickHandle(handleId: any) {
      console.log('操作id：', handleId);
      console.log('play:', myCenter.getKeep('play'))
      console.log('isAction:', myCenter.getKeep('isAction'))
      if (myCenter.getKeep('isAction')) {
         let chiList: any = [];
         // if (handleId!=myCenter.GameControlObj.handleBtn.chi)
         //    chiList = [];
         // else
         //    chiList = [];//=======================后加
         websoket.afterPlayHandle(handleId, chiList);
      } else {
         websoket.beforePlayHandle(handleId);
      }
      myCenter.GameControlObj.showTime({ userId: Main.userInfo.userId }, false);//隐藏时间
      if (!myCenter.getKeep('play'))
         myCenter.GameControlObj.showHandle({ userId: Main.userInfo.userId }, []);//打牌之前隐藏操作按钮
      else
         myCenter.GameControlObj.onlyShowKouBtn({ userId: Main.userInfo.userId });//打牌之后隐藏操作按钮
   }
}
export default new step_x_playerHandle();