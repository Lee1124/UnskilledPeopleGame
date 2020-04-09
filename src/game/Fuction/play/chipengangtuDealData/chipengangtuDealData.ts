/**
 * 吃碰杠吐火等处理数据
 */
import Main from "../../../common/Main";
import MyCenter from "../../../common/MyCenter";
enum showType {
    chi,
    pen,
    sha,
    tu
}
 class chipengangtuDealData{
    //吃
    chi(data:any){

    }
    //碰
    pen(data:any){
        let type:any=showType.pen;
        this.common0(data,type,[data.poker,data.poker,data.poker],[data.poker,data.poker]);
    }
    //杠
    gang(data:any){
        let type:any=showType.sha;
        this.common0(data,type,[data.poker,data.poker,data.poker,data.poker],[data.poker,data.poker,data.poker]);
    }
    //吐火
    tuhuo(data:any){
        let type:any=showType.tu;
        this.common0(data,type,[data.poker,data.poker,data.poker,data.poker,data.poker],[data.poker,data.poker,data.poker,data.poker]);
    }

    /**
     * 碰/杠/吐公用
     * @param data 数据
     * @param type 类型
     * @param concatPokers 组合的数据
     * @param removePokers 要删除的牌数据
     */
    common0(data:any,type:any,concatPokers:any,removePokers:any){
        let concatData:any={
            userId:data.userId,
            data:[{type:type,data_inner:concatPokers}]
        };
        removePokers=removePokers;
        this.common(data,type,concatData,removePokers);
    }

     /**
     * 显示吃碰杠吐火时候的数据处理
     * @param item 
     * @param data 
     */
    common(data: any, type:any,concatData: any, removePokers: any): void {
        let dataArr:any=MyCenter.GameControlObj.players.filter((item:any)=>item.userId==data.userId);
        let itemJS:any=dataArr.length>0?dataArr[0]:null;
        if(itemJS){
            data.concatData = concatData;
            data.removePokers = removePokers;
            itemJS.showHandleAni({ opt: type });
            itemJS.showHandlePoker(data);
        }
    }
 }

 export default new chipengangtuDealData();