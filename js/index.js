import { render } from 'react-dom'
import React from 'react'
import Utils from './utils'
import Root from './root'
import Content from './content'
import $ from 'min-jquery'
import OperateGuide from './operate_guide'
import ch from './cloud-homepage'
import UserAgreement from './homepage/useragreement'
import FloatWindow from './floatwindow'
import Seealso from "./addition/seealso"
class App extends Root {
    constructor() {
        super()
        this.state = {
            type: Utils.params().type || 'vin',
            haveLogin: false, // 是否登录
            homepageShow: false, // 是否显示首页
            showUserAgreement: false,
            partResultParams:{},
            toggleIsShow: [1, 0],
            groupDetail: false,
        }
        //调试用
        window.logout = this.logout.bind(this)
        window.changeType = this.changeType.bind(this)
        window.engineering_code_enable = {}
        window.error_code_enable = {}
        window.three_layout_principle = {}
        window.without_maingroup_img = {}
        window.vin_subquery_disable = {}
        // 通用检测分组主组显示
        
        window.isSpecial = () => {
            // return window.currentBrands === 'land_rover' || window.currentBrands === 'tesla' || window.currentBrands === 'alfaromeo' || window.currentBrands === 'jaguar' || window.currentBrands === 'fiat' || window.currentBrands === 'jeep'
            if(window.three_layout_principle[window.currentBrands]){
                return true
            }else {
                return false
            }
        }
        window.hasChooseOne = false
        // window.faultCodeBrand = (brand) => {return brand === 'audi' || brand === 'vwag' || brand === 'skoda' || brand === 'seat'}
        window.faultCodeBrand = (brand) => {
            if(window.error_code_enable[brand]) {
                return true
            }else {
                return false                
            }
        }
        window.withoutImg = (brand) => {
            if(window.without_maingroup_img[brand]) {
                return true
            } else {
                return false
            }
        }
        
        window.vinSearchPart = (brand)=> {
            if(window.vin_subquery_disable[brand]) {
                return false
            }else {
                return true
            }
        }

        window.engCodeBrand = (brand) => {
            // return brand === 'land_rover'
            if(window.engineering_code_enable[brand]) {
                return true
            }else {
                return false
            }
        }
        window._userAgreementClick = this.userAgreementClick.bind(this)
        // 第三方处理, 需要靠前
        this.thirdHandle()
        ch()
        window.haveLogin = this.haveLogin.bind(this)
        // 零件列表参见
        window.showSeealso = this.showSeealso.bind(this)
    }
    
    specificinfo() {
        Utils.post("/brand_specific_info", null, res=> {
            //  res.data
             window.without_maingroup_img = res.data.without_maingroup_img
             window.error_code_enable = res.data.error_code_enable
             window.three_layout_principle = res.data.three_layout_principle
             window.engineering_code_enable = res.data.engineering_code_enable
             window.vin_subquery_disable = res.data.vin_subquery_disable
        })
    }

    componentDidMount() {
        //是否已经登录
        Utils.get('/userhabits', null, res => {
            if (res.code === 1) {
                Utils.showDom(".FeedBackButton")
                this.haveLogin()
                window.homepageRemoveLogin()
                this.specificinfo()
                Utils.get('/user/msglocalunread', null, res => {
                    if (res.data.total_counts > 0) {
                        Utils.showDom(".RedPoint")
                    }
                })
                Utils.get("/users/query_features_verify", null, res => {
                    if(!res.brand_privileges) {
                        $(".combo-com").addClass("com-active");
                    }
                    if(!res.article_privileges) {
                        $(".combo-cell").addClass("cell-active");                     
                    }
                })
                if(this.state.type === 'home') {
                    window.showHomepage()
                }
            }else {
                let _type = Utils.params().type || 'vin'
                this.setState({
                    type: _type === 'home' ? 'vin' : _type,
                    haveLogin: false, // 是否登录
                    homepageShow: true // 是否显示首页
                }, () => {
                  document.querySelector("#homepage").style.display = 'flex'
                  setTimeout(() => document.querySelector('#login-username').focus(), 100)
                }
              )
            }
        }, true)
        
        window.showHomepage = () => {
            $(".inquires a h1").css("fontWeight", "normal")
            $("#_home h1").css("fontWeight", "bold")
            // if (this.state.haveLogin) this.setState({ homepageShow: !this.state.homepageShow })
            if (this.state.haveLogin) this.setState({ homepageShow: true })
            if(this.state.homepageShow) document.querySelector('#homepage').style.display = 'flex'
            else document.querySelector('#homepage').style.display = 'none'
        }
    }

   
    thirdHandle() {
        // 星奥隐藏信息
        if (Utils.params().source === 'xa') {
            window.isXA = true
            document.getElementById('logo').style.display = 'none'
            document.getElementById('person').style.display = 'none'
            document.getElementById('header-account').style.display = 'none'
            document.getElementById('operate-lge').style.display = 'none'            
            document.getElementsByClassName('combo-home')[0].style.display = 'none'             
        }
    }

