import React from 'react'
import Root from '../root'
import ResultContent from './result_content'
import Utils from '../utils'
import Uniqueness from './uniqueness'

export default class Result extends Root {
    constructor(props) {
        super(props)
        this.state = {
            showGroup: props.type === "part" ? false : true, //显示主组分组
            filter: null,
            mainGroupDirection: null, //主组前进方向
            subGroupDirection: null, //分组前进方向
            showEdit: false, //是否显示编辑
            partVinInput: false //显示clear零件号搜索
        
        }
    }

    componentDidMount() {
        if(this.props.type == "vin"){
            this.props.setResultReShowGroup(this.reShowGroup.bind(this))
        }
    }

    /**
     * [toggleGroup toggle group display]
     * @param  {Function} callback [after setState]
     */
    toggleGroup(callback) {
        let _state = {showGroup: !this.state.showGroup}
        if(_state.showGroup) _state.showEdit = false
        this.setState(_state, callback)
    }

    reShowGroup(callback) {
        if(!this.state.showGroup) this.setState({showGroup: true, showEdit: false}, callback)
    }

    hiddenGroup(callback) {
        window.operateGuideIndex = 3 // 操作指引
        this.setState({showGroup: false}, callback)
    }

    toggleFilter(callback) {
        let _filter = this.state.filter === '1' ? '0' : '1'
        Model.filter(_filter, res => {
            this.setState({filter: _filter})
        })
    }

    filter(filter) {
        this.setState({filter})
    }

    toggleEdit() {
        this.setState({showEdit: !this.state.showEdit, showGroup: false})
    }

    checkWarningShow() {
        let _currentBrands = window.currentBrands
        return _currentBrands === 'ferrari' || _currentBrands === 'bullstuff' || _currentBrands === 'volvo' || _currentBrands === 'maserati'
    }

    render() {
        let _toggleGroup = this.toggleGroup.bind(this)
        let _filterStatus = this.state.filter
        let _reShowGroup = this.reShowGroup.bind(this)
        let _showGroup = this.state.showGroup
        let _toggleEdit = this.toggleEdit.bind(this)
        let _hiddenGroup = this.hiddenGroup.bind(this)
        let _class = this.props.partListShow == false ? " hidden" : ""
        let _warningShow = this.checkWarningShow()

        return (
            <div className={'container-result' + _class}>
                <Header
                    {...this.props}
                    showGroup={_showGroup}
                    toggleGroup={_toggleGroup}
                    filter={this.filter.bind(this)}
                    filterStatus={_filterStatus}
                    reShowGroup={_reShowGroup}
					hiddenGroup={_hiddenGroup}
                    toggleFilter={this.toggleFilter.bind(this)}
                    changeSubGroup={direction => this.changeSubGroup(direction)}
                    toggleEdit={_toggleEdit}/>
                {_warningShow ? (
                    <Uniqueness
                        brands={window.currentBrands}/>
                ) : null}
                <ResultContent
                    {...this.props}
                    warningShow={_warningShow}
                    showGroup={_showGroup}
                    toggleGroup={_toggleGroup}
                    reShowGroup={_reShowGroup}
                    hiddenGroup={_hiddenGroup}
                    setChangeSubGroup={handle => this.changeSubGroup = handle}
                    filterStatus={_filterStatus}
                    showEdit={this.state.showEdit}
                    toggleEdit={_toggleEdit}/>
                <Remind
                    {...this.props}
                />
            </div>
        )
    }
}

