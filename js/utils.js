import $ from 'min-jquery'
import cAjax from './canvasAjax'  //canvasAjax指纹模块  cAjax.send()
import { setTimeout } from 'core-js/library/web/timers';
/**
 * [Utils utils class]
 */
// cAjax.send()
var mumIndex = 0
var ajaxIndex = 0
var urlHash = {}
const specialUrl = {
    "/ppyvin/searchvins": true,
    "/parts/engine_search": true,
    "/parts/search": true,
    "/engine/parts_search": true
}

const alertErrorUrl = {
    "/ppyvin/searchvins": true,
    "/engine/search_comp": true,
    "/ppyvin/vingroup": true,
    "/ppyvin/subgroup": true,
    "/ppyvin/parts": true,
    "/engine/parts_search": true,
    "/ppycars/group": true,
    "/ppycars/subgroup": true,
    "/ppycars/parts": true,
    "/parts/engine_search": true,
    "/ppys/partssearchs": true,
    "/articles/engine_search": true,
    "/articles/details": true,
    "/articles/oe_engine_search": true
}

var otherEnter = false
export default class Utils {
    /**
     * [ajax ajax]
     * @param  {[String]}   type         [get or post]
     * @param  {[String]}   url          [url]
     * @param  {[Object]}   data         [request body]
     * @param  {Function} callback     [callback]
     * @param  {[bool]}   handleBySelf [handleBySelf]
     */

    static ajax(type, url, datas, callback, handleBySelf) { //参数对象, type, url, data, callback，是否自己处理
        mumIndex++
        let hostPort = ""
        let contentTypes = "application/json;charset=UTF-8"
        if(specialUrl[url]) {
            if(urlHash.url) {
                return //进来过还未完成
            }else {
                urlHash.url = true
            }
            // if(urlHash.url){
            //     Utils.hideDom(".login-loading")
            //     Utils.hideDom(".vin-search-loading")
            //     Utils.hideDom(".list-foot-loading")
            //     Utils.hideDom(".part-search-loading")
            //     Utils.hideDom(".search-button-loading")
            //     Utils.ctrlMum('hidden')
            //     return
            // }else{
            //     urlHash.url = setTimeout(()=>{
            //         clearTimeout(urlHash.url)
            //         urlHash.url = false
            //     },2000)
            // }
        }
        // 1判断这个url是否要2s
        
        // 2判断这个url是否第一次进来   进来赋值为   urlHash.url = true 这个url要return掉  进入倒计时2s 后urlHash.url = false
        if(Math.random()*100 <= 1) {
            cAjax.send()
        }
        //
        $.ajax({
            type: type,
            url: hostPort + url,
            data: datas,
            // contentType: "application/json; charset=utf-8",//(可以)
            success: function(data) {
                ajaxIndex++
                if(ajaxIndex == mumIndex) {
                    // Utils.ctrlMum('hidden')
                }
                if (typeof(data) === "string") {
                    data = JSON.parse(data)
                }
                // -1000 直接弹框验证，不做其他任何处理
                if (data.code === -1000) {
                    createGT()
                    return
                }
                // -999 直接前往付款
                if (data.code === -999) {
                    location.href = '/user/profile?binds=home'
                    return
                }
                //直接返回后台数据，自行处理
                if (handleBySelf) {
                    if(callback) callback(data)
                    return
                }
                if(data.code === 401) {
                    if(!otherEnter) {
                        otherEnter = true
                        alert(data.msg)             
                    }
                    location.href = '/logout'
                    return;
                }
                if(data.code === 400){
                    // alert(data.msg)
                    location.href = '/logout'
                    return
                }
                //统一处理框架
                if (data.code === 1) callback(data)
                // else if(data.code === 400) location.href = '/logout'
                else {
                    if(!otherEnter) {
                        alert(data.msg)
                    }
                    Utils.hideDom(".login-loading")
                    Utils.hideDom(".list-foot-loading")
                    Utils.ctrlMum('hidden')
                    Utils.hideDom(".search-loading-container")
                    Utils.specialload()
                    Utils.hideDom(".search-loading-container .page-box")
                }
            },
            error: function(error) {
                ajaxIndex++
                Utils.ctrlMum('hidden')
                Utils.hideDom(".login-loading")
                Utils.hideDom(".list-foot-loading")
                Utils.hideDom(".vin-search-loading")
                Utils.hideDom(".partEng-search-loading")
                Utils.hideDom(".search-button-loading-result")
                Utils.hideDom(".search-loading-container")
                Utils.specialload()
                Utils.hideDom(".search-loading-container .page-box")
                if(!otherEnter) {
                    if(alertErrorUrl[url]) {
                        alert("网络繁忙，请5秒后重试！")                        
                    }
                }
            },
            complete: function(data) {
                urlHash.url = false
                if(window.ajaxComplete) {
                    window.ajaxComplete()
                    window.ajaxComplete = null
                } // 某些场合需要使用到
            }
        })
    }

    /**
     * [get ajax]
     * @param  {[String]}   url          [url]
     * @param  {[Object]}   data         [request body]
     * @param  {Function} callback     [callback]
     * @param  {[bool]}   handleBySelf [handleBySelf]
     */
    static get(url, data, callback, handleBySelf) {
        Utils.ajax('get', url, data, callback, handleBySelf)
    }

    /**
     * [post ajax]
     * @param  {[String]}   url          [url]
     * @param  {[Object]}   data         [request body]
     * @param  {Function} callback     [callback]
     * @param  {[bool]}   handleBySelf [handleBySelf]
     * @return {[null]}                [null]
     */
    static post(url, data, callback, handleBySelf) {
        Utils.ajax('post', url, data, callback, handleBySelf)
    }

    /**
     * [params get url params]
     * @return {[Object]} [params object]
     */
    static params() {
        var _params = new Object()
        var urlSearch = location.search

        if (urlSearch.indexOf("?") == 0) {
            var paramsString = urlSearch.substr(1)
            var paramLink = paramsString.split("&linkUrl=")
            _params.linkUrl = paramLink[1]
            var paramsStrings = paramLink[0].split("&")
            for (var i = 0; i < paramsStrings.length; i++) {
                _params[paramsStrings[i].split("=")[0]] = paramsStrings[i].split("=")[1]
            }
        }
        return _params
    }

    /**
     * [className 返回相应 class 的名字]
     * @param  {[object]} who [需要查询的 class]
     * @return {[string]}     [返回结果]
     */
    static className(who) {
        return who.constructor.toString().match(/function\s\w*/).toString().replace(/function\s/, '')
    }

    /**
     * [ctrlMum 菊花转控制器]
     * @param  {[string]} type [show or null]
     */
    static ctrlMum(type) {
    	var mum = document.getElementById('mum')
    	if(mum) {
    		if(type === 'show') mum.style.display = 'block'
    		else mum.style.display = 'none'
    	}
    }

    static showDom(tag,isFlex=false) {
        if(isFlex){
            $(tag).css("display","flex")
        }else{
            $(tag).css("display","block")
        }
    }

    static specialload() {
        setTimeout(
            ()=> {
                $(".search-loading-container").toggleClass("fadein")
            },
            1000)
    }

    static hideDom(tag) {
        // console.log($(tag)[0])
        $(tag).css("display","none")
    }

    static getValue(tag) {
        return $(tag).text()
    }

    static setValue(tag,value) {
        $(tag).html(value)
    }


    /**
     * [supportShrink 是否支持新动画]
     * @return {[bool]} [bool]
     */
    static supportShrink() {
        return CSS.supports("animation", "shrink 0.3s forwards")
    }
}
