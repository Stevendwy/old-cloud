import React from 'react'
import Root from './root'
import Utils from './utils'
import { Prompt } from "dialog-react"
export default class ShoppingCart extends Root{
    
    constructor(){
        super()
        this.state = {
            shopShow: false,
            title: "",
            total_type: "",
            total_quantity: "",
            data: [],
            showDialog: false
        }
        window.showShoppingCart = this.showShopping.bind(this)
        window.hiddenCartClear = this.hiddenCartClear.bind(this)
        window.reFrashCart = this.baseData.bind(this)
        this.title = ['序号','名称','零件号','清空']
        this.listKey = ["num","pname","pid",""]
    }

    componentWillUnmount(){
        window.showShoppingCart = null;
        window.hiddenCartClear = null;
        window.reFrashCart = null;
    }
    

    componentDidMount(){
        Model.listCart(res=>{
            // console.log(res.data.length)
            if(res.data.length){
                Utils.showDom(".cret_icon")
                Utils.setValue(".cret_icon",res.data.length)  
                Utils.hideDom(".shopping-clear")      
            }
            this.setState({
                title: res.title,
                total_type: res.total_type,
                total_quantity: res.total_quantity,
                data: res.data
            })
        })
    }

    hideen(){
        this.setState({
            shopShow: false            
        })
    }
    showShopping(){
        this.setState({
            shopShow: !this.state.shopShow
            
        })
        this.baseData()
    }

    hiddenCartClear(){
        this.setState({
            shopShow: false
        })
        this.clearAllSure()
    }

    baseData(){
        if(this.state.shopShow){
            Model.listCart(res=>{
                if(res.data.length){
                    Utils.hideDom(".shopping-clear")                      
                }else{
                    Utils.showDom(".shopping-clear",true)                                      
                }
                this.setState({
                    title: res.title,
                    total_type: res.total_type,
                    total_quantity: res.total_quantity,
                    data: res.data
                })
            })
        }
    }

    clearAll(){
        this.setState({
            showDialog: true
        })
    }

    clearAllSure(){
        Model.clearAll(res=>{
            Utils.hideDom(".cret_icon")
            Utils.setValue(".cret_icon",0)                    
            this.baseData()
        })
    }

    certCount(){
        let count = parseInt(Utils.getValue(".cret_icon"))
        if(count == 1){
            Utils.hideDom(".cret_icon")
            Utils.setValue(".cret_icon",--count)                    
        }else{
            Utils.setValue(".cret_icon",--count)        
        }
    }

    deleteShops(pid_u,index){
        Model.deleteCart(pid_u,"bmw",res=>{
            this.certCount()
            // this.state.data.splice(index,1)
            // this.setState({
            //     data: this.state.data
            // },()=>{
            this.baseData()
            // })
        })
    }

    getPriceMenu(){
        this.props.getPriceMenuList()
    }

    cobyPart(code, e) {
        let oDiv = document.createElement('textarea');
        oDiv.value = code;
        oDiv.innerHTML = code;
        document.body.appendChild(oDiv)
        oDiv.select();
        document.execCommand("Copy")
        document.body.removeChild(oDiv)
        e.stopPropagation()
    }

    render(){
        let isHidden = this.state.shopShow ? "" : "hidden" 
        let _title = this.state.title
        let _cobyPart = this.cobyPart.bind(this)

        return(
            <div className={"shopping-cart " + isHidden}>
                <div className="shopping-title">
                    购物车（共{this.state.total_type}种，共{this.state.total_quantity}件）
                    <span className="close" onClick={this.hideen.bind(this)}></span>
                </div>
                <div className="shopping-list">
                    <div className="list-title">
                        <div>
                            {_title}
                        </div>
                        <span onClick={this.clearAll.bind(this)}>清空</span>
                    </div>
                    <div className="list-body">
                        {
                            this.state.data.map((item,index)=>{
                                return(
                                    <div className="list-row" key={index}>
                                    {
                                        this.listKey.map((it,ins)=>{
                                            let _content = item[it]
                                            if(ins == 1){
                                                _content = _content.replace(/\<br\/\>/g,"  ")
                                            }
                                            if(ins == 3){
                                                _content = <img onClick={this.deleteShops.bind(this,item.pid_u,index)} src="/img/icon_close.png"/>
                                            }
                                            if(ins == 2){
                                                _content = <div className="list-item-partcode">{item[it]}
                                                                <span className="coby-icon" title="复制" onClick={e => _cobyPart(item[it], e)}>
                                                                    <span className="cody-success">
                                                                        复制成功
                                                                    </span>
                                                                </span>
                                                            </div>
                                            }
                                            return(
                                                <div className="list-cell-item" key={ins}>
                                                    {_content}
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="shopping-footer">
                    <span className="button" onClick={this.getPriceMenu.bind(this)}>报价</span>
                </div>
                <div className="shopping-clear">
                    <img src="/img/p_null.png"/>
                    <a className="blue-button  history" href="/user/profile?binds=shopping">查看历史报价单</a>
                </div>
                <Prompt
                    content="确认清空购物车？"
                    confirm="确认"
                    other="取消"
                    show={this.state.showDialog}
                    fun={() =>{
                        this.clearAllSure()
                        this.setState({showDialog: false})}
                    }
                    close={() => this.setState({showDialog: false})}
                />
            </div>
        )
    }
}


class Model{
    static deleteCart(pid_u,brand,callback){
        Utils.post("/quotes/spcart/del",{pid_u,brand},res=>{
            callback(res)
        })
    }
    static listCart(callback){
        Utils.get("/quotes/spcart/list","",res=>{
            callback(res)
        })
    }
    static clearAll(callback){
        Utils.get("/quotes/spcart/clearall","",res=>{
            callback(res)
        })
    }
}