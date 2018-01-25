import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class NeverBind extends Component {
    render() {
        return (
            <div className='container-never-bind'>
                <span className='back'
                    onClick={this.props.back}>
                    {'< 账号密码登录'}
                </span>
                <img className='error' src='#' alt='error' />
                <span className='remind'>您的微信还未绑定零零汽账号暂时不能用微信登录</span>
                <input className='regist' type='button' defaultValue='没有账号, 立即注册' />
                <span className='go-bind'
                    onClick={this.props.loginToBind}>
                    我的账号未绑定, 现在去绑定
                </span>
            </div>
        )
    }
}

NeverBind.propTypes = {
    back: PropTypes.func.isRequired // just back
}
