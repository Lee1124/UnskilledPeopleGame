import Main from '../../../common/Main';
/**
 * 该脚本继承赠送页面的场景，为了方便获取UI组件等...
 */
export default class Give extends Laya.Scene{
    onOpened(options:any){
        this.setUI();
    }
    setUI() {
        let nodeArr = [this['give_content']]
        Main.setNodeTop(nodeArr);
    }
}