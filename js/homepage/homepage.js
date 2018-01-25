import React from 'react'
import Root from '../root'
import FloatWindow from '../floatwindow'
import UserAgreement from './useragreement'
import {Toast} from 'dialog-react'
import Login from './login'
import Utils from '../utils'
import Carousel from 'carousel-react'
import Activity from './activity'
import cAjax from './canvasAjax'  //canvasAjax指纹模块  cAjax.send()

export default class Homepage extends Root {
    constructor(props){
        super(props)
        this.state = {
            activeShow: false,
            actcode: ""
        }
    }
    
    showActive(actcode){
        this.setState({
            activeShow: true,
            actcode: actcode
        })
    }
    render() {
        let homepageClass = this.state.activeShow ? "homepage-content hidden" : 'homepage-content'                           
        let _activity = this.state.activeShow ? <Activity haveLogin={this.props.haveLogin} actcode={this.state.actcode}/> : null
        return (
            <div id='homepage' style={{display: this.props.show ? 'block' : 'none'}}>
                <div className={homepageClass}>
                    <Header
                        showActive = {this.showActive.bind(this)}
                        {...this.props} />
                    <Show
                        {...this.props} />
                </div>
                {/* _activity */}
                <Footer />
            </div>
        )
    }
}

class Header extends Root {
    constructor() {
        super()
        this.state = {
            showDialog: false,
            carouselImgsData: [], // 轮播数据
            loginShow: true // 是否显示 login, 不显示就是销毁
        }

        this.carouselRestart = null // carousel restart
    }

    componentDidMount() {
        Model.carousel(res => {
            if(res.data.length > 1) {
                let _data = res.data
                _data.splice(0, 0, _data[_data.length - 1])
                _data.push(_data[1])
            }
            this.setState({carouselImgsData: res.data}, this.carouselRestart)
        })

        this.props.setHeaderHiddenLogin(() => this.setState({loginShow: false}))
    }

    login(from) {
        Model.login(from, data => {
            this.setState({loginShow: false}, this.props.login)
        })
    }

    forget() {
        location.href = '/findpwd'
    }

    regist(){
       location.href='/user/register_web'
    }

    bannerClick(item) {

        if(item.url_param){
            // this.props.showActive(item.url_param.actcode)
        } 
    }

    render() {
        let _login = this.login.bind(this)
        let _forget = this.forget.bind(this)
        let _regist = this.regist.bind(this)

        return (
            <div className='container-header'>
                <div className='content'>
                    {this.state.loginShow ? (
                        <Login
                            login={_login}
                            forget={_forget}
                            regist={_regist}/>
                    ) : null}
                    <div className='carousel'>
                        <Carousel
            				previous='../img/banner_previous.png'
            				next='../img/banner_next.png'
            				countDown={5}
            				imgKey='img'
                            bannerClick={this.bannerClick.bind(this)}
            				banners={this.state.carouselImgsData}
                        	setCarouselRestart={handle => this.carouselRestart = handle}/>
                    </div>
                </div>
            </div>
        )
    }
}

class Show extends Root {
    constructor() {
        super()
        this.state = {
            cars: '',
            brands: '',
            parts: ''
        }
    }

    componentDidMount() {
        Model.getRuns(data => this.run(data))
    }

    componentWillUnmount() {
        //计数未执行完就登录，会报错
        this.times = 0
        clearInterval(this.interval)
    }

    run(data) {
        this.times = 10

        this.interval = setInterval(() => {
            // console.log(`${this.times < 1} from this.times ${this.times}`)
            if (this.times < 1) {
                clearInterval(this.interval)
                return
            }

            this.setState({
                cars: parseInt(data.cars / this.times),
                brands: parseInt(data.brands / this.times),
                parts: parseInt(data.parts / this.times)
            }, () => this.times--)
        }, 100)
    }

    render() {
        let _cars = this.state.cars
        let _brands = this.state.brands
        let _parts = this.state.parts

        return (
            <div className='container-show'>
                <div className='container-brands'>
                    <span>零零汽当前覆盖品牌</span>
                    <img src={`${this.cdnHost}img/p_logo.png`} alt='brands' />
                </div>
                <div className='container-data'>
                    <div className='run'>
                        <span>{_cars}</span>
                        <span>车型数据</span>
                    </div>
                    <div className='run'>
                        <span>{_brands}</span>
                        <span>支持品牌</span>
                    </div>
                    <div className='run'>
                        <span>{_parts}</span>
                        <span>零件数据</span>
                    </div>
                </div>
            </div>
        )
    }
}

class Footer extends Root {
    constructor() {
        super()
        this.state = {
            showUserAgreement: false
        }
    }

    userAgreementClick() {
        this.setState({
            showUserAgreement: true
        })
    }

    render() {
        let _showUserAgreement = this.state.showUserAgreement
        let _userAgreementClick = this.userAgreementClick.bind(this)
        let _isPartner = this.state.isPartner

        return (
            <div className='container-footer'>
					<FloatWindow
						title='用户协议'
						img='/img/icon_san.png'
						show={_showUserAgreement}
						hiddenEvent={() => {
							this.setState({
								showUserAgreement: false
							})
						}}
						content={<UserAgreement />}
					/>
				    <div className='content'>
                        <div className='about'>
                            <span
                                onClick={()=>{window.open( 'http://www.peipeiyun.com/')}}
                                style={{cursor: 'pointer'}}>关于我们</span>
    				        <span
                                onClick={_userAgreementClick}
                                style={{cursor: 'pointer'}}>用户协议</span>
                        </div>
				    <div className='license'>
                        © 2016-2017 007vin.com  <span onClick={()=>{window.open('http://www.miitbeian.gov.cn/')}} style={{cursor: 'pointer'}}> 版权所有 ICP证：浙17026959号-2</span>
				    </div>
				    </div>
			</div>
        )
    }
}

class Model {
    /**
     * [getRuns 获取数字跳动数据]
     * @param  {Function} callback [callback]
     */
    static getRuns(callback) {
        Utils.get('/homepage/milestone', null, res => {
            callback(res)
        }, true)
    }
    /**
     * [login login]
     * @param  {[obect]}   form     [username, password]
     * @param  {Function} callback [callback]
     */
    static login(form, callback) {
        Utils.showDom(".login-loading")
        Utils.post('/login', form, res => {
            cAjax.send();                            
            callback(res);
            Utils.hideDom(".login-loading")
        })
    }

    static carousel(callback) {
        Utils.get('/homepage/carousel', null, res => {
            callback(res)
        })
    }
}
