import React from 'react'
import Root from '../root'
import ShowImageView from './show_image_view'
import PartList from './part_list'
import Utils from '../utils'
export default class SearchPartResult extends Root {
    constructor(props) {
        super(props)
        this.state = {
            itid: -1, //控制两侧的 itid
            imgRes: null, //图片请求返回数据
            listRes: null, //列表请求返回数据
            subGroups: null, //请求返回的分组
            hiddenAll: false, //是否不显示, 目前实质上是删除
            showSubClear: false, //是否显示下方搜索框的 X
            subIndex: 0,
            isShowSubGroup: true,
            filter: null,
            listResExt: {},
            listType: localStorage.getItem("listSearchType") ? localStorage.getItem("listSearchType") :"imgList",            
            keyWords: [],
            headName: "",
            partVinInput: false, //是否显示❎ 
            searchPartCode: null, //搜索的零件号
            // partSearchType: localStorage.getItem("partSearchType") ? localStorage.getItem("partSearchType") :"norPart",
            partSearchType: "norPart",
            partChooseItemShow: false,
            searchPidList: {}   //搜索结果所匹配的pid组合
        }
        this.subGroup = null //记录目前所拥有分组，避免多次请求
        this.oldVIN = ''
        this.currentSubGroups = null
        this.currentSearchPart = '' //记录每次搜索的零件号
        this.cobyPart = props.searchPartCode
        this.chooseIndex = null;
        this.baseType = ""        
        this.listTitle = ""

        if(props.searchEnter == "cars") {
            props.titleworldlist.pop()
            this.listTitle = props.titleworldlist.join(">")
        }
        
    }

    componentWillMount(props) {
        // Model.filter(this.state.filter, res => {
        //     this.setState({filter: _filter})
        //     this.updateList()
        // })
    }

    componentWillUnmount(props){
        // window.hiddenSearchPartResult = null
    }

    componentDidMount() {
        Utils.get('/userhabits', null, res => {
            this.setState({
                filter: res.data.vin_filter
            })

            if(this.props.searchPartCode){
                this.currentSearchPart = this.props.searchPartCode
                this.setState({subGroups: this.props.data}, () => {
                    if(this.state.subGroups.length > 0) this.subGroupClick(this.state.subGroups[0],0)
                    this.currentSubGroups = JSON.parse(JSON.stringify(this.props.data))
                })
            }
            this.props.setClearAll(this.clearAll.bind(this))
        })
        Utils.get("/engine/search_comp",{brand:this.props.brands, type:"p"}, res=>{
            this.setState({
                keyWords: res.data
            })
        })
    }

    componentWillReceiveProps(props) {
        if(this.cobyPart == props.searchPartCode) return
        this.cobyPart = props.searchPartCode
        this.setState({
            filter: 0
        })
        this.currentSearchPart = props.searchPartCode

        this.setState({subGroups: props.data}, () => {
            if(this.state.subGroups.length > 0) this.subGroupClick(this.state.subGroups[0],0)
            this.currentSubGroups = JSON.parse(JSON.stringify(props.data))
        })
    }

    focus() {
        this.refs.searchPart.focus()
    }

    //清空数据
    clearAll() {
        this.setState({hiddenAll: true, subGroups: null})
    }

    //重新显示
    reShow(callback) {
        this.setState({hiddenAll: false}, callback)
    }

    updateList() {
        Model.list(this.subGroup.auth, this.props.brands, this.props.vin, this.state.filter, this.currentSearchPart, res => 
            this.setState({listRes: res},()=> {
                Model.getListMore(this.props.brands,res.pid_list,response=> {
                    let partsData = response.data
                    res.data.map((item,index)=> {
                        item.map((it,ins)=> {
                            if(partsData[it.real_pid]) {
                                it.specialkey = partsData[it.real_pid]
                            }else {
                                it.specialkey = "notFind"
                            }
                        })
                    })
                    this.setState({
                        listRes: res
                    })
                })
                Model.getListIcon(res.pid_list,response=> {
                    let partsData = response.data
                    res.data.map((item,index)=> {
                        item.map((it,ins)=> {
                            if(partsData[it.real_pid]){
                                it.ugc = "hasMsg"
                            }else{
                                it.ugc = "noMsg"
                            }
                        })
                    })
                    this.setState({
                        listRes: res
                    })
                })
            })
        )
    }

