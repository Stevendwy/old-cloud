import React from 'react'
import Root from '../root'
import ShowImageView from './show_image_view'
import PartList from './part_list'
import Utils from '../utils'
import $ from 'min-jquery'
import SpecialGroup from './result_special_group'
import LazyLoad from 'react-lazy-load'

export default class ResultContent extends Root {
    constructor() {
        super()
        this.state = {
            subGroup: null //当前图片与零件列表对应的分组
        }
    }
    
    /**
     * [subGroupClick description]
     * @param  {[array]} subGroup      [description]
     * @param  {[bool]} fromMainGroup [是否是点击主组默认点击分组]
     * @return {[type]}               [description]
     */
    subGroupClick(subGroup, fromMainGroup) {
        this.setState({subGroup}, fromMainGroup ? null : this.props.hiddenGroup)
    }

    getGroup() {
        let _Group = null
        // if(window.three_layout_principle[window.currentBrands])
        if(window.isSpecial()) 
        _Group = (
            <SpecialGroup
                {...this.props}
                subGroupClick={this.subGroupClick.bind(this)}/>
        )
        else _Group = (
            <Group
                {...this.props}
                subGroupClick={this.subGroupClick.bind(this)}/>
        )
        return _Group
    }

    render() {
        let _style = null
        if(this.props.warningShow) _style = {height: 'calc(100% - 168px)'}

        return (
            <div className='container-content'
                style={_style}>
                <Part
                    {...this.props}
                    subGroup={this.state.subGroup}/>
                {this.getGroup()}
            </div>
        )
    }
}

class Group extends Root {
    constructor(props) {
        super(props)
        this.state = {
            clearshow:false,
            // mainGroups: props.mainGroups,
            subGroups: null,
            currentMainGroup: this.currentMainGroup(props),
            searchSubGroups: null, //搜索的分组
            subIndex: -1,
            errorShow: false,
            listType:localStorage.getItem("listType") ? localStorage.getItem("listType") : "imgList",
            subListType:localStorage.getItem("subListType") ? localStorage.getItem("subListType") : "imgList",
            mainErrorshow: false,
            mainClearshow: false,
            inputIsShow: false,//默认不显示input
        }
        // this.auth = null //当前主组的 auth，避免多次请求
        this.filterStatus = -1 //当前过滤状态
        this.currentMainGroupIndex = -1 //当前选定的主组索引
        this.currentSubGroupIndex = -1 //当前选定的分组索引
        this.currentSubGroups = null //搜索保存历史分组
        this.currentSearchSubGroup = null //搜索保存历史搜索结果分组
        this.currentMainAuth = null //当前保存的主组 auth
        this.neverInto = true //第一次直接进去分组定位零件号
        this.currentSubGroupMid = null //记录当前分组 auth, 用于处理过滤判断
        this.baseType = ""
        this.timer = null
        window.isReturn = false
        props.setChangeSubGroup(this.changeSubGroup.bind(this))
        window.changePartListType = this.changeListType.bind(this)
    }

    componentDidMount() {
        if (this.props.type == "cars") {
            this.mainGroupsClick(this.props.index)
        }
    }

    componentWillReceiveProps(props) {
        let _index = props.index
        let _filterStatus = props.filterStatus
        let _auth = props.mainGroups[_index].auth
        let _brands = props.brands
        let _vin = props.vin

        //点击过滤，搜索处点击主组

        if(this.props.type === 'cars') {
            if(this.currentMainAuth !== _auth
            || this.currentMainGroupIndex !== _index) {
                this.mainGroupsClick(_index, _filterStatus, _auth, _brands, _vin)
            }
        }else {
            if(this.currentMainAuth !== _auth
            || this.filterStatus !== _filterStatus
            || this.currentMainGroupIndex !== _index) this.mainGroupsClick(_index, _filterStatus, _auth, _brands, _vin)
        }
    }

    imgError(e) {
        e.target.style.display = "none"
    }

