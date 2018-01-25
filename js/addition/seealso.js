import React from 'react'
import Root from '../root'
import Utils from '../utils'
import ShowImageView from "../vin/show_image_view"
import PartList from '../vin/part_list'
export default class Seealso extends Root {
    constructor(props){
        super(props)
        this.state = {
            showEdit: false, //是否显示编辑 
            title:"",        //显示头部信息          
        }
    }

    componentWillMount(props){

    }

    back(){
        // this.props.
        this.props.hideSeealso()
    }

    toggleEdit() {
        this.setState({showEdit: !this.state.showEdit})
    }

    changeTitle(title){
        this.setState({
            title: title || ""
        })
    }

    render(){
        return(
            <div id="seealso">
                <div className="container-result">
                    <div className='container-header' onClick={this.back.bind(this)}>
                        {/*
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
                        */}
                        <div className="title-main-bar">
                            {this.state.title + "   " + this.props.params.title }
                            <div className="close"></div>
                        </div>
                    </div>
                    <div className='container-content'>
                        <Part 
                            {...this.props}
                            showEdit={this.state.showEdit}
                            toggleEdit = {this.toggleEdit.bind(this)}
                            changeTitle = {this.changeTitle.bind(this)}
                        />
                    </div>
                    <Remind/>
                </div>
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
        Model.img(this.props.params, res => {
                if (res.code == 2) {
                    this.props.noneSeealso()
                    return
                }
                this.setState({imgRes: res})           
        })
        this.setState({listRes: []}, () => {
            let _type = this.props.params.type
            Model.listPart(this.props.params,_type , res => {
                if (res.code == 2) {
                    this.props.noneSeealso()
                    return
                }
                this.props.changeTitle(res.subgroupname)
                this.setState({listRes:res, itid: -1},()=>{
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
                    Model.getListIcon(res.pid_list,response=>{
                        let partsData = response.data
                        res.data.map((item,index)=>{
                            item.map((it,ins)=>{
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
                if(this.props.params.itid != ""){
                    this.changeItid(this.props.params.itid,"imgclick", -2)
                }
                // if(res.itid){
                //     this.changeItid(res.itid,"positionclick",this.props.params.p)
                // }
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
                    type="seealso"
                    itid={_itid}
                    res={this.state.imgRes}
                    partListRes={this.state.listRes}
                    changeItid={_changeItid} />
                <PartList
                    {...this.props}
                    type = "seealso"
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
    static listPart(obj, _type ,callback){
        Utils.showDom('.list-foot-loading')
        let _urls = "/ppycars/parts"
            if (_type == "vin") {
                _urls = "/ppyvin/parts"
            }
            // else if (_type == "cars") {
            //     _urls = "/ppycars/parts"
            // }else{
            //     _urls = "/ppypart/parts"
            // }
        Utils.get(_urls,obj,res => {
            Utils.hideDom(".list-foot-loading")
            callback(res)
        },true)
    }
    static img(obj,callback) {
        Utils.get('ppycars/subimgs', obj, res => {callback(res)},true)
    }

    static getListMore(brand,pids,callback){
        // if(pids == "") return;
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