    imageAndList(subGroup) {
        if(subGroup === this.subGroup) return
        else this.subGroup = subGroup
        this.setState({
            searchPidList: this.subGroup.pid_list
        })
        Model.img(this.subGroup.auth, this.props.brands, res => this.setState({imgRes: res}))
        if(this.props.searchEnter == 'cars') {
            Model.carList(this.subGroup.auth, this.props.brands, 0, subGroup.pid,res => {
                this.setState({searchlist: this.subGroup.pid_list,listRes: res, itid: res.itid || -1},()=>{
                    Model.getListMore(this.props.brands,res.pid_list,response=>{
                        let partsData = response.data
                        res.data.map((item,index)=>{
                            item.map((it,ins)=>{
                                if(partsData[it.real_pid]){
                                    it.specialkey = partsData[it.real_pid]
                                }else{
                                    it.specialkey = "notFind"
                                }
                            })
                        })
                        this.setState({
                            listRes: res,
                            selectedPid: subGroup.pid
                        })
                    })
                    Model.getListIcon(res.pid_list,response=>{
                        let partsData = response.data
                        res.data.map((item,index)=>{
                            item.map((it,ins)=>{
                                if(partsData[it.real_pid]){
                                    it.ugc = "hasMsg"
                                }else{
                                    it.ugc = "noMsg"
                                }
                            })
                        })
                        this.setState({
                            listRes: res,
                            selectedPid: subGroup.pid
                        })
                    })
                })
                setTimeout(() => {
                    this.changeItid(res.itid, 'positionclick', subGroup.pid)
                }, 0);
            })
        }else {
            Model.list(this.subGroup.auth, this.props.brands, this.props.vin, this.state.filter, subGroup.pid,res => {
                this.setState({listRes: res, itid: res.itid || -1},()=>{
                    Model.getListMore(this.props.brands,res.pid_list,response=>{
                        let partsData = response.data
                        res.data.map((item,index)=>{
                            item.map((it,ins)=>{
                                if(partsData[it.real_pid]){
                                    it.specialkey = partsData[it.real_pid]
                                }else{
                                    it.specialkey = "notFind"
                                }
                            })
                        })
                        this.setState({
                            listRes: res,
                            selectedPid: subGroup.pid
                        })
                    })
                    Model.getListIcon(res.pid_list,response=>{
                        let partsData = response.data
                        res.data.map((item,index)=>{
                            item.map((it,ins)=>{
                                if(partsData[it.real_pid]){
                                    it.ugc = "hasMsg"
                                }else{
                                    it.ugc = "noMsg"
                                }
                            })
                        })
                        this.setState({
                            listRes: res,
                            selectedPid: subGroup.pid
                        })
                    })
                })
                setTimeout(() => {
                    this.changeItid(res.itid, 'positionclick', subGroup.pid)
                }, 0);
            })
        }
        
    }

    changeItid(itid,type,choosepid) {
        listClickType = type == "positionclick" ? true :false
        listWhichClick = choosepid
        this.setState({itid: itid})
    }

    keyPress(e) {
        let _keyCode = e.which || e.keyCode
        if (_keyCode === 13) {
            this.searchPart()
        }
    }

