import React, { Component }  from 'react'
import VCP from './vcp'
import Utils from './utils'
import PartDetail from './part/partdetail'
// import Carresult from './vin/cars_result'
import Result from "./vin/result"
import $ from 'min-jquery'
import SearchPartResult from './vin/search_part_result'
export default class Car extends VCP {
    constructor(props) {
        super(props)
        this.type = 'car'
        this.codes = ""
        this.fatherindex=-1
        this.state = {
            middleclick: false,                 //中间层进去
            middledata:[],                      //中间层数据
            middleimg: -2 ,                     //处理中间层
            show: this.type === props.type,
            searchimg:"none",                   //搜索删除图标
            cardata:[],                         //数据列表
            leftindex:0,                        //左边点击index 记录
            titlelist:[],                       //存储左边列表
            titleworldlist:[],                  //右边显示nav 存储列表
            datalist:[],                        //右边数据列表
            selectlist:[],                      //右边点击 index 记录
            inputvalue:"" ,                     //搜索输入内容
            islast:-2,                          //是否为最后一项
            brandurl:"",
            carresult:false,                    //是否显示下一层
            resultdata:[],                      //下层显示数据
            resultgo: false,                    //对应请求result
            index:-1,                           //标记那个点击
            showwho:true,                       //判断哪个显示
            title:{},                           //title 显示请求参数
            isPartShow:false,                   //零件详情显示
            partDate:{},                        //零件详情必须得res
            baseDate:{},                        //零件详情基本请求参数
            partListShow:true,                   //Result组件显示与否
            searchresult:"none",                 //搜索是否有结果
            onlyAuth: "",                       //确定车型的auth
            onlyBrand: "",                      //同上
            refashPartResult: false,            //是否构建零件搜索结果
            showSearchPartResult: false,        //是否显示零件搜索结果
        }
        window.carsToPartDetail = this.carsToPartDetail.bind(this)
        window.onlyCarShowPartResult = this.onlyCarShowPartResult.bind(this)
        window.hiddenSearchPartResult = this.hiddenSearchPartResult.bind(this)
    }
    
    carsToPartDetail(data){
        Model.listHead(data, res => {
            data.length = 1
            this.setState({
                isPartShow : true,
                partDate: res,
                baseDate:data,
                partListShow:false
            })
        })
    } 

    changePage(){

    }

    hiddenSearchPartResult() {
        this.setState({
            refashPartResult: false
        })
    }

    onlyCarShowPartResult() {
        this.setState({
            refashPartResult: true,
            showSearchPartResult: true,
            // searchPartCode: "",
            // enterType: 'search', 
            // data: [],
            // partPid: ""            
        })
    }

    tohide(){
        this.setState({
            isPartShow: false,
            partListShow: true
        })
    }

    toresult(){

    }

    callbackshow(){
        this.setState({
            showwho: true,
            partListShow: true,
            isPartShow: false,
            resultgo:false

        })
    }

    subSearchShow(){
        this.setState({
            showwho:true
        })
    }

    listShowClick(getindex){

        this.setState({
            leftindex:getindex,
            inputvalue:"",
            searchimg:"none",
            searchresult:"none"
        })
    }

    // 上下组翻页
    upAndDown(type){
        let _presentclick = JSON.parse(JSON.stringify(this.state.leftindex))
        if (type=="up") {
            _presentclick--
            if (_presentclick<0) {
                _presentclick = 0
            }
        }else{
            let _lengths = this.state.titlelist.length-1
             _presentclick++
            _presentclick = _presentclick > _lengths ? _lengths : _presentclick
            if (_presentclick<0) {
                _presentclick = 0
            }
        }
        this.setState({
            leftindex:_presentclick,
            inputvalue:"",
            searchimg:"none",
            searchresult:"none"
        })

    }  
    hiddenCarInfo() {
        // this.setState({showCarInfo: false})
    }

    setTitle(title) {
        let _title = this.state.title
        _title.info = title.info || _title.info
        _title.mainGroup = title.mainGroup || _title.mainGroup
        _title.subGroup = title.subGroup || _title.subGroup
        this.setState({title: _title})
    }

