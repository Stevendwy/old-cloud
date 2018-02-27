import cAjax from './canvasAjax'  //canvasAjax指纹模块  cAjax.send()
export default () => {
  // 页面相关
  function homepageAjax() {
    $.get('/homepage/milestone', {}, function (res) {
      var runsData = res

      var runners = {
        cars: document.getElementById('run-cars'),
        brands: document.getElementById('run-brands'),
        parts: document.getElementById('run-parts')
      }

      var runTimes = 10
      var runInterval = setInterval(function () {
        if (runTimes < 1) {
          clearInterval(runInterval)
          return
        }
        runners.cars.innerText = parseInt(runsData.cars / runTimes)
        runners.brands.innerText = parseInt(runsData.brands / runTimes)
        runners.parts.innerText = parseInt(runsData.parts / runTimes)
        runTimes--
      }, 100)
    })

    $.get('/homepage/carousel', {}, function (res) {
      var bannersPointsContainer = document.getElementById('homepage-index-points')

      var bannersData = res

      homepageBanners.list = bannersData.data

      var list = homepageBanners.list
      if(list.length <= 1) homepageBanners.onlyOne = true // 这里计算是否只有一个

      list.unshift(list[list.length - 1]) // 首部加最后一个
      list.push(list[1]) // 尾部加上源数据第一个

      var bannersLength = list.length

      list.forEach(function (banner, index) {
        var left = "left: " + index * 100 + "%"
        var src = banner.img
        var _cursor = banner.url == "" ? "default" : "pointer"
        // var cursor = ";cursor: " + _cursor
        var cursor = ";cursor: pointer"
        
        homepageBanners.dom.innerHTML += "<img class='banner' style=\'" + left + cursor + "\' src=\'" + src + "\' onclick='bannerClick()'/>"
        if (index > 0 && index < bannersLength - 1) {
          var pointClass = 'index-point'
          if (index === homepageBanners.currentIndex) pointClass += ' selected'
          bannersPointsContainer.innerHTML += "<div class=\'" + pointClass + "\' onclick='indexPointClick(" + index + ")'></div>"
        }
      })

      bannersScrollLeft()
    })
  }

  var homepageBanners = {
    dom: document.getElementById('homepage-banners'),
    currentIndex: 1,
    list: null,
    animating: false, // 是否动画中
    timer: 0, // fps 计时器
    maxTimer: 30, // fps
    interval: null, // 滚动时间计时器
    autoInterval: null, // 自动切换 interval
    onlyOne: false
  }

  homepageAjax()

  window.closeFloatImg = function() {
    document.getElementById("carousel-img-float").style.display = "none"
  }

  window.bannerClick = function() {
    // console.log(homepageBanners.currentIndex)
    let url = homepageBanners.list[homepageBanners.currentIndex].url
    if (url.length < 1) {
      let _src = homepageBanners.list[homepageBanners.currentIndex].img
      document.getElementById("float-carousel-img").setAttribute("src", _src)
      document.getElementById("carousel-img-float").style.display = "block"
    }
    else window.open(url)
    // else location.href = url    
  }
  
  window.carouselPrevious = function() {
    if (homepageBanners.animating || homepageBanners.onlyOne) return

    homepageBanners.currentIndex--
    if (homepageBanners.currentIndex < 1) homepageBanners.currentIndex = homepageBanners.list.length - 2
    bannersScrollLeft(-1)
  }

  window.carouselNext = function() {
    if (homepageBanners.animating || homepageBanners.onlyOne) return

    homepageBanners.currentIndex++
    if (homepageBanners.currentIndex >= homepageBanners.list.length - 1) homepageBanners.currentIndex = 1
    bannersScrollLeft(1)
  }

  window.carouselAuto = function() {
    if(homepageBanners.onlyOne) return
    homepageBanners.autoInterval = setInterval(carouselNext, 5000)
  }

  // 页码点击
  window.indexPointClick = function(index) {
    // homepageBanners.currentIndex = index
    // bannersScrollLeft()
  }

  function bannersScrollLeft(direction) {
    homepageBanners.animating = true
    clearInterval(homepageBanners.autoInterval)

    var width = homepageBanners.dom.offsetWidth / homepageBanners.maxTimer
    var oldScrollLeft = homepageBanners.dom.scrollLeft

    homepageBanners.interval = setInterval(function () {
      homepageBanners.timer++
      homepageBanners.dom.scrollLeft = width * homepageBanners.timer * direction + oldScrollLeft// homepageBanners.currentIndex * homepageBanners.dom.offsetWidth

      if (homepageBanners.timer >= homepageBanners.maxTimer) {
        homepageBanners.timer = 0
        homepageBanners.animating = false
        homepageBanners.dom.scrollLeft = homepageBanners.currentIndex * homepageBanners.dom.offsetWidth
        clearInterval(homepageBanners.interval)
        checkBannersPointsFocus() // 检查下方的点点
        carouselAuto()
      }
    }, 10)
  }

  function checkBannersPointsFocus() {
    var bannersPoints = document.getElementsByClassName('index-point')
    for (var i = 0, j = bannersPoints.length; i < j; i++) {
      var point = bannersPoints[i]
      if (i + 1 === homepageBanners.currentIndex) point.setAttribute('class', 'index-point selected')
      else point.setAttribute('class', 'index-point')
    }
  }

  // 登录相关
  var loginCarrier = {
    username: document.querySelector('#login-username'),
    usernameClear: document.querySelector('#login-username-clear'),
    password: document.querySelector('#login-password'),
    passwordClear: document.querySelector('#login-password-clear'),
    passwordCaps: document.querySelector('#login-password-caps'),
    passwordCurrentLength: 0,
    remember: document.querySelector('#login-remember'),
    isLoging: false
  }

  function userInfoLocalCheck() {
    loginCarrier.username.value = localStorage.getItem('ppy-login-username')
    loginCarrier.password.value = localStorage.getItem('ppy-login-password')
  
    if (loginCarrier.username.value.length > 0) {
      loginCarrier.remember.checked = true
      loginCarrier.usernameClear.style.display = 'block'
    }else loginCarrier.usernameClear.style.display = 'none'
    if(loginCarrier.password.value.length > 0) {
      loginCarrier.remember.checked = true
      loginCarrier.passwordClear.style.display = 'block'
    }else loginCarrier.passwordClear.style.display = 'none'
  }

  setTimeout(userInfoLocalCheck, 100)

  window.login = function() {
    if(loginCarrier.isLoging) return

    var username = loginCarrier.username.value
    if (username.length < 1) {
      alert("请输入手机号")
      return
    }
    var password = loginCarrier.password.value
    if (password.length < 1) {
      alert("请输入密码")
      return
    }
    $('#homepage-login-loading').css('display', 'block')
    loginCarrier.isLoging = true

    setTimeout(function() {
      $('#homepage-login-loading').css('display', 'none')
      loginCarrier.isLoging = false
    }, 2000)

    var query = "?username=" + username + "&password=" + password
    $.post('/login' + query, {}, function (res) {
      cAjax.send();
      $('#homepage-login-loading').css('display', 'none')    
      loginCarrier.isLoging = false
      if (res.code !== 1) alert(res.msg)
      else {
        window.haveLogin()
        homepageRemoveLogin()
      }
    })
  }

  window.homepageRemoveLogin = function() {
    var login = document.querySelector('#homepage-login')
    var loginParent = login.parentNode
    loginParent.removeChild(login)
  }

  window.clearUsername = function() {
    loginCarrier.username.value = ''
    loginCarrier.usernameClear.style.display = 'none'
  }

  window.loginUsernameInput = function(e) {
    var value = e.target.value
    if (value.length < 1) loginCarrier.usernameClear.style.display = 'none'
    else loginCarrier.usernameClear.style.display = 'block'
  }

  window.clearPassword = function() {
    loginCarrier.password.value = ''
    loginCarrier.passwordClear.style.display = 'none'
  }

  window.loginPasswordInput = function(e) {
    var value = e.target.value
    if (value.length < 1) loginCarrier.passwordClear.style.display = 'none'
    else loginCarrier.passwordClear.style.display = 'block'
    checkInputUpper(value)
  }

  function checkInputUpper(value) {
    var newLength = value.length
    if (newLength < 1) loginCarrier.passwordCaps.style.display = 'none'
    else {
      // 文字长度有变化
      if (newLength !== loginCarrier.passwordCurrentLength) {
        // 文字是新增
        if (newLength > loginCarrier.passwordCurrentLength) {
          var capsReg = new RegExp(/[A-Z]/)
          var lastCar = value.replace(/.*(.)$/, '$1')
          var isUpper = capsReg.test(lastCar)
          if (isUpper) loginCarrier.passwordCaps.style.display = 'block'
          else loginCarrier.passwordCaps.style.display = 'none'
        }
      }
    }
    loginCarrier.passwordCurrentLength = newLength
  }

  window.passwordKeyEvent = function(e) {
    if (e.target.value.length < 1) return

    var keyCode = e.which || e.keyCode
    if (keyCode === 13) login() // 回车
    else if (keyCode === 20) { // 大小写
      if (loginCarrier.passwordCaps.style.display === 'block') loginCarrier.passwordCaps.style.display = 'none'
      else loginCarrier.passwordCaps.style.display = 'block'
    }
  }

  window.rememberChange = function(e) {
    var checked = e.target.checked
    if (checked) {
      localStorage.setItem('ppy-login-username', loginCarrier.username.value)
      localStorage.setItem('ppy-login-password', loginCarrier.password.value)
    }
    else {
      localStorage.setItem('ppy-login-username', '')
      localStorage.setItem('ppy-login-password', '')
    }
  }
}