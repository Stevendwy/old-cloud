import React, {
	Component
} from "react"
import Root from "../root"
export default class PartList extends Root {
	constructor(props) {
		super(props)
		this.state = {
			bodylist: <div />,
			closeIndex:[]
		}
		this.title = ['','零件号', '名称', '说明', " "]
		this.width = [3, 23, 51, 18, 8]
		this.closeIndex = []
	}
	
	toDetail(partCode, isnext, index) {
		if (isnext) {
			this.props.toDetail(partCode, index)
		}
	}

	closeItems(ins,flag,e){
		e.stopPropagation();
		let _listHidden = false
		if(flag == "-"){
			_listHidden = true
		}
		if(this.closeIndex[ins]){
			if(this.closeIndex[ins] == 1){
				// debugger;
				this.closeIndex[ins] = -1

			}else{
				this.closeIndex[ins] = 1
			}
		}else{
			this.closeIndex[ins] = 1			
		}
		
		this.setState({
			listHidden: _listHidden,
			closeIndex: this.closeIndex
		})
	}
	
	render() {
		// let bodylist = this.state.bodylist
		let isShow = this.props.isShow ? "block" : "none"
		let headlist = <div className="list-head">
			{
				this.title.map((item, index) => {
					return (
						<div className="listitem" key={index} style={{flex:this.width[index]}}>
							{item}
						</div>
					)
				})
			}
		</div>
		let _closeItems = this.closeItems.bind(this)
		let actIndex = 1
		let bodylist = <div className="list-body">{
			this.props.data.map((it, ins) => {
				return(
					<div className="list-items" key={ins}>
						{
							it.map((item,index)=>{
								let _isMsg = ""
								let _cobyindex = 0
								let _toSee = "查看"
								let _imgIcon = ""
								let _msgDetail = ""
								let _className = "listitems"
								let _isBuble = "listitem"
								if (item.has_replace == 1) {
									_isMsg = "R"
									_msgDetail = "含替换件"

								}
								if (item.has_compt == 1) {
									_isMsg = "S"
									_msgDetail = "含组件"
								}
								if (item.has_replace == 1 && item.has_compt == 1) {
									_isMsg = "R、S"
									_msgDetail = "含替换件、组件"
								}
								if (item.status == 0) {
									_toSee = ""
									_className = "listitems red"
									_cobyindex = --actIndex
								}
								_isMsg = ""
								if (_isMsg != "") {
									_isBuble = "listitem isBuble"
								}
								_cobyindex = actIndex++
								let _plusOrSub = ""
								if(it.length > 1 && index == 0){  //如果列表大于一行并且在第一行
									if(this.state.closeIndex[ins]){   //如果
										if(this.state.closeIndex[ins] == 1){
											_plusOrSub = "+"
										}else{
											_plusOrSub = "-"											
										}
										// _plusOrSub = this.state.listHidden ? "+" : "-"
									}else{
										_plusOrSub = "-"
									}
								}
								if(this.state.closeIndex[ins] == 1){
									if(index !== 0){
										_className += " hidden" 
									}
								}
								return (
										<div className={_className} key={index} style={{cursor: item.status?"pointer":"default"}} onClick={this.toDetail.bind(this,item.pid,item.status,_cobyindex)}>
											<div className="listitem" style={{flex:this.width[0]}} onClick={e=>{_closeItems(ins,_plusOrSub,e)}}>
												<div className="listitem-content">
													{_plusOrSub}
												</div>
											</div>
											<div className="listitem" style={{flex:this.width[1]}}>
												<div className="listitem-content">
													{item.pid.split(item.s_pid)[0]}
													<span>{item.pid.indexOf(item.s_pid) !== -1 ? item.s_pid : ""}</span>	
													{item.pid.split(item.s_pid)[1]}
												</div>
											</div>
											<div className="listitem" style={{flex:this.width[2]}}>
												<div className="listitem-content">
													{item.status ? item.label :( 
														<div>{item.label}
															<span onClick={this.props.showBrandChoose.bind(this)}> 
															.尝试选择品牌查询 >>
															</span>
														</div>)
													}
												</div>
											</div>
											<div className={_isBuble} style={{flex:this.width[3]}}>
											<div className="listitem-content" style={{coursor:_isMsg?"pointer":"default",textDecoration:"underline"}}>
													{_isMsg}
												</div>
												<div className="ControlBubble">
													<p>
														{_msgDetail}
													</p>
												</div>
											</div>
											<div className="listitem" style={{flex:this.width[4]}}>
											<div className="listitem-content toSee" style={{textDecoration:"underline"}}>
													{_toSee}
												</div>
											</div>
										</div>
								)
							})
						}
					</div>
				)	
			})
		}
		</div>
		let _brandImg = <div/>
		if (this.props.image != "") {
			_brandImg = <img className="brand-img" src={this.props.image} alt="品牌" />
		}
		return (
			<div className="container-list" style={{display:isShow}}>
				{/* <div className="brand-show">
					{_brandImg}
				</div> */}
				<div className="list-container">
					{headlist}
					{bodylist}
				</div>

			</div>
		)

	}


}