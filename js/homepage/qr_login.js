import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Utils from '../utils'

export default class QRLogin extends Component {
    constructor() {
        super()
        this.state = {
            qrCodeUrl: '#'
        }
    }

    componentDidMount() {
        Model.qrcode(res => {
            this.state.qrCodeUrl = res.img
        })
    }

    render() {
        return (
            <div className='container-qr-login'>
                <span className='back'
                    onClick={this.props.back}>
                    {'< 账号密码登录'}
                </span>
                <span className='remind'>微信扫码登录</span>
                <img className='qr-code' src={this.state.qrCodeUrl} alt='二维码' />
                <span className='qr-remind'>微信扫一扫登录</span>
                <span className='go-bind'
                    onClick={this.props.loginToBind}>
                    我的账号未绑定, 现在去绑定
                </span>
            </div>
        )
    }
}

QRLogin.propTypes = {
    back: PropTypes.func.isRequired // just back
}

class Model {
    static qrcode(callback) {
        Utils.get('/wechat/login/qrcode', null, res => {
            callback(res)
        })
    }
}
