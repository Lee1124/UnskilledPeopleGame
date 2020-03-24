/**
 * http请求的所有内容
 */
import HTTP from './HttpRequest';
import Main from './Main';
class HttpReq {
    /**
     * 获取玩家信息
     * @param that 执行域
     * @param callback 回调函数
     */
    getUserNews(that: any, callback: Function): void {
        let data: any = {
            uid: Main.userInfo.userId,
            // tuid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.User/GetInfo',
            data: data,
            success(res: any) {
                if (res.data.ret.type == 0) {
                    // this.setPageData(res.data);
                    callback.call(that, res);
                } else {
                    Main.showDiaLog(res.data.ret.msg);
                }
            }
        })
    }
    /**
     * 钱包查询
     * @param that 执行域
     * @param callback 回调函数
     */
    walletSearch(that: any, callback: Function): void {
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.WLT/GetWallet',
            data: data,
            success(res: any) {
                if (res.data.ret.type == 0) {
                    callback.call(that, res);
                } else {
                    Main.showDiaLog(res.data.ret.msg);
                }
            }
        })
    }

    /**
     * 设置提现密码
     * @param that 执行域
     * @param data 数据
     * @param callback 回调函数
     */
    setOutPwd(that: any,data:any,callback: Function):void{
        HTTP.$request({
            that: that,
            url: '/M.WLT/SetWalletPsw',
            data: data,
            success(res: any) {
                if (res.data.ret.type == 0) {
                    callback.call(that, res);
                } else {
                    Main.showDiaLog(res.data.ret.msg);
                }
            }
        })
    }

    /**
     * 提现申请
     * @param that 执行域
     * @param data 数据
     * @param callback 回调函数
     */
    reqOutMoney(that: any,data:any,callback: Function):void{
        Main.showLoading(true);
        HTTP.$request({
            that: that,
            url: '/M.WLT/RequestWalletOut',
            data: data,
            success(res: any) {
                Main.showLoading(false);
                if (res.data.ret.type == 0) {
                    callback.call(that, res);
                } else {
                    Main.showDiaLog(res.data.ret.msg);
                }
            }
        })
    }
    /**
     * 提现列表
     * @param that 执行域
     * @param callback 回调函数
     */
    searchReqOutList(that: any,callback: Function):void{
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.WLT/GetWalletOutRecords',
            data: data,
            success(res: any) {
                if (res.data.ret.type == 0) {
                    callback.call(that, res);
                } else {
                    Main.showDiaLog(res.data.ret.msg);
                }
            }
        })
    }
}
export default new HttpReq();