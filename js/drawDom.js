cdnHost = 'https://cdns.007vin.com'
var canvasContainer =   '<div class="FeedbackContainer" style="display:none">'
    canvasContainer +=     '<div class="textAreaContainer">'
    canvasContainer +=       '<div class="chooseItem">'
    canvasContainer +=        '<div class="itemsTitle">选择问题</div>'
    canvasContainer +=        '<div class="itemsBody">'
    canvasContainer +=          '<div class="item">车架号查不到</div>'
    canvasContainer +=          '<div class="item">零件号查不到</div>'
    canvasContainer +=          '<div class="item">缺少车型</div>'
    canvasContainer +=          '<div class="item">数据不全</div>'
    canvasContainer +=          '<div class="item">数据错误</div>'
    canvasContainer +=          '<div class="item">数据不够新</div>'
    canvasContainer +=          '<div class="item">速度慢</div>'
    canvasContainer +=          '<div class="item">没有唯一性</div>'
    canvasContainer +=          '<div class="item">其他</div>'
    canvasContainer +=        '</div>'
    canvasContainer +=       '</div>'
    canvasContainer +=       '<textarea placeholder="输入内容" class="textAreaInput" cols="31" rows="3" autofocus="autofocus"></textarea>'
    canvasContainer +=     '</div>'
    canvasContainer +=     '<div class="ImageParkContainer">'
    canvasContainer +=       '<canvas id="canvas"></canvas>'
    canvasContainer +=       '<div class="ImageParkSelectorContainer">'
    canvasContainer +=         '<div class="ImageParkSelector">'
    canvasContainer +=           '<div class="msgalert">插入矩形</div>'
    canvasContainer +=           '<img class="ImageParkSelectorImg" src="' + cdnHost + '/img/rectangle.png" alt="text">'
    canvasContainer +=         '</div>'
    canvasContainer +=         '<div class="ImageParkSelector">'
    canvasContainer +=           '<div class="msgalert">插入椭圆</div>'
    canvasContainer +=           '<img class="ImageParkSelectorImg" src="' + cdnHost + '/img/circle.png" alt="text">'
    canvasContainer +=         '</div>'
    canvasContainer +=         '<div class="ImageParkSelector">'
    canvasContainer +=           '<div class="msgalert">插入箭头</div>'
    canvasContainer +=           '<img class="ImageParkSelectorImg" src="' + cdnHost + '/img/arrow.png" alt="text">'
    canvasContainer +=         '</div>'
    canvasContainer +=         '<div class="ImageParkSelector">'
    canvasContainer +=           '<div class="msgalert">插入文字</div>'
    canvasContainer +=           '<img class="ImageParkSelectorImg" src="' + cdnHost + '/img/text.png" alt="text">'
    canvasContainer +=        ' </div>'
    canvasContainer +=         '<div class="ImageParkSelector">'
    canvasContainer +=           '<img class="ImageParkSelectorImg" src="' + cdnHost + '/img/icon_chexiao.png" alt="text">'
    canvasContainer +=         '</div>'
    canvasContainer +=         '<div class="ImageParkSelector">'
    canvasContainer +=           '<img class="ImageParkSelectorImg" src="' + cdnHost + '/img/icon_quxiao.png" alt="text">'
    canvasContainer +=         '</div>'
    canvasContainer +=         '<div class="ImageParkSelector">'
    canvasContainer +=           '<img class="ImageParkSelectorImg" src="' + cdnHost + '/img/icon_tijiao.png" alt="text">'
    canvasContainer +=         '</div>'
    canvasContainer +=       '</div>'
    canvasContainer +=     '</div>'
    canvasContainer +=   '</div>'
    canvasContainer +=   '<div id="FeedBackButton"></div>'
    canvasContainer +=   '<div class="feedSuccessContainer" style="display:none">'
    canvasContainer +=     '<p>感谢反馈！</br>我们将尽快处理。</p><span>3</span>'
    canvasContainer +=   '</div>'
    canvasContainer +=   '<div class="flexDivs" style="display:none">'
    canvasContainer +=     '<div class="flexBorder"></div>'
    canvasContainer +=     '<div class="flexTop"></div><div class="flexRight"></div><div class="flexBottom"></div><div class="flexLeft"></div>'
    canvasContainer +=   '</div>'