    changeIndex(index) {
        let _data = this.state.resultdata
        let _selectlist = JSON.parse(JSON.stringify(this.state.selectlist))
        let _titleworldlist = JSON.parse(JSON.stringify(this.state.titleworldlist))
            
            if (this.state.middleclick) {

                _selectlist[this.fatherindex] = index + this.state.componentCount
            }else{
                _selectlist[this.fatherindex] = index
            }
            _titleworldlist[this.fatherindex] = _data[index].name
        this.setState({
            index:index,
            titleworldlist:_titleworldlist,
            selectlist:_selectlist,
        })
        // let _data = this.state.resultdata
        // this.selectClick("gonext", this.fatherindex, index, _data[index])
    }

    selectClick(type,fatherindex,selfindex,selfmsg){
        //清除输入框
        if (this.state.inputvalue != "") {this.clearInput()}
        if (fatherindex == 0) {
            this.codes = selfmsg.brand
            // 兰博基尼特殊处理
            // if(selfmsg.brand=="bullstuff"||selfmsg.brand == "astonmartin" ){
            //     isLanbo = true
            // }else{
            //     isLanbo = false
            // }
            if(window.withoutImg(selfmsg.brand)) {
                isLanbo = true
            }else {
                isLanbo = false
            }
        }

        let _selectlist = JSON.parse(JSON.stringify(this.state.selectlist))
        let _titleworldlist = JSON.parse(JSON.stringify(this.state.titleworldlist))
        let _fatherindex = fatherindex + 1  //listData1
            _selectlist[fatherindex] = selfindex
            _titleworldlist[fatherindex] = selfmsg.name
        let _url = selfmsg.uri
        let _obj = {}
        if (type=="gonext") {
            let _spliclength = fatherindex <= this.state.titlelist.length -2 ? true : false
            let _index = selfindex
            let _auth = selfmsg.uri_param.auth
            let _code = this.codes
            this.fatherindex=fatherindex
            window.currentBrands = _code
            // 请求头部信息
            Model.infocars( _auth, _code, res => {
                this.setTitle({info:res.data.carhead})
                this.setState({
                    brandurl:res.data.brandurl
                },()=>{
                    this.currentAuth = _auth
                    let _resuledata = _spliclength ? this.state.middledata : this.state.resultdata
                    let _changeindex = selfindex
                    if(this.state.middleimg == fatherindex && (_code == "benz" || _code == "smart")){
                        let componentCount = 0
                        let _reda = this.state.middledata
                        let newData = _reda.filter((item,index,_reda)=> {
                            if(!item.component) {
                                return item
                            }else {
                                componentCount++
                            }
                        })
                        if (componentCount != 0 ) {
                            _changeindex = selfindex - componentCount
                        }
                        this.setState({
                            middleclick:true,
                            resultdata:newData,
                            componentCount:componentCount
                        })
                    }else{
                        this.setState({
                            middleclick:false
                        })
                    }

                    if (_spliclength) {
                        // 特殊处理 中间层分支
                        let _datalist = JSON.parse(JSON.stringify(this.state.datalist))
                        let _titlelist = JSON.parse(JSON.stringify(this.state.titlelist))

                            _datalist = _datalist.slice(0, _fatherindex)
                            _titlelist = _titlelist.slice(0, _fatherindex)
                            _titleworldlist = _titleworldlist.slice(0, fatherindex)
                            _selectlist = _selectlist.slice(0, fatherindex)

                        this.setState({
                            titlelist:_titlelist,
                            datalist:_datalist,
                            
                        })

                    }

                    this.setState({
                        titleworldlist:_titleworldlist,
                        selectlist:_selectlist,
                        leftindex:fatherindex,
                        showwho:false,
                        index:_changeindex,
                        resultgo: true
                    })
                })
            })
            
        }else{
            // 将需要的数据全部传下去
            if (_url=="") {
                let _groupUrl = "/ppycars/carsinfos" + "?" + selfmsg.keys
                let _secondUrl = "/ppycars/group" +"?"+selfmsg.keys
                let _groupObj = {}
                let _secondObj = {
                        "code":this.codes
                    }
                if(!selfmsg.lastest_filter) {
                    Utils.get(_groupUrl,_groupObj , (res) => {
                        _secondObj.vin=res.vin
                        this.setState({
                            onlyAuth: res.auth,
                            onlyBrand: res.brand
                        })
                    })
                }
                this.dataGetnew(true,"nextClick",_secondUrl,_secondObj,_selectlist,_titleworldlist,_fatherindex)
            }else{
                this.dataGetnew(false,"worldClick",_url,_obj,_selectlist,_titleworldlist,_fatherindex)
            }
        }
    }
    
