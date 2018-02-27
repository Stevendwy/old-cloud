import React from 'react'
import VCP from '../vcp'
import Utils from '../utils'
import Pagination from 'pagination-react'
import CardSelector from '../card_selector'
import { fail } from 'assert'
import { basename } from 'path'
import BrandWall from './brandwall'
export default class PartEng extends VCP {
    constructor(props) {
        super(props)
        this.state = {
            show: this.type === props.type,      //vcp里要带的
            showNumberAndClear: false,           //❎  ❎ 显示与否
            engResultData: null,                 //🔍  结果数据
            CardSelectorMout: false,             //是否构建浮窗
            hasResult: false,                    //是否有结果
            searchPid: "",                        //搜索的pid
            total_page: 1,                        //有多少页
            amount_data: 0,                       //共有多少结果
            cardTitleList: [],                    //卡片标签数组
            chooseCard: "",                       //选择的标签
            partOeData: [],                       //oe号数据
            partCarData: [],                      //适用车型数据
            partImgData: "",                       //图片地址
            baseData: [],                          //基础数据  号码和图片
            hasMore: false,                        //是否有更多数据
            isOpen: false,                         //是否为展开状态
            errorShow: false,                      //显示报错信息？
            backShow: true,                        //显示默认背景图？
            selectedCount: 1,                      //默认请求第一页
            historys: [],                          //历史记录数据
            searchType: Utils.params().searchtype ? Utils.params().searchtype : "eng",                     //默认选定搜索类型
            ensureType: Utils.params().searchtype ? Utils.params().searchtype : "eng",                     //确定的品牌
            manufacturerSelected: "all",          //选择的品牌
            factorySelected: "all",               //选择的厂商
            factoryList: [],                      //厂商列表
            manufacturersList: [],                //品牌列表
            manyBrandShow: true,                 //品牌墙是否显示
            certainBrand: "all"                   //选择确定的品牌
        }
        this.historyCoby = []
        this.searchType = Utils.params().searchtype ? Utils.params().searchtype : "eng"
        this.mapKey =  window.lge === "en" 
                        ? [
                            {title: "Brand", width: "14%", key: "supplier_url"},
                            {title: "Part Name", width: "22%", key: "label"},
                            {title: "Article Number", width: "10%", key: "article_number"},
                            {title: "Model", width: "10%", key: "model"},
                            {title: "Description", width: "26%", key: "comments"},
                            {title: "Image ", width: "10%", key: "article_url"},
                            {title: "", width: "4%", key: "detail"},
                            {title: "", width: "4%", key: "cart"},
                        ]
                        : [
                            {title: "品牌", width: "14%", key: "supplier_url"},
                            {title: "零件名称", width: "22%", key: "label"},
                            {title: "品牌编号", width: "10%", key: "article_number"},
                            {title: "型号", width: "10%", key: "model"},
                            {title: "注释", width: "26%", key: "comments"},
                            {title: "零件图片", width: "10%", key: "article_url"},
                            {title: "", width: "4%", key: "detail"},
                            {title: "", width: "4%", key: "cart"},
                        ]
                        
        this.mapFactoryKey = window.lge === "en" 
                            ? [
                                {title: "Brand", width: "14%", key: "supplier_url"},
                                {title: "Part Name", width: "20%", key: "label"},
                                {title: "Company", width: "10%", key: "label"},                                
                                {title: "Article Number", width: "10%", key: "article_number"},
                                {title: "Model", width: "8%", key: "model"},
                                {title: "Description", width: "24%", key: "comments"},
                                {title: "Image ", width: "10%", key: "article_url"},
                                {title: "", width: "4%", key: "detail"},
                                // {title: "", width: "4%", key: "cart"},
                              ]
                            : [
                                {title: "品牌", width: "14%", key: "supplier_url"},
                                {title: "零件名称", width: "20%", key: "label"},
                                {title: "厂商", width: "10%", key: "manufacturers"},
                                {title: "品牌编号", width: "10%", key: "article_number"},
                                {title: "型号", width: "8%", key: "model"},
                                {title: "注释", width: "24%", key: "comments"},
                                {title: "零件图片", width: "10%", key: "article_url"},
                                {title: "", width: "4%", key: "detail"},
                                // {title: "", width: "4%", key: "cart"},
                              ]
        this.enterManufacture = null;
    }

