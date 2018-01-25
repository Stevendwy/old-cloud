import React from 'react'
import Root from '../root'
import Utils from '../utils'
import $ from 'min-jquery'
import Login from './login'
import VerificationCode from 'verification-code-react'
import RegistUserAgreement from './registagreement'
export default class Activity extends Root {
    constructor(props){
        super(props)
        this.state = {
            showArray: props.haveLogin ? [0,1,0] : [1,0,0],
            resultType:"",
            enterIn: props.haveLogin ? "login" : ""
        }
    }

    login(form) {
        Model.login(form,res=>{
            this.setState({
                showArray: [0, 1, 0],
                enterIn: "login"
            })
        })
    }

    toPayPanel(){
        this.setState({
            showArray: [0,1,0]
        })
    }
    registSucc(){
        this.setState({
            showArray: [0, 1, 0],
            enterIn: "regist"
        })
    }

    showResult(type){
        this.setState({
            showArray:[0, 0, 1],
            resultType: type
        })
    }

    render() {
        let registShow = this.state.showArray[0] ? "flex" : "none"
        let payShow = this.state.showArray[1] ? "flex" : "none" 
        let resultShow = this.state.showArray[2] ? "flex" : "none" 
        let _actcode = this.props.actcode
        return (
            <div className='container-activity'>
                <img className='activity-logo' src='/img/p_autumn.png' />
                <span className='activity-remind'>2017年9月8日起至9月30日止，凡通过零零汽官网购买/续费全品牌年卡的用户，即可额外获赠一年使用期！</span>
                <div className='activity-rules'>
                    活动规则：<br />
                    1、活动时间：2017年9月8日0:00至9月30日24:00；<br />
                    2、活动对象：通过零零汽官网购买或续费的用户；<br />
                    3、活动范围：仅针对2800元的零零汽全品牌年卡，全品牌年卡目前覆盖20个汽车品牌（详见官网说明）。
                </div>
                <div className='activity-account'>
                    <div className="container-regist" style={{display: registShow}}>
                        <Account
                            registSucc = {this.registSucc.bind(this)}
                            login={this.login.bind(this)}/>
                        <Remind />
                    </div>
                    <div className="container-pay" style={{display: payShow}}>
                        <PayPanel showResult={this.showResult.bind(this)}/>                    
                        <RemindRegist enterIn={this.state.enterIn}/>
                    </div>
                    <div className="container-result" style={{display: resultShow}}>
                        <CallBackResult 
                            type = {this.state.resultType}
                            toPayPanel={this.toPayPanel.bind(this)}
                        />
                    </div>
                    <span>
                        {_actcode}
                    </span>
                </div>
            </div>
        )
    }
}

class CallBackResult extends Root {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    
    login(){

    }

    hideResult(){
        this.props.toPayPanel()
    }

    toSupport(){

    }

    render(){
        let isSucc = this.props.type == "succ"
        return(
            <div className="result-container">
                <div className="result-success" style={{display:isSucc ? "flex":"none"}}>
                    <p className="result-title">支付成功！</p>
                    <p>恭喜您获得零零汽全品牌查询两年的使用权限！</p>
                    <img src="/img/p_s.png"/>
                    <div className="button" onClick={this.login.bind(this)}>
                        立即使用
                    </div>                    
                </div>
                <div className="result-error" style={{display: isSucc ? "none" : "flex"}}>
                    <p className="result-title">支付失败！</p>
                    <p>已成功支付，却没有开通！<span onClick={this.toSupport.bind(this)}>获取支持和服务</span></p>
                    <img src="/img/p_f.png"/>
                    <div className="button" onClick={this.hideResult.bind(this)}>
                        重新支付
                    </div>
                </div>
            </div>


        )
    }

}


class Account extends Root {
    constructor() {
        super()
        this.state = {
            selectedRadioIndex: 0,
            loginShow: false, // 显示登录组件
            restart: false, // 验证重新获取
            agreeShow: false
        }
        this.types = ['汽配商', '维修厂', '4S店', '其他']
        this.type = '汽配商'
    }

    regist(){
        let phone = this.refs.phone.value
        let username = this.refs.username.value
        let textCode = this.refs.textCode.value
        let comname = this.refs.comname.value
        let checkbox = this.refs.checkbox
        if(!phone){
            return
        }
        if(!(/^1[34578]\d{9}$/.test(phone))){ 
            alert("手机号码有误，请重填");  
            return
        }
        if(!textCode){
            alert("请输入验证码")
            return
        }
        if(username.length == 0){
            alert("请输入用户姓名")
            return
        }
        if(comname.length == 0){
            alert("请输入公司名称")
            return
        }
        if(checkbox.checked !== true){
            alert("请阅读用户协议")
            return
        }
        var obj ={
            username:phone,
            sms_code:textCode,
            real_name:username,
            company_type:this.types[this.state.selectedRadioIndex],
            company:comname
        } 
        Model.regist(obj,res=>{
            this.props.registSucc()
            sessionStorage.setItem("registPhone", res.data.phone)
            sessionStorage.setItem("registPassword", res.data.password)
        })


        //注册成功的回调
        //
    }
    radioClick(index) {
        this.setState({selectedRadioIndex: index})
    }

