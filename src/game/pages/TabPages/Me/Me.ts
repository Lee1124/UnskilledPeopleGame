/**
 * 我的
 */
import Main from '../../../common/Main';
export default class Me extends Laya.Script {
    //me列表
    meList: any;
    onStart(): void {
        this.meList = this.owner.getChildByName('list_bg').getChildByName('list_bg2').getChildByName('me_list');
        this.setPage();
    }
    openThisPage(){
        if (this.owner['visible']) {
            // this.UI = this.owner.scene;
            this.requestPageData();
            // this.initOpenView();
        }
    }
    /**设置页面数据 */
    setPage(): void {
        this.meList.array = Main.meListData;
        this.meList.renderHandler = new Laya.Handler(this, this.meListOnRender);
        this.meList.mouseHandler = new Laya.Handler(this, this.meListOnClick);
    }

    meListOnRender(cell: any, index: number):void {
        if (index == Main.meListData.length - 1) {
            let line: any = cell.getChildByName("line");
            line.visible = false;
        }
        let textImg: any = cell.getChildByName("textImg");
        textImg.skin = cell.dataSource.src;
    }

    meListOnClick(e:any):void{
        if(e.type=='click'){
            //点击选择的id
            let clickId:number=e.target.dataSource.id;
        }
    }

    requestPageData():void{

    }
}
