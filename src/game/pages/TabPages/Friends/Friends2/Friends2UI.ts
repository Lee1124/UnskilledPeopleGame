import Main from '../../../../common/Main';
// import ShopMall from './shopMall';
/**
 * 该脚本继承注册页面的场景，为了方便获取UI组件等...
 */
export default class Friends2 extends Laya.Scene{
    //打开场景所传的值
    openedData:any=1;
    onAwake(){
        
    }
    onOpened(options:any){
        Main.$LOG('亲友圈二级页面所收到得值：',options);
        this.openedData=options?options:1;
        this.setTitle();
        // this.setUI();
    }

    /**
     * 设置标题
     */
    setTitle():void{
        this['title_1'].visible=this.openedData==1?true:false;
        this['title_2'].visible=this.openedData==2?true:false;
        this['title_3'].visible=this.openedData==3?true:false;
        this['view1'].visible=this.openedData==1?true:false;
        this['view2'].visible=this.openedData==2?true:false;
        this['view3'].visible=this.openedData==3?true:false;
    }

    setUI() {
        // let nodeArr = [this.shop_content]
        // Main.setNodeTop(nodeArr);
    }
}