    dataGetnew(type,typess,url,obj,_selectlist,_titleworldlist,_fatherindex){
        let _datalist = JSON.parse(JSON.stringify(this.state.datalist))
        let _titlelist = JSON.parse(JSON.stringify(this.state.titlelist))
        let _islast = type ? _fatherindex : -2

        Utils.ctrlMum('show');
        Utils.get(url, obj, (response) => {
            Utils.ctrlMum('hidden');

            let _titlelistadd = type ? "选择主组信息":response.title
            let _resultdata = type ? response.data : []
             _datalist[_fatherindex] = response.data
            _titlelist[_fatherindex] = _titlelistadd
            // 储存变换前状态 点击进行删减
            let _splicedata = JSON.parse(JSON.stringify(_datalist))
            let _splicelist = JSON.parse(JSON.stringify(_titlelist))
            let _splicetitlelist = JSON.parse(JSON.stringify(_titleworldlist))
            let _spliceselectlist = JSON.parse(JSON.stringify(_selectlist))

            if (_datalist.length>=_fatherindex+2) {
                _datalist = _splicedata.slice(0, _fatherindex+1)
                _titlelist = _splicelist.slice(0, _fatherindex+1)
                _titleworldlist = _splicetitlelist.slice(0, _fatherindex)
                _selectlist = _spliceselectlist.slice(0, _fatherindex)
            }
            
            if(response.data.length > 0){
                if (response.data[0].component && !response.lastest_filter) {
                    // _islast = -2
                    this.setState({
                        middleimg:_fatherindex,
                        middledata:_resultdata
                    })
                }                
            }


            this.setState({
                titlelist:_titlelist,
                datalist:_datalist,
                titleworldlist:_titleworldlist,
                selectlist:_selectlist,
                leftindex:_fatherindex,
                islast:_islast,
                showwho:true,
                resultdata:_resultdata,
                resultgo:false
            })
            if ((type == false) && (response.data.length == 1)) {
                this.selectClick("world",_fatherindex,0,response.data[0])
            }
        })
    }

    searchClick(){
        let _ids = "idlist" + this.state.leftindex
        let _input = this.refs.searchinput.value
        // let _input = this.refs.searchinput.value.replace(/\s/g, "")
        let _show = _input.length > 0 ? "block":"none"
        this.setState({
            inputvalue:_input,
            searchimg:_show
        })
        document.getElementById(_ids).scrollIntoView();
        this.searchResultAlert(_input)
    }

    clearInput(){
        this.setState({
            inputvalue:"",
            searchimg:"none",
            searchresult:"none"
        })
    }

    changeMainGroup(direction, callback) {
        if(direction === 'next') {
            let _length = this.state.resultdata.length - 1
            let _index = this.state.index + 1
            if(_index > _length){
                alert(TR("已到最后一主组"))
            }
            _index = _index > _length ? _length : _index
            this.changeIndex(_index)
        }else {
            let _index = this.state.index - 1
            if(_index < 0){
                alert(TR("已到第一主组"))
            }
            _index = _index < 0 ? 0 : _index
            this.changeIndex(_index)
        }
    }

    searchResultAlert(searchdata){
        if (searchdata.replace(/\s/g, "").length==0) {
            this.setState({
                searchresult:"none"
            })
            return
        }
        let _leftindex = this.state.leftindex
        let _datalist = this.state.datalist[_leftindex]
        let _show = "block"
        for (var i = 0; i < _datalist.length; i++) {
            let _didhas = _datalist[i].name.match(new RegExp(searchdata,'i'));
               if (_didhas != null) {
                    _show = "none"
               } 
        }

        this.setState({
            searchresult:_show
        })
    }

