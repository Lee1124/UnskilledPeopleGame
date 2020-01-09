/**中转站 */
class MyCenter{
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
}
export default new MyCenter();