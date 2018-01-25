import React, {
    Component
} from 'react'
import AddAlias from './addalias'
import Utils from '../utils'
import CardSelector from '../card_selector'
import { Prompt } from "dialog-react"
export default class PartList extends Component {
    constructor() {
        super()
        this.state = {
            itid: '-1',
            showMessage: false, //是否需要显示警告
            titles: [], // card_selector titles
            cardSelectorShow: false, // hidden card_selector
            listHead: [],
            showOnce: false,
            res: "",
            msg: "",
            showDialog: false,
            chooseTitle: "基础信息"
        }
        this.obj = {}
        window.partDetailDestoryTitle = this.destroyTitle.bind(this)
    }

    componentWillReceiveProps(props) {
        let _state = {}
        let _callback = null
        //清空再生成
        if (props.itid) {
            _state.itid = props.itid
            _callback = () => {
                if (props.itid) this.scrollToTop()
            }
        }
        if (props.res && props.res.status === 'base') _state.showMessage = true
        else _state.showMessage = false
        this.setState(_state, _callback)
    }

    scrollToTop() {
        let _isSub = false
        let _selectedItems = document.getElementsByClassName('container-footer-item selected')
        if (_selectedItems.length < 1) {
            _selectedItems = document.getElementsByClassName('footer-item itemselect')
            _isSub = true
        }
        if (_selectedItems.length > 0) {
            //可能能多个列表, 所以使用遍历
            for (let i = 0, j = _selectedItems.length; i < j; i++) {
                let _el = _selectedItems[i]
                let _ctpOffsetTop = 0 //子级相对与父级的内部偏移量
                let _parent = _el.parentNode
                if (_isSub) {
                    _ctpOffsetTop = _el.offsetTop
                    _el = _el.parentNode
                    _parent = _el.parentNode
                }
                // 是否在列表下方不可见区域
                let _inBottom = _el.offsetTop + _ctpOffsetTop >= _parent.offsetHeight + _parent.scrollTop
                //是否在列表上方不可见区域
                let _inTop = _el.offsetTop + _ctpOffsetTop  < _parent.scrollTop

                if (_inBottom) _parent.scrollTop = _el.offsetTop + _ctpOffsetTop
                else if (_inTop) {
                    _parent.scrollTop = _el.offsetTop + _ctpOffsetTop
                }
                else ; //可见不处理
            }
        }
    }

    addAlias() {
        if (this.props.res) return (
            <AddAlias
                show={this.props.showEdit}
                brands={this.props.brands}
                parts={this.props.res.data}
                toggleEdit={this.props.toggleEdit}/>
        )
    }

    destroyTitle(title) {
		let _titles = this.state.titles
		if(_titles.indexOf(title) !== -1) {
			_titles.splice(_titles.indexOf(title),1)
			this.setState({
				titles: _titles
			})
        }
	}

    // 点击详情
    updateCardSelector(data, type) {
        Model.listHead(data, res => {
            let titles = res.headname
            titles.unshift("基础信息")
            this.setState({
                    showOnce: true,
                    titles: titles,
                    cardSelectorShow: true,
                    listHead: res.partdetail,
                    brand: data.brand,
                    part: data.part,
                    res: res,
                    chooseTitle: type
            })
        })
    }

    // 隐藏
    hiddenCardSelector() {
        this.setState({
            showOnce: false
                // cardSelectorShow: false
        })
    }

    replaceCart() {
        this.setState({
            showDialog: false
        })
        this.obj.stilladd = 1
        if(window.reFrashCart) {
            window.reFrashCart()
        }
        Model.addCart(this.obj,res=> {
            if(res.code == 1) {
                Utils.setValue(".cret_icon" , res.counts)                
            }
            if(data.code === 400) {
                location.href = '/logout'
                return
            }
            if(res.code == 0) {
                alert(res.msg)
            }
        }) 
    }

    showDialog(obj,msg) {
        this.obj = obj
        this.setState({
            showDialog: true,
            msg: msg
        })
    }

    toresult() {

    }
    
