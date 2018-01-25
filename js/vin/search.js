import React from 'react'
import Root from '../root'
import SearchVIN from './search_vin'
import FloatWindow from '../part/floatwindow'
import Utils from '../utils'
import SearchError from './search_error'
import CloseCanvas from 'close-canvas-react'

export default class Search extends Root {
    constructor() {
        super()  
        this.radioBrands = lg.radioBrands[lge]
        // this.radioBrands = [
        //     {
        //         cn: '全部品牌',
        //         en: 'all',
        //         url: "",
        //         placeholder: "输入17位VIN车架号"
        //     },{
        //         cn: '宝马',
        //         en: 'bmw',
        //         url: "/img/bmw.png",
        //         placeholder: "输入宝马后7位车架号"
        //     },{
        //         cn: 'MINI',
        //         en: 'minis',
        //         url: "/img/minis.png",
        //         placeholder: "输入MINI后7位车架号"
        //     },{
        //         cn: '奔驰',
        //         en: 'benz',
        //         url: "/img/benz.png",
        //         placeholder: "输入奔驰后8位车架号"
        //     },{
        //         cn: 'smart',
        //         en: 'smart',
        //         url: "/img/smart.png",
        //         placeholder: "输入smart后8位车架号"
        //     },{
        //         cn: '捷豹',
        //         en: 'jaguar',
        //         url: "/img/jaguar.png",
        //         placeholder: "输入捷豹后7位车架号"
        //     },{
        //         cn: '路虎',
        //         en: 'land_rover',
        //         url: "/img/land_rover.png",
        //         placeholder: "输入路虎后8位车架号"
        //     },{
        //         cn: '玛莎拉蒂',
        //         en: 'maserati',
        //         url: "/img/maserati.png",
        //         placeholder: "输入玛莎拉蒂后7位车架号"
        //     }, 
        // ]
        this.brands = 'all' //默认选择了'全部品牌'
        this.currentBrands = 'all' //当前结果的品牌
        this.searchVIN = '' //保存当前搜索的 vin
        this.choosebrand = ""
        this.state = {
            carInfoSearchshow: false,
            selectedRadioIndex: 0,
            historys: null,
            showHistorys: false,
            mainGroups: [],
            mainGroupsCoby: [], //用于奔驰传下去一个遍历的
            currentBrands: "",
            carInfos: null,
            // showSearch: false //调试，是否显示搜索，默认显示
            showSearch: true, //是否显示搜索，默认显示
            neverSearch: true, //从未点击过搜索
            floatWindowShow: false,
            baseBrands: [],
            vinCarType: "",   //vin对应的车型
            showFloatWindow: false,
            toastShow: false,
            likenessVin: "", //存相似车架号
            errorMsg: "",
            netError: false,
            staticBradnUrl: "",
            staticPlaceholder: TR("输入17位VIN车架号"),
            brandurl: "",
            listType: localStorage.getItem("listType") ? localStorage.getItem("listType") :"imgList",
            newStart: true, //是否未点击搜索的主组前
            errorShow: false, //配置信息notfind显示
            partVinInput: false, //显示clear零件号搜索
            mainClearshow: false,
            mainErrorshow: false,
            imglogo: '#', // 车型参考图片
            subImgShow: true, // 配置图片是否显示
            keyWords: [],
            keyWordsShow: false,
            carsDataList: []
        }
        window.changeListTypeCallBack = this.changeListType.bind(this)
        this.bridges()
        this.currentMainGroups = []
        this.historyCoby = []
        this.baseType = ""
        window.clearPartSearch = this.partVinInputClear.bind(this)
    }

    componentWillUnmount(){
        window.clearPartSearch = null
        window.changeListTypeCallBack = null
    }
    

    componentDidMount() {
        window.indexFlag = "vinPage"
        this.props.showSearch(() => {
            this.setState({
                showSearch: true
            }, this.props.hiddenCarInfo())
        })
        Model.baseBrand(res => {
            this.setState({
                baseBrands: res.data
            })
        })
    }

    getkeyWordsData(){
        Utils.get("/engine/search_comp",{brand:this.currentBrands, type:"p"}, res=>{
            this.setState({
                keyWords: res.data
            })
        })
    }

    clearPartSearch(){
        this.refs.vinPart.value = ""
    }
    
    bridges() {
        this.searchVINResponseRadioChange = null //searchVIN 响应 radios change
    }

    getClassName() {
        let _showClass = Utils.supportShrink() ? 'shrink' : 'hidden'
        let _className = 'container-search ' + _showClass
        if (this.state.showSearch) _className = 'container-search enlarge'
        return _className
    }

    focus() {
        Model.historys(this.brands, res => {
            this.openHistorys(res.data)
            this.historyCoby = JSON.parse(JSON.stringify(res.data))
        })
    }

    blur() {
        //延时优雅处理 blur
        setTimeout(() => this.closeHistorys(), 400)
    }

