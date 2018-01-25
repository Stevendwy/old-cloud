import React, {
	Component
} from 'react'
import $ from 'min-jquery'
import Root from "../root"
export default class Listdetailrepace extends Root {
	constructor(props) {
		super(props)
		this.state = {
			whitchIs: "",
			cursors: "auto",
			gotmes: {
				"data": []
			},
			starttype: false, //展开还是收起
			startnum: 20, //父级级别
			startlevel: 10, //开始展开位置
			startimg: [], //存储图片
			startstore: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] //存储节点展示层级 节点存在就显示			
		}
		this.head = "替换件"
		this.oldstore = 0 //存储长度
		this.newstore = 0 //存储长度新
		this.displaynum = [] //存储隐藏节点
		this.titleList = ["品牌", "零件号","零件名称", "件数", "型号", "参考价格"]
		this.store = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] //存储点击值
	}

	componentDidMount() {
		this.setState({
			gotmes: this.props.nexmess,
			whitchIs: this.props.whitchIs
		})
	}

	componentWillReceiveProps(props) {
		this.setState({
			gotmes: props.nexmess,
			whitchIs: props.whitchIs
		})
	}

	newFloatwindow(item, type, e) {
		if (type == "false") {
			return
		}
		let _urls = "/ppy?type=part&binds=group&replacecode=" + item
		// window.open(_urls)
		e.stopPropagation()
	}

	handleMouseEnter(item, e) {
		if (this.state.whitchIs != "0") {
			this.setState({
				cursors: "pointer"
			})
		}
		e.stopPropagation()
	}

	handleMouseLeave(item, e) {
		this.setState({
			cursors: "auto"
		})
		e.stopPropagation()
	}

	handleImgClick(imgtype, num, parentnum) {
		let _type = false
		let str1 = imgtype //判断展开还是收起
		if ((str1.indexOf("Last") != -1) || (str1.indexOf("Solid") != -1)) {
			return
		}
		let _truetype = imgtype.indexOf("Open")
		let _index = this.store.indexOf(num)
		if (_index != -1) {
			_type = false
			for (let k = 0; k < 50; k++) { //清理存储
				let numk = num + k
				let _instore = this.store.indexOf(numk)
				if (_instore != -1) {
					this.store.splice(_instore, 1)
				}
			}
		} else {
			_type = true
			this.store.push(num)
		}
		let _store = this.store
		this.setState({
			startstore: _store,
			startnum: num,
			starttype: _type
		})
	}

	render() {
		let _cursor = this.state.cursors
		let _startnum = this.state.startnum
		let _startlevel = this.state.startlevel
		let _starttype = this.state.starttype

		let _newbrands = this.props.newbrand //brands
		let _childrenwidth = (_startnum * 20 + 170) + "px"
		let _fatherwidth = (_startnum * 20 + 635) + "px"

		let _listmes = <div></div>
		let _li = <div></div>
		let _head = this.props.nexmess
		let _showsblock = this.props.nexmess.length < 1 ? "none" : "block"
			//params.code != "land_rover" && params.code != "audi"
		if (_newbrands == "land_rover" || _newbrands == "audi" || _newbrands == "vwag") {
			let _widthnum = _head.length
			if (_startnum == 20) {
				_childrenwidth = (_widthnum * 20 + 90) + "px"
				_fatherwidth = (_widthnum * 20 + 560) + "px"
			} else {
				_childrenwidth = (_startnum * 20 + 90) + "px" //50px
				_fatherwidth = (_startnum * 20 + 560) + "px" //20px
			}

			let _startstore = this.state.startstore
			_listmes = _head.map((item, i) => {
				let _hasinstore = _startstore.indexOf(item.num)
				// let _margin = (item.level - 1) * 20 + "px"
				let _margin = (item.level - 1) * 10 + "px"
				
				let _className = "PartReplaceBackgroundImg PartReplaceBackgroundImgClose" //处理class
				if (item.level == 1) {
					if (item.haschild == 1) {
						if (_hasinstore == -1) {
							_className = "PartReplaceBackgroundImg PartReplaceBackgroundImgCloseFirst"
						} else {
							_className = "PartReplaceBackgroundImg PartReplaceBackgroundImgOpenFirst"
						}
					} else {
						_className = "PartReplaceBackgroundImg"
					}
				} else {
					if (item.haschild == 1) {
						if (_hasinstore == -1) {
							_className = "PartReplaceBackgroundImg PartReplaceBackgroundImgClose"
						} else {
							_className = "PartReplaceBackgroundImg PartReplaceBackgroundImgOpen"
						}
					} else {
						if (item.is_last == 1) {
							_className = "PartReplaceBackgroundImg PartReplaceBackgroundImgLast"
						} else {
							_className = "PartReplaceBackgroundImg PartReplaceBackgroundImgSolid"
						}
					}
				}
				// 处理单一数据情况  和下面数据为空时候一样
				if (_head.length == 1) {
					_className = "PartReplaceBackgroundImgFirstno"
				}
				let _display = "none" //处理display
				if (_starttype == true) {
					if (item.parentnum > _startnum) {
						_display = "none"
					} else if (item.parentnum <= _startnum) {
						_display = "flex"
					}
				} else {
					if (item.parentnum < _startnum) {
						_display = "flex"
					}
				}
				if (item.level == 1) {
					_display = "flex"
				}
				// let _itemSlice = item.advise.length > 14 ? item.advise.slice(0, 14) + "..." : item.advise
				// let _itemBable = item.lable.length > 10 ? item.lable.slice(0, 10) + "..." : item.lable
				let _class = item.advise.length > 14 ? "toshow" : "tohide"
				let _showworlds = item.ptype == "Y" ? "Normal" : "选择性替代"

				return (
					<div key={i} style={{display:_display}}
						className="GroupPartDetailListModelContentcontentLi"> 
						<div className="PartReplaceOne">
							{item.brandcn}
						</div>
						<div className="PartReplaceTwo" style={{width:_childrenwidth}}>
							<div className="PartReplaceLength" style={{marginLeft:_margin}}>
								<div className={_className} style={{cursor:"pointer"}}
									onClick={this.handleImgClick.bind(this,_className,item.num,item.parentnum)}>
								</div>
								<div className="PartReplaceBackgroundPid" style={{cursor:"pointer"}}
									onClick={this.newFloatwindow.bind(this,item.pid,"true")}>
									{item.pid}
								</div>
							</div>
						</div>
						{/* <div className="PartReplaceTwo">
							{item.brandcn}
						</div> */}
						<div className="PartReplaceThree" title={item.lable}>{item.lable}</div>
						<div className="PartReplaceFour">
							{item.counts}
							<div className={_class}>{item.counts}</div>
							{/* {_itemSlice} */}
						</div>
						<div className="PartReplaceFive">
							<div className="PartReplaceTwoHas">{_showworlds}</div>
							{item.ptype}
						</div>
						<div className="PartReplaceSix">{item.prices}</div>
					</div>
				)
			})
		} else {
			_childrenwidth = "auto"
			_fatherwidth = "auto"
			_li = <Listrepace getrepace={_head} newFloatwindow={this.newFloatwindow.bind(this)}/>
		}
		let _displaycode = "none"
		let _contentsmes = _li

		let _bordercolor = "0px"
		if (_newbrands == "land_rover" || _newbrands == "audi" || _newbrands == "vwag") {
			_displaycode = "block"
			_contentsmes = _listmes
			_bordercolor = "1px solid #D8D8D8"
		}
		if (_head.length < 1) {
			_displaycode == "block"

		}
		return (
			<div className="listrepace" id="repacetoview" style={{display:_showsblock}}>
				<div className="title-href" style={{display:_displaycode}}>
					<div className="title-black"></div>
					<div>{this.head}</div>
				</div>
				<div className="listhead-father" style={{border:_bordercolor}}>
					<div className="GroupPartDetailListModelContentcontentExc" style={{minWidth:_fatherwidth}}>
						<div className="GroupPartDetailListModelContentcontentLi" style={{display:'flex'}}> 
							{/* <div className="PartReplaceOne" style={{minWidth:_childrenwidth}}>{this.titleList[0]}</div> */}
							<div className="PartReplaceOne">{this.titleList[0]}</div>
							<div className="PartReplaceTwo">
								 <span>
									{this.titleList[1]}	
								 </span> 
							</div>
							<div className="PartReplaceThree">{this.titleList[2]}</div>
							<div className="PartReplaceFour">{this.titleList[3]}</div>
							<div className="PartReplaceFive">{this.titleList[4]}</div>
							<div className="PartReplaceSix">{this.titleList[5]}</div>
						</div>
						{_contentsmes}	
					</div>
				</div>
			</div>

		)
	}
}
class Listrepace extends Root {
	constructor(props) {
		super(props);

		this.state = {};
		this.head = "替换件"
		this.title = ["零件号", "品牌", "零件名称", "件数", "型号", "参考价格"]
		this.datatitle = ["pid", "brandcn", "lable", "counts", "ptype", "prices"]
	}
	render() {
		//生成头部
		let _title = this.title.map((im, ix) => {
				return (
					<div key={ix} className="title-background">{im}</div>
				)
			})
			// 生成列表
		let _datatitle = this.props.getrepace.map((item, index) => {
			let _pid = item.pid
			let _childlist = this.datatitle.map((it, ins) => {
				let _keys = this.datatitle[ins]
				let _content = <div></div>
				if (ins == 4) {
					let _showworlds = it != "G" ? "Normal" : "Normal"
					_content = <div className="listchild-float-show">{_showworlds}</div>
				}
				let _kes = ins == 0 || ins == 5 ? "ture" : "false"

				return (
					<div key={ins} className="listhead-listchild" onClick={this.props.newFloatwindow.bind(this,_pid,true)}>
						{item[_keys]}
						{_content}
					</div>
				)
			})
			return (
				<div key={index} className="listhead-list">
					{_childlist}
				</div>
			)
		})

		return (
			<div className="listrepace">
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