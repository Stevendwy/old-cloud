import React from 'react'
import PropTypes from 'prop-types'
import Root from './root'
import VIN from './vin/vin'
import Car from './car'
import Part from './part/part'
import Utils from './utils'
import ShoppingCart from './shoppingcart'
import ShareForm from "./shareform"
import PriceMenu from "./pricemenu/price_menu"
import PartEng from "./parteng/parteng"
import {CarMI} from './vin/car_info'
export default class Content extends Root {
    constructor(props) {
        super(props)
        this.state = {
            towhere:'', //选择调往 续费还是 消息
            inid: "", //message inid
            okMessage: "",
            // okMessage: "由于网络原因，宝马数据正在维护，请3个小时候重试谢谢。请3个小时候重试谢谢。请3个小时候重试谢谢。请3个小时候重试谢谢。请3个小时候重试谢谢。飞机爱疯骄傲ijgaoij",                        
            headerTitle: "",
            okshow: "none",
            listData: null,
            shareShow: false,
            uid: "",    
            showMI: false,
            miData: null
        }
        $(".inquires a").children().css("fontWeight", "normal")
        // $("#_" + props.type).css("borderBottom", "3px solid #000").children().css("fontWeight", "bold")
        $("#_" + props.type).children().css("fontWeight", "bold")
        this.topWayHeight = "0px"
    }

    componentDidMount() {
        let _ajaxtype = {
            "size": 1,
            "page": 1,
            "message_type": "popup",
            "unread": 1
        }
        
        Utils.get("/user/msglocal", _ajaxtype, responses => {
            //判断是否过期弹框 目前默认none
            let _datalist = []
            let _datainid = []
            let _dataaction = []
            let _dataTitle = []
            let _resdata = responses.data
            if (_resdata.length >= 1) {
                for (var i = 0; i < _resdata.length; i++) {
                    _datalist.push(_resdata[i].msg_text)
                    _datainid.push(_resdata[i].inid)
                    _dataTitle.push(_resdata[i].title)
                    _dataaction.push(_resdata[i].action)
                }
                if(localStorage.getItem("update") == 4) {
                    this.topWayHeight = "0px"
                } else {
                    this.topWayHeight = "138px"                    
                }
                if (_datalist.length >= 1) {
                    this.setState({
                        towhere:_dataaction[0],
                        inid: _datainid[0],
                        headerTitle: _dataTitle[0],
                        okMessage: _datalist[0],
                        okshow: "block"
                    })
                }
            }
        })
        window.showCarMI = this.showCarMI.bind(this)
        // document.addEventListener("click",()=>{
        //     console.log("rrrr")
        // })
    }