    checkphone(){
        let phone = this.refs.phone.value
        if(phone.length == 0) return
        if(!(/^1[34578]\d{9}$/.test(phone))){ 
            alert("手机号码有误，请重填");  
            return 
        }else{
            Model.checkphone(phone,res=>{
                if(res.code == 4){
                    alert(res.msg)
                }
            })
        }
    }

    sendMsg(){
        let phone = this.refs.phone.value
        if(!(/^1[34578]\d{9}$/.test(phone))){ 
            alert("手机号码有误，请重填");  
            return
        }else{
            Model.sendMsg(phone,res=>{})
        }
    }

    showAgreement(){
        this.setState({
            agreeShow: true,
        })
    }

    hiddenAgree(){
        this.setState({
            agreeShow: false,            
        })
    }
    agree(){
        let checkbox = this.refs.checkbox
        checkbox.checked = true       
        this.setState({
            agreeShow: false,
        })
    }


    getRadios() {
        let _radioClick = this.radioClick.bind(this)

        if(this.types) return this.types.map((item, index) => {
            return (
                <span key={index}>
                    <input type='radio' name='type' value={item}
                        onClick={() => _radioClick(index)}
                        defaultChecked={index === this.state.selectedRadioIndex}/><label htmlFor={item}>{item}</label>
                </span>
            )
        })
    }


    render() {
        let _agree = this.state.agreeShow ? <RegistUserAgreement hiddenAgree={this.hiddenAgree.bind(this)} agree={this.agree.bind(this)}/> : null
        return (
            <div className='account'>
                <span className='title'>新用户注册, 立享优惠</span>
                <input className='phone' placeholder='手机号' ref="phone" onBlur={this.checkphone.bind(this)}/>
                <div className='container-verification'>
                    <input className='verification' ref="textCode" placeholder='验证码' />
                    <div className='verification-get'>
                        <VerificationCode
                            startTime={60}
                            holdString="点击发送验证码"
                            autoStart={false}
                            restart={this.state.restart}
                            callback={this.sendMsg.bind(this) }/>
                    </div>
                </div>
                <input className='name' ref="username" placeholder='用户姓名' />
                <input className='company' ref="comname" placeholder='公司名称' />
                <div className='container-radios'>
                    {this.getRadios()}
                </div>
                <div className='delegate'>
                    <input type='checkbox' ref="checkbox"/>
                    <span>我已阅读并同意<span className="userAgreement" onClick={this.showAgreement.bind(this)}>《零零汽™EPC查询系统用户注册协议》</span></span>
                </div>
                <input className='regist' type='button' onClick={this.regist.bind(this)} defaultValue='注册' />
                <a
                    onClick={() => this.setState({loginShow: true})}>已有账号, 立即登录</a>
                <div className={this.state.loginShow ? 'account-login' : 'account-login hidden'}
                    onClick={() => this.setState({loginShow: false})}>
                    <Login
                        login={this.props.login}
                        forget={() => location.href='https://007vin.com/findpwd'}
                        regist={() => this.setState({loginShow: false})}/>
                </div>
                {_agree}
            </div>
        )
    }
}

class Remind extends Root {
    render() {
        return (
            <div className='account-remind'>
                <div className='left-line'></div>
                <div className='remind-content'>
                    <div className='remind-title'>零零汽  汽配查询服务云平台</div>
                    <img src='/img/p_autumn_car.png' alt='logos' />
                </div>
            </div>
        )
    }
}

