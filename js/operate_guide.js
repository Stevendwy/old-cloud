import React from 'react'
import Root from './root'
import Utils from "./utils"
export default class OperateGuide extends Root{
    constructor() {
        super()
        this.state = {
            index: window.operateGuideIndex || 0,
            show: false
        }
        this.maxIndex = 6
        window.operateGuideClick = this.toggle.bind(this)
    }

    toggle() {
        window.closeupdatebox()
        if(this.state.show) {
                Utils.get('/userhabits', null, res => {
                    if (res.code === 1) {
                        Utils.showDom(".FeedBackButton")                 
                    }                        
                }, true)
        }else {
            Utils.hideDom(".FeedBackButton")
        }
        this.setState({
            show: !this.state.show,
            index: window.operateGuideIndex || 0
        })
    }

    previous() {
        let index = this.state.index - 1
        index = index < 0 ? this.maxIndex : index 
        this.setState({index})
    }

    next() {
        let index = this.state.index + 1
        index = index > this.maxIndex ? 0 : index
        this.setState({index})
    }

    render() {
        return (
            <div className={this.state.show ? 'operate-guide' : 'operate-guide hidden'}>
                <div className='operate-guide-ctrl'>
                    <div className='operate-guide-remind'>操作指引</div>
                    <div className='operate-guide-ctrl-previous'
                        onClick={this.previous.bind(this)}>
                        <div className='operate-guide-ctrl-remind'>上一步</div>
                    </div>
                    <div className='operate-guide-ctrl-next'
                        onClick={this.next.bind(this)}>
                        <div className='operate-guide-ctrl-remind'>下一步</div>
                    </div>
                    <div className='operate-guide-ctrl-close'
                        onClick={this.toggle.bind(this)}>
                        <div className='operate-guide-ctrl-remind'>关闭</div>
                    </div>
                </div>
                <img src={`../img/operateGuide${this.state.index}.png`} alt="operate-guide" />
            </div>
        )
    }
}