/**
 * 设置聊天的内容
 */
import Main from '../common/Main';
import MyClickSelect from '../common/MyClickSelect';
import websoket from '../Fuction/webSoketSend';
import MyCenter from '../common/MyCenter';
import OpenDiaLog from '../Fuction/OpenDiaLog';
class setChat {
    //选中项(0.代表表情，1.代表文字聊天)
    selectedNum: number = 0;
    //右边选项列表
    selectList: any;
    //表情聊天列表
    expressionList: any;
    //文字聊天列表
    textChatList:any[]=[];
    //前一个文本的高度
    preTextH:number=0;
    //thisUI;
    thisUI:any;
    init(thisUI: any): void {
        // this.initCommon();
        this.thisUI=thisUI;
        this.initSelectList(thisUI);
        this.initExpressionList(thisUI);
        this.initClickSelect(thisUI);
        this.initShow(thisUI);
        this.initTextChatContent(thisUI);
        this.initTextChatSend(thisUI);
    }

    initCommonLabel(name:string,msg:string):void{
        let chatCt:any=new Laya.Label();
        chatCt.name=name;
        chatCt.align='middle';
        chatCt.fontSize=40;
        chatCt.color='#FFFFFF';
        chatCt.wordWrap=true;
        chatCt.left=0;
        chatCt.right=0;
        chatCt.text=msg;
        chatCt.leading=5;
        chatCt.y=this.preTextH;
        return chatCt;
    }

    /**初始化文字聊天的发送 */
    initTextChatSend(thisUI: any):void{
        let textValue:any=thisUI.chat.getChildByName('textChatView').getChildByName('textView').getChildByName('textValue');
        let sendBtn:any=thisUI.chat.getChildByName('textChatView').getChildByName('textView').getChildByName('sendBtn');
        sendBtn.off(Laya.Event.CLICK);
        sendBtn.on(Laya.Event.CLICK,this,()=>{
            websoket.chatReq(2, String(textValue.text), 2);
            textValue.text='';
        });
    }

    /**初始化文本聊天的内容 */
    initTextChatContent(thisUI: any):void{
        let sendTextView:any=thisUI.chat.getChildByName('textChatView').getChildByName('textView').getChildByName('textValue');
        sendTextView.text='';
        let textShowView:any=thisUI.chat.getChildByName('textChatView').getChildByName('textShowView');
        textShowView.vScrollBarSkin = "";
        this.textChatList.forEach((item:any,index:number)=>{
            let nameIndex:string=item.name+index;
            if(textShowView.getChildByName(nameIndex)){
                this.preTextH=textShowView.getChildByName(nameIndex).y+textShowView.getChildByName(nameIndex).displayHeight+30;
            }else{
                let returnChatCt:any=this.initCommonLabel(nameIndex,item.name+'：'+item.content);
                textShowView.addChild(returnChatCt);
                this.preTextH+=returnChatCt.displayHeight+30;
                setTimeout(()=>{
                    textShowView.vScrollBar.value=textShowView.vScrollBar.max;
                },100)
            }
        })
    }

    playerTextChat(data: any):void{
        this.textChatList.push({name:data.senderName,content:data.chat.content});
        this.initTextChatContent(this.thisUI);
    }

    /**初始化选项 */
    initClickSelect(thisUI: any): void {
        let MeArr:any=MyCenter.GameControlObj.players.filter((item:any)=>item.IsMe);
        this.selectedNum=MeArr.length>0?this.selectedNum:1;
        let selectJS: any = thisUI.chat.getChildByName('selectView').getComponent(MyClickSelect);
        selectJS.MySelect(this, this.selectedNum, (val: any) => {
            this.selectedNum = val;
            this.initShow(thisUI);
        })
    }

    /**初始化显示 */
    initShow(thisUI: any): void {
        let expressionView: any = thisUI.chat.getChildByName('expressionChatView');
        expressionView.visible = this.selectedNum == 0 ? true : false;
        let textChatView:any=thisUI.chat.getChildByName('textChatView');
        textChatView.visible = this.selectedNum == 1 ? true : false;
    }

    /**
     * 初始化有关于选项的
     */
    initSelectList(thisUI: any): void {
        this.selectList = thisUI.chat.getChildByName('selectView').getChildByName('selectList');
        this.selectList.array = [{ value: 0, icon: 'res/img/common/chat_icon1.png' }, { value: 1, icon: 'res/img/common/chat_icon2.png' }];
        this.selectList.renderHandler = new Laya.Handler(this, this.selectListOnRender);
    }

    selectListOnRender(cell: any, index: number): void {
        let iconBox: any = cell.getChildByName('listRow').getChildByName('select').getChildByName('no');
        iconBox.loadImage(cell.dataSource.icon);
    }

    /**
     * 初始化有关于表情的
     */
    initExpressionList(thisUI: any): void {
        this.expressionList = thisUI.chat.getChildByName('expressionChatView').getChildByName('expressionList');
        this.expressionList.array = Main.expressionChat;
        this.expressionList.vScrollBarSkin = "";
        this.expressionList.renderHandler = new Laya.Handler(this, this.expressionListOnRender);
        this.expressionList.mouseHandler = new Laya.Handler(this, this.expressionListOnClick);
        this.expressionList.visible = true;
    }

    expressionListOnRender(cell: any, index: number): void {
        let iconBox: any = cell.getChildByName('icon');
        iconBox.loadImage(cell.dataSource.icon);
    }

    expressionListOnClick(Event: any) {
        if (Event.type == 'click') {
            let MeArr:any=MyCenter.GameControlObj.players.filter((item:any)=>item.IsMe);
            if(MeArr.length>0){
                let chatJS: any = MyCenter.GameControlObj.owner['chat'].getComponent(OpenDiaLog);
                chatJS.close();
                let ID = Event.target.dataSource.id;
                websoket.chatReq(1, String(ID), ID);
            }else{
                Main.showTip('您处于观战模式,不能发送表情!');
            }
        }
    }

    /**
     * 设置玩家表情聊天内容
     * @param thisJS 
     * @param data 
     */
    playerChat(thisJS: any, data: any): void {
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
            //播放Animation动画
            ani.play();
            thisJS.aniTimeID = setTimeout(() => {
                let thisAni = gifBox.getChildByName('expressionAni');
                if (thisAni) {
                    thisAni.removeSelf();
                }
                gifBox.visible = false;
                clearTimeout(thisJS.aniTimeID);
            }, 4000)
        }
    }
}
export default new setChat();