    mainGroups() {
        let _imgIsShow = this.state.listType == "imgList" ? "block" : "none"
        let _listIsShow = this.state.listType == "imgList" ? "none" : "flex"
        if(this.props.mainGroups) return (
            this.props.mainGroups.map((item, index) => {
                let _title
                let _content
                if(this.props.type == "part"){
                    // _title = item.groupname
                    _title = item.groupname.match(/^\w*/)
                    _content = item.groupname.replace(/^\w*\s/, '')
                }else{
                    _title = item.name.match(/^\w*/)
                    _content = item.name.replace(/^\w*\s/, '')
                }
                let _index = this.props.index
                let _className = this.state.listType == "imgList" ?  "main-group" : "main-group-data"
                _className = index == _index ? _className + " selected" : _className
                return (
                    <a className={_className} key={index}
                        onClick={this.safeMainGroupClick.bind(this, index)}>
                        {/* <div className='title'>{_title}</div>
                        <div className='content'>{_content}</div> */}
                        {/* <img style={{display:(this.props.brands == "bullstuff"||this.props.brands == "astonmartin") ? "none": _imgIsShow}} src={item.img}/> */}
                        <img onError={this.imgError.bind(this)} style={{display:window.withoutImg(this.props.brands) ? "none": _imgIsShow}} src={item.img}/>
                        <span style={{display:_imgIsShow}}>{item.name}</span>
                        <div style={{display:_listIsShow}} className='title'>{_title}</div>
                        <div style={{display:_listIsShow}} className='content'>{_content}</div>
                    </a>
                )
            })
        )
    }

    safeMainGroupClick(index) {
        if(index !== this.currentMainGroupIndex) this.mainGroupsClick(index)
    }

    /**
     * [mainGroupsClick main group click]
     * @param  {[number]} index   [主组索引]
     * @param  {[filter]} filter [可选，上层传递]
     * @param  {[number]} index  [可选，本层点击]
     */

    // this.isReturn = false
    // this.timer = null
    mainGroupsClick(index, filter, auth, brands, vin) {

        // if(window.isReturn){
        //     return
        // }else{
        //     window.isReturn = true
        //     if(!this.timer){
        //         this.timer = setTimeout(()=>{
        //             clearTimeout(this.timer)
        //             this.timer = null
        //             window.isReturn = false 
        //         },2000)
        //     }
        // }

        let _changeMainGroup = (this.currentMainGroupIndex !== index
            || this.currentMainAuth !== auth) //是否是改变了主组，下面决定是否需要显示主组分组，如果是过滤，不做显示主组和分组处理

        let _isChangeFilter = this.filterStatus !== filter
        if(!_changeMainGroup && !_isChangeFilter) return //无变化就退出
        else {
            this.filterStatus = filter || this.filterStatus
            this.currentMainGroupIndex = index
            this.currentMainAuth = auth || this.props.mainGroups[index].auth
        }
        let _auth = this.currentMainAuth

        //mainGroup
        if(this.props.type === "part"){
            Model.subGroupsParts(_auth, brands || this.props.brands, this.props.p , res=>{
                let _data = res.data
                this.currentSubGroups = JSON.parse(JSON.stringify(_data))
                let _state = {
                    subGroups: _data
                }
                if(index || index == 0) _state.currentMainGroup = this.props.mainGroups[index]
                this.setState(_state,() => {
                    this.props.changeIndex(this.currentMainGroupIndex)
                    this.props.setTitle({
                        mainGroup: this.state.currentMainGroup.groupname,
                        subGroup: ''
                    })
                })
                if(res.sets.auth && this.neverInto){
                    this.props.subGroupClick(res.sets)
                    this.props.setTitle({subGroup: res.sets.subgroupname})
                    this.currentSubGroupIndex = res.sets.index
                    this.neverInto = false
                }else{
                    this.subGroupsClick(0, true)
                }
            })
        }else if(this.props.type === "cars"){
            Model.subGroupsCars( _auth, brands || this.props.brands, res => {
                let _data = res.data
                this.currentSubGroups = JSON.parse(JSON.stringify(_data))
                let _state = {
                    subGroups: _data
                }
                if(index || index == 0) _state.currentMainGroup = this.props.mainGroups[index]

                this.setState(_state, () => {
                    this.subGroupsClick(0, true)
                    this.props.changeIndex(this.currentMainGroupIndex)
                    this.props.setTitle({
                        mainGroup: this.state.currentMainGroup.groupname,
                        subGroup: ''
                    })
                })
            })
        }else{
            if(this.filterStatus === -1) return //没有拿到 filterStatus 直接跳出

            let _oldSubGroupMid = this.currentSubGroupMid

            Model.subGroups(vin || this.props.vin, _auth, brands || this.props.brands, this.filterStatus, res => {
                let _data = res.data
                this.currentSubGroups = JSON.parse(JSON.stringify(_data))
                //判断选择的这组还在不在现在的数组里面
                let isFind = false
                this.currentSubGroupIndex = 0
                this.currentSubGroups.map((item,index)=>{
                    if(item.mid === _oldSubGroupMid){
                        this.currentSubGroupIndex = index
                        isFind = true
                    }
                })
                // console.log(_changeMainGroup)
                if(_changeMainGroup){
                    this.currentSubGroupIndex = 0
                }
                if(!isFind && !_changeMainGroup){
                    this.props.reShowGroup()
                }

                let _state = {
                    subGroups: _data
                }

                if(index || index == 0) _state.currentMainGroup = this.props.mainGroups[index]
                this.setState(_state, () => {
                    this.props.changeIndex(this.currentMainGroupIndex)
                    this.props.setTitle({
                        mainGroup: this.state.currentMainGroup.name,
                        subGroup: ''
                    }, () => this.subGroupsClick(this.currentSubGroupIndex, true))
                })
            })
        }
    }

