import React, { Component } from 'react'
import Root from '../root'
import Utils from '../utils'
import SearchInput from 'search-input-react'
import LazyLoad from 'react-lazy-load'
export default class GroupSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            paths: [''], // 用户点击零件组的路径
            groups: [props.mainGroups.slice()], // 组别列表
            groupShowIndex: 0 // 当前显示组别的索引
        }
        this.filterStatus = props.filterStatus
    }

    componentWillReceiveProps(props) {
        let _index = props.index
        let _filterStatus = props.filterStatus
        let _auth = props.mainGroups[_index].auth
        let _brands = props.brands
        let _vin = props.vin

        this.changeFilterStatus = this.filterStatus !== _filterStatus
        if (!this.filterStatus) this.changeFilterStatus = false // 网络卡的情况下，this.filterStatus 有可能是空，这里需要保险处理
        this.filterStatus = _filterStatus

        // 点击过滤
        if (this.changeFilterStatus) this.groupItemClick(this.lastClickItem)
        // 主组出现变动
        else if (this.currentMainAuth !== _auth
            || this.currentMainGroupIndex !== _index) {

            // 主组点击变化，不是刷新
            if (this.currentMainAuth !== _auth) {
                this.state.groups = [props.mainGroups.slice()]
                this.state.paths = ['']
            }

            this.currentMainAuth = _auth
            this.currentMainGroupIndex = _index

            this.groupItemClick(props.mainGroups[_index])
        }
    }

    pathClick(index) {
        this.changeGroupShowIndex(index - 1)
    }

    selectorClick(index) {
        this.changeGroupShowIndex(index)
    }

    changeGroupShowIndex(groupShowIndex) {
        let groups = this.state.groups.slice(0, groupShowIndex + 1)
        let paths = this.state.paths.slice(0, groupShowIndex + 1)

        this.setState({ groups: [] }, () => {
            this.setState({
                groups,
                paths,
                groupShowIndex
            }, this.updateTitle.bind(this))
        })
    }

    // 更新顶部的 title
    updateTitle() {
        let _paths = this.state.paths
        let _titleSubGroup = _paths.length > 2 ? _paths[2] : ''
        if (_paths.length > 3) _titleSubGroup += ('  >  ' + _paths[3])

        let _titleMainGroup = _paths.length > 1 ? this.state.paths[1] : ''

        this.props.setTitle({
            mainGroup: _titleMainGroup,
            subGroup: _titleSubGroup
        })
    }

    groupItemClick(item) {
        // 请求中直接跳出
        if (this.isContinuing) return
        if (this.changeFilterStatus && this.state.groupShowIndex === 0) {
            this.changeFilterStatus = false
            return
        }

        window.ajaxComplete = () => this.isContinuing = false // 无论失败与否都处理
        // 保存最后一次点击的，过滤等功能使用
        this.lastClickItem = item

        let groups = this.state.groups
        let _length = groups.length

        let handleSubGroups = (groups, res, item) => {
            this.isContinuing = false
            // 如果是过滤，则只是修改最后一个值
            if (this.changeFilterStatus) {
                let group = groups[_length - 1] = res.data
                this.changeFilterStatus = false

                // 如果内容直接被过滤掉了, 则重新显示分组
                let isFind = false
                for(let i = 0, j = group.length; i < j; i ++) {
                    let item = group[i]
                    if(item.mid === this.lastClickItem.mid) {
                        isFind = true
                        break
                    }
                }
                if(!isFind) this.props.reShowGroup()
            }
            else {
                groups.push(res.data)
                let _paths = this.state.paths
                _paths.push(item.name || item.subgroupname)

                this.state.groupShowIndex += 1
            }
            
            this.setState({ groups: [] }, () => this.setState({ groups }, this.updateTitle.bind(this)))
        }

        // 分组数据请求
        let _continue = () => {
            this.isContinuing = true
            if (this.props.type == "cars") {
                this.props.setTitle({ info: this.props.title.info })
                // console.log(item)
                let _auths = item.auth
                let _brands = item.uri_param.code

                Model.subGroupsCars(_auths, _brands, res => {
                    handleSubGroups(groups, res, item)
                })
            } else {
                // 如果是改变过滤，则使用最后一次的 item
                if (this.changeFilterStatus) item = this.lastClickItem

                let _vin = item.uri_param.vin
                let _auth = item.auth
                let _brand = item.uri_param.code
                Model.subGroups(_vin, _auth, _brand, this.filterStatus, res => {
                    handleSubGroups(groups, res, item)
                })
            }
        }
        // 主组
        if (_length <= 1) {
            _continue()
        }
        // 分组或子组
        else {
            // 如果有子组
            if (item.has_subs) _continue()
            // 没有子组
            else {
                // 如果是过滤事件，就做对应请求，此请求会根据最后一个 item
                if (this.changeFilterStatus) _continue()
                // 前往零件图片列表页
                else {
                    let paths = this.state.paths
                    this.changeFilterStatus = false
                    if (paths.length === groups.length + 1) {
                        paths[paths.length - 1] = item.subgroupname
                        this.setState({ paths }, () => {
                            this.props.subGroupClick(item)
                            this.updateTitle()
                        })
                    }
                    else {
                        paths.push(item.subgroupname)
                        this.setState({ paths }, () => {
                            this.props.subGroupClick(item)
                            this.updateTitle()
                        })
                    }
                }
            }
        }
    }

    getPath(paths) {
        if (paths) return (
            paths.map((item, index) => {
                return <span key={index} className='special-group-header-path'>
                    {index <= 1 ? null : <span style={{margin: '0 4px'}}>></span>}
                    <span className='special-group-header-path-title'
                        onClick={this.pathClick.bind(this, index)}>{item}</span>
                </span>
            })
        )
    }

    render() {
        let paths = this.state.paths
        let groups = this.state.groups
        let _showClass = Utils.supportShrink() ? 'shrink' : 'hidden'
        let _className = this.props.showGroup ? 'special-group' : 'special-group ' + _showClass
        return (
            <div className={_className}>
                <div className='special-group-header'>
                    <span className='special-group-header-remind'>选择零件组</span>
                    {this.getPath(paths)}
                </div>
                <div className='special-group-content'>
                    <Selector                        
                        groups={groups}
                        selectorClick={this.selectorClick.bind(this)} />
                    <Group
                        {...this.props}
                        filterStatus={this.filterStatus}
                        group={groups[groups.length - 1]}
                        itemClick={this.groupItemClick.bind(this)}
                        groupShowIndex={this.state.groupShowIndex} />
                </div>
            </div>
        )
    }
}

