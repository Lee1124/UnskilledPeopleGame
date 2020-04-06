/**中转站 */
class MyCenter{
    //是否是打牌阶段
    play:boolean=false;
    //显示操作
    showHandle:boolean;
    //庄家id
    bankerUid:any;
    //保存数据
    keepList:any[];
    //gameUI对象
    GameUIObj:any;
    //gameControl对象
    GameControlObj:any;
    /**接收 */
    req(key:string,fn:any){
        this.keepList=[];
        this.keepList=[{key:key,fn:fn}];
    }
    /**发送 */
    send(key:string,val:any){
        this.keepList.forEach(item=>{
            if(key==item.key){
                item.fn(val);
            }
        })
    }
    /**初始化游戏界面UI的部分数据 */
    InitGameUIData(thisObj:any){
        this.GameUIObj=thisObj;
    }
    /**初始化游戏控制中心的部分数据 */
    InitGameData(thisObj:any){
        this.GameControlObj=thisObj;
    }
    keep(key:string,bool:boolean){
        this[key]=bool;
    }
    getKeep(key:string){
        return this[key]
    }
}
export default new MyCenter();