class RemindRegist extends Root {
    render() {
        let phone = sessionStorage.getItem("registPhone")
        let pwd = sessionStorage.getItem("registPassword")
        // console.log(this.props.enterIn)
        let enterInShow = this.props.enterIn == "login" ? "hidden" : ""
        return (
            <div className={'account-remind ' + enterInShow}>
                <div className='left-line'></div>
                <div className='remind-content'>
                    <div className='remind-title'>恭喜您注册成功！</div>
                    <div>
                        <p>
                            <span>网页版地址：</span>
                            <span>www.007vin.com</span>
                        </p>
                        <p>
                            <span>账         号：</span>
                            <span>{phone} （手机号码）</span>
                        </p>
                        <p>
                            <span>密         码：</span>
                            <span>{pwd} （手机后6位）</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}


class PayPanel extends Root{
    constructor(props){
        super(props)
        this.state = {
            paytype: "alipay",
            codeShow: false,
            codeImg:"",
            contents:[],
            typeId:''
        }
        this.timer = null
    }

    closeFloatCode(){
        this.setState({
            codeShow:false
        })
    }

    payTypeClick(type){
		this.setState({
			paytype: type
		})
	}

    componentDidMount(){
        Model.commodity(res=>{
           this.setState({
               contents: res.data.contents,
               typeId: res.data.id
           })
        })
    }

    toPay(){
        let typeId = this.state.typeId
        if(this.state.paytype == "alipay"){
            Model.alipay(typeId,"pc",res=>{
                this.setState({
                    codeImg:res.data.img,
                    codeShow:true   
                },()=>{
                    this.payCallBack()
                })
            })
        }else{
            Model.wxpay(typeId,"pc",res=>{
                this.setState({
                    codeImg:res.data.img,
                    codeShow:true
                },()=>{
                    this.payCallBack()
                })
            })
        }        
    }

    payCallBack() {
        if(!this.state.codeShow) return
		clearTimeout(this.timer);
		let _url = "/pays/check"
		let _obj = ""
		$.ajax({
			type: "get",
			url: _url,
			data: _obj,
			success: response => {
				//		getAjax("/pays/check","",response=>{
				switch (response.code) {
					case "405":
						//成功
                        // this.msgShowToHide("支付成功", 2);
                        this.props.showResult("succ")
						break;
					case "408":
						//未付款，再请求
						this.timer = setTimeout(this.payCallBack.bind(this), 2000);
						break;
					case "404":
						//验证码失效，刷新验证码
						this.toPay()
						break;
                    case "406":
                        this.props.showResult("error")
                        // this.msgShowToHide("支付失败");
						this.toPay()
				}
			}
		})
	}

    render() {
        let alipay_url = this.state.paytype == "alipay" ? "/img/icon_select.png" : "/img/icon_unselected.png"
		let wechat_url = this.state.paytype == "alipay" ? "/img/icon_unselected.png" : "/img/icon_select.png"
        let text = this.state.paytype == "alipay" ? "确认使用支付宝付款" : "确认使用微信付款"        
        let pay_msg = this.state.paytype == "alipay" ? "支付宝支付" : "微信支付"
        let bottom_msg = this.state.paytype == "alipay" ? "支付宝扫一扫付款" : "微信扫一扫付款"
        let codeShow = this.state.codeShow ? "block" : "none"
        let _codeImg = this.state.codeImg

        return(
            <div className="container-pay-box">
                <div className="pay-title">
                    选择支付方式
                </div>
                <div className='container-pay'>
                    <div className='pay-msg'>
                        <div>
                            <span>选择套餐：</span>
                            <span className="money-detail">{this.state.contents[0]}</span>
                        </div>
                        <div>
                            <span>使用期限：</span>
                            <span className="money-detail">{this.state.contents[1]}</span>
                        </div>
                        <div className='pay-money'>
                            <span>应付金额：</span>
                            <span className="money-detail">{this.state.contents[2]}</span>
                        </div>
                    </div>
                    <div className="choose-pay">
                        <div onClick={this.payTypeClick.bind(this,"alipay")}>
                            <img src="/img/p_alipay.png" alt="支付宝"/>
                            <img src={alipay_url} alt=""/>
                        </div>
                        <div onClick={this.payTypeClick.bind(this,"wechat")}>
                            <img src="/img/p_wechat.png" alt=""/>	
                            <img src={wechat_url} alt=""/>
                        </div>						
                    </div>
                    <div className="media-button">
                        <div className="media-pay-button" onClick={this.toPay.bind(this)}>{text}</div>
                    </div>
                    <div className="float-pay-container" style={{display:codeShow}}>
                        <div className="left-title">
                            {pay_msg}
                        </div>
                        <span className="close-icon" onClick={this.closeFloatCode.bind(this)}>

                        </span>
                        <div className="middle-container">
                            <p className="title">零零汽全品牌年卡</p>
                            <p><b>应付金额：</b> <span>{this.state.contents[2]}</span> </p>
                            <div className="code-box">
                                <img src={_codeImg} alt="扫一扫"/>
                            </div>
                            <p className="bottom_title">{bottom_msg}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Model {
    static alipay(type, device, callback) {
        Utils.get('/pays/alipay', {
            type,
            device
        }, res => callback(res))
    }
    static wxpay(type, device , callback) {
        Utils.post('/pays/wx', {
            type,
            device
        }, res => callback(res))
    }
    static checkphone(username, callback) {
        Utils.post('/user/phonecheck', {
            username
        }, res => callback(res))
    }
    static sendMsg(mobile,callback){
        Utils.post("/smscode",{mobile,type:1},res => callback(res))
    }

    static regist(obj,callback){
        Utils.post("/user/register_web",obj,res=>callback(res))
    }

    static login(form, callback) {
        Utils.showDom(".login-loading")
        Utils.post('/login', form, res => {
            
            callback(res);
            Utils.hideDom(".login-loading")
        })
    }

    static commodity(callback){
        Utils.get("/order/hotcommodity","",res=>{
            callback(res)
        })
    } 
}