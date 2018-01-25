import React from 'react'
import Root from '../root'
import FloatWindow from './floatwindow'
import PartDetail from './partdetail'
import PartList from './partlist'
import Utils from "../utils"
import Result from "./partresult"
import VCP from '../vcp'
import CardSelector from '../card_selector'
export default class Part extends VCP {
	constructor(props) {
		super(props)
		this.type = 'part'
		this.state = {
			show: this.type === props.type,
			partDetailObj: {},
			partDetailDate: {},
			partlist: false,
			partdetail: <div />,
			groupDetail: false,
			showFloatWindow: false,
			dataShowImg: [],
			mainGroups: null,
			partlstdata: [],
			isShowList: false,
			index: -1,
			backIsShow: "block",
			loadingShow: "none",
			value: "",
			title: {},
			leftContainerShow: true,
			toggleIsShow: [1, 0],
			brandurl: "",
			hasData: false,
			cardSelectorShow: false,
			canBack: false,
			canNext: false,
			showChooseBrand: false,  //显示选择品牌吗
			clearshow:false,
			errorShow: false,
			selectedIndex: -1,//默认选择的为  全部
			brandListDate: null,
			supportBrandTotal:"",
			brandsdict: {},
			choosebrand: "",
			baseChooseBrand: localStorage.getItem("baseChooseBrand") || ""
		}

		this.partCode = ""
		this.brand = ""
		this.toDetailObj = {}
		this.isLargeNumber = false
		this.image = ""
		this.length = 1
		this.cobyDate = []
		this.p = ""
		this.auth = ""
		this.brands = ""
		this.sets = ""	
		this._setBaseBrand = this.setBaseBrand.bind(this)
		window.destroyPartSearchTitle = this.destroyTitle.bind(this)
	}

	callbackshow() {
		this.setState({
			toggleIsShow: [1, 0],
			groupDetail: false
		}, () => {
			this.renderHistory()
		})
	}

	componentWillUnmount(){
		window.destroyTitle = null
	}

	submitClick(value, brand = "") {
		this.isLargeNumber = false
		value = value.replace(/[\r\n]/g, ",")
		let valueArray = value.split(",")
		let limitlength = 6;
		// if(!brand){
		// 	if(this.state.chooseBrandArray){
		// 		if(this.state.chooseBrandArray.src){
		// 			brand = this.state.chooseBrandArray.brand
		// 		}
		// 	}
		// }
		this.setState({
			clearshow: true
		})

		if(brand){
			limitlength = this.state.brandsdict[brand].shot_pid_length			
		}else if(this.state.choosebrand){
			limitlength = this.state.brandsdict[this.state.choosebrand].shot_pid_length			
		}else{
			
		}

		for(let i = 0; i < valueArray.length; i ++){
			// console.log(valueArray[i])
			if(valueArray[i]){
				if(valueArray[i].length < limitlength){
					alert("输入零件号不得小于"+ limitlength +"位")
					return;
				}
			}
		}

		this.partCode = value
		if (value.length !== 0) {
			this.setState({
				loadingShow: "block",
				showChooseBrand:false,
			}, () => {
				this.testBrands(value, brand)
			})
		}
	}

