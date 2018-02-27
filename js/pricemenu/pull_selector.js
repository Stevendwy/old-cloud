import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class PullSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: props.value
        }
    }

    componentWillReceiveProps(props) {
        this.setState({selected: props.value})
    }

    itemClick(item) {
        this.setState({selected: item}, () => this.props.setItem(item))
    }

    getItems() {
        let _items = this.props.items
        if(_items) return (
            _items.map((item, index) => {
                return (
                    <div key={index} className='pull-selector-item'
                        onClick={this.itemClick.bind(this, item)}>
                        {item}
                    </div>
                )
            })
        )
    }

    render() {

        return (
            <div className='pull-selector'>
                <span>{this.state.selected}</span>
                <div className='pull-selector-items'>
                    {this.getItems()}
                </div>
            </div>
        )
    }
}

PullSelector.propTypes = {
    items: PropTypes.array.isRequired,
    setItem: PropTypes.func.isRequired
}
