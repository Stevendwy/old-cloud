import React, {Component} from 'react'
import Root from '../root'
import Utils from "../utils"
import $ from 'min-jquery'
export default class PartDetailEng extends Root {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.listHash = {
            '零件OE号': {url:'/articles/parts_info', com: "all", },
            '适用车型': {url:'/articles/compatible_vehicle', com: "all", },
            '零件图片': {url:'/articles/compatible_vehicle', com: "all", },
        }
        this.baseEn = {
            "Basic": "基础信息",
            "OE Number": "零件OE号",
            "Part Image": "零件图片",
            "Applicable Veh": "适用车型"
        }
        
    }

    componentDidMount() {
        Utils.hideDom(".PriceLoadingShow");        
    }

    getPartItem() {
        let _switchDom = ""
        let caseItem = this.props.title
        if(lge === "en") {
            caseItem = this.baseEn[this.props.title]
        }
        switch(caseItem) {
            case "基础信息":
                _switchDom = <PartBaseBox
                                reqData = {this.props.reqData}
                                data = {this.props.partBaseData}    
                            />
                break;
            case "零件OE号":
                _switchDom = <PartOeBox
                                reqData = {this.props.reqData}   
                                data = {this.props.partOeData}
                             />
                break;
            case "适用车型":
                _switchDom = <PartUseCars
                                reqData = {this.props.reqData}
                                data = {this.props.partCarData}
                             />
                break;
            case "零件图片":
                _switchDom = <PartDetailImg
                                reqData = {this.props.reqData}
                                data = {this.props.partImgData}
                             />
                break;
        }
        return _switchDom;
    }

    render() {
        return(
            <div className="parteng-container">
                <div className="base-title">
                    <span>
                        {TR("品牌零件号")}：{this.props.detailPid}
                    </span>
                    <span>
                        {TR("零件名称")}：{this.props.detailLabel}
                    </span>
                    <img src={this.props.detailSrc} alt="品牌"/>
                </div>
                {this.getPartItem()}
            </div>
        )
    }
}

class PartBaseBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.mapKey = lge === "zh" 
                      ? [
                            {key:"EANumbers", value: "EA号:"},
                            {key:"PackingUnit", value: "包数:"},
                            {key:"QuantityPerPackingUnit", value: "数量/每包:"},
                            {key:"description", value: "描述:"},
                            {key:"replace_numbers", value: "替换件号:"},
                            {key:"label", value: "标签:"}            
                        ]
                      : [
                            {key:"EANumbers", value: "EA number:"},
                            {key:"PackingUnit", value: "Packages:"},
                            {key:"QuantityPerPackingUnit", value: "Quantity/Package:"},
                            {key:"description", value: "Description:"},
                            {key:"replace_numbers", value: "Supersession:"},
                            {key:"label", value: "Label:"}       
                        ] 
    }
    render() {
        let data = this.props.data
        return(
            <div className="part-base-box">
                <div className="box-title">
                    <b></b>
                    <span>{TR("基础信息")}</span>
                </div>
                <div className="base-box">
                    <div className="line">{TR("General 常规")}</div>
                    {
                        this.mapKey.map((item, index)=> {
                            let keys = item.key
                            if(data[keys]) {
                                return (
                                    <div className="row" key={index}>
                                        <span>{item.value}</span>
                                        <span>{data[keys]}</span>                                    
                                    </div>
                                )
                            }
                        
                        })
                    }
                    <div className="line">Criteria</div>
                    {
                        data.attributes.map((it, index)=> {
                            return(
                                <div className="row" key={index}>
                                    <span>
                                        {it.key}
                                    </span>
                                    <span>
                                        {it.value}
                                    </span>
                                </div>
                                )
                        })
                    }
                </div>
            </div>
        )
    }
}