    searchPart() {
        this.partVinInputChange()
        this.currentSearchPart = this.refs.searchPart.value
        let obj = {
            pid: this.currentSearchPart,
            auth: this.props.anyAuth,
            code: this.props.brands,
        }
        let url = '/engine/parts_search'
        if(this.props.searchEnter !== 'cars'){
            obj.vin = this.props.vin
            obj.filter = 1
        }else {
            obj.filter = 0
        }
        if(window.engCodeBrand(this.props.brands)|| window.faultCodeBrand(this.props.brands)) {
            if(this.state.partSearchType == 'norPart') {
                obj.searchtype = "pid"
            }else if(this.state.partSearchType == 'engPart') {
                obj.searchtype = "engpid"
            }else {
                url = "/parts/engine_error_code"
                obj.searchtype = 'pid'
            }
        }

        Model.searchPart(url, obj, res => {
            if(res.code == 1) {
                let _data = res.data
                this.chooseIndex = null
                this.setState({
                    subGroups: _data,
                    searchPartCode: this.currentSearchPart
                }, () => {
                    if(this.state.subGroups.length > 0) this.subGroupClick(this.state.subGroups[0],0)
                    if(this.state.subGroups.length == 1) {
                        this.setState({
                            isShowSubGroup: false
                        })
                    }else {
                        this.setState({
                            isShowSubGroup: true
                        })
                    }
                    this.currentSubGroups = JSON.parse(JSON.stringify(_data))
                })
            }else {
                this.setState({
                    subGroups: []
                })
                this.notFindShow();
            }
        })
    }

    notFindShow() {
        Utils.showDom(".part-search-error")
        let timer = setTimeout(()=>{
            Utils.hideDom(".part-search-error")
        },3000)
    }


    searchChange() {
        let _length = this.refs.searchPart.value.length
        this.setState({showClear: _length > 0})
    }

    subGroups() {
        let _imgIsShow = this.state.listType == "imgList" ? "block" : "none"
        let _listIsShow = this.state.listType == "imgList" ? "none" : "flex"
        let _listIsShowblock = this.state.listType == "imgList" ? "none" : "block"        
        let _subGroupClick = this.subGroupClick.bind(this)
        if(this.state.subGroups)
        return (
            this.state.subGroups.map((item, index) => {
                let selectClass = this.state.subIndex == index ? " selected" : ""
                let selected = this.state.subIndex == index ? true : false
                let searchClass = item.isSearched ? ' search' : ''
                // let endClass = "sub-group" + searchClass ? searchClass : selectClass
                // let baseClass = "sub-group"
                let baseClass = this.state.listType == "imgList" ?  "sub-group" : "sub-group-data"                
                let endClass = ""
                
                if(searchClass){
                    endClass = baseClass + searchClass
                }else{
                    endClass = baseClass + selectClass
                }

                return (
                    <a className={endClass} key={index}
                        title={selected ? "点击放大" : ""}
                        onClick={() => _subGroupClick(item,index)}>
                        <img style={{display:_imgIsShow}} src={item.url} alt='sub-group-img'/>
                        <div style={{display:_imgIsShow}} className={item.is_filter === 1 ? 'label filter' : 'label'}>{item.mid}</div>
                        <div className={_imgIsShow == "block" ? "float-panel" : "float-panel hidden"}>
                            {item.subgroupname}
                        </div>
                        <div style={{display:_listIsShowblock}} className='title'>
                            {item.mid}
                        </div>
                        <div style={{display:_listIsShow}} className='content'>
                            {item.subgroupname}
                        </div>
                    </a>
                )
            })
        )
    }

    subGroupClick(subGroup,index) {
        if(index == this.chooseIndex) {
            this.showSubGroup()

        } else {
            this.chooseIndex = index
            this.setState({
                subIndex: index,
                headName: subGroup.maingroup + ">" + subGroup.mid + " " + subGroup.subgroupname
            })
            this.reShow(() => this.imageAndList(subGroup))
        }
    }

    clear() {
        //清空所有
        this.setState({showClear: false, itid: -1},()=>{
            this.refs.searchPart.value = ""
            this.refs.searchPart.focus()
        })
    }

    clearSub() {
        this.setState({showSubClear: false}, ()=>{
            this.refs.searchSub.value = ""
            this.refs.searchSub.focus()
            this.searchSubChange()
        })
    }