    clear() {
        this.refs.input.value = ""
        this.setState({
            showNumberAndClear: false
        })
    }

    callbackshow() {
        // console.log("backshow")
	}

    componentDidMount() {
        if(Utils.params().number) {
            this.refs.input.value = Utils.params().number
            this.searchEngPart()
        }
    }

    inputChange() {
        let _value = this.refs.input.value
        let _length = _value.length
        this.checkHistory(_value)
        if(_length > 0) {
            this.setState({showNumberAndClear: true})
        }else {
            this.setState({showNumberAndClear: false})
        }
    }

    keyPress(e) {
        let _keyCode = e.which || e.keyCode
        if (_keyCode === 13) {
            this.searchEngPart()
        }
    }

    searchEngPart() {                  //搜索
        this.setState({
            manufacturerSelected: "all",
            factorySelected: "all",
            ensureType: this.searchType
         },()=> {
            let value = this.refs.input.value
            if(!value) return
            Utils.showDom(".partEng-search-loading")
            this.setState({
                searchPid: ""
            },() => {
                this.getPageData(1)
            })
        })
    }

    chooseManfacture(manufacturerSelected) {
        this.setState({
            manufacturerSelected: manufacturerSelected
        },() => {
            this.getPageData(1)            
        })
    }

    choosefactory(selected) {
        this.setState({
            factorySelected:selected,
            manufacturerSelected: 'all'
        },()=> {
            this.getPageData(1)
        })
    }

    getFactoryTitle() {
        // console.log(this.state.factoryList)
        return(
            this.state.factoryList.map((item, index)=> {
                {
                    let _className = ""
                    if(this.state.factorySelected === item.manufacturer_matchcode) {
                        _className = "selected"
                    }
                    return(
                        <b key={index} className={_className} onClick={this.choosefactory.bind(this,item.manufacturer_matchcode)}>
                            <span>
                                {item.manufacturer}
                            </span>
                            ({item.amount})
                            {/* {item.supplier +"("+ item.amount +")"} */}
                            {/* ({item.amount}) */}
                        </b>
                    )
                }
            })
        )
    }

    getBrandTitle() {
        return(
            this.state.manufacturersList.map((item, index)=> {
                {
                    let _className = ""
                    if(this.state.manufacturerSelected === item.supplier_matchcode) {
                        _className = "selected"
                    }

                    return(
                        <b key={index} className={_className} onClick={this.chooseManfacture.bind(this,item.supplier_matchcode)}>
                            <span>
                                {item.supplier}
                            </span>
                            ({item.amount})
                            {/* {item.supplier +"("+ item.amount +")"} */}
                            {/* ({item.amount}) */}
                        </b>
                    )
                }
            })
        )
    }

    getEngHeader() {
        // console.log(this.state.ensureType)
        if(this.state.ensureType === "eng") {
            return (
                this.mapKey.map((item, index) => {
                    return(
                        <div className="part-eng-title" key={index} style={{width: item.width}}>
                            {item.title}
                        </div>
                    )
                })
            )
        }else {
            return (
                this.mapFactoryKey.map((item, index) => {
                    return(
                        <div className="part-eng-title" key={index} style={{width: item.width}}>
                            {item.title}
                        </div>
                    )
                })
            )
        }
    }


