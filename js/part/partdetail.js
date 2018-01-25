import React, {
	Component
} from "react"
import Root from '../root'
import ToTop from './totop'
import ListdetailrepaceOld from './partdetailreplace-old'
import Utils from "../utils"
import CardSelector from '../card_selector'
import $ from 'min-jquery'
export default class PartDetail extends Root {
	constructor(props) {
		super(props)
		this.state = {
			headmessage: [],
			btnindex: -1, //当前为几个零件
			isLast: 0,
			logosrc: "",
			hreflist: [], //锚点新数组
			datatest: [
				[],
				[],
				[],
				[],
				[],
				[],
				[]
			], //数据组
			dataHead: [], //导航包含内容
			dataBrand: "", //品牌
			partNum: "", //零件号
			partName: "", //零件名
			showNav: "none", //导航显示
			btnfirst: false, //上一按钮
			btnlast: false, //下一按钮
			btnshow: "none", //按钮组显示
			detailShow: "none", //详情整体显示
			seconddata: {
				"data": []
			}
		};
		this.comp = true
		this.addpage = 0
		this.storeFiveData = {}
		this.hrefname = ["headtoview", "pricetoview", "repacetoview", "parttoview", "messagetoview", "carstoview"]
		this.titleStore = ["基础信息", "渠道价格", "替换件", "品牌件", "组件", "技术信息", "适用车型"]
		this.urllist = [
			"不用该参数",
			"ppys/partprices",
			"/ppys/searchreplace",
			"/ppys/partplacetp",
			"ppys/partcompt",
			"不用该参数",
			"ppys/partcars"
		]

	}

	componentWillReceiveProps(props) {
		
		// this.dataTest(props)

	}
	componentWillUnmount() {
		this.comp = false
	}
	handleScroll(e) {
		let scrolltop = document.body.scrollTop
		let _show = scrolltop > 80 ? "block" : "none"
		if(this.comp) {
			this.setState({
				showNav: _show
			})
		}
	}

	componentDidMount() {
		// this.comp = true
		this.dataTest(this.props)
		window.addEventListener('scroll', this.handleScroll.bind(this));
	}

	dataTest(props) {
		let _data = props.date
		let _obj = props.obj
		this.dataGet(_data, _obj)
		let _btnshow = "inline-block"
		if (_obj.length == "undefined" || _obj.length == 1) {
			_btnshow = "none"
		}
		let _firstbtn = _obj.whitch != 1
		let _lastbtn = _obj.whitch != _obj.length
		this.setState({
			btnindex: _obj.whitch,
			partNum: _data.data[0].pid,
			partName: _data.data[0].label,
			headmessage: _data.partdetail,
			btnfirst: _firstbtn,
			btnlast: _lastbtn,
			btnshow: _btnshow,
			dataHead: _data.headname,
			dataBrand: _obj.brand,
			detailShow: _obj.detailshow,
			logosrc: _data.img
		})
	}

