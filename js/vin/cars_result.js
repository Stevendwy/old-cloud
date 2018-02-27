/*
* @Author: steven
* @Date:   2017-08-11 09:31:25
* @Last Modified by:   steven
* @Last Modified time: 2017-08-17 16:44:48
*/

'use strict';
import React from 'react'
import Root from '../root'
import Content from './result_content'
import Utils from '../utils'

export default class Carresult extends Root {
    constructor(props) {
        super(props)
        this.state = {
            showGroup: props.type === "part" ? false : true, //显示主组分组
            filter: null,
            mainGroupDirection: null, //主组前进方向
            subGroupDirection: null, //分组前进方向
            showEdit: false //是否显示编辑
        }
    }

    /**
     * [toggleGroup toggle group display]
     * @param  {Function} callback [after setState]
     */
    toggleGroup(callback) {
        // console.log('toggle')
        this.setState({showGroup: !this.state.showGroup}, callback)
    }

    reShowGroup(callback) {
        // console.log('reshow')
        if(!this.state.showGroup) this.setState({showGroup: true}, callback)
    }

    hiddenGroup(callback) {
        // console.log('hidden')
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
        this.setState({showEdit: !this.state.showEdit})
    }

    setShowSearchSubGroups(handle) {
        this.showSearchSubGroups = handle
    }

    render() {
        let _toggleGroup = this.toggleGroup.bind(this)
        let _filterStatus = this.state.filter
        let _reShowGroup = this.reShowGroup.bind(this)
        let _showGroup = this.state.showGroup
        let _toggleEdit = this.toggleEdit.bind(this)

        return (
            <div className='container-result'>
                <Header
                    {...this.props}
                    showGroup={_showGroup}
                    toggleGroup={_toggleGroup}
                    filter={this.filter.bind(this)}
                    filterStatus={_filterStatus}
                    reShowGroup={_reShowGroup}
                    toggleFilter={this.toggleFilter.bind(this)}
                    changeSubGroup={direction => this.changeSubGroup(direction)}
                    toggleEdit={_toggleEdit}
                    showSearchSubGroups={this.showSearchSubGroups}/>
                <Content
                    {...this.props}
                    showGroup={_showGroup}
                    toggleGroup={_toggleGroup}
                    reShowGroup={_reShowGroup}
                    hiddenGroup={this.hiddenGroup.bind(this)}
                    setChangeSubGroup={changeSubGroup => this.changeSubGroup = changeSubGroup}
                    setShowSearchSubGroups={handle => this.setShowSearchSubGroups(handle)}
                    filterStatus={_filterStatus}
                    showEdit={this.state.showEdit}
                    toggleEdit={_toggleEdit}/>
                <Remind />
            </div>
        )
    }
}

class Header extends Root {
    constructor() {
        super()
        this.state = {
            showClear: false //是否显示 clear
        }
        window.clearSearchPart = this.resetSearchInput.bind(this)
    }

    componentWillUnmount = () => {
      window.clearSearchPart = null;
    }
    

    componentDidMount() {
        if (this.props.type!="cars") {
			//用户配置
            Utils.get('/userhabits', null, res => this.props.filter(res.data.vin_filter))
        }

        window.addEventListener('keydown', this.handleKeyDown)
    }

    handleKeyDown(e) {
        console.log(e.keyCode)
    }

    groupClick() {
        this.props.toggleGroup()
    }

    configClick() {
        this.backVIN() //就是返回功能
    }

    filterClick() {
        this.props.toggleFilter()
    }

    mainPreviousClick() {
        this.props.changeMainGroup('previous', this.props.reShowGroup)
    }

    mainNextClick() {
        this.props.changeMainGroup('next', this.props.reShowGroup)
    }

    subPreviousClick() {
        this.props.changeSubGroup('previous')
    }


    subNextClick() {
        this.props.changeSubGroup('next')
    }

    back(whoback) {
        if(this.props.showGroup) this.backVIN()
            else this.props.reShowGroup()
    }

    backVIN() {
        this.props.subSearchShow()
    }

    keyPress(e) {
        let _keyCode = e.which || e.keyCode
        if (_keyCode === 13) {
            this.searchPart()
        }
    }

    searchPart() {
        Model.searchPart(this.refs.searchPart.value, this.props.anyAuth, this.props.brands, this.props.vin, this.props.filterStatus, res => {
            // console.log(res)
            this.props.showSearchSubGroups(res)
        })
    }