    currentMainGroup(props) {
        let _index = props.index
        for(let i = 0, j = props.mainGroups.length; i < j; i++) {
            // let _mainGroup = props.mainGroups[i]
            if(i === _index) return props.mainGroups[i]
        }
    }

    subGroupsClick(index, fromMainGroup) {
        this.currentSubGroupIndex = index
        listWhichClick = -1
        let _subGroup = this.state.subGroups[index]
        // console.log(index)
        //保存当前 mid, 区分是否过滤显示第一个问题
        this.currentSubGroupMid = _subGroup.mid
        this.clearshow() //清空搜索框, 同时获取焦点可直接搜索
        this.setState({
            subIndex : index
        }, () => {
            //代码专门暴力处理显示主组分组显示问题, 后期需要根据版本优化
            if(window.isRootMainGroupClick) {
                window.isRootMainGroupClick = false
                this.props.reShowGroup()
            }
        })
        this.props.subGroupClick(_subGroup, fromMainGroup)
        this.props.setTitle({subGroup: _subGroup.subgroupname})
        this.props.hiddenCarInfo()
    }

    /**
     * [changeSubGroup 方向]
     * @param  {[string]} direction [next or previous]
     */
    changeSubGroup(direction) {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        let _index = this.currentSubGroupIndex
        if(direction === 'next') {
            _index++
            let _length = this.state.subGroups.length - 1
            if(_index > _length){
                alert(TR("已到最后一分组"))
            }
            _index = _index > _length ? _length : _index
        }else {
            _index--
            if(_index < 0){
                alert(TR("已到第一分组"))
            }
            _index = _index < 0 ? 0 : _index
        }

        this.subGroupsClick(_index)
    }

    searchChange() {
        let _value = this.refs.search.value
        let _clearshow = false
        let _errorShow = false
        let _subGroups = this.state.subGroups
        if(_value.length < 1){
            _clearshow = false
            _errorShow = false
             _subGroups = JSON.parse(JSON.stringify(this.currentSubGroups))
        }else {
            _clearshow = true
            let _sortCounter = 0 //排序计数器
            _subGroups.forEach((item, index) => {
                if(item.subgroupname.includes(_value)) {
                    item.isSearched = true
                    _errorShow = false
                    if(index !== 0) {
                        _subGroups.splice(_sortCounter, 0, item)
                        _subGroups.splice(index + 1, 1)
                    }
                    _sortCounter ++
                }
                else{
                    if(_sortCounter==0){
                        _errorShow = true
                    }
                    item.isSearched = false
                }
            })
        }
        this.setState({
            subGroups: _subGroups,
            clearshow: _clearshow,
            errorShow: _errorShow,
            // inputIsShow: true
        })
    }