	dataGet(date, obj) {

		let _datatest = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		]
		let _seconddata = {
			data: []
		}
		let _datalist = [
				[],
				[],
				[],
				[],
				[],
				[]
			]
			// _datalist[0] = listHead.data
			// _datalist[1] = listOne.data
			// _datalist[2] = listThree.data
			// _datalist[3] = listFour.main_info
			// _datalist[4] = listFive.data
			// _datalist[5] = datapartcars.data
		let _data = date.headname
		let _titlelist = this.titleStore
		let _hreflist = []
		let _indexconsole = []
		for (let o = 0; o < _data.length; o++) {
			let _haveindex = _titlelist.indexOf(_data[o])
			if (_haveindex != -1) {
				_hreflist.push(this.hrefname[_haveindex])
				_indexconsole.push(_haveindex)
				let objs = {
					"url": this.urllist[_haveindex],
					"part": obj.part,
					"brand": obj.brand
				}
				if (_haveindex == 0) {
					_datatest[0] = date.data
				} else if (_haveindex == 5) {
					_datatest[5] = date.showmessage
				} else {
					// _datatest[_haveindex] = _datalist[_haveindex]
					Model.listData(objs, res => {
						if (_haveindex == 6) {
							this.setState({
								isLast: res.last
							})
						}
						if (res.data.length == 0 && (_haveindex == 2 || _haveindex == 3)){
							_datatest[_haveindex] = "notfind" 
						}else {
							_datatest[_haveindex] = res.data
						}
						this.setState({
							datatest: _datatest
						})
					})
				}
			}
		}
		this.setState({
			hreflist: _hreflist,
			seconddata: _seconddata,
			datatest: _datatest,
			datalist: _datalist
		})
	}

	addDataFive(page) {
		let _brands = this.state.dataBrand
		let _parts = this.state.partNum
		let _n = this.addpage + 1
		this.addpage = _n
		let obj = {
			"page": _n,
			"brands": _brands,
			"part": _parts,
			"url": "/ppys/partcars"
		}
		let _datatest = JSON.parse(JSON.stringify(this.state.datatest))
		let _adddatsnew = JSON.parse(JSON.stringify(_datatest))
		Model.addData(obj, res => {
			let _nextadd = res.data
			_datatest[6] = _adddatsnew[6].concat(_nextadd)

			this.setState({
				isLast: res.last,
				datatest: _datatest
			})
		})

	}

	cobyPart(code, e) {
		let oDiv = document.createElement('textarea');
		oDiv.value = code;
		oDiv.innerHTML = code;
		document.body.appendChild(oDiv)
		oDiv.select();
		document.execCommand("Copy")
		document.body.removeChild(oDiv)
		e.stopPropagation()
	}


	btnClick(type, wetherclick) {
		if (wetherclick == "noclick") {
			return
		}
		let _index = this.state.btnindex
		this.props.changePage(type, _index)
	}

	hrefScroll(whitch) {
		document.getElementById(whitch).scrollIntoView();
	}
		// <Listdetailrepace whitchIs={"0"} nexmess={_listpart}/>
		// <Listrepace getrepace={_listrepace} />

	switchDom() {

	}

	updateCardSelector(data,type) {
        Model.listHead(data, res => {
            let titles = res.headname
            titles.unshift("基础信息")
                // console.log(titles)
            this.setState({
                    showOnce: true,
                    titles: titles,
                    cardSelectorShow: true,
                    listHead: res.partdetail,
                    brand: data.brand,
					part: data.part,
					partName: data.partdetail[0].value,
                    res: res,
                    chooseTitle: type
            })
        })
	}

	hiddenCardSelector() {
        this.setState({
            showOnce: false
                // cardSelectorShow: false
        })
	}
	
	render() {
		// let _listhead = this.state.datatest[0]
		let _listhead = []
		let _listprice = this.state.datatest[1]
		let _listrepace = this.state.datatest[2]
		let _listreplaceTP = this.state.datatest[3]
		let _listpart = this.state.datatest[4]
		let _listmessage = this.state.datatest[5]
		let _listcars = this.state.datatest[6]
		// 新车辆信息
		let _headmes = this.state.headmessage
		let _brand = this.state.dataBrand //车型
		// console.log(_brand)
		let _detailShow = this.state.detailShow //总体显示
		let _btnshow = this.state.btnshow //按钮显示
		let _firstbtnclick = this.state.btnfirst ? "btn" : "noclick"
		let _lastbtnclick = this.state.btnlast ? "btn" : "noclick"
		let _logosrc = this.state.logosrc
		let _partNum = this.state.partNum
		let _partName = this.state.partName
		let _headlist = this.state.dataHead
		let _showNav = this.state.showNav
		let _hreflist = this.state.hreflist
		let _cobyPart = this.cobyPart.bind(this)
		let _isLast = this.state.isLast
		let _titleListshow = _headlist.length < 1 ? "none" : "block"
		_titleListshow = this.props.type == "search" ? "none" : _titleListshow
		let _titleList = _headlist.map((elem, index) => {
			let _whitchhref = _hreflist[index]
			return (
				<div key={index} className="title-list-click" 
						onClick={this.hrefScroll.bind(this,_whitchhref)}>
					{elem}
				</div>
			)
		})
		let _back = this.props.type == "search" ? <div/> : <div className="btn" onClick={this.props.tohide.bind(this)}>&lt; 返回</div>

		let switchCom = ""
		let cardselector = this.state.showOnce ? <CardSelector
													titles={this.state.titles}
													hidden={this.hiddenCardSelector.bind(this)}
													listHead={this.state.listHead}
													brand = {this.state.brand}
													res = {this.state.res}
													part = {this.state.part}
													chooseTitle = {this.state.chooseTitle}
													/> : <div/>

		switch (this.props.title) {
			case "基础信息":
				switchCom = <div>
								{/* <div className="part-detail-head">
									<div className="pagebtn">
										<div className="pagebtn-btn">
											{_back}
											<div  style={{display:_btnshow}}>
												<div className={_firstbtnclick} onClick={this.btnClick.bind(this,"pre",_firstbtnclick)}>上一个</div>
												<div className={_lastbtnclick}  onClick={this.btnClick.bind(this,"next",_lastbtnclick)}>下一个</div>
											</div>
										</div>
										<img className="pagebtn-img"
											 src={"https://cdns.007vin.com"+ _logosrc} alt="loading"/>
										<div className="pagetitle">
											<span>零件号: </span>
											<span className="partCode">{_partNum}
												<span className="coby-icon" onClick={e => _cobyPart(_partNum, e)}>
													<span className="cody-success">
														复制成功
													</span>
												</span>
											</span>
										</div>
									</div>
									<div className="titlelist" style={{display:_titleListshow}}>
										<div className="title-list-click">目录</div>
										{_titleList}
									</div>
								</div> */}
								<Headermessage getmessage={_headmes} />	
								<div className="titlelist" style={{display:_titleListshow}}>
									<div className="title-list-click">目录</div>
									{_titleList}
								</div>							
								<Listprice getprice={_listprice} />
								{
									this.state.dataBrand == 'land_rover' ? 
									<ListdetailrepaceOld whitchIs={"2"} newbrand={_brand} nexmess={_listrepace} />
									:
									<Listdetailrepace haveDetail={this.props.haveDetail} updateCardSelector={this.updateCardSelector.bind(this)} whitchIs={"2"} newbrand={_brand} nexmess={_listrepace}/>
								}
								
								<ListreplaceTP datalist={_listreplaceTP} newbrand={_brand}/>
								<Listpart getpart={_listpart} newbrand={_brand}/>
								<Listmessage getmessage={_listmessage} />
								<ListPartCars type={this.props.type} haveDetail={this.props.haveDetail} getcars={_listcars} pages={_isLast} addDataFive={this.addDataFive.bind(this)} toresultClick={this.props.toresult.bind(this)}/>
							</div>
				break;
			case "渠道价格":
				switchCom = <Listprice getprice={_listprice} />
				break;
			case "替换件":
				switchCom = 
					this.state.dataBrand == 'land_rover' ? 
					<ListdetailrepaceOld whitchIs={"2"} newbrand={_brand} nexmess={_listrepace} />
					:
					<Listdetailrepace haveDetail={this.props.haveDetail} updateCardSelector={this.updateCardSelector.bind(this)} whitchIs={"2"} newbrand={_brand} nexmess={_listrepace}/>
				break;
			case "品牌件":
				switchCom = <ListreplaceTP datalist={_listreplaceTP} newbrand={_brand}/>
			    break;
			case "组件":
				switchCom = <Listpart getpart={_listpart} newbrand={_brand}/>
				break;
			case "技术信息":
				switchCom = <Listmessage getmessage={_listmessage} />
				break;
			case "适用车型":
				switchCom = <ListPartCars type={this.props.type} haveDetail={this.props.haveDetail} getcars={_listcars} pages={_isLast} addDataFive={this.addDataFive.bind(this)} toresultClick={this.props.toresult.bind(this)}/>
				break;
		}

		let _float = this.props.type == "serach" ? <div/> : <div className="navposition" style={{display:_showNav}}>
					<div className="navshow">
						<span>零件号：{_partNum}</span>
						<span>名称：{_partName}</span>
					</div>
				</div>
		return (
			<div className="part-detail-content" style={{display:_detailShow}}>
				{_float}
				<div className="part-detail-head">
					<div className="pagebtn">
						<div className="pagebtn-btn">
							{_back}
							<div  style={{display:_btnshow}}>
								<div className={_firstbtnclick} onClick={this.btnClick.bind(this,"pre",_firstbtnclick)}>上一个</div>
								<div className={_lastbtnclick}  onClick={this.btnClick.bind(this,"next",_lastbtnclick)}>下一个</div>
							</div>
						</div>
						<img className="pagebtn-img"
								src={"https://cdns.007vin.com"+ _logosrc} alt="loading"/>
						<div className="pagetitle">
							<div className="part-code-box">
								<span>零件号: </span>
								<span className="partCode">{_partNum}
									<span className="coby-icon" title="复制" onClick={e => _cobyPart(_partNum, e)}>
										<span className="cody-success">
											复制成功
										</span>
									</span>
								</span>
							</div>
							
							
							<div className="part-name-box">
								<div className="part-name-key">
									零件名称：
								</div>
								<div className="part-name-value">
									{_partName}
								</div>
							</div>
							
						</div>
					</div>
					{switchCom}
					
				</div>
				{/*
				<Listhead gethead={_listhead} />
				<Listprice getprice={_listprice} />
				<Listdetailrepace whitchIs={"2"} newbrand={_brand} nexmess={_listrepace}/>
				<Listpart getpart={_listpart} newbrand={_brand}/>
				<Listmessage getmessage={_listmessage} />
				<ListPartCars type={this.props.type} getcars={_listcars} pages={_isLast} addDataFive={this.addDataFive.bind(this)} toresultClick={this.props.toresult.bind(this)}/>
				*/}
				{/* <div className="elevator" style={{display:"none"}}>
					{_titleList}
				</div> */}
				{cardselector}
			</div>
		)
	}
}


