import React, {Component} from 'react'
import PropTypes from 'prop-types'
import QRLogin from './qr_login'
import NeverBind from './never_bind'

export default class Login extends Component {
	constructor() {
		super()
		this.state = {
			type: 'normal', // 当前显示登录框的状态, 默认状态, 和点击后前往个人中心状态
			QRLoginShow: false, // 显示二维码登录
			neverBindShow: false // 显示从未绑定
		}
		this.form = {username: '', password: ''}
        this.localStorage = {username: 'formUsername', password: 'formPassword'}
		this.usernameInput = null //username input
		this.passwordInput = null //password input
		//绑定 header 的登录
		window.login = this.login.bind(this)
	}

    componentDidMount() {
        if(localStorage.getItem(this.localStorage.username)) {
			this.refs.checkbox.checked = true
			this.usernameInput.value = localStorage.getItem(this.localStorage.username)
			this.passwordInput.value = localStorage.getItem(this.localStorage.password)
		}
    }

	check(e) {
        let _username = ''
        let _password = ''

        if(e.target.checked === true) {
            _username = this.form.username
            _password = this.form.password
        }

        localStorage.setItem(this.localStorage.username, _username)
		localStorage.setItem(this.localStorage.password, _password)
	}

    login() {
		//bridges result
        if(this.usernameInput && this.usernameInput.value.length < 1) alert('请输入用户名')
        else if(this.passwordInput && this.passwordInput.value.length < 1) alert('请输入密码')
        else {
			//安全处理
			this.form.username = this.usernameInput.value
			this.form.password = this.passwordInput.value
			this.props.login(this.form)
		}
    }

	showQRLogin() {
		this.setState({QRLoginShow: true})
	}

	showNeverBind() {
		this.setState({neverBindShow: true})
	}

	loginToBind() {
		this.setState({QRLoginShow: false, type: 'loginToBind'})
	}

	back() {
		this.setState({type: 'normal', QRLoginShow: false, neverBindShow: false})
	}

	getQRLogin() {
		if(this.state.QRLoginShow) return (
			<QRLogin
				show={this.state.QRLoginShow}
				back={this.back.bind(this)}
				loginToBind={this.loginToBind.bind(this)}/>
		)
	}

	getNeverBind() {
		if(this.state.neverBindShow) {
			return (
				<NeverBind
					show={this.state.neverBindShow}
					back={this.back.bind(this)}/>
			)
		}
	}

	render() {
		let _check = this.check.bind(this)
        let _login = this.login.bind(this)
		let _isNormal = this.state.type === 'normal'

		return (
			<div className='container-login'
				onClick={e => e.stopPropagation()}>
				<span className='title'>{_isNormal ? '登录' : '登录绑定微信'}</span>
				<Username form={this.form}
					setUsernameInput={input => this.usernameInput = input}/>
				<Password form={this.form}
					setPasswordInput={input => this.passwordInput = input}
					login={_login}/>
				<div className='util-password'>
					<span>
						<input ref='checkbox' type='checkbox'
							onChange={_check} />
						<span>记住密码</span>
					</span>
					<a onClick={this.props.forget}>忘记密码？</a>
				</div>
				<input className='button-login' type='button' defaultValue='登录'
                    onClick={_login}/>
				<span className="login-loading"></span>
				<div className={_isNormal ? 'container-wx-login hidden' : 'container-wx-login hidden'}
					onClick={this.showQRLogin.bind(this)}>
					<img src='https://cdns.007vin.com/img/icon_wx.png' alt='微信登录'/>
					<span>微信扫码登录</span>
				</div>
				<div className='container-regist'>
					<span>没有账号？</span>
					<a onClick={this.props.regist}>立即注册</a>
				</div>
				{this.getQRLogin()}
				{this.getNeverBind()}
			</div>
		)
	}
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    forget: PropTypes.func.isRequired,
    regist: PropTypes.func.isRequired
}

class Input extends Component {
	constructor() {
		super()
		this.state = {
			showClear: false,
			showCaps: false
		}

        this.localStorage = {username: 'formUsername', password: 'formPassword'}
	}

	replaceValue(value) {
		let _value = value.replace(/\W/g, '')
		this.checkClear(_value)
		return _value
	}

	checkClear(value) {
		let _showClear = false
		if(value.length > 0) _showClear = true

		this.setState({showClear: _showClear})
	}

	clear() {
		this.setState({showClear: false}, () =>{
            this.refs.input.value = ''
            this.clearForm()
        })
	}
}

class Username extends Input {
    componentDidMount() {
        this.refs.input.value = localStorage.getItem(this.localStorage.username)
		//bridges
		this.props.setUsernameInput(this.refs.input)
    }

	change(e) {
		let _value = this.replaceValue(e.target.value)
		this.props.form.username = e.target.value = _value
	}

    clearForm() {
        this.props.form.username = ''
    }

	render() {
		let _change = this.change.bind(this)
		let _showClear = this.state.showClear
		let _clear = this.clear.bind(this)

		return (
			<div className='container-input'>
				<input ref='input' className='input' placeholder='输入手机号'
					onChange={_change}/>
				<div className='clear'
					style={{display: _showClear ? 'block' : 'none'}}
					onClick={_clear}></div>
			</div>
		)
	}
}

class Password extends Input {
	constructor() {
		super()
		this.isCaps = false
		this.currentLength = 0
	}
	
    componentDidMount() {
		this.refs.input.value = localStorage.getItem(this.localStorage.password) || ''
		this.currentLength = this.refs.input.value.length
		//bridges
		this.props.setPasswordInput(this.refs.input)
    }

	change(e) {
		let _value = this.replaceValue(e.target.value)
		this.props.form.password = e.target.value = _value

		this.checkInputUpper(_value)
	}

	checkInputUpper(value) {
		let _newLength = value.length
		if(_newLength < 1) this.setState({showCaps: false})
		else {
			// 文字长度有变化
			if(_newLength !== this.currentLength) {
				// 文字是新增
				if(_newLength > this.currentLength) {
					let _capsReg = new RegExp(/[A-Z]/)
					let _lastCar = value.replace(/.*(.)$/, '$1')
					let _isUpper = _capsReg.test(_lastCar)
					if(_isUpper) this.setState({showCaps: true})
					else this.setState({showCaps: false})
				}
			}
		}

		this.currentLength = _newLength
	}

	keyDown(e) {
		let _keyCode = e.which || e.keyCode
		if(_keyCode === 13) this.props.login() // 回车
		else if(_keyCode === 20) this.setState({showCaps: !this.state.showCaps}) // 大小写
	}

    clearForm() {
        this.props.form.password = ''
    }

	render() {
		let _change = this.change.bind(this)
		let _showCaps = this.state.showCaps
		let _showClear = this.state.showClear
		let _clear = this.clear.bind(this)

		return (
			<div className='container-input'>
				<input ref='input' type='password' className='input' placeholder='输入密码'
					onChange={_change}
					onBlur={() => this.setState({showCaps: false})}
					onKeyDown={this.keyDown.bind(this)}/>
				<div className='caps'
					style={{display: _showCaps ? 'block' : 'none'}}
					onClick={_clear}></div>
				<div className='clear'
					style={{display: _showClear ? 'block' : 'none'}}
					onClick={_clear}></div>
			</div>
		)
	}
}
