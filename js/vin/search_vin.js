import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Utils from '../utils'
import Root from '../root'

export default class SearchVIN extends Root {
    constructor(props) {
        super(props)
        props.setInputValue(this.inputValue.bind(this))
        this.state = {
            remind: '',
            currentLength: 0 //vin 搜索内容当前长度
        }
        this.vinMaxLength = 17
    }

    componentDidMount() {
        this.props.setResponseRadioChange(this.responseRadioChange.bind(this))
        if(Utils.params().vin) {
            this.refs.input.value = Utils.params().vin
            this.search()
        }
    }

    search() {
        let _value = this.refs.input.value
        if(_value.length < 1 || this.isSearching) return
        
        this.props.search(_value, () => this.refs.input.blur())
        this.isSearching = true
        setTimeout(() => this.isSearching = false, 2500)
    }

    focus() {
        let _focus = this.props.focus
        if(_focus) _focus()
    }

    blur() {
        let _blur = this.props.blur
        if(_blur) _blur()
    }

    inputValue(value) {
        this.refs.input.value = value
        if(!value){
            this.setState({
                remind:"",
                currentLength: 0
            })
            return
        }
        this.setState({currentLength: value.length})
    }

    keyPress(e) {
        let _keyCode = e.which || e.keyCode
        if (_keyCode === 13) {
            this.search()
        }
    }

    inputChange() {
        let _value = this.refs.input.value
        _value = this.refs.input.value = this.checkValue(_value)
        this.props.checkHistory(_value)
        let _length = _value.length

        this.setState({currentLength: _length})

        if(_length === this.vinMaxLength) this.search()
    }

    checkValue(value) {
        value = value.replace(/\W/g, '')
        value = value.toUpperCase()
        if(value.length > this.vinMaxLength) value = value.substr(0, this.vinMaxLength)
        //处理数据
        return value
    }

    clear() {
        this.setState({
            currentLength: 0,
            remind: ''
        }, this.resetInput)
    }

    resetInput() {
        let _input = this.refs.input
        _input.value = ''
        _input.focus()
    }

    //响应 radios change 事件
    responseRadioChange() {
        // console.log('responseRadioChange')
        this.refs.input.focus()
    }

    reSetRaido() {
        this.props.radioChange(0)
    }

    render() {
        let _currentLength = this.state.currentLength
        let _showNumberAndClear = _currentLength > 0
        // console.log(this.props.staticBradnUrl)
        let _brandImg = this.props.staticBradnUrl ? <img className="brandImg" src={this.cdnHost + this.props.staticBradnUrl}/> : <div/>
        return (
            <div className='container-search-vin'>
                <div className='remind'>{this.state.remind}</div>
                {/* {_brandImg} */}
                <div className="left-brand">
                    {TR("全部品牌")} >
                    {
                        this.props.staticBradnUrl
                        ? <div className='choosed-item'>
                            {this.props.staticBradnUrl}
                            <div className='clear' onClick={this.reSetRaido.bind(this)}></div>
                          </div>
                        : null
                    }
                </div>
                <input ref='input' className='input'
                    placeholder={this.props.placeholder || '请输入搜索内容'}
                    onFocus={this.focus.bind(this)}
                    onBlur={this.blur.bind(this)}
                    onChange={this.inputChange.bind(this)}
                    onKeyPress={this.keyPress.bind(this)}/>
                <div className={_showNumberAndClear ? 'clear' : 'clear hidden'}
                    onClick={this.clear.bind(this)}></div>
                <span className={_showNumberAndClear ? 'number' : 'number hidden'}>{_currentLength}</span>
                <input className='search' type='button'
                    defaultValue={this.props.defaultValue}
                    onClick={this.search.bind(this)}/>
                <span className="vin-search-loading"></span>
            </div>
        )
    }
}

SearchVIN.propTypes = {
    defaultValue: PropTypes.string.isRequired,
    search: PropTypes.func.isRequired
}

class Model {
    static parse(vin, callback) {
        Utils.get('/parse/vins', {vin}, res => callback(res))
    }
}
