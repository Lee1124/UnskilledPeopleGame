(function () {
    'use strict';

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
            let endY = 0;
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
        }
        removeTarget() {
        }
        onUpdate() {
        }
    }

    class Main {
        constructor() {
            this.familyRoomInfo = {
                joinUserId: null,
                IsRoot: false,
                IsSuper: false,
                IsJoin: false,
                IsProm: false,
            };
            this.phoneNews = {
                statusHeight: 0,
                deviceNews: '',
            };
            this.AUTO = false;
            this.websoketApi = '132.232.34.32:8092';
            this.requestApi = 'http://132.232.34.32:8091';
            this.userInfo = null;
            this.debug = true;
            this.pokerWidth = 128;
            this.count = 105;
            this.pokerParam = {
                alpha: 0.7,
                bgColor1: [
                    0.6, 0.5, 0.5, 0.2, 0,
                    0.6, 0.5, 0.5, 0.2, 0,
                    0.6, 0.5, 0.5, 0.2, 0,
                    1, 1, 1, 1, 1,
                ],
                color1: 'res/img/common/1.png',
                color2: 'res/img/common/2.png'
            };
            this.deal = {
                otherBottom: -220,
                meBottom: 340
            };
            this.defaultData = {
                head1: 'res/img/common/defaultHead.png'
            };
            this.tipArr1 = [];
            this.tipArr2 = [];
            this.Speed = {
                changeSeat: 200,
                dealPoker: 20,
                dealPoker2: 120,
                feelPoker: 200,
                feelFan: 100,
                pokerHeight: 50,
                mePlay: 100,
                otherPlay: 50,
                changePage: 200,
                openDiaLogSpeed: 200
            };
            this.sign = {
                signOut: 1,
                register: 2,
                changePwd: 3,
                shop: 4
            };
            this.loadPokerArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
            this.loadMenuImgArr = ['res/img/menu/menu_1.png', 'res/img/menu/menu_2.png', 'res/img/menu/menu_3.png', 'res/img/menu/menu_4.png', 'res/img/menu/menu_5.png', 'res/img/menu/menu_6.png'];
            this.meListData = [
                { id: 1, src: 'res/img/me/me_text1.png', isShow: true },
                { id: 2, src: 'res/img/me/me_text2.png', isShow: true },
                { id: 3, src: 'res/img/me/me_text3.png', isShow: false },
                { id: 4, src: 'res/img/me/me_text4.png', isShow: true },
                { id: 5, src: 'res/img/me/me_text5.png', isShow: true },
                { id: 6, src: 'res/img/me/me_text6.png', isShow: true }
            ];
            this.loadScene = ['Game.scene', 'TabPages.scene', 'Register.scene', 'Set.scene',
                'CoinRecord.scene', 'RealTimeResult.scene', 'Friends.scene', 'EditUserNews.scene',
                'Record.scene', 'Share.scene', 'Give.scene'
            ];
            this.loadSceneResourcesArr = [];
            this.openSceneViewArr = [];
            this.hall = {
                allowRepuest: true
            };
            this.pages = {
                page1: 'NoticePage',
                page2: 'FriendsPage',
                page3: 'HallPage',
                page4: 'WalletPage',
                page5: 'MePage',
                page6: 'login'
            };
            this.diaLog = null;
            this.diaLogMask = null;
            this.diaLogArr1 = [];
            this.diaLogArr2 = [];
            this.loadingType = {
                one: 'Loading1',
                two: 'Loading2',
                three: 'Loading3',
                four: 'Loading4',
            };
            this.loadAniArr1 = [];
            this.loadAniArr2 = [];
            this.expressionChat = [
                { id: 0, icon: 'res/img/Expression/0_0.png' },
                { id: 1, icon: 'res/img/Expression/1_0.png' },
                { id: 2, icon: 'res/img/Expression/2_0.png' },
                { id: 3, icon: 'res/img/Expression/3_0.png' },
                { id: 4, icon: 'res/img/Expression/4_0.png' },
                { id: 5, icon: 'res/img/Expression/5_0.png' },
                { id: 6, icon: 'res/img/Expression/6_0.png' },
                { id: 7, icon: 'res/img/Expression/7_0.png' },
                { id: 8, icon: 'res/img/Expression/8_0.png' },
                { id: 9, icon: 'res/img/Expression/9_0.png' },
                { id: 10, icon: 'res/img/Expression/10_0.png' },
                { id: 11, icon: 'res/img/Expression/11_0.png' },
                { id: 12, icon: 'res/img/Expression/12_0.png' },
                { id: 13, icon: 'res/img/Expression/13_0.png' },
                { id: 14, icon: 'res/img/Expression/14_0.png' }
            ];
        }
        $LOG(...data) {
            if (this.debug)
                console.log(data);
        }
        $ERROR(...data) {
            if (this.debug)
                console.error(...data);
        }
        beforeReloadResources(that, loadFn) {
            this.beforeLoadThat = that;
            this.beforeLoadCallback = loadFn;
            Laya.loader.load(['res/img/poker/chang/-1.png']);
            this.loadPokerArr.forEach(item => {
                Laya.loader.load(['res/img/poker/chang/' + item + '.png']);
                Laya.loader.load(['res/img/poker/duan/' + item + '.png']);
            });
            this.loadMenuImgArr.forEach(item => {
                Laya.loader.load([item]);
            });
            this.meListData.forEach(item => {
                Laya.loader.load([item.src]);
            });
            this.loadScene.forEach(item => {
                Laya.Scene.load(item, Laya.Handler.create(this, this.openView));
            });
        }
        openView(res) {
            this.beforeLoadCallback.call(this.beforeLoadThat, res);
            this.$LOG('预加载的场景', res, res.url);
            this.loadSceneResourcesArr.push(res.url);
            this.openSceneViewArr.forEach((item, index) => {
                if (item.url.indexOf(res.url) != -1) {
                    Laya.Scene.open(res.url, item.closeOther, item.data);
                    this.openSceneViewArr.splice(index, 1);
                    return;
                }
            });
        }
        $openScene(url, closeOther, data, fn, fn2) {
            let flag = true;
            this.loadSceneResourcesArr.forEach(item => {
                if (item === url) {
                    Laya.Scene.open(url, closeOther, data, Laya.Handler.create(this, fn));
                    flag = false;
                }
            });
            if (flag)
                this.openSceneViewArr = [{ url: url, closeOther: closeOther, data: data, fn: fn, fn2: fn2 }];
        }
        changeNodeZOrder(jsonArr) {
            jsonArr.forEach(item => {
                item.nodeName.zOrder = item.val;
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
        createDiaLog() {
            let that = this;
            let myMask = Laya.stage.getChildByName("dialogMask");
            if (myMask) {
                myMask.removeSelf();
            }
            let Mask = new Laya.Sprite();
            this.diaLogMask = Mask;
            Mask.visible = false;
            Mask.zOrder = 4;
            Mask.pos(0, 0);
            Mask.size(Laya.stage.width, Laya.stage.height);
            this.diaLog = new Laya.Dialog();
            this.diaLog.pos((Laya.stage.width - 1132) / 2, (Laya.stage.height - 764) / 2);
            this.diaLog.size(1132, 754);
            this.diaLog.zOrder = 5;
            let dialogBg = new Laya.Image();
            dialogBg.pos(0, 0);
            dialogBg.loadImage('res/img/diglog/bg.png');
            let dialogContent = new Laya.Label();
            dialogContent.fontSize = 60;
            dialogContent.color = '#935F13';
            dialogContent.size(1132, 180);
            dialogContent.align = 'center';
            dialogContent.valign = 'middle';
            dialogContent.wordWrap = true;
            dialogContent.y = 250;
            dialogContent.text = '112222';
            let btn_one = new Laya.Image();
            btn_one.size(450, 146);
            btn_one.loadImage('res/img/diglog/btn_comfirm.png', Laya.Handler.create(this, () => {
                btn_one.pos((1132 - btn_one.width) / 2, 764 - btn_one.height - 60);
            }));
            let btn_cancel = new Laya.Image();
            let btn_comfirm = new Laya.Image();
            btn_cancel.size(450, 146);
            btn_comfirm.size(450, 146);
            btn_cancel.loadImage('res/img/diglog/btn_cancel.png', Laya.Handler.create(this, () => {
                btn_cancel.pos(72, 764 - btn_cancel.height - 60);
            }));
            btn_comfirm.loadImage('res/img/diglog/btn_comfirm.png', Laya.Handler.create(this, () => {
                btn_comfirm.pos(600, 764 - btn_comfirm.height - 60);
            }));
            dialogBg.addChild(dialogContent);
            dialogBg.addChild(btn_one);
            dialogBg.addChild(btn_cancel);
            dialogBg.addChild(btn_comfirm);
            this.diaLog.addChild(dialogBg);
            Mask.addChild(this.diaLog);
            Laya.stage.addChild(Mask);
            this.diaLogArr1 = [{ btn1: btn_one, btn2: btn_cancel, btn3: btn_comfirm, msg: dialogContent }];
            this.diaLogCommon();
        }
        diaLogCommon() {
            let arr1 = this.diaLogArr1[0];
            this.diaLogArr2.forEach(item => {
                arr1.btn1.visible = item.type == 1 ? true : false;
                arr1.btn2.visible = item.type == 2 ? true : false;
                arr1.btn3.visible = item.type == 2 ? true : false;
                arr1.msg.text = item.msg;
                arr1.msg.color = item.color;
                this.diaLogMask.visible = true;
                this.diaLog.show();
                arr1.btn1.on(Laya.Event.CLICK, this, () => {
                    if (item.comfirmFn)
                        item.comfirmFn('点击了确定按钮');
                    this.closeDiaLog();
                });
                arr1.btn2.on(Laya.Event.CLICK, this, () => {
                    if (item.cancelFn)
                        item.cancelFn('点击了取消按钮');
                    this.closeDiaLog();
                });
                arr1.btn3.on(Laya.Event.CLICK, this, () => {
                    if (item.comfirmFn)
                        item.comfirmFn('点击了确定按钮');
                    this.closeDiaLog();
                });
                this.diaLogMask.on(Laya.Event.CLICK, this, () => {
                    if (item.cancelFn)
                        item.cancelFn('点击了取消按钮');
                    this.closeDiaLog();
                });
            });
            this.diaLogArr2 = [];
        }
        closeDiaLog() {
            this.diaLog.close();
            this.diaLogMask.visible = false;
            let arr = this.diaLogArr1[0];
            arr.btn1.off(Laya.Event.CLICK);
            arr.btn2.off(Laya.Event.CLICK);
            arr.btn3.off(Laya.Event.CLICK);
        }
        showDiaLog(msg, type, comfirmFn, cancelFn, textColor) {
            let myMsg = msg ? msg : '';
            let myType = type ? type : 1;
            let myMsgColor = textColor ? textColor : '#B2A638';
            if (this.diaLogArr1.length > 0) {
                this.diaLogArr1.forEach(item => {
                    item.btn1.visible = myType == 1 ? true : false;
                    item.btn2.visible = myType == 2 ? true : false;
                    item.btn3.visible = myType == 2 ? true : false;
                    item.msg.text = myMsg;
                    item.msg.color = myMsgColor;
                    this.diaLogMask.visible = true;
                    this.diaLog.show();
                    item.btn1.on(Laya.Event.CLICK, this, () => {
                        if (comfirmFn)
                            comfirmFn('点击了确定按钮');
                        this.closeDiaLog();
                    });
                    item.btn2.on(Laya.Event.CLICK, this, () => {
                        if (cancelFn)
                            cancelFn('点击了取消按钮');
                        this.closeDiaLog();
                    });
                    item.btn3.on(Laya.Event.CLICK, this, () => {
                        if (comfirmFn)
                            comfirmFn('点击了确定按钮');
                        this.closeDiaLog();
                    });
                    this.diaLogMask.on(Laya.Event.CLICK, this, () => {
                        if (cancelFn)
                            cancelFn('点击了取消按钮');
                        this.closeDiaLog();
                    });
                });
                return;
            }
            else {
                this.diaLogArr2 = [{ msg: myMsg, type: myType, comfirmFn: comfirmFn, cancelFn: cancelFn, color: myMsgColor }];
            }
        }
        createLoading(Type) {
            let type = Type ? Type : this.loadingType.one;
            Laya.loader.load("res/atlas/images/common.atlas", Laya.Handler.create(this, onMyLoaded));
            function onMyLoaded() {
                let loadingMask = new Laya.Image();
                loadingMask.visible = false;
                loadingMask.left = 0;
                loadingMask.top = 0;
                loadingMask.bottom = 0;
                loadingMask.right = 0;
                loadingMask.zOrder = 10;
                loadingMask.name = 'loadingMask-' + type;
                loadingMask.on(Laya.Event.CLICK, this, () => { });
                let animationBox = new Laya.Sprite();
                let animationText = new Laya.Label();
                if (type == this.loadingType.three) {
                    animationText.name = 'loadingText';
                    animationText.width = 220;
                    animationText.centerX = 0;
                    animationText.align = 'center';
                    animationText.zOrder = 10;
                    animationText.bottom = -85;
                    let aniText = this.setText(animationText, 30, '#FFFFFF');
                    animationBox.addChild(aniText);
                }
                animationBox.name = 'loadingBox';
                animationBox.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                let ani = new Laya.Animation();
                ani.name = 'loadingAni';
                ani.loadAnimation("animation/loading/" + type + ".ani");
                animationBox.addChild(ani);
                loadingMask.addChild(animationBox);
                Laya.stage.addChild(loadingMask);
                this.loadAniArr1.push(type);
                this.loadAniArr2.forEach(item => {
                    if (item.key == type) {
                        let $loadingMask = Laya.stage.getChildByName('loadingMask-' + item.type);
                        $loadingMask.visible = item.show;
                        animationText.text = '';
                        if (item.show) {
                            animationText.text = item.text;
                            ani.play();
                        }
                        else {
                            ani.stop();
                        }
                    }
                });
            }
        }
        showLoading(isShow = true, type = this.loadingType.one, msg = '') {
            this.loadAniArr1.forEach(item => {
                if (item == type) {
                    let loadingMask = Laya.stage.getChildByName('loadingMask-' + type);
                    let loadingBox = loadingMask.getChildByName('loadingBox');
                    let loadingAni = loadingBox.getChildByName('loadingAni');
                    let loadingText;
                    if (type == this.loadingType.three) {
                        loadingText = loadingBox.getChildByName('loadingText');
                        loadingText.text = '';
                    }
                    if (!loadingMask.visible && isShow) {
                        if (type == this.loadingType.three)
                            loadingText.text = msg;
                        loadingAni.play();
                    }
                    else if (!isShow) {
                        loadingAni.stop();
                    }
                    loadingMask.visible = isShow;
                    return;
                }
            });
            this.loadAniArr2 = [{ key: type, show: isShow, type: type, text: msg }];
        }
        hideAllLoading() {
            this.showLoading(false, this.loadingType.one);
            this.showLoading(false, this.loadingType.two);
            this.showLoading(false, this.loadingType.three);
        }
        $LoadImage(node, url = '', type = this.defaultData.head1, type2 = 'loadImage') {
            if (url.indexOf('.png') != -1 || url.indexOf('.jpg') != -1 || url.indexOf('.jpeg') != -1) {
                Laya.loader.load(url, Laya.Handler.create(this, (res) => {
                    if (res) {
                        if (type2 == 'loadImage') {
                            node.loadImage(url);
                        }
                        else if (type2 == 'skin') {
                            node.skin = url;
                        }
                    }
                    else {
                        if (type2 == 'loadImage') {
                            node.loadImage(type);
                        }
                        else if (type2 == 'skin') {
                            node.skin = type;
                        }
                    }
                }));
            }
            else {
                if (type2 == 'loadImage') {
                    node.loadImage(type);
                }
                else if (type2 == 'skin') {
                    node.skin = type;
                }
            }
        }
        getTimeChuo() {
            return Math.round((new Date()).getTime() / 1000);
        }
        secondToDate(result) {
            var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
            var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
            return result = h + ":" + m + ":" + s;
        }
        strIsNull(str) {
            return (str == '' || str.trim() == '') ? true : false;
        }
        getDate(format, timeNum, isOnlyD) {
            let _format = !format ? 'yyyy/mm/dd' : format;
            let oTime;
            let oDate = new Date(timeNum * 1000);
            let oYear = oDate.getFullYear();
            let oMonth = oDate.getMonth() + 1;
            let oDay = oDate.getDate();
            let oHour = oDate.getHours();
            let oMin = oDate.getMinutes();
            let oSec = oDate.getSeconds();
            if (_format == 'yyyy-mm-dd') {
                if (isOnlyD)
                    oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay);
                else
                    oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSec);
            }
            else if (_format == 'yyyy/mm/dd') {
                if (isOnlyD)
                    oTime = oYear + '/' + this.getzf(oMonth) + '/' + this.getzf(oDay);
                else
                    oTime = oYear + '/' + this.getzf(oMonth) + '/' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSec);
            }
            return oTime;
        }
        getzf(num) {
            if (parseInt(num) < 10) {
                num = '0' + num;
            }
            return num;
        }
        GetUrlString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        }
    }
    var Main$1 = new Main();

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
    var myCenter = new MyCenter();

    class Back extends Laya.Script {
        constructor() {
            super(...arguments);
            this.backType = 0;
            this.backMode = 0;
            this.backScene = '';
            this.backData = null;
            this.removeNode = null;
        }
        initBack(backType, backMode, backScene, backData, node, updatePage, pageKey, callback) {
            this.backType = backType ? backType : 0;
            this.backMode = backMode ? backMode : 0;
            this.backScene = backScene ? backScene : '';
            this.backData = backData ? backData : null;
            this.removeNode = node ? node : null;
            this.toPageKey = pageKey ? pageKey : null;
            this.callback = callback ? callback : null;
        }
        onEnable() {
            this.initBack();
            this.bindEvent();
        }
        bindEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.back);
        }
        back() {
            myCenter.send(this.toPageKey, true);
            let thisScene = this.owner.scene;
            let moveXY;
            switch (this.backMode) {
                case 0:
                    moveXY = { x: Laya.stage.width };
                    break;
                case 1:
                    moveXY = { x: -Laya.stage.width };
                    break;
                case 2:
                    moveXY = { y: Laya.stage.height };
                    break;
            }
            if (this.backType == 0) {
                Laya.Tween.to(thisScene, moveXY, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                    thisScene.removeSelf();
                }));
                if (this.callback)
                    this.callback('回来了');
            }
            else if (this.backType == 1) {
                Laya.Scene.open(this.backScene, false, this.backData, Laya.Handler.create(this, (res) => {
                    Laya.Tween.to(thisScene, moveXY, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                        thisScene.removeSelf();
                    }));
                }));
            }
        }
    }

    class setHd extends Laya.Script {
        onEnable() {
            console.log(this);
        }
    }

    class CoinRecord extends Laya.Script {
        onStart() {
        }
    }

    class Friends2 extends Laya.Scene {
        constructor() {
            super(...arguments);
            this.openedData = 1;
        }
        onAwake() {
        }
        onOpened(options) {
            Main$1.$LOG('亲友圈二级页面所收到得值：', options);
            this.openedData = options ? options : 1;
            this.setTitle();
        }
        setTitle() {
            this['title_1'].visible = this.openedData == 1 ? true : false;
            this['title_2'].visible = this.openedData == 2 ? true : false;
            this['title_3'].visible = this.openedData == 3 ? true : false;
            this['view1'].visible = this.openedData == 1 ? true : false;
            this['view2'].visible = this.openedData == 2 ? true : false;
            this['view3'].visible = this.openedData == 3 ? true : false;
        }
        setUI() {
        }
    }

    /*
     * JavaScript MD5
     * https://github.com/blueimp/JavaScript-MD5
     *
     * Copyright 2011, Sebastian Tschan
     * https://blueimp.net
     *
     * Licensed under the MIT license:
     * https://opensource.org/licenses/MIT
     *
     * Based on
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    /* global define */

    /* eslint-disable strict */

    //;(function($) {
    //  'use strict'

      /**
       * Add integers, wrapping at 2^32.
       * This uses 16-bit operations internally to work around bugs in interpreters.
       *
       * @param {number} x First integer
       * @param {number} y Second integer
       * @returns {number} Sum
       */
      function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff)
      }

      /**
       * Bitwise rotate a 32-bit number to the left.
       *
       * @param {number} num 32-bit number
       * @param {number} cnt Rotation count
       * @returns {number} Rotated number
       */
      function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
      }

      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} q q
       * @param {number} a a
       * @param {number} b b
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t)
      }

      /**
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       *
       * @param {Array} x Array of little-endian words
       * @param {number} len Bit length
       * @returns {Array<number>} MD5 Array
       */
      function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i;
        var olda;
        var oldb;
        var oldc;
        var oldd;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;

          a = md5ff(a, b, c, d, x[i], 7, -680876936);
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5gg(b, c, d, a, x[i], 20, -373897302);
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

          a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5hh(d, a, b, c, x[i], 11, -358537222);
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

          a = md5ii(a, b, c, d, x[i], 6, -198630844);
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

          a = safeAdd(a, olda);
          b = safeAdd(b, oldb);
          c = safeAdd(c, oldc);
          d = safeAdd(d, oldd);
        }
        return [a, b, c, d]
      }

      /**
       * Convert an array of little-endian words to a string
       *
       * @param {Array<number>} input MD5 Array
       * @returns {string} MD5 string
       */
      function binl2rstr(input) {
        var i;
        var output = '';
        var length32 = input.length * 32;
        for (i = 0; i < length32; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
        }
        return output
      }

      /**
       * Convert a raw string to an array of little-endian words
       * Characters >255 have their high-byte silently ignored.
       *
       * @param {string} input Raw input string
       * @returns {Array<number>} Array of little-endian words
       */
      function rstr2binl(input) {
        var i;
        var output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
          output[i] = 0;
        }
        var length8 = input.length * 8;
        for (i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
        }
        return output
      }

      /**
       * Calculate the MD5 of a raw string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
      }

      /**
       * Calculates the HMAC-MD5 of a key and some data (raw strings)
       *
       * @param {string} key HMAC key
       * @param {string} data Raw input string
       * @returns {string} Raw MD5 string
       */
      function rstrHMACMD5(key, data) {
        var i;
        var bkey = rstr2binl(key);
        var ipad = [];
        var opad = [];
        var hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
          bkey = binlMD5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5c5c5c5c;
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
      }

      /**
       * Convert a raw string to a hex string
       *
       * @param {string} input Raw input string
       * @returns {string} Hex encoded string
       */
      function rstr2hex(input) {
        var hexTab = '0123456789abcdef';
        var output = '';
        var x;
        var i;
        for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i);
          output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
        }
        return output
      }

      /**
       * Encode a string as UTF-8
       *
       * @param {string} input Input string
       * @returns {string} UTF8 string
       */
      function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
      }

      /**
       * Encodes input string as raw MD5 string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s))
      }
      /**
       * Encodes input string as Hex encoded string
       *
       * @param {string} s Input string
       * @returns {string} Hex encoded string
       */
      function hexMD5(s) {
        return rstr2hex(rawMD5(s))
      }
      /**
       * Calculates the raw HMAC-MD5 for the given key and data
       *
       * @param {string} k HMAC key
       * @param {string} d Input string
       * @returns {string} Raw MD5 string
       */
      function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
      }
      /**
       * Calculates the Hex encoded HMAC-MD5 for the given key and data
       *
       * @param {string} k HMAC key
       * @param {string} d Input string
       * @returns {string} Raw MD5 string
       */
      function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d))
      }

      /**
       * Calculates MD5 value for a given string.
       * If a key is provided, calculates the HMAC-MD5 value.
       * Returns a Hex encoded string unless the raw argument is given.
       *
       * @param {string} string Input string
       * @param {string} [key] HMAC key
       * @param {boolean} [raw] Raw output switch
       * @returns {string} MD5 output
       */
      function md5(string, key, raw) {
        if (!key) {
          if (!raw) {
            return hexMD5(string)
          }
          return rawMD5(string)
        }
        if (!raw) {
          return hexHMACMD5(key, string)
        }
        return rawHMACMD5(key, string)
      }
    /*
      if (typeof define === 'function' && define.amd) {
        define(function() {
          return md5
        })
      } else if (typeof module === 'object' && module.exports) {
        module.exports = md5
      } else {
        $.md5 = md5
      }
      */
    //})(this)
    function md51(str){
        console.log(str);
        return str;
    }
    var md5$1 = {
        md5
    };

    class HttpRequest {
        $request(obj) {
            let that = obj.that;
            let xhr = new Laya.HttpRequest();
            let url = Main$1.requestApi + obj.url;
            let dataObj = obj.data;
            let postData = '';
            let method = obj.method ? obj.method : 'get';
            let dataObjArr = [];
            if (method == 'get') {
                var timestamp = new Date().getTime();
                let sstr = "";
                if (Main$1.userInfo) {
                    sstr = Main$1.userInfo.key + '&' + timestamp;
                }
                for (var key in dataObj) {
                    if (dataObj.hasOwnProperty(key)) {
                        dataObjArr.push(key);
                        if (dataObjArr.length == 1) {
                            url = url + '?' + key + '=' + dataObj[key];
                        }
                        else {
                            url = url + '&' + key + '=' + dataObj[key];
                        }
                        sstr += "&" + dataObj[key];
                    }
                }
                if (Main$1.userInfo) {
                    url += '&t=' + timestamp;
                    Main$1.$LOG("md5：" + sstr + " key:" + Main$1.userInfo.key);
                    url += '&sign=' + md5$1.md5(sstr);
                }
            }
            else if (method == 'post') {
                for (var key in dataObj) {
                    if (dataObj.hasOwnProperty(key)) {
                        dataObjArr.push(key);
                        if (dataObjArr.length == 1) {
                            postData = key + '=' + dataObj[key];
                        }
                        else {
                            postData += '&' + key + '=' + dataObj[key];
                        }
                    }
                }
            }
            xhr.http.timeout = 20000;
            xhr.http.ontimeout = function () {
                Main$1.showLoading(false);
                Main$1.showDiaLog('请求超时,稍后再试!');
                if (obj.timeout)
                    obj.timeout.call(that, '请求超时,稍后再试!');
            };
            xhr.once(Laya.Event.COMPLETE, this, (res) => {
                if (!res.status) {
                    Main$1.$ERROR('冲突登录:', res);
                    if (res.code == 1003 ||
                        res.code == 1004) {
                        Main$1.showDiaLog('登录失效，请重新登录', 1, () => {
                            Main$1.hideAllLoading();
                            Laya.Scene.open('login.scene', true, Main$1.sign.signOut);
                        });
                    }
                    return;
                }
                obj.success.call(that, res);
            });
            xhr.once(Laya.Event.ERROR, this, (err) => {
                Main$1.$ERROR('请求异常:', err);
                Main$1.showDiaLog('网络异常');
                Main$1.showLoading(false);
                if (obj.fail)
                    obj.fail.call(that, err);
            });
            xhr.once(Laya.Event.PROGRESS, this, (ess) => {
                Main$1.$ERROR('PROGRESS:', ess);
                if (obj.ess)
                    obj.ess(ess);
            });
            xhr.send(url, postData, method, 'json');
        }
    }
    var HTTP = new HttpRequest();

    class HttpReq {
        getUserNews(that, callback) {
            let data = {
                uid: Main$1.userInfo.userId,
            };
            HTTP.$request({
                that: that,
                url: '/M.User/GetInfo',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        walletSearch(that, callback) {
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.WLT/GetWallet',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        setOutPwd(that, data, callback) {
            HTTP.$request({
                that: that,
                url: '/M.WLT/SetWalletPsw',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        reqOutMoney(that, data, callback) {
            Main$1.showLoading(true);
            HTTP.$request({
                that: that,
                url: '/M.WLT/RequestWalletOut',
                data: data,
                success(res) {
                    Main$1.showLoading(false);
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        searchReqOutList(that, callback) {
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.WLT/GetWalletOutRecords',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        getUserInfoLogined(that, callback) {
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.User/GetUserInfoLogined',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        joinPromoter(that, data, callback) {
            HTTP.$request({
                that: that,
                url: '/M.Prom/JoinPromoter',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                }
            });
        }
        getFriendsNew(that, callback) {
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.Prom/GetPromoterFullInfo',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        createFamily(that, callback) {
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.Prom/CreatePromoter',
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        getMyPlayerNews(that, callback) {
            Main$1.showLoading(true);
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.Prom/GetMyPlayerInfos',
                data: data,
                success(res) {
                    Main$1.showLoading(false);
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        getMyIncome(that, callback) {
            Main$1.showLoading(true);
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.Prom/GetMyIncomeInfos',
                data: data,
                success(res) {
                    Main$1.showLoading(false);
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        getOutRecord(that, callback) {
            Main$1.showLoading(true);
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.Prom/GetPromoterOutRecords',
                data: data,
                success(res) {
                    Main$1.showLoading(false);
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
        reqHLOut(that, callback) {
            Main$1.showLoading(true);
            let data = {
                uid: Main$1.userInfo.userId
            };
            HTTP.$request({
                that: that,
                url: '/M.Prom/RequestPromoterOut',
                data: data,
                success(res) {
                    Main$1.showLoading(false);
                    if (res.data.ret.type == 0) {
                        callback.call(that, res);
                    }
                    else {
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                }
            });
        }
    }
    var HttpReqContent = new HttpReq();

    class Friends2$1 extends Laya.Script {
        onStart() {
            this.setBack();
            this.registerEvent();
            myCenter.req('sceneUrl1', (url) => {
                if (url == this.owner.scene.url)
                    this.setPage();
            });
        }
        setBack() {
            let backJS = this.owner['back_btn'].getComponent(Back);
            backJS.initBack();
        }
        registerEvent() {
            this.owner['tab_title']._children.forEach((item, index) => {
                item.on(Laya.Event.CLICK, this, this.selectThisTab, [index + 1]);
            });
        }
        reloadNavSelectZT() {
            this.owner['v2_tab_select']._children.forEach((item, index) => {
                item.visible = false;
            });
        }
        selectThisTab(pageNum) {
            this.reloadNavSelectZT();
            this.owner['v2_tab_select'].getChildByName('s' + pageNum).visible = true;
            this.reqPage2Data();
        }
        setPage() {
            switch (this.owner['openedData']) {
                case 1:
                    this.reqPage1Data();
                    break;
                case 2:
                    this.selectThisTab(1);
                    break;
                case 3:
                    this.reqPage3Data();
                    break;
            }
        }
        reqPage1Data() {
            HttpReqContent.getMyPlayerNews(this, (res) => {
                Main$1.$LOG('亲友圈-我的玩家', res);
                let data = res.data;
                let view1 = this.owner['view1'];
                let view1_1_box = view1.getChildByName('view1_1').getChildByName('view1_1_box');
                let view1_2_box = view1.getChildByName('view1_2').getChildByName('view1_2_box');
                let sjwjID = view1_1_box.getChildByName('sjwjID').getChildByName('val');
                let xjsl = view1_1_box.getChildByName('xjsl').getChildByName('val');
                let jrxz = view1_1_box.getChildByName('jrxz').getChildByName('val');
                let list = view1_2_box.getChildByName('tbody').getChildByName('list');
                sjwjID.text = data.JoinUid == -1 ? '暂无上级玩家' : data.JoinUid;
                xjsl.text = data.MemberCount;
                jrxz.text = data.DayAddMemberCount;
                list.array = data.Players;
                list.vScrollBarSkin = '';
                list.renderHandler = new Laya.Handler(this, this.page1ListRender);
            });
        }
        page1ListRender(cell, index) {
            let c1 = cell.getChildByName('c1');
            let c2 = cell.getChildByName('c2');
            let c3 = cell.getChildByName('c3');
            let c4 = cell.getChildByName('c4');
            c1.text = cell.dataSource.Uid;
            c2.text = cell.dataSource.Nick;
            c3.text = String(cell.dataSource.PlayTimes);
            c4.text = Main$1.getDate(null, cell.dataSource.Time, true);
        }
        reqPage2Data() {
            HttpReqContent.getMyIncome(this, (res) => {
                Main$1.$LOG('亲友圈-我的收益', res);
                let data = res.data;
                this.owner['title_income1'].text = data.Income0;
                this.owner['title_income2'].text = data.Income1;
                this.owner['title_income3'].text = data.Income2;
                this.owner['nowPersonNumVal'].text = data.MemberCount;
                this.owner['todayGXVal'].text = data.TodayGX;
                this.owner['totalGXVal'].text = data.TotalGX;
                let list = this.owner['incomeList'];
                list.array = data.PlayersGX;
                list.vScrollBarSkin = '';
                list.renderHandler = new Laya.Handler(this, this.page2ListRender);
            });
        }
        page2ListRender(cell, index) {
            let c1 = cell.getChildByName('c1');
            let c2 = cell.getChildByName('c2');
            let c3 = cell.getChildByName('c3');
            let c4 = cell.getChildByName('c4');
            c1.text = cell.dataSource.Nick;
            c2.text = String(cell.dataSource.TodayGX);
            c3.text = String(cell.dataSource.TotalGX);
            switch (cell.dataSource.State) {
                case 0:
                    c4.text = '一级玩家';
                    break;
                case 1:
                    c4.text = '二级玩家';
                    break;
                case 2:
                    c4.text = '三级玩家';
                    break;
            }
        }
        reqPage3Data() {
            HttpReqContent.getOutRecord(this, (res) => {
                Main$1.$LOG('亲友圈-提现记录', res);
                let data = res.data;
                let list = this.owner['outRecordList'];
                list.array = data.records;
                list.vScrollBarSkin = '';
                list.renderHandler = new Laya.Handler(this, this.page3ListRender);
            });
        }
        page3ListRender(cell, index) {
            let c1 = cell.getChildByName('c1');
            let c2 = cell.getChildByName('c2');
            let c3 = cell.getChildByName('c3');
            c1.text = Main$1.getDate(null, cell.dataSource.RequestTime);
            c2.text = String(cell.dataSource.Money);
            switch (cell.dataSource.State) {
                case 0:
                    c3.text = '申请中';
                    break;
                case 1:
                    c3.text = '审核中';
                    break;
                case 2:
                    c3.text = '已提现';
                    break;
            }
        }
    }

    class NetClient extends Laya.Script{
    	constructor(url){
    		super();
    		this.connectUrl = url;  //链接地址
    		this.valid = false;
    		this.connecting = false;
    		this.socketOpen = false;
    		this.socketMsgQueue = [];
    		this.debug = false;
    		this.intervalId = 0;
    		this.RpcId = 100;
    		this.RpcIdMap = new Map();

    		console.log("【WebSocket】new NetClient() " + url);

    		this.url = "ws://localhost:8989";
    		//用于读取消息缓存数据
    		this.byte = new Laya.Byte();
    		//这里我们采用小端
    		this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
    		this.socket = new Laya.Socket();
    		//这里我们采用小端
    		this.socket.endian = Laya.Byte.LITTLE_ENDIAN;

    		//建立连接
    		this.socket.on(Laya.Event.OPEN, this, this.openHandler);
    		this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
    		this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
    		this.socket.on(Laya.Event.ERROR, this, this.errorHandler);

    		//socket开始连接事件
    		this.onStartConnect=function(){console.log("【WebSocket】开始连接");};
    		//链接成功事件,此处可用来初始化数据
    		this.onConnectSucc=function(){ console.log("【WebSocket】链接成功");};
    		//接收消息封装,请外部自己实现
    		this.onMessage=function(data){
    			console.log("【WebSocket】收到消息(请自己实现消息处理)："+data);
    		};
    	}

    	//正确建立连接
    	openHandler(event){
    		this.connecting = false;
    		this.socketOpen = true;
    		console.log('【WebSocket】连接已打开！');
    		this.onConnectSucc();
    		
    		for (var i = 0; i < this.socketMsgQueue.length; i++) {
    			this.sendBinary(this.socketMsgQueue[i]);
    		}
    		this.socketMsgQueue = [];		
    	}
     
    	//关闭事件
    	closeHandler(e){
    		this.connecting = false;
    		this.socketOpen = false;
    		console.log('【WebSocket】已关闭！', e);
    		this.socket.close();		
    	}

    	//连接出错
    	errorHandler(e){
    		this.connecting = false;
    		this.socketOpen = false;
    		console.log('【WebSocket】连接打开失败，请检查！' + e);
    		this.socket.close();
    	}
     
    	Log(msg){
    		if(this.debug)
    			console.log(msg);
    	}
    	//重连
    	reconnect(){
    		console.log("【WebSocket】开始重连");
    		this.open();
    	}

    	getSocket() {
    		if(!this.socketOpen && !this.connecting&&this.valid) { 
    			this.socket.close();
    			this.onStartConnect();
    			this.connecting = true;
    			this.socketOpen = false;

    			console.log("【WebSocket】开始连接 ",this.connectUrl);
    			this.socket.connectByUrl(this.connectUrl);
    	 
    			return null;
    		}

    		return this.socketOpen ? this.socket : null;
    	}
    	open(){
    		this.close();
    		
    		this.valid = true;
    		this.getSocket();
    		this.intervalId = setInterval(()=>{
    			//心跳
    			this.sendHeart();
    		},5000);
    	}
    	//发送心跳消息
    	sendHeart()
    	{
    		var _socket = this.getSocket();
    		if(_socket!=null)
    		{
    			this.byte.clear();
    			this.byte.writeInt32(0);
    			this.socket.send(this.byte.buffer);
    		}
    	}
    	close() {
    		this.valid = false;
    		this.socket.close();
    		clearInterval(this.intervalId);	
    		
    		console.log("【WebSocket】关闭连接" + this.connectUrl);
    	}
    	
    	stringSource(s) {
    		var i = 0;
    		return function () {
    			return i < s.length ? s.charCodeAt(i++) : null;
    		};
    	}
    	
    	send(msg){
    		if(!this.valid) {
    			console.log("【WebSocket】请先调用 open() 开启网络");
    			return;
    		}
    		
    		if(this.debug)
    			console.log("【WebSocket】发送消息 " , msg);
    		
    		if( msg.callback != null)
    		{
    			msg.data.RpcId = ++this.RpcId;
    			this.RpcIdMap.set(msg.data.RpcId,msg.callback);
    			// console.log("注册RPC回调 ["+msg.data.RpcId+"][" +msg.name +"]" +msg.callback);
    		}	

    		this.byte.clear();
    		this.byte.pos = 4;
    		//1. 写协议名字（自动写入2字节头长度）
    		this.byte.writeUTFString(msg.name);
    		//2. 写协议内容（自动写入2字节头长度）
    		this.byte.writeUTFString(JSON.stringify(msg.data));

    		//0. 写协议总长度
    		var len = this.byte.pos;
    		this.byte.pos = 0;
    		this.byte.writeInt32(len);

    		// 发送二进制消息
    		this.sendBinary(this.byte.buffer);
    		// 清空数据,下次使用
    		this.byte.clear();
    	}
     	
    	//发送消息：协议名字,协议内容
    	sendBinary(binaryMsg){
    		var _socket = this.getSocket();
    		if(_socket==null){
    			this.socketMsgQueue.push(binaryMsg);
    			return;
    		}
    		
    		this.socket.send(binaryMsg);
    	}

    	receiveHandler(_msg){
    		this.byte.clear();
    		this.byte.writeArrayBuffer(_msg);
    		this.byte.pos = 0;

    		let msgLen = this.byte.getInt32();
    		let protocolNameLen = this.byte.getUint8();
     
    		var tmpByte = new Laya.Byte();
    		tmpByte.endian = Laya.Byte.LITTLE_ENDIAN;
    		let offset = 4;
    		let name;
    		let msg;

    		//协议名字
    		{
    			this.byte.pos = 4;
    			name = this.byte.readUTFString();
    		}

    		//协议内容
    		{
    			let json = this.byte.readUTFString();
    			msg = JSON.parse(json);
    		}

    		if(this.debug)
    			console.log("收到消息: " , msg);

    		if(msg.RpcId > 100 && this.RpcIdMap.has(msg.RpcId))
    		{
    			let call = this.RpcIdMap.get(msg.RpcId);
    			if(call!=null)
    				call(name,msg);
    			this.RpcIdMap.delete(msg.RpcId);
    			
    			return;
    		}
    		else
    			this.onMessage(name,msg);
    	}
    }

    class websketSend {
        constructor() {
            this.soketConnetNum = 0;
        }
        open() {
            this.conThis = myCenter.GameControlObj;
            this.netClient = new NetClient("ws://" + Main$1.websoketApi);
            this.onConnect();
        }
        close() {
            Main$1.showLoading(false, Main$1.loadingType.two);
            this.netClient.close();
        }
        onSend(obj) {
            let that = this;
            let name = obj.name;
            let data = obj.data;
            this.netClient.send({
                name: name,
                data: data,
                callback: function (name, msg) {
                    obj.success.call(that, msg);
                }
            });
            Main$1.$LOG('soket发送消息:', obj);
        }
        onConnect() {
            let that = this;
            this.netClient.open();
            this.netClient.onConnectSucc = () => {
                Main$1.$LOG('连接成功');
                that.connetRoom();
                that.getSoketNews();
                that.reloadConnet();
            };
        }
        getSoketNews() {
            let that = this;
            this.netClient.onMessage = function (name, resMsg) {
                that.conThis.dealSoketMessage('onMessage公共消息：', resMsg);
            };
        }
        connetRoom() {
            let that = this;
            this.onSend({
                name: 'M.User.C2G_Connect',
                data: {
                    uid: Main$1.userInfo ? Main$1.userInfo.userId : 0,
                    key: Main$1.userInfo ? Main$1.userInfo.key : 0,
                    devid: Laya.Browser.onAndroid ? "Android" : "PC",
                    ip: "60.255.161.15"
                },
                success(resMsg) {
                    Main$1.$LOG('初始化---[Rpc回调]:', resMsg);
                    if (resMsg._t == "G2C_Connect") {
                        if (resMsg.ret.type == 0) {
                            Main$1.showLoading(false, Main$1.loadingType.two);
                            this.soketConnetNum = 0;
                            this.onSend({
                                name: 'M.Room.C2R_IntoRoom',
                                data: {
                                    roomPws: this.conThis.roomPwd
                                },
                                success(res) {
                                    Main$1.showLoading(true, Main$1.loadingType.two);
                                    this.conThis.dealSoketMessage('初始化---C2R_IntoRoom进入房间', res);
                                }
                            });
                        }
                        else {
                            Main$1.showDiaLog(resMsg.ret.msg, 1, () => {
                                that.close();
                                Laya.Scene.open('Login.scene', true, Main$1.sign.signOut);
                            });
                        }
                    }
                }
            });
        }
        reloadConnet() {
            let that = this;
            this.netClient.onStartConnect = function (res) {
                Main$1.$LOG('soket重新连接开始');
                Main$1.showLoading(true, Main$1.loadingType.two);
                that.soketConnetNum++;
                if (that.soketConnetNum >= 15) {
                    Main$1.showLoading(false, Main$1.loadingType.two);
                    that.soketConnetNum = 0;
                    Main$1.showDiaLog('网络错误,请重新登录', 1, () => {
                        that.close();
                        Laya.Scene.open('login.scene', true, Main$1.sign.signOut);
                    });
                }
                else if (that.soketConnetNum == 1) {
                    Main$1.showTip('检测到网络丢失!');
                }
            };
        }
        roomUpdate() {
            this.onSend({
                name: 'M.Room.C2R_UpdateRoom',
                data: {
                    roomId: this.conThis.roomId
                },
                success(upDateRes) {
                    this.conThis.dealSoketMessage('进入房间收到的消息：', upDateRes);
                }
            });
        }
        seatAt(seatId, JSthis, callBack) {
            this.onSend({
                name: 'M.Room.C2R_SeatAt',
                data: {
                    roomid: this.conThis.roomId,
                    idx: seatId
                },
                success(res) {
                    this.conThis.dealSoketMessage('占位：', res);
                    callBack.call(JSthis, res);
                }
            });
        }
        playerSeatUpSend() {
            this.onSend({
                name: 'M.Room.C2R_SeatUp',
                data: {
                    roomid: this.conThis.roomId
                },
                success(resData) {
                    this.conThis.dealSoketMessage('占位未坐下起立：', resData);
                }
            });
        }
        playerLeaveRoomSend() {
            this.onSend({
                name: 'M.Room.C2R_LeaveRoom',
                data: {
                    roomid: this.conThis.roomId
                },
                success(res) {
                    this.conThis.dealSoketMessage('离开房间：', res);
                }
            });
        }
        comfirmIntoScore(seatIndex, dairuScore, type, isComfirm) {
            let sendName = type == 2 ? 'M.Room.C2R_AddDairu' : 'M.Room.C2R_SitDown';
            this.onSend({
                name: sendName,
                data: {
                    roomid: this.conThis.roomId,
                    idx: seatIndex,
                    score: dairuScore
                },
                success(res) {
                    this.conThis.dealSoketMessage('补充钵钵：', res);
                    if (res.ret.type == 0 && isComfirm) {
                        Main$1.showTip('带入成功');
                    }
                }
            });
        }
        liuzuoRequest(isLiuZuo, selectScore) {
            this.onSend({
                name: 'M.Room.C2R_Reservation',
                data: {
                    roomid: this.conThis.roomId,
                    reservation: isLiuZuo,
                    consume: selectScore
                },
                success(res) {
                    this.conThis.dealSoketMessage('留座：', res);
                }
            });
        }
        chatReq(msgType = 1, content, msgId) {
            this.onSend({
                name: 'M.Games.CX.C2G_GameChat',
                data: {
                    chat: {
                        "recipient": -1,
                        "sender": Main$1.userInfo.userId,
                        "content": content,
                        "msgType": msgType,
                        "msgId": msgId,
                    },
                    roomId: this.conThis.roomId,
                    chatType: 0,
                },
                success(res) {
                    this.conThis.dealSoketMessage('发送表情：', res);
                }
            });
        }
    }
    var websoket = new websketSend();

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
        }
    }
    var InitGameData$1 = new InitGameData();

    class DealMePoker {
        constructor() {
            this.others = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
            this.pokerNum = 0;
            this.timerNum = 0;
        }
        deal(data) {
            let mePokerArr = [];
            this.userIndex = 0;
            this.pokerIndex = 0;
            this.timerNum = 0;
            this.players = myCenter.GameControlObj.players;
            this.init();
            this.userPokerData0 = data.players;
            this.userPokerData = [];
            this.userPokerData0.forEach((item) => {
                if (item.uid == Main$1.userInfo['userId']) {
                    item.pokers.forEach((item2) => {
                        item2.forEach((item3, index3) => {
                            item2[index3] = parseInt(String(item3 / 10000));
                        });
                        mePokerArr = mePokerArr.concat(item2);
                    });
                }
            });
            this.userPokerData0.forEach((item, index) => {
                let data = item.uid == Main$1.userInfo['userId'] ? mePokerArr : this.others;
                this.userPokerData[index] = { userId: item.uid, data: data };
            });
            this.MovePoker();
        }
        init() {
            if (this.meDealView)
                this.meDealView.removeChildren();
            myCenter.GameUIObj.dealSeat.zOrder = 0;
            this.players.forEach((item) => {
                let getDealPokerSeat = item.owner.getChildByName('getDealPokerSeat');
                getDealPokerSeat.bottom = item.IsMe ? Main$1.deal['meBottom'] : Main$1.deal['otherBottom'];
                item.owner.zOrder = item.IsMe ? 1 : 0;
            });
        }
        MovePoker() {
            let dealPlayerData = this.userPokerData[this.userIndex];
            let dealSeat = myCenter.GameUIObj.dealSeat;
            let dealPoker = Laya.Pool.getItemByCreateFun("dealPoker", myCenter.GameControlObj.dealPoker.create, myCenter.GameControlObj.dealPoker);
            dealPoker.name = String(this.timerNum);
            dealPoker.alpha = 0;
            dealPoker.pos(0, 0);
            dealSeat.addChild(dealPoker);
            this.players.forEach((item, index) => {
                if (item.userId == dealPlayerData.userId) {
                    let getDealPokerSeat = item.owner.getChildByName('getDealPokerSeat');
                    let getDealPokerSeatXY = getDealPokerSeat.parent.localToGlobal(new Laya.Point(getDealPokerSeat.x, getDealPokerSeat.y));
                    let x = getDealPokerSeatXY.x - myCenter.GameUIObj.dealPokerSeatXY.x;
                    let y = getDealPokerSeatXY.y - myCenter.GameUIObj.dealPokerSeatXY.y;
                    let moveObj = dealSeat.getChildByName(String(this.timerNum));
                    Laya.Tween.to(moveObj, { alpha: 0.8, x: x, y: y }, Main$1.Speed['dealPoker'] * 0.8, null, Laya.Handler.create(this, () => {
                        if (item.IsMe) {
                            this.meDealView = item.owner.getChildByName('mePokerView');
                            this.meDealView.visible = true;
                            if ((this.pokerIndex) % 5 == 0) {
                                this.meCellIndex = 0;
                                let pokerCellView = new Laya.Image();
                                pokerCellView.name = 'cellBox' + parseInt(String(this.pokerIndex / 5));
                                pokerCellView.size(Main$1.pokerWidth, 450);
                                pokerCellView.bottom = 0;
                                pokerCellView.x = Main$1.pokerWidth * parseInt(String((this.pokerIndex / 5)));
                                this.meDealView.width = Main$1.pokerWidth * (parseInt(String((this.pokerIndex / 5))) + 1);
                                let hh = this.meDealView.addChild(pokerCellView);
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
                        this.timerNum++;
                        this.userIndex++;
                        if (this.userIndex % 3 == 0) {
                            this.userIndex = 0;
                            this.pokerIndex++;
                        }
                        if (this.timerNum >= 20 * 3) {
                            Laya.timer.clear(this, this.MovePoker);
                            myCenter.GameUIObj.dealSeat.zOrder = 2;
                            this.dealPokerEnd();
                        }
                        else {
                            this.MovePoker();
                        }
                    }));
                }
            });
        }
        dealPokerEnd() {
            let numChildren = this.meDealView.numChildren;
            let cellMoveX = (this.meDealView.width / 2) - (Main$1.pokerWidth / 2);
            for (let i = 0; i < numChildren; i++) {
                let childNode = this.meDealView.getChildAt(i);
                Laya.Tween.to(childNode, { x: cellMoveX }, Main$1.Speed['dealPoker2'], null, Laya.Handler.create(this, () => {
                    if (i >= numChildren - 1) {
                        this.meDealView.removeChildren();
                        this.meDealView.width = Main$1.pokerWidth;
                        this.showMePokerView();
                    }
                }));
            }
        }
        showMePokerView() {
            let mePokerData = [];
            this.userPokerData0.forEach((item, index) => {
                if (item.uid == Main$1.userInfo.userId) {
                    item.pokers.forEach((item2, index2) => {
                        mePokerData[index2] = { name: 'p' + index2, poker: item2 };
                    });
                }
            });
            let playerMe = this.players.filter((item) => item.IsMe);
            if (playerMe.length > 0) {
                this.meDealView.width = Main$1.pokerWidth * mePokerData.length;
                mePokerData.forEach((item, index) => {
                    let cellObj = new Laya.Image();
                    cellObj.name = item.name;
                    cellObj.size(Main$1.pokerWidth, 0);
                    cellObj.x = Main$1.pokerWidth * index;
                    cellObj.bottom = 0;
                    item.poker.forEach((item_inner, index_inner) => {
                        let pokerObj = new Laya.Image('res/img/poker/duan/' + item_inner + '.png');
                        if (index == 0) {
                            this.changePokerColor(pokerObj, Main$1.pokerParam['color1'], 'noHanldePoker');
                        }
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
                    this.meDealView.addChild(cellObj);
                });
            }
        }
        ClickPoker(pokerObj, e) {
            e.stopPropagation();
            if (pokerObj.height > Main$1.pokerWidth) {
                this.mePlayPoker(pokerObj);
                pokerObj.removeSelf();
                let mePutViewChildren = this.meDealView._children;
                mePutViewChildren.forEach((item, index) => {
                    let innerChildren = item._children;
                    if (innerChildren.length == 0) {
                        item.removeSelf();
                        this.meDealView.width -= Main$1.pokerWidth;
                    }
                    this.mePutViewReloadSeat();
                });
            }
            else {
                let noClick = pokerObj.getChildByName('noHanldePoker');
                if (!noClick) {
                    this.mePutViewReloadSeat();
                    this.changePokerColor(pokerObj, Main$1.pokerParam['color2'], 'clickColorImg');
                    let pokerObjH = pokerObj.height + 50;
                    Laya.Tween.to(pokerObj, { height: pokerObjH }, Main$1.Speed['pokerHeight'], Laya.Ease.backOut, Laya.Handler.create(this, () => {
                        this.adjustCellPokerSeat(pokerObj);
                    }));
                }
            }
        }
        changePokerColor(pokerObj, colorImgUrl, name) {
            let colorImg = new Laya.Image(colorImgUrl);
            colorImg.name = name;
            colorImg.left = 0;
            colorImg.right = 0;
            colorImg.bottom = 0;
            colorImg.top = 0;
            pokerObj.addChild(colorImg);
        }
        mePlayPoker(pokerObj) {
            let pokerObjSeatXY = pokerObj.parent.localToGlobal(new Laya.Point(pokerObj.x, pokerObj.y));
            let showMePlayPoker = myCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
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
            let mePutViewChildren = this.meDealView._children;
            mePutViewChildren.forEach((item, index) => {
                let innerChildren = item._children;
                item.x = Main$1.pokerWidth * index;
                innerChildren.forEach((item2, index2) => {
                    let clickColorImg = item2.getChildByName('clickColorImg');
                    if (clickColorImg)
                        clickColorImg.removeSelf();
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
            this.players = myCenter.GameControlObj.players;
            let diuPokerData = data;
            this.players.forEach((item, index) => {
                let diuView = item.owner.getChildByName('diu' + item.SeatId);
                diuView.visible = true;
                diuPokerData.forEach((item2, index2) => {
                    if (item.userId == item2.userId) {
                        item2.data.forEach((item3, index3) => {
                            if (item.SeatId != 0 && index3 % 7 == 0) {
                                this.createDiuCell(index3, diuView, 7, item.SeatId);
                            }
                            else if ((item.SeatId == 0 && index3 % 8 == 0)) {
                                this.createDiuCell(index3, diuView, 8, item.SeatId);
                            }
                            let pokerObj = new Laya.Image();
                            pokerObj.skin = 'res/img/poker/duan/' + item3 + '.png';
                            if (item.SeatId != 0 && ((index3 + 1) % 7 == 0 || index3 == item2.data.length - 1))
                                pokerObj.skin = 'res/img/poker/chang/' + item3 + '.png';
                            pokerObj.top = Main$1.pokerWidth * this.diuCellIndex - (45 * this.diuCellIndex);
                            pokerObj.zOrder = this.diuCellIndex;
                            pokerObj.name = 'poker' + (index3 + 1);
                            let chidName = item.SeatId == 0 ? 'cellBox' + parseInt(String(index3 / 8)) : 'cellBox' + parseInt(String(index3 / 7));
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
            this.players = myCenter.GameControlObj.players;
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
        feel() {
            this.players = myCenter.GameControlObj.players;
            this.feelStartSeatXY = myCenter.GameUIObj.feelPokerSeatXY;
            this.feelObj = myCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            this.initParam(true);
            let data = {
                userId: '12345' + parseInt(String(Math.random() * 3)),
                poker: parseInt(String(Math.random() * 21)) + 1
            };
            this.players.forEach((item, index) => {
                if (item.userId == data.userId) {
                    this.moveFeelPoker(item, data);
                }
            });
        }
        moveFeelPoker(item, data) {
            this.initParam2(item);
            let feelSeat = item.owner.getChildByName('feelView');
            let feelSeatXY = feelSeat.parent.localToGlobal(new Laya.Point(feelSeat.x, feelSeat.y));
            let moveX = (feelSeatXY.x - this.feelStartSeatXY.x) + feelSeat.width / 2;
            let moveY = (feelSeatXY.y - this.feelStartSeatXY.y) + feelSeat.height / 2;
            let alpha = 1;
            if (item.IsMe) {
                let changeArr = [{ nodeName: item.owner, val: 2 }];
                Main$1.changeNodeZOrder(changeArr);
            }
            Laya.Tween.to(this.feelObj, { x: moveX, y: moveY, alpha: alpha }, Main$1.Speed['feelPoker'], null, Laya.Handler.create(this, () => {
                if (item.IsMe) {
                    Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main$1.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                        this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                        this.initParam(false);
                        Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main$1.Speed['feelFan']);
                        if (this.t1)
                            clearTimeout(this.t1);
                        this.t1 = setTimeout(() => {
                            this.clearFeelPoker();
                        }, 1000);
                    }));
                }
                else {
                    Laya.Tween.to(this.feelObj, { scaleX: 0 }, Main$1.Speed['feelFan'], null, Laya.Handler.create(this, () => {
                        this.feelPoker.skin = 'res/img/poker/chang/' + data.poker + '.png';
                        this.initParam(false);
                        Laya.Tween.to(this.feelPoker, { scaleX: 1, alpha: 0.7 }, Main$1.Speed['feelFan']);
                        if (this.t2)
                            clearTimeout(this.t2);
                        this.t2 = setTimeout(() => {
                            this.clearFeelPoker();
                        }, 1000);
                    }));
                }
            }));
        }
        clearFeelPoker() {
            this.players.forEach((item, index) => {
                this.initParam2(item);
                if (item.IsMe) {
                    let changeArr = [{ nodeName: item.owner, val: 0 }];
                    Main$1.changeNodeZOrder(changeArr);
                }
            });
        }
        initParam(isShow = true) {
            this.feelObj.alpha = 0;
            this.feelObj.scale(1, 1);
            this.feelObj.pos(this.feelObj.width / 2, this.feelObj.height / 2);
        }
        initParam2(item) {
            let dealSeat_feelPoker = myCenter.GameUIObj.dealSeat.getChildByName('showPlayCards').getChildByName('feelPoker');
            this.feelPoker = item.owner.getChildByName('feelView').getChildByName('feelPoker');
            this.feelPoker.alpha = 0;
            this.feelPoker.skin = 'res/img/poker/chang/-1.png';
        }
    }
    var FeelPoker$1 = new FeelPoker();

    class OpenDiaLog extends Laya.Script {
        constructor() {
            super(...arguments);
            this.flag = true;
            this.openType = 1;
            this.openSpeed = 200;
        }
        onStart() {
            this.init();
        }
        init(type = 1, opacity = 0, JSthis, openFn, closeFn, endFn) {
            this.JSthis = JSthis;
            this.openFn = openFn;
            this.closeFn = closeFn;
            this.dialogView = this.owner.scene.dialogView;
            this.dialogMask = this.owner.scene.dialogMask;
            this.dialogMask.alpha = opacity;
            this.openType = type;
            this.owner['visible'] = false;
            switch (this.openType) {
                case 1:
                    this.owner['y'] = -this.owner['height'];
                    break;
                case 2:
                    this.owner['y'] = Laya.stage.height;
                    break;
                case 3:
                    this.owner['y'] = -this.owner['height'];
                    break;
                case 4:
                    this.owner['y'] = Laya.stage.height;
                    break;
            }
            if (endFn)
                endFn.call(JSthis);
        }
        open() {
            this.registerEvent();
            this.dialogView.visible = true;
            this.dialogMask.visible = true;
            let $y;
            switch (this.openType) {
                case 1:
                    $y = (Laya.stage.height - this.owner['height']) / 2;
                    break;
                case 2:
                    $y = (Laya.stage.height - this.owner['height']) / 2;
                    break;
                case 3:
                    $y = 0 + Main$1.phoneNews.statusHeight;
                    break;
                case 4:
                    $y = Laya.stage.height - this.owner['height'];
                    break;
            }
            this.owner['visible'] = true;
            Laya.Tween.to(this.owner, { y: $y }, this.openSpeed, null, Laya.Handler.create(this, () => {
                if (this.openFn)
                    this.openFn.call(this.JSthis);
            }));
        }
        close(onlyColseSelf = false) {
            let $y;
            switch (this.openType) {
                case 1:
                    $y = -this.owner['height'];
                    break;
                case 2:
                    $y = Laya.stage.height;
                    break;
                case 3:
                    $y = -this.owner['height'];
                    break;
                case 4:
                    $y = Laya.stage.height;
                    break;
            }
            if (this.owner['visible'])
                Laya.Tween.to(this.owner, { y: $y }, this.openSpeed, null, Laya.Handler.create(this, () => {
                    this.owner['visible'] = false;
                    if (!onlyColseSelf) {
                        this.dialogMask.visible = false;
                        this.dialogView.visible = false;
                        this.dialogMask.off(Laya.Event.CLICK);
                    }
                    if (this.closeFn)
                        this.closeFn.call(this.JSthis);
                }));
        }
        registerEvent() {
            this.dialogMask.off(Laya.Event.CLICK);
            this.dialogMask.on(Laya.Event.CLICK, this, this.close, [false]);
        }
    }

    class ReloadData {
        init() {
            this.players = myCenter.GameControlObj.players;
            this.players.forEach((itemJS, index) => {
                itemJS.userId = null;
                itemJS.SeatId = index;
                itemJS.Index = index;
                itemJS.IsMe = false;
                this.setNodes(itemJS, index);
            });
        }
        setNodes(itemJS, Index) {
            console.log(myCenter.GameUIObj.startSeatXY[Index].x);
            itemJS.owner.pos(myCenter.GameUIObj.startSeatXY[Index].x, myCenter.GameUIObj.startSeatXY[Index].y);
            let seatNode = itemJS.owner;
            let head = seatNode.getChildByName('head');
            head.skin = '';
            let score = seatNode.getChildByName('score');
            score.text = 0;
            let name = seatNode.getChildByName('name');
            name.text = '';
            let liuzuo = seatNode.getChildByName('liuzuo');
            let conutDown = seatNode.getChildByName('conutDown');
            this.common([head, score, name, liuzuo, conutDown]);
        }
        common(arrObj) {
            arrObj.forEach((item) => {
                item.visible = false;
            });
        }
    }
    var ReloadData$1 = new ReloadData();

    class MyClickSelect extends Laya.Script {
        onEnable() {
            this.bindEvent();
            this.init();
        }
        bindEvent() {
            this.list = this.owner.getChildByName("selectList");
            this.list.cells.forEach((item) => {
                let $select = item.getChildByName("listRow").getChildByName("select");
                $select.on(Laya.Event.CLICK, this, this.clickSelectBox, [$select, item]);
            });
        }
        clearAllSelect() {
            this.list.cells.forEach((item) => {
                let $yes = item.getChildByName("listRow").getChildByName("select").getChildByName("yes");
                $yes.visible = false;
            });
        }
        clickSelectBox(selectBox, cell) {
            this.clearAllSelect();
            let yes = selectBox.getChildByName("yes");
            yes.visible = !yes.visible;
            if (this.returnFn)
                this.returnFn.call(this.thisJS, cell.dataSource.value);
        }
        init(isSelectIndex = 0) {
            this.clearAllSelect();
            this.list.cells.forEach((item, index) => {
                if (index == isSelectIndex) {
                    let $yes = item.getChildByName("listRow").getChildByName("select").getChildByName("yes");
                    $yes.visible = true;
                }
            });
        }
        MySelect(thisJS, isSelectIndex = 0, fn) {
            this.thisJS = thisJS;
            this.returnFn = fn;
            this.init(isSelectIndex);
        }
    }

    class setChat {
        constructor() {
            this.selectedNum = 0;
            this.textChatList = [];
            this.preTextH = 0;
            this.preTextH2 = 0;
        }
        init(thisUI) {
            this.textChatList = [];
            this.preTextH = 0;
            this.preTextH2 = 0;
            this.thisUI = thisUI;
            this.initSelectList(thisUI);
            this.initExpressionList(thisUI);
            this.initClickSelect(thisUI);
            this.initShow(thisUI);
            this.initTextChatContent(thisUI);
            this.initTextChatSend(thisUI);
        }
        initCommonLabel(name, msg, fontSize, leading, preTextH) {
            let chatCt = new Laya.Label();
            chatCt.name = name;
            chatCt.align = 'middle';
            chatCt.fontSize = fontSize;
            chatCt.color = '#FFFFFF';
            chatCt.wordWrap = true;
            chatCt.left = 0;
            chatCt.right = 0;
            chatCt.text = msg;
            chatCt.leading = leading;
            chatCt.y = preTextH;
            return chatCt;
        }
        initTextChatSend(thisUI) {
            let textValue = thisUI.chat.getChildByName('textChatView').getChildByName('textView').getChildByName('textValue');
            let sendBtn = thisUI.chat.getChildByName('textChatView').getChildByName('textView').getChildByName('sendBtn');
            sendBtn.off(Laya.Event.CLICK);
            sendBtn.on(Laya.Event.CLICK, this, () => {
                if (textValue.text != '' && textValue.text.trim() != '') {
                    websoket.chatReq(2, String(textValue.text), 2);
                    textValue.text = '';
                }
                else {
                    Main$1.showTip('发送的内容不能为空!');
                }
            });
        }
        initTextChatContent(thisUI) {
            let sendTextView = thisUI.chat.getChildByName('textChatView').getChildByName('textView').getChildByName('textValue');
            sendTextView.text = '';
            let textShowView = thisUI.chat.getChildByName('textChatView').getChildByName('textShowView');
            textShowView.vScrollBarSkin = "";
            let deskChatView = myCenter.GameUIObj.deskView.getChildByName('chatView');
            Laya.Tween.to(deskChatView, { alpha: 0.6 }, 200);
            deskChatView.vScrollBarSkin = "";
            this.textChatList.forEach((item, index) => {
                let nameIndex = item.name + index;
                if (textShowView.getChildByName(nameIndex)) {
                    this.preTextH = textShowView.getChildByName(nameIndex).y + textShowView.getChildByName(nameIndex).displayHeight + 30;
                }
                else {
                    let returnChatCt = this.initCommonLabel(nameIndex, item.name + '：' + item.content, 40, 5, this.preTextH);
                    textShowView.addChild(returnChatCt);
                    this.preTextH += returnChatCt.displayHeight + 30;
                    setTimeout(() => {
                        textShowView.vScrollBar.value = textShowView.vScrollBar.max;
                    }, 100);
                }
                if (deskChatView.getChildByName(nameIndex)) {
                    this.preTextH2 = deskChatView.getChildByName(nameIndex).y + deskChatView.getChildByName(nameIndex).displayHeight + 0;
                }
                else {
                    let returnChatCt = this.initCommonLabel(nameIndex, item.name + '：' + item.content, 35, 2, this.preTextH2);
                    deskChatView.addChild(returnChatCt);
                    this.preTextH2 += returnChatCt.displayHeight + 0;
                    setTimeout(() => {
                        deskChatView.vScrollBar.value = deskChatView.vScrollBar.max;
                    }, 100);
                    clearTimeout(this.timeOutID);
                    this.timeOutID = setTimeout(() => {
                        Laya.Tween.to(deskChatView, { alpha: 0 }, 200);
                    }, 5000);
                }
            });
        }
        playerTextChat(data) {
            this.textChatList.push({ name: data.senderName, content: data.chat.content });
            this.initTextChatContent(this.thisUI);
        }
        initClickSelect(thisUI) {
            let MeArr = myCenter.GameControlObj.players.filter((item) => item.IsMe);
            this.selectedNum = MeArr.length > 0 ? this.selectedNum : 1;
            let selectJS = thisUI.chat.getChildByName('selectView').getComponent(MyClickSelect);
            selectJS.MySelect(this, this.selectedNum, (val) => {
                this.selectedNum = val;
                this.initShow(thisUI);
            });
        }
        initShow(thisUI) {
            let expressionView = thisUI.chat.getChildByName('expressionChatView');
            expressionView.visible = this.selectedNum == 0 ? true : false;
            let textChatView = thisUI.chat.getChildByName('textChatView');
            textChatView.visible = this.selectedNum == 1 ? true : false;
        }
        initSelectList(thisUI) {
            this.selectList = thisUI.chat.getChildByName('selectView').getChildByName('selectList');
            this.selectList.array = [{ value: 0, icon: 'res/img/common/chat_icon1.png' }, { value: 1, icon: 'res/img/common/chat_icon2.png' }];
            this.selectList.renderHandler = new Laya.Handler(this, this.selectListOnRender);
        }
        selectListOnRender(cell, index) {
            let iconBox = cell.getChildByName('listRow').getChildByName('select').getChildByName('no');
            iconBox.loadImage(cell.dataSource.icon);
        }
        initExpressionList(thisUI) {
            this.expressionList = thisUI.chat.getChildByName('expressionChatView').getChildByName('expressionList');
            this.expressionList.array = Main$1.expressionChat;
            this.expressionList.vScrollBarSkin = "";
            this.expressionList.renderHandler = new Laya.Handler(this, this.expressionListOnRender);
            this.expressionList.mouseHandler = new Laya.Handler(this, this.expressionListOnClick);
            this.expressionList.visible = true;
        }
        expressionListOnRender(cell, index) {
            let iconBox = cell.getChildByName('icon');
            iconBox.loadImage(cell.dataSource.icon);
        }
        expressionListOnClick(Event) {
            if (Event.type == 'click') {
                let MeArr = myCenter.GameControlObj.players.filter((item) => item.IsMe);
                if (MeArr.length > 0) {
                    let chatJS = myCenter.GameControlObj.owner['chat'].getComponent(OpenDiaLog);
                    chatJS.close();
                    let ID = Event.target.dataSource.id;
                    websoket.chatReq(1, String(ID), ID);
                }
                else {
                    Main$1.showTip('您处于观战模式,不能发送表情!');
                }
            }
        }
        playerChat(thisJS, data) {
            let gifBox = thisJS.owner.getChildByName("gifBox");
            gifBox.visible = true;
            let thisAni = gifBox.getChildByName('expressionAni');
            if (thisAni) {
                thisAni.removeSelf();
            }
            if (thisJS.aniTimeID) {
                clearTimeout(thisJS.aniTimeID);
            }
            Laya.loader.load("res/atlas/images/GIF/expression.atlas", Laya.Handler.create(this, onMyLoaded));
            function onMyLoaded() {
                let ani = new Laya.Animation();
                ani.name = 'expressionAni';
                ani.pos(thisJS.owner.pivotX, thisJS.owner.pivotY);
                ani.loadAnimation("animation/expression/" + data.chat.content + ".ani");
                gifBox.addChild(ani);
                ani.play();
                thisJS.aniTimeID = setTimeout(() => {
                    let thisAni = gifBox.getChildByName('expressionAni');
                    if (thisAni) {
                        thisAni.removeSelf();
                    }
                    gifBox.visible = false;
                    clearTimeout(thisJS.aniTimeID);
                }, 4000);
            }
        }
    }
    var set_content_chat = new setChat();

    class GameControl extends Laya.Script {
        constructor() {
            super(...arguments);
            this.players = [];
            this.Index = 0;
            this.num2 = 0;
            this.data1 = [
                { userId: 123450, data: [1] },
                { userId: 123451, data: [4] },
                { userId: 123452, data: [10] }
            ];
        }
        onEnable() {
            this.KeepSeatObj();
            this.InitGameData();
        }
        InitGameData() {
            myCenter.InitGameData(this);
        }
        KeepSeatObj() {
            let that = this;
            myCenter.req('seat', (res) => {
                that.players.push(res);
                InitGameData$1.Init(res, this);
                this.Index++;
            });
        }
        onStart() {
            this.setGameParamInit();
        }
        setGameParamInit() {
            this.roomPwd = this.owner['openData'] ? this.owner['openData'].roomPws : 0;
            websoket.open();
        }
        dealSoketMessage(sign, resData) {
            Main$1.$LOG(sign, resData);
            try {
                if (resData._t == 'R2C_IntoRoom') {
                    if (resData.ret.type == 0) {
                        this.requestRoomUpdateData(resData);
                    }
                    else {
                        Main$1.showTip(resData.ret.msg);
                        this.leaveRoomOpenView();
                    }
                }
                if (resData._t == 'R2C_UpdateRoom') {
                    Main$1.showLoading(false, Main$1.loadingType.two);
                    if (resData.ret.type == 0) {
                        ReloadData$1.init();
                        resData.param.json.forEach((item) => {
                            if (item._t == "YDRIntoRoom") {
                                this.getGameNews(item);
                                this.updateRoomData(item, resData);
                            }
                            else if (item._t == "UpdateRoomData") {
                            }
                        });
                    }
                    else {
                        Main$1.showTip(resData.ret.msg);
                    }
                }
                if (resData._t == 'R2C_SeatUp') {
                    if (resData.ret.type == 0) {
                        this.playerSeatUp(resData);
                    }
                    else {
                        Main$1.showTip(resData.ret.msg);
                    }
                }
                if (resData._t == 'R2C_SeatAt') {
                    if (resData.ret.type == 0) {
                        resData.param.json.forEach((item) => {
                            if (item._t == "YDRSeatAt") {
                                this.playerSeatAt(item);
                            }
                            else if (item._t == "YDRSitDown") {
                                this.playerSeatDown(item);
                            }
                        });
                    }
                    else {
                        Main$1.showTip(resData.ret.msg);
                    }
                }
                if (resData._t == "R2C_AddDairu" || resData._t == "R2C_SitDown") {
                    if (resData.ret.type == 0 || resData.ret.type == 4) {
                        resData.param.json.forEach((item) => {
                            if (item._t == "YDRAddBobo") {
                                this.playerDairu(item);
                            }
                        });
                    }
                    if (resData.ret.type != 0) {
                        Main$1.showTip(resData.ret.msg);
                        let makeUpBOBO = this.owner['makeUpCoin'].getComponent(OpenDiaLog);
                        makeUpBOBO.close();
                    }
                }
                if (resData._t == "R2C_Reservation") {
                    if (resData.ret.type == 0) {
                        resData.param.json.forEach((item) => {
                            if (item._t == "YDRSeatReservation") {
                                this.palyerLiuZuo(item);
                            }
                            else if (item._t == "YDRSitDown") {
                                this.playerReturnSeat(item);
                            }
                        });
                    }
                    else {
                        Main$1.showTip(resData.ret.msg);
                    }
                }
                if (resData._t == "R2C_LeaveRoom") {
                    if (resData.ret.type == 4) {
                        Main$1.showTip(resData.ret.msg);
                    }
                    else {
                        this.leaveRoomDeal(resData);
                    }
                }
                if (resData._t == "G2C_GameChat") {
                    if (resData.ret.type == 0) {
                        this.playerChat(resData);
                    }
                    else {
                        Main$1.showTip(resData.ret.msg);
                    }
                }
                if (resData._t == "G2C_StartNewWheel") {
                    this.startNewGame(resData);
                }
                else if (resData._t == "G2C_DealHand") {
                    this.dealPlayerPoker(resData);
                }
            }
            catch (error) {
                Main$1.$LOG(error);
            }
        }
        startNewGame(data) {
            this.players.forEach((itemJS) => {
                data.players.forEach((itemData) => {
                    if (itemJS.userId == itemData.uid) {
                        itemJS.startNewGame(data);
                    }
                });
            });
        }
        dealPlayerPoker(data) {
            DealOrPlayPoker.deal(data);
        }
        leaveRoomDeal(data) {
            if (data.userid == Main$1.userInfo.userId) {
                websoket.close();
                Main$1.$openScene('TabPages.scene', true, { page: this.owner['openData'].page });
            }
            else {
                this.playerSeatUp(data);
            }
        }
        getGameNews(data) {
            this.GameNews = data;
        }
        updateCurData(item, data) {
        }
        updateRoomData(itemData, data) {
            let roomSeat = itemData.roomSeat;
            this.changePlayerSeatId(roomSeat);
            roomSeat.forEach((item) => {
                this.players.forEach((JSitem) => {
                    if (JSitem.SeatId == item.seat_idx) {
                        item.userId = item._id;
                        if (item.score == 0 && item.seatAtTime > 0) {
                            JSitem.playerSeatAtFn(item);
                        }
                        else if (item.score > 0 && item.seatAtTime <= 0) {
                            JSitem.playerSeatDownFn(item);
                        }
                        else if (item.score > 0 && item.seatAtTime > 0) {
                            JSitem.playerSeatDownFn(item);
                            JSitem.palyerLiuZuo(item);
                        }
                    }
                });
            });
        }
        changePlayerSeatId(roomSeat) {
            let meSeatArr = roomSeat.filter((item) => item._id == Main$1.userInfo.userId);
            if (meSeatArr.length > 0) {
                let meSeatId = meSeatArr[0].seat_idx;
                let seatIndexArr = [0, 1, 2];
                let NewSeatSeatArr = seatIndexArr.splice(meSeatId, seatIndexArr.length).concat(seatIndexArr.splice(0, meSeatId + 1));
                this.players.forEach((item, index) => {
                    item.SeatId = NewSeatSeatArr[index];
                });
                Main$1.$LOG('重置玩家为之id', this.players);
            }
        }
        playerSeatAt(data) {
            this.players.forEach((JSitem) => {
                if (JSitem.SeatId == data.seatidx) {
                    JSitem.playerSeatAtFn(data);
                }
            });
        }
        playerSeatUp(data) {
            this.players.forEach((JSitem) => {
                if (JSitem.userId == data.userid) {
                    data.userId = data.userid;
                    JSitem.playerSeatUpFn(data);
                }
            });
        }
        playerDairu(data) {
            this.players.forEach((JSitem) => {
                if (JSitem.userId == data.userId) {
                    JSitem.playerDairu(data);
                }
            });
        }
        palyerLiuZuo(data) {
            this.players.forEach((JSitem) => {
                if (JSitem.userId == data.userId) {
                    JSitem.palyerLiuZuo(data);
                }
            });
        }
        playerReturnSeat(data) {
            this.players.forEach((JSitem) => {
                if (JSitem.userId == data.userId) {
                    JSitem.playerReturnSeatFn(data);
                }
            });
        }
        playerSeatDown(data) {
            this.players.forEach((JSitem) => {
                if (JSitem.SeatId == data.seatidx) {
                    JSitem.playerSeatDownFn(data);
                }
            });
        }
        playerChat(data) {
            if (data.chat.msgType == 1) {
                this.players.forEach((JSitem) => {
                    if (JSitem.userId == data.chat.sender) {
                        JSitem.playerChat(data);
                    }
                });
            }
            else if (data.chat.msgType == 2) {
                set_content_chat.playerTextChat(data);
            }
        }
        requestRoomUpdateData(data) {
            this.roomId = data.roomId;
            websoket.roomUpdate();
        }
        leaveRoomOpenView() {
        }
        dealPokerFn() {
            websoket.playerSeatUpSend();
        }
        diuPoker() {
            let num = parseInt(String(Math.random() * 21)) + 1;
            this.data1[0].data.push(num);
            this.data1[1].data.push(num);
            this.data1[2].data.push(num);
            DiuPoker$1.open(this.data1);
        }
        handlePoker() {
            ShowHandlePoker.open();
        }
        feelPoker() {
            FeelPoker$1.feel();
        }
        otherPlay() {
            this.num2++;
            DealOrPlayPoker.otherPlay(this.num2);
        }
        countDown() {
            let index = parseInt(String(Math.random() * 3));
            this.players[index].playerCountDown(true, {
                startTime: Math.round(new Date().getTime() / 1000),
                endTime: Math.round(new Date().getTime() / 1000) + 20
            });
        }
    }

    class SlideSelect extends Laya.Script {
        constructor() {
            super(...arguments);
            this.addNum = 2;
            this.slideAllNum = 6;
        }
        onStart() {
            this.slideBtn = this.owner.getChildByName('slider_btn');
            this.registerEvent();
        }
        registerEvent() {
            this.slideBtn.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        }
        onMouseDown() {
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        }
        onMouseMove() {
            this.slideBtn.x = Math.max(Math.min(this.owner['mouseX'], this.owner['width']), 0);
            let endVal = (parseInt(String(this.slideBtn.x / this.space)) + 1) * this.startValue;
            if (this.getEndValFn)
                this.getEndValFn.call(this.JSthis, endVal);
        }
        onMouseUp() {
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        }
        init(startVal, addNum = 2, slideAllNum = 6, JSthis, getEndValFn) {
            if (getEndValFn)
                this.getEndValFn = getEndValFn;
            this.JSthis = JSthis;
            this.startValue = startVal;
            this.addNum = addNum ? addNum : 2;
            this.slideAllNum = slideAllNum ? slideAllNum : 6;
            this.slideBtn.x = 0;
            this.space = this.owner['width'] / (this.slideAllNum - 1);
        }
    }

    class step_1_seatAtOrDown {
        constructor() {
            this.flag1 = true;
        }
        playerSeatAtSet(thisPlayer, data) {
            this.seatIndex = data.seatidx;
            let isMe = data.userId == Main$1.userInfo.userId ? true : false;
            let userId = data.userId;
            let nameShow = data.userId == Main$1.userInfo.userId ? false : true;
            let nameText = data.userId == Main$1.userInfo.userId ? '' : data.name;
            thisPlayer.seatAtlastTime = data.seatAtTime - Main$1.getTimeChuo();
            if (thisPlayer.seatAtlastTime > data.totalTime) {
                thisPlayer.seatAtlastTime = data.totalTime;
            }
            let scoreText = `等待${thisPlayer.seatAtlastTime}s`;
            Laya.timer.loop(1000, thisPlayer, thisPlayer.palyerSeatAtTime);
            this.commonSet(thisPlayer, userId, isMe, nameShow, nameText, true, scoreText, true, data.head);
            if (data.userId == Main$1.userInfo.userId)
                this.diaLogState(true, thisPlayer);
        }
        diaLogState(show = true, thisPlayer, type) {
            this.addCoinType = type ? type : 1;
            let makeUpBOBO = myCenter.GameControlObj.owner['makeUpCoin'].getComponent(OpenDiaLog);
            let slideJS = myCenter.GameControlObj.owner['makeUpCoin'].getChildByName('sliderView').getComponent(SlideSelect);
            switch (show) {
                case true:
                    this.openedMakeUpCoin();
                    this.flag1 = true;
                    makeUpBOBO.init(1, 0, this, () => {
                        this.registerEvent();
                    }, () => {
                        this.closeEvent();
                        if (this.flag1 && thisPlayer) {
                            Laya.timer.clear(thisPlayer, thisPlayer.palyerSeatAtTime);
                            websoket.playerSeatUpSend();
                        }
                    }, () => {
                        slideJS.init(this.dairuScore, 2, 6, this, (val) => {
                            this.dairuScoreFn(val);
                        });
                        makeUpBOBO.open();
                    });
                    break;
                case false:
                    makeUpBOBO.close();
                    break;
            }
        }
        playerSeatUpSet(thisPlayer, data) {
            this.commonSet(thisPlayer, null, false, false, '', false, '', false, '');
            if (data.userId == Main$1.userInfo.userId) {
                this.flag1 = false;
                this.diaLogState(false, thisPlayer);
            }
        }
        commonSet(thisPlayer, userId, isMe, nameShow, nameText, scoreShow, scoreText, headShow, headUrl) {
            thisPlayer.IsMe = isMe;
            thisPlayer.userId = userId;
            let headName = thisPlayer.owner.getChildByName('name');
            headName.visible = nameShow;
            headName.text = nameText;
            let scoreBox = thisPlayer.owner.getChildByName('score');
            scoreBox.visible = scoreShow;
            scoreBox.text = scoreText;
            let head = thisPlayer.owner.getChildByName('head');
            head.visible = headShow;
            Main$1.$LoadImage(head, headUrl, Main$1.defaultData.head1, 'skin');
            let liuzuoView = thisPlayer.owner.getChildByName('liuzuo');
            liuzuoView.visible = false;
            Laya.timer.clear(thisPlayer, thisPlayer.palyerLiuZuoTime);
        }
        playerSeatDownSet(thisPlayer, data) {
            Laya.timer.clear(thisPlayer, thisPlayer.palyerSeatAtTime);
            thisPlayer.IsMe = data.userId == Main$1.userInfo.userId ? true : false;
            thisPlayer.userId = data.userId;
            let scoreBox = thisPlayer.owner.getChildByName('score');
            scoreBox.visible = true;
            scoreBox.text = data.score;
            if (data.userId == Main$1.userInfo.userId) {
                this.flag1 = false;
                this.diaLogState(false, thisPlayer);
            }
        }
        playerSeatDown2Set(thisPlayer, data) {
            Laya.timer.clear(thisPlayer, thisPlayer.palyerSeatAtTime);
            let isMe = data.userId == Main$1.userInfo.userId ? true : false;
            let userId = data.userId;
            let nameShow = data.userId == Main$1.userInfo.userId ? false : true;
            let nameText = data.userId == Main$1.userInfo.userId ? '' : data.name;
            let scoreText = data.score;
            this.commonSet(thisPlayer, userId, isMe, nameShow, nameText, true, scoreText, true, data.head);
        }
        openedMakeUpCoin() {
            this.getPlayerUsableScore(() => {
                let useScoreBox = myCenter.GameControlObj.owner.bobo_trueScore;
                useScoreBox.text = this.useScore;
            });
            let IDBox = myCenter.GameControlObj.owner.bobo_ID;
            IDBox.text = Main$1.userInfo.userId;
            let startdairuScore = myCenter.GameControlObj.GameNews ? myCenter.GameControlObj.GameNews.option.dairu : 0;
            this.dairuScoreFn(startdairuScore);
        }
        dairuScoreFn(dairuScore) {
            let dairujifenBox = myCenter.GameControlObj.owner.bobo_daiRuScore;
            dairujifenBox.text = dairuScore;
            let fuwufeiBox = myCenter.GameControlObj.owner.bobo_fuwufei;
            fuwufeiBox.text = dairujifenBox.text * (1 / 10);
            this.dairuScore = dairujifenBox.text;
        }
        getPlayerUsableScore(fn) {
            let that = this;
            HTTP.$request({
                that: this,
                url: '/M.User/GetInfo',
                data: {
                    uid: Main$1.userInfo.userId,
                },
                success(res) {
                    if (res.data.ret.type == 0) {
                        that.useScore = res.data.score;
                        fn.call(that);
                    }
                    else {
                        Main$1.showTip(res.data.ret.msg);
                    }
                },
                fail() {
                }
            });
        }
        registerEvent() {
            let dairuBtn = myCenter.GameControlObj.owner.makeUpCoin.getChildByName('confirmDaiRuBtn');
            dairuBtn.on(Laya.Event.CLICK, this, () => {
                websoket.comfirmIntoScore(this.seatIndex, this.dairuScore, this.addCoinType, true);
            });
        }
        closeEvent() {
            let dairuBtn = myCenter.GameControlObj.owner.makeUpCoin.getChildByName('confirmDaiRuBtn');
            dairuBtn.off(Laya.Event.CLICK);
        }
    }
    var step_1_seatAtOrDown$1 = new step_1_seatAtOrDown();

    class setLiuZuo {
        constructor() {
            this.selectScore = 150;
        }
        open() {
            this.liuzuoJS = myCenter.GameControlObj.owner['LiuZuo'].getComponent(OpenDiaLog);
            this.initLiuZuoList();
            this.initSelect();
            this.registerEvent(true);
            this.liuzuoJS.init(2, 0, this, null, () => {
                this.registerEvent(false);
            }, () => {
                this.liuzuoJS.open();
            });
        }
        registerEvent(isRegistr) {
            let comfrimBtn = this.liuzuoJS.owner.getChildByName("confrimBtn");
            if (isRegistr)
                comfrimBtn.on(Laya.Event.CLICK, this, this.comfrim);
            else
                comfrimBtn.off(Laya.Event.CLICK);
        }
        initLiuZuoList() {
            let list = this.liuzuoJS.owner.getChildByName("selectListBox").getChildByName("selectList");
            list.visible = true;
            list.array = [
                { img: 'res/img/liuzuo/l_120.png', value: 150 },
                { img: 'res/img/liuzuo/l_300.png', value: 300 }
            ];
            list.renderHandler = new Laya.Handler(this, this.listRenderHandler);
        }
        initSelect() {
            this.selectScore = 150;
            let selectListBox = this.liuzuoJS.owner.getChildByName("selectListBox");
            let $MyClickSelect = selectListBox.getComponent(MyClickSelect);
            $MyClickSelect.MySelect(this, 0, (val) => {
                this.selectScore = val;
            });
        }
        listRenderHandler(cell) {
            let $label = cell.getChildByName("listRow").getChildByName("label");
            $label.skin = cell.dataSource.img;
        }
        comfrim() {
            this.liuzuoJS.close();
            websoket.liuzuoRequest(true, this.selectScore);
        }
        palyerLiuZuoSet(thisPlayer, data) {
            let liuzuoView = thisPlayer.owner.getChildByName('liuzuo');
            let returnSeatBtn = liuzuoView.getChildByName('returnSeatBtn');
            let scoreView = thisPlayer.owner.getChildByName('score');
            returnSeatBtn.visible = data.userId == Main$1.userInfo.userId ? true : false;
            liuzuoView.visible = true;
            thisPlayer.liuzuoAllTime = data.seatAtTime - Main$1.getTimeChuo();
            thisPlayer.liuzuoAllTime = thisPlayer.liuzuoAllTime > data.totalTime ? data.totalTime : thisPlayer.liuzuoAllTime;
            scoreView.text = '留座' + thisPlayer.liuzuoAllTime + 's';
            Laya.timer.loop(1000, thisPlayer, thisPlayer.palyerLiuZuoTime, [scoreView]);
            if (data.userId == Main$1.userInfo.userId)
                this.returnBtnEvent(thisPlayer, true);
        }
        liuzuoTime(thisPlayer, scoreView) {
            thisPlayer.liuzuoAllTime--;
            scoreView.text = '留座' + thisPlayer.liuzuoAllTime + 's';
            if (thisPlayer.liuzuoAllTime <= 0)
                Laya.timer.clear(thisPlayer, thisPlayer.palyerLiuZuoTime);
        }
        returnBtnEvent(thisPlayer, isRegistr) {
            let returnSeatBtn = thisPlayer.owner.getChildByName('liuzuo').getChildByName('returnSeatBtn');
            if (isRegistr)
                returnSeatBtn.on(Laya.Event.CLICK, this, (e) => {
                    e.stopPropagation();
                    websoket.liuzuoRequest(false, 0);
                });
            else
                returnSeatBtn.off(Laya.Event.CLICK);
        }
        playerReturnSeatSet(thisPlayer, data) {
            let liuzuoView = thisPlayer.owner.getChildByName('liuzuo');
            let scoreView = thisPlayer.owner.getChildByName('score');
            Laya.timer.clear(thisPlayer, thisPlayer.palyerLiuZuoTime);
            scoreView.text = data.score;
            liuzuoView.visible = false;
            this.returnBtnEvent(thisPlayer, false);
        }
    }
    var set_content_liuzuo = new setLiuZuo();

    class setMenu {
        init(thisUI) {
            this.menuList = thisUI.menu.getChildByName('menuList');
            this.menuList.array = Main$1.loadMenuImgArr;
            this.menuList.renderHandler = new Laya.Handler(this, this.menuListOnRender);
            this.menuList.mouseHandler = new Laya.Handler(this, this.menuListOnClick);
        }
        menuListOnRender(cell, index) {
            cell.id = index + 1;
            let line = cell.getChildByName('line');
            let ct = cell.getChildByName('content');
            line.visible = index == this.menuList.length - 1 ? false : true;
            Main$1.$LoadImage(ct, cell.dataSource, null, 'skin');
        }
        menuListOnClick(Event) {
            if (Event.type == 'click') {
                let menuJS = myCenter.GameControlObj.owner['menu'].getComponent(OpenDiaLog);
                let isMeArr = myCenter.GameControlObj.players.filter((item) => item.IsMe);
                let clicId = Event.target.id;
                let onlyColseSelf = (clicId == 3 || clicId == 4) && isMeArr.length > 0 ? true : false;
                menuJS.close(onlyColseSelf);
                switch (Event.target.id) {
                    case 1:
                        websoket.playerSeatUpSend();
                        break;
                    case 2:
                        console.log('1');
                        break;
                    case 3:
                        if (isMeArr.length > 0) {
                            step_1_seatAtOrDown$1.diaLogState(true, null, 2);
                        }
                        else {
                            Main$1.showTip('您当前为观战模式,无法补充金币!');
                        }
                        break;
                    case 4:
                        if (isMeArr.length > 0) {
                            set_content_liuzuo.open();
                        }
                        else {
                            Main$1.showTip('您当前为观战模式,无法留坐!');
                        }
                        break;
                    case 5:
                        Main$1.$openScene('Shop.scene', false, { isTabPage: false }, (res) => {
                            res.zOrder = 30;
                            res.x = Laya.stage.width;
                            Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage']);
                        });
                        break;
                    case 6:
                        websoket.playerLeaveRoomSend();
                        break;
                }
            }
        }
    }
    var setMenuContent = new setMenu();

    class openView extends Laya.Script {
        constructor() {
            super(...arguments);
            this.openType = 0;
            this.openSceneUrl = '';
            this.openCloseOtherScene = false;
            this.openDta = null;
            this.openMethod = 0;
            this.selfScene = '';
        }
        initOpen(openType, openSceneUrl, openCloseOtherScene, openDta, openMethod) {
            Main$1.$LOG('初始化openView打开的场景地址：', this.openSceneUrl);
            this.openType = openType ? openType : 0;
            this.openSceneUrl = openSceneUrl ? openSceneUrl : '';
            this.openCloseOtherScene = openCloseOtherScene ? openCloseOtherScene : false;
            this.openDta = openDta ? openDta : null;
            this.openMethod = openMethod ? openMethod : 0;
        }
        onEnable() {
            this.selfScene = this.owner.scene;
            this.bindEvent();
        }
        bindEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.openView);
        }
        openView() {
            Main$1.$LOG('openView打开的场景地址：', this.openSceneUrl);
            Main$1.$openScene(this.openSceneUrl, this.openCloseOtherScene, this.openDta, (res) => {
                if (this.openMethod == 0) {
                    res.x = Laya.stage.width;
                    res.zOrder = 10;
                    Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                        myCenter.send('sceneUrl1', this.openSceneUrl);
                        if (this.openType == 1)
                            this.selfScene['removeSelf']();
                    }));
                }
                else if (this.openMethod == 2) {
                    res.x = -Laya.stage.width;
                    res.zOrder = 10;
                    Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                        myCenter.send('sceneUrl', this.openSceneUrl);
                        if (this.openType == 1)
                            this.selfScene['removeSelf']();
                    }));
                }
            });
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
        onOpened(options) {
            this.openData = options;
            this.initJS();
            setMenuContent.init(this);
            set_content_chat.init(this);
        }
        InitGameUIData() {
            this.GameControlJS = this.getComponent(GameControl);
            myCenter.InitGameUIData(this);
        }
        initJS() {
            let RealTimeResultJS = this['btnView'].getChildByName('btn_look1').getComponent(openView);
            RealTimeResultJS.initOpen(0, 'RealTimeResult.scene', false, null, 2);
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
            this['timeBtn'].on(Laya.Event.CLICK, this, () => {
                this.GameControlJS.countDown();
            });
            this['btnView']._children.forEach((item) => {
                item.on(Laya.Event.CLICK, this, () => {
                    switch (item.name) {
                        case 'btn_menu':
                            this.openMenu();
                            break;
                        case 'btn_chat':
                            this.openChat();
                            break;
                    }
                });
            });
        }
        openMenu() {
            let menu = myCenter.GameControlObj.owner['menu'].getComponent(OpenDiaLog);
            menu.init(3, 0, this, null, null, () => {
                menu.open();
            });
        }
        openChat() {
            let chatJS = myCenter.GameControlObj.owner['chat'].getComponent(OpenDiaLog);
            chatJS.init(4, 0, this, null, null, () => {
                chatJS.open();
            });
        }
    }

    class SetSceneWH$1 extends Laya.Script {
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

    class ChangeSeat {
        constructor() {
            this.seatIndexArr = [0, 1, 2];
            this.selectSeatIndex = null;
            this.selectSeatId = null;
        }
        change(CLICKOBJ, thisObj) {
            let that = this;
            this.selectSeatIndex = thisObj.Index;
            this.selectSeatId = thisObj.SeatId;
            this.seatIndexArr = [0, 1, 2];
            this.playerSeatArr = myCenter.GameControlObj.players;
            this.playerSeatXYArr = myCenter.GameUIObj.startSeatXY;
            this.playerFeelSeatXYArr = myCenter.GameUIObj.startFeelSeatXY;
            console.log(this.playerSeatArr);
            if (thisObj.userId == '' || !thisObj.userId) {
                websoket.seatAt(thisObj.SeatId, this, (res) => {
                    if (res.ret.type == 0) {
                        let NewSeatIndexArr = that.seatIndexArr.splice(that.selectSeatIndex, that.seatIndexArr.length).concat(that.seatIndexArr.splice(0, that.selectSeatIndex + 1));
                        NewSeatIndexArr.forEach((item, index) => {
                            Laya.Tween.to(that.playerSeatArr[item].owner, { x: that.playerSeatXYArr[index].x, y: that.playerSeatXYArr[index].y }, Main$1.Speed['changeSeat']);
                            that.changeSeatNodeParam(that.playerSeatArr[item].owner, index);
                        });
                    }
                });
            }
        }
        setSeatContent(seatObj) {
        }
        changeSeatNodeParam(seatObj, index) {
            let feelPokerNode = seatObj.getChildByName('feelView');
            feelPokerNode.pos(this.playerFeelSeatXYArr[index].x, this.playerFeelSeatXYArr[index].y);
        }
    }
    var ChangeSeat$1 = new ChangeSeat();

    class CountDown {
        open(seatThis, data) {
            seatThis.conutDownData = data;
            let conutDown = seatThis.owner.getChildByName("conutDown");
            conutDown.visible = true;
            seatThis._imgNode = conutDown.getChildByName('timeMask');
            seatThis._imgNode.loadImage('res/img/common/progress1.png', Laya.Handler.create(this, () => {
                Laya.timer.frameLoop(1, seatThis, seatThis.seat_drawPie);
            }));
            seatThis._allTime = data.endTime - data.startTime - 2;
            seatThis._rotation = 360 * (((new Date().getTime() / 1000 - data.startTime)) / seatThis._allTime) + 2;
            seatThis.timeText = conutDown.getChildByName("timeText");
            seatThis.timeText.text = `${seatThis._allTime}s`;
            seatThis._timeOutFlag = true;
        }
        drawPie(seatThis) {
            let time = seatThis._allTime - parseInt(String(((new Date().getTime() / 1000 - seatThis.conutDownData.startTime))));
            seatThis.timeText.text = time + 's';
            if (time == 5 && seatThis.IsMe && seatThis._timeOutFlag) {
                seatThis._timeOutFlag = false;
                seatThis._imgNode.loadImage('res/img/common/progress2.png');
            }
            seatThis._rotation = 360 * (((new Date().getTime() / 1000 - seatThis.conutDownData.startTime)) / seatThis._allTime);
            if (seatThis._rotation >= 360) {
                seatThis._rotation = 360;
                Laya.timer.clear(seatThis, seatThis.seat_drawPie);
                this.close(seatThis);
            }
            seatThis._mask.graphics.clear();
            seatThis._mask.graphics.drawPie(83, 83, 83, seatThis._rotation, 360, '#000000');
            seatThis._imgNode.mask = seatThis._mask;
        }
        close(seatThis) {
            let countDownBox = seatThis.owner.getChildByName("conutDown");
            countDownBox.visible = false;
            Laya.timer.clear(seatThis, seatThis.seat_drawPie);
        }
    }
    var countDown = new CountDown();

    class step_2_startNewGame {
        start(JSthis, data) {
            let meDealView = JSthis.owner.getChildByName('mePokerView');
            meDealView.removeChildren();
            let banker = JSthis.owner.getChildByName('banker');
            banker.visible = data.bankerId == JSthis.userId ? true : false;
        }
    }
    var step_2_startNewGame$1 = new step_2_startNewGame();

    class seat extends Laya.Script {
        constructor() {
            super();
            this.IsMe = false;
            this._mask = new Laya.Sprite();
        }
        onEnable() {
            this.RegisterEvent();
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
            myCenter.send('seat', this);
        }
        CLICK_SEAT(Event) {
            ChangeSeat$1.change(Event, this);
        }
        playerSeatAtFn(data) {
            step_1_seatAtOrDown$1.playerSeatAtSet(this, data);
        }
        palyerSeatAtTime() {
            let scoreBox = this.owner.getChildByName('score');
            this.seatAtlastTime--;
            scoreBox.text = `等待${this.seatAtlastTime}s`;
            if (this.seatAtlastTime <= 0)
                Laya.timer.clear(this, this.palyerSeatAtTime);
        }
        playerSeatUpFn(data) {
            step_1_seatAtOrDown$1.playerSeatUpSet(this, data);
        }
        playerDairu(data) {
            step_1_seatAtOrDown$1.playerSeatDownSet(this, data);
        }
        playerSeatDownFn(data) {
            step_1_seatAtOrDown$1.playerSeatDown2Set(this, data);
        }
        palyerLiuZuo(data) {
            set_content_liuzuo.palyerLiuZuoSet(this, data);
        }
        playerReturnSeatFn(data) {
            set_content_liuzuo.playerReturnSeatSet(this, data);
        }
        palyerLiuZuoTime(scoreView) {
            set_content_liuzuo.liuzuoTime(this, scoreView);
        }
        playerChat(data) {
            set_content_chat.playerChat(this, data);
        }
        startNewGame(data) {
            step_2_startNewGame$1.start(this, data);
        }
        playerCountDown(isShow, data) {
            if (isShow)
                countDown.open(this, data);
            else
                countDown.close(this);
        }
        seat_drawPie() {
            countDown.drawPie(this);
        }
    }

    class SetViewWH extends Laya.Script {
        onEnable() {
            this.owner['width'] = parseInt((this.owner['width'] / (1242 / Laya.stage.width)).toFixed(0));
            this.owner['height'] = parseInt((this.owner['height'] / (2208 / Laya.stage.height)).toFixed(0));
        }
    }

    class Notice extends Laya.Script {
        onStart() {
            myCenter.req('meOpen', (res) => {
            });
        }
    }

    class login extends Laya.Script {
        constructor() {
            super(...arguments);
            this.flag = true;
        }
        onEnable() {
            this.phone = this.owner['phone_value'];
            this.pwd = this.owner['pwd_value'];
        }
        onStart() {
            this.initOpenView();
            this.startLoadPage();
            myCenter.req('loginPage', () => {
                this.owner['loginState'] = true;
                this.startLoadPage();
            });
        }
        initPage() {
        }
        startLoadPage() {
            let userInfo;
            if (!Main$1.AUTO)
                userInfo = Main$1.wxGame ? wx.getStorageSync('userInfo') : JSON.parse(localStorage.getItem("userInfo"));
            else
                userInfo = Main$1.userInfo;
            if (userInfo) {
                this.phone.text = userInfo.user ? userInfo.user : '';
                this.pwd.text = userInfo.pwd ? userInfo.pwd : '';
                if ((this.phone.text != '' && this.phone.text.trim('') != '') && (this.pwd.text != '' && this.pwd.text.trim('') != '') && !this.owner['loginState'])
                    this.login();
            }
        }
        login() {
            if (this.flag) {
                this.flag = false;
                Main$1.showLoading(true);
                let user = this.phone.text;
                let pwd = this.pwd.text;
                if (user == '') {
                    this.flag = true;
                    Main$1.showDiaLog('账号不能为空!');
                    Main$1.showLoading(false);
                    return false;
                }
                else if (pwd == '') {
                    this.flag = true;
                    Main$1.showDiaLog('密码不能为空!');
                    Main$1.showLoading(false);
                    return false;
                }
                let jsonObj = {
                    pws: pwd
                };
                jsonObj = escape(JSON.stringify(jsonObj));
                let data = {
                    acc: user,
                    ip: '192.168.0.112',
                    type: 'accpws',
                    json: jsonObj,
                    devid: Laya.Browser.onAndroid ? "Android" : "PC",
                };
                HTTP.$request({
                    that: this,
                    url: '/M.Acc/Login',
                    data: data,
                    success(res) {
                        console.log(res);
                        if (res.data.ret.type == 0) {
                            let data = {
                                user: user,
                                pwd: pwd,
                                userId: res.data.userId,
                                key: res.data.key,
                                inRoomPws: res.data.inRoomPws,
                                init: res.data.init
                            };
                            this.changeMainUserInfo(data);
                            this.getUserInfoLogined();
                            setTimeout(() => {
                                this.dealWithLoginedView(data);
                            }, 1000);
                        }
                        else {
                            this.flag = true;
                            Main$1.showLoading(false);
                            Main$1.showDiaLog(res.data.ret.msg);
                            if (Main$1.AUTO) {
                                setTimeout(() => {
                                    Main$1.closeDiaLog();
                                }, 400);
                            }
                        }
                    },
                    fail() {
                        this.flag = true;
                        Main$1.showLoading(false);
                    },
                    timeout() {
                        this.flag = true;
                    }
                });
            }
        }
        getUserInfoLogined() {
            Main$1.familyRoomInfo.IsJoin = Main$1.familyRoomInfo.IsProm = false;
            HttpReqContent.getUserInfoLogined(this, (res) => {
                Main$1.$LOG('获取基础信息（当用户登录后前端主动请求）', res);
                let datas = res.data.datas.filter((item) => item._t === "PromUILData")[0];
                Main$1.familyRoomInfo.IsJoin = datas.IsJoin;
                Main$1.familyRoomInfo.IsProm = datas.IsProm;
                if (!datas.IsJoin) {
                    let data = {
                        uid: Main$1.userInfo.userId,
                        joinuid: Main$1.familyRoomInfo.joinUserId,
                        ip: '132.232.34.32',
                        localip: null,
                        system: null
                    };
                    HttpReqContent.joinPromoter(this, data, (res2) => {
                        Main$1.$LOG('加入某个推广员（即加入亲友团）', res2);
                        Main$1.familyRoomInfo.IsJoin = true;
                    });
                }
            });
        }
        changeMainUserInfo(data) {
            if (!Main$1.AUTO) {
                if (Main$1.wxGame) {
                }
                else {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                }
            }
            Main$1.userInfo = data;
        }
        dealWithLoginedView(data) {
            let pageData = {
                roomPws: data.inRoomPws,
                page: Main$1.pages.page3
            };
            if (data.init) {
                Laya.Scene.open('TabPages.scene', true, pageData, Laya.Handler.create(this, (res) => {
                    Main$1.showLoading(false);
                    clearTimeout(this.loadTimeID);
                    this.flag = true;
                }), Laya.Handler.create(this, () => {
                    this.loadTimeID = setTimeout(() => {
                        Main$1.showLoading(false);
                        Main$1.$LOG('加载超时！');
                        clearTimeout(this.loadTimeID);
                    }, 10000);
                }));
            }
            else {
                let openData = {
                    userId: data.userId
                };
                Main$1.$openScene('TabPages.scene', true, openData, (res) => {
                    Main$1.showLoading(false);
                    clearTimeout(this.loadTimeID);
                    this.flag = true;
                });
            }
        }
        initOpenView() {
            let openData1 = {
                page: Main$1.sign.register
            };
            let OpenViewJS1 = this.owner['register_btn'].getComponent(openView);
            OpenViewJS1.initOpen(0, 'Register.scene', false, openData1, 0);
            let openData2 = {
                page: Main$1.sign.changePwd
            };
            let OpenViewJS2 = this.owner['change_btn'].getComponent(openView);
            OpenViewJS2.initOpen(0, 'Register.scene', false, openData2, 0);
        }
    }

    class Login extends Laya.Scene {
        constructor() {
            super(...arguments);
            this.loginState = null;
        }
        onAwake() {
            this.registerEvent();
        }
        registerEvent() {
            this['login_btn'].on(Laya.Event.CLICK, this, this.login, [this.getComponent(login)]);
        }
        onOpened(options) {
            this.loginState = options ? options : null;
        }
        login(loginJS) {
            loginJS.login();
        }
    }

    class zhanji extends Laya.Script {
        onStart() {
            let that = this;
            Main$1.$LOG('组件信息：', this);
            this.initJS();
            console.log(this.owner.scene.url);
            myCenter.req('sceneUrl', (res) => {
                if (res == this.owner.scene.url)
                    that.getPageData();
            });
        }
        initJS() {
            let backJS = this.owner['diaLogMask'].getComponent(Back);
            backJS.initBack(0, 1);
        }
        getPageData() {
            HTTP.$request({
                that: this,
                url: '/M.Games.YDR.Ext/YDRRecord/RealTimeRecord',
                data: {
                    uid: Main$1.userInfo.userId,
                    roomid: myCenter.GameControlObj.roomId
                },
                success(res) {
                    console.log(res);
                    if (res.data.ret.type == 0) {
                        this.setPageData(res.data.data);
                    }
                    else {
                        Main$1.showTip(res.data.ret.msg);
                    }
                }
            });
        }
        setPageData(data) {
            Main$1.$LOG('获取实时战绩的表格1数据：', data);
            if (this.TimeID) {
                clearInterval(this.TimeID);
            }
            this.TimeID = setInterval(() => {
                data.end_time--;
                this.owner['roomLastTime'].text = Main$1.secondToDate(data.end_time);
                if (data.end_time == 0) {
                    clearInterval(this.TimeID);
                }
            }, 1000);
            this.owner['allDaiRuValue'].text = data.all_dairu;
            this.owner['allGetScore'].text = data.all_sf;
            setTimeout(() => {
                this.owner['weiGuanTitle'].width = this.owner['weiGuanTitle'].getChildAt(0).textWidth;
            });
            this.owner['weiGuanTitle'].text = '（' + data.onlooker.length + '）';
            this.setList1(data.dairu);
            this.setList2(data.onlooker);
        }
        setList1(data) {
            let list1 = this.owner['zhanjiList'];
            list1.visible = true;
            list1.vScrollBarSkin = "";
            list1.array = data;
            list1.renderHandler = new Laya.Handler(this, this.list1OnRender);
        }
        list1OnRender(cell, index) {
            let name = cell.getChildByName("name");
            let dairu = cell.getChildByName("dairu");
            let score = cell.getChildByName("score");
            name.text = cell.dataSource.nick;
            dairu.text = cell.dataSource.dairu;
            score.text = cell.dataSource.sf;
            if (parseInt(score.text) === 0) {
                score.color = '#935F13';
            }
            else if (score.text.indexOf('+') != -1) {
                score.color = '#c53233';
            }
            else if (score.text.indexOf('-') != -1) {
                score.color = '#599E73';
            }
        }
        setList2(data) {
            let list2 = this.owner['PersonList'];
            list2.visible = true;
            list2.vScrollBarSkin = "";
            list2.array = data;
            list2.renderHandler = new Laya.Handler(this, this.list2OnRender);
        }
        list2OnRender(cell, index) {
            let name = cell.getChildByName("name");
            let head = cell.getChildByName("headBg").getChildByName("head");
            Main$1.$LoadImage(head, cell.dataSource.head, Main$1.defaultData.head1, 'skin');
            name.text = cell.dataSource.nick;
        }
    }

    class Notice$1 extends Laya.Script {
        onStart() {
            this.registerEvent();
            myCenter.req('meOpen', (res) => {
                if (res == this.owner.scene.url)
                    this.selectThisTab(3);
            });
        }
        registerEvent() {
            this.owner['tab_title']._children.forEach((item, index) => {
                item.on(Laya.Event.CLICK, this, this.selectThisTab, [index + 1]);
            });
        }
        reloadNavSelectZT() {
            this.owner['tab_select']._children.forEach((item, index) => {
                item.visible = false;
            });
        }
        selectThisTab(pageNum) {
            this.reloadNavSelectZT();
            this.owner['tab_select'].getChildByName('s' + pageNum).visible = true;
            this.reqPageData(pageNum);
        }
        reqPageData(num) {
            console.log(num);
        }
    }

    class RegisterUI extends Laya.Script {
        constructor() {
            super(...arguments);
            this.flag = true;
        }
        onStart() {
            this.page = this.owner['pageData'].page;
            this.setPageData();
            this.initBack();
        }
        setPageData() {
            this.owner['title_1'].visible = this.page == Main$1.sign.register ? true : false;
            this.owner['title_2'].visible = this.page == Main$1.sign.changePwd ? true : false;
            this.owner['register_btn'].visible = this.page == Main$1.sign.register ? true : false;
            this.owner['change_btn'].visible = this.page == Main$1.sign.changePwd ? true : false;
        }
        initBack() {
            let backJS = this.owner['back_btn'].getComponent(Back);
            backJS.initBack(null, null, null, null, null, null, 'loginPage');
            return backJS;
        }
        comfirmRegisterOrChange() {
            let that = this;
            let user = this.owner['phone_value'].text;
            let pwd = this.owner['pwd_value'].text;
            let code = this.owner['code_value'].text;
            Main$1.showLoading(true);
            if (user == "") {
                this.flag = true;
                Main$1.showLoading(false);
                Main$1.showDiaLog('手机号不能为空！!');
                return;
            }
            else if (pwd == "") {
                this.flag = true;
                Main$1.showLoading(false);
                Main$1.showDiaLog('密码不能为空!');
                return;
            }
            else if (code == "") {
                this.flag = true;
                Main$1.showLoading(false);
                Main$1.showDiaLog('验证码不能为空!');
                return;
            }
            let data = {
                name: user,
                pws: pwd,
                code: code
            };
            if (this.page == Main$1.sign.changePwd) {
                data = {
                    name: user,
                    now: pwd,
                    code: code
                };
            }
            let url = this.page == Main$1.sign.register ? "/M.Acc/Register" : "/M.Acc/ModifyPws";
            HTTP.$request({
                that: this,
                url: url,
                data: data,
                success(res) {
                    if (res.data.ret.type == 0) {
                        this.flag = true;
                        Main$1.showLoading(false);
                        let data = {
                            user: user,
                            pwd: pwd,
                        };
                        if (Main$1.wxGame) {
                        }
                        else {
                            localStorage.setItem('userInfo', JSON.stringify(data));
                        }
                        if (this.page == Main$1.sign.register) {
                            Main$1.showDiaLog('注册成功,返回登录', 1, () => {
                                that.back();
                            });
                        }
                        else {
                            Main$1.showDiaLog('修改成功');
                        }
                    }
                    else {
                        this.flag = true;
                        Main$1.showLoading(false);
                        Main$1.showDiaLog(res.data.ret.msg);
                    }
                },
                fail() {
                    this.flag = true;
                    Main$1.showLoading(false);
                },
                timeout() {
                    this.flag = true;
                }
            });
        }
        back() {
            let backJS = this.initBack();
            backJS.back();
        }
    }

    class RegisterUI$1 extends Laya.Scene {
        onAwake() {
            this._RegisterJS = this.getComponent(RegisterUI);
            this['register_btn'].on(Laya.Event.CLICK, this, this.comfirmRegisterOrChange);
            this['change_btn'].on(Laya.Event.CLICK, this, this.comfirmRegisterOrChange);
        }
        onOpened(options) {
            this.pageData = options;
        }
        comfirmRegisterOrChange() {
            this._RegisterJS.comfirmRegisterOrChange();
        }
    }

    class MySwitch extends Laya.Script {
        constructor() {
            super(...arguments);
            this.callback = null;
            this.callbackThis = null;
            this.switchState = true;
        }
        onEnable() {
            this.bindEvent();
            this.initSwitch(null, true);
        }
        initSwitch(that, isSelect = true, callback) {
            this.callbackThis = that;
            this.callback = callback;
            let yes = this.owner.getChildByName("yes");
            yes.visible = isSelect ? true : false;
        }
        bindEvent() {
            this.owner.on(Laya.Event.CLICK, this, this.clickSwitch);
        }
        clickSwitch(Event) {
            Event.stopPropagation();
            let yes = this.owner.getChildByName("yes");
            yes.visible = !yes.visible;
            this.switchState = yes.visible;
            if (this.callback)
                this.callback.call(this.callbackThis, this.switchState);
        }
    }

    class Set extends Laya.Script {
        onStart() {
            this.initBack();
            this.setList();
            if (Main$1.wxGame)
                this.initPage();
        }
        initPage() {
        }
        initBack() {
            let backJS = this.owner['back'].getComponent(Back);
            backJS.initBack();
        }
        setList() {
            this.list = this.owner['ctList'];
            this.list.array = [
                { id: 1, label: 'res/img/common/set_text1.png' },
                { id: 2, label: 'res/img/common/set_text2.png' },
                { id: 3, label: 'res/img/common/set_text3.png', BanBenVal: '1.0.0' },
            ];
            this.list.renderHandler = new Laya.Handler(this, this.listRender);
            this.list.mouseHandler = new Laya.Handler(this, this.listSelect);
        }
        listRender(cell, index) {
            let label = cell.getChildByName('label');
            label.skin = cell.dataSource.label;
            if (cell.dataSource.id != 1) {
                let selectView = cell.getChildByName('selectView');
                selectView.removeSelf();
            }
            if (cell.dataSource.id == 1) {
                this.initSwitch(cell);
            }
            if (cell.dataSource.id != 2) {
                let goIconBox = cell.getChildByName('goIconBox');
                goIconBox.removeSelf();
            }
            if (cell.dataSource.id != 3) {
                let testBox = cell.getChildByName('testBox');
                testBox.removeSelf();
            }
            if (index == this.list.length - 1) {
                let line = cell.getChildByName('line');
                line.removeSelf();
            }
        }
        listSelect(Event, index) {
            if (Event.type == 'click') {
                let ID = Event.target.dataSource.id;
                if (ID == 2) {
                    Main$1.$openScene('aboutOur.scene', false, this.openDta, (res) => {
                        res.x = Laya.stage.width;
                        res.zOrder = 10;
                        Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage']);
                    });
                }
            }
        }
        initSwitch(cell) {
            let selectView = cell.getChildByName('selectView');
            let SwitchJS = selectView.getComponent(MySwitch);
            let gameMusicState = localStorage.getItem('gameMusic') ? localStorage.getItem('gameMusic') : 1;
            let isOpened = gameMusicState == 0 ? false : true;
            SwitchJS.initSwitch(this, isOpened, (bool) => {
                let isOpen = bool ? 1 : 0;
                localStorage.setItem('gameMusic', isOpen);
            });
        }
    }

    class Notice$2 extends Laya.Script {
        onStart() {
            this.owner['shareUrl'].text = 'http://132.232.34.32/ydr/?joinUserId=' + Main$1.userInfo.userId;
            this.initBack();
        }
        initBack() {
            let backJS = this.owner['back_btn'].getComponent(Back);
            const QRcode = document.getElementById('QRcode');
            backJS.initBack(null, null, null, null, null, null, null, (res) => {
                QRcode.classList.remove('QRcodeShow');
            });
        }
    }

    class sliderSelect extends Laya.Script {
        constructor() {
            super(...arguments);
            this.loadArrLength = 0;
            this.loadReturnArr = [];
        }
        onEnable() {
            this.getForm();
            if (Main$1.wxGame) {
            }
            this.getShareUserId();
            this.hideLoadingView();
        }
        getShareUserId() {
            let joinUserId = Main$1.GetUrlString('joinUserId');
            Main$1.familyRoomInfo.joinUserId = joinUserId ? joinUserId : 100000;
        }
        initPage() {
        }
        InitLaya() {
        }
        isAuto() {
        }
        setUser() {
        }
        getForm() {
        }
        getUserInfo() {
        }
        hideLoadingView() {
            if (!Main$1.wxGame)
                setTimeout(() => {
                    this.onLoading();
                }, 1000);
            else {
            }
        }
        onLoading() {
            this.addDiaLog();
            Main$1.beforeReloadResources(this, (res) => {
                this.dealWithBeforeLoadScene(res);
            });
            Main$1.createLoading(Main$1.loadingType.one);
            Main$1.createLoading(Main$1.loadingType.two);
            Main$1.createTipBox();
            Main$1.createDiaLog();
            this.loadArrLength = Main$1.loadScene.length;
        }
        addDiaLog() {
            Laya.stage.addChild(this.owner['diaLog']);
        }
        dealWithBeforeLoadScene(res) {
            let progress = this.owner['progressBg'].getChildByName('progress');
            this.loadReturnArr.push(res);
            let $loadRate = parseInt(String((this.loadReturnArr.length / this.loadArrLength) * 100));
            progress.width = this.owner['progressBg'].width * ($loadRate / 100);
            this.owner['loadRate'].text = $loadRate + '%';
            if ($loadRate >= 100) {
                this.owner['loadText'].text = '加载完成,祝您好运!';
                setTimeout(() => {
                    Laya.Scene.open('Login.scene', true);
                }, 500);
            }
        }
    }

    class OutDiaLog extends Laya.Script {
        constructor() {
            super(...arguments);
            this.maskAlpha = 0;
        }
        onAwake() {
            console.log(this);
            this.init1();
        }
        onStart() {
        }
        init1() {
            this.owner['visible'] = false;
            let mask = this.owner.getChildByName('diaLogMask');
            mask.alpha = this.maskAlpha;
            let pwdkeyboard = this.owner.getChildByName('pwdkeyboard');
            pwdkeyboard.bottom = -pwdkeyboard.height;
            this.registerEVENT('pwdkeyboard');
        }
        registerEVENT(nodeName) {
            let mask = this.owner.getChildByName('diaLogMask');
            mask.off(Laya.Event.CLICK);
            mask.on(Laya.Event.CLICK, this, this.clickMask, [nodeName]);
        }
        clickMask(nodeName) {
            switch (nodeName) {
                case 'pwdkeyboard':
                    let pwdkeyboard = this.owner.getChildByName('pwdkeyboard');
                    this.moveCoomon(false, pwdkeyboard, 'bottom', -pwdkeyboard.height);
                    break;
            }
        }
        open1() {
            this.owner['visible'] = true;
            let pwdkeyboard = this.owner.getChildByName('pwdkeyboard');
            this.moveCoomon(true, pwdkeyboard, 'bottom', 0);
        }
        moveCoomon(isOpen, moveNode, moveXYType, moveNum) {
            let moveType;
            switch (moveXYType) {
                case 'x':
                    moveType = { left: moveNum };
                    break;
                case 'bottom':
                    moveType = { bottom: moveNum };
                    break;
            }
            Laya.Tween.to(moveNode, moveType, Main$1.Speed['openDiaLogSpeed'], null, Laya.Handler.create(this, () => {
                if (!isOpen)
                    this.owner['visible'] = false;
            }));
        }
    }

    class PwdKeyBoard extends Laya.Script {
        constructor() {
            super(...arguments);
            this.pwd = '';
        }
        init(that, fn) {
            this.that = that;
            this.callback = fn;
            this.pwd = '';
            this.showPwd();
        }
        onAwake() {
            this.setKeyBoard();
        }
        setKeyBoard() {
            let list = this.owner.getChildByName('keyboardView').getChildByName('list');
            list.array = [
                { id: 1, icon: 'res/img/keyBoard/1.png' },
                { id: 2, icon: 'res/img/keyBoard/2.png' },
                { id: 3, icon: 'res/img/keyBoard/3.png' },
                { id: 4, icon: 'res/img/keyBoard/4.png' },
                { id: 5, icon: 'res/img/keyBoard/5.png' },
                { id: 6, icon: 'res/img/keyBoard/6.png' },
                { id: 7, icon: 'res/img/keyBoard/7.png' },
                { id: 8, icon: 'res/img/keyBoard/8.png' },
                { id: 9, icon: 'res/img/keyBoard/9.png' },
                { id: 10, icon: 'res/img/keyBoard/qc.png' },
                { id: 0, icon: 'res/img/keyBoard/0.png' },
                { id: 11, icon: 'res/img/keyBoard/return.png' },
            ];
            list.renderHandler = new Laya.Handler(this, this.listRender);
            list.mouseHandler = new Laya.Handler(this, this.listClick);
        }
        listRender(cell, index) {
            let text = cell.getChildByName('numBg').getChildByName('text');
            text.skin = cell.dataSource.icon;
        }
        listClick(Event) {
            if (Event.type == 'click') {
                let clickId = Event.target.dataSource.id;
                if (clickId != 10 && clickId != 11 && this.pwd.length < 6) {
                    this.pwd += clickId;
                    this.showPwd();
                }
                if (clickId == 10) {
                    this.pwd = '';
                    this.showPwd();
                }
                if (clickId == 11) {
                    this.pwd = this.pwd.substr(0, this.pwd.length - 1);
                    this.showPwd();
                }
            }
        }
        showPwd() {
            let pwdView = this.owner.getChildByName('pwdView').getChildByName('box');
            for (let i = 0; i < 6; i++) {
                let pwdIcon = pwdView.getChildAt(i).getChildByName('pwd');
                pwdIcon.visible = false;
            }
            for (let i = 0; i < this.pwd.length; i++) {
                let pwdIcon = pwdView.getChildAt(i).getChildByName('pwd');
                pwdIcon.visible = true;
            }
            if (this.callback && this.pwd.length >= 6) {
                this.callback.call(this.that, this.pwd);
            }
        }
    }

    class Me extends Laya.Script {
        onStart() {
            this.toScene = this.owner.scene;
            this.meList = this.owner.getChildByName('list_bg').getChildByName('list_bg2').getChildByName('me_list');
            myCenter.req('mePage', (res) => {
                if (res)
                    this.requestPageData();
            });
            this.ctHeight = this.owner.scene.me_content.height;
        }
        openThisPage() {
            if (this.owner['visible']) {
                this.UI = this.owner.scene;
                this.setPage();
                this.requestPageData();
                this.initOpenView();
            }
        }
        initOpenView() {
            let OpenEditJS = this.owner.scene.me_editBtn.getComponent(openView);
            OpenEditJS.initOpen(0, 'EditUserNews.scene', false, null, 0);
            this.owner.scene.addCoinBtn.on(Laya.Event.CLICK, this, () => {
                window.open('http://baidu.com');
            });
        }
        setPage() {
            Main$1.$LOG('我的页面==Main.familyRoomInfo.IsProm：', Main$1.familyRoomInfo, this.ctHeight);
            Main$1.meListData.forEach((item) => {
                if (item.id == 3) {
                    item.isShow = Main$1.familyRoomInfo.IsProm ? true : false;
                    if (item.isShow)
                        this.owner.scene.me_content.height = this.ctHeight;
                    else
                        this.owner.scene.me_content.height = this.ctHeight - 130;
                }
            });
            this.meList.array = Main$1.meListData.filter((item) => item.isShow);
            this.meList.renderHandler = new Laya.Handler(this, this.meListOnRender);
            this.meList.mouseHandler = new Laya.Handler(this, this.meListOnClick);
        }
        meListOnRender(cell, index) {
            let line = cell.getChildByName("line");
            line.visible = cell.dataSource.id == 6 ? false : true;
            let textImg = cell.getChildByName("textImg");
            textImg.skin = cell.dataSource.src;
        }
        meListOnClick(e) {
            if (e.type == 'click') {
                let clickId = e.target.dataSource.id;
                switch (clickId) {
                    case 1:
                        this.goRecord();
                        break;
                    case 2:
                        this.goCoinRecord();
                        break;
                    case 3:
                        this.goShare();
                        break;
                    case 4:
                        this.goGive();
                        break;
                    case 5:
                        this.goSet();
                        break;
                    case 6:
                        this.signOut();
                        break;
                }
            }
        }
        goRecord() {
            this.goPageCoomon('Record.scene');
        }
        goShare() {
            this.goPageCoomon('Share.scene');
        }
        goGive() {
            this.goPageCoomon('Give.scene');
        }
        goCoinRecord() {
            this.goPageCoomon('CoinRecord.scene');
        }
        goSet() {
            this.goPageCoomon('Set.scene');
        }
        goPageCoomon(url) {
            Main$1.$openScene(url, false, null, (res) => {
                res.x = Laya.stage.width;
                res.zOrder = 10;
                Laya.Tween.to(res, { x: 0 }, Main$1.Speed['changePage'], null, Laya.Handler.create(this, () => {
                    myCenter.send('meOpen', url);
                }));
                if (url === 'Share.scene') {
                    const QRcode = document.getElementById('QRcode');
                    QRcode.classList.add('QRcodeShow');
                }
            });
        }
        signOut() {
            Main$1.showDiaLog('是否退出重新登录?', 2, () => {
                Laya.Scene.open('login.scene', true, Main$1.sign.signOut);
            });
        }
        requestPageData() {
            HttpReqContent.getUserNews(this, (res) => {
                Main$1.$LOG('我页面数据：', res);
                let data = res.data;
                Main$1.$LoadImage(this.UI.headImg, data.head, Main$1.defaultData.head1, 'skin');
                this.UI.userNameValue.text = data.nick;
                this.UI.userIDValue.text = data.userId;
                this.UI.userScoreValue.text = data.score;
                this.UI.me_sex0.visible = data.sex == 0 ? true : false;
                this.UI.me_sex1.visible = data.sex == 1 ? true : false;
                Main$1.serviceUrl = data.service;
            });
        }
    }

    class GameHall extends Laya.Script {
        constructor() {
            super(...arguments);
            this._navType = {
                all: 1,
                small: 2,
                center: 3,
                big: 4
            };
            this._selectNavType = 1;
        }
        onAwake() {
            this.pageList = this.owner.scene.hall_list;
            this.registerEvent();
        }
        onEnable() {
            Main$1.$LOG('Hall游戏大厅脚本：', this);
        }
        openThisPage() {
            if (this.owner['visible']) {
                this.UI = this.owner.scene;
                this.selectThisTab(this.owner.scene.hall_nav_bg._children[0], 1);
                if (Main$1.hall['allowRepuest'])
                    Laya.timer.loop(60000, this, this.requestPageData, [false]);
            }
        }
        registerEvent() {
            this.owner.scene.hall_nav_bg._children.forEach((item, index) => {
                item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index]);
            });
        }
        reloadNavSelectZT() {
            this.owner.scene.hall_nav_bg._children.forEach((item, index) => {
                item.getChildByName("selectedBox").visible = false;
            });
        }
        selectThisTab(itemObj, pageNum) {
            this.reloadNavSelectZT();
            itemObj.getChildByName("selectedBox").visible = true;
            this._selectNavType = pageNum;
            this.requestPageData(true);
        }
        setPage1Data(data) {
            let page1List = this.UI.hall_list;
            page1List.vScrollBarSkin = "";
            page1List.array = data;
            page1List.renderHandler = new Laya.Handler(this, this.page1ListOnRender);
            page1List.mouseHandler = new Laya.Handler(this, this.rowOnClick);
            page1List.visible = true;
        }
        page1ListOnRender(cell, index) {
            let contentBg = cell.getChildByName("content_bg");
            let roomId = contentBg.getChildByName("roomID").getChildByName("value");
            roomId.text = cell.dataSource.roomid;
        }
        rowOnClick(Event, index) {
            if (Event.type == 'click') {
                let data = {
                    roomPws: Event.target.dataSource.roomPws,
                    page: Main$1.pages.page3
                };
                console.log(data);
                Main$1.$openScene('Game.scene', true, data, () => {
                    Main$1.hall.allowRepuest = false;
                });
            }
        }
        requestPageData(isShowLoading) {
            if (!Main$1.hall.allowRepuest)
                Laya.timer.clear(this, this.requestPageData);
            else {
                if (isShowLoading)
                    Main$1.showLoading(true);
                let data = {
                    uid: Main$1.userInfo.userId
                };
                HTTP.$request({
                    that: this,
                    url: '/M.Games.YDR/GetRoomList',
                    data: data,
                    success(res) {
                        Main$1.$LOG('获取大厅列表数据：', res);
                        if (isShowLoading)
                            Main$1.showLoading(false);
                        if (res.status) {
                            if (this.callFn) {
                                this.callFn('刷新成功');
                                this.callFn = null;
                                setTimeout(() => {
                                    this.dealWithResData(res.data.rooms);
                                }, 500);
                            }
                            else {
                                this.dealWithResData(res.data.rooms);
                            }
                            this.openGameView();
                        }
                        else {
                            Main$1.showDiaLog(res.data.ret.msg, 1);
                        }
                    },
                    fail() {
                        if (isShowLoading)
                            Main$1.showLoading(false);
                        Main$1.showDiaLog('网络异常!', 1);
                        if (this.callFn) {
                            this.callFn('刷新失败');
                            this.callFn = null;
                        }
                    }
                });
            }
        }
        openGameView() {
            let data = this.UI.pageData;
            if (data.roomPws && data.roomPws > 0) {
                Main$1.showLoading(true, Main$1.loadingType.three, '正在进入房间...');
                let pageData = {
                    roomPws: data.roomPws,
                    page: Main$1.pages.page3
                };
                Main$1.$openScene('cheXuanGame_8.scene', true, pageData, () => {
                    Main$1.showLoading(false, Main$1.loadingType.three, '');
                });
            }
        }
        dealWithResData(data) {
            let listData = data;
            let getYESdairudata = listData.filter((item) => item.dairu);
            let getNOdairudata = listData.filter((item) => !item.dairu);
            let getYESdairudata_pi = getYESdairudata.sort(this.compare('dizhu'));
            let getNOdairudata_pi = getNOdairudata.sort(this.compare('dizhu'));
            let getYESdairudata_pi_youkongwei = getYESdairudata_pi.filter((item) => item.participate > 0 && item.participate < item.number);
            let getYESdairudata_pi_yiman = getYESdairudata_pi.filter((item) => item.participate == item.number);
            let getYESdairudata_pi_kongfangjian = getYESdairudata_pi.filter((item) => item.participate == 0);
            let getYESdairudata_pi_lastData = (getYESdairudata_pi_youkongwei.concat(getYESdairudata_pi_yiman)).concat(getYESdairudata_pi_kongfangjian);
            let getNOdairudata_pi_youkongwei = getNOdairudata_pi.filter((item) => item.participate > 0 && item.participate < item.number);
            let getNOdairudata_pi_yiman = getNOdairudata_pi.filter((item) => item.participate == item.number);
            let getNOdairudata_pi_kongfangjian = getNOdairudata_pi.filter((item) => item.participate == 0);
            let getNOdairudata_pi_lastData = (getNOdairudata_pi_youkongwei.concat(getNOdairudata_pi_yiman)).concat(getNOdairudata_pi_kongfangjian);
            listData = getYESdairudata_pi_lastData.concat(getNOdairudata_pi_lastData);
            if (this._selectNavType == this._navType.all) {
                listData = listData;
                this.setPage1Data(listData);
            }
            else if (this._selectNavType == this._navType.small) {
                listData = listData.filter((item) => item.dizhu >= 1 && item.dizhu <= 5);
                this.setPage1Data(listData);
            }
            else if (this._selectNavType == this._navType.center) {
                listData = listData.filter((item) => item.dizhu >= 10 && item.dizhu <= 20);
                this.setPage1Data(listData);
            }
            else if (this._selectNavType == this._navType.big) {
                listData = listData.filter((item) => item.dizhu >= 50 && item.dizhu <= 100);
                this.setPage1Data(listData);
            }
        }
        compare(property, desc = true) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                if (desc == true) {
                    return value1 - value2;
                }
                else {
                    return value2 - value1;
                }
            };
        }
    }

    class Notice$3 extends Laya.Script {
        constructor() {
            super(...arguments);
            this._selectNavType = 0;
        }
        onAwake() {
            this.pageList = this.owner.getChildByName('content').getChildByName('page_bg').getChildByName('system_page').getChildByName('sysytem_list');
            this.registerEvent();
        }
        openThisPage() {
            if (this.owner['visible']) {
                this.selectThisTab(this.owner.scene.notice_tab._children[0], 0);
            }
        }
        registerEvent() {
            this.owner.scene.notice_tab._children.forEach((item, index) => {
                item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index]);
            });
        }
        reloadNavSelectZT() {
            this.owner.scene.notice_tab._children.forEach((item, index) => {
                item.getChildByName("selectedBox").visible = false;
            });
        }
        selectThisTab(itemObj, pageNum) {
            this.reloadNavSelectZT();
            itemObj.getChildByName("selectedBox").visible = true;
            this._selectNavType = pageNum;
            this.requestPageData();
        }
        requestPageData() {
            Main$1.showLoading(true);
            HTTP.$request({
                that: this,
                url: '/M.Lobby/Popularize/GetNoticeData',
                data: {
                    uid: Main$1.userInfo.userId,
                },
                success(res) {
                    Main$1.$LOG('获取公告数据:', res);
                    Main$1.showLoading(false);
                    this.setPage1(res);
                },
                fail(err) {
                    Main$1.showLoading(false);
                }
            });
        }
        setPage1(data) {
            this.pageList.visible = true;
            this.pageList.vScrollBarSkin = "";
            this.pageList.array = data.data.requestDatas;
            this.pageList.renderHandler = new Laya.Handler(this, this.meListOnRender);
            this.pageList.mouseHandler = new Laya.Handler(this, this.meListOnClick);
        }
        meListOnRender(cell, index) {
            console.log(cell);
            let textImg = cell.getChildByName("sysytem_content");
            textImg.skin = cell.dataSource.title;
        }
        meListOnClick(e) {
            if (e.type == 'click') {
                let clickId = e.target.dataSource.id;
            }
        }
    }

    class Wallet extends Laya.Script {
        constructor() {
            super(...arguments);
            this._selectNavType = 1;
            this.allowMoney = 0;
            this.isSetPwd = false;
            this.outType = 0;
        }
        onStart() {
        }
        onAwake() {
            this.registerEvent();
        }
        openThisPage() {
            if (this.owner['visible']) {
                console.log('进来wallet', this);
                this.selectThisTab(this.owner.scene.wallet_nav_bg._children[0], 1);
            }
        }
        registerEvent() {
            this.owner.scene.wallet_nav_bg._children.forEach((item, index) => {
                item.on(Laya.Event.CLICK, this, this.selectThisTab, [item, index + 1]);
            });
        }
        reloadNavSelectZT() {
            this.owner.scene.wallet_nav_bg._children.forEach((item, index) => {
                item.getChildByName("selectedBox").visible = false;
            });
        }
        selectThisTab(itemObj, pageNum) {
            this.reloadNavSelectZT();
            itemObj.getChildByName("selectedBox").visible = true;
            this._selectNavType = pageNum;
            this.changePages(pageNum);
        }
        changePages(num) {
            this.owner.scene.wallet_view_bg._children.forEach((item, index) => {
                item.visible = item.name.split('view')[1] == num ? true : false;
                if (item.name.split('view')[1] == num)
                    this.changePageData(num);
            });
        }
        changePageData(num) {
            switch (num) {
                case 1:
                    this.setView1Data();
                    break;
                case 2:
                    this.setView2Data();
                    break;
                case 3:
                    this.setView3Data();
                    break;
            }
        }
        setView1Data() {
            HttpReqContent.getUserNews(this, (res) => {
                Main$1.$LOG('设置提现页面数据：', res);
                let data = res.data;
                let userNewsView = this.owner.scene.wallets_view1.getChildByName('userNews');
                let head = userNewsView.getChildByName('headBg').getChildByName('head');
                let userId = userNewsView.getChildByName('userId').getChildByName('userIdVal');
                let userCoin = userNewsView.getChildByName('userCoin').getChildByName('userCoinVal');
                Main$1.$LoadImage(head, data.head, Main$1.defaultData.head1, 'skin');
                userId.text = data.userId;
                userCoin.text = data.score;
            });
        }
        setView2Data() {
            HttpReqContent.walletSearch(this, (res) => {
                Main$1.$LOG('钱包查询：', res);
                this.isSetPwd = res.data.IsPsw;
                this.allowMoney = res.data.Money;
                this.setView2Page();
            });
        }
        setView2Page() {
            let view2_1 = this.owner.scene.wallets_view2.getChildByName('view2_1');
            let view2_2 = this.owner.scene.wallets_view2.getChildByName('view2_2');
            let allowMoney = view2_2.getChildByName('allowOut').getChildByName('allowVal');
            allowMoney.text = this.allowMoney;
            view2_1.visible = false;
            view2_2.visible = false;
            view2_1.visible = this.isSetPwd ? false : true;
            view2_2.visible = this.isSetPwd ? true : false;
            if (!this.isSetPwd) {
                let setPwdBtn = view2_1.getChildByName('comfrimBtn');
                setPwdBtn.off(Laya.Event.CLICK);
                setPwdBtn.on(Laya.Event.CLICK, this, this.setPwdComfrim, [view2_1]);
            }
            else {
                let reqOutBtn = view2_2.getChildByName('btn');
                let inputView = view2_2.getChildByName('inputView');
                let name = inputView.getChildByName('view1').getChildByName('input');
                let cardNum = inputView.getChildByName('view2').getChildByName('input');
                let bankName = inputView.getChildByName('view3').getChildByName('input');
                let outPrice = inputView.getChildByName('view4').getChildByName('input');
                name.text = cardNum.text = bankName.text = outPrice.text = '';
                reqOutBtn.off(Laya.Event.CLICK);
                reqOutBtn.on(Laya.Event.CLICK, this, this.reqOut, [view2_2]);
            }
        }
        reqOut(view2_2) {
            let inputView = view2_2.getChildByName('inputView');
            let name = inputView.getChildByName('view1').getChildByName('input').text;
            let cardNum = inputView.getChildByName('view2').getChildByName('input').text;
            let bankName = inputView.getChildByName('view3').getChildByName('input').text;
            let outPrice = inputView.getChildByName('view4').getChildByName('input').text;
            if (Main$1.strIsNull(name)) {
                Main$1.showDiaLog('请您输入真实姓名!');
                return false;
            }
            else if (Main$1.strIsNull(cardNum)) {
                Main$1.showDiaLog('请您输入银行卡号!');
                return false;
            }
            else if (Main$1.strIsNull(bankName)) {
                Main$1.showDiaLog('请您输入银行名字!');
                return false;
            }
            else if (Main$1.strIsNull(outPrice)) {
                Main$1.showDiaLog('请您输入金额!');
                return false;
            }
            if (outPrice > this.allowMoney) {
                Main$1.showDiaLog('提现金额不能大于可用提现金额!');
                return false;
            }
            let diaLogJS = Laya.stage.getChildByName('diaLog').getComponent(OutDiaLog);
            diaLogJS.open1();
            let keyboardJS = Laya.stage.getChildByName('diaLog').getChildByName('pwdkeyboard').getComponent(PwdKeyBoard);
            keyboardJS.init(this, (val) => {
                let data = {
                    uid: Main$1.userInfo.userId,
                    psw: val,
                    money: outPrice,
                    type: this.outType,
                    username: name,
                    cardnumber: cardNum,
                    bankname: bankName
                };
                HttpReqContent.reqOutMoney(this, data, (res) => {
                    Main$1.$LOG('提现申请：', res);
                    diaLogJS.clickMask('pwdkeyboard');
                    Main$1.showDiaLog('提现申请成功!', 1, () => {
                        this.setView2Data();
                    });
                });
            });
        }
        setPwdComfrim(view2_1) {
            let pwd1Text = view2_1.getChildByName('inputView').getChildByName('input1').getChildByName('input').text;
            let pwd2Text = view2_1.getChildByName('inputView').getChildByName('input2').getChildByName('input').text;
            if (/^\d{6}$/.test(pwd1Text) && /^\d{6}$/.test(pwd2Text)) {
                if (pwd1Text === pwd2Text) {
                    let data = {
                        uid: Main$1.userInfo.userId,
                        psw: parseInt(pwd2Text)
                    };
                    HttpReqContent.setOutPwd(this, data, (res) => {
                        Main$1.$LOG('设置密码：', res);
                        Main$1.showDiaLog('设置成功!', 1, () => {
                            this.isSetPwd = true;
                            this.setView2Page();
                        });
                    });
                }
                else {
                    Main$1.showDiaLog('您输入的两次密码不相同!');
                }
            }
            else {
                Main$1.showDiaLog('请您输入6位数字密码!');
            }
        }
        setView3Data() {
            HttpReqContent.searchReqOutList(this, (res) => {
                Main$1.$LOG('查询申请提现列表：', res);
                let v3List = this.owner.scene.wallets_view3.getChildByName('tbodyView').getChildByName('v3List');
                v3List.visible = true;
                v3List.vScrollBarSkin = '';
                v3List.array = res.data.records;
                v3List.renderHandler = new Laya.Handler(this, this.v3ListRender);
            });
        }
        v3ListRender(cell, index) {
            let c1 = cell.getChildByName('c1');
            let c2 = cell.getChildByName('c2');
            let c3 = cell.getChildByName('c3');
            let c4 = cell.getChildByName('c4');
            c2.text = cell.dataSource.Money;
            c3.text = Main$1.getDate(null, cell.dataSource.RequestTime);
            switch (cell.dataSource.Type) {
                case 0:
                    c1.text = '银行卡';
                    break;
                case 1:
                    c1.text = '支付宝';
                    break;
                case 2:
                    c1.text = '微信';
                    break;
            }
            switch (cell.dataSource.State) {
                case 0:
                    c4.text = '申请中';
                    break;
                case 1:
                    c4.text = '审核中';
                    break;
                case 2:
                    c4.text = '已提现';
                    break;
            }
        }
    }

    class Friends extends Laya.Script {
        constructor() {
            super(...arguments);
            this.allHLNum = 0;
        }
        onStart() {
            this.initOpenView();
        }
        onAwake() {
            this.registerEvent();
        }
        openThisPage() {
            if (this.owner['visible']) {
                Main$1.$LOG('进来亲友圈friends', this, Main$1.familyRoomInfo);
                this.setPageView();
                if (Main$1.familyRoomInfo.IsJoin && Main$1.familyRoomInfo.IsProm)
                    this.reqPageData();
            }
        }
        setPageView() {
            this.owner.scene.f1_view0.visible = !Main$1.familyRoomInfo.IsProm ? true : false;
            this.owner.scene.f1_view1.visible = Main$1.familyRoomInfo.IsProm ? true : false;
            if (!Main$1.familyRoomInfo.IsProm) {
                let createBtn = this.owner.scene.f1_view0.getChildByName('createBtn');
                createBtn.off(Laya.Event.CLICK);
                createBtn.on(Laya.Event.CLICK, this, () => {
                    Main$1.showDiaLog('确定创建亲友圈?', 2, () => {
                        HttpReqContent.createFamily(this, (res) => {
                            Main$1.$LOG('创建亲友圈：', res);
                            Main$1.familyRoomInfo.IsProm = true;
                            this.openThisPage();
                        });
                    });
                });
            }
        }
        initOpenView() {
            let OpenViewJS1 = this.owner.scene.xq1.getComponent(openView);
            OpenViewJS1.initOpen(0, 'Friends.scene', false, 1, 0);
            let OpenViewJS2 = this.owner.scene.xq2.getComponent(openView);
            OpenViewJS2.initOpen(0, 'Friends.scene', false, 2, 0);
            let OpenViewJS3 = this.owner.scene.xq3.getComponent(openView);
            OpenViewJS3.initOpen(0, 'Friends.scene', false, 3, 0);
        }
        registerEvent() {
            this.owner.scene.tqhlBtn.on(Laya.Event.CLICK, this, this.tqhl);
        }
        tqhl() {
            if (this.allHLNum > 0)
                Main$1.showDiaLog('提取红利', 2, () => {
                    HttpReqContent.reqHLOut(this, (res) => {
                        Main$1.$LOG('红利提现申请：', res);
                        Main$1.showDiaLog('红利成功提现至钱包', 1, () => {
                            this.reqPageData();
                        });
                    });
                });
            else
                Main$1.showDiaLog('红利余额必须大于0才能提取!', 1);
        }
        reqPageData() {
            HttpReqContent.getFriendsNew(this, (res) => {
                Main$1.$LOG('获取亲友圈一级页面内容：', res);
                let data = res.data;
                this.allHLNum = data.Money;
                let view1 = this.owner.scene.f_view1.getChildByName('viewBox');
                let view2 = this.owner.scene.f_view2;
                let hlye = view1.getChildByName('hlShow');
                let allOutPrice = view1.getChildByName('ljtx').getChildByName('val');
                let zs = view2.getChildByName('v2_box1').getChildByName('zs').getChildByName('val');
                let jrxz = view2.getChildByName('v2_box1').getChildByName('jrxz').getChildByName('val');
                let ljsy = view2.getChildByName('v2_box2').getChildByName('ljsy').getChildByName('val');
                let jrxzM = view2.getChildByName('v2_box2').getChildByName('jrxz').getChildByName('val');
                let sqzje = view2.getChildByName('v2_box3').getChildByName('sqzje').getChildByName('val');
                let sbje = view2.getChildByName('v2_box3').getChildByName('sbje').getChildByName('val');
                let Money = String(data.Money);
                for (let i = 0; i < hlye._children.length; i++) {
                    let textVal = hlye.getChildAt(hlye._children.length - i - 1).getChildByName('val');
                    textVal.text = Money.substr(Money.length - 1 - i, 1);
                }
                allOutPrice.text = data.AllOutMoney;
                zs.text = data.MemberCount;
                jrxz.text = data.DayAddMemberCount;
                ljsy.text = data.AllAddMoney;
                jrxzM.text = data.DayAddMoney;
                sqzje.text = data.ReOutMoney;
                sbje.text = data.FailOutMoney;
            });
        }
    }

    class TabPageUI extends Laya.Scene {
        onAwake() {
            this.registerEvent();
            this.defaultPage = Main$1.pages.page3;
        }
        onOpened(options) {
            Main$1.$LOG('tab页面所收到的值：', options);
            this.pageData = options;
            this.selectedPage = options ? options.page ? options.page : this.defaultPage : this.defaultPage;
            this.openView(this.selectedPage, 0);
        }
        registerEvent() {
            let navList = this['tabNav']._children;
            navList.forEach((item) => {
                item.on(Laya.Event.CLICK, this, this.openView, [item.name, 100]);
            });
        }
        closeAllpages() {
            let allPages = this['pages']._children;
            allPages.forEach((item) => {
                item.visible = false;
            });
        }
        setCurrentTab(page, speed) {
            let navList = this['tabNav']._children;
            navList.forEach((item) => {
                item.top = 0;
                item.getChildByName('icon0').visible = false;
            });
            let thisTab = this['tabNav'].getChildByName(page);
            thisTab.top = -20;
            thisTab.getChildByName('icon0').visible = true;
        }
        openView(page, speed) {
            this.setCurrentTab(page, speed);
            Main$1.hall.allowRepuest = false;
            this.closeAllpages();
            this[page].visible = true;
            if (page === Main$1.pages.page5) {
                let MeJS = this[page].getComponent(Me);
                MeJS.openThisPage();
            }
            else if (page === Main$1.pages.page3) {
                Main$1.hall.allowRepuest = true;
                let HallJS = this[page].getComponent(GameHall);
                HallJS.openThisPage();
            }
            else if (page === Main$1.pages.page1) {
                let NoticeJS = this[page].getComponent(Notice$3);
                NoticeJS.openThisPage();
            }
            else if (page === Main$1.pages.page4) {
                let WalleteJS = this[page].getComponent(Wallet);
                WalleteJS.openThisPage();
            }
            else if (page === Main$1.pages.page2) {
                let FriendsJS = this[page].getComponent(Friends);
                FriendsJS.openThisPage();
            }
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("game/common/SetSceneWH.ts", SetSceneWH);
            reg("game/common/Back.ts", Back);
            reg("game/common/setHd.ts", setHd);
            reg("game/pages/TabPages/CoinRecord/CoinRecord.ts", CoinRecord);
            reg("game/pages/TabPages/Friends/Friends2/Friends2UI.ts", Friends2);
            reg("game/pages/TabPages/Friends/Friends2/Friends2.ts", Friends2$1);
            reg("game/GameCenter/GameUI.ts", GameUI);
            reg("game/common/setSceneWH.ts", SetSceneWH$1);
            reg("game/GameCenter/GameControl.ts", GameControl);
            reg("game/common/openView.ts", openView);
            reg("game/GameCenter/seat.ts", seat);
            reg("game/common/SetViewWH.ts", SetViewWH);
            reg("game/Fuction/OpenDiaLog.ts", OpenDiaLog);
            reg("game/common/SlideSelect.ts", SlideSelect);
            reg("game/common/MyClickSelect.ts", MyClickSelect);
            reg("game/pages/TabPages/GiveCoin/GiveCoin.ts", Notice);
            reg("game/pages/Login/LoginUI.ts", Login);
            reg("game/pages/Login/Login.ts", login);
            reg("game/pages/shishizhanji/ZhanJiGet.ts", zhanji);
            reg("game/pages/TabPages/Record/Record.ts", Notice$1);
            reg("game/pages/Register/RegisterUI.ts", RegisterUI$1);
            reg("game/pages/Register/Register.ts", RegisterUI);
            reg("game/pages/Set/Set.ts", Set);
            reg("game/common/MySwitch.ts", MySwitch);
            reg("game/pages/TabPages/Share/Share.ts", Notice$2);
            reg("game/Fuction/Start.ts", sliderSelect);
            reg("game/common/openOutDiaLog.ts", OutDiaLog);
            reg("game/common/outPwdKeyBoard.ts", PwdKeyBoard);
            reg("game/pages/TabPages/TabPageUI.ts", TabPageUI);
            reg("game/pages/TabPages/Me/Me.ts", Me);
            reg("game/pages/TabPages/GameHall/GameHall.ts", GameHall);
            reg("game/pages/TabPages/Notice/Notice.ts", Notice$3);
            reg("game/pages/TabPages/Wallet/Wallet.ts", Wallet);
            reg("game/pages/TabPages/Friends/Friends.ts", Friends);
        }
    }
    GameConfig.width = 1242;
    GameConfig.height = 2208;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Start.scene";
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
