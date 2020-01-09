(function () {
    'use strict';

    class MyCenter {
        req(key, fn) {
            this.keepList = [];
            this.keepList = [{ key: key, fn: fn }];
        }
        send(key, val) {
            this.keepList.forEach(item => {
                if (key == item.key) {
                    item.fn(val);
                }
            });
        }
        InitGameUIData(thisObj) {
            this.GameUIObj = thisObj;
        }
        InitGameData(thisObj) {
            this.GameControlObj = thisObj;
        }
    }
    var MyCenter$1 = new MyCenter();

    class SuspensionTips extends Laya.Script {
        constructor() {
            super();
            this.tipsContent = [];
            this.targets = [];
            this.targetY = 300;
        }
        onEnable() {
            this.InitArr(0);
        }
        InitArr(val) {
            Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val)
                        return i;
                }
                return -1;
            };
            Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
        }
        ;
        add(content) {
            this.tipsContent.push(content);
            this.play();
        }
        createTarget(parent, char) {
            let targetParent = new Laya.Image;
            targetParent.name = "parent";
            targetParent.anchorX = 0.5;
            targetParent.anchorY = 0.5;
            let tipBg = new Laya.Sprite();
            tipBg.name = "child";
            tipBg.size(770, 110);
            tipBg.scale(0, 0);
            tipBg.y = this.targetY;
            tipBg.loadImage('res/img/common/tip.png', Laya.Handler.create(this, () => {
                tipBg.pivot(tipBg.width / 2, tipBg.height / 2);
                tipBg.x = parent.width / 2;
            }));
            let msg = new Laya.Label;
            msg.size(770, 110);
            msg.align = 'center';
            msg.valign = 'middle';
            msg.text = char;
            msg.color = "#FFFFFF";
            msg.font = "Impact";
            msg.fontSize = 40;
            tipBg.addChild(msg);
            targetParent.addChild(tipBg);
            parent.addChild(targetParent);
            return targetParent;
        }
        play() {
            if (this.tipsContent.length > 0)
                this.setTween();
        }
        setTween() {
            let content = this.tipsContent.shift();
            let target = this.createTarget(this.owner, content);
            this.setScale(target.getChildByName("child"), 1, 1, 300);
            this.UpdateTargets();
            this.targets.unshift(target);
        }
        UpdateTargets() {
            let offsetY = 0;
            let lastItem = null;
            this.targets.forEach((item, index) => {
                let tar = item.getChildByName("child");
                let lastTar = lastItem != null ? lastItem.getChildByName("child") : null;
                let point = new Laya.Point(tar.x, tar.y);
                let localPoint = item.localToGlobal(point);
                let point2 = lastTar != null ? new Laya.Point(lastTar.x, lastTar.y - tar.height) : new Laya.Point(0, this.targetY - tar.height);
                let localPoint2 = lastTar == null ? item.localToGlobal(point2) : lastItem.localToGlobal(point2);
                if (localPoint.y > localPoint2.y) {
                    offsetY = localPoint.y - localPoint2.y;
                    item.y -= offsetY;
                }
                lastItem = item;
            });
        }
        setScale(target, sX, sY, time) {
            Laya.Tween.to(target, { scaleX: sX, scaleY: sX }, time, null, Laya.Handler.create(this, this.setMove, [target, 0, 1000]));
        }
        setMove(target, endY, time) {
            this.play();
            Laya.Tween.to(target, { y: endY }, time, null, Laya.Handler.create(this, this.tweenEnd, [target]));
        }
        UpdateMove(target, endY, time) {
            Laya.Tween.to(target, { y: endY }, time);
        }
        tweenEnd(target) {
            this.owner.removeChild(target.parent);
            this.targets['remove'](target.parent);
        }
        removeTarget() {
        }
        onUpdate() {
        }
    }

    class Main {
        constructor() {
            this.debug = true;
            this.pokerWidth = 128;
            this.count = 105;
            this.pokerParam = {
                alpha: 0.7
            };
            this.tipArr1 = [];
            this.tipArr2 = [];
            this.Speed = {
                changeSeat: 200,
                dealPoker: 40,
                dealPoker2: 120,
                feelPoker: 200,
                feelFan: 100,
                pokerHeight: 50,
                mePlay: 100,
                otherPlay: 50,
            };
            this.userInfo = {
                userId: 123450
            };
            this.loadPokerArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        }
        $LOG(...data) {
            if (this.debug)
                console.log(data);
        }
        beforeReload() {
            Laya.loader.load(['res/img/poker/chang/-1.png']);
            this.loadPokerArr.forEach(item => {
                Laya.loader.load(['res/img/poker/chang/' + item + '.png']);
                Laya.loader.load(['res/img/poker/duan/' + item + '.png']);
            });
        }
        createTipBox() {
            let tipBox = new Laya.Image();
            tipBox.zOrder = 40;
            tipBox.name = 'tipBox';
            tipBox.height = 300;
            tipBox.left = 0;
            tipBox.right = 0;
            tipBox.pivot(tipBox.width / 2, tipBox.height / 2);
            tipBox.pos((Laya.stage.width - tipBox.width) / 2, (Laya.stage.height - tipBox.height) / 2);
            Laya.stage.addChild(tipBox);
            tipBox.addComponent(SuspensionTips);
            this.tipArr1 = ['tipBox'];
            this.tipArr2.forEach(item => {
                let tipJS = tipBox.getComponent(SuspensionTips);
                tipJS.add(item.msg);
                this.tipArr2 = [];
                return;
            });
        }
        showTip(msg) {
            this.tipArr1.forEach(item => {
                let tipBox = Laya.stage.getChildByName(item);
                if (tipBox) {
                    let tipJS = tipBox.getComponent(SuspensionTips);
                    tipJS.add(msg);
                }
            });
            if (this.tipArr1.length == 0)
                this.tipArr2 = [{ msg: msg }];
        }
    }
    var Main$1 = new Main();

    class ChangeSeat {
        constructor() {
            this.seatIndexArr = [0, 1, 2];
            this.selectSeatIndex = null;
            this.selectSeatId = null;
        }
        change(CLICKOBJ, thisObj) {
            this.selectSeatIndex = thisObj.Index;
            this.selectSeatId = thisObj.SeatId;
            this.seatIndexArr = [0, 1, 2];
            this.playerSeatArr = MyCenter$1.GameControlObj.players;
            this.playerSeatXYArr = MyCenter$1.GameUIObj.startSeatXY;
            this.playerFeelSeatXYArr = MyCenter$1.GameUIObj.startFeelSeatXY;
            let NewSeatIndexArr = this.seatIndexArr.splice(this.selectSeatIndex, this.seatIndexArr.length).concat(this.seatIndexArr.splice(0, this.selectSeatIndex + 1));
            this.setSeatContent(thisObj);
            NewSeatIndexArr.forEach((item, index) => {
                this.playerSeatArr[index].IsMe = false;
                this.playerSeatArr[item].SeatId = index;
                Laya.Tween.to(this.playerSeatArr[item].owner, { x: this.playerSeatXYArr[index].x, y: this.playerSeatXYArr[index].y }, Main$1.Speed['changeSeat']);
                this.changeSeatNodeParam(this.playerSeatArr[item].owner, index);
            });
            thisObj.IsMe = true;
        }
        setSeatContent(seatObj) {
            seatObj.userId = `123450`;
            seatObj.owner.getChildByName('head').visible = true;
            seatObj.owner.getChildByName('head').skin = 'res/img/common/defaultIcon.png';
            seatObj.owner.getChildByName('name').visible = true;
            seatObj.owner.getChildByName('name').text = `用户名-0`;
            seatObj.owner.getChildByName('score').visible = true;
            seatObj.owner.getChildByName('score').text = parseInt(String(Math.random() * 100 + 100));
        }
        changeSeatNodeParam(seatObj, index) {
            let feelPokerNode = seatObj.getChildByName('feelView');
            feelPokerNode.pos(this.playerFeelSeatXYArr[index].x, this.playerFeelSeatXYArr[index].y);
        }
    }
    var ChangeSeat$1 = new ChangeSeat();

    class seat extends Laya.Script {
        constructor() {
            super();
            this.IsMe = false;
            this.Index = 0;
            this.SeatId = 0;
        }
        onEnable() {
            this.RegisterEvent();
            console.log(this);
        }
        onStart() {
            setTimeout(() => {
                this.Send();
            });
        }
        RegisterEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.CLICK_SEAT);
        }
        Send() {
            MyCenter$1.send('seat', this);
        }
        CLICK_SEAT(Event) {
            console.log(Event, this);
            ChangeSeat$1.change(Event, this);
        }
    }

    class InitGameData {
        Init(seatObj, conObj) {
            seatObj.Index = conObj.Index;
            seatObj.SeatId = conObj.Index;
            let startSeat = seatObj.owner;
            conObj.owner.startSeatXY.push({ x: startSeat.x, y: startSeat.y });
            let feelSeat = seatObj.owner.getChildByName('feelView');
            conObj.owner.startFeelSeatXY.push({ x: feelSeat.x, y: feelSeat.y });
            let dealPokerSeat = conObj.owner.dealSeat;
            let dealPokerSeatXY = dealPokerSeat.parent.localToGlobal(new Laya.Point(dealPokerSeat.x, dealPokerSeat.y));
            conObj.owner.dealPokerSeatXY = { x: dealPokerSeatXY.x, y: dealPokerSeatXY.y };
            let feelPokerSeat = conObj.owner.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            let feelPokerSeatXY = feelPokerSeat.parent.localToGlobal(new Laya.Point(feelPokerSeat.x, feelPokerSeat.y));
            conObj.owner.feelPokerSeatXY = { x: feelPokerSeatXY.x, y: feelPokerSeatXY.y };
            let getPokerSeat = seatObj.owner.getChildByName('getOtherPokerSeat');
            let getPokerSeatXY = getPokerSeat.parent.localToGlobal(new Laya.Point(getPokerSeat.x, getPokerSeat.y));
            seatObj.getOtherPokerSeat = { x: getPokerSeatXY.x, y: getPokerSeatXY.y };
            let getMePokerSeat = conObj.owner.getMePokerSeat;
            let getMePokerSeatXY = getMePokerSeat.parent.localToGlobal(new Laya.Point(getMePokerSeat.x, getMePokerSeat.y));
            conObj.owner.mePokerGetSeat = { x: getMePokerSeatXY.x, y: getMePokerSeatXY.y };
            if (conObj.Index == 1 || conObj.Index == 2) {
                seatObj.userId = `12345${conObj.Index}`;
                seatObj.owner.getChildByName('head').visible = true;
                seatObj.owner.getChildByName('head').skin = 'res/img/common/defaultIcon.png';
                seatObj.owner.getChildByName('name').visible = true;
                seatObj.owner.getChildByName('name').text = `用户名${(conObj.Index + 1)}`;
                seatObj.owner.getChildByName('score').visible = true;
                seatObj.owner.getChildByName('score').text = parseInt(String(Math.random() * 100 + 100));
            }
        }
    }
    var InitGameData$1 = new InitGameData();

    class DealMePoker {
        constructor() {
            this.pokerNum = 0;
            this.timerNum = 0;
        }
        deal() {
            let mePokerArr = [];
            this.userIndex = 0;
            this.pokerIndex = 0;
            this.timerNum = 0;
            this.players = MyCenter$1.GameControlObj.players;
            this.userPokerData0 = [
                { uid: 123450, data: [{ name: 'p1', poker: [1, 1, 1, 1] }, { name: 'p2', poker: [10, 4] }, { name: 'p3', poker: [4, 8, 2, 7, 21, 6, 2] }, { name: 'p4', poker: [1, 2, 3] }, { name: 'p5', poker: [9, 9, 9, 9] }] },
                { uid: 123451, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] },
                { uid: 123452, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] }
            ];
            this.userPokerData0.forEach(item => {
                if (item.uid == Main$1.userInfo['userId']) {
                    item.data.forEach(item2 => {
                        mePokerArr = mePokerArr.concat(item2.poker);
                    });
                }
            });
            this.userPokerData = [
                { uid: 123450, data: mePokerArr },
                { uid: 123451, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] },
                { uid: 123452, data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] }
            ];
            this.userPokerData.forEach((item, index) => {
                this.pokerNum += item.data.length;
            });
            this.meDealView = MyCenter$1.GameUIObj.meDealView;
            this.meDealView.visible = true;
            this.meDealView.alpha = 1;
            Laya.timer.loop(Main$1.Speed['dealPoker'], this, this.MovePoker);
        }
        MovePoker() {
            let dealPlayerData = this.userPokerData[this.userIndex];
            let dealSeat = MyCenter$1.GameUIObj.dealSeat;
            let dealPoker = Laya.Pool.getItemByCreateFun("dealPoker", MyCenter$1.GameControlObj.dealPoker.create, MyCenter$1.GameControlObj.dealPoker);
            dealPoker.name = String(this.timerNum);
            dealPoker.alpha = 0;
            dealPoker.pos(0, 0);
            dealSeat.addChild(dealPoker);
            this.players.forEach((item, index) => {
                if (item.userId == dealPlayerData.uid) {
                    let x;
                    let y;
                    if (item.IsMe) {
                        x = MyCenter$1.GameUIObj.mePokerGetSeat.x - MyCenter$1.GameUIObj.dealPokerSeatXY.x;
                        y = MyCenter$1.GameUIObj.mePokerGetSeat.y - MyCenter$1.GameUIObj.dealPokerSeatXY.y;
                    }
                    else {
                        x = item.getOtherPokerSeat.x - MyCenter$1.GameUIObj.dealPokerSeatXY.x;
                        y = item.getOtherPokerSeat.y - MyCenter$1.GameUIObj.dealPokerSeatXY.y;
                    }
                    let moveObj = dealSeat.getChildByName(String(this.timerNum));
                    Laya.Tween.to(moveObj, { alpha: 1, x: x, y: y }, Main$1.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                        if (item.IsMe) {
                            if ((this.pokerIndex) % 5 == 0) {
                                this.meCellIndex = 0;
                                let pokerCellView = new Laya.Image();
                                pokerCellView.name = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                                pokerCellView.size(Main$1.pokerWidth, 450);
                                pokerCellView.bottom = 0;
                                pokerCellView.x = Main$1.pokerWidth * parseInt(String((this.pokerIndex / 5)));
                                this.meDealView.width = Main$1.pokerWidth * (parseInt(String((this.pokerIndex / 5))) + 1);
                                this.meDealView.addChild(pokerCellView);
                            }
                            let mePokerObj = new Laya.Image();
                            if (this.meCellIndex == 0) {
                                mePokerObj.size(Main$1.pokerWidth, 450);
                                mePokerObj.loadImage('res/img/poker/chang/' + dealPlayerData.data[this.pokerIndex] + '.png');
                            }
                            else {
                                mePokerObj.size(Main$1.pokerWidth, Main$1.pokerWidth);
                                mePokerObj.loadImage('res/img/poker/duan/' + dealPlayerData.data[this.pokerIndex] + '.png');
                            }
                            let childName = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                            let pokerCellViewObj = this.meDealView.getChildByName(childName);
                            if (pokerCellViewObj && pokerCellViewObj.name == childName) {
                                pokerCellViewObj.addChild(mePokerObj);
                                if (this.meCellIndex == 0) {
                                    mePokerObj.bottom = 0;
                                }
                                else {
                                    mePokerObj.bottom = (450 + Main$1.pokerWidth * (this.meCellIndex - 1)) - 45 * (this.meCellIndex);
                                    Main$1.pokerWidth * this.meCellIndex;
                                }
                                mePokerObj.zOrder = 4 - this.meCellIndex;
                            }
                            this.meCellIndex++;
                        }
                        Laya.Tween.to(moveObj, { alpha: 0 }, Main$1.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                            moveObj.removeSelf();
                        }));
                    }));
                }
            });
            this.timerNum++;
            this.userIndex++;
            if (this.timerNum >= 20 * 3) {
                Laya.timer.clear(this, this.MovePoker);
                this.dealPokerEnd();
            }
            if (this.userIndex % 3 == 0) {
                this.userIndex = 0;
                this.pokerIndex++;
            }
        }
        dealPokerEnd() {
            let numChildren = this.meDealView.numChildren;
            let cellMoveX = (this.meDealView.width / 2) - (Main$1.pokerWidth / 2);
            for (let i = 0; i < numChildren; i++) {
                let childNode = this.meDealView.getChildAt(i);
                Laya.Tween.to(childNode, { x: cellMoveX }, Main$1.Speed['dealPoker2'], null, Laya.Handler.create(this, () => {
                    if (i >= numChildren - 1) {
                        Laya.Tween.to(this.meDealView, { alpha: 0 }, 100, null, Laya.Handler.create(this, () => {
                            this.meDealView.visible = false;
                            this.meDealView.removeChildren();
                            this.meDealView.width = Main$1.pokerWidth;
                            this.showMePokerView();
                        }));
                    }
                }));
            }
        }
        showMePokerView() {
            let mePokerData = [
                { name: 'p1', poker: [1, 1, 1, 1] },
                { name: 'p2', poker: [10, 4] },
                { name: 'p3', poker: [4, 8, 2, 7, 21, 6, 2] },
                { name: 'p4', poker: [1, 2, 3] },
                { name: 'p5', poker: [9, 9, 9, 9] },
            ];
            this.mePutView = MyCenter$1.GameUIObj.mePokerView;
            this.mePutView.width = Main$1.pokerWidth * mePokerData.length;
            mePokerData.forEach((item, index) => {
                let cellObj = new Laya.Image();
                cellObj.name = item.name;
                cellObj.size(Main$1.pokerWidth, 0);
                cellObj.x = Main$1.pokerWidth * index;
                cellObj.bottom = 0;
                item.poker.forEach((item_inner, index_inner) => {
                    let pokerObj = new Laya.Image('res/img/poker/duan/' + item_inner + '.png');
                    pokerObj.name = item_inner;
                    pokerObj.sizeGrid = "85,0,10,0";
                    pokerObj.on(Laya.Event.CLICK, this, this.ClickPoker, [pokerObj]);
                    pokerObj.size(Main$1.pokerWidth, Main$1.pokerWidth);
                    pokerObj.x = 0;
                    pokerObj.zOrder = item.poker.length - index_inner;
                    if (index_inner == 0)
                        pokerObj.bottom = Main$1.pokerWidth * index_inner;
                    else if (index_inner >= 1)
                        pokerObj.bottom = Main$1.pokerWidth * index_inner - (45 * index_inner);
                    cellObj.addChild(pokerObj);
                });
                this.mePutView.addChild(cellObj);
            });
        }
        ClickPoker(pokerObj) {
            if (pokerObj.height > Main$1.pokerWidth) {
                this.mePlayPoker(pokerObj);
                pokerObj.removeSelf();
                let mePutViewChildren = this.mePutView._children;
                mePutViewChildren.forEach((item, index) => {
                    let innerChildren = item._children;
                    if (innerChildren.length == 0) {
                        item.removeSelf();
                        this.mePutView.width -= Main$1.pokerWidth;
                    }
                    this.mePutViewReloadSeat();
                });
            }
            else {
                this.mePutViewReloadSeat();
                let pokerObjH = pokerObj.height + 50;
                Laya.Tween.to(pokerObj, { height: pokerObjH }, Main$1.Speed['pokerHeight'], Laya.Ease.backOut, Laya.Handler.create(this, () => {
                    this.adjustCellPokerSeat(pokerObj);
                }));
            }
        }
        mePlayPoker(pokerObj) {
            let pokerObjSeatXY = pokerObj.parent.localToGlobal(new Laya.Point(pokerObj.x, pokerObj.y));
            let showMePlayPoker = MyCenter$1.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            let showMePlayPokerXY = showMePlayPoker.parent.localToGlobal(new Laya.Point(showMePlayPoker.x, showMePlayPoker.y));
            let startX = pokerObjSeatXY.x - showMePlayPokerXY.x + showMePlayPoker.width;
            let startY = pokerObjSeatXY.y - showMePlayPokerXY.y + showMePlayPoker.height / 2;
            showMePlayPoker.pos(startX, startY);
            showMePlayPoker.skin = 'res/img/poker/chang/' + pokerObj.name + '.png';
            Laya.Tween.to(showMePlayPoker, { alpha: 1, x: showMePlayPoker.width / 2, y: showMePlayPoker.height / 2 }, Main$1.Speed['mePlay']);
        }
        otherPlay(num) {
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
                    Laya.Tween.to(playPokerSeat, { centerX: 0, centerY: 0, alpha: Main$1.pokerParam['alpha'] }, Main$1.Speed['otherPlay'], null, Laya.Handler.create(this, () => {
                        Laya.Tween.to(playPokerSeat, { scaleX: 0 }, Main$1.Speed['otherPlay'] / 2, null, Laya.Handler.create(this, () => {
                            playPokerSeat.skin = 'res/img/poker/chang/' + playData.data + '.png';
                            Laya.Tween.to(playPokerSeat, { scaleX: 1 }, Main$1.Speed['otherPlay'] / 2);
                        }));
                    }));
                }
            });
        }
        initOtherPlay(isShow, centerX, centerY, scaleX, scaleY, alpha, playPokerParent, playPoker) {
            playPokerParent.visible = isShow;
            playPoker.centerX = centerX;
            playPoker.centerY = centerY;
            playPoker.scale(scaleX, scaleY);
            playPoker.alpha = alpha;
            playPoker.skin = 'res/img/poker/chang/-1.png';
        }
        adjustCellPokerSeat(pokerObj) {
            let pokerObjParent = pokerObj.parent;
            let pokerObjParentChilds = pokerObjParent._children;
            let clickIndex = 0;
            pokerObjParentChilds.forEach((item, index) => {
                if (item.height > Main$1.pokerWidth) {
                    clickIndex = index;
                }
            });
            pokerObjParentChilds.forEach((item, index) => {
                if (index < clickIndex) {
                    item.bottom += 50;
                }
            });
        }
        mePutViewReloadSeat() {
            let mePutViewChildren = this.mePutView._children;
            mePutViewChildren.forEach((item, index) => {
                let innerChildren = item._children;
                item.x = Main$1.pokerWidth * index;
                innerChildren.forEach((item2, index2) => {
                    item2.height = Main$1.pokerWidth;
                    if (index2 == innerChildren.length - 1) {
                        item2.bottom = 0;
                    }
                    else {
                        item2.bottom = Main$1.pokerWidth * ((innerChildren.length - 1) - index2) - 45 * ((innerChildren.length - 1) - index2);
                    }
                });
            });
        }
    }
    var DealOrPlayPoker = new DealMePoker();

    class DiuPoker {
        open(data) {
            this.players = MyCenter$1.GameControlObj.players;
            let diuPokerData = data;
            this.players.forEach((item, index) => {
                let diuView = item.owner.getChildByName('diu' + item.SeatId);
                diuView.visible = true;
                diuPokerData.forEach((item2, index2) => {
                    if (item.userId == item2.userId) {
                        item2.data.forEach((item3, index3) => {
                            if (item.SeatId != 0 && index3 % 5 == 0) {
                                this.createDiuCell(index3, diuView, 5, item.SeatId);
                            }
                            else if ((item.SeatId == 0 && index3 % 3 == 0)) {
                                this.createDiuCell(index3, diuView, 3, item.SeatId);
                            }
                            let pokerObj = new Laya.Image();
                            pokerObj.skin = 'res/img/poker/duan/' + item3 + '.png';
                            if (item.SeatId != 0 && ((index3 + 1) % 5 == 0 || index3 == item2.data.length - 1))
                                pokerObj.skin = 'res/img/poker/chang/' + item3 + '.png';
                            else if (item.SeatId == 0 && ((index3 + 1) % 3 == 0 || index3 == item2.data.length - 1))
                                pokerObj.skin = 'res/img/poker/chang/' + item3 + '.png';
                            pokerObj.top = Main$1.pokerWidth * this.diuCellIndex - (45 * this.diuCellIndex);
                            pokerObj.zOrder = this.diuCellIndex;
                            pokerObj.name = 'poker' + (index3 + 1);
                            let chidName = item.SeatId == 0 ? 'cellBox' + parseInt(String(index3 / 3)) : 'cellBox' + parseInt(String(index3 / 5));
                            let pokerCellViewObj = diuView.getChildByName(chidName);
                            if (pokerCellViewObj.name == chidName) {
                                pokerCellViewObj.addChild(pokerObj);
                            }
                            this.diuCellIndex++;
                        });
                    }
                });
            });
        }
        createDiuCell(index, diuView, num, SeatId) {
            this.diuCellIndex = 0;
            let pokerBoxObj = new Laya.Image();
            pokerBoxObj.name = 'cellBox' + parseInt(String(index / num));
            pokerBoxObj.width = Main$1.pokerWidth;
            pokerBoxObj.x = SeatId == 1 ? Main$1.pokerWidth * parseInt(String(index / num)) : -Main$1.pokerWidth * parseInt(String(index / num));
            diuView.addChild(pokerBoxObj);
        }
    }
    var DiuPoker$1 = new DiuPoker();

    class ShowHanldePoker {
        open() {
            this.players = MyCenter$1.GameControlObj.players;
            let showData = [
                { userId: 123450, data: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }] },
                { userId: 123451, data: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }, { data: [2, 2, 2] }] },
                { userId: 123452, data: [{ data: [1, 1, 1] }, { data: [1, 1, 1] }] }
            ];
            this.players.forEach((item, index) => {
                let handlePokerView = item.owner.getChildByName('show' + item.SeatId);
                handlePokerView.visible = true;
                showData.forEach((item2, index2) => {
                    if (item.userId == item2.userId) {
                        item2.data.forEach((item3, index3) => {
                            this.cellIndex = index3;
                            if (item.SeatId == 0 && index3 % 5 == 0) {
                                this.createRowFn(item.SeatId, index3, handlePokerView);
                            }
                            else if (item.SeatId != 0 && index3 % 4 == 0) {
                                this.createRowFn(item.SeatId, index3, handlePokerView);
                            }
                            let cellPokerBox = new Laya.Image();
                            cellPokerBox.name = item.SeatId == 0 ? 'cellBox' + parseInt(String(index3 / 5)) : 'cellBox' + parseInt(String(index3 / 4));
                            cellPokerBox.width = Main$1.pokerWidth;
                            let cellPokerBoxX = Main$1.pokerWidth * this.cellIndex;
                            if (item.SeatId == 0 && Main$1.pokerWidth * this.cellIndex >= 640) {
                                cellPokerBoxX = Main$1.pokerWidth * this.cellIndex - 640;
                            }
                            else if (item.SeatId != 0 && Main$1.pokerWidth * this.cellIndex >= 512) {
                                cellPokerBoxX = Main$1.pokerWidth * this.cellIndex - 512;
                            }
                            cellPokerBox.pos(cellPokerBoxX, 0);
                            let rowBoxName = item.SeatId == 0 ? 'row' + parseInt(String(index3 / 5)) : 'row' + parseInt(String(index3 / 4));
                            let rowBox = handlePokerView.getChildByName(rowBoxName);
                            rowBox.width = Main$1.pokerWidth + Main$1.pokerWidth * this.cellIndex;
                            if (item.SeatId != 0 && parseInt(String(index3 / 4)) > 0) {
                                rowBox.width = Main$1.pokerWidth * 4;
                            }
                            rowBox.addChild(cellPokerBox);
                            item3.data.forEach((item4, index4) => {
                                let cellPoker = new Laya.Image();
                                cellPoker.visible = index4 <= 2 ? true : false;
                                cellPoker.skin = 'res/img/poker/duan/' + item4 + '.png';
                                cellPoker.name = 'poker' + (index4 + 1);
                                cellPoker.zOrder = index4;
                                cellPoker.size(Main$1.pokerWidth, Main$1.pokerWidth);
                                cellPoker.pos(0, Main$1.pokerWidth * index4 - 45 * index4);
                                cellPokerBox.addChild(cellPoker);
                            });
                        });
                    }
                });
            });
        }
        createRowFn(SeatId, index3, handlePokerView) {
            this.cellIndex = 0;
            let rowBox = new Laya.Image();
            rowBox.name = SeatId == 0 ? 'row' + parseInt(String(index3 / 5)) : 'row' + parseInt(String(index3 / 4));
            let posY = SeatId == 0 ? 310 * parseInt(String(index3 / 5)) : 310 * parseInt(String(index3 / 4));
            rowBox.pos(0, posY);
            if (SeatId == 1) {
                rowBox.centerX = -10;
            }
            else if (SeatId == 2) {
                rowBox.centerX = 10;
            }
            handlePokerView.addChild(rowBox);
        }
    }
    var ShowHandlePoker = new ShowHanldePoker();

    class FeelPoker {
        feel(num) {
            this.players = MyCenter$1.GameControlObj.players;
            this.feelStartSeatXY = MyCenter$1.GameUIObj.feelPokerSeatXY;
            this.feelObj = MyCenter$1.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            this.initParam(true);
            let data = {
                userId: '12345' + num,
                poker: parseInt(String(Math.random() * 21)) + 1
            };
            this.players.forEach((item, index) => {
                if (item.userId == data.userId) {
                    console.log(item);
                    this.moveFeelPoker(item, data);
                }
            });
        }
        moveFeelPoker(item, data) {
            this.initParam2(item, data);
            let feelSeat = item.owner.getChildByName('feelView');
            let feelSeatXY = feelSeat.parent.localToGlobal(new Laya.Point(feelSeat.x, feelSeat.y));
            let moveX = (feelSeatXY.x - this.feelStartSeatXY.x) + feelSeat.width / 2;
            let moveY = (feelSeatXY.y - this.feelStartSeatXY.y) + feelSeat.height / 2;
            let alpha = item.IsMe ? 0 : 1;
            Laya.Tween.to(this.feelObj, { x: moveX, y: moveY, alpha: alpha }, Main$1.Speed['feelPoker'], null, Laya.Handler.create(this, () => {
                if (item.IsMe) {
                    this.initParam(true);
                    Laya.Tween.to(this.feelObj, { scaleX: 0, alpha: 1 }, Main$1.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                        this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                        Laya.Tween.to(this.feelPoker, { scaleX: 1 }, Main$1.Speed['feelFan']);
                    }));
                }
                else {
                    Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main$1.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                        this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                        this.initParam(false);
                        Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main$1.Speed['feelFan']);
                    }));
                }
            }));
        }
        initParam(isShow = true) {
            this.feelObj.visible = isShow;
            this.feelObj.scale(1, 1);
            this.feelObj.pos(this.feelObj.width / 2, this.feelObj.height / 2);
        }
        initParam2(item, data) {
            let dealSeat_feelPoker = MyCenter$1.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            let feelView = item.IsMe ? MyCenter$1.GameUIObj.dealSeat.getChildByName('showPlayCards') : item.owner.getChildByName('feelView');
            feelView.visible = true;
            this.feelPoker = feelView.getChildByName('feelPoker');
            this.feelPoker.alpha = 0;
            this.feelPoker.skin = 'res/img/poker/chang/-1.png';
            dealSeat_feelPoker.skin = 'res/img/poker/chang/-1.png';
            this.feelPoker.scaleX = 1;
        }
    }
    var FeelPoker$1 = new FeelPoker();

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.players = [];
            this.Index = 0;
            this.num1 = 0;
            this.num2 = 0;
            this.num3 = 0;
            this.data1 = [
                { userId: 123450, data: [1] },
                { userId: 123451, data: [4] },
                { userId: 123452, data: [10] }
            ];
        }
        onEnable() {
            Main$1.beforeReload();
            Main$1.createTipBox();
            this.KeepSeatObj();
            this.InitGameData();
        }
        InitGameData() {
            MyCenter$1.InitGameData(this);
        }
        KeepSeatObj() {
            let that = this;
            MyCenter$1.req('seat', (res) => {
                that.players.push(res);
                InitGameData$1.Init(res, this);
                this.Index++;
            });
        }
        dealPokerFn() {
            Main$1.showTip('游戏开始...');
            setTimeout(() => {
                DealOrPlayPoker.deal();
            }, 1000);
        }
        diuPoker() {
            this.num3++;
            this.data1[0].data.push(this.num3);
            this.data1[1].data.push(this.num3);
            this.data1[2].data.push(this.num3);
            DiuPoker$1.open(this.data1);
        }
        handlePoker() {
            ShowHandlePoker.open();
        }
        feelPoker() {
            FeelPoker$1.feel(this.num1);
            this.num1++;
        }
        otherPlay() {
            this.num2++;
            DealOrPlayPoker.otherPlay(this.num2);
        }
    }

    class GameUI extends Laya.Scene {
        constructor() {
            super(...arguments);
            this.startSeatXY = [];
            this.startFeelSeatXY = [];
        }
        onEnable() {
            this.InitGameUIData();
            this.RegisterEvent();
        }
        InitGameUIData() {
            console.log(this);
            this.GameControlJS = this.getComponent(GameControl);
            MyCenter$1.InitGameUIData(this);
        }
        RegisterEvent() {
            this['startBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.dealPokerFn();
            });
            this['diuBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.diuPoker();
            });
            this['handleBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.handlePoker();
            });
            this['handleBtn2'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.feelPoker();
            });
            this['playBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.otherPlay();
            });
        }
    }

    class SetSceneWH extends Laya.Script {
        constructor() {
            super();
            this.intType = 1000;
            this.numType = 1000;
            this.strType = "hello laya";
            this.boolType = true;
        }
        onEnable() {
            this.setSceneWH();
        }
        setSceneWH() {
            this.owner['width'] = Laya.stage.width;
            this.owner['height'] = Laya.stage.height;
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("game/GameCenter/seat.ts", seat);
            reg("game/GameCenter/GameUI.ts", GameUI);
            reg("game/common/setSceneWH.ts", SetSceneWH);
            reg("game/GameCenter/GameControl.ts", GameControl);
        }
    }
    GameConfig.width = 1242;
    GameConfig.height = 2208;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Game.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main$2 {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main$2();

}());
