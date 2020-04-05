/**
 * 发牌功能
 */
import MyCenter from '../../common/MyCenter';
import Main from '../../common/Main';
class DealMePoker {
    //====正式====
    others: any[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    //自己发牌容器
    meDealView: any;

    //每列最多多少张牌
    maxColPokerNum: number = 7;
    //分组前的牌
    beforeGroupData: any[];
    //分组后的牌
    groupedData: any[];

    //玩家索引
    userIndex: number;
    //牌的索引
    pokerIndex: number;
    //玩家自己的每列的索引
    meCellIndex: number;
    //牌的总数
    pokerNum: number = 0;
    //循环的数量
    timerNum: number = 0;
    //玩家
    players: any;
    //发牌显示
    showDealView: any;
    newReturnArr: any[] = [];
    /**
     * 将'我'的牌的数据进行分组组合
     * @param data 
     */
    composeMeData(data: any) {
        //重置数据
        this.newReturnArr = [];
        let newArr = [];
        data.forEach((item: any, index: number) => {
            let Type = parseInt(String(item / 10000));//类型（牌的名字）
            let Color = parseInt(String((item % 10000) / 1000));//颜色（1 红色  2黑色）
            let Point = item - Type * 10000 - Color * 1000;//点数
            let groupP = Point > 7 ? (14 - 7) : Point;//分在位置的点数（1-7点位置）
            newArr.push({ type: Type, Color: Color, seatPoint: groupP, Point: Point, isGrey: false, id: (index + 1) })
            //     console.log(item,'牌名字type：'+Type,'牌颜色Color：'+Color,'牌点数Point：'+Point);
        })
        let myTypeDest: any = (this.group(newArr, 'type')).filter((item: any) => item.data.length >= 3);
        newArr.forEach((item2: any, index2: number) => {
            item2.isGrey = false;
            myTypeDest.forEach((item: any) => {
                if (item.type == item2.type)
                    item2.isGrey = true;
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
        return (this.beforeGroupData.map((item: any) => {
            if (item.uid == Main.userInfo.userId) {
                return { uid: item.uid, banker: item.banker, pokers: myDest };
            } else {
                return item;
            }
        }));
        // console.log('groupedData:',this.groupedData)//this.beforeGroupData
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

        let filterArr_inner: any;
        let f: boolean = false;
        let aa: any;
        this.newReturnArr.forEach(item => {
            filterArr_inner = item.data.filter((item2: any, index2: number) => (index2 > 0) && (index2 % (this.maxColPokerNum) == 0));
            aa = item;
        })
        // console.log('newReturnArr++',this.newReturnArr)
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
            // console.log('newReturnArr',newReturnArr)
            return this.newReturnArr;
        }
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
     * 发牌
     * @param data 数据
     */
    deal(data: any): void {
        let mePokerArr: any[] = [];
        this.userIndex = 0;
        this.pokerIndex = 0;
        this.timerNum = 0;
        this.players = MyCenter.GameControlObj.players;
        this.init();
        this.beforeGroupData = data;
        this.beforeGroupData.forEach((item: any) => {
            item.userId = item.uid;
            item.pokers = item.pokers ? item.pokers : this.others;
        })
        let meData: any[] = data.filter((item: any) => item.uid === Main.userInfo.userId);
        if (meData.length > 0) {
            //将自己的牌进行分组
            this.groupedData = this.composeMeData(meData[0].pokers);
        }
        // this.players[1].userId=100018, this.players[2].userId=100021;
        this.MovePoker();
    }

    /**
     * 初始化
     */
    init() {
        if (this.meDealView)
            this.meDealView.removeChildren();
        //初始化发牌容器的层级
        MyCenter.GameUIObj.dealSeat.zOrder = 0;
        //初始化玩家受到发牌的位置
        this.players.forEach((item: any) => {
            let getDealPokerSeat = item.owner.getChildByName('getDealPokerSeat');
            getDealPokerSeat.bottom = item.IsMe ? Main.deal['meBottom'] : Main.deal['otherBottom'];
            item.owner.zOrder = item.IsMe ? 1 : 0;
        })
    }

    /**
     * 开始移动牌
     * @param index 牌索引
     *  */
    MovePoker() {
        //该发牌的玩家的牌的json数据
        let dealPlayerData = this.beforeGroupData[this.userIndex];
        //发牌的牌
        let dealSeat: Laya.Sprite = MyCenter.GameUIObj.dealSeat;
        let dealPoker: Laya.Sprite = Laya.Pool.getItemByCreateFun("dealPoker", MyCenter.GameControlObj.dealPoker.create, MyCenter.GameControlObj.dealPoker);
        dealPoker.name = String(this.timerNum);
        dealPoker.alpha = 0;
        dealPoker.pos(0, 0);
        dealSeat.addChild(dealPoker);
        this.players.forEach((item: any, index: number) => {
            if (item.userId == dealPlayerData.userId) {
                // console.log(item.userId,dealPlayerData.userId)
                let getDealPokerSeat = item.owner.getChildByName('getDealPokerSeat');
                let getDealPokerSeatXY = getDealPokerSeat.parent.localToGlobal(new Laya.Point(getDealPokerSeat.x, getDealPokerSeat.y));
                let x: number = getDealPokerSeatXY.x - MyCenter.GameUIObj.dealPokerSeatXY.x;
                let y: number = getDealPokerSeatXY.y - MyCenter.GameUIObj.dealPokerSeatXY.y;
                let moveObj = dealSeat.getChildByName(String(this.timerNum));
                Laya.Tween.to(moveObj, { alpha: 0.8, x: x, y: y }, Main.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                    if (item.IsMe) {
                        this.meDealView = item.owner.getChildByName('mePokerView');
                        this.meDealView.visible = true;
                        if ((this.pokerIndex) % 5 == 0) {
                            this.meCellIndex = 0;
                            let pokerCellView: Laya.Image = new Laya.Image();
                            pokerCellView.name = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                            pokerCellView.size(Main.pokerWidth, 450);
                            pokerCellView.bottom = 0;
                            pokerCellView.x = Main.pokerWidth * parseInt(String((this.pokerIndex / 5)));
                            this.meDealView.width = Main.pokerWidth * (parseInt(String((this.pokerIndex / 5))) + 1);
                            let hh = this.meDealView.addChild(pokerCellView);
                        }
                        let mePokerObj: Laya.Image = new Laya.Image();
                        let pokerTypeName: any = parseInt(String((dealPlayerData.pokers[this.pokerIndex]) / 10000));
                        if (this.meCellIndex == 0) {
                            mePokerObj.size(Main.pokerWidth, 450);
                            mePokerObj.loadImage('res/img/poker/chang/' + pokerTypeName + '.png');
                        } else {
                            mePokerObj.size(Main.pokerWidth, Main.pokerWidth);
                            mePokerObj.loadImage('res/img/poker/duan/' + pokerTypeName + '.png');
                        }
                        let childName = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                        let pokerCellViewObj = this.meDealView.getChildByName(childName);
                        if (pokerCellViewObj && pokerCellViewObj.name == childName) {
                            pokerCellViewObj.addChild(mePokerObj);
                            if (this.meCellIndex == 0) {
                                mePokerObj.bottom = 0;
                            } else {
                                mePokerObj.bottom = (450 + Main.pokerWidth * (this.meCellIndex - 1)) - 45 * (this.meCellIndex);
                                Main.pokerWidth * this.meCellIndex
                            }
                            mePokerObj.zOrder = 4 - this.meCellIndex;
                        }
                        this.meCellIndex++;
                    }
                    Laya.Tween.to(moveObj, { alpha: 0 }, Main.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                        moveObj.removeSelf();
                    }));
                    this.timerNum++;
                    this.userIndex++;
                    if (this.userIndex % 3 == 0) {
                        this.userIndex = 0;
                        this.pokerIndex++;
                    }
                    if (this.timerNum >= 20 * 3) {
                        Laya.timer.clear(this, this.MovePoker);
                        MyCenter.GameUIObj.dealSeat.zOrder = 2;
                        this.dealPokerEnd();
                    } else {
                        this.MovePoker();
                    }
                }))
            }
        })

    }

    /**
     * 发牌结束(下一个动作就是合牌,移动每列牌到中间消失)
     */
    dealPokerEnd(): void {
        //发牌容器的子节点的数量
        let numChildren: number = this.meDealView.numChildren;
        //计算每列移动的位置
        let cellMoveX: number = (this.meDealView.width / 2) - (Main.pokerWidth / 2);
        for (let i = 0; i < numChildren; i++) {
            //根据索引获取子节点
            let childNode: Laya.Sprite = this.meDealView.getChildAt(i);
            //计算
            Laya.Tween.to(childNode, { x: cellMoveX }, Main.Speed['dealPoker2'], null, Laya.Handler.create(this, () => {
                if (i >= numChildren - 1) {
                    this.meDealView.removeChildren();
                    this.meDealView.width = Main.pokerWidth;
                    this.showMePokerView();
                }
            }));
        }
    }

    /**
     * 合牌,移动每列牌到中间消失一系列动作结束(接下来就是显示切好的牌)
     */
    showMePokerView(): void {//mePokerData: any
        let mePokerData: any[] = [];
        this.groupedData.forEach((item: any, index: number) => {
            if (item.uid == Main.userInfo.userId) {
                mePokerData = item.pokers;
            }
        })
        let playerMe: any = this.players.filter((item: any) => item.IsMe);
        if (playerMe.length > 0) {
            //摆牌容器
            //设置摆牌容器的总宽度
            this.meDealView.width = Main.pokerWidth * mePokerData.length;
            mePokerData.forEach((item: any, index: number) => {
                let cellObj = new Laya.Image();
                cellObj.name = item.name;
                cellObj.size(Main.pokerWidth, 0);
                cellObj.x = Main.pokerWidth * index;
                cellObj.bottom = 0;
                item.data.forEach((item_inner: any, index_inner: number) => {
                    let pokerObj = new Laya.Image('res/img/poker/duan/' + item_inner.type + '.png');
                    if (item_inner.isGrey) {
                        this.changePokerColor(pokerObj, Main.pokerParam['color1'], 'noHanldePoker');
                    }
                    pokerObj.name = item_inner;
                    pokerObj.sizeGrid = "85,0,10,0";
                    pokerObj.on(Laya.Event.CLICK, this, this.ClickPoker, [pokerObj]);
                    pokerObj.size(Main.pokerWidth, Main.pokerWidth);
                    pokerObj.x = 0;
                    pokerObj.zOrder = item.data.length - index_inner;
                    if (index_inner == 0)
                        pokerObj.bottom = Main.pokerWidth * index_inner;
                    else if (index_inner >= 1)
                        pokerObj.bottom = Main.pokerWidth * index_inner - (45 * index_inner);
                    cellObj.addChild(pokerObj);
                })
                this.meDealView.addChild(cellObj);
            })
        }
    }
    /**
     * 点击牌事件
     * @param pokerObj 点击的牌对象
     *  */
    ClickPoker(pokerObj: any, e: any) {
        e.stopPropagation();
        if (pokerObj.height > Main.pokerWidth) {
            this.mePlayPoker(pokerObj);
            pokerObj.removeSelf();
            //检测牌并重新排位置
            let mePutViewChildren = this.meDealView._children;
            mePutViewChildren.forEach((item, index) => {
                let innerChildren = item._children;
                if (innerChildren.length == 0) {//某列全部移除时
                    item.removeSelf();
                    this.meDealView.width -= Main.pokerWidth;
                }
                this.mePutViewReloadSeat();
            })
        } else {
            let noClick = pokerObj.getChildByName('noHanldePoker');
            if (!noClick) {
                this.mePutViewReloadSeat();
                this.changePokerColor(pokerObj, Main.pokerParam['color2'], 'clickColorImg');
                let pokerObjH = pokerObj.height + 50;
                Laya.Tween.to(pokerObj, { height: pokerObjH }, Main.Speed['pokerHeight'], Laya.Ease.backOut, Laya.Handler.create(this, () => {
                    this.adjustCellPokerSeat(pokerObj);
                }));
            }
        }
    }

    /**
     * 点击牌时候，使牌加上高亮(颜色层)
     */
    changePokerColor(pokerObj: any, colorImgUrl: string, name: string) {
        let colorImg = new Laya.Image(colorImgUrl);
        colorImg.name = name;
        colorImg.left = 0;
        colorImg.right = 0;
        colorImg.bottom = 0;
        colorImg.top = 0;
        pokerObj.addChild(colorImg);
    }

    /**
     * 玩家自己出牌的效果
     */
    mePlayPoker(pokerObj: any): void {
        let pokerObjSeatXY = pokerObj.parent.localToGlobal(new Laya.Point(pokerObj.x, pokerObj.y));
        let showMePlayPoker = MyCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
        let showMePlayPokerXY = showMePlayPoker.parent.localToGlobal(new Laya.Point(showMePlayPoker.x, showMePlayPoker.y));
        let startX = pokerObjSeatXY.x - showMePlayPokerXY.x + showMePlayPoker.width;
        let startY = pokerObjSeatXY.y - showMePlayPokerXY.y + showMePlayPoker.height / 2;
        showMePlayPoker.pos(startX, startY);
        showMePlayPoker.skin = 'res/img/poker/chang/' + pokerObj.name + '.png';
        Laya.Tween.to(showMePlayPoker, { alpha: 1, x: showMePlayPoker.width / 2, y: showMePlayPoker.height / 2 }, Main.Speed['mePlay']);
        // console.log(showMePlayPoker)
    }

    /**
     * 其他玩家出牌的效果
     */
    otherPlay(num: number): void {
        let playData = {
            userId: `12345${num}`,
            data: parseInt(String(Math.random() * 21)) + 1
        };
        this.players.forEach(item => {
            if (item.userId == playData.userId) {
                let playPokerSeatFeelView = item.owner.getChildByName('feelView');
                let playPokerSeat = playPokerSeatFeelView.getChildByName('feelPoker');
                let playPokerSeatXY = playPokerSeat.parent.localToGlobal(new Laya.Point(playPokerSeat.x, playPokerSeat.y));
                let playerSeat = item.owner;
                let playerSeatXY = playerSeat.parent.localToGlobal(new Laya.Point(playerSeat.x, playerSeat.y));
                let startX = playerSeatXY.x - playPokerSeatXY.x;
                let startY = playerSeatXY.y - playPokerSeatXY.y;
                this.initOtherPlay(true, startX, startY, 1, 1, 1, playPokerSeatFeelView, playPokerSeat);
                Laya.Tween.to(playPokerSeat, { centerX: 0, centerY: 0, alpha: Main.pokerParam['alpha'] }, Main.Speed['otherPlay'], null, Laya.Handler.create(this, () => {
                    Laya.Tween.to(playPokerSeat, { scaleX: 0 }, Main.Speed['otherPlay'] / 2, null, Laya.Handler.create(this, () => {
                        playPokerSeat.skin = 'res/img/poker/chang/' + playData.data + '.png';
                        Laya.Tween.to(playPokerSeat, { scaleX: 1 }, Main.Speed['otherPlay'] / 2);
                    }))
                }))
            }
        })
    }
    /**
     * 初始化其他玩家出牌对象
     */
    initOtherPlay(isShow: boolean, centerX: number, centerY: number, scaleX: number, scaleY: number, alpha: number, playPokerParent: any, playPoker: any) {
        playPokerParent.visible = isShow;
        playPoker.centerX = centerX;
        playPoker.centerY = centerY;
        playPoker.scale(scaleX, scaleY);
        playPoker.alpha = alpha;
        playPoker.skin = 'res/img/poker/chang/-1.png';
    }


    /**
     * 调整出牌该列的牌的位置
     */
    adjustCellPokerSeat(pokerObj: any) {
        let pokerObjParent = pokerObj.parent;
        let pokerObjParentChilds = pokerObjParent._children;
        let clickIndex = 0;
        pokerObjParentChilds.forEach((item, index) => {
            if (item.height > Main.pokerWidth) {
                clickIndex = index
            }
        })
        pokerObjParentChilds.forEach((item, index) => {
            if (index < clickIndex) {
                item.bottom += 50;
            }
        })
    }

    /**节点重新放置位置 */
    mePutViewReloadSeat() {
        let mePutViewChildren = this.meDealView._children;
        mePutViewChildren.forEach((item: any, index: number) => {
            let innerChildren = item._children;
            item.x = Main.pokerWidth * index;
            innerChildren.forEach((item2: any, index2: number) => {
                //清除点击高亮
                let clickColorImg = item2.getChildByName('clickColorImg');
                if (clickColorImg)
                    clickColorImg.removeSelf();
                item2.height = Main.pokerWidth;
                if (index2 == innerChildren.length - 1) {
                    item2.bottom = 0;
                } else {
                    item2.bottom = Main.pokerWidth * ((innerChildren.length - 1) - index2) - 45 * ((innerChildren.length - 1) - index2);
                }
            });
        })
    }
}
export default new DealMePoker();