import React, {Component} from 'react'
import Model from './show_image_view_model'

export default class ShowImageView extends Component {
	constructor() {
		super()
		this.state = {
			opacity:0,
			background: "url('https://cdns.007vin.com/img/mum.gif') no-repeat center center",
			areas: null,
			isWidescreen: false, //是否宽屏状态
			itid: '-1', //当前 itid
			partNotFind: false
		}

		this.narrowWidth = window.innerWidth * .378
		this.widescreenWidth = window.innerWidth * .618
		this.imgContainerSize = {
			width: this.narrowWidth, //图片容器宽度
			height: window.innerHeight - 168 //图片容器高度
		}
		this.scale = 1 //当前图片倍率
		this.scaling = 0.1 //缩放比例
		this.isMovingStatus = false //是否移动状态
		this.moveStartStatus = null //移动初始状态
		this.selfClick = false //itid 是否为自己点击修改的

		this.imgsrc = "" //存储img 比对
	}

	componentWillReceiveProps(props) {
		if (this.props.res) {
			if (this.imgsrc != props.res.data.imgurl) {
				this.setState({
					opacity:0
				})
			}
		}
		//清空再生成
		if(props.itid && this.state.itid != props.itid) this.setState({itid: '-1'}, () => this.setState({itid: props.itid}, () => {
      if(props.itid === -1) this.reset() // 切换分组才重置
    }))
	}

	areas() {
		this.setState({areas: Model.areas(this.props.res.data.mapdata, this.scale, this.areaClick.bind(this))})
	}

	areaClick(itid) {
		this.selfClick = true
		let isFind = false
		this.props.partListRes.data.map((item,index)=>{
			item.map((it,ins)=>{
				if(it.itid == itid){
					isFind = true
				}
			})
		})
		if(!isFind){
			this.setState({
				partNotFind: true
			},()=>{
				let timer = setTimeout(()=>{
					this.setState({
						partNotFind: false
					})
				},3000)
			})
		}else{
			this.setState({
				partNotFind: false
			})
		}
		this.setState({itid: itid}, this.props.changeItid(itid,"imgclick",-2))
	}

	enlarge() {
		Model.scaling(this.refs.img, this, true) //缩放
	}

	shrink() {
		Model.scaling(this.refs.img, this, false) //缩放
	}

	reset() {
		if(this.selfClick) {this.selfClick = false; return}
		this.imgInitialPosition() //设置初始图片状态
		// this.enlarge()
	}

	transform() {
		this.setState({isWidescreen: !this.state.isWidescreen}, () => {
			this.imgContainerSize.width = this.state.isWidescreen ? this.widescreenWidth : this.narrowWidth //比例计算问题
			this.imgInitialPosition()
		})
	}

	imgLoad(imgurls) {		
		this.imgsrc = imgurls
		this.imgInitialPosition() //设置初始图片状态
		this.setState({
			opacity:1
		})
	}

	setScale(scale) {
		this.scale = scale
	}

	imgError() {
		// console.log('imgError')
	}

	/**
	 * [imgInitialPosition img initial position]
	 */
	imgInitialPosition() {
		if(!this.refs.img) return
		Model.imgInitialPosition(this.refs.img, this.refs.img_box, this.imgContainerSize, this.setScale.bind(this))
		this.areas()

		//修正位置问题
		this.enlarge()
		this.shrink()
	}

	containerClassName() {
		return this.state.isWidescreen ? 'container-image widescreen' : 'container-image'
	}

	transformClassName() {
		return this.state.isWidescreen ? 'transform widescreen' : 'transform'
	}

 	mouse(e) {
		Model.mouse(this.refs.img_box, this, e)
	}

	marks(itid) {
		// console.log(this.scale)
		if(itid === '-1') return null
		let _PartNotFind = this.state.partNotFind ? "block" : "none"
		let _mapData = this.props.res.data.mapdata
		let _marks = _mapData.map((item, index) => {
			if(item[4] && (item[4] === itid)) return (
				<div key={index} className='mark' style={{
					left: `${item[0] * this.scale}px`,
					top: `${item[1] * this.scale}px`,
					width: `${(item[2] - item[0]) * this.scale}px`,
					height: `${(item[3] - item[1]) * this.scale}px`
				}}>
				<span className="mark-notfind" style={{display:_PartNotFind}}>
					零件不适用此车型
				</span>
				</div>
			)
		})

		return _marks
	}

	render() {
		if(!this.props.res) return null

		let _mouse = this.mouse.bind(this)
		let _background = this.state.background
		let _opacity = this.state.opacity
		let _imgUrl = this.props.res ? this.props.res.data.imgurl : '#'
		let _userMap = 'part_mark_' + this.props.type || 'vin'

		return (
			<div className={this.containerClassName()}>
				<div className='img-box' ref='img_box' style={{background:_background}}>
					<img ref='img' className='img' style={{opacity:_opacity}}
						src={_imgUrl} useMap={'#' + _userMap}
						onLoad={this.imgLoad.bind(this, _imgUrl)}
						onError={this.imgError.bind(this)}
						onMouseDown={_mouse}
						onMouseMove={_mouse}
						onMouseUp={_mouse}
					 	onMouseLeave={_mouse}/>
					<map name={_userMap} id={_userMap}>
						{this.state.areas}
					</map>
					{this.marks(this.state.itid)}
				</div>
				<div className='container-utils'>
					<a className='enlarge' onClick={this.enlarge.bind(this)}></a>
					<a className='shrink' onClick={this.shrink.bind(this)}></a>
					<a className='reset' onClick={this.reset.bind(this)}></a>
					<a className={this.transformClassName()} onClick={this.transform.bind(this)}></a>
				</div>
			</div>
		)
	}
}
