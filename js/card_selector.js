import React, {
	Component
} from 'react'
import PartDetail from './part/partdetail'
import PartDetailEng from './part/partdetaileng'
export default class CardSelector extends Component {
	constructor(props) {
		super(props)
		// console.log(props.titles)
		this.state = {
			selectedTitle: props.titles[0]
		}
	}

	update(brands, pid) {
		// console.log('update')
	}

	getClassName() {
		return this.props.isSpecial ? "special-container-card-selector" : "container-card-selector"
	}

	selected(title) {
		this.setState({
			selectedTitle: title
		})
	}

	componentDidMount() {
		if(this.props.chooseTitle === 'searchPart') {
			this.setState({
				selectedTitle: this.props.titles[0]
			})
		}else {
			this.setState({
				selectedTitle: this.props.chooseTitle
			})
		}
	}

	hidden() {
		this.props.hidden()
	}

	render() {
		let _selectedTitle = this.state.selectedTitle
		return (
			<div className={this.getClassName()}
                onClick={this.hidden.bind(this)}>
				<div className='card-selector'
					onClick={e => e.stopPropagation()}>
					<div className="PriceLoadingShow"></div>
					<div className={this.props.isSpecial ? "hidden" : "bluePartTitle"}>
						零件详情
						<div className="close" onClick={this.hidden.bind(this)}></div>
					</div>
					<Header
						hidden={this.hidden.bind(this)}
						titles={this.props.titles}
						selected={this.selected.bind(this)}
						selectedTitle={_selectedTitle}/>
					<Content
						{...this.props}
						toresult = {this.props.toresult.bind(this)}
						title={_selectedTitle}/>
				</div>
            </div>
		)
	}
}

class Header extends Component {
	getCards() {
		let _titles = this.props.titles
		if (_titles && _titles.length > 0) return (
			_titles.map((item, index) => {
				let _className = 'card'
				// console.log(item === this.props.selectedTitle)
				// console.log(item)
				// console.log(this.props.selectedTitle)
				if (item === this.props.selectedTitle) _className += ' card-selected'
				return (
					<div key={index} className={_className}
                        onClick={() => this.props.selected(item)}>
                        {item}
                    </div>
				)
			})
		)
	}

	render() {
		return (
			<div className='container-header partListCanMove'>
                {this.getCards()}
				<span className="closeFloat" onClick={this.props.hidden.bind(this)}>
				</span>
            </div>
		)
	}
}

class Content extends Component {
	constructor(props) {
		super(props)
	}

	toresult(url,title) {
		this.props.toresult(url,title)
	}


	tohide(){

	}


	render() {
		return (
			<div className='container-content'>
				{
					this.props.specialEng ?
					<PartDetailEng
						reqData = {this.props.reqData}
						title = {this.props.title}
						partOeData = {this.props.partOeData}
						partCarData = {this.props.partCarData}
						partImgData = {this.props.partImgData}
						detailPid = {this.props.detailPid}
						detailSrc = {this.props.detailSrc}
						detailLabel = {this.props.detailLabel}
						partBaseData = {this.props.partBaseData}
					/>
					:
					<PartDetail
						toresult={this.toresult.bind(this)}
						date={this.props.res}
						obj={{"brand":this.props.brand,"part":this.props.part,"length":1}}
						changePage=""
						tohide={this.tohide.bind(this)}
						title ={this.props.title}
						type = {"search"}
						haveDetail = {this.props.isSpecial}
					/>
				}
            </div>
		)
	}
}