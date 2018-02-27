import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class NumberInput extends Component {
    constructor() {
        super()
        this.state = {
            min: false, // 是否到了最小
            max: false // 是否到了最大
        }
    }

    componentDidMount() {
        this.drawCanvas()
        this.inputChange()
    }

    componentWillReceiveProps(props) {
        let _value = this.refs['number-input'].value
        if(_value <= 1 || !_value) {
            this.setStatus('min')
            _value = 1
        }
        else if(_value >= this.props.max) {
            this.setStatus('max')
            _value = this.props.max
        }
        else this.setStatus('normal')
    }

    drawCanvas() {
        let _minus = this.refs['number-input-minus']
        let _ctx = _minus.getContext('2d')
        _ctx.strokeStyle = '#666'

        _ctx.beginPath()
        _ctx.moveTo(0, 5)
        _ctx.lineTo(10, 5)
        _ctx.lineWidth = 2
        _ctx.stroke()

        let _plus = this.refs['number-input-plus']
        _ctx = _plus.getContext('2d')
        _ctx.lineWidth = 2

        _ctx.beginPath()
        _ctx.moveTo(0, 5)
        _ctx.lineTo(10, 5)
        _ctx.stroke()

        _ctx.beginPath()
        _ctx.moveTo(5, 0)
        _ctx.lineTo(5, 10)
        _ctx.stroke()
    }

    inputChange() {
        let _value = this.refs['number-input'].value
        _value = _value.replace(/\D/, '')
        _value = parseInt(_value)

        _value = this.checkValue(_value)

        this.refs['number-input'].value = _value
    }

    checkValue(value) {
        if(value <= 1 || !value) {
            this.setStatus('min')
            value = 1
        }
        else if(value >= this.props.max) {
            this.setStatus('max')
            value = this.props.max
        }
        else this.setStatus('normal')

        this.props.setValue(value) // 核查之后, 上层拿到数据

        return value
    }

    setStatus(type) {
        let _status = {
            max: false,
            min: false
        }
        switch(type) {
            case 'min': _status.min = true
            break
            case 'max': _status.max = true
            break
        }
        this.setState(_status)
    }

    minusClick() {
        this.changeNumber(false)
    }

    plusClick() {
        this.changeNumber(true)
    }

    changeNumber(isPlus) {
        let _numberInput = this.refs['number-input']
        let _value = _numberInput.value
        _value = parseInt(_value) + (isPlus ? 1 : -1)
        _value = this.checkValue(_value)
        _numberInput.value = _value
        _numberInput.focus()
    }

    keyDown(e) {
        let _keyCode = e.which || e.keyCode
        if(_keyCode === 38) {
            this.changeNumber(true)
            e.preventDefault()
        }
        else if(_keyCode === 40) {
            this.changeNumber(false)
            e.preventDefault()
        }
    }

    render() {
        let _props = this.props
        let _minusClassName = 'number-input-control number-input-minus'
        if(this.state.min) _minusClassName += ' halfOpacity'
        let _plusClassName = 'number-input-control number-input-plus'
        if(this.state.max) _plusClassName += ' halfOpacity'

        return (
            <div className='number-input-box'>
                <div className={_minusClassName}
                    onClick={this.minusClick.bind(this)}>
                    <canvas ref='number-input-minus' width={10} height={10} />
                </div>
                <input ref='number-input' className='number-input' value={_props.value || _props.min || 1}
                    onChange={this.inputChange.bind(this)}
                    onKeyDown={this.keyDown.bind(this)}/>
                <div className={_plusClassName}
                    onClick={this.plusClick.bind(this)}>
                    <canvas ref='number-input-plus' width={10} height={10} />
                </div>
            </div>
        )
    }
}

NumberInput.propTypes = {
    max: PropTypes.number.isRequired,
    setValue: PropTypes.func.isRequired
}
