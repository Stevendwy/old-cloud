import React from 'react'
import Root from '../root'

export class CarInfo extends Root {
    constructor() {
        super()
        this.state = {
            carInfoSearchShow: false, // 是否显示
            errorShow: false, // 是否显示错误
            findIndex: -1
        }
    }

    carInfoSearchChange() {
        // console.log(this.refs.carInfoSearch.value)
        let _value = this.refs.carInfoSearch.value
        let _carInfos = this.props.carInfos
        let _isFind = false
        let _errorShow =  false
        let _findIndex = -1
        for(let i = 0, j = _carInfos.length; i < j; i ++) {
            if(_carInfos[i].toUpperCase().includes(_value.toUpperCase())) {
                this.refs.carInfoContent.scrollTop = 33 * i
                _isFind = true
                if(_value) {
                    _findIndex = i
                }
                break
            } else {
                _findIndex = -1
            }
        }
        if(!_isFind){
            _errorShow = true
            _findIndex = -1
        }else {
            _errorShow = false
        }
        if (_value.length > 0) {
            this.setState({
                carInfoSearchShow: true
            })
        }else {
            this.setState({
                carInfoSearchShow: false,
                findIndex: -1      
            })
            _errorShow = false
        }

        this.setState({
            errorShow: _errorShow,
            findIndex: _findIndex
        })
    }

    carInfoSearchClear(){
        let _searchPart = this.refs.carInfoSearch
        _searchPart.value = ''
        _searchPart.focus()
        this.setState({
                carInfoSearchShow: false,
                errorShow: false,
                findIndex: -1
        })
    }

    carInfos() {
        if(this.props.carInfos) return this.props.carInfos.map((item, index) => {
            let _split = ':'
            let _title = item.split(_split)[0] || ''
            let _content = item.split(_split)[1] || ''
            let selectedClass = ""
            if(index == this.state.findIndex) {
                selectedClass = "selected"
            }
            return (
                <div className={'container-info '+ selectedClass} key={index}>
                    <div className='title'>
                        {_title}
                    </div>
                    <div className='content'>
                        {_content}
                    </div>
                </div>
            )
        })
    }

    getClassName() {
        let baseClass = "container-car-info " + this.props.specialClass
        let _status = this.props.show ? '' : ' hidden'
        return baseClass + _status
    }

    render() {
        let _errorShow = this.state.errorShow ? "block" : "none"
        return (
            <div className={this.getClassName()} onClick={(e)=>{e.stopPropagation()}}>
                <div className='header'>
                    <div className='car-info-title-move'>
                        <span>车辆配置：</span>
                        <div className='close'
                            onClick={this.props.hiddenCarInfo}></div>
                    </div>
                    <div className='search'>
                        <input ref='carInfoSearch' className='input' placeholder='输入配置信息'
                            onChange={this.carInfoSearchChange.bind(this)} />
                        <div className = "input-search-error" style={{display:_errorShow}}>
                            未搜索到相关结果
                        </div>
                        <div className={this.state.carInfoSearchShow ? 'clear' : 'clear hidden'}
                            onClick={this.carInfoSearchClear.bind(this)}></div>
                        <div className='img'></div>
                    </div>
                </div>

                <div className='content' ref='carInfoContent'>
                    {this.carInfos()}
                </div>
            </div>
        )
    }
}

export class CarMI extends Root {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.mapKey = ["filter", "sa", "sa", "desc"]
    }
    
    componentWillReceiveProps(props) {
        // console.log(props.data)
    }

    getClassName() {
        let baseClass = "container-car-mi"
        // let _status = this.props.show ? '' : ' hidden'
        let _status = ""
        
        return baseClass + _status
    }

    getTitle() {
        this.props.data.title.unshift("")
        return(
            this.props.data.title.map((item, index)=> {
                return(
                    <div key={index}>
                        {item}
                    </div>
                )
            })
        )
        
    }

    getBody() {
        return (
            this.props.data.data.map((item, index)=> {
                return (
                    <div className="table-row" key={index}>
                        <div className="row-cell">
                            {  item.filter 
                               ? <b></b> 
                               : ""
                            }
                        </div>
                        <div className="row-cell">
                            {
                                item.available
                                ? item.sa
                                : ""
                            }
                        </div>
                        <div className="row-cell">
                            {
                                !item.available
                                ? item.sa
                                : ""
                            }
                        </div>
                        <div className="row-cell">
                            {
                                item.desc
                            }
                        </div>
                    </div>
                )
                
            })
        )
    }

    getTable() {
        let type = 1
        switch(this.props.data.flodlist) {
            case 2:
                return (
                    <div className="table">
                        <div className="table-head">
                            {this.getTitle()}
                        </div>
                        <div className="table-body">
                            {this.getBody()}
                        </div>                        
                    </div>
                )
                break;
            // case 2:
        }
    }

    render() {
        let _errorShow = this.state.errorShow ? "block" : "none"
        let _classHidden =  this.props.data.flodlist == 2 ? "" : "hidden"
        return (
            <div onClick={this.props.hiddenMI} className="mi-container">
                <div className={this.getClassName()} onClick={(e)=> {e.stopPropagation()}}>
                    <div className='header'>
                        <div className='car-info-title-move'>
                            <span>设备编号</span>
                            <div className='close'
                                onClick={this.props.hiddenMI}></div>
                        </div>
                    </div>
                    <div className='content' ref='carInfoContent'>
                        <div className="msg-text">
                            <div className={_classHidden}>
                                *有效（+）：编码与车辆配置信息匹配则零件对车辆有效；<br/>
                                &nbsp;无效（-）：编码与车辆配置信息匹配则零件对车辆无效；<br/>
                            </div>
                            <span>
                                <b></b>
                                ：编码与车辆配置信息匹配。
                            </span>
                        </div>
                        {
                            this.getTable()
                        }
                    </div>
                </div>
            </div>
            
        )
    }
}