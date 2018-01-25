//首页浏览器检测
function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    // alert(userAgent)
    // alert(userAgent)
    // alert(parseInt(userAgent.split("Chrome")[1].slice(1,3)))
    
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == 1) {
        return "FF";
    } //判断是否Firefox浏览器
    if ((userAgent.indexOf("iPad") > -1 && userAgent.indexOf("AppleWebKit") > -1) || (userAgent.indexOf("iPhone") > -1 && userAgent.indexOf("AppleWebKit") > -1) || userAgent.indexOf("Chrome") > -1) {
        if(parseInt(userAgent.split("Chrome")[1].slice(1,3)) < 45){
            return "IE"
        }else{
            return "Chrome"
        }
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}

$(".notAgain").on("click", function() {
    var src = $(".notAgain img").attr('src');
    if (src == "/img/icon_zhifuxuanzhe.png") {
        $(".notAgain img").attr("src", "/img/icon_zhifuxuanzhe_dian.png");
        localStorage.isShow = "none";
    } else {
        $(".notAgain img").attr("src", "/img/icon_zhifuxuanzhe.png");
        localStorage.isShow = "show";
    }
})
$(".close").on("click", function() {
    $('#root').css("filter", "none")
    $("#browserChange").hide();
})

function toAlert() {
    
    $("#browserChange").show();
    $(".error-refash").show();  
} 


function showdanger(){
    $("#browserChange").toggle();

}

//以下是调用上面的函数
var mb = myBrowser();
// console.log(mb)
switch (mb) {
    case "IE":
        toAlert();
        break;
    case "FF":
        break;
    case "Chrome":
        break;
    case "Opera":
        toAlert();
        break;
    case "Safari":
        // toAlert();
        break;
    default:
        toAlert();
        break;
}
////ie  6 7 显示模式：
//if(-[1,]){ 
//
//}else{
//	var mainError="<div id='mainError'><img src='/img/p_jian.png' alt='浏览器版本不支持'><div class='msg'><p>抱歉，您的浏览器无法使用零零汽汽配查询</p><p>您可以使用谷歌浏览器、火狐浏览器、或者360浏览器进行查询。</p></div></div>";
//	$("#root").html(mainError);
//
//}