import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class HyperInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clearShow: false, // 是否显示清空按钮
            value: props.value
        }
        this.isNumber = props.isNumber
    }

    componentDidMount() {
        this.setState({clearShow: false}, this.drawCanvas)
    }

    componentWillReceiveProps(props) {
        this.setState({value: props.value})
    }

    drawCanvas() {
        let _hyperInputClose = this.refs['hyper-input-close']
        let _cxt = _hyperInputClose.getContext('2d')
        _cxt.beginPath()
        _cxt.arc(6, 6, 6, 0, Math.PI * 2, false)
        _cxt.fillStyle = '#a0a1a7'
        _cxt.fill()

        _cxt.beginPath()
        _cxt.moveTo(4, 4)
        _cxt.lineTo(8, 8)
        _cxt.strokeStyle = 'white'
        _cxt.stroke()

        _cxt.beginPath()
        _cxt.moveTo(8, 4)
        _cxt.lineTo(4, 8)
        _cxt.strokeStyle = 'white'
        _cxt.stroke()
    }

    inputChange() {
        let _value = this.refs['hyper-input'].value
        let _regExp = this.props.regExp
        if(_regExp) _value = _regExp(_value)

        let _callback = null
        if(this.isNumber) _callback = () => {
            let _setValue = this.props.setValue
            if(_setValue) _setValue(_value)
        }

        if(_value.length > 0 ) this.setState({clearShow: true, value: _value}, _callback)
        else this.setState({clearShow: false, value: _value}, _callback)
    }

    inputFocus() {
        let _value = this.refs['hyper-input'].value
        if(_value.length > 0) this.setState({clearShow: true})
    }

    inputBlur() {
        let _value = this.refs['hyper-input'].value
        let _callback = null
        let _setValue = this.props.setValue
        if(_setValue) _callback = () =>_setValue(_value)
        
        this.setState({clearShow: false}, _callback)
    }

    clear() {
        let _input = this.refs['hyper-input']
        _input.value = ''
        _input.focus()
        this.inputChange()
    }

    render() {
        let _props = this.props

        return (
            <div className='hyper-input-box'>
                <input className='hyper-input'
                    ref='hyper-input'
                    placeholder={_props.placeholder}
                    value={this.state.value}
                    onChange={this.inputChange.bind(this)}
                    onFocus={this.inputFocus.bind(this)}
                    onBlur={this.inputBlur.bind(this)}/>
                <canvas ref='hyper-input-close' className='hyper-input-close' width={12} height={12}
                    style={{display: this.state.clearShow ? 'block' : 'none'}}
                    onClick={this.clear.bind(this)}/>
            </div>
        )
    }
}

HyperInput.propTypes = {
    setValue: PropTypes.func.isRequired
}
