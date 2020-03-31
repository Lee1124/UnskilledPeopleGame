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
    setOutPwd(that: any, data: any, callback: Function): void {
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
    reqOutMoney(that: any, data: any, callback: Function): void {
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
    searchReqOutList(that: any, callback: Function): void {
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

    /**
     * 获取基础信息（当用户登录后前端主动请求）
     * @param that 执行域
     * @param callback 回调函数
     */
    getUserInfoLogined(that: any, callback: Function) {
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.User/GetUserInfoLogined',
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
    * 加入某个推广员（即加入亲友团）
    * @param that 执行域
    * @param callback 回调函数
    */
    joinPromoter(that: any, data: any, callback: Function) {
        HTTP.$request({
            that: that,
            url: '/M.Prom/JoinPromoter',
            data: data,
            success(res: any) {
                if (res.data.ret.type == 0) {
                    callback.call(that, res);
                }
                // else {
                //     Main.showDiaLog(res.data.ret.msg);
                // }
            }
        })
    }
    /**
    * 获取亲友圈一级页面内容
    * @param that 执行域
    * @param callback 回调函数
    */
    getFriendsNew(that: any, callback: Function) {
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.Prom/GetPromoterFullInfo',
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
    * 创建亲友圈
    * @param that 执行域
    * @param callback 回调函数
    */
    createFamily(that: any, callback: Function) {
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.Prom/CreatePromoter',
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
    * 亲友圈-我的玩家
    * @param that 执行域
    * @param callback 回调函数
    */
    getMyPlayerNews(that: any, callback: Function) {
        Main.showLoading(true);
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.Prom/GetMyPlayerInfos',
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
    * 亲友圈-我的收益
    * @param that 执行域
    * @param callback 回调函数
    */
    getMyIncome(that: any, callback: Function) {
        Main.showLoading(true);
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.Prom/GetMyIncomeInfos',
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
   * 亲友圈-提现记录
   * @param that 执行域
   * @param callback 回调函数
   */
    getOutRecord(that: any, callback: Function) {
        Main.showLoading(true);
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.Prom/GetPromoterOutRecords',
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
   * 亲友圈-红利提现申请
   * @param that 执行域
   * @param callback 回调函数
   */
    reqHLOut(that: any, callback: Function) {
        Main.showLoading(true);
        let data: any = {
            uid: Main.userInfo.userId
        }
        HTTP.$request({
            that: that,
            url: '/M.Prom/RequestPromoterOut',
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
}
export default new HttpReq();