class PartOeBox extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.mapBase = lge === 'zh'
                        ? [
                                {title:"厂商", key: "manufacture", align: "itemLeft"},
                                {title:"零件OE号", key:"oenumber", align: "itemRight"},
                                {title:"说明", key: "description", align: "itemLeft"},
                                {title:"进价(未含税)", key: "purchase_price_eot", align: "itemRight"},
                                {title:"销售价(含税)", key: "price", align: "itemRight"},
                          ]
                        : [
                            {title:"Manufacturer", key: "manufacture", align: "itemLeft"},
                            {title:"OE Number", key:"oenumber", align: "itemRight"},
                            {title:"Description", key: "description", align: "itemLeft"},
                            {title:"Cost VAT exclusive", key: "purchase_price_eot", align: "itemRight"},
                            {title:"Price VAT inclusive", key: "price", align: "itemRight"},
                          ]
    }

    componentWillMount() {
        // Utils.get("/articles/oe_parts_info", this.props.reqData, res => {
        // })
        this.setState({
            listData: [
                [{
                    "manufacture": "厂家", "oenumber": "零件oe号", "description": "说明", "inventory": "库存",
                    "area": "地区","purchase_price_eot": "进价(未含税)","price": "销售价","service_provider": "服务商"
                }],
                [{
                    "manufacture": "厂家", "oenumber": "零件oe号", "description": "说明", "inventory": "库存",
                    "area": "地区","purchase_price_eot": "进价(未含税)","price": "销售价","service_provider": "服务商"
                },{
                    "manufacture": "厂家", "oenumber": "零件oe号", "description": "说明", "inventory": "库存",
                    "area": "地区","purchase_price_eot": "进价(未含税)","price": "销售价","service_provider": "服务商"
                }],
            ]
        })
    }

    getTitle() {
        return(
            this.mapBase.map((item, index) => {
                return(
                    <div className="title-cell" key={index}>
                        {item.title}
                    </div>
                )
            })
        )
    }

    getListRow() {
        return(
            this.props.data.map((item, index) => {
                return(
                    <div className="list-form" key={index}>
                        {
                            item.map((it, ins) => {
                                return(
                                    <div className="list-row" key={ins}>
                                        {
                                            this.mapBase.map((ite, inde) => {
                                                let _key = ite.key
                                                let _class = "list-cell " + ite.align
                                                return(
                                                    <div className={_class} key={inde}>
                                                        {it[_key]}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })
        )
    }

    render() {
        return(
            <div className="part-oe-box">
                <div className="box-title">
                    <b></b>
                    <span>{TR("零件OE号")}</span>
                </div>
                <div className="list-box">
                    <div className="list-title">
                        {this.getTitle()}
                    </div>
                    {this.getListRow()}
                </div>
            </div>
        )
    }
}

class PartUseCars extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listData: [],
            listHidden: "",
            closeIndex: ""
        }
        this.closeIndex = []
        this.mapBase = lge === "zh"
                       ?  [
                            {title:"", key:"plusOrSub", },
                            {title:"车型", key:"label", },
                            {title:"年份", key:"year", },
                            {title:"Model", key:"model", },
                          ]
                        : [
                            {title:"", key:"plusOrSub", },
                            {title:"Label", key:"label", },
                            {title:"Year", key:"year", },
                            {title:"Model", key:"model", },
                           ]
    }

    componentWillMount() {
        this.setState({
            listData: [
                [{"label": "车型", "year": "年份", "model":"Model"}],
                [
                    {"label": "车型", "year": "年份", "model":"Model"},
                    {"label": "车型", "year": "年份", "model":"Model"}
                ],
                [{"label": "车型", "year": "年份", "model":"Model"}],
            ]
        })
    }

    closeItems(ins,flag){
		let _listHidden = false
		if(flag == "-"){
			_listHidden = true
		}
		if(this.closeIndex[ins]){
			if(this.closeIndex[ins] == 1){
				// debugger;
				this.closeIndex[ins] = -1

			}else{
				this.closeIndex[ins] = 1
			}
		}else{
			this.closeIndex[ins] = 1			
		}
		this.setState({
			listHidden: _listHidden,
			closeIndex: this.closeIndex
		})
	}

    getListData() {
        return(
            this.props.data.map((item, index) => {
                return(
                    <div className="list-form" key={index}>
                        {
                            item.map((it, ins) => {
                                let _className = ""
                                if(this.state.closeIndex[index] == 1){
									// if(index !== 0){
                                    _className = "" 
									// }
								}else {
                                    if(item.length > 1 && ins !== 0) {
                                        _className = " hidden"
                                    }
                                }
                                return(
                                    <div className={"list-row" + _className} key={ins}>
                                        {
                                            this.mapBase.map((ite, inde) => {
                                                let _plusOrSub = ""                                        
                                                let _key = ite.key
                                                if(item.length > 1 && ins == 0){  //如果列表大于一行并且在第一行
                                                    if(this.state.closeIndex[index]){   //如果
                                                        if(this.state.closeIndex[index] == 1){
                                                            _plusOrSub = "-"
                                                        }else{
                                                            _plusOrSub = "+"			
                                                        }
                                                    }else{
                                                        _plusOrSub = "+"
                                                    }
                                                }

                                                if(_key === "plusOrSub") {
                                                    return(
                                                        <div className="list-cell plusOrSub" key={inde} onClick={this.closeItems.bind(this,index,_plusOrSub)}>
                                                            {_plusOrSub}
                                                        </div>
                                                    )
                                                }else {
                                                    return(
                                                        <div className="list-cell" key={inde}>
                                                            {it[_key]}
                                                        </div>
                                                    )
                                                }
                                                
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })
        )
    }

    getTitle() {
        return(
            this.mapBase.map((item, index) => {
                return(
                    <div className="title-cell" key={index}>
                        {item.title}
                    </div>
                )
            })
        )
    }

    render() {
        return(
            <div className="part-use-box">
                <div className="box-title">
                    <b></b>
                    <span>
                        {TR("适用车型")}：
                    </span>
                </div>
                <div className="list-box">
                    <div className="list-title">
                        {this.getTitle()}
                    </div>
                    {this.getListData()}
                </div>
                
            </div>
        )
    }
}

class PartDetailImg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isError: false
        }
    }

    changeImg() {
        this.setState({
            isError: true
        })
    }

    render() {
        return(
            <div className="part-detail-img">
                <div className="box-title">
                    <b></b>
                    <span>
                        {TR("零件图片")}
                    </span>
                </div>
                <div className="img-container">
                    {
                        this.state.isError ?
                        <img src="/img/p_jiegoutu.png" className="no-picture" alt="无零件图"/>
                        :
                        <img src={this.props.data} onError={this.changeImg.bind(this)} alt=""/>   
                    }
                </div>
            </div>
        )
    }
}