    render() {
        if (!this.props.res) return null
        let _res = this.props.res
        let _message = <Message show={this.state.showMessage} data={_res}/>
        let _filterword = <Filterworld filter={this.props.filterStatus}/>
        if (this.props.type == "part" || this.props.type == "cars") {
            _message = ""
            _filterword = ""
        }
        // _message = this.props.type == "part" ? <div/> :
        let cardselector =  this.state.showOnce 
                            ? <CardSelector
                                titles = {this.state.titles}
                                hidden = {this.hiddenCardSelector.bind(this)}
                                listHead = {this.state.listHead}
                                brand = {this.state.brand}
                                res = {this.state.res}
                                part = {this.state.part}
                                toresult = {this.toresult.bind(this)}
                                chooseTitle = {this.state.chooseTitle}
                                /> 
                            : <div/>
        return (
            <div className='container-list'>
                <Header />
                {_filterword}
                {_message}
                <Footer
                    {...this.props}
                    type = {this.props.type}
                    showDialog = {this.showDialog.bind(this)}                    
                    data={_res}
                    changeItid={this.props.changeItid}
                    itid={this.state.itid}
                    updateCardSelector={this.updateCardSelector.bind(this)}
                    brands={this.props.brands}/>
                {this.addAlias()}
                {cardselector}
                <Prompt
                    content={this.state.msg}
                    confirm="替换"
                    other="停止"
                    show={this.state.showDialog}
                    fun={this.replaceCart.bind(this)}
                    close={() => this.setState({showDialog: false})} />
            </div>
        )
    }
}

class Row extends Component {
    constructor() {
        super()
        this.widths = ['3%', '6%', '17%', '18%', '5%', '11%', '12%', '12%', '5%', '6%',"5%"]
    }
}

class Header extends Row {
    list() {
        // let _titles = ['', '位置', '零件OE号', '名称', '件数', '型号', '备注', '参考价格', '说明', '', ""]
        let _titles = TR("partListHeader")
        let _widths = this.widths
        if (_widths) return (
            _widths.map((item, index) => {
                return (
                    <div key={index} className='list-item' style={{width: _widths[index]}}>
                        {_titles[index]}
                    </div>
                )
            })
        )
    }

    render() {
        return (
            <div className='container-header'>
                {this.list()}
            </div>
        )
    }
}

class Message extends Component {
    render() {
        return (
            <div className={this.props.show ? 'container-message' : 'container-message hidden'}>网络超时，以下为基础零件数据。</div>
        )
    }
}

class Filterworld extends Component {
    render() {
        return (
            <div className={this.props.filter == 0 ? 'container-message' : 'container-message hidden'}>*红色字体：非此车架号的零件（参照原厂数据）</div>
        )
    }
}

class Footer extends Row {
    list() {
        let _data = this.props.data.data
        if (_data) return _data.map((item, index) => {
            return (
                <FooterSubRow
                    {...this.props}
                    key={index} item={item}
                    itemClick={this.itemClick.bind(this)}
                    itid={this.props.itid}
                    showDialog = {this.props.showDialog}
                    updateCardSelector={this.props.updateCardSelector}
                    brands={this.props.brands}
                    type = {this.props.type}
                    />
            )
        })
    }

    itemClick(itid, choosepid) {
        // let infos = []
        // this.props.data.data.map((item,index)=>{
        //     if(item[0].itid === itid) {
        //         item.map((it,ins)=> {
        //             if(it.sa_code) {
        //                 infos[ins] = {
        //                     step: it.step,
        //                     sa_code: it.sa_code
        //                 }
        //             }
        //         })
        //     }
        // })
        this.props.changeItid(itid, "listclick", choosepid)
    }

    render() {
        return (
            <div className='container-footer'>
                {this.list()}
                <div className='list-foot-loading'></div>
            </div>
        )
    }
}

class FooterSubRow extends Component {
    constructor() {
        super()
        this.state = {
            isFold: false
        }
        this.hasChooseOne = false //是否有选中的一个
    }

