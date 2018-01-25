import React from 'react'
import Root from '../root'

export default class Uniqueness extends Root {
    getContent() {
        let _content = ''
        let _warning1 = '风险提示：原厂数据未提供零件唯一性信息，以下内容仅供参考！'
        let _warning2 = '风险提示：部分分组未过滤，请对比“车辆配置”与”分组备注“信息后选定！'
        let _warning3 = '风险提示：零件唯一性可能存在误差，以下内容仅供参考！'
        
        switch(this.props.brands) {
            case 'ferrari': _content = _warning1
            break
            case 'bullstuff': _content = _warning1
            break
            case 'volvo': _content = _warning1
            break
            case 'maserati': _content = _warning2
            break
            // case 'toyota': _content = _warning3
            // break
            // case 'lexus': _content = _warning3
            // break
            default: _content = ''
        }
        return _content
    }

    render() {
        return (
            <div className='uniqueness'>
                <span>{this.getContent()}</span>
            </div>
        )
    }
}