    componentDidMount(){
        window.indexFlag = "carPage"
        Utils.get("/brandbase", {}, (res) => {
            let _titlelist = []
            let _datalist = []
            let _selectlist = []
                _titlelist.push(res.title)
                _datalist.push(res.data)
                _selectlist.push(-1)

            this.setState({
                titlelist:_titlelist,
                datalist:_datalist,
                selectlist:_selectlist
            })
        })
    }

    render() {
        if(this.neverShowed()) return <div></div>

        let _searchresult = this.state.searchresult                 //搜索是否有结果显示
        let _searchimg = this.state.searchimg                       //搜索删除图标显示
        let _selectClick = this.selectClick.bind(this)              //内容点击获取参数
        let _datalist = this.state.datalist                         //右边数据列表
        let _titleworldlist = this.state.titleworldlist             //右边nav
        let _leftindex = this.state.leftindex                       //左右显示index
        let _selectlist = this.state.selectlist                   //点击记录
        let _inputvalue = this.state.inputvalue                     //输入内容
        let _navshow = <div></div>                                           //title 显示拼接
        let _islast = this.state.islast                             //最终确认组显示
        let _middleimg = this.state.middleimg

        let _resultgo = this.state.resultgo
        let _idcars = this.state.showwho ? "none" : "flex"
        let _calsscars = this.state.showwho ? "flex" : "none"
        let _carsShowEnd = this.state.partListShow ? _idcars : "none"
        window.pageFlag = this.state.showwho ? "carPage" : "carResultPage"
        //添加： title点击切换 
        // for (let i = 0; i < _titleworldlist.length; i++) {
        //     let _addtitle = _titleworldlist[i]
        //     let _addtitlemore = "  >  "+_titleworldlist[i]
        //     if (i==0) {
        //         _navshow += _addtitle
        //     }else{
        //         _navshow += _addtitlemore
        //     }
        // }

        if (_titleworldlist.length>0) {
            _navshow = _titleworldlist.map((titleitems,titleindex)=>{
                let _titleitems = "  >  " + titleitems
                return (
                    <span key={titleindex} 
                    onClick={this.listShowClick.bind(this,titleindex+1)}>
                        {_titleitems}
                    </span>
                )
            })
        }

        let _titlelist = this.state.titlelist.map((elem,index)=> {
            let _class = this.state.leftindex == index ? "car-body-left-stairsclicked" : "car-body-left-stairs"
            let _elem = index+1 + "  " + elem

            return (
                <div key={index} className={_class}
                    onClick={this.listShowClick.bind(this,index)}>
                    {_elem}
                </div>
            )
        })

        // 添加每一组数量统计显示
        let _dataInclude = this.state.titlelist[_leftindex]
        let _dataLength =this.state.datalist[_leftindex]!=undefined? this.state.datalist[_leftindex].length:""
        let _btnleftcolor = this.state.leftindex==0?"rgba(51,51,51,0.20)":"#F9F9F9"
        let _btnrightcolor = this.state.leftindex == _islast ?"rgba(51,51,51,0.20)":"#F9F9F9"
            if (this.state.leftindex == this.state.titlelist.length-1) {
                _btnrightcolor = "rgba(51,51,51,0.20)"
            }
        let _partResult = this.state.isPartShow ? <PartDetail
                                        toresult={this.toresult.bind(this)} 
                                        date={this.state.partDate}  
                                        obj={this.state.baseDate} 
                                        changePage={this.changePage.bind(this)} 
                                        tohide={this.tohide.bind(this)}/> : <div/>
        let _searchPartResult = this.state.refashPartResult ? (
            <SearchPartResult
                enterType={'search'}
                searchEnter="cars"
                titleworldlist={this.state.titleworldlist}
                isShow={this.state.showSearchPartResult}
                setClearAll={handle => this.clearAll = handle}
                setFocus={()=>{}}
                brands={this.state.onlyBrand}
                showCarInfo={()=>{}}
                searchPartCode={""}
                vin={""}
                data={this.state.data}
                type='search'
                brandurl={""}
                anyAuth={this.state.onlyAuth}
                partPid = {""}
            />
        ) : null
        
        return (
            <div className={"cars "+this.containerClass()}>
                <div id="cars" style={{display:_carsShowEnd}}>
                    {!_resultgo ? null : <Result
                        type = "cars"
                        index={this.state.index}
                        brandurl={this.state.brandurl}
                        auth = {this.currentAuth}
                        brands = {this.codes}
                        hiddenCarInfo={this.hiddenCarInfo.bind(this)}
                        mainGroups = {this.state.resultdata}
                        title={this.state.title}
                        titleworld={this.state.titleworldlist}
                        setTitle={this.setTitle.bind(this)}
                        changeIndex={this.changeIndex.bind(this)}
                        callbackshow={this.callbackshow.bind(this)}
                        subSearchShow={this.subSearchShow.bind(this)}
                        changeMainGroup={this.changeMainGroup.bind(this)}
                        />}
                </div>
                <div className="cars" style={{display:_calsscars}}>
                    <div className="cars-body-title-btn">
                        <div className="btn-include">
                          <div className="btn-left" style={{backgroundColor:_btnleftcolor}} onClick={this.upAndDown.bind(this,"up")}></div>
                          <div className="btn-right" style={{backgroundColor:_btnrightcolor}} onClick={this.upAndDown.bind(this,"down")}></div>
                        </div>
                        <div className="title-include">
                            <span onClick={this.listShowClick.bind(this,0)}>选择品牌</span>
                            {_navshow}
                        </div>
                    </div>
                    <div className="cars-body">
                        <div className="car-body-left">
                          {/*<div className="car-body-left-stairs">车型查询</div>*/}
                          {_titlelist}
                        </div>

                        <div className="car-body-right">
                          <div className="car-body-right-content">
                            <div className="car-body-right-search">
                                <div className="car-body-right-title-cloud">
                                    {/* <span>{_dataInclude}(共{_dataLength}组):</span> */}
                                    <span>{_dataInclude}{TR("(共   组)",_dataLength)}:</span>
                                    
                                </div>
                                <div className="car-body-right-search-body">
                                    <input type="text" name="searchimport"  style={{display:"none"}}/>
                                    <input type="text" className="car-body-right-search-input"
                                        autoComplete="off"
                                        value={_inputvalue}
                                        ref="searchinput"
                                        placeholder={TR("输入搜索内容")}
                                        onChange={this.searchClick.bind(this)}/>
                                    <div className="car-body-right-search-result" 
                                        style={{display:_searchresult}}>{TR("未搜索到相关结果")}</div>
                                    <div className="car-body-right-search-imgclear"
                                        style={{display:_searchimg}}
                                        onClick={this.clearInput.bind(this)}></div>
                                    <div className="car-body-right-search-imgsearch"></div>
                                </div>
                            </div>
                            <Imgworld
                                middleimg={_middleimg}
                                data={_datalist}
                                islast={_islast}
                                showindex={_leftindex}
                                selectlist={_selectlist}
                                selectClick={_selectClick}
                                inputvalue={_inputvalue}
                                />
                          </div>
                        </div>
                    </div>
                </div>
                {_partResult}
                {_searchPartResult}
            </div>
        )
    }
}

