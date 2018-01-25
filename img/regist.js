// $.get()
(function loadingnumber(){
    // $.get()
    // console.log(007)
    var cardunmber = "007"
    $(".card_number div").html(cardunmber)
})()

var phonenumber="",testcode,username,companyname

//输入手机号
$("#phonenumber").on("change",function(e){
    var phone = e.target.value
    if(!(/^1[34578]\d{9}$/.test(phone))){ 
        alert("手机号码有误，请重填");  
        phonenumber =""
        return false; 
        
    }else{
        phonenumber = phone
        // $.get("https://007vin.com/user/regiest",{phone:phonenumber},function(res){
        //     console.log(res)
        // })
    }
})

$("#phonenumber").on("blur",function(){
    if(phonenumber){
        $.get("/phonecheck",{username:phonenumber},function(res){
            // console.log(res)
        })
    }


})

//手机验证码
$(".send-msg").on("click",function(){
    if($(this).html()!=="点击发送验证码") return;
    if(phonenumber){
        var _this = this
        $.post("/smscode",{mobile:phonenumber,type:1},function(response){
            response = $.parseJSON(response)
            if(response.code==1){
                $(_this).addClass("disabled").html("60s后重新发")
                timer = setInterval(counttime,1000)
            }
        })
    }else{
        alert("请填写正确手机号")
    }
})
var timer
var time = 59
$(this).html(time+"s后重新发")
function counttime(){
    $(".send-msg").html(time+"s后重新发")
    time--
    if(time==0){
        clearInterval(timer)
        timer = null;
        time = 59
        $(".send-msg").removeClass("disabled").html("点击发送验证码")
    }
}

// var companys=["汽配商","修理厂","4s店","其他"]
//公司类型
$(".inputitems .type-item").on("click",function(){
    if($(this).hasClass("active")) return  
    $(this).addClass("active").siblings().removeClass("active")
})

//注册协议
var agree_rigist = false
$(".agree_rigist_box").on("click",function(){
    if($(this).hasClass("not_agree")){
        $(this).toggleClass("not_agree")
        agree_rigist = true
        $(this).attr("src","/img/p_checked_box.png")
    }else{
     $(this).addClass("not_agree")
        agree_rigist = false
        $(this).attr("src","/img/Disagree.png")
    }
    testRegist()
})

//是否可以注册函数
function testRegist(){
    // console.log($("#phonenumber").attr("value"))
    if($("#phonenumber").attr("value")&&$("#testcode").attr("value")
        &&$("#username").attr("value")&&$("#companyname").attr("value")
        &&agree_rigist){
        // console.log("canregist")
        $(".submitbutton").removeClass("disable")
    }else{
        $(".submitbutton").addClass("disable")
    }
}

//全局添加检查是否可以注册
$(".inputitems input").on("blur",function(){
    testRegist()
})

//注册
$(".submitbutton").on("click",function(){
    if($(this).hasClass("disable")) return
    if (!phonenumber) {
        alert('请输入正确的手机号。')
        return
    }else{
        var obj ={
            username:phonenumber,
            sms_code:$("#testcode").attr('value'),
            real_name:$("#username").attr('value'),
            company_type:$(".inputitems .active").html(),
            company:$("#companyname").attr('value')
        } 
        // console.log(obj)
        $.post("/user/register_web",obj,function(res){
            // console.log(res)
            if(res.code===1){
                localStorage.setItem("phone",res.data.phone)
                localStorage.setItem("valid_datetime",res.data.valid_datetime)
                localStorage.setItem("password",res.data.password)
                location.href = "/pays/paypage"
            }else{
                alert(res.msg)
            }
        })
    }
})

//用户注册协议
function registShow(temp){
    if(temp){
        $(".container_useragreement").show()
    }else{
        $(".container_useragreement").hide()
    }
}


function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $("#out").show();
    }
}

isWeiXin()