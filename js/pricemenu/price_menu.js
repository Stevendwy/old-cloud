import React, {Component} from 'react'
import HyperInput from './hyper_input'
import NumberInput from './number_input'
import PullSelector from './pull_selector'
import PropTypes from 'prop-types'

export default class PriceMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            possessData: JSON.parse(JSON.stringify(props.initialData))
        }
    }

    // 刷新, 子级持有
    refreshState(callback) {
        this.setState({possessData: this.state.possessData}, callback)
    }

    submitPriceMenu() {
        let _possessData = this.state.possessData
        let _priceMenu = _possessData.contact // 结构不一样
        _priceMenu.detail = _possessData.data
        this.props.submitPriceMenu(_priceMenu)
    }

    updateResult() {
        let _possessData = this.state.possessData
        let _listItems = _possessData.data
        let _total_type = _listItems.length
        let _total_quantity = 0
        let _total_money = 0

        for(let i = 0, j = _total_type; i < j; i++) {
            let _listItem = _listItems[i]
            let _quantity = _listItem.quantity

            _total_quantity += _quantity
            _total_money += _quantity * _listItem.price
        }

        _possessData.total_type = _total_type,
        _possessData.total_quantity = _total_quantity,
        _possessData.total_money = _total_money.toFixed(2)
        this.refreshState()
    }

    render() {
        let _possessData = this.state.possessData
        let _props = this.props

        return (
            <div className='container-price-menu-back'>
                <div className='price-menu'>
                    <Header
                        title={_possessData.title}
                        closeClick={_props.closeClick}/>
                    <Content
                        headerItems={_props.headerItems}
                        originData={_possessData}
                        refreshPriceMenuState={this.refreshState.bind(this)}
                        submitPriceMenu={this.submitPriceMenu.bind(this)}
                        updateResult={this.updateResult.bind(this)}/>
                </div>
            </div>
        )
    }
}

PriceMenu.propTypes = {
    closeClick: PropTypes.func.isRequired,
    initialData: PropTypes.object.isRequired,
    submitPriceMenu: PropTypes.func.isRequired
}

class Header extends Component {
    componentDidMount() {
        let _closeCanvas = this.refs['canvas-close']
        let _context = _closeCanvas.getContext("2d")
        _context.lineWidth = 2
        _context.strokeStyle = "white"

        _context.beginPath()
        _context.moveTo(14, 14)
        _context.lineTo(26, 26)
        _context.stroke()

        _context.beginPath()
        _context.moveTo(26, 14)
        _context.lineTo(14, 26)
        _context.stroke()
    }

    render() {
        return (
            <div className='price-menu-header'>
                <span className='price-menu-header-title'>{this.props.title}</span>
                <canvas className='price-menu-header-close' ref='canvas-close' width={40} height={40} />
                <div className='price-menu-header-back'
                    onClick={this.props.closeClick}/>
            </div>
        )
    }
}

class Content extends Component {
    getHeaderItems() {
        let _headerItems = this.props.headerItems || ['序号', '名称', '标号', '类型', '数量', '单价']
        if(_headerItems) return (
            _headerItems.map((item, index) => {
                return (
                    <div key={index} className='price-menu-content-header-item'>
                        {item}
                    </div>
                )
            })
        )
    }

    deleteClick(item) {
        let _originData = this.props.originData
        let _originDataListItems = _originData.data

        for(let i = 0, j = _originDataListItems.length; i < j; i++) {
            let _listItem = _originDataListItems[i]

            if(_listItem.pid === item.pid) {
                _originDataListItems.splice(i, 1)
                this.props.refreshPriceMenuState(this.props.updateResult)
                break
            }
        }
    }

    getContentListItems() {
        let _contentList = this.props.originData.data
        if(_contentList) return (
            _contentList.map((item, index) => {
                return (
                    <Item key={index}
                        item={item}
                        updateResult={this.props.updateResult}
                        deleteClick={this.deleteClick.bind(this, item)}/>
                )
            })
        )
    }

    contactChange(type) {
        this.props.originData.contact[type] = this.refs[type].value
    }

