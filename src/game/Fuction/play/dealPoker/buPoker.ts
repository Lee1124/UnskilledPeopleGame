/**
 * 有关于补牌操作
 */
import MyCenter from '../../../common/MyCenter';
class buPoker{
    /**
     * 补牌显示
     * @param data 数据
     */
    show(data:any,fn?:Function){
        let players:any=MyCenter.GameControlObj.players;
        // let buPokerArr: any[] = data.poker ? [data.poker] : [];
        let buPokerArr: any[]=data.buPokers; 
        players.forEach((itemJS:any) => {
            if (itemJS.userId == data.userId) {
                itemJS.buPoker(buPokerArr,fn);
            }
        });
    }
    /**
     * 清除补牌的标记
     */
    clearSign(){
        let players:any=MyCenter.GameControlObj.players;
        players.forEach((itemJS:any) => {
            if(itemJS.IsMe)
                itemJS.clearBuPokerSign();
        });
    }
}

export default new buPoker();