class Selector extends Component {
    constructor() {
        super()
    }

    getItems() {
        let groups = this.props.groups
        let selectorClick = this.props.selectorClick

        if (groups) return (
            groups.map((group, index) => {
                let _className = 'special-group-content-selector-item'
                if (index === groups.length - 1) _className += ' selected'

                return (
                    <div key={index} className={_className}
                        onClick={() => selectorClick(index)}>
                        {index + 1} 选择{Model.groupName(index)}组(共{group ? group.length : ''}组)
                    </div>
                )
            })
        )
    }

    render() {
        return (
            <div className='special-group-content-selector'>
                {this.getItems()}
            </div>
        )
    }
}

class Group extends Component {
    constructor(props) {
        super(props)
        this.state = {
            group: JSON.parse(JSON.stringify(props.group)),
            listType: localStorage.getItem("listType") ? localStorage.getItem("listType") : "imgList",
        }
        if (props.type == "vin") {
            window.changePartListType = this.changeListType.bind(this)
        }
        this.searchInputClearValue = null // 清空图号搜索的引用
        this.selectedMid = null // 保存最后点击的分组或子组的 mid，标记
        this.baseType = ""
        props.setChangeSubGroup(this.changeSubGroup.bind(this))
        this.currentItemClickIndex = -1 // 当前选中的 item 索引
        this.imgIsShow = true
    }

    componentWillReceiveProps(props, state) {
        if (this.haveChange(props, state)) this.setState({ group: props.group })
    }

    haveChange(props, state) {
        return (
            this.currentGroupShowIndex !== props.groupShowIndex
            || this.currentGroup !== props.group
            || this.currentGroup !== state.group
        )
    }