    search(value, callback) {
        this.searchVIN = value
        this.inputValue(value)
        if (!value) return
        let length = this.searchVIN.length
        
        if(this.brands == "all"){
            if(length < 17){
                this.setState({
                    neverSearch: true,
                    // errorMsg: "抱歉，您输入的车架号不足<span>17</span>位。",
                    // errorMsg: lg.error17[lge],
                    errorMsg: TR("error17"),               
                    toastShow: true
                })
                return;
            }
        }else if(this.brands == "land_rover" || this.brands == "benz" || this.brands == "smart"){
            if(length!==8 && length!==17){
                this.setState({
                    neverSearch: true,
                    // errorMsg: "抱歉，您输入的车架号不是<span>8</span>或<span>17</span>位。",
                    errorMsg: TR("error8to17"),
                    toastShow: true
                })
                return;
            }
        }else{
            if(length !== 7 && length !== 17){
                this.setState({
                    neverSearch: true,
                    // errorMsg: "抱歉，您输入的车架号不是<span>7</span>或<span>17</span>位。",
                    // errorMsg:lg.error7to17[lge],
                    errorMsg: TR("error7to17"),
                    
                    toastShow: true
                })
                return;
            }
        }
        
        let _state = {subImgShow: true}
        this.setState({
            neverSearch: true,
            toastShow: false
        })
        // Utils.showDom(".search-loading-container", "flex")        
        // Utils.get("/parse/vins", {vin: value}, res =>{  //解析vin
        //     let _carsDataList =  res.data.split("-")
        //     _carsDataList[3] = value
        //     this.setState({
        //         carsDataList: _carsDataList
        //     },()=> {
        //         Utils.showDom(".search-loading-container .page-box", "flex")
        //         Model.inquire(value, this.brands, resInquire => {
        //             Utils.hideDom(".search-loading-container")
        //             Utils.hideDom(".search-loading-container .page-box")
        //             let data = resInquire
        //             switch (data.code) {
        //                 case 4001:
        //                     _state = {
        //                         floatWindowShow: true,
        //                         showFloatWindow: true,
        //                         neverSearch: true,
        //                         likenessVin: "",
        //                         dataList: null,
        //                         specialBrand: false
        //                     }
        //                     break;
        //                 case 4005:
        //                     this.searchVIN = value
        //                     _state = {
        //                         specialBrand: data.brand,
        //                         specialTitle: data.title,
        //                         specialData: data.data,
        //                         specialValue: value,
        //                         toastShow: false,
        //                         // carInfos: ["车型："+data.vins],
        //                         likenessVin: "",
        //                         vinCarType: data.vins,
        //                         netError: false,
        //                         neverSearch: false,
        //                         errorShow: false,
        //                         brandurl: data.brandurl
        //                     }
        //                     break;
        //                 case 4003:
        //                     _state = {
        //                         specialBrand: false,
        //                         errorShow: false,
        //                         toastShow: true,
        //                         neverSearch: true,
        //                         likenessVin: "",
        //                         dataList: data.data
        //                     }
        //                     break;
        //                 case 9: //数据维护返回
        //                     _state = {
        //                         specialBrand: false,                                  
        //                         errorMsg: data.msg,
        //                         errorShow: false,
        //                         neverSearch: true,
        //                         likenessVin: "",
        //                         dataList: null
        //                     }
        //                     break;
        //                 case 3: //有类似车架号提示
        //                     _state = {
        //                         specialBrand: false,                        
        //                         likenessVin: data.vins,
        //                         // errorMsg: "抱歉,没有找到相关信息。<br/>.是否需要查询<span style='cursor:default;text-decoration:none'>" + data.vins + "</span>",
        //                         errorMsg: data.msg,
        //                         toastShow: true,
        //                         neverSearch: true,
        //                         netError: false,
        //                         dataList: null
        //                     }
        //                     break;
        //                 case 2: //
        //                     _state = {
        //                         // errorMsg: "抱歉，没有找到相关信息。",
        //                         specialBrand: false,                                                
        //                         errorMsg: data.msg,
        //                         toastShow: true,
        //                         neverSearch: true,
        //                         netError: false,
        //                         likenessVin: "",
        //                         dataList: null
        //                     }
        //                     break;
        //                 case 0:
        //                     _state = {
        //                         // errorMsg: "网络异常。",
        //                         errorMsg: data.msg,
        //                         specialBrand: false,                                                
        //                         toastShow: true,
        //                         netError: true,
        //                         neverSearch: true,
        //                         likenessVin: "",
        //                         dataList: null                        
        //                     }
        //                     break;
        //                 case 1:
        //                     this.setState({
        //                         specialBrand: false,                                                
        //                         neverSearch: false,
        //                         carInfos: data.mains,
        //                         toastShow: false,
        //                         netError: false,
        //                         dataList: null,                        
        //                         likenessVin: "",
        //                         vinCarType: data.vins,
        //                         brandurl: data.brandurl,
        //                         imglogo: data.imglogo,
        //                         currentBrands: data.brand
        //                     }, () => {
        //                         // this.props.setCarInfos(data.mains)
        //                         if(callback) callback()
        //                         window.currentBrands = this.currentBrands = data.brand
        //                         this.getkeyWordsData()                        
        //                         this.searchVIN = data.vin
        //                         VINLANBO = data.brand
        //                         Model.group(this.searchVIN, data.brand, resGroup => {
        //                             if (resGroup.code == 2) {
        //                                 this.setState({
        //                                     mainGroups: []
        //                                 }, () => {
        //                                     alert("未找到主组信息")
        //                                 })
        //                             } else if (resGroup.code == 1) {
        //                                 let _data = resGroup.data
        //                                 this.currentMainGroups = JSON.parse(JSON.stringify(resGroup.data))
        //                                 this.setState({
        //                                     mainGroups: _data
        //                                 }, () => this.props.setAnyAuth(_data[0].auth, this.searchVIN, this.currentBrands, data.brandurl, data.mains))
        //                             }
        //                         })
        //                     })
        //                     break;
        //             }
        //             _state.newStart = true
        //             _state.showHistorys = false
        //             this.setState(_state)
        //         })
        //     })
        // })

        Utils.showDom(".search-loading-container", "flex")
        Utils.specialload()        
        Utils.get("/parse/vins", {vin: value}, res => {  //解析vin
            let _carsDataList =  res.data.split("-")
            _carsDataList[3] = value
            this.setState({
                carsDataList: _carsDataList
            },()=> {
                Utils.showDom(".search-loading-container .page-box", "flex")
            })
        })

        Model.inquire(value, this.brands, resInquire => {
            Utils.hideDom(".search-loading-container")
            Utils.specialload()
            Utils.hideDom(".search-loading-container .page-box")
            let data = resInquire
            switch (data.code) {
                case 4001:
                    _state = {
                        floatWindowShow: true,
                        showFloatWindow: true,
                        neverSearch: true,
                        likenessVin: "",
                        dataList: null,
                        specialBrand: false
                    }
                    break;
                case 4005:    //本田特殊处理
                    this.searchVIN = value
                    _state = {
                        specialBrand: 4005,
                        currentBrands: data.brand,
                        specialTitle: data.title,
                        specialData: data.data,
                        specialValue: value,
                        toastShow: false,
                        // carInfos: ["车型："+data.vins],
                        likenessVin: "",
                        vinCarType: data.vins,
                        netError: false,
                        neverSearch: false,
                        errorShow: false,
                        brandurl: data.brandurl
                    }
                    break;
               
                case 4003:
                    _state = {
                        specialBrand: false,
                        errorShow: false,
                        toastShow: true,
                        neverSearch: true,
                        likenessVin: "",
                        dataList: data.data
                    }
                    break;
                case 9: //数据维护返回
                    _state = {
                        specialBrand: false,                                  
                        errorMsg: data.msg,
                        errorShow: false,
                        neverSearch: true,
                        likenessVin: "",
                        dataList: null
                    }
                    break;
                case 3: //有类似车架号提示
                    _state = {
                        specialBrand: false,                        
                        likenessVin: data.vins,
                        // errorMsg: "抱歉,没有找到相关信息。<br/>.是否需要查询<span style='cursor:default;text-decoration:none'>" + data.vins + "</span>",
                        errorMsg: data.msg,
                        toastShow: true,
                        neverSearch: true,
                        netError: false,
                        dataList: null
                    }
                    break;
                case 2: //
                    _state = {
                        // errorMsg: "抱歉，没有找到相关信息。",
                        specialBrand: false,                                                
                        errorMsg: data.msg,
                        toastShow: true,
                        neverSearch: true,
                        netError: false,
                        likenessVin: "",
                        dataList: null
                    }
                    break;
                case 0:
                    _state = {
                        // errorMsg: "网络异常。",
                        errorMsg: data.msg,
                        specialBrand: false,                                                
                        toastShow: true,
                        netError: true,
                        neverSearch: true,
                        likenessVin: "",
                        dataList: null                        
                    }
                    break;
                case 4006:  //奔驰机组特殊处理
                    this.searchVIN = value
                    this.setState({
                        specialBrand: 4006,
                        specialTitle: data.title,
                        specialData: data.data,
                        specialValue: value,
                        toastShow: false,
                        carInfos: data.mains,              
                        likenessVin: "",
                        vinCarType: data.vins,
                        netError: false,
                        neverSearch: false,
                        errorShow: false,
                        brandurl: data.brandurl,
                        imglogo: data.imglogo,                        
                        currentBrands: data.brand
                    },()=> {
                        if(callback) callback()
                        window.currentBrands = this.currentBrands = data.brand
                        this.getkeyWordsData()                        
                        this.searchVIN = data.vin
                        VINLANBO = data.brand
                        Model.group(this.searchVIN, data.brand, resGroup => {
                            if (resGroup.code == 2) {
                                this.setState({
                                    mainGroups: [],
                                    mainGroupsCoby: []
                                }, () => {
                                    alert("未找到主组信息")
                                })
                            } else if (resGroup.code == 1) {
                                let _data = resGroup.data
                                this.currentMainGroups = JSON.parse(JSON.stringify(resGroup.data))
                                this.setState({
                                    mainGroups: _data,
                                    mainGroupsCoby: _data
                                }, () => this.props.setAnyAuth(_data[0].auth, this.searchVIN, this.currentBrands, data.brandurl, data.mains))
                            }
                        })
                    })
                    break;
                case 1:
                    this.setState({
                        specialBrand: false,                                     
                        neverSearch: false,
                        carInfos: data.mains,
                        toastShow: false,
                        netError: false,
                        dataList: null,                        
                        likenessVin: "",
                        vinCarType: data.vins,
                        brandurl: data.brandurl,
                        imglogo: data.imglogo,
                        currentBrands: data.brand
                    }, () => {
                        // this.props.setCarInfos(data.mains)
                        if(callback) callback()
                        window.currentBrands = this.currentBrands = data.brand
                        this.getkeyWordsData()                        
                        this.searchVIN = data.vin
                        VINLANBO = data.brand
                        this.props.setNewTitle("")
                        Model.group(this.searchVIN, data.brand, resGroup => {
                            if (resGroup.code == 2) {
                                this.setState({
                                    mainGroups: []
                                }, () => {
                                    alert("未找到主组信息")
                                })
                            } else if (resGroup.code == 1) {
                                let _data = resGroup.data
                                this.currentMainGroups = JSON.parse(JSON.stringify(resGroup.data))
                                this.setState({
                                    mainGroups: _data
                                }, () => this.props.setAnyAuth(_data[0].auth, this.searchVIN, this.currentBrands, data.brandurl, data.mains))
                            }
                        })
                    })
                    break;
            }
            _state.newStart = true
            _state.showHistorys = false
            this.setState(_state)
        })



    }

