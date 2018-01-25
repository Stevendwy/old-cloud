import React from 'react'
import Root from '../root'
import SearchResultList from 'search-result-list-react'

export default class SearchError extends Root {
	constructor(props) {
		super(props)
	}

	reSearchClick() {
		this.props.reSearch()
	}

	toSearch(vins) {
		this.props.toSearch(vins)
	}

	reSearch(){
		this.props.reSearch()
	}

	resetClick(){
		this.props.resetClick()
	}

	itemClick(item){
		this.props.toSearch(item.vin)
	}

	tryCarSearch() {
		window.changeType("car")
	}

	render() {
		let _code = this.props.code
		// console.log(this.props.likenessVin)
		let _islike = this.props.likenessVin ? <span onClick={this.toSearch.bind(this,this.props.likenessVin)}>{TR("查询")}&gt;&gt;</span> : <div/>
		let _height = this.props.height
		let _continaer = <p  style={{display:"block"}}>
			<span style={{cursor:"pointer"}}  onClick={this.resetClick.bind(this)} >.{TR("重新输入")}&gt;&gt;</span>
			<br />
			<br />
			<span style={{cursor:"pointer"}}  onClick={this.tryCarSearch.bind(this)} >.{TR("尝试车型查询")}&gt;&gt;</span>
		</p>
		if (this.props.netError) {
			_continaer = <div>
					<p>{TR("建议您")}:</p>
					<p>
						<span style={{cursor:"pointer"}}  onClick={this.reSearch.bind(this,"")} >.{TR("重新查询")}&gt;&gt;</span>
					</p>
			</div>
		}

		return (
			<div className="bigSearchModal1" style={{display:this.props.serachIsShow,height:_height}}>
				{
					this.props.dataList 
					? 	<div className="vin-list-container">
							<div className="vin-list-title">
								<span>为您找到相关结果约{this.props.dataList.length}个</span>
								<span>*同类车型图片，仅供参考</span>
							</div>
							<SearchResultList
								data={this.props.dataList}
								itemClick={this.itemClick.bind(this)}/> 
						</div>
					:	<div className="errorMainText">
							<p
							dangerouslySetInnerHTML={{__html: _code}}/>
							{_islike}
							{_continaer}
						</div>
				}
			</div>
		)
	}
}