class Model {
	static listData(objs, callback) {
		let url = objs.url
		let obj = {
			"part": objs.part,
			"brand": objs.brand
		}
		if(url == "ppys/partprices"){
			Utils.showDom(".PriceLoadingShow");
		}
		Utils.get(url, obj, res => {
			callback(res);
			Utils.hideDom(".PriceLoadingShow");
		}, true)
	}
	static addData(objsadd, callback) {
		let url = objsadd.url
		let obj = {
			"part": objsadd.part,
			"brand": objsadd.brands,
			"page": objsadd.page
		}
		Utils.get(url, obj, res => {
			callback(res)
		}, true)
	}
	static listHead(obj, callback) {
        let url = "/ppys/partssearchs"
        Utils.get(url, obj, res => {
            callback(res)
        })
    }
}

class Headermessage extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	cobyPart(code, e) {
		let oDiv = document.createElement('textarea');
		oDiv.value = code;
		oDiv.innerHTML = code;
		document.body.appendChild(oDiv)
		oDiv.select();
		document.execCommand("Copy")
		document.body.removeChild(oDiv)
		e.stopPropagation()
	}

	render() {
		// 生成列表
		let _cobyPart = this.cobyPart.bind(this)		
		
		let _show = this.props.getmessage.length > 0 ? "block" : "none"
		let _datatitle = <div></div>
		let _bgline = <div></div>
		let _bgstore = []
		if (this.props.getmessage.length != 0) {
			_bgstore = []
			for (var i = 0; i < 20; i++) {
				_bgstore.push(i)
			}
			_bgline = _bgstore.map((its, indexline) => {
				let _topheight = (indexline + 1) * 40 + "px"
				return (
					<div key={indexline} className="bgline-color" style={{top:_topheight}}></div>
				)
			})
			_datatitle = this.props.getmessage.map((item, index) => {
				let itemkey = item.key
				let itemvalue = item.value
				return (
					<div className="listmessage-list" key={index}>
						<span className="listmessage-left" dangerouslySetInnerHTML={{__html: itemkey}} ></span>
						<span className="listmessage-right">
							{itemvalue}
							<span className={itemkey == "工程编号" ? "coby-icon" : "hidden"} title="复制" onClick={e => _cobyPart(itemvalue, e)}>
								<span className="cody-success">
									复制成功
								</span>
							</span>
						</span>
					</div>
				)
			})
		}
		return (
			<div className="headermessage"  style={{display:_show}}>
				<div className="headermessage-list">
					{_bgline}
					{_datatitle}
				</div>
			</div>
		)
	}
}

