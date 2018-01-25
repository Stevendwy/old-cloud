var  lge = navigator.language.split('-')[0]

if(lge !== "zh" && lge=="en") {
    lge = "en"
}
lge = "zh"
function TR(item, text) {
    if(!lg[item]) {
        lg[item] = {
            en: "",
            zh: item
        }
    }
    if(text && lg[item][lge].indexOf("   ") !== -1) {
        return lg[item][lge].replace("   ",text)
    }else {
        return lg[item][lge]
    }
}

var lg = {
    首页: {
        en: "Home",
        zh: "首页"
    },
    车架号查询: {
        en: "VIN",
        zh: "车架号查询"
    },
    车型查询: {
        en: "Model",
        zh: "车型查询"
    },
    零件号查询: {
        en: "Part No",
        zh: "零件号查询"
    },
    品牌号查询: {
        en: "Article No",
        zh: "品牌号查询"
    },
    操作指引: {
        en: "help",
        zh: "操作指引"
    },
    个人中心: {
        en: "My Account",
        zh: "个人中心"
    },
    登录: {
        en: "Log In",
        zh: "登录"
    },
    注册: {
        en: "Sign up",
        zh: "注册"
    },
    手机号或邮箱: {
        en: "Phone or Email",
        zh: "手机号或邮箱"
    },
    密码: {
        en: "Password",
        zh: "密码"
    },
    记住密码: {
        en: "Remember me",
        zh: "记住密码"
    },
    忘记密码: {
        en: "Forgot password?",
        zh: "忘记密码"
    },
    没有账号: {
        en: "New to 007",
        zh: "没有账号"
    },
    立即注册: {
        en: "Sign up now",
        zh: "立即注册"
    },
    零零汽当前覆盖品牌: {
        en: "007 Current Covering Brand",
        zh: "零零汽当前覆盖品牌"
    },
    车型数据: {
        en: "Model Data",
        zh: "车型数据"
    },
    覆盖品牌: {
        en: "Support Brand",
        zh: "覆盖品牌"
    },
    零件数据: {
        en: "Parts Data",
        zh: "零件数据"
    },
    关于我们: {
        en: "About Us",
        zh: "关于我们"
    },
    用户协议: {
        en: "User agreement",
        zh: "用户协议"
    },
    数据合作: {
        en: "Cooperation",
        zh: "数据合作"
    },


    //vin页面



    全部品牌: {
        en: "All",
        zh: "全部品牌"
    },
    车架号查询: {
        en: "Search",
        zh: "车架号查询"
    },
    选择主组: {
        en: "Main group selection",
        zh: "选择主组"
    },
    选择分组: {
        en: "Secondary group selection",
        zh: "选择分组"
    },
    车辆配置: {
        en: "Vehicle configuration",
        zh: "车辆配置"
    },
    "同类车型图片, 仅供参考": {
        en: "Pictures of similar models,for reference only",
        zh: "同类车型图片, 仅供参考"
    },
    "输入零件原厂名/零件号": {
        en: "The part name/number",
        zh: "输入零件原厂名/零件号"
    },
    "输入零件号／故障码": {
        en: "The part number/number",
        zh: "输入零件号／故障码"
    },
    "输入零件号／工程编号": {
        en: "The part name/number",
        zh: "输入零件号／工程编号"
    },
    搜索结果: {
        en: "Search Result",
        zh: "搜索结果"
    },
    搜索: {
        en: "Search",
        zh: "搜索"
    },
    零件搜索: {
        en: "Part Search",
        zh: "零件搜索"
    },
    查询: {
        en: "Search",
        zh: "查询"
    },
    重新输入: {
        en: "Re-enter",
        zh: "重新输入"
    },
    零零汽为您找到: {
        en: "Find results for you ",
        zh: "零零汽为您找到"
    },
    相关结果: {
        en: "",
        zh: "相关结果"
    },
    建议您: {
        en: "suggest you",
        zh: "建议您"
    },
    重新查询: {
        en: "Re-query",
        zh: "重新查询"
    },
    输入17位VIN车架号: {
        en: "17 VIN number number input",
        zh: "输入17位VIN车架号"
    },
    "输入主组图号/名称": {
        en: "Try model inquiry",
        zh: "输入主组图号/名称"
    },
    上一步: {
        en: "Back",
        zh: "上一步"
    },
    下一步: {
        en: "Forward",
        zh: "下一步"
    },
    返回上一步: {
        en: "go back",
        zh: "返回上一步"
    },
    前往下一步: {
        en: "go forward",
        zh: "前往下一步"
    },
    分组: {
        en: "SG",
        zh: "分组"
    },
    返回分组选择: {
        en: "subgroup",
        zh: "返回分组选择"
    },
    配置: {
        en: "ID",
        zh: "配置"
    },
    车辆配置信息: {
        en: "Vehicle ID",
        zh: "车辆配置信息"
    },
    过滤: {
        en: "Filtered",
        zh: "过滤"
    },
    未过滤: {
        en: "Unfiltered",
        zh: "未过滤"
    },
    上一主组: {
        en: "Hot key",
        zh: "上一主组"
    },
    下一主组: {
        en: "Hot key",
        zh: "下一主组"
    },
    "上/下主组": {
        en: "MG",
        zh: "上/下主组"
    },
    "上/下分组": {
        en: "SG",
        zh: "上/下分组"
    },
    "上/下组": {
        en: "SG",
        zh: "上/下组"
    },
    上一分组: {
        en: "Hot Key",
        zh: "上一分组"
    },
    下一分组: {
        en: "Hot Key",
        zh: "下一分组"
    },
    无此零件: {
        en: "Not Find",
        zh: "无此零件"
    },
    编辑: {
        en: "Edit",
        zh: "编辑"
    },
    以上信息仅供参考: {
        en: "The above information is provided by 007vin, for reference only",
        zh: "以上信息仅供参考"
    },
    已到最后一主组: {
        en: "Has reached the last group",
        zh: "已到最后一主组"
    },
    已到最后一分组: {
        en: "Has reached the last group",
        zh: "已到最后一分组"
    },
    已到最后一组: {
        en: "Has reached the last group",
        zh: "已到最后一组"
    },
    已到第一组: {
        en: "Has reached the first group",
        zh: "已到第一组"
    },
    已到第一分组: {
        en: "Has reached the first group",
        zh: "已到第一分组"
    },
    已到第一主组: {
        en: "Has reached the first group",
        zh: "已到第一主组"
    },
    "红色字体：非此车架号的分组（参照原厂数据）": {
        en: "Red font: not the VIN information (refer to the original query system)",
        zh: "红色字体：非此车架号的分组（参照原厂数据）"
    },
    未搜索到相关结果: {
        en: "Not Find",
        zh: "未搜索到相关结果"
    },
    复制: {
        en: "copy",
        zh: "复制"
    },
    复制成功: {
        en: "copied",
        zh: "复制成功"
    },
    查看: {
        en: "View",
        zh: "查看"
    },
    添加到购物车: {
        en: "Add to cart",
        zh: "添加到购物车"
    },
    已添加至购物车: {
        en: "added",
        zh: "已添加至购物车"
    },
    复制: {
        en: "copy",
        zh: "复制"
    },复制: {
        en: "copy",
        zh: "复制"
    },复制: {
        en: "copy",
        zh: "复制"
    },复制: {
        en: "copy",
        zh: "复制"
    },


    radioBrands:{
        en: [
            {
                cn: 'All',
                en: 'all',
                url: "",
                placeholder: "17 VIN number number input"
            },{
                cn: 'BMW',
                en: 'bmw',
                url: "/img/bmw.png",
                placeholder: "Input the BMW after seven VIN number"
            },{
                cn: 'MINI',
                en: 'minis',
                url: "/img/minis.png",
                placeholder: "Input the MINI after seven VIN number"
            },{
                cn: 'Mercedes',
                en: 'benz',
                url: "/img/benz.png",
                placeholder: "Input the Mercedes after eight VIN number"
            },{
                cn: 'Smart',
                en: 'smart',
                url: "/img/smart.png",
                placeholder: "Input the Mercedes after eight VIN number"
            },{
                cn: 'Jaguar',
                en: 'jaguar',
                url: "/img/jaguar.png",
                placeholder: "Input the Jaguar after seven VIN number"
            },{
                cn: 'Land rover',
                en: 'land_rover',
                url: "/img/land_rover.png",
                placeholder: "Input the Land rover after eight VIN number"
            },{
                cn: 'Maserati',
                en: 'maserati',
                url: "/img/maserati.png",
                placeholder: "Input the Maserati after seven VIN number"
            }, 
        ],
        zh: [
            {
                cn: '全部品牌',
                en: 'all',
                url: "",
                placeholder: "输入17位VIN车架号"
            },{
                cn: '宝马',
                en: 'bmw',
                url: "/img/bmw.png",
                placeholder: "输入宝马后7位车架号"
            },{
                cn: 'MINI',
                en: 'minis',
                url: "/img/minis.png",
                placeholder: "输入MINI后7位车架号"
            },{
                cn: '奔驰',
                en: 'benz',
                url: "/img/benz.png",
                placeholder: "输入奔驰后8位车架号"
            },{
                cn: 'smart',
                en: 'smart',
                url: "/img/smart.png",
                placeholder: "输入smart后8位车架号"
            },{
                cn: '捷豹',
                en: 'jaguar',
                url: "/img/jaguar.png",
                placeholder: "输入捷豹后7位车架号"
            },{
                cn: '路虎',
                en: 'land_rover',
                url: "/img/land_rover.png",
                placeholder: "输入路虎后8位车架号"
            },{
                cn: '玛莎拉蒂',
                en: 'maserati',
                url: "/img/maserati.png",
                placeholder: "输入玛莎拉蒂后7位车架号"
            }, 
        ]
    },
    error17: {
        en: "Sorry, the VIN number you entered is less than <span>17</span> digist.",
        zh: "抱歉，您输入的车架号不足<span>17</span>位。"
    },
    error8to17: {
        en: "Sorry, the VIN number you entered is not <span>8</span> or <span>17</span>digist.",
        zh: "抱歉，您输入的车架号不是<span>8</span>或<span>17</span>位。"
    },
    error7to17: {
        en: "Sorry, the VIN number you entered is not <span>7</span> or <span>17</span>digist",
        zh: "抱歉，您输入的车架号不是<span>7</span>或<span>17</span>位。"
    },
    mainGroupTitle: {
        en: "Main group selection(   )",
        zh: "选择主组(共   组)"
    },
    subGroupTitle: {
        en: "Sub group selection(   )",
        zh: "选择分组(共   组)"
    },
    searchResultTitle: {
        en: "Search Result(   )",
        zh: " 搜索结果（共{   }组）"
    },
    subTableHeader: {
        en: ["MG", "SG", "ILL-No", "Description", "Remark", "Model"],
        zh: ["主组","分组","图号","名称","备注","型号"]
    },
    partListHeader: {
        en: ['', 'POS', 'Part Number', 'Name', 'QTY', 'Model', 'Remark', 'Price', '', '', ""],
        zh: ['', '位置', '零件OE号', '名称', '件数', '型号', '备注', '参考价格', '说明', '', ""]
    },



    //car车型
    选择主组信息: {
        en: "Main group selection",
        zh: "选择主组信息"
    },
    输入搜索内容: {
        en: "Enter the content",
        zh: "输入搜索内容"
    },
    "(共   组)": {
        en: "(   )",
        zh: "(共   组)"
    },





    //part
    默认查询品牌: {
        en: "Default",
        zh: "默认查询品牌"
    },
    设为默认: {
        en: "Set as Default",
        zh: "设为默认"
    },
    选择品牌: {
        en: "Choose a brand",
        zh: "选择品牌"
    },
    全部: {
        en: "All",
        zh: "全部"
    },
    查询: {
        en: "Search",
        zh: "查询"
    },
    更多历史: {
        en: "Histroy",
        zh: "更多历史"
    },
    输入完整零件号: {
        en: "Enter OE number",
        zh: "输入完整零件号"
    },



    //parteng
    品牌编号: {
        en: "Article Number",
        zh: "品牌编号"
    },
    原厂OE号: {
        en: "OE Number",
        zh: "原厂OE号"
    },
    输入品牌编号: {
        en: "Article Number",
        zh: "输入品牌编号"
    },
    输入原厂完整OE号: {
        en: "OE Number",
        zh: "输入原厂完整OE号"
    },
    品牌: {
        en: "brand",
        zh: "品牌"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    
}