    radioChange(index) {
        this.setState({
            selectedRadioIndex: index
        }, () => {
            if (this.radioBrands[index]) {
                this.inputValue("")
                this.brands = this.radioBrands[index].en
                this.setState({
                        neverSearch: true,
                        toastShow: false,
                        staticBradnUrl: index ? this.radioBrands[index].cn : "",
                        staticPlaceholder: this.radioBrands[index].placeholder
                    }, () => {
                        this.focus()
                    })
            } else this.brands = 'all'
        })
    }

    radios() {
        let _radioChange = this.radioChange.bind(this)
        if (this.radioBrands) return this.radioBrands.map((item, index) => {
            return (
                <span key={index} className='container-radio'>
                    <input type="radio" name="brand" value={item.cn}
                    onClick={()=> _radioChange(index)}
                    checked={index === this.state.selectedRadioIndex}/>
                    <label htmlFor={item.cn}>{item.cn}</label>
                </span>
            )
        })
    }

    mainGroupClick(index, vin, brands, mainGroups,baseMainGroups) {
        window.currentBrands = brands
        this.setState({
            showSearch: false,
            newStart: false
        }, () => this.props.search(index, vin, brands, mainGroups, baseMainGroups))
    }

    carInfoSearchChange() {
        let _value = this.refs.carInfoSearch.value
        let _carInfos = this.state.carInfos
        let _isFind = false
        let _errorShow = false
        for (let i = 0, j = _carInfos.length; i < j; i++) {
            if (_carInfos[i].toUpperCase().includes(_value.toUpperCase())) {
                this.refs.carInfoContent.scrollTop = 40 * i
                _isFind = true
                break
            }
        }
        if (!_isFind) {
            _errorShow = true
        } else {
            _errorShow = false
        }
        if (_value.length > 0) {
            this.setState({
                carInfoSearchshow: true
            })
        } else {
            _errorShow = false
        }

        this.setState({
            errorShow: _errorShow
        })
    }

    partVinInputChange() {
        let _partVinInput = ""
        if (this.refs.vinPart.value.length > 0) {
            _partVinInput = true
        } else {
            _partVinInput = false
        }
        this.setState({
            partVinInput: _partVinInput
        })
    }

    //清除零件号搜索框
    partVinInputClear() {
        let _partVin = this.refs.vinPart
        _partVin.value = ''
        this.setState({
            partVinInput: false
        })
    }

    carInfoSearchClear() {
        let _searchPart = this.refs.carInfoSearch
        _searchPart.value = ''
        _searchPart.focus()
        this.setState({
            carInfoSearchshow: false
        })
    }

    carInfos() {
        if (this.state.carInfos) return this.state.carInfos.map((item, index) => {
            let _split = ':'
            let _title = item.split(_split)[0] || ''
            let _content = item.split(_split)[1] || ''

            return (
                <div className='container-info' key={index}>
                    <div className='title'>
                        {_title}
                    </div>
                    <div className='content'>
                        {_content}
                    </div>
                </div>
            )
        })
    }