    clearshow(){
        this.setState({
            errorShow: false
        })
        if(this.refs.search) {
            let _searchPart = this.refs.search
            _searchPart.value = ''
            this.searchChange()    
        }
            // _searchPart.focus()
    }

    changeListType(type){
        if(this.baseType == type){
            return
        }
        this.baseType = type
        if(window.changeListTypeCallBack){
            window.changeListTypeCallBack(type)            
        }
        localStorage.setItem("listType",type)
        this.setState({
            listType:type
        })
    }

    changeSubListType(type){
        localStorage.setItem("subListType",type)
        this.setState({
            subListType: type
        })
    }

    subGroups() {
        let _subGroupsClick = this.subGroupsClick.bind(this)
        if(this.state.subGroups) return (
            this.state.subGroups.map((item, index) => {
                let _detailMsg = item.subgroupname+"<br/>"+item.description
                if(item.model){
                    _detailMsg = item.subgroupname +"<br/>型号：<br/>"+item.model+"<br/>"+item.description
                }
                let selectClass = this.state.subIndex == index ? " selected" : ""
                let searchClass = item.isSearched ? ' search' : ''
                // let endClass = "sub-group" + searchClass ? searchClass : selectClass
                let baseClass = "sub-group"
                let endClass = ""
                if(searchClass){
                    endClass = baseClass + searchClass
                }else{
                    endClass = baseClass + selectClass
                }
                return (
                    <a className={endClass} key={index}
                        onClick={() => _subGroupsClick(index)}>
                        <LazyLoad height={140} width={140} offsetTop={200}>
                            <img src={item.url} alt='sub-group-img' />                    
                        </LazyLoad>
                        <div className={item.is_filter === 1 ? 'label filter' : 'label'}>{item.mid}</div>
                        {/* <div className="float-panel">
                            {item.subgroupname}
                            <br/>
                            型号：
                            {item.model}
                        </div> */}
                        <div className="float-panel" dangerouslySetInnerHTML={{__html: _detailMsg}} />
                    </a>
                )
            })
        )
    }
    
    subGroupsList(){
        // let titleList = ["主组","分组","图号","名称","备注","型号"]
        let titleList = TR("subTableHeader")
        let dataList = ["num","subgroup","mid","subgroupname","description","model"]
        let ListTitle = <div className="sub-list-title">{
                titleList.map((item,index)=>{
                    return(
                        <div className="sub-list-title-item" key={index}>
                            {item}
                        </div>
                    )
                })
            }
        </div>
        let _subGroupsClick = this.subGroupsClick.bind(this)
        let filterShows = this.props.filterStatus == "0" ? "flex" : "none"
        filterShows = ( this.props.type == "part" || this.props.type == "cars")  ? "none" : filterShows
        if(this.state.subGroups){
            let ListBody =  this.state.subGroups.map((item, index) => {
                    let baseClass = 'sub-list-items'
                    let selectClass = this.state.subIndex == index ? " selected" : ""
                    let searchClass = item.isSearched ? ' search' : ''
                    let endClass = ""
                    let filterClass = item.is_filter === 1 ? ' filter' : ''
                    if(searchClass){
                        endClass = baseClass + searchClass + filterClass
                    }else{
                        endClass = baseClass + selectClass + filterClass
                    }
                    return(
                        <div className={endClass} onClick={()=>_subGroupsClick(index)} key={index}>{
                            dataList.map((it,ins)=>{
                                let _content = item[it]
                                if(ins == 3){
                                    let _title = item.mid.match(/^\w*/)
                                    _content = item.subgroupname.replace(/^\w*\s/, '')
                                }
                                if(ins == 5 || ins == 3 || ins == 4){
                                    return <div key={ins} className="sub-list-item" dangerouslySetInnerHTML={{__html: _content}}/>
                                }
                                return(
                                    <div className="sub-list-item" key={ins}>
                                        {_content}
                                    </div>
                                )
                            })
                            }
                        </div>
                    )
                })
                return(
                    <div className="list-container">
                        {ListTitle}
                        <div className="list-body-container">
                            <div className="sub-list-items filter" style={{"display":filterShows}}>*{TR("红色字体：非此车架号的分组（参照原厂数据）")}</div>
                            {ListBody}
                        </div>
                    </div>
                )
        }
    }