$("body").append(canvasContainer);
var temp = false;
var startX;
var startY;
var originX;
var textflag = true;
var originY;

// 问题选择
$("body").on("click",".itemsBody .item",function(){
  $(this).toggleClass("selected")
})

$(".itemsTitle").on("mousedown", function(e) {
  startX = e.clientX;
  startY = e.clientY;
  originX = parseInt($('.textAreaContainer').css("right"));
  originY = parseInt($('.textAreaContainer').css("bottom"));
  temp = true;
}).on("mousemove", function(e) {
  if (temp) {
    var _currentX = e.clientX
    var _currentY = e.clientY
    var _moveX = _currentX - startX
    var _moveY = _currentY - startY
    var _BottomLastLocal = originY - _moveY;
    var _RightLastLocal = originX - _moveX;
    $(".textAreaContainer").css("bottom", _BottomLastLocal + "px").css("right", _RightLastLocal + "px")
  }
}).on("mouseup", function() {
  temp = false;
})

$("body").on("mousewheel", function() {
  if (parseInt((this).scrollTop) > 50) {
    $("#FeedBackButton").show()
  } else {
    $("#FeedBackButton").hide()
  }
})

$(".ImageParkSelector").on("click", function() {
  var index = $(".ImageParkSelector").index(this);
    $(".ImageParkSelectorContainer img").each(function(index, item) {
    $(item).attr("src", $(item).attr("src").replace("_selected", ""));
  });
  switch (index) {
    case 0:
      $(this).find("img").attr("src", cdnHost + "/img/rectangle_selected.png");
      tools.tool = "pencil";
      tools.graphic = "rect";
      break;
    case 1:
      $(this).find("img").attr("src", cdnHost + "/img/circle_selected.png");
      tools.tool = "pencil";
      tools.graphic = "circle";
      break;
    case 2:
      $(this).find("img").attr("src", cdnHost + "/img/arrow_selected.png");
      tools.tool = "pencil";
      tools.graphic = "line";
      break;
    case 3:
      $(this).find("img").attr("src", cdnHost + "/img/text_selected.png");
      tools.tool = "word";
      break;
    case 4:
      tools.tool = "pencil";
      tools.graphic = "";
      break;
  }
}).on("mouseover", function() {

})

var tools = {
  tool: "pencil",
  graphic: "",
  color: ""
}

var canvasHeight = $(window).height() - 35;
var canvasWidth = $(window).width();
$(window).resize(function() {
  var canvasHeight = $(window).height();
  var canvasWidth = $(window).width();
  $("#canvas").attr({
    "width": canvasWidth,
    "height": canvasHeight,
  }).css({
    "width": canvasWidth + "px",
    "height": canvasHeight + "px"
  })
});