    modal() {
        let modal = (
            <div className="brandsContainer">
                {
                    this.state.baseBrands.map((item, index) => {
                        return (
                            <div key={index} className="brandsItem"  onClick={this.handleClick.bind(this,item.brand)}>
                                <img src={this.cdnHost + item.img} />
                                <span>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
        return modal
    }

    handleClick(brand) {
        this.brands = brand
        this.search(this.searchVIN,()=>{this.brands = "all"})
        // this.brands = "all"
        this.setState({
            showFloatWindow: false
        })
    }

    reSet() {
        if (!this.state.staticBradnUrl) {
            this.brands = 'all' //默认选择了'全部品牌'
            this.currentBrands = 'all' //当前结果的品牌
        }
        this.searchVIN = '' //保存当前搜索的 vin
        this.setState({
            toastShow: false
        })
        this.inputValue("")
        this.focus()
    }

    title() {
        let _title = this.searchVIN
        if (this.state.carInfos) this.searchVIN += ' / ' + this.state.carInfos[0]
        return _title
    }

    next() {
        this.setState({
            showSearch: false
        })
    }

    showSearchPartInput() {
        return !(this.currentBrands === 'bentley' || this.currentBrands === 'benz' || this.currentBrands === 'maybach' || this.currentBrands === 'smart')
    }

    vinPartSearch() {
        let _value = this.refs.vinPart.value.replace(/\s/g, '')
        _value = _value.toUpperCase()
        if (_value) {
            window.showSearchPartResult(_value,this.notFindShow.bind(this),"vin")
        }
    }

    clearInput(){

    }

    historys() {
        let _historyClick = this.historyClick.bind(this)
        if (this.state.historys) return (
            this.state.historys.map((item, index) => {
                return (
                    <a className='history' key={index}
                        onClick={() => _historyClick(item[0] || '')}>
                        <span>{item[0] || ''}</span>
                        <span>{item[2] || ''}</span>
                    </a>
                )
            })
        )
    }

    historyClick(data) {
        this.search(data)
    }

    openHistorys(historys) {
        this.setState({
            showHistorys: true,
            historys: historys
        })
    }

    closeHistorys() {
        this.setState({
            showHistorys: false
        })
    }

    moreHistorys() {
        location.href = '/histroy/vins?brand=' + this.brands
    }

    checkHistory(value){
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
            // this.closeHistorys()
            _showHistorys = false
        }else{
            _showHistorys = true
        }

        this.setState({
            historys: historyCoby,
            showHistorys:_showHistorys
        })
    }

    notFindShow(){
        
        Utils.showDom(".input-part-search-error")
        let timer = setTimeout(()=>{
            Utils.hideDom(".input-part-search-error")
        },3000)
    }

    changeListType(type){

        if(this.baseType == type){
            return
        }
        this.baseType = type
        localStorage.setItem("listType",type)
        
        if(window.changePartListType){
            window.changePartListType(type)
        }

        this.setState({
            listType: type
        })
    }

    mainGroups() {

    }

    searchChange() {
        let _value = this.refs.search.value
        let _clearshow = false
        let _errorshow = false
        let _mainGroups = this.state.mainGroups
        if(_value.length < 1){
            _clearshow = false
            _errorshow = false
            _mainGroups = JSON.parse(JSON.stringify(this.currentMainGroups))
        }else {
            let _sortCounter = 0 //排序计数器
            _clearshow = true
            _mainGroups.forEach((item, index) => {
                if(item.groupname.includes(_value)) {
                    item.isSearched = true
                    if(index !== 0) {
                        _mainGroups.splice(_sortCounter, 0, item)
                        _mainGroups.splice(index + 1, 1)
                    }
                    _sortCounter ++
                }
                else{

                    item.isSearched = false
                }
            })
            if(_sortCounter==0){
                _errorshow = true
            }
        }
        this.setState({
            mainGroups: _mainGroups,
            mainClearshow: _clearshow,
            mainErrorshow: _errorshow
        })
    }
    clearshow(){
        this.setState({
            errorShow: false
        })
        let _searchPart = this.refs.search
            _searchPart.value = ''
            _searchPart.focus()
        this.searchChange()
    }

    searchKeyWord(keyword) {
        this.refs.vinPart.value = keyword
        this.vinPartSearch()
    }

    showKeyWord(){
        this.setState({
            keyWordsShow: true
        })
    }

    hiddenKeyWord() {       
        setTimeout(()=>{
            this.setState({
                keyWordsShow: false
            })
        }, 400)
    }

    getkeyWord(){
        return(
            <div className={this.state.keyWordsShow ? "key-words-container" : "key-words-container hidden"}>
            <div className="key-words-title">
                热门搜索
            </div>
            {
                this.state.keyWords.map((item,index)=>{
                        return(
                            <div className="key-word-item" key={index} onClick={this.searchKeyWord.bind(this,item.name)}>
                                {item.title}
                            </div>
                        )
                    }
                )
            }
            </div>
        )
    }

    keyPress(e) {
        let _keyCode = e.which || e.keyCode
        if (_keyCode === 13) {
            this.vinPartSearch()
        }
    }

    onlyShowSearch() {
        if(window.onlyShowPartResult){
            window.onlyShowPartResult()        
        }
    }

    setVins(vins) {
        this.setState({
            vinCarType: vins
        })
    }

    chooseSearchType() {

    }

    showPage() {
        // this.refs.page.style.display = "flex"
    }

    imgError(e) {
        e.target.style.display = "none"
    }

    imgLoad(e) {
        if(this.state.listType == "imgList") {
            e.target.style.display = "block"              
        }
    }

    switchComponent(brand) {
        let _mainErrorShow = this.state.mainErrorshow ? "block" : "none"        
        let _imgIsShow = this.state.listType == "imgList" ? "block" : "none"
        let _listIsShow = this.state.listType == "imgList" ? "none" : "flex"
        let _imgSelected = this.state.listType == "imgList" ? "imgListSelected" : "imgList"
        let _dataSelected = this.state.listType == "imgList" ? "dataList" :"dataListSelected"
        let _mainGroupClick = this.mainGroupClick.bind(this)
        let _mainGroupList = ""
        let _errorShow = this.state.errorShow ? "block" : "none"        
        let _length = this.state.mainGroups.length        
        if (this.state.mainGroups) {
            _mainGroupList = this.state.mainGroups.map((item, index) => {
                let _title = item.name.match(/^\w*/)
                let _content = item.name.replace(/^\w*\s/, '')
                let _className = this.state.listType == "imgList" ?  "main-group" : "main-group-data"
                _className = item.isSearched ? _className+" search" : _className
                return (
                    <a className={_className} key={index}
                        onClick={() => _mainGroupClick(index, this.searchVIN, this.currentBrands, this.state.mainGroups , this.currentMainGroups)}>
                        <img onLoad={this.imgLoad.bind(this)} onError={this.imgError.bind(this)} src={item.img} style={{display: window.withoutImg(VINLANBO) ? "none":_imgIsShow}}/>
                        <span style={{display:_imgIsShow}}>{item.name}</span>
                        <div style={{display:_listIsShow}} className='title'>{_title}</div>
                        <div style={{display:_listIsShow}} className='content'>{_content}</div>
                    </a>
                )
            })
        }
        switch(brand) {
            case 4005:
                return (
                    <SpecialMainGroup
                        brand = {this.state.currentBrands}
                        value = {this.state.specialValue}
                        title = {this.state.specialTitle}
                        data = {this.state.specialData}
                        setVins = {this.setVins.bind(this)}
                        mainGroupClick = {this.mainGroupClick.bind(this)}
                        setAnyAuth = {this.props.setAnyAuth.bind(this)}
                    />
                )
                break;
            case 4006:
                return(
                    <SpecialBenzGroup
                        brand = {this.state.currentBrands}
                        vin = {this.searchVIN}
                        setNewTitle = {this.props.setNewTitle.bind(this)}
                        imglogo = {this.state.imglogo}
                        value = {this.state.specialValue}
                        toggleCarInfo = {this.props.toggleCarInfo}
                        title = {this.state.specialTitle}
                        data = {this.state.specialData}
                        setVins = {this.setVins.bind(this)}
                        mainGroupClick = {this.mainGroupClick.bind(this)}
                        setAnyAuth = {this.props.setAnyAuth.bind(this)}
                        mainGroups = {this.state.mainGroupsCoby}
                    />
                )
                break;
            default:
                return(
                    <div className='content'>
                        {/* 选择主组 */}
                        <div className='container-main-group'>
                            <div className='header'>
                                <span>
                                    {/* 选择主组(共{_length}组)： */}
                                    {TR("mainGroupTitle",_length)}
                                </span>
                                <div className="changeTitle">
                                    <span className={_imgSelected} onClick={this.changeListType.bind(this,"imgList")} title='以图片方式显示'></span>
                                    <span className={_dataSelected} onClick={this.changeListType.bind(this,"dataList")} title='以列表方式显示'></span>
                                </div>
                                <div className='search' style={{display: 'none'}}>
                                    <input ref='search' className='input'
                                        placeholder='输入主组图号/名称'
                                        onChange={this.searchChange.bind(this)} />
                                    <div className={this.state.mainClearshow ? 'clear' : 'clear hidden'}
                                        onClick={this.clearshow.bind(this)}>
                                    </div>
                                    <div className = "input-search-error" style={{display:_mainErrorShow}}>
                                        未搜索到相关结果
                                    </div>
                                    <div className='img'></div>
                                </div>
                            </div>
                            <div className='content'>
                                {_mainGroupList}
                            </div>
                        </div>
                        {/* 车辆配置 */}
                        <div className='container-car-info-sub'>
                            <div className='header'>
                                <span>{TR("车辆配置")}</span>
                                <div className='search'>
                                    <input ref='carInfoSearch' className='input' placeholder='输入配置信息'
                                        onChange={this.carInfoSearchChange.bind(this)}     />
                                    <div className = "input-search-error" style={{display:_errorShow}}>
                                        未搜索到相关结果
                                    </div>
                                    <div className={this.state.carInfoSearchshow ? 'clear' : 'clear hidden'}
                                        onClick={this.carInfoSearchClear.bind(this)}></div>
                                    <div className='img'></div>
                                </div>
                            </div>

                            <div className='content' ref='carInfoContent'>
                                {this.carInfos()}
                            </div>

                            <img className='car-info-sub-img-button' src={this.cdnHost + 'img/icon_car_button.png'}
                                onClick={() => this.setState({subImgShow: true})}/>

                            <div className={this.state.subImgShow ? 'container-car-info-sub-img' : 'container-car-info-sub-img hidden'}>
                                <div className='car-info-sub-remind'>{TR("同类车型图片, 仅供参考")}</div>
                                <img className='car-info-sub-img' src={this.state.imglogo} />
                                <CloseCanvas
                                    show={true}
                                    sideLength={20}
                                    forkSideLength={6}
                                    click={() => this.setState({subImgShow: false})}/>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    render() {
        window.pageFlag = this.state.showSearch ? "vinPage" : "vinResultPage"
        let showFloatWindow = this.state.showFloatWindow
        let _toastShow = this.state.toastShow ? "block" : "none"
        let _errorMsg = this.state.errorMsg
        let _mainCleaError = this.state.mainClearshow
        let _defaultdisplay = this.props.type == "part" ? "none" : "flex"
        let _length = this.state.mainGroups.length
        let _errorShow = this.state.errorShow ? "block" : "none"
        let _historyClick = this.historyClick.bind(this)
        let _historys = <div/>
        let _imgIsShow = this.state.listType == "imgList" ? "block" : "none"
        let _listIsShow = this.state.listType == "imgList" ? "none" : "flex"
        let _imgSelected = this.state.listType == "imgList" ? "imgListSelected" : "imgList"
        let _dataSelected = this.state.listType == "imgList" ? "dataList" :"dataListSelected"
        let _mainGroupClick = this.mainGroupClick.bind(this)
        let _mainGroupList = ""
        let _defaultMsg = TR('输入零件原厂名/零件号')
        if(window.faultCodeBrand(window.currentBrands)) {
            _defaultMsg = TR('输入零件号／故障码')          
        }
        if(window.engCodeBrand(window.currentBrands)) {
            _defaultMsg = TR('输入零件号／工程编号')         
        }
        if (this.state.historys){
            _historys = this.state.historys.map((item, index) => {
                return (
                    <a className='history' key={index}
                        onClick={() => _historyClick(item[0] || '')}>
                        <span>{item[0] || ''}</span>
                        <span>{item[2] || ''}</span>
                    </a>
                )
            })
        }
        let carsDataList = this.state.carsDataList 
        return (
            <div className={this.getClassName()}>
                <div className='search'>
                    {/* <div className={this.state.newStart ? 'container-step hidden' : 'container-step'}>
                        <div className="btn-left"></div>
                        <div className="btn-right"
                            onClick={this.next.bind(this)}
                        ></div>
                    </div> */}
                    <div className='container-radios'>
                        {this.radios()}
                    </div>
                    <SearchVIN
                        radioChange = {this.radioChange.bind(this)}
                        staticBradnUrl = {this.state.staticBradnUrl}
                        placeholder={this.state.staticPlaceholder}
                        defaultValue={TR('车架号查询')}
                        checkHistory = {this.checkHistory.bind(this)}
                        setResponseRadioChange={handle => this.searchVINResponseRadioChange = handle}
                        setInputValue={inputValue => this.inputValue = inputValue}
                        focus={this.focus.bind(this)}
                        blur={this.blur.bind(this)}
                        search={this.search.bind(this)}/>
                    <div className='container-history' style={{display: this.state.showHistorys ? 'block' : 'none'}}>
                        {_historys}
                        <div className='container-more'>
                            <a className='more'
                                onClick={this.moreHistorys.bind(this)}><div>更多历史</div></a>
                            <a className='close'
                                onClick={this.closeHistorys.bind(this)}><div>关闭</div></a>
                        </div>
                    </div>
                </div>

                <div className="search-loading-container">
                    <div className="loading-special">
                        <div className="nmuber-box">

                        </div>
                        <div className="bg-red-box">
                            <img src="/img/red_box.png" onLoad={this.showPage.bind(this)} className="bg-red"/>
                            <img src="/img/move_flag.png" className="move-flag"/>
                        </div>
                        <div className="page-box" ref="page">
                            <span>{carsDataList[2]}</span>
                            <span>{carsDataList[1]}</span>
                            <span>{carsDataList[3]}</span>  
                        </div>
                    </div>
                </div>
                
                <div className={this.state.neverSearch ? 'choose hidden' : 'choose'}>
                    <div className='title'>
                        {TR("零零汽为您找到")}
                        <span>
                            {this.searchVIN}
                        </span>
                        {TR("相关结果")}：
                        <span>
                            {this.state.vinCarType}
                        </span>
                        <div className="title-right">
                            <div className={window.vinSearchPart(this.currentBrands) ? 'container-input' : 'container-input hidden'} onClick={this.onlyShowSearch.bind(this)}>
                                {/* <div className='search-type'>
                                    <div className='choose-sure-box'>
                                        <span></span>
                                        <img src="" />
                                    </div>
                                    <div className="choose-item-container">
                                        <span onClick={this.chooseSearchType('norPart')}>零件号</span>
                                        <span onClick={this.chooseSearchType('engPart')}>工程编号</span>                                        
                                    </div>
                                </div> */}

                                {/* <div className={this.brands == "land_rover" ? 'search-type':'hidden'}>
                                    <div className='choose-sure-box'>
                                        <span>{localStorage.getItem("partSearchType") ? (localStorage.getItem("partSearchType")== 'norPart' ? "零件号" : "工程编号") : "零件号"}</span>
                                        <b></b>
                                    </div>
                                </div> */}
                                <input className='input' placeholder={_defaultMsg}
                                    style={{display: _defaultdisplay}}
                                    ref="vinPart"
                                    // onFocus = {this.showKeyWord.bind(this)}
                                    // onBlur = {this.hiddenKeyWord.bind(this)}
                                    // onChange={this.partVinInputChange.bind(this)}
                                    // onKeyPress={this.keyPress.bind(this)}
                                    />
                                <div className = "input-part-search-error" style={{display:"none"}}>
                                    无此零件
                                </div>
                                <div className={this.state.partVinInput ? 'clear' : 'clear hidden'}
                                            onClick={this.partVinInputClear.bind(this)}></div>
                                <div className='img' onClick={this.vinPartSearch.bind(this)} style={{display: _defaultdisplay}}>
                                    搜索
                                    <div className="search-button-loading">

                                    </div>
                                </div>
                                {
                                    this.state.keyWords.length > 0 ? this.getkeyWord() : null
                                } 
                            </div>
                            <img src = {this.state.brandurl}/>
                        </div>
                    </div>
                    {

                        this.switchComponent(this.state.specialBrand)

                        // !this.state.specialBrand 
                        // ?   (<div className='content'>
                        //         {/* 选择主组 */}
                        //         <div className='container-main-group'>
                        //             <div className='header'>
                        //                 <span>选择主组(共{_length}组)：</span>
                        //                 <div className="changeTitle">
                        //                     <span className={_imgSelected} onClick={this.changeListType.bind(this,"imgList")} title='以图片方式显示'></span>
                        //                     <span className={_dataSelected} onClick={this.changeListType.bind(this,"dataList")} title='以列表方式显示'></span>
                        //                 </div>
                        //                 <div className='search' style={{display: 'none'}}>
                        //                     <input ref='search' className='input'
                        //                         placeholder='输入主组图号/名称'
                        //                         onChange={this.searchChange.bind(this)} />
                        //                     <div className={this.state.mainClearshow ? 'clear' : 'clear hidden'}
                        //                         onClick={this.clearshow.bind(this)}>
                        //                     </div>
                        //                     <div className = "input-search-error" style={{display:_mainErrorShow}}>
                        //                         未搜索到相关结果
                        //                     </div>
                        //                     <div className='img'></div>
                        //                 </div>
                        //             </div>
                        //             <div className='content'>
                        //                 {_mainGroupList}
                        //             </div>
                        //         </div>
                        //         {/* 车辆配置 */}
                        //         <div className='container-car-info-sub'>
                        //             <div className='header'>
                        //                 <span>车辆配置</span>
                        //                 <div className='search'>
                        //                     <input ref='carInfoSearch' className='input' placeholder='输入配置信息'
                        //                         onChange={this.carInfoSearchChange.bind(this)}     />
                        //                     <div className = "input-search-error" style={{display:_errorShow}}>
                        //                         未搜索到相关结果
                        //                     </div>
                        //                     <div className={this.state.carInfoSearchshow ? 'clear' : 'clear hidden'}
                        //                         onClick={this.carInfoSearchClear.bind(this)}></div>
                        //                     <div className='img'></div>
                        //                 </div>
                        //             </div>

                        //             <div className='content' ref='carInfoContent'>
                        //                 {this.carInfos()}
                        //             </div>

                        //             <img className='car-info-sub-img-button' src={this.cdnHost + 'img/icon_car_button.png'}
                        //                 onClick={() => this.setState({subImgShow: true})}/>

                        //             <div className={this.state.subImgShow ? 'container-car-info-sub-img' : 'container-car-info-sub-img hidden'}>
                        //                         <div className='car-info-sub-remind'>同类车型图片, 仅供参考</div>
                        //                         <img className='car-info-sub-img' src={this.state.imglogo} />
                        //                         <CloseCanvas
                        //                             show={true}
                        //                             sideLength={20}
                        //                             forkSideLength={6}
                        //                             click={() => this.setState({subImgShow: false})}/>
                        //             </div>
                        //         </div>
                        //     </div>)
                        // :   <SpecialMainGroup
                        //         brand = {this.state.specialBrand}
                        //         value = {this.state.specialValue}
                        //         title = {this.state.specialTitle}
                        //         data = {this.state.specialData}
                        //         setVins = {this.setVins.bind(this)}
                        //         mainGroupClick = {this.mainGroupClick.bind(this)}
                        //         setAnyAuth = {this.props.setAnyAuth.bind(this)}
                        //     />
                    }
                </div>
                <div className='error hidden'>
                    <span className='title'>error title</span>
                    <span className='handle'>handle>></span>
                </div>
                <FloatWindow
					title="选择品牌"
					img="/img/icon_san.png"
					top="137px"
					left="calc(50% - 314px)"
					width="628px"
					height="268px"
					hiddenEvent={() => {this.setState({showFloatWindow: false})}}
					show={showFloatWindow ? "block" : "none"}
					content={this.modal()} />
                <div className="ErrorContainer"  style={{display:_toastShow}}>
					<SearchError
						serachIsShow = {_toastShow}
						code = {_errorMsg}
						resetClick = {this.reSet.bind(this)}
						height={"auto"}
						toSearch = {this.search.bind(this)}
						reSearch = {this.search.bind(this,this.searchVIN)}
                        dataList = {this.state.dataList}
						likenessVin = {this.state.likenessVin}
						netError = {this.state.netError}
					/>
				</div>
            </div>
        )
    }
}

class SpecialMainGroup extends Root{
    constructor(props){
        super(props);
        this.state = {
            chooseIndex:0,
            mainGroups: "",
            listType: "imgList",
        }
        this.data = props.data
        this.chooseItem = ["1  选择配置：","2  选择主组："]
    }
    
    componentWillReceiveProps(props) {
        if(props.data !== this.data) {
            this.data = props.data
            this.setState({
                chooseIndex: 0 
            })
        }
    }

    getTitle(){
        if(!this.props.title) return;        
 
        return(
            this.props.title.map((item,index)=>{
                return(
                    <div className="title-item" key={index}>
                        {item}
                    </div>
                )
            })
        )
    }

    getAuth(auth){
        Model.sinquire(this.props.value,this.props.brand,auth,data=>{
                window.currentBrands = this.currentBrands = data.brand
                this.searchVIN = data.vin
                VINLANBO = data.brand
                this.props.setVins(data.vins)                
                Model.group(this.searchVIN, data.brand, resGroup => {
                    if (resGroup.code == 2) {
                        this.setState({
                            mainGroups: []
                        }, () => {
                            alert("未找到主组信息")
                        })
                    } else if (resGroup.code == 1) {
                        let _data = resGroup.data
                        this.currentMainGroups = JSON.parse(JSON.stringify(resGroup.data))                        
                        this.setState({
                            chooseIndex:1,
                            mainGroups: _data
                        }, 
                        () => this.props.setAnyAuth(_data[0].auth, this.searchVIN, this.currentBrands, data.brandurl, data.mains)
                    )
                    }
                })
        })
    }

    getBodyItem(){
        if(!this.props.data) return;
        return(
            this.props.data.map((item,index)=> {
                return(
                    <div className="item-row" key={index} onClick={this.getAuth.bind(this,item.auth)}>
                        {
                            item.data.map((it,ins)=>{
                                return(
                                    <div key={ins} className="item-cell">
                                        {it}
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })
        )
    }

    changeChooseIndex(index) {
        this.setState({
            chooseIndex:index
        })
    }

    getLeftItem(){
        return(
            this.chooseItem.map((item,index)=> {
                if(index <= this.state.chooseIndex){
                    let _className = "left-item"
                    if(index == this.state.chooseIndex){
                        _className = "left-item selected"
                    }
                    return(
                        <div className={_className} key={index} onClick={this.changeChooseIndex.bind(this,index)}>
                            {item}
                        </div>
                    )
                }
            })
        )
    }

    // mainGroupClick(index, vin, brands, mainGroups,baseMainGroups) {
    //     window.currentBrands = brands
    //     this.setState({
    //         showSearch: false,
    //         newStart: false
    //     }, () => this.props.search(index, vin, brands, mainGroups,baseMainGroups))
    // }

    mainGroupClick(index,vin,brands,mainGroups,baseMainGroups) {
        this.props.mainGroupClick(index,vin,brands,mainGroups,baseMainGroups)
    }

    changeListType(type) {    
        if(this.baseType == type){
            return
        }
        this.baseType = type
        localStorage.setItem("listType",type)
        if(window.changePartListType){
            window.changePartListType(type)
        }
        this.setState({
            listType: type
        })
    }
    imgError(e) {
        e.target.style.display = "none"        
    }

    getResult() {
        let _length = this.state.mainGroups.length    
        let _imgIsShow = this.state.listType == "imgList" ? "block" : "none"
        let _listIsShow = this.state.listType == "imgList" ? "none" : "flex" 
        let _mainGroupList = ""
        let _imgSelected = this.state.listType == "imgList" ? "imgListSelected" : "imgList"
        let _dataSelected = this.state.listType == "imgList" ? "dataList" :"dataListSelected"
        let _mainGroupClick = this.mainGroupClick.bind(this)

        if (this.state.mainGroups) {
            _mainGroupList = this.state.mainGroups.map((item, index) => {
                let _title = item.name.match(/^\w*/)
                let _content = item.name.replace(/^\w*\s/, '')
                let _className = this.state.listType == "imgList" ?  "main-group" : "main-group-data"
                _className = item.isSearched ? _className+" search" : _className
                return (
                    <a className={_className} key={index}
                        onClick={() => _mainGroupClick(index, this.searchVIN, this.currentBrands, this.state.mainGroups , this.currentMainGroups)}>
                        <img onError={this.imgError.bind(this)} src={item.img} style={{display: window.withoutImg(VINLANBO)  ? "none":_imgIsShow}}/>
                        <span style={{display:_imgIsShow}}>{item.name}</span>
                        <div style={{display:_listIsShow}} className='title'>{_title}</div>
                        <div style={{display:_listIsShow}} className='content'>{_content}</div>
                    </a>
                )
            })
        }

        return(
            <div className='container-main-group'>
                <div className='header'>
                    <span>选择主组(共{_length}组)：</span>
                    <div className="changeTitle">
                        <span className={_imgSelected} onClick={this.changeListType.bind(this,"imgList")} title='以图片方式显示'></span>
                        <span className={_dataSelected} onClick={this.changeListType.bind(this,"dataList")} title='以列表方式显示'></span>
                    </div>
                    {/* <div className='search' style={{display: 'none'}}>
                        <input ref='search' className='input'
                            placeholder='输入主组图号/名称'
                            onChange={this.searchChange.bind(this)} />
                        <div className={this.state.mainClearshow ? 'clear' : 'clear hidden'}
                            onClick={this.clearshow.bind(this)}>
                        </div>
                        <div className = "input-search-error" style={{display:_mainErrorShow}}>
                            未搜索到相关结果
                        </div>
                        <div className='img'></div>
                    </div> */}
                </div>
                <div className='content'>
                    {_mainGroupList}
                </div>
            </div>
        )
    }

    render(){
        return(
            <div className="special-container">
                <div className="left-control-box">
                    {this.getLeftItem()}
                </div>
                <div className="right-control-box">
                    {
                        this.state.chooseIndex == 0 ?
                        (
                            <div>
                                <div className="header">
                                    {this.getTitle()}
                                </div>
                                <div className="list-body">
                                    {this.getBodyItem()}
                                </div>
                            </div>
                        )  : 
                        this.getResult()
                    }
                </div>
            </div>
        )
    }
}

class SpecialBenzGroup extends Root{
    constructor(props){
        super(props);
        this.state = {
            chooseIndex:0,
            listType: "imgList",
            chooseItem: ["选择主组"],
            titleList: [],
            listData: [],
            subImgShow: true
        }
        this.data = props.mainGroups
        // this.chooseItem = ["1  选择主组"]
    }
    
    componentWillReceiveProps(props) {
        if(props.mainGroups !== this.mainGroups) {
            this.mainGroups = props.mainGroups
            this.setState({
                chooseIndex: 0
            })
        }
    }

    toggleCarInfo() {
        this.props.toggleCarInfo("position")
    }

    getTitle() {
        if(!this.props.title) return;
        return(
            this.props.title.map((item,index)=> {
                return(
                    <div className="title-item" key={index}>
                        {item}
                    </div>
                )
            })
        )
    }

    changeChooseIndex(index) {
        this.setState({
            chooseIndex:index
        })
    }

    getLeftItem() {
        return(
            this.state.chooseItem.map((item,index)=> {
                    let _className = "left-item"
                    if(index == this.state.chooseIndex) {
                        _className = "left-item selected"
                    }
                    return(
                        <div className={_className} key={index} onClick={this.changeChooseIndex.bind(this,index)}>
                            {index + 1 + " " + item}
                        </div>
                    )
                // }
            })
        )
    }

    mainGroupClick(item, index, vin, brands, mainGroups, baseMainGroups) {
        if(item.component) {
            let _url = item.uri+"&vin="+this.props.vin       
            Utils.get(_url, null, res=> {
                if(this.state.chooseIndex == this.state.chooseItem.length -1) {
                    this.state.chooseItem.push(res.title)                  
                }else {
                    let arr = this.state.chooseItem
                    let index = this.state.chooseIndex+1
                    arr.splice(index,arr.length-1,res.title)
                }
                this.state.titleList = [item.name]
                this.state.listData[0] = res.data
                this.setState({
                    chooseItem: this.state.chooseItem,
                    listData: this.state.listData,
                    chooseIndex: ++this.state.chooseIndex,
                    titleList: this.state.titleList
                },()=>{
                    if(res.data.length === 1) {
                        this.chooseRow(res.data[0])
                    }
                })
            })
        }else {
            let componentCount = 0
            let _mainGroups = mainGroups.filter((item,index,mainGroups)=>{
                if(!item.component) {
                    return item
                }else {
                    componentCount++
                }
            })
            this.props.mainGroupClick(index-componentCount, this.props.vin, this.props.brand, _mainGroups, baseMainGroups)            
        }
    }


    newMainGroupClick(item, index, vin, brands, mainGroups, baseMainGroups) {
        this.props.mainGroupClick(index,this.props.vin,this.props.brand,this.state.newMainGroups,baseMainGroups)        
        let title = this.state.titleList.join(" > ")
        this.props.setNewTitle(title)
    }


    changeListType(type) {
        if(this.baseType == type) {
            return
        }
        this.baseType = type
        localStorage.setItem("listType",type)
        if(window.changePartListType) {
            window.changePartListType(type)
        }
        this.setState({
            listType: type
        })
    }

    imgError(e) {
        e.target.style.display = "none"        
    }

    chooseRow(item) {
        if(item.uri) {
            let _url = item.uri+"&vin="+this.props.vin
            Utils.get(_url, null, res=>{
                if(this.state.chooseIndex == this.state.chooseItem.length -1) {
                    this.state.chooseItem.push(res.title)
                    // this.state.titleList.push(item.name)
                }else {
                    let arr = this.state.chooseItem
                    let index = this.state.chooseIndex+1
                    arr.splice(index, arr.length-1, res.title)
                }
                let arr2 = this.state.titleList
                arr2.splice(this.state.chooseIndex, arr2.length-1, item.name)
                this.state.listData[this.state.chooseIndex] = res.data
                this.setState({
                    chooseItem: this.state.chooseItem,
                    listData: this.state.listData,
                    chooseIndex: ++this.state.chooseIndex,
                    newMainGroup: false,
                    titleList : this.state.titleList
                },()=>{                    
                    if(res.data.length === 1) {
                        this.chooseRow(res.data[0])
                    }
                })
            })
        } else {
            let _url = "/ppycars/group?"+item.keys
            Utils.get(_url, null, res=>{
                if(this.state.chooseIndex == this.state.chooseItem.length -1) {
                    this.state.chooseItem.push("选择主组信息")
                }else {
                    let arr = this.state.chooseItem
                    let index = this.state.chooseIndex+1
                    arr.splice(index,arr.length-1,"选择主组信息")
                }
                this.state.listData[this.state.chooseIndex] = res.data
                this.state.titleList[this.state.chooseIndex] = item.name               
                this.setState({
                    chooseItem: this.state.chooseItem,
                    listData: this.state.listData,
                    newMainGroups: res.data,
                    chooseIndex: ++this.state.chooseIndex,
                    specialIndex: this.state.chooseIndex
                })
            })
        }
    }

    getLists() {
        let _newMainGroupClick = this.newMainGroupClick.bind(this)        
        return(
            this.state.specialIndex === this.state.chooseIndex
            ? this.state.listData[this.state.chooseIndex-1].map((item, index) => {
                    let _title = item.name.match(/^\w*/)
                    let _content = item.name.replace(/^\w*\s/, '')
                    let _className = "main-group"
                    return (
                        <a className={_className} key={index}
                            onClick={() => _newMainGroupClick(item, index, this.searchVIN, this.currentBrands, this.state.newMainGroups , this.currentMainGroups)}>
                            <img onError={this.imgError.bind(this)} src={item.img} style={{display: 'block'}}/>
                            <span style={{display:'block'}}>{item.name}</span>
                        </a>
                    )
                })
            : this.state.listData[this.state.chooseIndex-1].map((item, index)=>{
                return(
                    <div className="one-row" key={index} onClick={this.chooseRow.bind(this, item)}>
                        {item.name}
                    </div>
                )
            })
        )
    }

    getResult() {
        // let _length = this.props.mainGroups.length    
        let _imgIsShow = this.state.listType == "imgList" ? "block" : "none"
        let _listIsShow = this.state.listType == "imgList" ? "none" : "flex" 
        let _mainGroupList = ""
        let _imgSelected = this.state.listType == "imgList" ? "imgListSelected" : "imgList"
        let _dataSelected = this.state.listType == "imgList" ? "dataList" :"dataListSelected"
        let _mainGroupClick = this.mainGroupClick.bind(this)
        if (this.props.mainGroups) {
            _mainGroupList = this.props.mainGroups.map((item, index) => {
                let _title = item.name.match(/^\w*/)
                let _content = item.name.replace(/^\w*\s/, '')
                let _className = this.state.listType == "imgList" ?  "main-group" : "main-group-data"
                _className = item.isSearched ? _className+" search" : _className
                return (
                    <a className={_className} key={index}
                        onClick={() => _mainGroupClick(item, index, this.searchVIN, this.currentBrands, this.props.mainGroups , this.currentMainGroups)}>
                        <img onError={this.imgError.bind(this)} src={item.img} style={{display: window.withoutImg(VINLANBO)  ? "none":_imgIsShow}}/>
                        <span style={{display:_imgIsShow}}>{item.name}</span>
                        <div style={{display:_listIsShow}} className='title'>{_title}</div>
                        <div style={{display:_listIsShow}} className='content'>{_content}</div>
                    </a>
                )
            })
        }
        let length = ""
        if(this.state.chooseIndex == 0) {
            length = this.props.mainGroups.length
        }else {
            length = this.state.listData[this.state.chooseIndex-1].length
        }
        return(
            <div className='container-main-group'>
                <div className='header'>
                    <span>
                         {this.state.chooseItem[this.state.chooseIndex]}
                         (共{length}组)
                    </span>
                </div>
                <div className="overflow-container">
                    <div className='content'>
                        {
                            this.state.chooseIndex 
                            ?   this.getLists()
                            :   _mainGroupList
                        }
                    </div>
                </div>
                
            </div>
        )
    }

    moveFlag(flag) {
        if(flag == -1 && this.state.chooseIndex>0) {
            this.changeChooseIndex(--this.state.chooseIndex)
        }else if(flag == 1 && this.state.chooseIndex < this.state.chooseItem.length-1) {
            this.changeChooseIndex(++this.state.chooseIndex)
        }       
        // this.changeChooseIndex(index)
    }
    toggleShowCarImg() {
        this.setState({
            subImgShow: !this.state.subImgShow
        })
    }

    render() {
        let title = this.state.titleList.join(" > ")
        let leftDisable = ""
        let RightDisable = ""
        if(this.state.chooseIndex == 0) {
            leftDisable = "disable"
        }
        if(this.state.chooseIndex == this.state.chooseItem.length-1) {
            RightDisable = "disable"
        }

        return(
            <div className="special-container-box">
                <div className="special-title">
                    <div className="step-container">
                        <div className={"btn-left " + leftDisable}   onClick={this.moveFlag.bind(this, -1)}></div>
                        <div className={"btn-right " + RightDisable} onClick={this.moveFlag.bind(this, 1)}></div>
                    </div>
                    <div className="control-container">
                        <div className="text-container">
                            {title}
                        </div>
                        <div className="left-container">
                            <span className="car-detail " onClick={this.toggleShowCarImg.bind(this)}></span>
                            <span className="img config" onClick={this.toggleCarInfo.bind(this)}></span>   
                        </div>                 
                    </div>
                </div>
                <div className="special-box">
                    <div className="left-control-box">
                        {this.getLeftItem()}
                    </div>
                    <div className="right-control-box">
                        {this.getResult()}
                    </div>
                </div>
                <div className={this.state.subImgShow ? 'container-car-info-sub-img' : 'container-car-info-sub-img hidden'}>
                    <div className='car-info-sub-remind'>同类车型图片, 仅供参考</div>
                    <img className='car-info-sub-img' src={this.props.imglogo} />
                    <CloseCanvas
                        show={true}
                        sideLength={20}
                        forkSideLength={6}
                        click={() => this.setState({subImgShow: false})}/>
                </div>
                
            </div>
        )
    }
}

class Model {
    static historys(brands, callback) {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        Utils.get('/search/vins', {
            brands
        }, res => callback(res))
    }

    static inquire(vin, brands, callback) {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        // Utils.ctrlMum('show')
        Utils.showDom(".vin-search-loading")
        Utils.get('/ppyvin/searchvins', {
            vin,
            brands
        }, res => callback(res, (() => {
            // Utils.ctrlMum('hidden')
            Utils.hideDom(".vin-search-loading")
        })()), true)
    }

    static sinquire(vin, brands, auth, callback) {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        // Utils.ctrlMum('show')
        Utils.showDom(".vin-search-loading")
        Utils.get('/ppyvin/searchvins', {
            vin,
            brands,
            auth
        }, res => callback(res, (() => {
            // Utils.ctrlMum('hidden')
            Utils.hideDom(".vin-search-loading")
        })()), true)
    }


    static group(vin, code, callback) {
        // Utils.ctrlMum('show')
        Utils.get('/ppyvin/vingroup', {
            code,
            vin
        }, res => callback(res,
            // Utils.ctrlMum('hidden')
        ), true)
    }

    static baseBrand(callback) {
        Utils.get("/brandbase", null, res => callback(res))
    }

    static searchPart(pid, auth, code, vin, callback) {
        Utils.get('/engine/parts_search', {
            pid,
            auth,
            code,
            vin
        }, res => callback(res))
    }
}