    searchChangeMain() {
        let _value = this.refs.searchMain.value
        let _clearshow = false
        let _errorshow = false
        // console.log(_value)
        // console.log("running")
        let _mainGroups = ""
        if(this.props.type == "vin"){
            _mainGroups = JSON.parse(JSON.stringify(this.props.baseMainGroup))
            // console.log(this.props.baseMainGroup)
        }else{
            _mainGroups = JSON.parse(JSON.stringify(this.props.mainGroups))
        }
        if(_value.length < 1){
            _clearshow = false
            _errorshow = false
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
        if(this.refs.search) {
            let _searchPart = this.refs.search
            _searchPart.value = ''
            this.searchChange()
        
        }
   
            // _searchPart.focus()
    }

    showInput(){
        let _searchPart = this.refs.search
        _searchPart.value = ''
        _searchPart.focus()
        this.setState({
            inputIsShow: true
        })
    }

    hiddenInput(){
        this.refs.searchMain.value = ""
        this.setState({
            inputIsShow: false,
            clearshow: false,
            errorShow: false
        })
    }

    render() {
        let filterShow = this.props.filterStatus == "0" ? "inline-block" : "none"
        filterShow = ( this.props.type == "part" || this.props.type == "cars")  ? "none" : filterShow
        let _subGroupList = this.state.subListType == "imgList" ? this.subGroups() : this.subGroupsList()
        let _subContentClass = this.state.subListType == "imgList" ? "content" : "content-list"
        let _subImgSelected = this.state.subListType == "imgList" ? "imgListSelected" : "imgList"
        let _subDataSelected = this.state.subListType == "imgList" ? "dataList" :"dataListSelected"
        let _imgSelected = this.state.listType == "imgList" ? "imgListSelected" : "imgList"
        let _dataSelected = this.state.listType == "imgList" ? "dataList" :"dataListSelected"
        let _mainCleaError = this.state.mainClearshow
        let _mainErrorShow = this.state.mainErrorshow ? "block" : "none"

        let _currentMainGroup = this.state.currentMainGroup
        let _title = ""
        if(this.props.type === "part") {
            _title = _currentMainGroup.groupname
        }else if(this.props.type === "cars") {
            _title = _currentMainGroup.groupname
        }else {
            _title = _currentMainGroup.name.replace(/^\w*\s/, '')
        }
        let _mainLength = this.props.mainGroups.length
        let _subLength = ""
        if(this.state.subGroups) _subLength = this.state.subGroups.length

        let _showClass = Utils.supportShrink() ? 'shrink' : 'hidden'

        let _className = this.props.showGroup ? 'container-group-selector' : 'container-group-selector ' + _showClass
        let _errorShow = this.state.errorShow ? "block" : "none"

        let filterShows = this.props.filterStatus == "0" ? "flex" : "none"
        filterShows = ( this.props.type == "part" || this.props.type == "cars")  ? "none" : filterShows



        return (
            <div className={_className}>
                <div className='container-main-groups'>
                    <div className='title'>
                        {/* <span>选择主组（共{_mainLength}组）：</span> */}
                        <span>{TR("mainGroupTitle",_mainLength)}：</span>

                        <div className="changeTitle">
                            <span className={_imgSelected} onClick={this.changeListType.bind(this,"imgList")} title='以图片方式显示'></span>
                            <span className={_dataSelected} onClick={this.changeListType.bind(this,"dataList")} title='以列表方式显示'></span>
                        </div>
                        <div className='search' style={{display: 'none'}}>
                            <input ref='searchMain' className='input'
                                placeholder='输入主组图号/名称'
                                onChange={this.searchChange.bind(this)} />
                            <div className={this.state.mainClearshow ? 'clear' : 'clear hidden'}
                                onClick={this.clearshow.bind(this)}>
                            </div>
                            <div className = "input-search-error" style={{display:_mainErrorShow}}>
                                {TR("未搜索到相关结果")}
                            </div>
                            <div className='img'></div>
                        </div>
                    </div>
                    <div className='content'>
                        {this.mainGroups()}
                    </div>
                </div>
                <div className='container-sub-groups'>
                    <div className='title'>
                        {/* <span>选择分组（共{_subLength}组）： */}
                        <span>{TR("subGroupTitle",_subLength)}：
                            <span className='remind-filter' style={{display:"none"}}>*红色标记：未经VIN过滤的分组</span></span>
                        <div className='search'>
                            <input ref='search' className={this.state.inputIsShow ? 'input' : 'input transparent'}
                                placeholder='输入图号/名称'
                                onBlur = {this.hiddenInput.bind(this)}
                                onChange={this.searchChange.bind(this)} />
                            <div className={this.state.clearshow ? 'clear' : 'clear hidden'}
                                onClick={this.clearshow.bind(this)}>
                            </div>
                            <div className = "input-search-error" style={{display:_errorShow}}>
                                未搜索到相关结果
                            </div>
                            <div className='img'
                                onClick = {this.showInput.bind(this)}
                            ></div>
                        </div>
                        <div className="subChangeTitle">
                            <span className={_subImgSelected} onClick={this.changeSubListType.bind(this,"imgList")} title='以图片方式显示'></span>
                            <span className={_subDataSelected} onClick={this.changeSubListType.bind(this,"dataList")} title='以列表方式显示'></span>
                        </div>
                    </div>
                    <div className={_subContentClass}>
                        <div className={this.state.subListType == "imgList" ? 'filter' : 'hidden'} style={{"display":filterShows}}>*红色字体：非此车架号的分组（参照原厂数据）</div>
                       {_subGroupList}
                    </div>
                </div>
            </div>
        )
    }
}

class Part extends Root {
    constructor(props) {
        super(props)
        this.state = {
            itid: -1, //控制两侧的 itid
            imgRes: null, //图片请求返回数据
            listRes: null, //列表请求返回数据
            listResExt: {}
        }
        this.subGroup = null //记录目前所拥有分组，避免多次请求
        this.filterStatus = props.filterStatus //当前 filter 状态，用户处理更新
    }

