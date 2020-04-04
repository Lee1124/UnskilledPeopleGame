import Main from '../../common/Main';
/**
 * 该脚本继承实时战绩页面的场景，为了方便获取UI组件等...
 */
export default class ZhanJiGetUI extends Laya.Scene{
    onOpened(options:any){
        this.setUI();
    }
    setUI() {
        let nodeArr = [this['zhanji_content']]
        Main.setNodeTop(nodeArr);
    }
}