import React from 'react'
import VCP from '../vcp'
import Root from '../root'
import Search from './search'
import Result from './result'
import Utils from '../utils'
import PartDetail from '../part/partdetail'
import {CarInfo} from './car_info'
import SearchPartResult from './search_part_result'
import $ from 'min-jquery'

export default class VIN extends VCP {
    constructor(props) {
        super(props)
        this.type = 'vin'
        this.subShowSearch = null //再次显示搜索，内需
        this.state = {
            show: this.type === props.type,
            neverSearch: true, //从未搜索过
            mainGroups: null, //主组
            anyAuth: null, //任意 auth，用于零件号搜索
            vin: '', //查询的 vin
            carInfos: null, //车辆配置信息
            index: -1, //选中的主组索引
            brands: 'all', //默认是 all
            title: {}, //header 的 title
            brandurl: "",
            partDate: {}, //接口返回的res
            baseDate: {}, //brands and code
            isPartShow: false,
            specialClass: "",   //奔驰4006下的配置特殊class
            refashPartResult: false,
            showSearchPartResult: false, //是否显示 vin 零件搜索结果
            partListShow: true,
            showCarInfo: false, // 是否显示车辆配置
            type: "",
            searchPartCode: "", // 搜索的零件号
            data: "", //零件号搜索要的res.data
            enterType: "",  //零件搜索入口
            partPid: "",
            newDataTitle: ""
        }
        this.baseMainGroup = "" //主组默认未排序数组
        this.bridges()
    }

    componentDidMount() {
        //全局绑定
        window.vinToPartDetail = this.vinToPartDetail.bind(this)
        window.showSearchPartResult = this.showSearchPartResult.bind(this)
        window.hiddenSearchPartResult = this.hiddenSearchPartResult.bind(this)
        window.searchToPartDetail = this.searchToPartDetail.bind(this)
        window.onlyShowPartResult = this.onlyShowPartResult.bind(this)
    }

    bridges() {
        //search_part_result
        this.clearAll = null
        this.searchPartResultFocus = null //SearchPartResult 搜索框 focus 事件
        this.resultReShowGroup = null //控制首页点击主组后显示主组分组
    }

    show() {
        if (!window.fromDOM) return
        this.setState({
            show: true,
            showSearchPartResult: false,
            isPartShow: false,
            partListShow: true
        }, this.showSubSearch)
    }

    /**
     * [search vin 搜索结果的主组点击后执行]
     * @param  {[number]} index      [主组索引]
     * @param  {[string]} vin        [vin]
     * @param  {[brands]} brands     [品牌]
     * @param  {[array]} mainGroups [整个主组]
     */
    search(index, vin, brands, mainGroups, baseMainGroup) {
        // 专门处理主组分组显示的 bug, 粗暴处理, 根据版本优化
        this.baseMainGroup = baseMainGroup
        window.isRootMainGroupClick = true
        this.setState({
            neverSearch: false,
            index,
            vin,
            brands,
            mainGroups
        }, () => {
            window.operateGuideIndex = 2 // 操作指引
            this.resultReShowGroup()
            Model.info(vin, mainGroups[0].auth, brands, res => {
                this.setState({
                    brandurl: res.data.brandurl
                }, () => this.setTitle({
                    info: this.state.newDataTitle ? res.data.carhead + ">" + this.state.newDataTitle : res.data.carhead
                }))
            })
        })
    }

    showSearch(showSearch) {
        //获取下层函数指针，用来显示内部搜索
        this.showSubSearch = showSearch
    }

    subSearchShow() {
        this.showSubSearch()
    }

    changeIndex(index) {
        this.setState({
            index
        })
    }

    /**
     * [setAnyAuth 搜索 vin 后立刻执行]
     * @param {[string]} anyAuth [any auth]
     * @param {[string]} vin     [vin]
     * @param {[string]} brands  [brands]
     * @param {[object]} carInfos  [carInfos]
     */
    setAnyAuth(anyAuth, vin, brands, brandurl, carInfos) {
        window.operateGuideIndex = 1 // 操作指引
        this.setState({
            anyAuth,
            vin,
            brands,
            brandurl,
            carInfos
        }, this.clearAll)
    }

    setNewTitle(title) {
        this.setState({
            newDataTitle: title
        })
    }
    
    setTitle(title, callback) {
        let _title = this.state.title
        _title.info = title.info || _title.info

        if (window.currentBrands === 'land_rover') _title.mainGroup = title.mainGroup || '' // _title.mainGroup 路虎模式, 主组记录问题
        else _title.mainGroup = title.mainGroup || _title.mainGroup // 普通模式

        _title.subGroup = title.subGroup || ''

        this.setState({
            title: _title
        }, callback)
    }

    showResult() {
        if (!this.state.neverSearch) return (
            <Result
                partListShow={this.state.partListShow}
                brandurl={this.state.brandurl}
                vin={this.state.vin}
                index={this.state.index}
                type="vin"
                baseMainGroup={this.baseMainGroup}
                showCarInfo={this.showCarInfo.bind(this)}
                hiddenCarInfo={this.hiddenCarInfo.bind(this)}
                toggleCarInfo={this.toggleCarInfo.bind(this)}
                changeIndex={this.changeIndex.bind(this)}
                brands={this.state.brands}
                title={this.state.title}
                setTitle={this.setTitle.bind(this)}
                mainGroups={this.state.mainGroups}
                setResultReShowGroup={handle => this.resultReShowGroup = handle}
                anyAuth={this.state.anyAuth}
                subSearchShow={this.subSearchShow.bind(this)}
                changeMainGroup={this.changeMainGroup.bind(this)} />
        )
    }

