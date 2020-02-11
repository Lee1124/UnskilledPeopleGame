import Main from './Main';
import md5 from './md5'
class HttpRequest {
    /**
     * @param {*} obj.that 执行域
     * @param {*} obj.url 请求地址
     * @param {*} obj.data 请求数据
     * @param {*} obj.method 请求方式(暂时支持get和post)
     */
    $request(obj) {
        let that = obj.that;
        let xhr = new Laya.HttpRequest();
        let url = Main.requestApi + obj.url;
        let dataObj = obj.data;
        let postData = '';
        let method = obj.method ? obj.method : 'get';
        let dataObjArr = [];
        if (method == 'get') {
            var timestamp = new Date().getTime();
            let sstr = "";
            if(Main.userInfo){
                sstr = Main.userInfo.key + '&' + timestamp;
                // Main.$LOG('请求里面key:',Main.userInfo.key);
            }
            for (var key in dataObj) {
                if (dataObj.hasOwnProperty(key)) {
                    dataObjArr.push(key);
                    if (dataObjArr.length == 1) {
                        url = url + '?' + key + '=' + dataObj[key];
                    } else {
                        url = url + '&' + key + '=' + dataObj[key];
                    }

                    sstr += "&" + dataObj[key];
                }
            }

            //{"user":"1236555","pwd":"1","userId":5986855,"key":3009340712064337000,"inRoomPws":101823}
            if (Main.userInfo) {
                url += '&t=' + timestamp;
                Main.$LOG("md5："+ sstr + " key:" + Main.userInfo.key);
                url += '&sign=' + md5.md5(sstr);
            }

        } else if (method == 'post') {
            for (var key in dataObj) {
                if (dataObj.hasOwnProperty(key)) {
                    dataObjArr.push(key);
                    if (dataObjArr.length == 1) {
                        postData = key + '=' + dataObj[key];
                    } else {
                        postData += '&' + key + '=' + dataObj[key];
                    }
                }
            }
        }
        xhr.http.timeout = 10000;//设置超时时间;
        xhr.http.ontimeout = function () {
            Main.showLoading(false);
            Main.showDiaLog('请求超时,稍后再试!');
            if (obj.timeout)
                obj.timeout.call(that,'请求超时,稍后再试!');
        }
        xhr.once(Laya.Event.COMPLETE, this, (res) => {
            if (!res.status) {
                Main.$ERROR('冲突登录:', res);
                if (res.code == 1003 || //参数错误
                    res.code == 1004) //签名验证失败
                {
                    Main.showDiaLog('登录失效，请重新登录', 1, () => {
                        Main.hideAllLoading();
                        Laya.Scene.open('login.scene', true, Main.sign.signOut);
                    });
                }
                return;
            }
            obj.success.call(that, res)
        });
        xhr.once(Laya.Event.ERROR, this, (err) => {
            Main.$ERROR('请求异常:', err);
            Main.showDiaLog('网络异常');
            if (obj.fail)
                obj.fail.call(that, err)
        });
        xhr.once(Laya.Event.PROGRESS, this, (ess) => {
            Main.$ERROR('PROGRESS:', ess);
            if (obj.ess)
                obj.ess(ess)
        });
        xhr.send(url, postData, method, 'json');
    }
}
export default new HttpRequest();