    /**
     * [itemClick handle first]
     * @param  {[number]} index   [index]
     * @param  {[boo]l} canFold [can it fold]
     */
    itemClick(index, canFold, supIndex, itid, pid, step, pname, quantity, prices, e) {
        window.showCarMI({data:[]})
        if (index === 0 && canFold && supIndex === 0) {
            this.setState({
                isFold: !this.state.isFold
            })
        } else if(index === 1) {
            if(pid) {
                // $(e.target).find(".ugc-icon").removeClass("gray").addClass("blue")
                // commentPluginShowWithParams({pid: pid})   
            }
        } else if (index === 9) {
            if(!this.props.item[supIndex].detail) return
            this.props.updateCardSelector({
                    brand: this.props.brands,
                    part: pid
            },"基础信息")
        } else if(index === 5) {
            let _obj = {
                sa_info: this.props.item[supIndex].sa_code,
                auth: this.props.auth || this.props.anyAuth || this.props.params.auth,
                brands: this.props.brands,
                vin: this.props.vin || ""
            }
            if(_obj.sa_info) {
                Utils.get("ppys/partcfg", _obj, res=> {
                    window.showCarMI(res)
                })
            } else {
                window.showCarMI({data:[]})
            }
        } else if(index === 6) {
            let _obj = {
                        "p" : "",
                        "code":"",
                        "type":"",
                        "itid":"" ,
                        "auth":""
                    }
            if (this.props.type != "seealso") {
                let _refmid_list = this.props.item[supIndex].refmid_list ? this.props.item[supIndex].refmid_list : []
                if (_refmid_list.length > 0 ){
                        let _contents = "参见：" + _refmid_list[0].mid.slice(0,3) + "-"+ _refmid_list[0].mid.slice(3,6)
                        if (_refmid_list[0].itid != "") {
                            _contents = _contents + "," + _refmid_list[0].itid
                        }

                        _obj.p = this.props.item[0].pid || pid
                        _obj.code=this.props.brands || ""
                        _obj.type=this.props.type
                        _obj.itid= _refmid_list[0].itid
                        _obj.auth =_refmid_list[0].auth 
                        _obj.title = _contents

                    if (this.props.type == "vin") {
                        _obj.vin = this.props.vin
                        _obj.filter = 0
                        // _obj.filter = _refmid_list[0].filter
                        // _obj.title = this.props.title.subGroup
                    }else if (this.props.type == 'search') {
                        if (this.props.searchEnter == "vin") {
                           _obj.type = "vin" 
                           _obj.filter = 0
                           _obj.vin = this.props.vin
                        }
                    }
                    // else if (this.props.type == 'part') {
                    //     _obj.title = this.props.title
                    // }else if (this.props.type == 'cars') {
                    //     _obj.title = this.props.title.subGroup
                    // }else if(this.props.type == 'search'){
                    //     _obj.title = ""
                    // } 
                    
                    window.showSeealso(_obj)
                }
            }
        } else if(index === 7) {
            if(!this.props.item[supIndex].specialkey.prices){
                return
            }
            this.props.updateCardSelector({
                brand: this.props.brands,
                part: pid
            }, "渠道价格")
        } else if(index === 8) {
            if(this.props.item[supIndex].specialkey.has_article){
                this.props.updateCardSelector({
                    brand: this.props.brands,
                    part: pid
                }, "品牌件")
                return
            }
            if(this.props.item[supIndex].isreplace == 0) {
                return
            }else if(this.props.item[supIndex].isreplace == 2) {
                this.props.updateCardSelector({
                    brand: this.props.brands,
                    part: pid
                }, "组件")
            }else {
                this.props.updateCardSelector({
                    brand: this.props.brands,
                    part: pid
                }, "替换件")
            }
        } else if(index === 10){
            if(this.props.type == "part") return;
            // let type = this.props.vin ? this.props.vin : Utils.getValue(".container-header .title").split(">")[0]         
            let _type = this.props.type == "search" ? "vin" : this.props.type
            let _obj = {
                pid: pid,
                pname: pname,
                brand: this.props.brands,
                quantity: quantity,
                type: _type,
                title: this.props.vin ? this.props.vin : Utils.getValue("#cars .container-header .title").split(">")[0],
                auth: this.props.anyAuth ? this.props.anyAuth : this.props.auth,
                stilladd: 0,
                price: prices
            }
            Model.addCart(_obj,res=>{
                if(res.code == 1){
                    window.reFrashCart()
                    if(res.add){
                        Utils.showDom(".cret_icon")
                        Utils.setValue(".cret_icon", res.counts)
                    }
                }else if(res.code == 2){
                    this.props.showDialog(_obj,res.msg)
                }else if(res.code == 400){
                    location.href = '/logout'
                    return;                    
                }else {
                    alert(res.msg)
                }
            })
        }
        // else 
        this.props.itemClick(itid, step)
    }

    itemClassName(index) {
        return this.state.isFold && index > 0 ? 'footer-item hidden' : 'footer-item'
    }

    componentWillReceiveProps(props) {
        // console.log(props)
        // listWhichClick = props.selectedPid
    }