    // clearSearchPart(){
    //     this.refs.searchPart.value = ""
    // }

    clear() {
        this.setState({showClear: false}, this.resetSearchInput)
    }

    searchChange() {
        let _length = this.refs.searchPart.value.length
        this.setState({showClear: _length > 0})
    }

    resetSearchInput() {
        let _searchPart = this.refs.searchPart
        _searchPart.value = ''
        _searchPart.focus()
    }

    render() {

    	let _defaultvalue = this.props.type == "cars" ? "返回车型" : "返回车架号"
        let _defaultdisplay = this.props.type == "cars" ? "none" : "flex"
        let _showGroup = this.props.showGroup
    	let _whoback = this.props.type
        return (
            <div className='container-header'>
                <div className='title'>
                    {this.props.title.info + "  >  " + this.props.title.mainGroup + "  >  " + this.props.title.subGroup.replace(/<br\/>/g ,"_")}
                </div>
                <div className='navigator'>
                    <div className='content'>
                        <div className='backs'>
                            <input className='back' type='button' defaultValue='返回'
                                onClick={this.back.bind(this,_whoback)}/>
                            <input className={this.props.showGroup ? 'back-vin hidden' : 'back-vin'} type='button' defaultValue={_defaultvalue}
                                onClick={this.backVIN.bind(this)}/>
                        </div>
                        <div className='utils'>
                            <a className='container-util'
                                onClick={this.groupClick.bind(this)}>
                                <div className='img group'></div>
                                <span>分组</span>
                            </a>
                            <a className='container-util'
                                style={{display:_defaultdisplay}}
                                onClick={this.configClick.bind(this)}>
                                <div className='img config'></div>
                                <span>配置</span>
                            </a>
                            <a className='container-util'
                                style={{display:_defaultdisplay}}
                                onClick={this.filterClick.bind(this)}>
                                <div className={this.props.filterStatus === '1' ? 'img filter' : 'img filter no-filter'}></div>
                                <span>过滤</span>
                            </a>
                            <a className='container-util large'>
                                <div className='container-imgs'>
                                    <div className='img main previous'
                                        onClick={this.mainPreviousClick.bind(this)}></div>
                                    <div className='img main next main-next'
                                        onClick={this.mainNextClick.bind(this)}></div>
                                </div>
                                <span>上/下主组</span>
                            </a>
                            <a className={!_showGroup ? 'container-util large' : 'container-util large hidden'}>
                                <div className='container-imgs'>
                                    <div className='img sub previous'
                                        onClick={this.subPreviousClick.bind(this)}></div>
                                    <div className='img sub next sub-next'
                                        onClick={this.subNextClick.bind(this)}></div>
                                </div>
                                <span>上/下分组</span>
                            </a>
                        </div>
                        <div className='search'>
                            <div className={_showGroup ? 'container-input' : 'container-input hidden'}>
                                <input ref='searchPart' className='input' placeholder='搜索零件号'
                                    // onKeyPress={this.keyPress.bind(this)}
                                    // onChange={this.searchChange.bind(this)}
                                    
                                    style={{display:_defaultdisplay}}/>
                                <div className={this.state.showClear ? 'clear' : 'clear hidden'}
                                        onClick={this.clear.bind(this)}></div>
                                <div className='img' style={{display:_defaultdisplay}}
                                    onClick={this.searchPart.bind(this)}></div>
                            </div>
                            {/* <a className='container-edit'
                                onClick={this.props.toggleEdit}>
                                <div className='img'></div>
                                <span>编辑</span>
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Remind extends Root {
    render() {
        return (
            <div className='container-remind'>
                <span>＊以上信息，仅供参考！</span>

                {/* {window.isXA ? <span>＊以上信息仅供参考</span> : <span>＊以上信息由零零汽提供，仅供参考</span>} */}
            </div>
        )
    }
}

class Model {
    static searchPart(pid, auth, code, vin, filter, callback) {
        Utils.get('/engine/parts_search', {pid, auth, code, vin, filter}, res => callback(res))
    }

    static filter(filter, callback) {
        Utils.post('/userhabits', {habits: `{"vin_filter": "${filter}"}`}, res => callback(res))
    }

    static infocars(auth, code, callback) {
        Utils.get('/ppycars/heads', {auth, code}, res => callback(res))
    }
}