class Header extends Root {
    constructor(props) {
        super(props)
        this.state = {
            showClear: false, //是否显示 clear
            keyWords: [],
            keyWordsShow: false
        }
        this.titleworld = ""
        if(props.type == "cars") {
           props.titleworld.pop()
           this.titleworld = props.titleworld.join(">")
        }
        window.clearPartInput = this.partVinInputClear.bind(this)

        this._handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillUnmount(){
        window.clearPartInput = null
    }

    componentDidMount() {
        // if (this.props.type!="cars") {
            //用户配置
        Utils.get('/userhabits', null, res => this.props.filter(res.data.vin_filter))
        // }

        Utils.get("/engine/search_comp",{brand:this.props.brands, type:"p"}, res=>{
            this.setState({
                keyWords: res.data
            })
        })
        window.document.addEventListener('keydown', this._handleKeyDown)
    }

    componentWillUnmount() {
        window.document.removeEventListener('keydown',this._handleKeyDown)
    }

    handleKeyDown(e) {
        let mainDisable = window.isSpecial()
        if((window.indexFlag === 'vinPage' && window.pageFlag === 'vinResultPage')
            || (window.indexFlag === 'carPage' && window.pageFlag == 'carResultPage')) {
                switch(e.keyCode) {
                    case 39:
                        this.props.changeSubGroup('next')
                        break;
                    case 37:
                        this.props.changeSubGroup('previous')
                        break;
                    case 38:
                        if(!mainDisable) {
                            this.props.changeMainGroup('previous')                            
                        }
                        break;
                    case 40:
                        if(!mainDisable) {
                            this.props.changeMainGroup('next')
                        }
                        break;
                }
        }
    }

    groupClick() {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        if(this.props.type == "vin"){
            this.props.hiddenCarInfo()
        }
        this.props.toggleGroup()
    }

    configClick() {
        // this.backVIN() //就是返回功能
        this.props.toggleCarInfo()
    }

    filterClick() {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        this.props.toggleFilter()
    }

    mainPreviousClick() {
        this.props.changeMainGroup('previous')
        // this.props.changeMainGroup('previous', this.props.reShowGroup)
    }

    mainNextClick() {
        this.props.changeMainGroup('next')
        // this.props.changeMainGroup('next', this.props.reShowGroup)
    }

    subPreviousClick() {
        this.props.changeSubGroup('previous')
    }

    subNextClick() {
        this.props.changeSubGroup('next')
    }

    back() {
        // if(window.hiddenSearchPartResult && this.props.type !== 'cars'){
        //     window.hiddenSearchPartResult()
        // }
        if(this.props.type == "vin"){
            this.props.hiddenCarInfo()
        }
        if(this.props.showGroup) {
            window.operateGuideIndex = 1 // 操作指引
            this.backVIN()
        }
        else {
            window.operateGuideIndex = 2 // 操作指引
            this.props.reShowGroup()
        }
    }

	next() {
        // if(window.hiddenSearchPartResult){
        //     window.hiddenSearchPartResult()
        // }
        if(this.props.type == "vin"){
            this.props.hiddenCarInfo()
        }
		if(this.props.showGroup) this.props.hiddenGroup()
	}

    backVIN() {
        this.props.subSearchShow()
    }

    showSearchPartInput() {
        this.currentBrands = window.currentBrands
        // return !(this.currentBrands === 'land_rover' || this.currentBrands === 'bentley' || this.currentBrands === 'benz' || this.currentBrands === 'maybach' || this.currentBrands === 'smart' || this.currentBrands === 'lexus' || this.currentBrands === 'toyota')
        return !(this.currentBrands === 'bentley' || this.currentBrands === 'benz' || this.currentBrands === 'maybach' || this.currentBrands === 'smart')
    }

    partToSearch(){
        let _value;
        // if(item){
        //     _value = item
        // }else{
        _value = this.refs.vinPart.value.replace(/\s/g, '')
        _value = _value.toUpperCase()            
        // }
        if(_value){
            window.showSearchPartResult(_value,this.notFindShow.bind(this),"group")
        }
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

    partVinInputClear() {
        let _partVin = this.refs.vinPart
        _partVin.value = ''
        // _partVin.focus()
        this.setState({
            partVinInput: false
        })
    }

    notFindShow(){
        Utils.showDom(".part-search-error")
        let timer = setTimeout(()=>{
            Utils.hideDom(".part-search-error")
        },3000)
    }

    searchKeyWord(keyword) {
        this.refs.vinPart.value = keyword
        this.partToSearch()
    }

    showKeyWord() {
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
    onlyShowSearch() {
        if(this.props.type == 'vin') {
            if(window.onlyShowPartResult) {
                window.onlyShowPartResult()
            }
        }else {
            // console.log("aaaaa")
            if(window.onlyCarShowPartResult) {
                window.onlyCarShowPartResult()
            }
        }
        
    }

    keyPress(e) {
        let _keyCode = e.which || e.keyCode
        if (_keyCode === 13) {
            this.partToSearch()
        }
    }

    render() {
        //let _defaultvalue = '下一步'//this.props.type == "part" ? "返回零件号" : "返回车架号"
        let _defaultdisplay = (this.props.type == "part") ||(this.props.type == "cars")? "none" : "flex"
        let _defaultdisplaypart = this.props.type == "part" ? "none" : "flex"
        let _showGroup = this.props.showGroup
        let _title = this.props.title        
        let _showTitle = _title.info
        let _defaultMsg = '输入零件原厂名/零件号'
        if(window.faultCodeBrand(this.props.brands)) {
            _defaultMsg = '输入零件号／故障码'                        
        }
        if(window.engCodeBrand(this.props.brands)) {
            _defaultMsg = '输入零件号／工程编号'
        }
        if(this.props.type == "cars") {
            _showTitle = this.titleworld
        }
        if(_title.mainGroup) {
            _showTitle += "  >  " + _title.mainGroup
            if(_title.subGroup) _showTitle += "  >  " + _title.subGroup

            _showTitle = _showTitle.replace(/<br\/>/g ,"_")      
            
        }
        // if(_showTitle) {
        //     console.log(_showTitle)
        // }
        
        return (
            <div className='container-header'>
                <div className='title'>
                    <img src={this.props.brandurl}/>
                    <span title={_showTitle}>
                        {_showTitle}
                    </span>
                </div>
                <div className='navigator'>
                    <div className='content'>
                        <div className='backs'>
                            <div className="btn-left" onClick={this.back.bind(this)} title={TR('返回上一步')}>
                                <span>{TR("上一步")}</span>
                            </div>
                            {window.isSpecial() ? null : (
                                <div className={_showGroup ? 'btn-right' : 'btn-right death'} title={TR('前往下一步')}
                                    onClick={this.next.bind(this)}
                                >
                                    <span>{TR("下一步")}</span>
                                </div>
                            )}
                        </div>
                        <div className='utils'>
                            {_showGroup ? null : (
                                <a className='container-util' title={TR('返回分组选择')}
                                    onClick={this.groupClick.bind(this)}>
                                    <div className='img group'></div>
                                    <span>{TR("分组")}</span>
                                </a>
                            )}
                            <a className='container-util'  title={TR('车辆配置信息')}
                                style={{display:_defaultdisplay}}
                                onClick={this.configClick.bind(this)}>
                                <div className='img config'></div>
                                <span>{TR("配置")}</span>
                            </a>
                            <a className='container-util' title={TR('切换过滤状态')}
                                style={{display:_defaultdisplay}}
                                onClick={this.filterClick.bind(this)}>
                                <div className={this.props.filterStatus === '1' ? 'img filter' : 'img filter no-filter'}></div>
                                <span>{this.props.filterStatus === '1' ? TR('过滤') : TR('未过滤')}</span>
                            </a>
                            {window.isSpecial() ? null : (
                                <a className={!_showGroup ? 'container-util large' : 'container-util large hidden'}>
                                    <div className='container-imgs'>
                                        <div className='img main previous'
                                            onClick={this.mainPreviousClick.bind(this)}>
                                                <div className="hover-class">
                                                    {TR("上一主组")}
                                                </div>
                                        </div>
                                        <div className='img main next main-next'
                                            onClick={this.mainNextClick.bind(this)}>
                                             <div className="hover-class">
                                                {TR("下一主组")}
                                            </div>
                                        </div>
                                    </div>
                                    <span>{TR("上/下主组")}</span>
                                </a>
                            )}
                            {/* {window.isSpecial() ? null : ( */}
                                <a className={!_showGroup ? 'container-util large' : 'container-util large hidden'}>
                                    <div className='container-imgs'>
                                        <div className='img sub previous'
                                            onClick={this.subPreviousClick.bind(this)}>
                                            <div className="hover-class">
                                                {window.isSpecial() ? TR('上一组') : TR('上一分组')}
                                            </div>
                                        </div>
                                        <div className='img sub next sub-next'
                                            onClick={this.subNextClick.bind(this)}>
                                            <div className="hover-class">
                                                {window.isSpecial() ? TR('下一组') : TR('下一分组')}
                                            </div>
                                        </div>
                                    </div>
                                    <span>{window.isSpecial() ? TR('上/下组') : TR('上/下分组')}</span>
                                </a>
                            {/* )} */}
                        </div>
                        <div className={window.vinSearchPart(window.currentBrands) ? 'container-input' : 'container-input hidden'}
                            onClick={this.onlyShowSearch.bind(this)}
                        >
                            {/* <div className={this.props.brands == "land_rover" ? 'search-type':'hidden'}  onClick={this.toggleChooseItem.bind(this)}>
                                <div className='choose-sure-box'>
                                    <span>{this.state.partSearchType == 'norPart' ? "零件号" : "工程编号"}</span>
                                    <b></b>
                                </div>
                                <div className="choose-item-container" style={{display: this.state.partChooseItemShow ? "block" : "none"}}>
                                    <span onClick={this.chooseSearchType.bind(this, 'norPart')}>零件号</span>
                                    <span onClick={this.chooseSearchType.bind(this, 'engPart')}>工程编号</span>                                        
                                </div>
                            </div> */}
                            {/* <div className={this.props.brands == "land_rover" ? 'search-type':'hidden'}>
                                <div className='choose-sure-box'>
                                    <span>{localStorage.getItem("partSearchType") ? (localStorage.getItem("partSearchType")== 'norPart' ? "零件号" : "工程编号") : "零件号"}</span>
                                    <b></b>
                                </div>
                            </div> */}
                            <input className='input' placeholder={TR(_defaultMsg)}
                                ref = "vinPart"
                                // onChange={this.partVinInputChange.bind(this)}
                                style={{display: _defaultdisplaypart}}
                                // onFocus = {this.showKeyWord.bind(this)}
                                // onBlur = {this.hiddenKeyWord.bind(this)}
                                // onKeyPress={this.keyPress.bind(this)}
                                />
                            <div className={this.state.partVinInput ? 'clear' : 'clear hidden'}
                                    onClick={this.partVinInputClear.bind(this)}></div>
                            <div className = "part-search-error" style={{display:"none"}}>
                                {TR("无此零件")}
                            </div>
                            <div className='img' onClick={this.partToSearch.bind(this)} style={{display: _defaultdisplaypart}}>
                                {TR("搜索")}
                                <div className="search-button-loading" onClick={e => e.stopPropagation()}>

                                </div>
                            </div>
                            {
                                this.state.keyWords.length > 0 ? this.getkeyWord() : null
                            }
                        </div>
                        <div className='search'>
                            <a className={_showGroup ? 'container-edit hidden' : 'container-edit'} title={TR('编辑零件别名')}
                                onClick={this.props.toggleEdit}>
                                <div className='img'></div>
                                <span>{TR("编辑")}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Remind extends Root {
    render() {
        let _defaultdisplay = (this.props.type == "part") ||(this.props.type == "cars")? "none" : "flex"
        return (
            <div className='container-remind'>
                {/* <div style={{display:"flex"}}>
                    <span>
                        R :含替换件
                    </span>
                    <span>
                        S :含组件
                    </span>
                </div> */}
                <span>＊{TR("以上信息仅供参考")}！</span>

                {/* {window.isXA ? <span>＊以上信息仅供参考</span> : <span>＊以上信息由零零汽提供，仅供参考</span>} */}
            </div>
        )
    }
}

class Model {
    static filter(filter, callback) {
        Utils.post('/userhabits', {habits: `{"vin_filter": "${filter}"}`}, res => callback(res))
    }
}
