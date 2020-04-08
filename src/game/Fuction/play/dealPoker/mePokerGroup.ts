/**
 * 我的牌进行分组
 */
// import MyCenter from '../../common/MyCenter';
import Main from '../../../common/Main';
 //牌的颜色
enum pokerColor{
    none,
    ban,
    bu,
    da
}
class mePokerGroup{
    newReturnArr:any;
     //每列最多多少张牌
     maxColPokerNum: number = 7;
    /**
     * 将'我'的牌的数据进行分组组合
     * @param data 
     */
    composeMeData(data: any,buDataArr:any) {
        //补的牌
        let buPoker:any;
        this.newReturnArr = [];
        let newArr = [];
        let f:boolean=false;
        data.forEach((item: any, index: number) => {
            let Type = parseInt(String(item / 10000));//类型（牌的名字）
            let Color = parseInt(String((item % 10000) / 1000));//颜色（1 红色  2黑色）
            let Point = item - Type * 10000 - Color * 1000;//点数
            let groupP = Point > 7 ? (14 - 7) : Point;//分在位置的点数（1-7点位置）
            newArr.push({ type: Type, Color: Color, seatPoint: groupP, Point: Point, isGrey: pokerColor.none, oldName: item })
            //     console.log(item,'牌名字type：'+Type,'牌颜色Color：'+Color,'牌点数Point：'+Point);
        })
        let myTypeDest: any = (this.group(newArr, 'type')).filter((item: any) => item.data.length >= 3);
        newArr.forEach((item2: any, index2: number) => {
            item2.isGrey = pokerColor.none;
            myTypeDest.forEach((item: any) => {
                if (item.type == item2.type)
                    item2.isGrey = pokerColor.ban;
            })
        })
        //补牌的效果
        if(buDataArr)
        buDataArr.forEach((item:any)=>{
            f=true;
            newArr.forEach((item2: any) => {
                if(item2.type==parseInt(String(item/10000))&&f){
                    f=false;
                    item2.isGrey=pokerColor.bu;
                }
            })
        })

        //分组
        let myDest: any = this.group(newArr, 'seatPoint');
        //排序
        this.sortData(myDest);
        let bigArr: any;
        myDest.forEach((item: any, index: number) => {
            let filterArr = item.data.filter((item2: any, index2: number) => (index2 > 0) && (index2 % (this.maxColPokerNum) == 0));
            if (filterArr.length > 0) {
                bigArr = this.getNewArr(item, filterArr);
                myDest = myDest.concat(bigArr);
            }
        });
        for (let i = myDest.length - 1; i >= 0; i--) {
            if (myDest[i].data.length > this.maxColPokerNum) {
                myDest.splice(i, 1);
            }
        }
        myDest.forEach((item: any, index: number) => {
            item.name = 'p' + (index + 1);
        });
        this.sortData(myDest);

        // return (this.beforeGroupData.map((item: any) => {
        //     if (item.uid == Main.userInfo.userId) {
        //         return { uid: item.uid, banker: item.banker, pokers: myDest };
        //     } else {
        //         return item;
        //     }
        // }));

        return myDest;
        console.log('groupedData:',myDest)//this.beforeGroupData
    }

    getNewArr(item: any, filterArr: any) {
        let myIndexArr = [];
        filterArr.forEach((item0: any, index0: number) => {
            let falg = true;
            item.data.forEach((item2: any, index2: number) => {
                if ((item0.type == item2.type) && falg) {
                    falg = false
                    myIndexArr.push(index2);
                }
            })
        })
        myIndexArr.unshift(0);
        myIndexArr.push(item.data.length);

        for (let i = 0; i < myIndexArr.length; i++) {
            if (myIndexArr[i + 1]) {
                let myData = item.data.slice(myIndexArr[i], myIndexArr[i + 1]);
                this.newReturnArr.push({ seatPoint: myData[0].seatPoint, data: myData })
            }
        }

        let filterArr_inner: any=[];
        let f: boolean = false;
        let aa: any;

        for(let i=0;i<this.newReturnArr.length;i++){
            if(this.newReturnArr[i].data.length>(this.maxColPokerNum)){
                filterArr_inner=this.newReturnArr[i].data.filter((item2:any,index2:number)=>(index2>0)&&((index2)%(this.maxColPokerNum)==0));
                aa=this.newReturnArr[i];
                break;
            }
        }
        filterArr.forEach((item1: any) => {
            filterArr_inner.forEach((item2: any) => {
                if (item1.type != item2.type) {
                    f = true;
                }
            })
        })
        if (filterArr_inner.length > 0 && f) {
            return this.getNewArr(aa, filterArr_inner);
        } else if (!f) {
            return this.newReturnArr;
        }
    }


    /**
     * 根据某‘字段’进行json数据分组
     * @param arr 数组
     */
    group(arr: any[], key: string) {
        let map = {}, dest = [];
        for (var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            if (!map[ai[key]]) {
                dest.push({
                    [key]: ai[key],
                    data: [ai]
                });
                map[ai[key]] = ai;
            } else {
                for (var j = 0; j < dest.length; j++) {
                    var dj = dest[j];
                    if (dj[key] == ai[key]) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        return dest;
    }

    
    /**
     * 将json数据根据某字段进行排序（数字类型）
     * @param arr 
     */
    sortData(arr: any) {
        arr.forEach((item: any) => {
            item.data.sort((a: any, b: any) => {
                return a.type - b.type;
            })
        })
    }
}
export default new mePokerGroup();