class Listdetailrepace extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.head = "替换件"
		this.title = ["品牌", "品牌零件号", "零件名称", "件数", "型号", "参考价格"]
		this.datatitle = ["brandcn", "pid", "lable", "counts", "ptype", "prices"]
		this.widthArr = [1, 1.5, 4, 2, 1, 1.5]
	}
	openNewPart(brand, part) {
		// let url = "?type=part&brand=" + this.props.newbrand + "&part=" + part;
		// window.open(url)

		// this.props.updateCardSelector({
		// 	brand: this.props.newbrand,
		// 	part: part
		// },"基础信息")
	}

	componentWillReceiveProps(){
		if(this.props.nexmess == "notfind"){
			if(this.props.haveDetail){
				if(window.destroyPartSearchTitle){
					window.destroyPartSearchTitle('替换件')
				}
			}else{				
				if(window.partDetailDestoryTitle){
					window.partDetailDestoryTitle('替换件')
				}
			}
		}
	}
	

	cobyPart(code, e) {
		let oDiv = document.createElement('textarea');
		oDiv.value = code;
		oDiv.innerHTML = code;
		document.body.appendChild(oDiv)
		oDiv.select();
		document.execCommand("Copy")
		document.body.removeChild(oDiv)
		e.stopPropagation()
	}


	render() {
		//生成头部

		
		let _cobyPart = this.cobyPart.bind(this)		
		let _title = this.title.map((im, ix) => {
				return (
					<div key={ix} style={{flex:this.widthArr[ix]}} className="title-background">{im}</div>
				)
			})
		// 生成列表

		let _show = this.props.nexmess.length > 0 ? "block" : "none"
		_show = this.props.nexmess === "notfind" ? "none" : _show
		
		let _datatitle = <div></div>

		if (this.props.nexmess.length != 0 && this.props.nexmess !== "notfind") {
			_datatitle = this.props.nexmess.map((item, index) => {
				let _childlist = this.datatitle.map((it, ins) => {
					let _keys = this.datatitle[ins]
					let html = item[_keys]
					if (it == "ptype") {
						html =  <div>
									{item[_keys]} 
									<div className="listchild-float-show">{item[_keys] == "Y" ? "Normal" : "选择性替代"}</div>
								</div>
					}
					if( ins == 1){
						html = <div className="list-item-partcode">{item[_keys]}
							<span className="coby-icon" title="复制" onClick={e => _cobyPart(item[_keys], e)}>
								<span className="cody-success">
									复制成功
								</span>
							</span>
						</div>
					}
					return (
						<div onClick={this.openNewPart.bind(this,item.brandcn,item.pid)} key={ins} className="listhead-listchild" style={{flex:this.widthArr[ins]}}>
							{html}
						</div>
					)
				})
				return (
					<div key={index} className="listhead-list">
							{_childlist}
						</div>
				)
			})
		}

		return (
			<div className="listhead" id="repacetoview" style={{display:_show}}>
				<div className="title-href">
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				<div className="listhead-father">
					<div className="listhead-title" style={{display:"flex"}}>{_title}</div>
					{_datatitle}
				</div>
			</div>
		)
	}
}

