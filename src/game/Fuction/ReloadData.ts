/**
 * 重置所有数据
 */
import Main from '../common/Main';
import MyCenter from '../common/MyCenter';
 class ReloadData{
    //玩家数据
    players:any;
    init():void{
        this.players=MyCenter.GameControlObj.players;
        this.players.forEach((itemJS:any,index:number)=>{
            itemJS.userId=null;
            itemJS.SeatId=index;
            itemJS.Index=index;
            itemJS.IsMe=false;
            this.setNodes(itemJS,index);
        })
    }

    /**
     * 设置节点
     */
    setNodes(itemJS:any,Index:number){
        console.log(MyCenter.GameUIObj.startSeatXY[Index].x)
        itemJS.owner.pos(MyCenter.GameUIObj.startSeatXY[Index].x,MyCenter.GameUIObj.startSeatXY[Index].y);
        let seatNode:any=itemJS.owner;
        let head:any=seatNode.getChildByName('head');
        head.skin='';
        let score:any=seatNode.getChildByName('score');
        score.text=0;
        let name:any=seatNode.getChildByName('name');
        name.text='';
        let liuzuo:any=seatNode.getChildByName('liuzuo');
        let conutDown:any=seatNode.getChildByName('conutDown');
        this.common([head,score,name,liuzuo,conutDown]);
    }

    //公用方法
    common(arrObj:any):void{
        arrObj.forEach((item:any)=>{
            item.visible=false;
        })
    }

 }
 export default new ReloadData();