    getListItems(group) {
        if (!group) return
        // let titleList = ["主组", "分组", "图号", "名称", "备注", "型号"]
        let titleList = TR("subTableHeader")
        
        let dataList = ["num", "subgroup", "mid", "subgroupname", "description", "model"]
        let ListTitle = <div className="sub-list-title">{
            titleList.map((item, index) => {
                return (
                    <div className="sub-list-title-item" key={index}>
                        {item}
                    </div>
                )
            })
        }
        </div>

        let filterShows = this.props.filterStatus == "0" ? "flex" : "none"
        filterShows = (this.props.type == "part" || this.props.type == "cars") ? "none" : filterShows
        let ListBody = group.map((item, index) => {
            let _className = 'special-group-content-group-item-list'
            if (item.isSearched) _className += ' search'
            if (item.mid === this.selectedMid) _className += ' selected'
            if (item.is_filter === 1) _className += " filter"
            return (
                <div key={index} className={_className}
                    onClick={() => {
                        if (item.mid) {
                            this.selectedMid = item.mid
                        }
                        this.searchInputClearValue()
                        this.itemClick(item, index)
                    }}>
                    {
                        dataList.map((it, ins) => {
                            let _content = item[it]
                            if(ins == 0){
                                _content = item[it] || item.groupnum
                            }
                            if (ins == 2) {
                                
                                _content =  item.mid || ""
                                if(item.has_subs){
                                    _content = ""
                                }
                            }
                            if (ins == 3) {
                                let _item = item.groupname || item.subgroupname
                                _content = _item.replace(/^\w*\s/, '')
                            }
                            if (ins == 5) {
                                return <div key={ins} className="sub-list-item" dangerouslySetInnerHTML={{ __html: _content }} />
                            }
                            return (
                                <div className="sub-list-item" key={ins}>
                                    {_content}
                                </div>
                            )
                        })
                    }
                </div>
            )
        })
        return (
            <div className="list-container">
                {ListTitle}
                <div className="list-body-container">
                    <div className="sub-list-items filter" style={{ "display": filterShows }}>*红色字体：非此车架号的分组（参照原厂数据）</div>
                    {ListBody}
                </div>
            </div>
        )
    }

    imgNone(e) {
        $(e.target).parents(".special-group-content-group-item").addClass("nopic")
    }

    getItems(group) {
        if (group) return (
            group.map((item, index) => {
                let _className = 'special-group-content-group-item'
                if (item.isSearched) _className += ' search'
                if (item.mid === this.selectedMid) _className += ' selected'
                if (item.is_filter === 1) _className += " filter"
                let _context = (item.name || item.subgroupname) + ' ' + (item.description || '')
                return (
                    <div key={index} className={_className}
                        onClick={() => {
                            if (item.mid) {
                                this.selectedMid = item.mid
                            }
                            this.searchInputClearValue()
                            this.itemClick(item, index)
                        }}>
                        <LazyLoad height={139} width={139} offsetTop={200}>
                            <img className='special-group-content-group-item-img' onError={this.imgNone.bind(this)} src={item.img || item.url} />                       
                        </LazyLoad>
                        
                        <span className='special-group-content-group-item-title'>{item.name || item.mid}</span>
                        {/* <div className='special-group-content-group-item-bubble'>
                            {context}s
                        </div> */}
                        <div className="special-group-content-group-item-bubble" dangerouslySetInnerHTML={{__html: _context}} />
                    </div>
                )
            })
        )
    }

    searchInputClick(value) {
        // console.log(value)
        // this.searchInputClearValue()
    }

    searchInputChange(value) {
        if (value.length < 1) {
            this.setState({ group: this.props.group })
            return
        }
        let group = JSON.parse(JSON.stringify(this.props.group))
        let _sortCounter = 0 //排序计数器
        let _regex = new RegExp(value, 'i')
        group.forEach((item, index) => {
            if (item.name) {
                if (_regex.test(item.name)) {
                    item.isSearched = true
                    if (index !== 0) {
                        group.splice(_sortCounter, 0, item)
                        group.splice(index + 1, 1)
                    }
                    _sortCounter++
                }
                else item.isSearched = false
            }
            else {
                if (_regex.test(item.subgroupname)
                    || _regex.test(item.mid)) {
                    item.isSearched = true
                    if (index !== 0) {
                        group.splice(_sortCounter, 0, item)
                        group.splice(index + 1, 1)
                    }
                    _sortCounter++
                }
                else item.isSearched = false
            }
        })
        this.setState({ group })
    }

    changeListType(type) {
        if (this.baseType == type) {
            return
        }
        this.baseType = type
        if (window.changeListTypeCallBack) {
            window.changeListTypeCallBack(type)
        }
        localStorage.setItem("listType", type)
        this.setState({
            listType: type
        })
    }