	testBrands(part, brand = "") {
		let _this = this
		// if(this.state.baseChooseBrand == "" || this.state.baseChooseBrand) {
		// 	let brand = this.state.baseChooseBrand
		// 	let dictArray = this.state.brandsdict[brand]
		// 	if(dictArray) {
		// 		let _obj = {
		// 			src: dictArray.src,
		// 			brand: dictArray.brandcode,
		// 			brandName: dictArray.name,
		// 			shot_pid_length: dictArray.shot_pid_length,
		// 		}
		// 		this.setState({
		// 			chooseBrandArray: _obj,
		// 			choosebrand: brand
		// 		})
		// 	}
		// } else {
			if(!brand) {
				if(this.state.chooseBrandArray) {
					if(this.state.chooseBrandArray.src) {
						brand = this.state.chooseBrandArray.brand
					}
				}
			}else {
				let dictArray = this.state.brandsdict[brand]
				if(dictArray) {
					let _obj = {
						src: dictArray.src,
						brand: dictArray.brandcode,
						brandName: dictArray.name,
						shot_pid_length: dictArray.shot_pid_length,
					}
					this.setState({
						chooseBrandArray: _obj,
						choosebrand: brand
					})
				}
	
				// this.setState({
				// 	chooseBrandArray: "",
				// 	choosebrand:""
				// })
			}
		// }
	
		



		Model.submit({
			"parts": part,
			"brand": brand
		}, res => {
			this.setState({
				loadingShow: "none"
			})
			let brand = res.brand
			window.currentBrands = res.brand
			this.brand = brand
			this.image = res.img
			if (res.code == 1) {
				//有品牌进入零件列表页面或者进入零件详情页
				if (res.data.length > 1 || res.data[0].length > 1) {
					this.isLargeNumber = true
				}
				// _this.renderHistory()
				_this.testContainerType(res)
			} else if (res.code == 6) {
				//选择零件平台再查询
				_this.setState({
					dataShowImg: res.data,
					showFloatWindow: true
				})
			} else if (res.code == 0) {
				this.isLargeNumber = true
				_this.testContainerType(res)
			}
		})
	}

	testContainerType(res) {
		if (!this.isLargeNumber) {
			let obj = {
				"detailshow": "block",
				"length": 1,
				"whitch": 1,
				"part": res.data[0][0].pid,
				"brand": this.brand
			}
			this.partData(obj, res)
			this.setState({
				backIsShow: "block",
				isShowList: false,
				canBack:false,
				canNext:false
			})
		} else {
			let i = 0
			res.data.map((item, index) => {
				if (item.status) {
					this.cobyDate[i] = item
					i++
				}
			})
			this.length = this.cobyDate.length
			this.setState({
				partlist: true,
				partdetail: <div/>,
				loadingShow: "none"
			}, () => {
				this.setState({
					backIsShow: "none",
					isShowList: true,
					toggleIsShow:[1,0], //000
					partlstdata: res.data
				})
			})
		}
	}

	handleClick(chooseBrand) {
		let _this = this
		Model.submit({
			"parts": _this.partCode,
			"brand": chooseBrand
		}, res => {
			this.brand = chooseBrand
			window.currentBrands = res.brand			
			if (res.data.length > 1 || res.code == 0) {
				this.isLargeNumber = true
			}
			_this.testContainerType(res)
			_this.setState({
				showFloatWindow: false
			})
		})
	}

