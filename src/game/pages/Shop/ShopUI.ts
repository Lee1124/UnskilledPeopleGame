import Main from '../../common/Main';
// import ShopMall from './shopMall';
/**
 * 该脚本继承注册页面的场景，为了方便获取UI组件等...
 */
export default class ShopUI extends Laya.Scene{
    //打开场景所传的值
    openedData:any;
    onAwake(){
        
    }
    onOpened(options:any){
        this.openedData=options;
        // this.setUI();
    }

    setUI() {
        // let nodeArr = [this.shop_content]
        // Main.setNodeTop(nodeArr);
    }
}