    getHasTitle(_obj, chooseed, id) {
        if(id) {
            Utils.get("/articles/article_priority",{id}, res=> {
                // console.log("rrrrrr")
            })
        }

        Utils.get("/articles/details", _obj, res => {
            if(res.titles.indexOf(chooseed) == -1) {
                chooseed = res.titles[0]
            }
            this.setState({
                CardSelectorMout: true,
                cardTitleList: res.titles,
                chooseCard: chooseed,
                partOeData: res.oedata,
                partCarData: res.cardata,
                partImgData: res.imgdata[0],
                partBaseData: res.baseinfodata
            })
        })
        // Utils.get("/articles/oe_parts_info", _obj, res => {
        //     if(res.code == 1){
        //         this.state.cardTitleList[0] = "零件OE号"
        //         this.setState({
        //             CardSelectorMout: true,
        //             cardTitleList: this.state.cardTitleList,
        //             chooseCard: chooseed,
        //             partOeData: res.data
        //         })
        //     }else {
        //         if(chooseed == "零件OE号") {
        //             this.setState({
                        
        //             })
        //         }
        //         // noError = false
        //     }
        // }, true)

        // Utils.get("/articles/compatible_vehicle", _obj, res => {
        //     if(res.code == 1){
        //         if(this.state.cardTitleList[1]) {
        //             this.state.cardTitleList.splice(1, 0, "适用车型")
        //         }else {
        //             this.state.cardTitleList[1] = "适用车型"
        //         }
        //         this.setState({
        //             CardSelectorMout: true,
        //             cardTitleList: this.state.cardTitleList,
        //             chooseCard: chooseed,
        //             partCarData: res.data
        //         })
        //     }else {
        //         // noError = false                
        //     }
        // }, true)

        // Utils.get("/articles/article_img", _obj, res => { 
        //     if(res.code == 1){
        //         if(this.state.cardTitleList[1]) {
        //             this.state.cardTitleList[2] = "零件图片"
        //         }else {
        //             this.state.cardTitleList[1] = "零件图片"
        //         }
        //         this.setState({
        //             CardSelectorMout: true,
        //             cardTitleList: this.state.cardTitleList,
        //             chooseCard: chooseed,
        //             partImgData: res.article_url
        //         })
        //     }else {
        //         noError = false                
        //     } 
        // }, true)
    }

    detailShow(article_number, supplier_matchcode, code, img, label, id) {
        let _obj = {
            "article_number": article_number,
            "supplier_matchcode": supplier_matchcode
        }
        this.setState({
            detailPid: code,
            detailSrc: img,
            detailLabel: label
        })
        this.state.cardTitleList = []
        this.enterManufacture = supplier_matchcode
        this.article_number = article_number
        this.getHasTitle(_obj,TR("基础信息"), id)
    }

    showImgDetail(src,article_number, supplier_matchcode, code, img, label, id) {
        if(!src) return
        this.setState({
            detailPid: code,
            detailSrc: img,
            detailLabel: label
        })
        let _obj = {
            "article_number": article_number,
            "supplier_matchcode": supplier_matchcode
        }
        this.state.cardTitleList = []
        this.enterManufacture = supplier_matchcode
        this.article_number = article_number
        this.getHasTitle(_obj,TR("零件图片"), id)

        // this.enterManufacture = manufacturer_matchcode
        // this.setState({
        //     CardSelectorMout: true,
        //     cardTitleList: ["零件OE号", "适用车型", "零件图片"],
        //     chooseCard: '零件图片'
        // })
    }