    list() {
        let _item = this.props.item
        let _length = _item.length
        if (_item) return _item.map((item, index) => {
          
            let check = item.real_pid.indexOf(listWhichClick) !== -1 && listWhichClick.length > 0
            let _setppid = listClickType ? item.real_pid : item.step
            let _chooseindex = listWhichClick === _setppid
            if(check) _chooseindex = true
            if (listClickType && listWhichClick != -1) {
                if (item.pid == listWhichClick) {
                    listClickType = false
                    listWhichClick = item.step
                }
            }

            return (
                <FooterSubDetail 
                    {...this.props}                    
                    key={index}
                    chooseindex={_chooseindex}
                    brands={this.props.brands}
                    item={item}
                    itemClick={this.itemClick.bind(this)}
                    canFold={_length > 1}
                    index={index}
                    isFold={this.state.isFold}
                    isFilter={item.is_filter === 1}
                    itemClassName={this.itemClassName(index)}/>
            )
        })
    }

    footerItemClassName() {
        let _classadd = listWhichClick == -2 ? 'container-footer-item selected' : 'container-footer-item'
        if (!this.props.item[0]) return null
        else return this.props.itid === this.props.item[0].itid ? _classadd : 'container-footer-item'
    }

    render() {

        return (
            <div className={this.footerItemClassName()}>
                {this.list()}
            </div>
        )
    }
}

class FooterSubDetail extends Row {
    constructor() {
        super()
        this.keys = ['', 'num', 'pid', 'label', 'quantity', 'model', 'remark', 'prices', "", 'detail',"pid"]
        this.textalign = ['center', 'flex-end', 'flex-end', 'flex-start', 'flex-end', 'flex-start', 'flex-start', 'flex-end', 'center','center']
        this.isSelected = false
    }

    itemClick(e, index) {
        if(index == 5) {
            e.stopPropagation()
        }
        let price = ""
        if(this.props.item.specialkey) {
            price = this.props.item.specialkey.prices
        }
        this.props.itemClick(index, this.props.canFold, this.props.index, this.props.item['itid'], this.props.item['real_pid'], this.props.item['step'],this.props.item["label"],this.props.item["quantity"], price, e)
    }


    ugcAddMsg(e, pid) {
        let _headname = []
        let _auth
        let _brandCode
        // console.log(this.props)
        if(this.props.type === "vin") {
            this.props.title.info[1] = this.props.title.mainGroup
            this.props.title.info[2] = this.props.title.subGroup            
            _headname = this.props.title.info
            _auth = this.props.anyAuth
            _headname = _headname.join(">")         
        } else if(this.props.type === "cars") {
            _headname[0] = this.props.titleworld.join(">")
            _headname[1] = this.props.title.mainGroup
            _headname[2] = this.props.title.subGroup
            _auth = this.props.auth
            _headname = _headname.join(">")
        } else if(this.props.type === "part"){
            _headname = this.props.title
            _auth = this.props.params.auth
            _brandCode = this.props.params.code
        } else {
            _headname = this.props.headName
            _auth = this.props.anyAuth
            _brandCode = this.props.brands
        }
        
        let callback = this.commitCallback.bind(this,e.target)
        let obj = {
            pid: pid || "",
            auth: _auth || "",
            vin: this.props.vin || "",
            brandCode: this.props.brands || _brandCode,
            headname: _headname
        }
        commentPluginShowWithParams(obj, callback)     
    }

    commitCallback(com) {
        $(com).removeClass("gray").addClass("blue")
    }



    cobyPart(code, e) {
        let oDiv = document.createElement('textarea');
        oDiv.value = code;
        oDiv.innerHTML = code;
        document.body.appendChild(oDiv)
        oDiv.select();
        document.execCommand("Copy")
        document.body.removeChild(oDiv)
        Model.postCopy(code, this.props.brands, res => {
        })
        e.stopPropagation()
    }