	modal() {
		let dataShowImg = this.state.dataShowImg
		let modal = (
			<div className="brandsContainer">
                {
                    this.state.dataShowImg.map((item, index) => {
                        return (
                            <div key={index} className="brandsItem"  onClick={this.handleClick.bind(this,item.brand)}>
                                <img src={item.img} />
                                <span>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
		)
		return modal
	}

	changePage(type, index) {
		index--
		this.setState({
			partdetail: <div className="no-loading"/>,
			isShowList: true
		}, () => {
			if (type == "next") {
				this.toDetail(this.cobyDate[index + 1].pid, index + 1 + 1)
			} else if (type == "pre") {
				this.toDetail(this.cobyDate[index - 1].pid, index - 1 + 1)
			}
		})
	}

	toDetail(partCode, index) {
		let _obj = {
			"detailshow": "block",
			"length": this.length,
			"whitch": index,
			"part": partCode,
			"brand": this.brand
		}
		this.setState({
			canBack: true,
			canNext: false
		})
		this.partData(_obj)
	}
	tohide() {
		this.setState({
			toggleIsShow: [1, 0]
		}, () => {
			this.renderHistory()
		})
	}

	changeIndex(index) {
		this.setState({
			index
		})
	}


	toresult(params,title) {
		let _obj = {
			p: params.p,
			code: params.code,
			auth: params.auth
		}
		// if(params.code == "land_rover") return
		window.currentBrands = "all"				
		// this.p = params
		// console.log(title)
		this.setState({
			partResultParams: params,
			// partResultTitle: title,
			toggleIsShow: [0, 1],
			groupDetail: true
		})

		Model.info(params.auth, params.code, params.p, res => {
			this.setState({
				brandurl: res.data.brandurl,
				partResultTitle: res.data.carhead[0] + ">" + title 
			})
		})
		// 	this.setTitle({
		// 		info: res.data.carhead
		// 	})
		// 	Model.groupdate(_obj, res => {
		// 		this.p = params.p
		// 		this.sets = res.sets
		// 		this.auth = res.sets.auth
		// 		this.brands = params.code
		// 		this.setState({
		// 			index: res.sets.index,
		// 			mainGroups: res.data,
		// 			groupDetail: true,
		// 			toggleIsShow: [0, 1]
		// 		})
		// 	})
		// })
	}
	
	subSearchShow() {
		this.setState({
			toggleIsShow: [1, 0],
			groupDetail: false
		})
	}

	destroyTitle(title){
		let _titles = this.state.titles
		if(_titles.indexOf(title) !== -1){
			_titles.splice(_titles.indexOf(title),1)
			this.setState({
				titles: _titles		
			})
		}	
	}

	partData(_obj, data = "") {
			Model.listHead(_obj, res => {
				if (res.code == 1) {
					this.setState({
						cardSelectorShow:false
					},()=>{
						let titles = res.headname
						titles.unshift("基础信息")
						// let index;
						// if(titles.indexOf("品牌件") !== "-1") {
						// 	index = titles.indexOf("品牌件")
						// 	titles.splice(index, 1)
						// }
						this.setState({
							isShowList:false,
							hasData:true,
							cardSelectorShow:true,
							titles: titles,
							listHead: res.partdetail,
							brand: _obj.brand,
							part: _obj.part,
							res: res,
							chooseTitle: "searchPart"
						})
					})
				} else {
					if (data) {
						this.isLargeNumber = true
						this.testContainerType(data)
						this.setState({
							canBack: false,
							canNext: false
						})
					} else {
						alert("无零件详情")
					}

				}
			})
	}

	componentWillMount() {
		

		Model.Brandsdict(res=>{
			this.setState({
				brandsdict: res.data
			},()=>{
				if (Utils.params().part) {
					this.submitClick(Utils.params().part, Utils.params().brand)
				}else {
					Model.historyData(res=>{
						this.setState({
							historyBrandList: res.data[0][2]
						},()=>{
							let brandkey = this.state.historyBrandList
							if(this.state.baseChooseBrand == "" || this.state.baseChooseBrand) {
								brandkey = this.state.baseChooseBrand
							}
							let brandlist = this.state.brandsdict
							let item = brandlist[brandkey]
							if(item) {
								let it = {"src":item.src,"brand":item.brandcode,"brandName":item.name,"shot_pid_length":item.shot_pid_length,"shot_vin_length":item.shot_vin_length}
								this.choosedBrand(it)
							}
						})
					})
				}
			})
		})
		Model.brandList(res=>{
			this.data = res
			this.setState({
				brandListDate: JSON.parse(JSON.stringify(res.data)),
				supportBrandTotal: res.total
			})
		})
	}

	componentDidMount(){
		
	}

	setBaseBrand(e,brand) {
		e.stopPropagation()
		localStorage.setItem("baseChooseBrand",brand)
		this.setState({
			baseChooseBrand: brand
		})
	}

	getBrandHistory(){
		if(this.state.historyBrandList){
			let brandkey = this.state.historyBrandList
			let brandlist = this.state.brandsdict	
			let item = brandlist[brandkey]
			let it = {"src":item.src,"brand":item.brandcode,"brandName":item.name,"shot_pid_length":item.shot_pid_length,"shot_vin_length":item.shot_vin_length}
			let baseChoosed = this.state.baseChooseBrand === item.brandcode
			return(
					<div className="brand-img-item" 
						title={"支持"+ item.shot_pid_length+"位零件号查询"}
						onClick={this.choosedBrand.bind(this,it)}
					>
						<img alt = {item.name+"配件查询"} src={"https://cdns.007vin.com" + item.src}/>
						<span>
							{item.name}
						</span>
						{
							baseChoosed
							? <div className="choosed">{TR("默认查询品牌")}</div>
							: <div className="un-choosed" onClick={e=>{this._setBaseBrand(e,item.brandcode)}}>设为默认</div>
						}
					</div>
			)
		}else{
			return (
				<div className="brand-img-item selected" title="支持完整零件号查询" onClick={this.choosedBrand.bind(this,this.state.chooseBrandArray)}>
					<span>
						{TR("全部品牌")}
					</span>
				</div>
			)
		}
	
	}

	toggleShowBrands(){
		this.setState({
			showChooseBrand: !this.state.showChooseBrand
		})
	}

	choosedBrand(brandArray){
		// console.log(brandArray)
		this.setState({
			showChooseBrand: false,
			chooseBrandArray: brandArray,
			choosebrand: brandArray.brand,
			// isShowList: false,
			// cardSelectorShow: false,
			// backIsShow: "none"
		},()=>{
			if(window.textareaSubmit){
				window.textareaSubmit()
			}
		})
	}

	chooseBrandTitle(item,index){
		// 列表操作
		let _brandListDate = [item]
		if(index == -1){
			_brandListDate = this.data.data
		}
		this.setState({
			selectedIndex: index,
			brandListDate: _brandListDate
		})
	}

	getTitle(){
		return(
			this.data.data.map((item,index)=>{
				let _className = "title-item"
				if(this.state.selectedIndex == index){
					_className = "title-item selected"
				}
				// console.log(item)
				return(
					<div className={_className} key={index} onClick={this.chooseBrandTitle.bind(this,item,index)}>
						{item.title}
					</div>
				)
			})
		)
	}

	getBrandList(){
		return(
			this.state.brandListDate.map((item,index)=>{
				return(
					<div className="brand-list-item" key={index}>
						<div className="list-item-title">
							{item.title}
						</div>
						<div className="brand-list-body">
							{
								item.list.map((it,ins)=>{
									let _className = "brand-img-item"
									if(it == this.state.chooseBrandArray){
										_className = "brand-img-item selected"
									}
									let baseChoosed = this.state.baseChooseBrand === it.brand
									return(
										<div key={ins} className={_className} title={"支持"+ it.shot_pid_length +"位零件号查询"} onClick={this.choosedBrand.bind(this,it)}>
											{it.src ?  <img alt={it.brandName + "配件查询"} src={"https://cdns.007vin.com"+it.src}/> : null}
											<span>
												{it.brandName}
											</span>
											{
												baseChoosed
												? <div className="choosed">{TR("默认查询品牌")}</div>
												: <div className="un-choosed" onClick={e=>{this._setBaseBrand(e,it.brand)}}>{TR("设为默认")}</div>
											}
										</div>
									)
								})
							}
						</div>
					</div>
				)		
			})
		)
	}

	setTitle(title) {
		let _title = this.state.title
		_title.info = title.info || _title.info
		_title.mainGroup = title.mainGroup || _title.mainGroup
		_title.subGroup = title.subGroup
		this.setState({
			title: _title
		})
	}

	rehisotry(renderHistory) {
		this.renderHistory = renderHistory
	}

	hiddenCarInfo() {
		// this.setState({showCarInfo: false})
	}

	hiddenCardSelector(){

	}
	
	goStep(type){
		if(type == 1){
			if(this.state.canNext){
				this.setState({
					isShowList: false,
					canBack: true,
					canNext: false
				})
			}
		}else{
			if(this.state.canBack){
				this.setState({
					isShowList: true,
					canBack:false,
					canNext:true
				})
			}
		}
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
            errorShow: _errorShow
        })
    }

    clearshow(){
        this.setState({
            errorShow: false
        })
        let _searchPart = this.refs.search
            _searchPart.value = ''
            _searchPart.focus()
        this.searchChange()
	}
	
	showBrandChoose(){
		this.setState({
			showChooseBrand: true
		})
	}

	render() {
		let _partDetailObj = this.state.partDetailObj
		let _partDetailDate = this.state.partDetailDate
		let backIsShow = this.state.backIsShow
		let submitClick = this.submitClick.bind(this)
		let showFloatWindow = this.state.showFloatWindow
		let partdetail = this.state.partdetail
		let _isLeftContainerShow = this.state.leftContainerShow ? "block" : "none"
		let _loadingShow = this.state.loadingShow
		let _bodyShow = this.state.toggleIsShow[0] ? "flex" : "none"
		let _resultShow = this.state.isShowList ? "none" : "flex"
		let _listShow = this.state.isShowList ? "flex" : "none"
		let _groupShow = this.state.toggleIsShow[1] ? "flex" : "none"
		let _showChooseBrand = this.state.showChooseBrand ? "" : "hidden"
		// console.log(this.state.partlist)
		let partlist = this.state.partlist ? <PartList
					partCode={this.partCode}
					type = "part"
                    brand = {this.partBrand}
                    toDetail = {this.toDetail.bind(this)}
                    data = {this.state.partlstdata}
                    isShow = {this.state.isShowList}
					image = {this.image}
					showBrandChoose = {this.showBrandChoose.bind(this)}
                /> : <div/>
		
		let _groupDetail = this.state.groupDetail ? (
			<Result
				title = {this.state.partResultTitle}
				params = {this.state.partResultParams}
				brandurl = {this.state.brandurl}
				type = "part"
				brands = {this.state.partResultParams.code}
				subSearchShow = {this.subSearchShow.bind(this)}
				/>
		) : <div/>
		let _leftColor = this.state.canBack ? "#F9F9F9" : "rgba(51,51,51,0.20)"
        let _rightColor = this.state.canNext ? "#F9F9F9" : "rgba(51,51,51,0.20)"
        let _errorShow = this.state.errorShow ? "block" : "none"		
		if (this.neverShowed()) return <div></div>
		return (
			<div className={'part ' + this.containerClass()}>
				<div className="container-inquire-part">
					<div className="title-container">
						<div className="btn-include">
							<div className="btn-left" onClick={this.goStep.bind(this,-1)} style={{backgroundColor:_leftColor}}></div>
							<div className="btn-right" onClick={this.goStep.bind(this,1)} style={{backgroundColor:_rightColor}}></div>
						</div>
						<div className="title-include">
							{TR("零件号查询")}：
						</div>
					</div>
					<div className="container-body">
						<div className="container-lf-body" style={{display:_isLeftContainerShow}}>
							<Right submitClick={submitClick}
								chooseBrandArray = {this.state.chooseBrandArray}
								rehisotry = {this.rehisotry.bind(this)}
								toggleShow = {this.toggleShowBrands.bind(this)}
							/>
						</div>
						<FloatWindow
							title={TR("选择品牌")}
							img="/img/icon_san.png"
							top="137px"
							left="calc(50% - 314px)"
							width="628px"
							height="268px"
							hiddenEvent={() => {this.setState({showFloatWindow: false})}}
							show={showFloatWindow ? "block" : "none"}
							content={this.modal()}/>
						<div className="container-right" style={{display:_bodyShow}}>
							<div className={"choose-brand-container " + _showChooseBrand}>
								{/* <div className="container-title"> */}
									{/* 选择品牌（共{this.state.supportBrandTotal}个）：{this.state.chooseBrandArray ? this.state.chooseBrandArray.brandName : "全部品牌"} */}
									{/* <div className='search'>
										<input ref='search' className='input'
											placeholder='输入品牌'
											onChange={this.searchChange.bind(this)} />
										<div className={this.state.clearshow ? 'clear' : 'clear hidden'}
											onClick={this.clearshow.bind(this)}>
										</div>
										<div className = "input-search-error" style={{display:_errorShow}}>
											未搜索到相关结果
										</div>
										<div className='img'></div>
									</div> */}
								{/* </div> */}
								<div className="choose-container">
									<div className="choose-title">
										<div className={this.state.selectedIndex == -1 ? "title-item selected" : "title-item"} onClick={this.chooseBrandTitle.bind(this,"",-1)}>
											{TR("全部")}
										</div>
										{this.data ? this.getTitle() : null}
										<span className="canvas-cart">
											
										</span>
									</div>
									<div className="choose-body">
										<div className="choose-item">
										{
											window.lge === 'en' 
											?	<div className="en-title-nearly">
													Recent list
												</div>
											:	<div className="title-nearly">
													最 <br/>
													近 <br/>
													使 <br/>
													用 <br/>
												</div>
										}
											
											<div className="brand-list-body">

												{/* <div className="brand-img-item" title="输入完整零件号查询">
													<span>全部品牌</span>
												</div> */}

												{
													// this.state.historyBrandList ? this.getBrandHistory() : null
												}
												{
													// let it = this.state.chooseBrandArray
												}
												{
												this.state.chooseBrandArray ? 
													<div className="brand-img-item selected" title={"支持"+ this.state.chooseBrandArray.shot_pid_length +"位零件号查询"} onClick={this.choosedBrand.bind(this,this.state.chooseBrandArray)}>
														{
															this.state.chooseBrandArray.src ? <img alt={this.state.chooseBrandArray.brandName + "配件查询"} src={"https://cdns.007vin.com"+this.state.chooseBrandArray.src}/> : null
														}
														<span>
															{this.state.chooseBrandArray.brandName}
														</span>
														{
															this.state.baseChooseBrand === this.state.chooseBrandArray.brand
															? <div className="choosed">{TR("默认查询品牌")}</div>
															: <div className="un-choosed" onClick={e=>{this._setBaseBrand(e, this.state.chooseBrandArray.brand)}}>{TR("设为默认")}</div>
														}
													</div>  : 
													// <div className="brand-img-item selected" title="支持完整零件号查询" onClick={this.choosedBrand.bind(this,this.state.chooseBrandArray)}>
													// 	<span>
													// 		全部品牌
													// 	</span>
													// </div>
													this.getBrandHistory()
												}
											</div>
										</div>
										{this.data ? this.getBrandList() : null}
									</div>
								</div>
							</div>
							<div style={{display:backIsShow}} className="left-background" src={this.cdnHost+"img/img_logo2.png"}/>
							{/*<PartDetail obj={_partDetailObj} date={_partDetailDate} />*/}
							<div className="part-list-main-box" style={{display:_listShow}}>
								{partlist}
							</div>
							<div style={{display:_loadingShow}} className="no-loading"></div>
							<div className="container-result" style={{display:_resultShow}}>
								{this.state.cardSelectorShow ?
									<CardSelector 
										titles={this.state.titles}
										hidden={this.hiddenCardSelector.bind(this)}
										listHead={this.state.listHead}
										brand = {this.state.brand}
										res = {this.state.res}
										part = {this.state.part}
										toresult = {this.toresult.bind(this)}
										chooseTitle = {this.state.chooseTitle}
										isSpecial = {true}
									/> : <div/>}
							</div>
						</div>
					</div>
					
					<div className="group-result" id="part" style={{display:_groupShow}}>
						{_groupDetail}
					</div>
				</div>
			</div>
		)
	}
}


class Right extends Root {

	constructor() {
		super()
		this.state = {
			historyData: [],
			value: "",
			clearShow: false // 显示情况按钮
		}
		window.textareaSubmit = this.inquireClick.bind(this)
	}
	historyClick(partCode, brand) {
		// this.props.historyClick(partCode)
		this.setState({
			value: partCode,
			clearShow: true
		})
		this.props.submitClick(partCode, brand)
	}

	componentDidMount() {
		this.refreshHistory()
		if (Utils.params().replacecode || Utils.params().part) {
			this.setState({
				value: Utils.params().replacecode || Utils.params().part
			})
		}
		this.props.rehisotry(() => {
			this.refreshHistory()
		})
	}

	refreshHistory() {
		Model.historyData(res => {
			this.setState({
				historyData: res.data
			})
		})
	}

	inputChange(e) {
		// let value = e.target.value.replace(/[^\d\r\n]/g, "")
		let value = e.target.value.replace(/[^\w\n]/g,'')
		let _length = value.length
		let _state = {value: value.toLocaleUpperCase()}
		if(_length < 1) _state.clearShow = false
		else _state.clearShow = true
		this.setState(_state)
	}

	inquireClick() {
		let value = this.refs.textarea.value.replace(/[\r\n]/, ",")
		if(value){
			this.props.submitClick(value)			
		}
	}

	clear() {
		this.setState({clearShow: false, value: ''})
	}

	render() {
		let inputChange = this.inputChange.bind(this)
		let inquireClick = this.inquireClick.bind(this)
		let histories = this.state.historyData.map((item, index) => {
			if (index < 4) {
				return (<div className="history-item" key={index} onClick={this.historyClick.bind(this,item[0],item[2])}>
                            <div className="history-item-code">{item[0]}</div>
                            <div className="history-item-brand">{item[1]}</div>
                        </div>)
			}
		})
		let value = this.state.value
		let _brandsArray = false
		if(this.props.chooseBrandArray){
			if(this.props.chooseBrandArray.src){
				_brandsArray = this.props.chooseBrandArray
			}
		}

		return (
			<div className="container-left">
				<div className="container-left-main">
					<div className="choose-brand-button" onClick={this.props.toggleShow.bind(this)}>
						{this.props.chooseBrandArray ? this.props.chooseBrandArray.brandName : "全部品牌"}
					</div>
					<textarea className="textarea"
							ref="textarea"
							placeholder={ _brandsArray ?("输入"+ _brandsArray.brandName + _brandsArray.shot_pid_length + "位或者完整零件号" + (window.engCodeBrand(_brandsArray.brand) ? "/工程编号" : "")) : TR("输入完整零件号")}
							value={value}
							onChange={inputChange}/>		
					<div className={this.state.clearShow ? 'clear' : 'clear hidden'}
						onClick={this.clear.bind(this)}></div>
					<input className="inquire"
						type="button"
						defaultValue={TR("查询")}
						onClick={inquireClick}/>
					<span className="part-search-loading">

					</span>
					{
						window.lge === "en" 
						?   <div className="remind">
								*Tips：<br/>
								1.Only support single brand parts query；<br/>
								2.Mutiple OE numbers query needs to enter OE number in mutiple rows；<br/>
								3.Supports up to 5 OE numbers at the same time.<br/>
							</div>
						:	<div className="remind">
								*说明：<br/>
								1.仅支持<span>同一品牌</span>的零件查询；<br/>
								2. 查询多个零件需要换行；<br/>
								3.最多支持5个零件号同时查询。<br/>
							</div>
					}
					
					<div className="container-histories">
						<div className="histories-all" onClick={()=>{location.href="/histroy/parts?brand=all"}}>
							    {/* <img src={this.cdnHost+"/img/icon_recentlyhistory.png"} alt="所有历史记录"/>     */}
							<span className="history-icon"></span>
							{TR("更多历史")}
						</div>
						{histories}
					</div>
				</div>
            </div>
		)
	}
}

class Model {
	static historyData(callback) {
		let url = "/search/parts"
		let obj = ""
		Utils.get(url, obj, res => {
			callback(res)
		})
	}

	static groupdate(obj, callback) {
		let url = "/ppypart/group"
		Utils.get(url, obj, res => {
			callback(res)
		})
	}

	static submit(obj, callback) {
		let url = "/parts/engine_search"
		
		if(obj.brand == ""){
			url = "/parts/search"
		}else{
			obj.code = obj.brand
		}

		Utils.showDom(".part-search-loading")
		Utils.post(url, obj, res => {
			callback(res),
				Utils.hideDom(".part-search-loading")
		}, true)
	}

	static listHead(obj, callback) {
		let url = "/ppys/partssearchs"
		Utils.get(url, obj, res => {
			callback(res)
		}, true)
	}

	static partDetailDate(obj, callback) {
		let url = "/parts/search"
		Utils.get(url, obj, res => {
			callback(res)
		})
	}

	static info(auth, code, p, callback) {
		Utils.get('/ppypart/heads', {
			auth,
			code,
			p
		}, res => callback(res))
	}

	static brandList(callback){
		Utils.get("/brandselector",null,res=>{
			callback(res)
		})
	}
	static historyBrand(callback){
		Utils.get("/histroy/brands?_b=part",null,res=>{
			callback(res)
		})
	}

	static Brandsdict(callback){
		Utils.get("/brandsdict",null,res=>{
			callback(res)
		})
	}
}