    getEngBody() {
        if(this.state.engResultData) {
            let mapData = this.mapKey
            if(this.state.ensureType == "oe") {
                mapData = this.mapFactoryKey
            }
            return (
                this.state.engResultData.map((item, index)=> {
                    return(
                        <div className="result-row" key={index}>
                            {
                                mapData.map((it, ins) => {
                                    let _key = it.key                                 
                                    if(_key === 'supplier_url') {
                                        return(
                                            <div className="result-cell" key={ins} style={{width:it.width}}>
                                                <img src={item[_key]} alt=""/>
                                                {/* <img src='https://test.007vin.com/stcimgs/img/2e0804f99852ce93d5e2469e8a0f8edc.jpg' alt=""/> */}
                                                
                                                <span className="cell-hover">
                                                    {item.supplier}
                                                </span>
                                            </div>
                                        )
                                    }else if(_key === 'detail') {
                                        return(
                                            <div className="result-cell detail" key={ins} onClick={this.detailShow.bind(this, item.article_number, item.supplier_matchcode, item.article_number, item.supplier_url, item.label, item.id)} style={{width:it.width}}> 
                                                <span>{TR("详情")}</span>
                                            </div>
                                        )
                                    }else if(_key === 'cart') {
                                        return(
                                            <div className="result-cell cart" key={ins} style={{width:it.width}}>
                                            </div>
                                        )
                                    }else if(_key === 'manufacturers') {
                                        return(
                                            <div className="result-cell flex-column" key={ins} style={{width:it.width}}>
                                                {
                                                item[_key] ? item[_key].map((i,j)=> {
                                                        return(
                                                            <b key={j}>
                                                                {i}
                                                            </b>
                                                        )
                                                    }) : ""
                                                }
                                                <div className="flex-box">
                                                    {item[_key] ? item[_key].join("、") : ""}
                                                </div>
                                            </div>
                                        )
                                    }
                                    else if(_key === 'article_url') {
                                        return(
                                        <div className="result-cell partImg" key={ins} style={{width:it.width}} onClick={this.showImgDetail.bind(this,item[_key],item.article_number,item.supplier_matchcode, item.article_number, item.supplier_url, item.label, item.id)}>
                                            <img src={item[_key]} alt=""/>
                                            {/* <img src="https://test.007vin.com/stcimgs/img/2e0804f99852ce93d5e2469e8a0f8edc.jpg" alt=""/> */}
                                        </div>
                                        )
                                    }else if(_key === 'article_number'){
                                        let value = item[_key]
                                        let textArray
                                        if(this.state.searchPid) {
                                            textArray = value.split(this.state.searchPid)                                            
                                        }else {
                                            textArray = [value,""]                                            
                                        }
                                        return(
                                            <div className="result-cell" key={ins} style={{width:it.width}}>
                                                {textArray[0]}
                                                <span>
                                                    {value.indexOf(this.state.searchPid) == "-1" ? "" : this.state.searchPid}
                                                </span>
                                                {textArray[1]}
                                            </div>
                                        )
                                    }
                                    else {
                                        return(
                                            <div className="result-cell" key={ins} style={{width:it.width}}>
                                                {item[_key]}
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    )
                })
            )
        }
    }

    reSetResult() {
        this.refs.input.value = ""
        this.refs.input.focus()
        this.setState({
            errorShow: false,
            showNumberAndClear: false,
            searchPid: "",
            manufacturerSelected: "all",
            backShow: this.state.certainBrand === "all" ? true : false
        })
    }

    getPageData(index, brand) { //分页
        let value = this.refs.input.value   
        let _obj
        let _url
        
        _obj = {
            supplier_matchcode: this.state.certainBrand === "all" ? this.state.manufacturerSelected : this.state.certainBrand, 
            // supplier_matchcode: brand || this.state.manufacturerSelected,             
            page: index
        }
        if(_obj.supplier_matchcode == "all" && value =="") {
            return;
        }

        // if(this.state.ensureType === 'oe') {
        // console.log(this.state.searchType)
        if(this.state.searchType === 'oe') {
            _url = "/articles/oe_engine_search"
            _obj.manufacturer_matchcode = this.state.factorySelected
            _obj.oe_number = value
        }else {
            _url = "/articles/engine_search"
            _obj.article_number = value
        }

        Utils.get(_url, _obj, res=> {
            Utils.hideDom(".partEng-search-loading")
            if(res.code == 1) {
                this.updateIndex(index)
                this.setState({
                    engResultData: res.data,
                    amount_data: res.amount_data,
                    hasResult: true,
                    searchPid: value,
                    total_page: res.amount_page,
                    manufacturersList: res.suppliers,
                    amount_data: res.amount_data,
                    errorShow: false,
                    backShow: false,
                    factoryList: res.manufacuturers || [],
                    searchType: this.searchType,
                    allBrandTitle: brand ? true : false
                },() => {
                    let brandsbox = this.refs.brandslist
                    let _hasMore = false
                    let _hasfactoryMore = false
                    if(brandsbox && brandsbox.clientHeight > 40) {
                        _hasMore = true
                    }else {
                        _hasMore = false                    
                    }
                    let factorylist = this.refs.factorylist
                    // let _hasMore = false
                    if(factorylist && factorylist.clientHeight > 40) {
                        _hasfactoryMore = true
                    }else {
                        _hasfactoryMore = false                    
                    }

                    this.setState({
                        hasMore: _hasMore,
                        hasFactoryMore: _hasfactoryMore
                    })
                })
            }else {
                if(index === 1) {
                    this.setState({
                        errorShow: true,
                        hasResult: false,
                        backShow: false,
                        searchPid: value,
                    })
                }else {
                    alert("没有找到相关信息")
                }
            }
        },true)
    }

    hiddenCard() {
        this.setState({
            CardSelectorMout: false
        })
    }
    toggleHasMore() {
        this.setState({
            // hasMore: !this.state.hasMore,
            isOpen: !this.state.isOpen
        })
    }
    toggleHasFactoryMore() {
        this.setState({
            isFactoryOpen: !this.state.isFactoryOpen
        })
    }

    historyClick(part) {
        this.refs.input.value = part
        this.setState({
            showHistorys: false,
            showNumberAndClear: true
        })
        this.searchEngPart()
    }

    radioChange(type) {
        this.setState({
            searchType: type,
            ensureType: type,
            showNumberAndClear: false,
            showHistorys: false,
            hasResult: false,
            certainBrand: "all",
            errorShow: false,
            backShow: true,
            manyBrandShow: type !== "oe"
        },() => {
            this.getHistory()
            this.refs.input.value = ""
            this.refs.input.focus()
        })
        this.searchType = type
    }

    getHistory() {
        let _url;
        if(this.state.searchType == "eng") {
            _url = "/articles/article_number_history"
        }else {
            _url = "/articles/article_oenumber_history"            
        }
        Utils.get(_url, null, res => {
            this.setState({
                historys: res.data,
                showHistorys: res.data.length ? true : false
            })
            this.historyCoby = JSON.parse(JSON.stringify(res.data));            
        })
    }

    blurHistory() {
        setTimeout(() => this.closeHistorys(), 400)   
    }

    closeHistorys() {
        this.setState({
            showHistorys: false
        })
    }

    checkHistory(value) {
        let historyCoby = []
        this.historyCoby.map((item,index)=>{
            if(item[0].indexOf(value) !== -1){
                historyCoby[historyCoby.length] = item
            }
        })
        if(value == ""){
            historyCoby = this.historyCoby
        }
        let _showHistorys = true
        if(historyCoby.length == 0){
            _showHistorys = false
        }else{
            _showHistorys = true
        }

        this.setState({
            historys: historyCoby,
            showHistorys:_showHistorys
        })
    }

    moreHistorys() {
        let url;
        if(this.state.searchType == 'oe') {
            url = "/history/articles_oenumber_page"
        }else {
            url = "/history/articles_number_page"
        }
        location.href = url
    }

    chooseItemBrand(brand) {
        this.setState({
            certainBrand: brand,
            backShow: false
        },()=>{
            this.getPageData(1, brand)            
        })
    }

    clearBrand() {
        this.setState({
            certainBrand: "all",
            hasResult: false,
            errorShow: false,
            backShow: true
        })
    }
    showAllBrand() {
        this.setState({
            hasResult: false,
            errorShow: false,
            backShow: true
        })
    }

    render() {
        let _historys
        let _historyClick = this.historyClick.bind(this)
        let _radioChange = this.radioChange.bind(this)
        var _showNumberAndClear = this.state.showNumberAndClear
        if (this.state.historys){
            _historys = this.state.historys.map((item, index) => {
                return (
                    <a className='history' key={index}
                        onClick={() => _historyClick(item[0] || '')}>
                        <span>{item[0] || ''}</span>
                        {/* <span>{item[2] || ''}</span> */}
                    </a>
                )
            })
        }
        return(
            <div className="part-eng-container">
                <div className="part-eng-box">
                    <div className="eng-header">
                        <div className='container-radios'>
                            {/* {this.radios()} */}
                            <span className='container-radio'>
                                <input type="radio" name="brand" value={"品牌编号"}
                                onClick={()=> _radioChange("eng")}
                                defaultChecked={this.state.searchType === 'eng'}/>
                                <label htmlFor="品牌编号">{TR("品牌编号")}</label>
                            </span>
                            <span className='container-radio'>
                                <input type="radio" name="brand" value={"原厂OE号"}
                                onClick={()=> _radioChange("oe")}
                                defaultChecked={this.state.searchType === 'oe'}/>
                                <label htmlFor="原厂OE号">{TR("原厂OE号")}</label>
                            </span>
                        </div>
                        <div className="search-container">
                            <div className="left-brand">
                                <span onClick={this.showAllBrand.bind(this)}>{TR("全部品牌")}&nbsp;</span>  >
                                {
                                    this.state.certainBrand !== "all"
                                    ? <div className='choosed-item'>
                                        {this.state.certainBrand}
                                        <div className='clear' onClick={this.clearBrand.bind(this)}></div>
                                    </div>
                                    : null
                                }
                            </div>
                            <input type="text" ref="input" 
                                className="input"
                                onFocus= {this.getHistory.bind(this)}
                                onBlur = {this.blurHistory.bind(this)}
                                placeholder={this.state.searchType == "eng" ? TR("输入品牌编号") : TR("输入原厂完整OE号")} 
                                onChange={this.inputChange.bind(this)}
                                onKeyPress={this.keyPress.bind(this)}
                            />
                            <div className={_showNumberAndClear ? 'clear' : 'clear hidden'}
                                onClick={this.clear.bind(this)}></div>
                            <input type="button" className="search" onClick={this.searchEngPart.bind(this)} value={TR("查询")}/>
                            <span className="partEng-search-loading"></span>
                        </div>
                        <div className='container-history' style={{display: this.state.showHistorys ? 'block' : 'none'}}>
                            {_historys}
                            <div className='container-more'>
                                <a className='more'
                                    onClick={this.moreHistorys.bind(this)}><div>{TR("更多历史")}</div></a>
                                <a className='close'
                                    onClick={this.closeHistorys.bind(this)}><div>{TR("关闭")}</div></a>
                            </div>
                        </div>
                    </div>
                    <div className="eng-result">
                        <div className={this.state.hasResult ? "center-result-box" : "hidden"}>
                            {
                                this.state.certainBrand !== "all"
                                ?   <div className="special-title">
                                        {
                                            lge === "zh" 
                                            ? "零零汽为您找到品牌"
                                            : "Find results for you "
                                        }
                                        <span>{this.state.certainBrand}</span> 
                                        {
                                            lge == "zh"
                                            ? "相关结果:"
                                            : ":"
                                        }                                
                                    </div>
                                :   <div className="table-title">
                                        {
                                            window.lge === "en"
                                            ? `Find relevant results for ${this.state.searchPid}：`
                                            : <span>零零汽为您找到{this.state.ensureType == "eng" ? "品牌编号" : "原厂OE号"} <b>{this.state.searchPid}</b>相关结果：</span>
                                        }
                                        <div className={this.state.isFactoryOpen ? "overflow-box" : "overflow-box over-flow"} style={{display: this.state.ensureType === "oe" ? "block" : "none"}}>
                                            <div className="table-brands" ref="factorylist">
                                                <span>{TR("厂商")}：</span>
                                                <div className="brand-container">
                                                    {this.getFactoryTitle()}
                                                </div>
                                                <span className={this.state.hasFactoryMore ? "hasMore" : "hidden"} onClick={this.toggleHasFactoryMore.bind(this)}>
                                                    {this.state.isFactoryOpen ? TR("收起全部") : TR("显示全部")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={this.state.isOpen ? "overflow-box" : "overflow-box over-flow"}>
                                            <div className="table-brands" ref="brandslist">
                                                <span>{TR("品牌")}：</span>
                                                <div className="brand-container">
                                                    {this.getBrandTitle()}
                                                </div>
                                                <span className={this.state.hasMore ? "hasMore" : "hidden"} onClick={this.toggleHasMore.bind(this)}>
                                                    {this.state.isOpen ? TR("收起全部") : TR("显示全部")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                            }
                            
                            <div className="result-box">
                                <div className="box-header">
                                    {this.getEngHeader()}
                                </div>
                                {this.getEngBody()}
                            </div>
                            <div className={this.state.total_page > 1 ? "" : "hidden"}>
                                <Pagination
                                    count={this.state.total_page}                                
                                    groupCount={10}
                                    setUpdate={handle => this.updateIndex = handle}
                                    callback={(index) => {
                                        this.getPageData(index)
                                    }}
                                />
                            </div>
                        </div>
                        <div className={this.state.errorShow ? "center-result-error" : "hidden"}>
                            <div>
                                {this.state.ensureType === "eng" ?
                                    <p>
                                        {
                                            lge === "zh" 
                                            ?   <div> 
                                                    很抱歉，品牌编号
                                                    <span>{this.state.searchPid}</span>
                                                    没有相关的品牌件。 
                                                </div>
                                            : `Sorry! no result finded for article ${this.state.searchPid}.`
                                        }
                                        
                                    </p>
                                    :
                                    <p>
                                        {
                                            lge === "zh"
                                            ? <div>
                                                很抱歉，原厂OE号
                                                <span>{this.state.searchPid}</span>
                                                没有相关的品牌件。
                                              </div>
                                            : `Sorry! no result finded for OE Number ${this.state.searchPid}. `
                                        }
                                    </p>

                                //    "抱歉未查到该品牌编号信息：请核对品牌编号是否正确" :
                                //    "抱歉未查到该原厂OE号信息: 请核对原厂OE号是否正确"
                                }
                            </div>
                            <p className="blur-text">
                                {TR("温馨提示：请检查您的输入是否正确")}&nbsp;&nbsp;&nbsp;&gt;&gt;
                                <span onClick={this.reSetResult.bind(this)}>
                                    {TR("重新输入")}
                                </span>
                            </p>
                            
                        </div>
                        {
                            this.state.manyBrandShow 
                            ? <div className={this.state.backShow ? "wall-container" : "hidden"}>
                                <BrandWall
                                    chooseItem = {this.chooseItemBrand.bind(this)}
                                />
                              </div>
                            : <div className={this.state.backShow ? "back-null-img" : "hidden"}>
                                <img src="/img/p_eng_null.png" alt=""/>
                              </div>
                        }
                    </div>
                    {
                        this.state.CardSelectorMout ?
                        <CardSelector
                            titles = {this.state.cardTitleList}
                            chooseTitle = {this.state.chooseCard}
                            toresult = {()=>{}}
                            specialEng= {true}
                            hidden = {this.hiddenCard.bind(this)}
                            reqData = {{article_number: this.article_number, manufacturer_matchcode: this.enterManufacture}}
                            partOeData = {this.state.partOeData}
                            partCarData = {this.state.partCarData}
                            partImgData = {this.state.partImgData}
                            detailPid = {this.state.detailPid}
                            detailSrc = {this.state.detailSrc}
                            detailLabel = {this.state.detailLabel}
                            partBaseData = {this.state.partBaseData}
                        />
                        :
                        null
                    }
                </div>
            </div>
        )
    }
}