    content(index) {
        let _content = this.props.item[this.keys[index]]
        let _cobyPart = this.cobyPart.bind(this)
        if (this.props.canFold) {  //折叠
            if (index === 0) {
                if (this.props.index === 0) _content = this.props.isFold ? '+' : '-'
            }
        }
        if (index == 2) { //零件OE号
            //引用错误处理
            if (_content.length < 1) return _content
            return (
                <div className="list-item-partcode">{_content}
                    <span className="coby-icon" title={TR("复制")} onClick={e => _cobyPart(this.props.item.real_pid, e)}>
                        <span className="cody-success">
                            {TR("复制成功")}
                        </span>
                        {/* <span className="coby-msg">
                            复制
                        </span> */}
                    </span>
                </div>
            )
        } else if(index == 5) {
            return(
                this.props.item.sa_code
                ? `
                    <div class="sa-code">
                        ${_content}
                        <span class="sa-code-icon" title="含品牌编号">
                        </span>
                    </div>
                  `
                //   <div className="sa-code" dangerouslySetInnerHTML={{__html: `${_content}<span class="sa-code-icon" title="品牌编号"></span>`}}/>
                : _content
            )
           
        } else if(index == 6) {  //备注
            let _refmid_list = this.props.item.refmid_list ? this.props.item.refmid_list : []
            if (_refmid_list.length < 1 ) return <span className="part-name-span" dangerouslySetInnerHTML={{__html: _content}} />
            if (_refmid_list == [] ) return <span className="part-name-span" dangerouslySetInnerHTML={{__html: _content}} />
                // _content = ""   //删除原有数据  后台清洗数据会删除
            _content = _content.replace(/<br\/>/g, "")
            let _spanclass = this.props.type == "seealso" ? "" : "seealse_hover"
                let _manyseealso = _refmid_list.map((items, indexs)=>{
                    let _contents = items.mid.slice(0,3) + "-"+ items.mid.slice(3,6)
                        if (items.itid != "") {
                            _contents = _contents + "," + items.itid
                        }
                    return (
                        <div className="show_seealso_seealso" key={indexs}>
                            <span>参见：</span>
                            <span className={_spanclass}>{_contents}</span>
                            {/* <span className={_spanclass} dangerouslySetInnerHTML={{__html: _contents}} /> */}
                         </div>
                    )
                })
            return (
                <div className="show_seealso">
                    {_manyseealso}

                    {_content}
                </div>
            )
        } else if(index == 7) {  //参考价格
            let _isManyCountShow = "none"
            if(this.props.item.specialkey){
                if(this.props.item.specialkey == "notfind") {
                    _content = ""
                }else {
                    let listExt = this.props.item.specialkey
                    _content = listExt.prices
                    _isManyCountShow = listExt.has_inventory == 1 ? "block" : "none"    
                }
            }else {
                _content = TR("查看")
            }

            // if(listExt == "notfind"){
            //     _content = ""
            // }else{

            // let real_pid = this.props.item.real_pid
            // if(listExt[real_pid]){
            //     console.log(listExt[real_pid].pid + " : " + listExt[real_pid].prices)
                           
            // }else{
            //     _content = "查看"
            // }
            // }
            let _isManyMoneyShow = this.props.item["multi_price"] ? "block" : "none"

            _isManyMoneyShow = _content ? _isManyMoneyShow : "none"
            // let _isManyCountShow = this.props.item["has_inventory"] ? "block" : "none"
            return(
                <div className="price-list">
                    {_content}
                    {/* <span className="manyCount" style={{display:_isManyCountShow}} title="包含库存信息">

                    </span> */}
                    <span className="manyCount manyMoney" style={{display:_isManyMoneyShow}} title="更多价格">
                        {/* <span className="morePrice">更多价格</span> */}
                    </span>
                </div>
            )
        } else if (index == 8) {   //说明
            let msg = ""
            let msgAlert = ""
            switch (this.props.item['isreplace']){
                case 0:
                    break;
                case 1:
                    msg = "R";
                    msgAlert = "替换件"
                    if(window.currentBrands == "land_rover"){
                        msg = "Y"                
                        msgAlert = "替换件"
                    }
                    break;
                case 2:
                    msg = "S";
                    msgAlert = "组件"
                    break;
                case 4:
                    msg = "R S"
                    msgAlert = "替换件 组件"
                    break;
            }

            if(this.props.item.specialkey) {
                let _has_article = this.props.item.specialkey.has_article ? true : false
                msg = _has_article ? "B "+ msg : msg
                msgAlert = _has_article ? "品牌件 " + msgAlert : msgAlert
            }
            if(msgAlert) {
                msgAlert = "含" + msgAlert                
            }
            let _className = "replaceMsg"
            if (msg) {
                _className = "replaceMsg canHover"
            }
            return (
                <div className={_className}>
                    {msg}
                    <span>
                        {msgAlert}
                    </span>
                </div>
            )
        } else if( index == 10 ){  //购物车
            if(this.props.type == "part"){ return ""}
            if(_content.length < 1){ return ""}
            return(
                <div className="shopping-list" title={TR('添加到购物车')}>
                    <span>
                        {TR("已添加至购物车")}
                    </span>
                </div>
            )
        } else if(index == 1) {  //位置 加三角
            let listkey = this.props.item.real_pid
            let title = ""
            let _class = "nothing"     //没标记
            let _ugcAddMsg = this.ugcAddMsg.bind(this)
            if(this.props.item.ugc) {
                if(this.props.item.ugc === "hasMsg") {
                    //蓝色标记
                    _class = "blue"
                } else if(this.props.item.ugc === "noMsg"){
                    //灰色标记
                    _class = "gray"
                }
            }
            if(!this.props.item.real_pid) {
                _class = "nothing"
            }

            if(this.props.searchPidList) {
                if(this.props.searchPidList[listkey]) {
                    if(listkey || (listkey == "" && this.props.item.label.indexOf(this.props.searchPartCode) !== -1)) {
                        return  <div>
                                    <div className="search-result" title="搜索结果">
                                        <img src="/img/p_sign.png" alt="搜索结果"/>
                                        {_content}
                                    </div>  

                                    <b className={"ugc-icon "+ _class} title="留言" onClick={e => _ugcAddMsg(e, this.props.item.pid)}>
                                    
                                    </b>
                                </div>
                    }
                } else {
                    return (
                        <div>
                            {_content}
                            <b className={"ugc-icon "+ _class} title="留言" onClick={e => _ugcAddMsg(e, this.props.item.pid)}></b>
                        </div>
                    )
                        
                }
            } else {
                return (
                    <div>
                        {_content}
                        <b className={"ugc-icon "+ _class} title="留言" onClick={e => _ugcAddMsg(e, this.props.item.pid)}></b>
                    </div>
                )
            }
        }
        return _content
    }