class ListreplaceTP extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
		this.head = "品牌件"
		this.title = ["品牌", "零件名称", "品牌编号", "型号", "注释", "零件图片"]
		this.datatitle = ["brandcn", "lable", "pid", "ptype", "advise", "imgs"]
		this.width = [17300/784, 10000/784, 13300/784, 9500/784, 18000/784, 9200/784]
	}

	cobyPart(code, e) {
		let oDiv = document.createElement('textarea');
		oDiv.value = code;
		oDiv.innerHTML = code;
		document.body.appendChild(oDiv)
		oDiv.select();
		document.execCommand("Copy")
		document.body.removeChild(oDiv)
		e.stopPropagation()
	}

	render() {
		//生成头部
		let _title = this.title.map((im, ix) => {
				return (
					<div key={ix} style={{width:this.width[ix]+"%"}} className="title-background">{im}</div>
				)
			})
			// 生成列表
		let _show
		let _isFind
		if(this.props.datalist == 'notfind') {
			_isFind = false
			_show = "block"
		}else{
			_show = this.props.datalist.length > 0 ?  "block" : "none"		
			_isFind = true
		}
		let _cobyPart = this.cobyPart.bind(this)		
		
		let _datatitle = <div></div>
		if (this.props.datalist !== 'notfind' && this.props.datalist.length != 0) {
			_datatitle = this.props.datalist.map((item, index) => {
				let _childlist = this.datatitle.map((it, ins) => {
					let _keys = this.datatitle[ins]
					let _content = item[_keys]
					if(ins === 0) {
						return (
							<div className="listhead-listchild result-cell" key={ins} style={{width:this.width[ins]+"%"}}>
								<img src={item.supplier_img_url} alt=""/>
								{/* <img src='https://test.007vin.com/stcimgs/img/2e0804f99852ce93d5e2469e8a0f8edc.jpg' alt=""/> */}

								<span className="cell-hover">
									{_content}
								</span>
							</div>
						)
					}else if(_keys === "imgs") {
						// _content =					
						return(
							<div key={ins} style={{width:this.width[ins]+"%"}}  className="listhead-listchild part-img">
								{/* {_content} */}
								<img style={{display: _content ? "block" : "none"}} src={_content[0]} />	
							</div>
						)
					}else if(_keys === "pid") {
						return(
							<div key={ins} style={{width:this.width[ins]+"%"}}  className="listhead-listchild">
								<span className="tp-coby-container">
									{_content}
									<span className="coby-icon" title="复制" onClick={e => _cobyPart(_content, e)}>
										<span className="cody-success">
											复制成功
										</span>
									</span>
								</span>
								
							</div>
						)
					}
					return (
						<div key={ins} style={{width:this.width[ins]+"%"}}  className="listhead-listchild">
							{_content}
						</div>
					)
				})
				return (
					<div key={index} className="listhead-list" style={{"min-height": "90px"}}>
						{_childlist}
					</div>
				)
			})
		}

		return (
			<div className="listhead" id="headtoviewTP" style={{display: _show}}>
				<div className="title-href">
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				{
				_isFind ? 
					<div className="listhead-father">
						<div className="listhead-title">{_title}</div>
						{_datatitle}
					</div>
					:
					<div className="notFindTP">
						<img src="/img/p_pinpai.png" alt=""/>
					</div>
				}
			</div>
		)
	}
}