    componentWillReceiveProps(props) {
        if(props.subGroup) {
            if(props.filterStatus !== this.filterStatus) this.updateList(props)
            else this.imageAndList(props.subGroup)
        }
    }

    updateList(props) {
        this.filterStatus = props.filterStatus
        if(this.props.type == "part" || this.props.type == "cars")  return
        this.setState({listRes: []}, () => {
            Model.list(props.subGroup.auth, props.brands, props.vin, this.filterStatus, res => this.setState({listRes: res},()=>{
                    Model.getListMore(this.props.brands,res.pid_list,response=>{
                        if(response.code == 1) {
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
                                listRes: res
                            })
                        }
                    })

                    Model.getListIcon(res.pid_list,response=>{
                        if(response.code == 1) {
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
                                listRes: res
                            })
                        }
                    })
            }))
           
        })
    }

    imageAndList(subGroup) {
        if(subGroup === this.subGroup) return
        else this.subGroup = subGroup
        Model.img(this.subGroup.auth, this.props.brands, res => this.setState({imgRes: res}))
        this.setState({listRes: []}, () => {
            if(this.props.type == "part"){
                Model.listPart(this.subGroup.auth,this.props.brands,this.props.p,res => {
                    this.setState({
                        listRes: res,
                        itid: -1
                    },()=>{
                        this.listMore(res,this.props.brands,res.pid_list)                        
                    })
                    if(res.itid){
                        this.changeItid(res.itid,"positionclick",this.props.p)
                    }
                })
            }else if(this.props.type == "cars"){
                Model.listCars(this.subGroup.auth,this.props.brands,res => {
                    this.setState({
                        listRes:res, 
                        itid: -1
                    },()=>{
                        this.listMore(res,this.props.brands,res.pid_list)                
                    })
                })
            }else{
                Model.list(this.subGroup.auth, this.props.brands, this.props.vin, this.filterStatus, res => 
                    this.setState({listRes: res, itid: -1},()=>{
                        this.listMore(res,this.props.brands,res.pid_list)                                        
                    })
                )
            }
        })
    }

    listMore(response,brands,pids){
        this.setState({
            listResExt: {}
        },()=>{
            Model.getListMore(brands,pids,res=>{
                let partsData = res.data
                response.data.map((item,index)=>{
                    item.map((it,ins)=>{
                        if(partsData[it.real_pid]){
                            it.specialkey = partsData[it.real_pid]
                        }else{
                            it.specialkey = "notFind"
                        }
                    })
                })
                this.setState({
                    listRes: response
                })
            })

            Model.getListIcon(pids,res=>{
                let partsData = res.data
                response.data.map((item,index)=>{
                    item.map((it,ins)=>{
                        if(partsData[it.real_pid]){
                            it.ugc = "hasMsg"
                        }else{
                            it.ugc = "noMsg"           
                        }
                    })
                })
                this.setState({
                    listRes: response
                })
            })
        })
    }

    changeItid(itid,type,choosepid) {
        listClickType = type == "positionclick" ? true :false
        listWhichClick = choosepid
        this.setState({itid: itid})
    }

    render() {
        let _itid = this.state.itid
        let _changeItid = this.changeItid.bind(this)

        return (
            <div className='container-image-list'>
                <ShowImageView
                    type={this.props.type}
                    itid={_itid}
                    res={this.state.imgRes}
                    partListRes={this.state.listRes}
                    changeItid={_changeItid} />
                <PartList
                    {...this.props}
                    itid={_itid}
                    res={this.state.listRes}
                    listResExt={this.state.listResExt}
                    changeItid={_changeItid}
                    brands={this.props.brands}
                    showEdit={this.props.showEdit}
                    toggleEdit={this.props.toggleEdit}/>
            </div>
        )
    }
}