    showSearchPartResult(part, errorCallback, enterType) {
        Model.searchPart(part, this.state.anyAuth, this.state.brands, this.state.vin, res => {
            if (res.code === 1) {
                this.setState({
                    refashPartResult: false
                },()=>{
                    this.setState({
                        showSearchPartResult: true,
                        refashPartResult: true,
                        searchPartCode: part,
                        enterType: enterType,
                        data: res.data,
                        partPid: res.data[0].pid
                    }, this.searchPartResultFocus)
                })
            } else {
                // if (window.hiddenSearchPartResult) {
                //     window.hiddenSearchPartResult()
                // }
                errorCallback()
            }
        })
    }

    onlyShowPartResult() {

        this.setState({
            refashPartResult: true,
            showSearchPartResult: true,
            searchPartCode: "",
            enterType: 'search', 
            data: [],
            partPid: ""            
        })
    }

    hiddenSearchPartResult() {

        // if(window.clearPartSearch){
        //     window.clearPartSearch()
        // }
        // if(window.clearPartInput){
        //     window.clearPartInput()
        // }
        
        this.setState({
            showSearchPartResult: false,
            refashPartResult: false,
        })
    
    }

    searchToPartDetail(data) {
        Model.listHead(data, res => {
            data.length = 1
            this.setState({
                isPartShow: true,
                partDate: res,
                baseDate: data,
                partListShow: false,
                type: "search"
            })
        })
    }

    vinToPartDetail(data) {
        Model.listHead(data, res => {
            data.length = 1
            this.setState({
                isPartShow: true,
                partDate: res,
                baseDate: data,
                partListShow: false,
                type: "vin"
            })
        })
    }

    toresult() {

    }

    tohide() {
        if (this.state.type == "vin") {
            this.setState({
                isPartShow: false,
                partListShow: true
            })
        } else {
            this.setState({
                isPartShow: false,
                partListShow: true
            })
        }
    }

    changePage() {

    }

    showCarInfo() {
        this.setState({
            showCarInfo: true
        })
    }

    hiddenCarInfo() {
        this.setState({
            showCarInfo: false
        })
    }

    toggleCarInfo(special) {
        this.setState({
            showCarInfo: !this.state.showCarInfo,
            specialClass: special || ""
        })
    }

    render() {
        //父类方法
        if (this.neverShowed()) return null
        let _partResult = this.state.isPartShow ? (
            <PartDetail
                toresult={this.toresult.bind(this)}
                date={this.state.partDate}
                obj={this.state.baseDate}
                changePage={this.changePage.bind(this)}
                tohide={this.tohide.bind(this)} />
        ) : null

        let _brands = this.state.brands
        let _vin = this.state.vin
        let _searchPartCode = this.state.searchPartCode
        let _searchPartResult = this.state.refashPartResult ? (
            <SearchPartResult
                enterType={this.state.enterType}
                searchEnter="vin"  
                isShow = {this.state.showSearchPartResult}
                setClearAll={handle => this.clearAll = handle}
                setFocus={handle => this.searchPartResultFocus = handle}
                brands={_brands}
                showCarInfo={this.toggleCarInfo.bind(this)}
                searchPartCode={_searchPartCode}
                vin={_vin}
                data={this.state.data}
                type='search'
                brandurl={this.state.brandurl}
                anyAuth={this.state.anyAuth}
                partPid = {this.state.partPid}
            />
        ) : null

        return (
            <div className={'vin ' + this.containerClass()}>
                {this.showResult()}
                <Search
                    showSearch={this.showSearch.bind(this)}
                    search={this.search.bind(this)}
                    anyAuth={this.state.anyAuth}
                    brands={_brands}
                    setNewTitle = {this.setNewTitle.bind(this)}                          
                    vin={_vin}
                    toggleCarInfo = {this.toggleCarInfo.bind(this)}
                    hiddenCarInfo={this.hiddenCarInfo.bind(this)}
                    setAnyAuth={this.setAnyAuth.bind(this)}
                    brandurl={this.state.brandurl}
                />
                {_searchPartResult}
                {_partResult}
                <CarInfo
                    carInfos={this.state.carInfos}
                    show={this.state.showCarInfo}
                    specialClass={this.state.specialClass}
                    hiddenCarInfo={this.hiddenCarInfo.bind(this)}
                />
            </div>
        )
    }
}

class Model {
    static info(vin, auth, code, callback) {
        Utils.get('/ppyvin/heads', {
            vin,
            auth,
            code
        }, res => callback(res))
    }

    static listHead(obj, callback) {
        let url = "/ppys/partssearchs"
        Utils.get(url, obj, res => {
            callback(res)
        })
    }

    static searchPart(pid, auth, code, vin, callback) {
        Utils.showDom(".search-button-loading")
        Utils.get('/engine/parts_search', {
            pid,
            auth,
            code,
            vin
        }, res => {
            callback(res),
                Utils.hideDom(".search-button-loading")
        }, true)
    }
}