class Listhead extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.head = "基础信息"
		this.title = ["零件号", "名称", "件数", "型号", "参考价格"]
		this.datatitle = ["pid", "label", "num", "model", "prices"]
	}
	render() {
		//生成头部
		let _title = this.title.map((im, ix) => {
				return (
					<div key={ix} className="title-background">{im}</div>
				)
			})
			// 生成列表
		let _show = this.props.gethead.length > 0 ? "block" : "none"
		let _datatitle = <div></div>
		if (this.props.gethead.length != 0) {
			_datatitle = this.props.gethead.map((item, index) => {
				let _childlist = this.datatitle.map((it, ins) => {
					let _keys = this.datatitle[ins]
					return (
						<div key={ins} className="listhead-listchild" dangerouslySetInnerHTML={{__html: item[_keys]}}></div>
					)
				})
				return (
					<div key={index} className="listhead-list">
						{_childlist}
					</div>
				)
			})
		}
		return (
			<div className="listhead" id="headtoview" style={{display:_show}}>
				<div className="title-href">
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				<div className="listhead-father">
					<div className="listhead-title">{_title}</div>
					{_datatitle}
				</div>
			</div>
		)
	}
}


// class Listrepace extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {};
// 		this.head = "替换件"
// 		this.title = ["零件号", "车型", "件数", "型号", "参考价格"]
// 		this.datatitle = ["pid", "ptype", "num", "is_last", "prices"]
// 	}
// 	render() {
// 		//生成头部
// 		let _title = this.title.map((im, ix) => {
// 				return (
// 					<div key={ix} className="title-background">{im}</div>
// 				)
// 			})
// 			// 生成列表		
// 		let _show = this.props.getrepace.length > 0 ? "block" : "none"
// 		let _datatitle = <div></div>
// 		if (this.props.getrepace.length != 0) {
// 			_datatitle = this.props.getrepace.map((item, index) => {
// 				let _childlist = this.datatitle.map((it, ins) => {
// 					let _keys = this.datatitle[ins]
// 					let _content = <div></div>
// 					if (ins == 1) {
// 						_content = <div className="listchild-float-show">Normal</div>
// 					}
// 					return (
// 						<div key={ins} className="listhead-listchild" onClick={this.openNewPart.bind(this)}>
// 							{item[_keys]}
// 							{_content}
// 						</div>
// 					)
// 				})
// 				return (
// 					<div key={index} className="listhead-list">
// 						{_childlist}
// 					</div>
// 				)
// 			})
// 		}