class Model {
    static subGroups(vin, auth, code, filter, callback) {
        Utils.get('/ppyvin/subgroup', {vin, auth, code, filter}, res => callback(res))
    }

    static subGroupsParts(auth, code, p, callback){
        Utils.get('/ppypart/subgroup',{auth,code,p},res=>callback(res))
    }

    static subGroupsCars(auth, code,  callback){
        Utils.get('/ppycars/subgroup',{auth,code},res=>callback(res))
    }
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
    static list(auth, code, vin, filter, callback) {
        Utils.showDom('.list-foot-loading')
        Utils.get('ppyvin/parts', {auth, code, vin, filter}, res => {
            Utils.hideDom(".list-foot-loading")
            callback(res)
        })
    }

    static listPart(auth, code, p, callback){
        Utils.showDom('.list-foot-loading')
        Utils.get("/ppypart/parts",{auth, code, p},res => {
            Utils.hideDom(".list-foot-loading")
            callback(res)
        })
    }

    static listCars(auth, code,  callback){
        Utils.showDom('.list-foot-loading')
        Utils.get("/ppycars/parts",{auth, code},res => {
            Utils.hideDom(".list-foot-loading")
            callback(res)
        })
    }

    static getListMore(brand,pids,callback){
        if(!pids) return
        Utils.get("/ppys/partsmultiext",{brand,pids},res=>{
            callback(res)
        },true)
    }

    static getListIcon(pids, callback) {
        if(!pids) return;
        Utils.post("ugc/parts/reply/parts_available",{pids: pids},res=> {
            callback(res)
        })
    }
}