window.onload = function() {
  //	var urls = "#";
  var url = "#";
  var img;
  //点击出现截图工具

  // 鼠标操作开关
  var flag = false;
  // 初始化起点坐标值及保存点
  var x, y = "";
  // 初始化字体属性
  var fontsize = "24px",
    fontfamily = "Arial",
    fontweight = "",
    fontstyle = "";
  var feedBackContainer = $('<div class="FeedBackButton" style="cursor:pointer"><b></b><span>反馈</span></div>')
    //  $("<textarea rows='3' cols='20' style='background:transparent;position:fixed;display:none;'></textarea>");

  $(".TopRightContainer").append(feedBackContainer);

  $(".FeedBackButton").on("click", function() {
    $("#canvas").css({
      "position": "fixed",
      "left": "0",
      "width": $(window).width() + "px",
      "height": $(window).height() + "px"
    }).attr({
      "width": $(window).width(),
      "height": $(window).height()
    });
    $(".FeedbackContainer").show();
    $('.flexDivs').show();
    $(".textAreaContainer").animate({
      "bottom": "41px"
    }, 500);
    $(".textAreaInput").focus();
    canvasHeight = $(window).height();
    canvasWidth = $(window).width();
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.beginPath();
    //	    context.fillStyle="rgba(0, 0, 0, 0.2)";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    //		context.beginPath();
    //	    context.clearRect(40,40,canvasWidth-80,canvasHeight-75);//context的clearRect方法
    context.clearRect(0, 0, canvas.width, canvas.height);
    urls = canvas.toDataURL();
    //	    url= urls;
    loadImg();
  });

  //	context.strokeStyle = "transparent";
  //	context.save();
  //  context.lineWidth=4;
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  loadImg();
  // 初始化文本输入框
  var fontTip = $("<textarea rows='3' cols='20' style='background:transparent;position:fixed;display:none;'></textarea>");
  $(".ImageParkContainer").append(fontTip);

  $("canvas").mousedown(function(event) {
    // 绘制开始
    //loadImg();
    context.strokeStyle = "red";
    flag = true;
    // 获取起点坐标值
    x = event.offsetX;
    y = event.offsetY;
    beginPoint.x = x;
    beginPoint.y = y;
  }).mouseup(function(event) {
    // 绘制完毕
    flag = false;
    url = canvas.toDataURL();
    loadImg();
    fontTip.focus();
    if (tools.tool == "word") {
      inputWord(event);
    }
  }).mousemove(function(event) {
    if (tools.tool == "pencil" && tools.graphic == "") {
      drawPencil(event);
    } else if (tools.tool == "pencil" && tools.graphic == "line") {
      drawLine(event);
    } else if (tools.tool == "pencil" && tools.graphic == "rect") {
      drawRect(event);
    } else if (tools.tool == "pencil" && tools.graphic == "circle") {
      drawCircle(event);
    } else if (tools.tool == "pencil" && tools.graphic == "triangle") {
      drawTriangle(event);
    } else if (tools.tool == "eraser") {
      drawPencil(event);
    } else if (tools.tool == "word") {
      //inputWord(event);
    }
  })

  //  $("canvas").on("touchstart",function(event) {
  //      // 绘制开始
  // 	 	//loadImg();
  //  		context.strokeStyle = "red";
  //      flag = true;
  //      // 获取起点坐标值
  //      x = event.offsetX;
  //      y = event.offsetY;
  //      beginPoint.x = x;
  //     	beginPoint.y = y;       	
  //  }).on("touchend",function(event) {
  //      // 绘制完毕
  //      flag = false;
  //      url = canvas.toDataURL();
  // 	 	loadImg();
  //      fontTip.focus();
  //      if(tools.tool == "word"){
  //          inputWord(event);
  //      }
  //  }).on("touchmove",function(event) {
  //      if (tools.tool == "pencil" && tools.graphic == "") {
  //          drawPencil(event);
  //      } else if (tools.tool == "pencil" && tools.graphic == "line") {
  //          drawLine(event);
  //      } else if (tools.tool == "pencil" && tools.graphic == "rect") {
  //          drawRect(event);
  //      } else if (tools.tool == "pencil" && tools.graphic == "circle") {
  //          drawCircle(event);
  //      } else if (tools.tool == "pencil" && tools.graphic == "triangle") {
  //          drawTriangle(event);
  //      } else if (tools.tool == "eraser") {
  //          drawPencil(event);
  //      } else if (tools.tool == "word") {
  //         //inputWord(event);
  //      }
  //  })

  // 绘制画笔
  function drawPencil(event) {
    if (flag) {
      context.lineTo(event.offsetX, event.offsetY);
      context.stroke();
    } else {
      context.beginPath();
      context.moveTo(event.offsetX, event.offsetY);
    }
  }

  //、、、、、、、、、、、、、、、、、、、绘制箭头方法、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、//
  var beginPoint = {},
    stopPoint = {},
    polygonVertex = [],
    CONST = {
      edgeLen: 50,
      angle: 25
    };
  //封装的作图对象
  var Plot = {
    angle: "",
    //在CONST中定义的edgeLen以及angle参数
    //短距离画箭头的时候会出现箭头头部过大，修改：
    dynArrowSize: function() {
      var x1 = stopPoint.x - beginPoint.x,
        y1 = stopPoint.y - beginPoint.y,
        length = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2));
      if (length < 250) {
        CONST.edgeLen = CONST.edgeLen / 2;
        CONST.angle = CONST.angle / 2;
      } else if (length < 500) {
        CONST.edgeLen = CONST.edgeLen * length / 500;
        CONST.angle = CONST.angle * length / 500;
      }
    },

    //getRadian 返回以起点与X轴之间的夹角角度值
    getRadian: function(beginPoint, stopPoint) {
      Plot.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
      paraDef(50, 25);
      Plot.dynArrowSize();
    },

    ///获得箭头底边两个点
    arrowCoord: function(beginPoint, stopPoint) {
      polygonVertex[0] = beginPoint.x;
      polygonVertex[1] = beginPoint.y;
      polygonVertex[6] = stopPoint.x;
      polygonVertex[7] = stopPoint.y;
      Plot.getRadian(beginPoint, stopPoint);
      polygonVertex[8] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (Plot.angle + CONST.angle));
      polygonVertex[9] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (Plot.angle + CONST.angle));
      polygonVertex[4] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (Plot.angle - CONST.angle));
      polygonVertex[5] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (Plot.angle - CONST.angle));
    },

    //获取另两个底边侧面点
    sideCoord: function() {
      var midpoint = {};
      midpoint.x = (polygonVertex[4] + polygonVertex[8]) / 2;
      midpoint.y = (polygonVertex[5] + polygonVertex[9]) / 2;
      polygonVertex[2] = (polygonVertex[4] + midpoint.x) / 2;
      polygonVertex[3] = (polygonVertex[5] + midpoint.y) / 2;
      polygonVertex[10] = (polygonVertex[8] + midpoint.x) / 2;
      polygonVertex[11] = (polygonVertex[9] + midpoint.y) / 2;
    },
  };

  function paraDef(edgeLen, angle) {
    CONST.edgeLen = edgeLen;
    CONST.angle = angle;
  }

  // 绘制箭头
  function drawLine(event) {
    if (flag) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      //          // 载入上次保存点
      loadImg();
      stopPoint.x = event.offsetX;
      stopPoint.y = event.offsetY;
      Plot.arrowCoord(beginPoint, stopPoint);
      Plot.sideCoord();
      context.fillStyle = "red";
      context.beginPath();
      context.moveTo(polygonVertex[0], polygonVertex[1]);
      context.lineTo(polygonVertex[2], polygonVertex[3]);
      context.lineTo(polygonVertex[4], polygonVertex[5]);
      context.lineTo(polygonVertex[6], polygonVertex[7]);
      context.lineTo(polygonVertex[8], polygonVertex[9]);
      context.lineTo(polygonVertex[10], polygonVertex[11]);
      context.closePath();
      context.fill();
    }
  }

  // 绘制矩形
  function drawRect(event) {
    if (flag) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      // 载入上次保存点
      loadImg();
      context.beginPath();
      context.lineWidth = 4;
      context.rect(x, y, event.offsetX - x, event.offsetY - y);
      if (tools.color != "") {
        context.fill();
        context.stroke();
      } else {
        context.stroke();
      }
    }
  }

  // 绘制圆形
  function drawCircle(event) {
    if (flag) {
      var rx = (event.offsetX - x) / 2;
      var ry = (event.offsetY - y) / 2;
      var r = Math.sqrt(rx * rx + ry * ry);
      context.lineWidth = 4;
      context.clearRect(0, 0, canvas.width, canvas.height);
      // 载入上次保存点
      loadImg();

      context.beginPath();
      context.arc(rx + x, ry + y, r, 0, Math.PI * 2);
      if (tools.color != "") {
        context.fill();
        context.stroke();
      } else {
        context.stroke();
      }
    }
  }

  // 文字输入
  function inputWord(event) {
    if (textflag) {
      fontTip.css({
        top: y,
        left: x,
        width: '410px',
        height: '43px',
        fontSize: '14px',
        fontFamily: fontfamily,
        color: "red",
        fontStyle: fontstyle,
        fontWeight: fontweight
      }).show().focus();
    }
  }

  // 绘制文字
  function drawWord(event) {
    var words = fontTip.val().trim();
    if (fontTip.css("display") != "none" && words) {
      var offset1 = $("#canvas").offset();
      var offset2 = fontTip.offset();
      context.fillStyle = "red";
      context.font = fontstyle + fontweight + fontsize + " " + fontfamily;
      if (isNaN(fontsize)) {
        var size = Number(fontsize.substring(0, fontsize.length - 2));
      }
      context.fillText(words, offset2.left - offset1.left + 2, offset2.top - offset1.top + size + 3);
      fontTip.val("");
    }
    fontTip.hide();
    textflag = false;
    setTimeout(function() {
      textflag = true;
    }, 200)
  }
  fontTip.blur(drawWord);
  // 禁止框变化
  //	$(".ImageParkContainer").on("keyup","textarea",function(){
  //		textflag = false;
  //	}).on("click","textarea",function(){
  //		textflag = false;
  //	})
  //清除画板
  $(".ImageParkSelectorContainer>div:eq(4)").on("click", function() {
      resetAndClear();
    })
    //隐藏截图并重置
  function resetAndClear() {
    $(".itemsBody .item").removeClass("selected");
    flag = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    url = urls || "#";
    loadImg();
    tools.tool = "pencil";
    tools.graphic = "";
  }

  $(document).on("keydown", function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 27) {
      if ($(".FeedbackContainer").css('display') == "block") {
        resetAndClear();
        $('.flexDivs').hide();
        $(".FeedbackContainer").hide();
        $(".textAreaContainer").css({
          "bottom": '-179px',
          "right": "0px"
        });
        $(".textAreaInput").val("");
      }
    }
  })

  $(".ImageParkSelectorContainer>div:eq(5)").on("click", function() {
    resetAndClear();
    $('.flexDivs').hide();
    $(".FeedbackContainer").hide();
    $(".textAreaContainer").css({
      "bottom": '-179px',
      "right": "0px"
    });
    $(".textAreaInput").val("");
  })
  var canverauth = ""
  //隐藏截图并上传
  $(".ImageParkSelectorContainer>div:eq(6)").on("click", function() {
    canverauth = $(".container-content>div:not(.shrink) .container-header .title").html()
    $("body").css("overflow", "auto");
    $(".container-content>div:not(.shrink) .shrink").css("display","none")
    var timer = setTimeout(function() {
        $(".container-content>div:not(.shrink) .shrink").css("display","flex")
    },50)
    html2canvas($('body')[0], {
      onrendered: function(canvas) {
        var Pic = canvas.toDataURL("image/png")
        
        // var img = new Image()
        // img.src = Pic
        // $("body").html(img)
        // return;


        Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "")
        var advise = $(".textAreaInput").val()
        var advise_type = ""
        $(".itemsBody .selected").each(function(i){
           advise_type+= ($(this).html() + ",")
        })
        resetAndClear()
        var objData = {
          "imageData": Pic,
          "advise_type": advise_type,
          "advise": advise,
          "header": canverauth
        }
        $.ajax({
          type: 'POST',
          url: '/userfeedback',
          data: objData,
          success: function(data) {
            if (data.code == 1) {
              // window.open(Pic)
            }
          }
        });
        $(".textAreaInput").val("");
        $(".textAreaContainer").css({
          "bottom": '-179px',
          "right": "0px"
        });
      },
    });

    $('.flexDivs').hide();
    $(".FeedbackContainer").hide();
    $(".feedSuccessContainer").show();
    var timer = setInterval(function() {
      var time = parseInt($('.feedSuccessContainer span').html());
      time--;
      $('.feedSuccessContainer span').html(time);
    }, 1000)
    setTimeout(function() {
      $('.feedSuccessContainer').hide();
      clearInterval(timer);
      $('.feedSuccessContainer span').html("3");
    }, 3000)
  });

  //隐藏画板并且清除
  function loadImg() {
    img = new Image();
    img.src = url;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

//var _hmt = _hmt || [];
//(function() {
//  var hm = document.createElement("script");
//  hm.src = "https://hm.baidu.com/hm.js?05e21600fc9a2fed6a3083dc789817bd";
//  var s = document.getElementsByTagName("script")[0];
//  s.parentNode.insertBefore(hm, s);
//})();

$("body").on("click", ".listhead-item", function () {
      if ($(this).find("div").hasClass('plus')) {
          $(this).parents(".listhead-list").find(".listhead-item").show();
          $(this).find(".plus").removeClass("plus").addClass("minus")
      } else if ($(this).find("div").hasClass('minus')) {
          $(this).parents(".listhead-list").find(".listhead-item").hide();
          $(this).show();
          $(this).find(".minus").removeClass("minus").addClass("plus")
      }
  })

// //购物车移动
// $("body").on("mousedown",".shopping-cart .shopping-title", function(e) {
//     startX = e.clientX;
//     startY = e.clientY;
//     originX = parseInt($('.shopping-cart').css("left"));
//     originY = parseInt($('.shopping-cart').css("top"));
//     originY2 = parseInt($('.shopping-cart').css("bottom"));
//     temp = true;
// }).on("mousemove", function(e) {
//   if (temp) {
//     var _currentX = e.clientX
//     var _currentY = e.clientY
//     var _moveX = _currentX - startX
//     var _moveY = _currentY - startY
//     var _BottomLastLocal = originY + _moveY;
//     var _BottomLastLocal2 = originY2 - _moveY;
//     var _RightLastLocal = originX + _moveX;
//     $(".shopping-cart").css("top", _BottomLastLocal + "px").css("left", _RightLastLocal + "px").css("bottom",_BottomLastLocal2)
//   }
// }).on("mouseup", function() {
//   temp = false;
// })

// //车型移动
// $("body").on("mousedown",".container-car-info .header", function(e) {
//     startX = e.clientX;
//     startY = e.clientY;
//     originX = parseInt($('.container-car-info').css("left"));
//     originY = parseInt($('.container-car-info').css("top"));
//     originY2 = parseInt($('.container-car-info').css("bottom"));
//     temp = true;
// }).on("mousemove", function(e) {
//   if (temp) {
//     var _currentX = e.clientX
//     var _currentY = e.clientY
//     var _moveX = _currentX - startX
//     var _moveY = _currentY - startY
//     var _BottomLastLocal = originY + _moveY;
//     var _BottomLastLocal2 = originY2 - _moveY;
//     var _RightLastLocal = originX + _moveX;
//     $(".container-car-info").css("top", _BottomLastLocal + "px").css("left", _RightLastLocal + "px").css("bottom",_BottomLastLocal2)
//   }
// }).on("mouseup", function() {
//   temp = false;
// })


//零件号搜索移动
var _this = ""
var tempPart = false;
$("body").on("mousedown",".bluePartTitle", function(e) {
  startX = e.clientX;
  startY = e.clientY;
  var domLength = $(this).parents(".card-selector").length - 1
  _this = $(".card-selector")[domLength]
  originX = parseInt($(_this).css("left"));
  originY = parseInt($(_this).css("top"));
  originY2 = parseInt($(_this).css("bottom"));
  tempPart = true;
}).on("mousemove", function(e) {
if (tempPart) {
  var _currentX = e.clientX
  var _currentY = e.clientY
  var _moveX = _currentX - startX
  var _moveY = _currentY - startY
  var _BottomLastLocal = originY + _moveY;
  var _BottomLastLocal2 = originY2 - _moveY;
  var _RightLastLocal = originX + _moveX;
  $(_this).css("top", _BottomLastLocal + "px").css("left", _RightLastLocal + "px").css("bottom",_BottomLastLocal2)
}
}).on("mouseup", function() {
  tempPart = false;
})



// function addMoveUtils(){
//   var list=[
//     {mouseDownDom:".shopping-cart .shopping-title",moveDom:".shopping-cart"},
//     {mouseDownDom:".container-car-info .header",moveDom:".container-car-info"},
//   ]
//   for(var i = 0; i<list.length; i++){
//     $("body").on("mousedown",list[i].mouseDownDom, function(e) {
//         startX = e.clientX;
//         startY = e.clientY;
//         originX = parseInt($(list[i].moveDom).css("left"));
//         originY = parseInt($(list[i].moveDom).css("top"));
//         originY2 = parseInt($(list[i].moveDom).css("bottom"));
//         temp = true;
//     }).on("mousemove", function(e) {
//       if (temp) {
//         var _currentX = e.clientX
//         var _currentY = e.clientY
//         var _moveX = _currentX - startX
//         var _moveY = _currentY - startY
//         var _BottomLastLocal = originY + _moveY;
//         var _BottomLastLocal2 = originY2 - _moveY;
//         var _RightLastLocal = originX + _moveX;
//         $(list[i].moveDom).css("top", _BottomLastLocal + "px").css("left", _RightLastLocal + "px").css("bottom",_BottomLastLocal2)
//       }
//     }).on("mouseup", function() {
//       temp = false;
//     })
//   }
// }

var list = [
  {mouseDownDom:"shopping-title",moveDom:".shopping-cart"},
  {mouseDownDom:"car-info-title-move",moveDom:".container-car-info"},
  {mouseDownDom:"car-info-mi-title-move",moveDom:".container-car-mi"},  
  {mouseDownDom:"price-menu-header",moveDom:".price-menu"},
  {mouseDownDom:"title-form-move",moveDom:".share-container"},

  // {mouseDownDom:"commentPlugin",moveDom:"."}
  
]


var index = 0
var tempFlag = false;
$("body").on("mousedown",function(e){
  for(var i = 0; i<list.length; i++){
    if($(e.target).hasClass(list[i].mouseDownDom)){
      index = i
      startX = e.clientX;
      startY = e.clientY;
      originX = parseInt($(list[i].moveDom).css("left"));
      originY = parseInt($(list[i].moveDom).css("top"));
      originY2 = parseInt($(list[i].moveDom).css("bottom"));
      tempFlag = true;
    }
  }
}).on("mousemove",function(e){
  if (tempFlag) {
    if($(e.target).hasClass(list[index].mouseDownDom)){
        var _currentX = e.clientX
        var _currentY = e.clientY
        var _moveX = _currentX - startX
        var _moveY = _currentY - startY
        var _BottomLastLocal = originY + _moveY;
        var _BottomLastLocal2 = originY2 - _moveY;
        var _RightLastLocal = originX + _moveX;
        $(list[index].moveDom).css("top", _BottomLastLocal + "px").css("left", _RightLastLocal + "px").css("bottom",_BottomLastLocal2)
      }
  }
}).on("mouseup", function() {
  tempFlag = false;
})