import React from 'react'
import Root from './root'
import Utils from './utils'

export default class VCP extends Root {
    constructor() {
        super()
        this.hasShowed = false //是否显示过，处理按需加载
        this.changeShow = false //
    }

    componentDidMount() {
        this.checks() //检查必要属性或函数
    }

    componentWillReceiveProps(props) {
        let _newType = props.type
        if (_newType === this.type) this.show()
        else  this.hidden();
    }

    changeMainGroup(direction, callback) {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        if(direction === 'next') {
            let _length = this.state.mainGroups.length - 1
            let _index = this.state.index + 1
            if(_index > _length){
                alert("已到最后一主组")
            }
            _index = _index > _length ? _length : _index
            this.setState({index: _index}, callback)
        }else {
            let _index = this.state.index - 1
            if(_index < 0){
                alert("已到第一主组")
            }
            _index = _index < 0 ? 0 : _index
            this.setState({index: _index}, callback)
        }
    }

    show() {
      if(!window.fromDOM) return
      this.setState({
          show: true
      },this.callbackshow())
    }

    hidden() {
        this.setState({
            show: false
        })
    }

    /**
     * [checks 检查最初状态，必要属性及函数]
     */
    checks() {
        let _className = Utils.className(this)
        if (this.state && typeof(this.state.show) === 'undefined') console.log(_className + '%c state.show undefined. ', 'color: red')
    }

    /**
     * [containerClass 容器样式，处理动画]
     * @return {[string]} [className]
     */
    
    containerClass() {
        let _showClass = Utils.supportShrink() ? 'shrink' : 'hidden'
        return this.state.show ? '' : _showClass
    }

    /**
     * [neverShowed 确认是否尚未显示过，处理按需加载]
     * @return {[bool]} [是否显示过]
     */
    neverShowed() {
        if (this.state.show) this.hasShowed = true
        return !this.hasShowed
    }
}
