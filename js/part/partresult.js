import React from 'react'
import Root from '../root'
import Utils from '../utils'
import ShowImageView from "../vin/show_image_view"
import PartList from '../vin/part_list'
export default class Result extends Root {
    constructor(props){
        super(props)
        this.state = {
            showEdit: false, //是否显示编辑            
        }
    }

    componentWillMount(props){

    }

    back(){
        // this.props.
        this.props.subSearchShow()
    }

    toggleEdit() {
        this.setState({showEdit: !this.state.showEdit})
    }

    render(){
        return(
            <div className="container-result">
                <div className='container-header'>
                    <div className='title'>
                        <img src={this.props.brandurl}/>
                        <span>
                            {this.props.title}
                        </span>
                    </div>
                    <div className='navigator'>
                        <div className='content'>
                            <div className='backs'>
                                <div className="btn-left" onClick={this.back.bind(this)} title='返回上一步'>
                                    <span>上一步</span>
                                </div>
                                <div className="btn-right death" title='返回上一步'>
                                    <span>下一步</span>
                                </div>
                            </div>
                            <div className='search'>
                                <a className='container-edit' title='编辑零件别名'
                                    onClick={this.toggleEdit.bind(this)}>
                                    <div className='img'></div>
                                    <span>编辑</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-content'>
                    <Part 
                        {...this.props}
                        showEdit={this.state.showEdit}
                        toggleEdit = {this.toggleEdit.bind(this)}
                    />
                </div>
                <Remind/>
            </div>
        )
    }
}

class Remind extends Root {
    render() {
        // let _defaultdisplay = (this.props.type == "part") ||(this.props.type == "cars")? "none" : "flex"
        return (
            <div className='container-remind'>
                <span>＊以上信息仅供参考！</span>
                {/* {window.isXA ? <span>＊以上信息仅供参考</span> : <span>＊以上信息由零零汽提供，仅供参考</span>} */}
            </div>
        )
    }
}


class Part extends Root {
    constructor(props) {
        super(props)
        this.state = {
            itid: -1, //控制两侧的 itid
            imgRes: null, //图片请求返回数据
            listRes: null, //列表请求返回数据
            listResExt: {}
        }
        this.subGroup = null //记录目前所拥有分组，避免多次请求
        // this.filterStatus = props.filterStatus //当前 filter 状态，用户处理更新
    }

    componentWillMount(){
        this.imageAndList()
    }

    imageAndList() {
        Model.img(this.props.params, res => this.setState({imgRes: res}))
        this.setState({listRes: []}, () => {
            Model.listPart(this.props.params,res => {
                this.setState({listRes:res, itid: -1},()=>{
                    // console.log(this.props.params)
                    Model.getListMore(this.props.params.code,res.pid_list,response=>{
                        let partsData = response.data
                        res.data.map((item,index)=>{
                            item.map((it,ins)=>{
                                if(partsData[it.real_pid]){
                                    it.specialkey = partsData[it.real_pid]
                                }else{
                                    it.specialkey = "notFind"
                                }
                            })
                        })
                        this.setState({
                            listRes: res
                        })
                    })
                   
                    Model.getListIcon(res.pid_list, response=> {
                        let partsData = response.data
                        res.data.map((item,index)=> {
                            item.map((it,ins)=> {
                                if(partsData[it.real_pid]){
                                    it.ugc = "hasMsg"
                                }else{
                                    it.ugc = "noMsg"
                                }
                            })
                        })
                        this.setState({
                            listRes: res
                        })
                    })
                })
                if(res.itid){
                    this.changeItid(res.itid,"positionclick",this.props.params.p)
                }
            })
        })
    }

    changeItid(itid,type,choosepid) {
        listClickType = type == "positionclick" ? true :false
        listWhichClick = choosepid
        this.setState({itid: itid})
    }

    render() {
        let _itid = this.state.itid
        let _changeItid = this.changeItid.bind(this)
        return (
            <div className='container-image-list'>
                <ShowImageView
                    type={this.props.type}
                    itid={_itid}
                    res={this.state.imgRes}
                    partListRes={this.state.listRes}
                    changeItid={_changeItid} />
                <PartList
                    {...this.props}
                    type = "part"
                    itid={_itid}
                    listResExt = {this.state.listResExt}
                    res={this.state.listRes}
                    changeItid={_changeItid}
                    brands={this.props.brands}
                    showEdit={this.props.showEdit}
                    toggleEdit={this.props.toggleEdit}/>
            </div>
        )
    }
}

class Model {
    static listPart(obj, callback){
        Utils.showDom('.list-foot-loading')
        Utils.get("/ppypart/parts",obj,res => {
            Utils.hideDom(".list-foot-loading")
            callback(res)
        })
    }
    static img(obj,callback) {
        Utils.get('ppycars/subimgs', obj, res => callback(res))
    }

    static getListMore(brand,pids,callback){
        if(!pids) return;
        Utils.get("/ppys/partsmultiext",{brand,pids},res=>{
            callback(res)
        })
    }

    static getListIcon(pids, callback) {
        if(!pids) return;
        Utils.post("ugc/parts/reply/parts_available",{pids: pids},res=> {
            callback(res)
        })
    }
}