    render() {
        let _originData = this.props.originData

        return (
            <div className='price-menu-content'>
                <div className='price-menu-content-header'>
                    {this.getHeaderItems()}
                </div>
                <div className='price-menu-content-list'>
                    {this.getContentListItems()}
                    <div className='price-menu-content-list-result'>
                        <span>{_originData.total_type}种, 共{_originData.total_quantity}件</span>
                        <span>合计: <span className='price-menu-content-list-result-total'>¥{_originData.total_money}</span></span>
                    </div>
                </div>
                <div className='price-menu-content-info'>
                    <div className='price-menu-content-info-header'>
                        报价方资料
                    </div>
                    <div className='price-menu-content-info-add'>
                        <span>公司名称:</span>
                        <input ref='company' placeholder='公司名称' defaultValue={_originData.contact.company}
                            onChange={this.contactChange.bind(this, 'company')}/>
                        <span>联系人:</span>
                        <input ref='contact_person' placeholder='联系人' defaultValue={_originData.contact.contact_person}
                            onChange={this.contactChange.bind(this, 'contact_person')}/>
                        <span>联系电话:</span>
                        <input ref='contact_tel' placeholder='tel' defaultValue={_originData.contact.contact_tel}
                        onChange={this.contactChange.bind(this, 'contact_tel')}/>
                    </div>
                    <div className='price-menu-content-info-remark'>
                        <span>备注:</span>
                        <textarea ref='remark' defaultValue=""
                            onChange={this.contactChange.bind(this, 'remark')} />
                    </div>
                    <div className='price-menu-content-info-control'>
                        <input className='price-menu-content-info-control-submit' type='button' defaultValue='提交报价单'
                        onClick={this.props.submitPriceMenu}/>
                    </div>
                </div>
            </div>
        )
    }
}

class Item extends Component {
    constructor(props) {
		super(props)
        this.pullSelectorItems = ['原厂件', '品牌件', '适用件']
	}

    componentDidMount() {
        this.drawCanvas()
    }

    drawCanvas() {
        let _itemDelete = this.refs['price-menu-content-list-item-delete']
        let _ctx = _itemDelete.getContext('2d')
        _ctx.strokeStyle = '#999'

        _ctx.beginPath()
        _ctx.moveTo(0, 0)
        _ctx.lineTo(12, 12)
        _ctx.stroke()

        _ctx.beginPath()
        _ctx.moveTo(12, 0)
        _ctx.lineTo(0, 12)
        _ctx.stroke()
    }

    setPartNameValue(value) {
        this.props.item.pname = value.replace(/\<br\/\>/g, "  ")
        // this.props.updateResult()
    }

    setNumberValue(value) {
        this.props.item.quantity = value
        this.props.updateResult()
    }

    setPriceValue(value) {
        this.props.item.price = value || 0
        this.props.updateResult()
    }

    setPriceValueRegExp(value) {
        if(!value || value.length < 1) value = '0'
        value = value.replace(/[^\d\.]/g, '') // 去掉不是数字或小数点的
        value = value.replace(/^0(\d+)/, '$1') // 去掉大于 1 的数字的开头 0
        value = value.replace(/(^\d+\.\d*)\./, '$1') // 去掉正常数字后面多余的小数点
        value = value.replace(/(0\.\d*)\./, '$1') // 去掉小于 1 的数字后面多余的小数点
        return value
    }

	setItem(item) {
        this.props.item.factory_type = item
        this.props.updateResult()
    }

    render() {
        let _item = this.props.item

        return (
            <div className='price-menu-content-list-item'>
                <div>{_item.num}</div>
                <div>
                    <div className='container-hyper-input'>
                        <HyperInput
                            placeholder='零件名称'
                            value={_item.pname.replace(/\<br\s?\/\>/g,"  ")}
                            setValue={this.setPartNameValue.bind(this)}/>
                    </div>
                </div>
                <div>{_item.pid}</div>
                <div>
                    <PullSelector
                        items={this.pullSelectorItems}
                        setItem={this.setItem.bind(this)}
                        value={_item.factory_type}/>
                </div>
                <div>
                    <NumberInput
                        max={99}
                        value={_item.quantity}
                        setValue={this.setNumberValue.bind(this)}/>
                </div>
                <div>
                    <span className='rmb-mark'>¥</span>
                    <div className='container-hyper-input'>
                        <HyperInput
                            placeholder='单价'
                            value={_item.price}
                            isNumber={true}
                            regExp={this.setPriceValueRegExp.bind(this)}
                            setValue={this.setPriceValue.bind(this)}/>
                    </div>
                    <canvas ref='price-menu-content-list-item-delete' className='price-menu-content-list-item-delete' width={12} height={12}
                        onClick={this.props.deleteClick}/>
                </div>
            </div>
        )
    }
}
