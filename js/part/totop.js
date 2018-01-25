import React, {
	Component
} from 'react'
import Root from '../root'
export default class ToTop extends Root {
	constructor(props) {
		super(props)
		this.state = {
			isShow: true,
			clickIndex: -1
		}
		this.falg = -1
	}

	render() {
		return (
			<div className="FixedContainer" style={{display:this.props.isShow}}>				
				<a href="#top">
					<div className="ToTopItem">

					</div>
				</a>
			</div>

		)
	}

}