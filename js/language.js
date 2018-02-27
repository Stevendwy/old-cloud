var  lge = navigator.language.split('-')[0]

if(lge !== "zh" && lge == "en") {
    lge = "en"
} else {
    lge = "zh"
}

var brandsQueryList = [
    "Aston Martin parts",
    "Audi parts",
    "BMW parts",
    "Porsche parts",
    "Mercedes-Benz parts",
    "Honda parts",
    "Bentley parts",
    "Volkswagen parts",
    "Toyota parts",
    "Jaguar parts",
    "Lamborghini parts",
    "Rolls-Royce parts",
    "Land Rover parts ",
    "Maybach parts",
    "Maserati parts",
    "MINI parts",
    "Skoda parts",
    "Smart parts",
    "Tesla parts",
    "Volvo parts",
    "Baic Motor parts",
    "Ferrari parts",
    "Lexus parts",
    "Acura parts"
]


if(localStorage.getItem("lang")) {
    lge = localStorage.getItem("lang")
} 
// lge = "en"
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
    "车架号查询s": {
        en: "Search",
        zh: "车架号查询"
    },
    车型查询: {
        en: "Model",
        zh: "车型查询"
    },
    零件号查询: {
        en: "Part",
        zh: "零件号查询"
    },
    品牌号查询: {
        en: "Article",
        zh: "品牌号查询"
    },
    操作指引: {
        en: "Help",
        zh: "操作指引"
    },
    指引: {
        en: "Help",
        zh: "指引"
    },
    个人中心: {
        en: "Account",
        zh: "个人中心"
    },
    我的: {
        en: "Account",
        zh: "我的"
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
        en: "Forgot password",
        zh: "忘记密码"
    },
    没有账号: {
        en: "New to 007",
        zh: "没有账号"
    },
    立即注册: {
        en: " Sign up now",
        zh: "立即注册"
    },
    零零汽当前覆盖品牌: {
        en: "007vin Covering Brands",
        zh: "零零汽当前覆盖品牌"
    },
    车型数据: {
        en: "Models",
        zh: "车型数据"
    },
    覆盖品牌: {
        en: "Brands",
        zh: "覆盖品牌"
    },
    零件数据: {
        en: "Parts",
        zh: "零件数据"
    },
    关于我们: {
        en: "About Us",
        zh: "关于我们"
    },
    用户协议: {
        en: "User Agreement",
        zh: "用户协议"
    },
     版权所有: {
         en: "Copy Right",
         zh: "版权所有"
     },
    数据合作: {
        en: "Cooperation",
        zh: "数据合作"
    },
    密码重置: {
        en: "Password Reset",
        zh: "密码重置"
    },
    选择方式 : {
        en: "Select",
        zh: "选择方式 "
    },
    手机号: {
        en: "Phone",
        zh: "手机号"
    },
    邮箱: {
        en: "Email",
        zh: "邮箱"
    },
    发送验证码: {
        en: "Get code",
        zh: "发送验证码"
    },
    提交: {
        en: "Submit",
        zh: "提交"
    },
    s后再试: {
        en: "s wait",
        zh: "s后再试"
    },
    新密码: {
        en: "New password",
        zh: "新密码"
    },
    重复新密码: {
        en: "Repeat new password",
        zh: "重复新密码"
    },
   




    //vin页面
    全部品牌: {
        en: "All",
        zh: "全部品牌"
    },
    车架号查询: {
        en: "VIN",
        zh: "车架号查询"
    },
    选择主组: {
        en: "Main group",
        zh: "选择主组"
    },
    选择分组: {
        en: "Secondary group",
        zh: "选择分组"
    },
    车辆配置: {
        en: "ID",
        zh: "车辆配置"
    },
    "同类车型图片, 仅供参考": {
        en: "Reference picture",
        zh: "同类车型图片, 仅供参考"
    },
    "输入零件原厂名/零件号": {
        en: "OE number/ Part name",
        zh: "输入零件原厂名/零件号"
    },
    "输入零件号／故障码": {
        en: "OE number/SDC code",
        zh: "输入零件号／故障码"
    },
    "输入零件号／工程编号": {
        en: "OE number/Eng Pid",
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
        en: "Retry",
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
        en: "Retry",
        zh: "重新查询"
    },
    输入17位VIN车架号: {
        en: "17 VIN",
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
        en: "Filter",
        zh: "过滤"
    },
    未过滤: {
        en: "Unfilter",
        zh: "未过滤"
    },
    上一主组: {
        en: "Prev.",
        zh: "上一主组"
    },
    下一主组: {
        en: "Next",
        zh: "下一主组"
    },
    上一组: {
        en: "Prev.",
        zh: "上一组"
    },
    下一组: {
        en: "Next",
        zh: "下一组"
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
        en: "Prev.",
        zh: "上一分组"
    },
    下一分组: {
        en: "Next",
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
        en: "The above information is provided by 007vin, for reference only！",
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
        en: "Red indicates: Subgroups are not original from this VIN(Reference: data provided by manufacturer)",
        zh: "红色字体：非此车架号的分组（参照原厂数据）"
    },
    "红色字体：非此车架号的零件（参照原厂数据）": {
        en: "Red indicates: Parts are not original from this VIN(Reference: data provided by manufacturer)",
        zh: "红色字体：非此车架号的零件（参照原厂数据）"
    },
    "网络超时，以下为基础零件数据。": {
        en: "Network time out, follwing part list is composed by fundamental parts only.",
        zh: "网络超时，以下为基础零件数据。"
    },
    未搜索到相关结果: {
        en: "Can't find results for you",
        zh: "未搜索到相关结果"
    },
    复制: {
        en: "Copy",
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
    含替换件: {
        en: "Supersession",
        zh: "含替换件"
    },
    含组件: {
        en: "Component",
        zh: "含组件"
    },
    含品牌件: {
        en: "Article",
        zh: "含品牌件"
    },
    "含替换件、组件": {
        en: "Component、Article",
        zh: "含替换件、组件"
    },
    留言: {
        en: "Leave Message",
        zh: "留言"
    },
    热门搜索: {
        en: "Search Trending",
        zh: "热门搜索"
    },
    以图片方式显示: {
        en: "Show item as icon",
        zh: "以图片方式显示"
    },
    以列表方式显示: {
        en: "Show item as list",
        zh: "以列表方式显示"
    },
    含品牌件: {
        en: "Article",
        zh: "含品牌件"
    },
    含品牌件: {
        en: "Article",
        zh: "含品牌件"
    },
    


    radioBrands:{
        en: [
            {
                cn: 'All',
                en: 'all',
                url: "",
                placeholder: "17 VIN"
            },{
                cn: 'BMW',
                en: 'bmw',
                url: "/img/bmw.png",
                placeholder: "Last 8 VIN"
            },{
                cn: 'MINI',
                en: 'minis',
                url: "/img/minis.png",
                placeholder: "Last 7 VIN"
            },{
                cn: 'Mercedes',
                en: 'benz',
                url: "/img/benz.png",
                placeholder: "Last 8 VIN"
            },{
                cn: 'Smart',
                en: 'smart',
                url: "/img/smart.png",
                placeholder: "Last 8 VIN"
            },{
                cn: 'Jaguar',
                en: 'jaguar',
                url: "/img/jaguar.png",
                placeholder: "Last 7 VIN"
            },{
                cn: 'Land rover',
                en: 'land_rover',
                url: "/img/land_rover.png",
                placeholder: "Last 8 VIN"
            },{
                cn: 'Maserati',
                en: 'maserati',
                url: "/img/maserati.png",
                placeholder: "Last 7 VIN"
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
        en: "Sorry, the VIN you entered is less than <span>17</span> digist.",
        zh: "抱歉，您输入的车架号不足<span>17</span>位。"
    },
    error8to17: {
        en: "Sorry, the VIN you entered is not <span>8</span> or <span>17</span>digist.",
        zh: "抱歉，您输入的车架号不是<span>8</span>或<span>17</span>位。"
    },
    error7to17: {
        en: "Sorry, the VIN you entered is not <span>7</span> or <span>17</span>digist",
        zh: "抱歉，您输入的车架号不是<span>7</span>或<span>17</span>位。"
    },
    mainGroupTitle: {
        en: "Maingroup(   )",
        zh: "选择主组(共   组)"
    },
    subGroupTitle: {
        en: "Subgroup(   )",
        zh: "选择分组(共   组)"
    },
    searchResultTitle: {
        en: "Search Result(   )",
        zh: " 搜索结果（共   组）"
    },
    subTableHeader: {
        en: ["MG", "SG", "ILL-No", "Description", "Remark", "Model"],
        zh: ["主组","分组","图号","名称","备注","型号"]
    },
    partListHeader: {
        en: ['', 'POS', 'OE Number', 'Name', 'QTY', 'Model', 'Remark', 'Price', '', '', ""],
        zh: ['', '位置', '零件OE号', '名称', '件数', '型号', '备注', '参考价格', '说明', '', ""]
    },
    //car车型
    选择主组信息: {
        en: "Maingroup",
        zh: "选择主组信息"
    },
    输入搜索内容: {
        en: "Search",
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
        en: "Brand",
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
        en: "More History",
        zh: "更多历史"
    },
    关闭: {
        en: "Close",
        zh: "关闭"
    },
    输入完整零件号: {
        en: "OE number",
        zh: "输入完整零件号"
    },
    故障码: {
        en: "SDC Code",
        zh: "故障码"
    },
    工程编号: {
        en: "Eng Pid",
        zh: "工程编号"
    },
    输入工程编号: {
        en: "Eng Pid",
        zh: "输入工程编号"
    },
    输入故障码: {
        en: "SDC Code",
        zh: "输入故障码"
    },
    零件号: {
        en: "OE number",
        zh: "零件号"
    },
    零件名称: {
        en: "Part Name",
        zh: "零件名称"
    },
    渠道价格: {
        en: "Price",
        zh: "渠道价格"
    },
    替换件: {
        en: "Supersession",
        zh: "替换件"
    },
    品牌件: {
        en: "Articles",
        zh: "品牌件"
    },
    组件: {
        en: "Component",
        zh: "组件"
    },
    技术信息: {
        en: "Technical Info",
        zh: "技术信息"
    },
    适用车型: {
        en: "Applicable Veh",
        zh: "适用车型"
    },
    输入配置信息: {
        en: "Search",
        zh: "输入配置信息"
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
    问题反馈: {
        en: "Feedback",
        zh: "反馈"
    },
    "EA号:": {
        en: "EA number:",
        zh: "EA号:"
    },
    "包数:": {
        en: "Packages:",
        zh: "包数:"
    },
    "数量/每包:": {
        en: "Quantity/Package:",
        zh: "数量/每包:"
    },
    "描述:": {
        en: "Description",
        zh: "描述"
    },
    "标签:": {
        en: "Label",
        zh: "标签:"
    },
    "零件详情": {
        en: "Detail",
        zh: "零件详情"
    },
    "替换件号:": {
        en: "Supersession",
        zh: "替换件号:"
    },
    基础信息: {
        en: "Basic",
        zh: "基础信息"
    },
    零件图片: {
        en: "Part Image",
        zh: "零件图片"
    },
    主: {
        en: "Maingroup",
        zh: "主"
    },
    分: {
        en: "Subgroup",
        zh: "分"
    },
    子: {
        en: "Semi-Subgroup",
        zh: "子"
    },
    "1  选择配置：": {
        en: "1 Configuration",
        zh: "1  选择配置："
    },
    "2  选择主组：": {
        en: "2 Maingroup",
        zh: "2  选择主组："
    },
    公司名称: {
        en: "Company",
        zh: "公司名称"
    },
    位置: {
        en: "",
        zh: "位置"
    },
    库存: {
        en: "",
        zh: "库存"
    },
    "输入图号/名称": {
        en: "ILLU No./Name",
        zh: "输入图号/名称"
    },
    尝试车型查询: {
        en: "Try model query",
        zh: "尝试车型查询"
    },
    尝试选择品牌查询: {
        en: "select a brand and retry",
        zh: "尝试选择品牌查询"
    },
    清空: {
        en: "Empty cart",
        zh: "清空"
    },
    报价: {
        en: "Bid",
        zh: "报价"
    },
    "确认清空购物车？": {
        en: "Are your sure to empty cart?",
        zh: "确认清空购物车？"
    },
    确认: {
        en: "Sure",
        zh: "确认"
    },
    取消: {
        en: "Cancel",
        zh: "取消"
    },
    导出Excel: {
        en: "Export to excel file",
        zh: "导出Excel"
    },
    合计: {
        en: "Sum up",
        zh: "合计"
    },
    微信扫一扫分享报价单: {
        en: "Scan QR code to share quotation",
        zh: "微信扫一扫分享报价单"
    },
    配件报价表: {
        en: "Parts quotation",
        zh: "配件报价表"
    },
    报价方资料: {
        en: "Buyer information",
        zh: "报价方资料"
    },
    联系人: {
        en: "Contacter",
        zh: "联系人"
    },
    联系电话: {
        en: "Phone",
        zh: "联系电话"
    },
    备注: {
        en: "Remark",
        zh: "备注"
    },
    "General 常规": {
        en: "General",
        zh: "General 常规"
    },
    零件OE号: {
        en: "OE number",
        zh: "零件OE号"
    },
    品牌零件号: {
        en: "OE number",
        zh: "品牌零件号"
    },
    厂商: {
        en: "Manufacturer",
        zh: "厂商"
    },
    显示全部: {
        en: "Show all",
        zh: "显示全部"
    },
    收起全部: {
        en: "Hide all",
        zh: "收起全部"
    },
    详情: {
        en: "Detail",
        zh: "详情"
    },
    上一步: {
        en: "Prev.",
        zh: "上一步"
    },
    下一步: {
        en: "Next",
        zh: "下一步"
    },
    查看历史报价单: {
        en: "View the quotation history",
        zh: "查看历史报价单"
    },
    "温馨提示：请检查您的输入是否正确": {
        en: "Please, ensure your entering is correct.",
        zh: "温馨提示：请检查您的输入是否正确"
    },
    设备编号: {
        en: "Equiment No",
        zh: "设备编号"
    },
    "*有效（+）：编码与车辆配置信息匹配则零件对车辆有效；": {
        en: "Valid(+): part is valid for vehicle if vehicle configuration info and code are matched",
        zh: "*有效（+）：编码与车辆配置信息匹配则零件对车辆有效；"
    },
    "无效（-）：编码与车辆配置信息匹配则零件对车辆无效；": {
        en: "part is invalid for vhicle if code cant match vehicle configuration. ",
        zh: "无效（-）：编码与车辆配置信息匹配则零件对车辆无效；"
    },
    "：编码与车辆配置信息匹配。": {
        en: "part and vehicle configuration can match each other",
        zh: "：编码与车辆配置信息匹配。"
    },
    参见: {
        en: "Refer",
        zh: "参见"
    },
    选择零件组: {
        en: "Group",
        zh: "选择零件组"
    },
    加载更多: {
        en: "LoadMore",
        zh: "加载更多"
    },
    XXX: {
        en: "",
        zh: "XXX"
    },
    "服务正忙，请5秒后再试": {
        en: "Server are busy currently, please retry 5 seconds later!",
        zh: "服务正忙，请5秒后再试"
    },
}


// ["品牌", "零件名称", "品牌编号", "型号", "注释", "零件图片"]
//["位置", "零件号", "名称", "型号", "备注", "件数"]

// 位置 
// 库存
// 输入图号/名称
// 未搜索到相关结果
// 选择配置
// 重新输入
// 尝试车型查询
// 重新查询
// 尝试选择品牌查询
// 为你找到相关结果约5个
// 购物车（共1种，共1件）
// 清空
// 报价
// 确认清空购物车
// 确认
// 取消
// ["序号","零件名称","零件号","采购类型","数量","单价"]
// 复制 
// 复制成功
// 复制链接
// 导出Excel
// 合计
// 微信扫一扫分享报价单
// 配件报价表
// 报价方资料
// 联系人
// 联系电话
// 备注


// 很抱歉，品牌编号1111没有相关的品牌件。
// 很抱歉，原厂OE号1111没有相关的品牌件。
// 温馨提示：请检查您的输入是否正确
// 收起全部
// 显示全部
// 设备编号
// *有效（+）：编码与车辆配置信息匹配则零件对车辆有效；
// 无效（-）：编码与车辆配置信息匹配则零件对车辆无效；
// 编码与车辆配置信息匹配。
// 参见
/*
 后端需要改的接口
 /articles/oe_engine_search
 /brandsdict
 /brandselector
 /search/parts
 /ppyvin/searchvins
 /parts/search
 */