    searchSubChange() {
        let _value = this.refs.searchSub.value
        let _subGroups = this.state.subGroups
        let _showSubClear = true

        if(_value.length < 1){
             _subGroups = JSON.parse(JSON.stringify(this.currentSubGroups))
             _showSubClear = false
        }else {
            let _sortCounter = 0 //排序计数器
            _subGroups.forEach((item, index) => {
                if(item.mid.includes(_value) || item.subgroupname.includes(_value)) {
                    item.isSearched = true
                    if(index !== 0) {
                        _subGroups.splice(_sortCounter, 0, item)
                        _subGroups.splice(index + 1, 1)
                    }
                    _sortCounter ++
                }
                else item.isSearched = false
            })
        }
        this.setState({
            subGroups: _subGroups,
            showSubClear: _showSubClear
        })
    }

    partVinInputChange() {
        let _partVinInput = ""
        if (this.refs.searchPart.value.length > 0) {
            _partVinInput = true
        } else {
            _partVinInput = false
        }
        this.setState({
            partVinInput: _partVinInput
        })
    }

    partVinInputClear() {
        let _partVin = this.refs.searchPart
        _partVin.value = ''
        this.setState({
            partVinInput: false
        })
    }

    showKeyWord(){
        if(this.state.partSearchType == 'norPart') {
            this.setState({
                keyWordsShow: true
            })
        }
    }

    hiddenKeyWord() {
        setTimeout(()=>{
            this.setState({
                keyWordsShow: false
            })
        }, 400)
    }

    showSubGroup() {
        this.setState({
            isShowSubGroup:!this.state.isShowSubGroup
        })
    }

    changeFilter() {
        this.setState({
            filter: this.state.filter == 0 ? 1 : 0
        },()=>{
            Model.filter(this.state.filter, res => {
                // this.setState({filter: _filter})
                this.updateList()
            })
        })
    }



    searchKeyWord(keyword) {
        this.refs.searchPart.value = keyword
        this.searchPart()
    }