// 		return (
// 			<div className="listrepace" id="repacetoview" style={{display:_show}}>
// 				<div className="title-href">
// 					<div className="title-black"></div>
// 					<div>{this.head}</div>
// 				</div>
// 				<div className="listhead-father">
// 					<div className="listhead-title">{_title}</div>
// 					{_datatitle}
// 				</div>
// 			</div>
// 		)
// 	}
// }

class Listpart extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.head = "组件"
		this.title = ["位置", "零件号", "名称", "型号", "备注", "件数"]
		this.datatitle = ["id", "pid", "label", "remark", "advise", "num"]
	}
	newFloatwindow(item, type, e) {
		// if (type == "false") {
		// 	return
		// }
		// // let _urls = "/ppy?type=part&binds=group&replacecode=" + item
		// let _urls = "?type=part&part=" + item + "&brand=" + this.props.newbrand
		// window.open(_urls)

		e.stopPropagation()
	}

	cobyPart(code, e) {
		let oDiv = document.createElement('textarea');
		oDiv.value = code;
		oDiv.innerHTML = code;
		document.body.appendChild(oDiv)
		oDiv.select();
		document.execCommand("Copy")
		document.body.removeChild(oDiv)
		e.stopPropagation()
	}

	render() {
		//生成头部
		let _cobyPart = this.cobyPart.bind(this)		
		
		let _title = this.title.map((im, ix) => {
				return (
					<div key={ix} className="title-background">{im}</div>
				)
			})
			// 生成列表
		let _show = this.props.getpart.length > 0 ? "block" : "none"
		let _datatitle = <div></div>
		if (this.props.getpart.length != 0) {
			_datatitle = this.props.getpart.map((item, index) => {
				let _pid = item.pid
				let _childlist = this.datatitle.map((it, ins) => {
					let _keys = this.datatitle[ins]
					let html = item[_keys]
					if( ins == 1){
						html = <div className="list-item-partcode">{item[_keys]}
							<span className="coby-icon" title="复制" onClick={e => _cobyPart(item[_keys], e)}>
								<span className="cody-success">
									复制成功
								</span>
							</span>
						</div>
					}
					return (
						<div key={ins} className="listhead-listchild">{html}</div>
					)
				})
				return (
					<div key={index} className="listhead-list" onClick={this.newFloatwindow.bind(this,_pid,"true")}>
						{_childlist}
					</div>
				)
			})
		}

		return (
			<div className="listpart" id="parttoview" style={{display:_show}}>
				<div className="title-href">
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				<div className="listhead-father">
					<div className="listhead-title">{_title}</div>
					{_datatitle}
				</div>
			</div>
		)
	}
}

