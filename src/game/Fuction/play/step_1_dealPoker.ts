/**
 * 发牌功能
 */
import MyCenter from '../../common/MyCenter';
import Main from '../../common/Main';
import mePokerGroup from './dealPoker/mePokerGroup';
import showPlayerPokerCount from '../play/changePlayerNum/showPlayerPokerCount';//实时显示玩家牌的数量
import websoket from '../../Fuction/webSoketSend';
//牌的颜色
enum pokerColor {
    none,
    ban,
    bu,
    da
}
class DealPoker {
    //自己发牌容器
    meDealView: any;
    //其他人的牌
    others: any[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    //有几个人参与
    joinCount: number = 0;
    //玩家脚本数组
    players: any;
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

    //分组前的牌
    beforeGroupData: any[];
    //分组后的牌
    groupedData: any[];

    //初始化
    init(that: any, data: any) {
        // console.log(that, data)
        if (this.joinCount == 0) {
            this.beforeGroupData = [];
            this.groupedData = [];
        }
        this.initVal1(that, data);
        //初始化我的牌的数据
        this.initVal2(that, data);
        if (this.joinCount == MyCenter.getKeep('dealPCount')) {
            this.initVal3();
            this.MovePoker();
        }
    }

    initVal1(that: any, data: any): void {
        this.joinCount++;
        //其他人的牌进行填充
        data.pokers = data.pokers ? data.pokers : this.others;
        data.userId = data.uid;
        that.pokers = data.pokers ? data.pokers : this.others;
        this.beforeGroupData.push(data);
    }

    initVal2(that: any, data: any) {
        if (data.userId == Main.userInfo.userId && data.pokers.length > 0) {
            this.groupedData = mePokerGroup.composeMeData(data.pokers, null);
            // movePoker.move();
            console.log(this.groupedData)
        }
    }

    initVal3(): void {
        this.joinCount = 0;
        this.userIndex = 0;
        this.pokerIndex = 0;
        this.timerNum = 0;
        this.players = MyCenter.GameControlObj.players;
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
    * 删除牌的数据
    * @param data 
    */
    removeMePoker(that: any, data: any) {
        console.log('进来', data, this.beforeGroupData)
        let mePokerArr: any = this.beforeGroupData.filter((item) => item.userId == that.userId)[0];
        data.forEach((item: any) => {
            for (let i = mePokerArr.pokers.length - 1; i >= 0; i--) {
                if (item == mePokerArr.pokers[i]) {
                    mePokerArr.pokers.splice(i, 1);
                    break;
                }
            }
        });
        this.reloadPokerCoomon(mePokerArr.pokers, null);
    }

    /**
    * 补牌
    * @param data 数据为空时解除补牌标志
    */
    buPoker(that: any, data: any, callBack?: Function) {
        // let bankerUid=MyCenter.getKeep('bankerUid')?MyCenter.getKeep('bankerUid'):100010;
        let buPokerArr: any = data;
        showPlayerPokerCount.show(that, true, that.pokerCount + buPokerArr.length);
        if (data && data.length > 0) {
            this.beforeGroupData.forEach((item: any) => {
                if (item.uid == that.userId) {
                    if (that.IsMe) {
                        item.pokers = item.pokers.concat(data);
                        that.pokers = that.pokers.concat(data);
                        this.reloadPokerCoomon(that.pokers, buPokerArr);
                    } else {
                        that.pokers = that.pokers.concat(data);
                    }
                }
            })
        }
        // this.reloadPokerCoomon(that,data);
        if (callBack)
            callBack();
    }

    /**
  * 重新更新数据
  * @param data null--直接更新  不为空--补牌
  */
    reloadPokerCoomon(mePokers: any, buPokerArr: any) {
        this.groupedData = mePokerGroup.composeMeData(mePokers, buPokerArr);
        // console.log('补牌:',this.groupedData)
        this.showMePokerView();
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
                    // this.meDealView.removeChildren();
                    // this.meDealView.width = Main.pokerWidth;
                    this.showMePokerView(true);
                }
            }));
        }
    }

    /**
    * 合牌,移动每列牌到中间消失一系列动作结束(接下来就是显示切好的牌)
    */
    showMePokerView(isFrist?: boolean): void {//mePokerData: any
        this.meDealView.removeChildren();
        this.meDealView.width = Main.pokerWidth;
        let mePokerData: any[] = this.groupedData;
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
                    if (item_inner.isGrey == pokerColor.ban) {
                        this.changePokerColor(pokerObj, Main.pokerParam['color' + pokerColor.ban], 'noHanldePoker');
                    } else if (item_inner.isGrey == pokerColor.bu) {
                        this.changePokerColor(pokerObj, Main.pokerParam['color' + pokerColor.bu], 'noHanldePoker');
                    }
                    // let pokerNum:number=item_inner.type*10000+item_inner.color*1000+item_inner.Point;
                    // pokerObj['pokerNum']=pokerNum;
                    pokerObj.name = item_inner;
                    pokerObj.sizeGrid = "85,0,10,0";
                    pokerObj.off(Laya.Event.CLICK, this, this.ClickPoker);
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
        // console.log('发牌结束===')
        if (isFrist) {
            this.players.forEach((item: any) => {
                showPlayerPokerCount.show(item, true, 20);
            });
            MyCenter.send('qiPoker', true);
            MyCenter.keep('showHandle', true);
        }
    }


    /**
     * 点击牌事件
     * @param pokerObj 点击的牌对象
     *  */
    ClickPoker(pokerObj: any, e: any) {
        e.stopPropagation();
        if (pokerObj.height > Main.pokerWidth) {
            let isMePlay: boolean = MyCenter.getKeep('isMePlay');
            if (isMePlay) {
                //出牌请求
                websoket.playPoker(pokerObj.name.oldName);
                let meJS: any = this.players.filter((item: any) => item.IsMe)[0];
                showPlayerPokerCount.show(meJS, true, meJS.pokerCount - 1);
                MyCenter.GameControlObj.playerPlaySet({ userId: meJS.userId }, false);
                this.mePlayPoker(pokerObj);
                pokerObj.removeSelf();
                //检测牌并重新排位置
                let mePutViewChildren = this.meDealView._children;
                mePutViewChildren.forEach((item: any, index: number) => {
                    let innerChildren = item._children;
                    if (innerChildren.length == 0) {//某列全部移除时
                        item.removeSelf();
                        this.meDealView.width -= Main.pokerWidth;
                    }
                    this.mePutViewReloadSeat();
                })
            }
            else {
                this.mePutViewReloadSeat();
            }
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
        showMePlayPoker.skin = 'res/img/poker/chang/' + pokerObj.name.type + '.png';
        Laya.Tween.to(showMePlayPoker, { alpha: 1, x: showMePlayPoker.width / 2, y: showMePlayPoker.height / 2 }, Main.Speed['mePlay']);
        // console.log(showMePlayPoker)
    }

    /**
     * 点击牌时候，使牌加上高亮(颜色层)
     */
    changePokerColor(pokerObj: any, colorImgUrl: string, name?: string) {
        if (colorImgUrl) {
            let colorImg = new Laya.Image(colorImgUrl);
            colorImg.name = name;
            colorImg.left = 0;
            colorImg.right = 0;
            colorImg.bottom = 0;
            colorImg.top = 0;
            pokerObj.addChild(colorImg);
        } else {
            let clickColorImg: any = pokerObj.getChildByName(name);
            if (clickColorImg)
                clickColorImg.removeSelf();
        }
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
export default new DealPoker();