    getkeyWord() {
        return(
            <div className={this.state.keyWordsShow ? "key-words-container" : "key-words-container hidden"}>
            <div className="key-words-title">
                {TR("热门搜索")}
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

    changeListType(type){
        if(this.baseType == type){
            return
        }
        this.baseType = type
        localStorage.setItem("listSearchType",type)
        // if(window.changePartListType){
        //     window.changePartListType(type)
        // }
        this.setState({
            listType: type
        })
    }
    chooseSearchType(type) {
        if(this.partType == type) {
            return;
        }
        this.partType == type
        localStorage.setItem("partSearchType",type)
        this.setState({
            partSearchType: type
        })
    }

    toggleChooseItem() {
        this.setState({
            partChooseItemShow: !this.state.partChooseItemShow
        })
    }

    render() {
        let _isShow = this.state.isShowSubGroup ? "flex" : "none"
        let _upClass = this.state.isShowSubGroup ? "sub-up" : ""
        let _itid = this.state.itid
        let _filterClass = this.state.filter == 1 ? "filter" : "no-filter"
        let _changeItid = this.changeItid.bind(this)
        let _length = ""
        let _chooseItem = {}
        if(this.state.subGroups){
            _length = this.state.subGroups.length
            _chooseItem = this.state.subGroups[this.state.subIndex]
        }
        let enterTypeClass = this.props.enterType == "vin" ? " vin-part-result-container" : " group-part-result-container"
        let _imgSelected = this.state.listType == "imgList" ? "imgListSelected" : "imgList"
        let _dataSelected = this.state.listType == "imgList" ? "dataList" :"dataListSelected"
        
        return (
            <div className={this.props.isShow ? 'container-search-part-result' : 'container-search-part-result hidden'} onClick={window.hiddenSearchPartResult}>
                <div className={"container-overauto"+enterTypeClass} onClick={e => e.stopPropagation()}>
                    <div className='title-main-bar'>
                        {this.props.searchEnter == 'vin' ? (this.props.vin +"  ") :  (this.listTitle +" ")} 
                        {TR("零件搜索")}:
                        <div className="close" onClick={window.hiddenSearchPartResult}></div>                        
                    </div>
                    <div className='container-title'>
                        <span className="title-part" style={{display: this.state.searchPartCode ? "block" : 'none'}}>
                            {/* 零件号“{this.props.searchPartCode}”搜索结果 */}
                            {/* 零件号“{this.state.searchPartCode}”搜索结果                            */}
                        </span>
                        <div className='container-input'>
                            <div className={(engCodeBrand(this.props.brands) || faultCodeBrand(this.props.brands)) ? 'search-type' : 'hidden'}>
                            {/* <div className={this.props.brands == "land_rover" ? 'search-type':'hidden'}  onClick={this.toggleChooseItem.bind(this)}> */}
                                {/* <div className="choose-item-container"> */}
                                    <span onClick={this.chooseSearchType.bind(this, 'norPart')}>
                                        <input type="radio" name="norPart" checked={this.state.partSearchType === 'norPart'}/>
                                        <label htmlFor="norPart">{TR("零件号")}</label>
                                    </span>
                                    {
                                        engCodeBrand(this.props.brands)
                                        ? <span onClick={this.chooseSearchType.bind(this, 'engPart')}>
                                            <input type="radio" name="engPart" checked={this.state.partSearchType === 'engPart'}/>
                                            <label htmlFor="engPart">{TR("工程编号")}</label>
                                          </span>
                                        : <span onClick={this.chooseSearchType.bind(this, 'faultCode')}>
                                            <input type="radio" name="faultCode" checked={this.state.partSearchType === 'faultCode'}/>
                                            <label htmlFor="faultCode">{TR("故障码")}</label>
                                          </span>
                                    }
                                {/* </div> */}
                            </div>
                            <input className='input'
                                placeholder={this.state.partSearchType == 'norPart' ? TR('输入零件原厂名/零件号') : this.state.partSearchType === 'engPart' ? TR("输入工程编号") : TR("输入故障码")} 
                                ref = "searchPart"
                                autoFocus
                                onChange={this.partVinInputChange.bind(this)}
                                onFocus = {this.showKeyWord.bind(this)}
                                onBlur = {this.hiddenKeyWord.bind(this)}
                                onKeyPress={this.keyPress.bind(this)}/>
                            <div className={this.state.partVinInput ? 'clear' : 'clear hidden'}
                                 onClick={this.partVinInputClear.bind(this)}></div>
                            <div className = "part-search-error" style={{display:"none"}}>
                                无此零件
                            </div>
                            <div className='img' onClick={this.searchPart.bind(this)}>
                                {TR("搜索")}
                                <div className="search-button-loading-result" onClick={e => e.stopPropagation()}>

                                </div>
                            </div>
                            {
                                this.state.keyWords.length > 0 ? this.getkeyWord() : null
                            }
                        </div>

                        <div className={this.props.searchEnter == 'vin'? "btn-container" : "hidden" }>
                            <div className="img config" title={TR("车辆配置信息")} onClick={this.props.showCarInfo.bind(this)}></div>
                            <div className={"img " + _filterClass} title="切换过滤状态" onClick={this.changeFilter.bind(this)}></div>
                        </div>
                        {/* <div className="close" onClick={window.hiddenSearchPartResult}></div> */}
                    </div>
                {
                    _length == 0 ? <div className="noSearch"></div> :
                    <div className='container-result-main'>
                        {this.state.hiddenAll ? (
                            <div className='container-image-list'></div>
                        ) : (
                            <div className='container-image-list'>
                                <ShowImageView
                                    type={this.props.type}
                                    itid={_itid}
                                    partListRes={this.state.listRes}
                                    res={this.state.imgRes}
                                    changeItid={_changeItid} />
                                <PartList
                                    {...this.props}
                                    itid={_itid}
                                    listResExt={this.state.listResExt}
                                    filterStatus={this.state.filter}
                                    res={this.state.listRes}
                                    searchPidList={this.state.searchPidList}
                                    changeItid={_changeItid}
                                    brands={this.props.brands}
                                    headName = {this.state.headName}
                                    selectedPid = {this.state.selectedPid}
                                    showEdit={this.props.showEdit}
                                    searchPartCode={this.state.searchPartCode}
                                    partSearchType={this.state.partSearchType}
                                    toggleEdit={this.props.toggleEdit}/>
                            </div>
                        )}
                        {/* <div className="icon-cert" title="选择分组" onClick={this.showSubGroup.bind(this)} style={{top: this.props.enterType == "vin" ? "224px" :"178px"}}> */}
                        <div className="icon-cert" title="选择分组" onClick={this.showSubGroup.bind(this)} style={{top: "95px"}}>
                            <span>
                                {_length}
                            </span>
                            <div>
                                {_chooseItem.mid}
                            </div>
                        </div>
                        {/* <div className='container-subgroups'  style={{display:_isShow,top: this.props.enterType == "vin" ? "214px" :"168px"}}> */}
                        <div className='container-subgroups'  style={{display:_isShow}}>
                            <div className="subgroup-title">
                                <span className="title">
                                  {this.state.searchPartCode} 
                                  {/* 搜索结果（共{_length}组）： */}
                                  {TR("searchResultTitle",_length)}
                                </span>
                                <div className="title-up-button" onClick={this.showSubGroup.bind(this)} title="显示大图">
                                    {/* 显示大图 */}
                                </div>
                                <div className='container-input'>
                                    <input ref='searchSub' className='input' placeholder='输入分组图号／分组名称'
                                        onKeyPress={this.keyPress.bind(this)}
                                        onChange={this.searchSubChange.bind(this)}/>
                                    <div className={this.state.showSubClear ? 'clear' : 'clear hidden'}
                                        onClick={this.clearSub.bind(this)}></div>
                                    <div className='img'></div>
                                </div>
                                <div className="changeTitle">
                                    <span className={_imgSelected} onClick={this.changeListType.bind(this,"imgList")} title={TR('以图片方式显示')}></span>
                                    <span className={_dataSelected} onClick={this.changeListType.bind(this,"dataList")} title={TR('以列表方式显示')}></span>
                                </div>
                            </div>
                        
                            <div className="sub-imgs">
                                {this.subGroups()}
                            </div>
                        </div>                    
                    </div>
                }
                   
                </div>

            </div>
        )
    }
}

class Model {
    /**
     * [img 获取左侧图片]
     * @param  {[string]}   auth     [分组 auth]
     * @param  {[code]}   code     [品牌 brands]
     * @param  {Function} callback [callback]
     */
    static img(auth, code, callback) {
        Utils.get('ppycars/subimgs', {auth, code}, res => callback(res))
    }

    // static imgPart
    /**
     * [list 获取右侧列表]
     * @param  {[string]}   auth     [分组 auth]
     * @param  {[string]}   vin      [搜索的车架号]
     * @param  {[string]}   filter   [是否过滤 '1' or '0']
     * @param  {Function} callback [callback]
     */

    static list(auth, code, vin, filter, pid, callback) {
        Utils.get('ppyvin/parts', {auth, code, vin, filter, pid}, res => callback(res))
    }

    static carList(auth, code, filter, pid, callback) {
        Utils.get('ppycars/parts', {auth, code, filter, pid}, res => callback(res))
    }

    static searchPart(url, obj, callback) {
        Utils.showDom(".search-button-loading-result")
        Utils.get(url, obj, res => {callback(res);
            Utils.hideDom(".search-button-loading-result")
        }, true)
    }

    static getListMore(brand, pids, callback){
        if(!pids) return;
        Utils.get("/ppys/partsmultiext",{brand,pids},res=>{
            callback(res)
        })
    }
    
    static getListIcon(pids, callback) {
        if(!pids) return;
        Utils.post("ugc/parts/reply/parts_available",{pids: pids},res=> {
            callback(res)
        })
    }

    static filter(filter, callback) {
        Utils.post('/userhabits', {habits: `{"vin_filter": "${filter}"}`}, res => callback(res))
    }
}