class Listmessage extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.head = "技术信息"
	}

	cobyPart(code, e) {
		let oDiv = document.createElement('textarea');
		oDiv.value = code;
		oDiv.innerHTML = code;
		document.body.appendChild(oDiv)
		oDiv.select();
		document.execCommand("Copy")
		document.body.removeChild(oDiv)
		e.stopPropagation()
	}

	render() {
		// 生成列表
		let _show = this.props.getmessage.length > 0 ? "block" : "none"
		let _datatitle = <div></div>
		let _cobyPart = this.cobyPart.bind(this)				
		if (this.props.getmessage.length != 0) {
			_datatitle = this.props.getmessage.map((item, index) => {
				let itemarr = item.split(":")
				let itemfirst = itemarr[0] == "" ? "" : itemarr[0] + ":"
				return (
					<div className="listmessage-list" key={index}>
							<div className="listmessage-left" >{itemfirst}</div>
							<div className="listmessage-right" dangerouslySetInnerHTML={{__html: itemarr[1]}}></div>
						</div>
				)
			})
		}
		return (
			<div className="listmessage" id="messagetoview" style={{display:_show}}>
				<div className="title-href">
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				<div className="listmessage-list-content">
					{_datatitle}
				</div>
			</div>
		)
	}
}
class Listprice extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.head = "渠道价格"
		// this.title = ["零件类型", "厂家", "备注","进价(未含税)","进价(含税)","销售价"]
		// this.datatitle = ["mill", "remark", "eot_price", "cost_price", "prices"]

		this.title = ["零件类型", "厂商", "说明", "地区", "库存", "进价(未含税)","销售价(含税)", "服务商"]
		this.datatitle = ["mill", "remark", "location", "amount", "eot_price", "prices", "supplier"]
	}
	render() {
		//生成头部
		let _title = this.title.map((im, ix) => {
				return (
					<div key={ix} className="title-background">{im}</div>
				)
			})
			// 生成列表
		let _show = this.props.getprice.length > 0 ? "block" : "none"
		let _datatitle = <div></div>
		if (this.props.getprice.length != 0) {
			_datatitle = this.props.getprice.map((item, index) => {
				return(
					<div className="main-row-item" key={index}>
						<div className="main-row-left">
							{item.title}
						</div>
						<div className="main-row-right">
							{
								item.data.map((it,ins)=>{
									return(
										<div className="main-row-item" key={ins}>
										{
											this.datatitle.map((i,j)=>{
												return(
													<div className="main-clomn-item" key={j}>
														{it[i]}
													</div>
												)
											
											})
										}	
										</div>
									)
								})
							}
						</div>
					</div>
				)
			})
		}
		return (
			<div className="listprice" id="pricetoview" style={{display:_show}}>
				<div className="title-href">
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				<div className="listhead-father">
					<div className="listhead-title">{_title}</div>
					{_datatitle}
				</div>
			</div>
		)
	}
}

class ListPartCars extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.head = "适用车型"
		this.title = [" ", "车型", "市场", "年份", "零件组", ""]
		this.datatitle = ["", "cars_model", "market", "year", "group_name", "uri_param"]
	}

	loadMore() {

	}

	location(url, maintitle, subtitle,key) {
		if (key == 0) return
		let title = maintitle + " > " + subtitle
		// console.log(title)
		this.props.toresultClick(url,title)
			// if (url) {
			// window.open(url)
			// }
	}

	render() {
		//生成头部
		let _title = this.title.map((im, ix) => {
				return (
					<div key={ix} className="title-background">{im}</div>
				)
			})
			// 生成列表
		let _show = this.props.getcars.length > 0 ? "block" : "none"
		let _datatitle = <div></div>
		let isShow = true
		if (this.props.getcars.length != 0) {
			_datatitle = this.props.getcars.map((item, index) => {
				let _childlist = item.map((it, ins) => {
					if (ins > 0) {
						isShow = false
					} else {
						isShow = true
					}
					return (
						<div key={ins}  className="listhead-item" style={{display:isShow ? "flex" : "none"}}>
						{
							this.datatitle.map((value,key)=>{
								let itvalue = ""
								let classNames = "listhead-listchild"
								if(ins==0 && key==0 && item.length>1){
									classNames = "plus"
								}
								itvalue = it[value]
								if(value == "uri_param"){
									itvalue = this.props.haveDetail ? "查看" : ""
									
								}
								return(
									<div className={classNames} style={{cursor: this.props.haveDetail ? "pointer" : "default"}} onClick={this.location.bind(this,it.uri_param, it.main_group_name, it.group_name ,key)} key={key} dangerouslySetInnerHTML={{__html: itvalue}} />
								)
							})
						}</div>
					)
				})
				return (
					<div key={index} className="listhead-list">
						{_childlist}
					</div>
				)
			})
		}
		let _pages = this.props.pages
		let _footshow = this.props.pages == 1 ? "none" : "block"
		return (
			<div className="listpartcars" id="carstoview" style={{display:_show}}>
				<div className="title-href">
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				<div className="listhead-title">{_title}</div>
				<div className="listhead-body">
					{_datatitle}
					<div className="list-more" style={{display:_footshow}} onClick={this.props.addDataFive.bind(this,_pages)}>加载更多</div>
				</div>
			</div>
		)
	}
}