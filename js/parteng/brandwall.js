import React, {
    Component
} from 'react'
import Utils from '../utils'
export default class BrandWall extends Component {
    constructor(props) {
        super(props)
        this.state = {
            brandList: [],
            titlelist: ["全部", "#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
                        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
            chooseType: "",
            hasMore: false,
            page: 1
        }
        this.type = 'all'
    }
    
    componentWillMount() {
        this.getData(1)
    }
    
    componentDidMount() {
        let _self = this
        window.onscroll = function (e) {
            // 当页面的滚动条滚动时,会执行这里的代码
            let top = $(document).scrollTop()
            if(top > 128) {
                $(_self.fixedTitle).addClass("fixed-title")
            } else {
                $(_self.fixedTitle).removeClass("fixed-title")
            }
        }
    }

    componentWillUnmount() {
        window.onscroll = null
    }

    getData(index) {
        let _obj = {
            page: index,
            acronym: this.state.chooseType,
            size: 60
        }
        Utils.get("/articles/brands", _obj, res=> {
            this.setState({
                brandList: index === 1 ? res.data : this.state.brandList.concat(res.data),
                hasMore: res.has_next,
                page: res.page
            })
        })
    }

    chooseItem(item) {
        this.props.chooseItem(item)
    }

    getList() {
        return(
            this.state.brandList.map((item,index)=> {
                return(
                    <div className="brand-cell"  title={item.supplier} onClick={this.chooseItem.bind(this,item.supplier_matchcode)} key={index}>
                        <div className="cell-box">
                            <img src={item.supplier_url} alt={item.brand}/>
                        </div>
                        <div className="cell-text">
                            <span className="cell-hover">{item.supplier}</span>
                        </div>
                    </div>
                )
            })
        )
    }

    chooseedType(type) {
        this.setState({
            chooseType: type == "全部" ? "" : type
        },()=>{
            this.getData(1)
        })
    }

    getTitle() {
        return(
            this.state.titlelist.map((item,index)=> {
                let _item = item
                if(_item == "全部") {
                    _item = ""
                }
                let _items = _item ? _item : TR("全部")
                let _className = this.state.chooseType === _item ? "title-item selected" : "title-item"
                return(
                    <div className={_className} key={index} onClick={this.chooseedType.bind(this,item)}>
                        {_items}
                    </div>
                )
            })
        )
    }

    loadMore() {
        this.getData(++this.state.page)
    }
    render() {
        return(
            <div className="brand-wall">
                <div className="brand-title" ref={(ref)=>{this.fixedTitle = ref}}>
                    <div className="choose-title">
                        {this.getTitle()}
                    </div>
                </div>
                <div className="wall-container">
                    {this.getList()}
                </div>
                <div className={this.state.hasMore ? "load-more" : "load-more hidden"}>
                    <span onClick={this.loadMore.bind(this)}>{TR("加载更多")}</span>
                </div>
            </div>
        )
    }
}