    showCarMI(data) {
        if(data.data.length == 0) {
            this.setState({
                showMI: false
            })
        } else {
            this.setState({
                showMI: true,
                miData: data
            })
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            showMI: false
        })
    }

    getPriceMenuList(){
        Model.priceMenu(res => {
            this.setState({
                listData: res
            })
        })
    }

    redmessage(type) {
        let _urlread = "/user/msglocalread"
        let _data = {
            "inid": this.state.inid
        }
        Utils.get(_urlread, _data, res => {
            // console.log("readmes")
        })
        if (type == "messages") {
            if (this.state.towhere == "home") {
                location.href = "/user/profile?binds=home" 
            }else{
               location.href = "/user/profile?binds=search&type=messages" 
            }
        }
        this.setState({
            okshow: "none"
        })
    }

    closeClick() {
        this.setState({listData: null})
    }

    submitPriceMenu(priceMenu) {
        let obj = JSON.stringify(priceMenu)
        let _this = this
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/quotes/quotes/submit",
            "method": "POST",
            "headers": {
              "content-type": "application/json",
              "cache-control": "no-cache"
            },
            "processData": false,
            "data":obj,
            "type":"post"
        }

        $.ajax(settings).done(function(res) {
            if(res.code == 1){
                if(window.hiddenCartClear){
                    window.hiddenCartClear()
                }
                _this.setState({
                    shareShow: true,
                    listData: null,
                    uid: res.uid
                })
            }else{
                alert(res.msg)
            }
        });
    }

    getPriceMenu() {
        if(this.state.listData) return (
         <PriceMenu
            headerItems={['序号', '零件名称', '零件号', '类型', '数量', '单价']}
            closeClick={this.closeClick.bind(this)}
            initialData={this.state.listData}
            submitPriceMenu={this.submitPriceMenu.bind(this)}/>
        )
    }

    hiddenShare() {
        this.setState({
            shareShow: false
        })
    }

    getContent() {
        let _content = null
        let _type = this.props.type
        switch(_type) {
            case 'vin': _content = <VIN type={_type} />
            break
            case 'car': _content = <Car type={_type} />
            break
            case 'part': _content = <Part type={_type} />
            break
            case 'partEng': _content = <PartEng typr={_type} />
            break
        }
        return _content
    }
    hiddenMI() {
        this.setState({
            showMI: false
        })
    }

    closeNewMsg() {
        let _urlread = "/user/msglocalread"
        let _data = {
            "inid": this.state.inid
        }
        Utils.get(_urlread, _data, res => {
            // console.log("readmes")
        })
        this.setState({
            okshow: "none"
        })
    }
    readMsgAndLoop() {
        let _urlread = "/user/msglocalread"
        let _data = {
            "inid": this.state.inid
        }
        Utils.get(_urlread, _data, res => {
            // console.log("readmes")
        })
        location.href = "/user/profile?binds=search&type=messages"
    }

    render() {
        let _type = this.props.type
        let _okshow = this.state.okshow
        let _hasMessages = this.state.hasMessages
        let _okmessage = this.state.okMessage
        let _shareForm = this.state.shareShow ? <ShareForm hidden={this.hiddenShare.bind(this)} uid={this.state.uid}/> : null

        return (
            <div className={this.props.show ? 'container-content' : 'container-content hidden'}>
                {this.getContent()}
                {/* <div className="okFatherSearch" style={{display:_okshow}}>
                    <div className="okContentMoveSearch">
                        <div className="okMessageClose" onClick={this.redmessage.bind(this,"none")}></div>
                        <div className="okMessageSearch">{_okmessage}</div>
                        <div className="okFooterLeftSearch" onClick={this.redmessage.bind(this,"none")}>取消</div>
                        <div className="okFooterRightSearch"  onClick={this.redmessage.bind(this,"messages")}>查看详情</div>
                    </div>
                </div> */}
                <div className="new-msg-container" style={{display: _okshow, top: this.topWayHeight}}>
                    <div className="new-msg-title">
                        <b>{this.state.headerTitle}</b>
                    </div>
                    <div className="new-msg-main">
                        {_okmessage}
                    </div>
                    <div className="new-msg-footer">
                        <a onClick={this.readMsgAndLoop.bind(this)}>查看详情</a>
                    </div>
                    <span className="new-msg-close" onClick={this.closeNewMsg.bind(this)}>
                        <img src="/img/icon_close_black.png" alt="关闭"/>
                    </span>
                </div>
                <ShoppingCart getPriceMenuList={this.getPriceMenuList.bind(this)}/>
                {this.getPriceMenu()}
                {/* <ShareForm/> */}
                {_shareForm}
                {
                    this.state.showMI 
                    ? <CarMI
                        isShow = {this.state.showMI}
                        data = {this.state.miData}
                        hiddenMI = {this.hiddenMI.bind(this)}
                      />
                    : null
                }
            </div>
        )
    }
}

Content.propTypes = {
    type: PropTypes.string.isRequired
}

class Model {
    static priceMenu(callback){
        Utils.get("/quotes/quotes/make","",res=>{
            callback(res)
        })
    }
    static submitPrice(obj,callback){
        Utils.post("/quotes/quotes/submit",obj,res=>{
            callback(res)
        })
    }


}
