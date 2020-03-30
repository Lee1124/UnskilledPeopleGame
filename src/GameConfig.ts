/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import SetSceneWH from "./game/common/SetSceneWH"
import Back from "./game/common/Back"
import setHd from "./game/common/setHd"
import CoinRecord from "./game/pages/TabPages/CoinRecord/CoinRecord"
import Friends2UI from "./game/pages/TabPages/Friends/Friends2/Friends2UI"
import Friends2 from "./game/pages/TabPages/Friends/Friends2/Friends2"
import GameUI from "./game/GameCenter/GameUI"
import setSceneWH from "./game/common/setSceneWH"
import GameControl from "./game/GameCenter/GameControl"
import openView from "./game/common/openView"
import seat from "./game/GameCenter/seat"
import SetViewWH from "./game/common/SetViewWH"
import OpenDiaLog from "./game/Fuction/OpenDiaLog"
import SlideSelect from "./game/common/SlideSelect"
import MyClickSelect from "./game/common/MyClickSelect"
import LoginUI from "./game/pages/Login/LoginUI"
import Login from "./game/pages/Login/Login"
import ZhanJiGet from "./game/pages/shishizhanji/ZhanJiGet"
import RegisterUI from "./game/pages/Register/RegisterUI"
import Register from "./game/pages/Register/Register"
import Set from "./game/pages/Set/Set"
import MySwitch from "./game/common/MySwitch"
import Start from "./game/Fuction/Start"
import openOutDiaLog from "./game/common/openOutDiaLog"
import outPwdKeyBoard from "./game/common/outPwdKeyBoard"
import TabPageUI from "./game/pages/TabPages/TabPageUI"
import Me from "./game/pages/TabPages/Me/Me"
import GameHall from "./game/pages/TabPages/GameHall/GameHall"
import Notice from "./game/pages/TabPages/Notice/Notice"
import Wallet from "./game/pages/TabPages/Wallet/Wallet"
import Friends from "./game/pages/TabPages/Friends/Friends"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1242;
    static height:number=2208;
    static scaleMode:string="fixedwidth";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Start.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("game/common/SetSceneWH.ts",SetSceneWH);
        reg("game/common/Back.ts",Back);
        reg("game/common/setHd.ts",setHd);
        reg("game/pages/TabPages/CoinRecord/CoinRecord.ts",CoinRecord);
        reg("game/pages/TabPages/Friends/Friends2/Friends2UI.ts",Friends2UI);
        reg("game/pages/TabPages/Friends/Friends2/Friends2.ts",Friends2);
        reg("game/GameCenter/GameUI.ts",GameUI);
        reg("game/common/setSceneWH.ts",setSceneWH);
        reg("game/GameCenter/GameControl.ts",GameControl);
        reg("game/common/openView.ts",openView);
        reg("game/GameCenter/seat.ts",seat);
        reg("game/common/SetViewWH.ts",SetViewWH);
        reg("game/Fuction/OpenDiaLog.ts",OpenDiaLog);
        reg("game/common/SlideSelect.ts",SlideSelect);
        reg("game/common/MyClickSelect.ts",MyClickSelect);
        reg("game/pages/Login/LoginUI.ts",LoginUI);
        reg("game/pages/Login/Login.ts",Login);
        reg("game/pages/shishizhanji/ZhanJiGet.ts",ZhanJiGet);
        reg("game/pages/Register/RegisterUI.ts",RegisterUI);
        reg("game/pages/Register/Register.ts",Register);
        reg("game/pages/Set/Set.ts",Set);
        reg("game/common/MySwitch.ts",MySwitch);
        reg("game/Fuction/Start.ts",Start);
        reg("game/common/openOutDiaLog.ts",openOutDiaLog);
        reg("game/common/outPwdKeyBoard.ts",outPwdKeyBoard);
        reg("game/pages/TabPages/TabPageUI.ts",TabPageUI);
        reg("game/pages/TabPages/Me/Me.ts",Me);
        reg("game/pages/TabPages/GameHall/GameHall.ts",GameHall);
        reg("game/pages/TabPages/Notice/Notice.ts",Notice);
        reg("game/pages/TabPages/Wallet/Wallet.ts",Wallet);
        reg("game/pages/TabPages/Friends/Friends.ts",Friends);
    }
}
GameConfig.init();