    list() {
        let _itemClick = this.itemClick.bind(this)

        return this.widths.map((width, index) => {
            let _textalign = this.textalign[index]
            let _paddingleft = this.textalign[index] == "flex-start" ? "5px" : "0px"
            let _paddingright = this.textalign[index] == "flex-end" ? "5px" : "0px"
            if (index == 2) {
                _paddingright = "15px"
            }
            if (index !== 2 && index !== 8 && index !== 7 && index !== 10 && index !== 6 && index !== 1) {

                let partNameClass =(index==3 || index == 6) ? "part-name-span" : ""

                return (
                    <div key={index} className={this.props.isFilter ? 'list-item filter' : 'list-item'}
                            style={{width: width,justifyContent:_textalign}}
                            onClick={e => _itemClick(e, index)}>
                            {/* <span style={{paddingLeft:_paddingleft,paddingRight:_paddingright}}>{this.content(index)}</span> */}
                            <span className={partNameClass} style={{paddingLeft:_paddingleft,paddingRight:_paddingright}}  dangerouslySetInnerHTML={{__html: this.content(index)}} />
                        </div>
                )
            } else {
                return (
                    <div key={index} className={this.props.isFilter ? 'list-item filter' : 'list-item'}
                        style={{width: width,justifyContent:_textalign}}
                        onClick={e => _itemClick(e, index)}>
                         <span style={{paddingLeft:_paddingleft,paddingRight:_paddingright}}>{this.content(index)}</span>
                        {/* <span style={{paddingLeft:_paddingleft,paddingRight:_paddingright}}  dangerouslySetInnerHTML={{__html: this.content(index)}} /> */}
                    </div>
                )
            }
        })
    }

    render() {
        let _chooseindex = this.props.chooseindex ? " itemselect" : " "
        let _lastclass = this.props.itemClassName + _chooseindex

        return (
            <div className={_lastclass}>
                {this.list()}
            </div>
        )
    }
}

class Model {
    static postCopy(pid, brandCode, callback) {
        Utils.post('/parts/pidcopycounting', {
            pid,
            brandCode
        }, res => callback(res))
    }

    static listHead(obj, callback) {
        let url = "/ppys/partssearchs"
        Utils.get(url, obj, res => {
            callback(res)
        })
    }

    static addCart(obj,callback){
        let url = "/quotes/spcart/add"
        Utils.post(url,obj,res=>{
            callback(res)
        },true)
    }
}