    logout() {
        this.setState({
            homepageShow: true
        }, () => {
            Utils.hideDom(".FeedBackButton")
            document.getElementById('header-account').style.display = 'flex'
            document.getElementById('header-utils').style.display = 'none'
        })
    }

    hideSeealso() {
        this.setState({
            groupDetail: false
        })
    }

    noneSeealso(){
        alert("无参见数据")
        this.setState({
            groupDetail: false
        })
    }

    showSeealso(obj){
        if (this.state.groupDetail) {return}
        this.setState({
            partResultParams:obj,
            groupDetail: true
        })
        

    }

    /**
     * [changeType vin, car, part]
     * @param  {[string]} type ['vin', 'car', 'part']
     */
    changeType(type) {
        window.fromDOM = true // 点击顶部 dom 元素的标记
        if (!this.state.haveLogin) {
            alert('请先登录')
            return
        }
        document.querySelector('#homepage').style.display = 'none'
        // console.log(type)
        if(type === 'car') window.operateGuideIndex = 4 // 操作指引
        else if(type === 'part') window.operateGuideIndex = 5 // 操作指引
        else if(type === 'partEng') window.operateGuideIndex = 6 // 操作指引        
        else {
            window.operateGuideIndex = this.oldOperateGuideIndex || 0 // 操作指引
            this.oldOperateGuideIndex = window.operateGuideIndex || 0
        }
        this.setState({
            type: type,
            homepageShow: false
        }, () => window.fromDOM = false)
        // $(".inquires a").css("border", "none")
        $(".inquires a h1").css("fontWeight", "normal")
        // $("#_" + type).css("borderBottom", "3px solid #000")
        $("#_" + type + " h1").css("fontWeight", "bold")
    }

    /**
     * [haveLogin login success]
     */
    
    haveLogin() {
        this.setState({
            haveLogin: true,
            homepageShow: false
        }, () => {
            if (this.headerHiddenLogin) this.headerHiddenLogin()
            document.getElementById('header-account').style.display = 'none'
            document.getElementById('header-utils').style.display = 'block'
            document.querySelector('#homepage').style.display = 'none'
        })
        Utils.get("/users/query_features_verify", null, res => {
            if(!res.brand_privileges) {
                $(".combo-com").addClass("com-active");
            }
            if(!res.article_privileges) {
                $(".combo-cell").addClass("cell-active");                     
            }
        })
        Utils.showDom(".FeedBackButton")
        this.specificinfo()

    }

    getContent() {
        let _content = null

        if (window.isXA || this.state.haveLogin) _content = (
            <Content
                show={!this.state.homepageShow}
                type={this.state.type} />
        )

        return _content
    }

    userAgreementClick() {
        this.setState({
            showUserAgreement: true
        })
    }

    render() {
        let _groupDetail = this.state.groupDetail ? (
            <Seealso
                params = {this.state.partResultParams}
                brands = {this.state.partResultParams.code}
                hideSeealso = {this.hideSeealso.bind(this)}
                noneSeealso = {this.noneSeealso.bind(this)}
            />
        ) : <div/>

        let _showUserAgreement = this.state.showUserAgreement
        let _userAgreementClick = this.userAgreementClick.bind(this)
        return (
            <div>
                {_groupDetail}
                {this.getContent()}
                <OperateGuide />
                <FloatWindow
                    title={TR('用户协议')}
                    img='/img/icon_san.png'
                    show={_showUserAgreement}
                    hiddenEvent={() => {
                        this.setState({
                            showUserAgreement: false
                        })
                    }}
                    content={<UserAgreement />}
                />
            </div>
        )
    }
}

render(<App />, document.getElementById('app'))
