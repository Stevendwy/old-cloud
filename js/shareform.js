import React from "react"
import Root from './root'
import Utils from './utils'

export default class ShareForm extends Root{
    constructor(){
        super()
        this.state = {
            isShareShow: true,
            dataList: null
        }
        this.title = lge === "zh"
                     ? ["序号","零件名称","零件号","采购类型","数量","单价"]
                     : ["Index", "Name", "OE Number", "Purchase method", "Quantity", "Retail Price"]
        this.key = ["num","pname","pid","factory_type","quantity","price"]
        this.data = []
    }

    componentDidMount(){
        Model.getForm(this.props.uid,res=>{
            this.setState({
                dataList:res
            })
        })
    }

    coby(code) {
        let oDiv = document.createElement('textarea');
        oDiv.value = code;
        oDiv.innerHTML = code;
        document.body.appendChild(oDiv)
        oDiv.select();
        document.execCommand("Copy")
        document.body.removeChild(oDiv)
    }

    hidden(){
        this.props.hidden()
    }
    
    downLoad() {
        Utils.get("/quotation/excel_download", {uid: this.props.uid}, res=>{
            location.href = res.uri
        })
    }
    
    render(){
        let isHidden = this.state.isShareShow ? "" : " hidden" 
        let title,total_quantity,createtime,company,person,contact_tel,qr_img,url,total_type,total_money,remark 
        if(this.state.dataList){
            let data = this.state.dataList
            title = data.title
            total_quantity = data.total_quantity 
            company = data.contact.company
            person = data.contact.contact_person
            contact_tel = data.contact.contact_tel
            qr_img = data.qr_img
            url =  data.url
            total_money = data.total_money
            total_type = data.total_type
            remark = data.contact.remark
            createtime = data.createtime
        }
        return(
            <div className={"share-background-container"+isHidden} onClick={this.hidden.bind(this)}>
                <div className="share-container" onClick={(e)=>{e.stopPropagation()}}>
                    <div className="title">
                        <div className="title-form-move">报价单</div>
                        <span onClick={this.hidden.bind(this)}></span>
                    </div>
                    <div className="share-body-container">
                        <div className="share-main">
                            <div className="share-top-container">
                                <img src={qr_img}/>
                                <div className="share-detail-msg">
                                    <span>{TR("微信扫一扫分享报价单")}</span>
                                    <input value={url}/>
                                    <div className="button-container">
                                        <span className="button" title={TR("复制")} onClick={this.coby.bind(this,url)}>
                                            {TR("复制链接")}
                                            <span>{TR("复制成功")}</span>
                                        </span>
                                        <span className="button" title="导出Excel" onClick={this.downLoad.bind(this)}>
                                            {TR("导出Excel")}
                                        </span>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="share-msg-container">
                                <div>{title}</div>
                                <div>{TR("日期")}：{createtime}</div>
                            </div>
                            <div className="form-container">
                                <div className="form-title">
                                    {TR("配件报价表")}
                                </div>
                                <div className="form-title-row">
                                    {
                                        this.title.map((item,index)=>{
                                            return(
                                                <div className="form-title-cell" key={index}>
                                                    {item}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="from-body-container">
                                    {this.state.dataList ?  this.state.dataList.data.map((item,index)=>{
                                        return(
                                            <div className="from-body-row" key={index}>
                                                {
                                                    this.key.map((it,ins)=>{
                                                        let content = item[it]
                                                        
                                                        if(ins == 0){
                                                            content = index+1
                                                        }
                                                        if(ins == 1){
                                                            content = content.replace(/\<br\/\>/g,"  ")
                                                        }
                                                        return(
                                                            <div key={ins}>
                                                                {content}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }) : null }
                                </div>
                            </div>
                            <div className="detail-bottom">
                                    <div className="row-total">
                                        {/* 报价方资料 */}
                                        <div></div>
                                        <div>
                                            <span>
                                                {total_type}种，共{total_quantity}件
                                            </span>
                                            <span>
                                                {TR("合计")}：{total_money}
                                            </span>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        {TR("报价方资料")}
                                    </div>
                                    <div className="base-msg">
                                        {TR("公司名称")}：{company}
                                        <span>
                                            {TR("联系人")}：{person}
                                        </span>
                                        <span>
                                           {TR("联系电话")}：{contact_tel}
                                        </span>
                                    </div>
                                    <div>
                                        {TR("备注")}：{remark}
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
    
}
class Model{
    static getForm(uid,callback){
        Utils.get("/quotes/quotes/detail",{uid},res=>{
            callback(res)
        })
    }
}