    itemClick(item, index) {
        this.props.itemClick(item)
        this.currentItemClickIndex = index
    }

    /**
     * [changeSubGroup 方向]
     * @param  {[string]} direction [next or previous]
     */
    changeSubGroup(direction) {
        // console.log(direction)
        // if (window.hiddenSearchPartResult) {
        //     window.hiddenSearchPartResult()
        // }
        let _index = this.currentItemClickIndex
        let _group = this.props.group

        if (direction === 'next') {
            _index++
            let _length = _group.length - 1
            if (_index > _length) {
                alert(TR("已到最后一组"))
            }
            _index = _index > _length ? _length : _index
        } else {
            _index--
            if (_index < 0) {
                alert(TR("已到第一组"))
            }
            _index = _index < 0 ? 0 : _index    
        }

        listWhichClick = -1 // 清空零件列表选中状态
        this.itemClick(_group[_index], _index)
    }

    render() {
        let group = this.state.group
        let itemClick = this.props.itemClick
        let groupShowIndex = this.props.groupShowIndex
        this.currentGroupShowIndex = groupShowIndex
        this.currentGroup = group
        let _subGroupList = this.state.listType == "imgList" ? this.getItems(group, itemClick) : this.getListItems(group, itemClick)
        let _subImgSelected = this.state.listType == "imgList" ? "imgListSelected" : "imgList"
        let _subDataSelected = this.state.listType == "imgList" ? "dataList" : "dataListSelected"

        return (
            <div className='container-special-group-content-group'>
                <div className='special-group-content-search'>
                    <span className='special-group-content-search-remind'>选择{Model.groupName(groupShowIndex)}组(共{group ? group.length : ''}组)</span>
                    <div className='special-group-content-search-tools'>
                        <SearchInput
                            placeholder='输入图号 / 名称'
                            searchClick={this.searchInputClick.bind(this)}
                            inputChange={this.searchInputChange.bind(this)}
                            setClearValue={handle => this.searchInputClearValue = handle} />
                        <div className="subChangeTitle">
                            <span className={_subImgSelected} onClick={this.changeListType.bind(this, "imgList")} title='以图片方式显示'></span>
                            <span className={_subDataSelected} onClick={this.changeListType.bind(this, "dataList")} title='；以列表方式显示'></span>
                        </div>
                    </div>
                </div>
                <div className='special-group-content-group'>
                    {_subGroupList}
                </div>
            </div>
        )
    }
}

class Model {
    static groupName(index) {
        return index === 0 ? '主' : index === 1 ? '分' : '子'
    }

    static subGroups(vin, auth, code, filter, callback) {
        Utils.ctrlMum('show')
        Utils.get('/ppyvin/subgroup', { vin, auth, code, filter }, res => { callback(res); Utils.ctrlMum('hidden') })
    }

    static subGroupsParts(auth, code, p, callback) {
        Utils.ctrlMum('show')
        Utils.get('/ppypart/subgroup', { auth, code, p }, res => { callback(res); Utils.ctrlMum('hidden') })
    }

    static subGroupsCars(auth, code, callback) {
        Utils.ctrlMum('show')
        Utils.get('/ppycars/subgroup', { auth, code }, res => { callback(res); Utils.ctrlMum('hidden') })
    }

    /**
     * [img 获取左侧图片]
     * @param  {[string]}   auth     [分组 auth]
     * @param  {[code]}   code     [品牌 brands]
     * @param  {Function} callback [callback]
     */
    static img(auth, code, callback) {
        Utils.get('ppycars/subimgs', { auth, code }, res => callback(res))
    }
    
    /**
     * [list 获取右侧列表]
     * @param  {[string]}   auth     [分组 auth]
     * @param  {[string]}   vin      [搜索的车架号]
     * @param  {[string]}   filter   [是否过滤 '1' or '0']
     * @param  {Function} callback [callback]
     */
    static list(auth, code, vin, filter, callback) {
        Utils.get('ppyvin/parts', { auth, code, vin, filter }, res => callback(res))
    }

    static listPart(auth, code, p, callback) {
        Utils.get("/ppypart/parts", { auth, code, p }, res => callback(res))
    }

    static listCars(auth, code, callback) {
        Utils.get("/ppycars/parts", { auth, code }, res => callback(res))
    }
}