class Imgworld extends Component{
    constructor(props) {
      super(props);

      this.state = {};
      this._idlist = ["idlist0","idlist1","idlist2","idlist3","idlist4","idlist5","idlist6","idlist7","idlist8","idlist9","idlist10","idlist11","idlist12","idlist13","idlist14","idlist15","idlist16"]
    }

    childClick(type,fatherindex,selfindex,selfmsg){
        this.props.selectClick(type,fatherindex,selfindex,selfmsg)
    }

    imgError(e) {
        e.target.style.display = "none"
    }

    render() {
        let _value = this.props.inputvalue
        let _showindex = this.props.showindex
        let _datalist = this.props.data.map((item, index)=> {

            let _display = _showindex == index ? "flex":"none"
            let _clickindex = this.props.selectlist[index]
            let _fatherclass = "car-body-right-result-img"
            let _imgorworld = <div></div>
            if ( index==0 || (this.props.islast==index) || (this.props.middleimg == index)) {
                _fatherclass = "car-body-right-result-img"
                _imgorworld = item.map((imgs,i)=>{
                    let _clickclass = "car-body-right-result-imgclc"
                    let _popclass = "car-body-right-result-imgpop"
                    let _classnamei = _clickindex == i ? _clickclass : _popclass

                    // 搜索处理
                    let _addclass = _classnamei + "    notchoice"
                    let _didhas = imgs.name.match(new RegExp(_value,'i')); //忽略大小写
                    if ((_didhas != null) && (_value.length >0) && (_showindex == 0 || _showindex == this.props.islast)) {
                        _addclass = _classnamei + "    choice"
                    }
                    let _types = imgs.component == 0 || imgs.component == "0" ? "gonext":"img"
                        // if(imgs.component == 0 || imgs.component == "0"){
                        //     _types = "gonext"
                        // }else if(imgs.component == 1){
                        //     _types = "img"
                        // }
                    let _width = (this.props.middleimg == index) || this.props.islast == index ? "48px":"96px"
                    let _height = (this.props.middleimg == index) || this.props.islast == index ? "50px":"58px"
                    let _cdns = (this.props.middleimg == index) || this.props.islast == index? "":"https://cdns.007vin.com"
                    let _imgbg = (this.props.middleimg == index) || this.props.islast == index ? "url(https://cdns.007vin.com/img/mum.gif)" : "initial"
                    let _img =((this.props.islast==index) && isLanbo)  ? <div></div>:<img onError={this.imgError.bind(this)} style={{width:_width,height:_height,backgroundImage:_imgbg}} alt={imgs.name + "配件查询"} src={_cdns+imgs.img}></img>
                        if (this.props.middleimg == index) {
                            _img = <img onError={this.imgError.bind(this)} style={{width:_width,height:_height,backgroundImage:_imgbg}} alt={imgs.name + "配件查询"} src={_cdns+imgs.img}></img>
                        }
                    return (
                        <div key={i} className={_addclass}
                            onClick={this.childClick.bind(this,_types,index,i,imgs)}>
                            {_img}
                            <text>{imgs.name}</text>
                        </div>
                    )
                })
            }else{
                _fatherclass = "car-body-right-result-world"
                _imgorworld = item.map((world,ii)=>{
                    let _clickclass = "car-body-right-result-worldclc"
                    let _popclass = "car-body-right-result-worldpop"
                    let _classnameii = _clickindex == ii ? _clickclass : _popclass

                    // 搜索处理
                    let _addclass = _classnameii + "   notchoice"
                    let _didhas = world.name.match(new RegExp(_value,'i'));
                    if ((_didhas != null) && (_value.length >0) && (_showindex === index)) {
                        _addclass = _classnameii + "   choice"
                    }

                    let _split = '：'
                    let _nameleft = world.name.split(_split)[0] || ''
                    let _nameright = world.name.split(_split)[1] || ''

                    return (
                        <div key={ii} className={_addclass}
                            onClick={this.childClick.bind(this,"world",index,ii,world)}>
                            <div>{_nameleft}</div>
                             {_nameright? <div>{_nameright}</div>: null}   
                            {/*world.name*/}
                        </div>
                    )
                })
            }
            return (
                <div key={index} id={this._idlist[index]} className={_fatherclass} style={{display:_display}}>
                    {_imgorworld}
                </div>
            )
        });

        return (
            <div className="car-body-right-result" >{_datalist}</div>
        )
    }
}

class Model {
    static infocars(auth, code, callback) {
        Utils.get('/ppycars/heads', {auth, code}, res => callback(res))
    }
    static listHead(obj, callback) {
		let url = "/ppys/partssearchs"
		Utils.get(url, obj, res => {
			callback(res)
		})
	}
}
