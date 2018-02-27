// const webpack = require('webpack')
// const webpackDevMiddleware = require('webpack-dev-middleware');

const app = require('express')()
const fs = require('fs')
const request = require('request')
const bodyParser = require('body-parser')
const superagent = require('superagent')

let myurl = ""
let mycookie = ""
let _basePath

// const config = require('./webpack.config.js');
// const compiler = webpack(config);
// app.use(webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath
// }));

app.get('*', (req, res) => {
    var ServerCookie = req.headers.cookie + ";" + mycookie;
    if(req.url.indexOf(".") == -1 && req.url !== '/logout') {
        let url = myurl + req.url;
        if(req.url.indexOf("/search/vins")!== -1 || req.url.indexOf("/search/parts")!== -1) {
            url = "https://007vin.com" + req.url
        }
        superagent.get(url)
            // 设置些需要的头
            .set('Content-Type', 'application/json;charset=UTF-8')
            // set cookie字段
            // .set('Sys-Language', 'en')    
            .set('Cookie', ServerCookie)
            .end(function(err, response) {
                if (err || !response.ok) {
                    res.send(err);
                } else {
                    //接口返回转发数据，可以在这里处理之后拼装数据
                    res.set('Content-Type', 'application/json');
                    res.send(JSON.stringify(response.body));
                }
            })
    }else {
        
        let _path = req.path

        _path = _path === "/logout" ? _basePath : _path
        if (_path.includes('.html')) {
            _basePath = _path
            let type = _path.slice(-1)
            if(type == 1) {
                myurl = "http://192.168.10.111"
            }else if(type == 2) {
                myurl = "https://test.007vin.com"
            }else if(type == 3) {
                myurl = "https://007vin.com"
            }
            // let _realPath = _path.slice(0,-1)
            let _realPath = _path.split(".html")[0]
            _realPath = _realPath + '.html'
            let regHost1 = /http:\/\/192.168.10.111\//g
            let regHost2 = /https:\/\/cdns.007vin.com\//g
            fs.readFile(__dirname + _realPath, (err, data) => {
                data = data.toString().replace(regHost1, '')
                data = data.toString().replace(regHost2, '')
                res.send(data)
            })
        }else if (_path.includes('jquery.min.map'));
        else res.sendFile(`${__dirname + req.path}`)
    }
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("*", (req, res) => {
    let url = myurl + req.url;
    var ServerCookie = req.headers.cookie +";"+mycookie;
    superagent.post(url)
        // 设置些需要的头
        .set('Content-Type', 'application/json;charset=UTF-8')
        .set('Sys-Language', 'en')
        // set cookie字段
        .set('Cookie', ServerCookie)
        .send(req.body)
        .end(function(err, response) {
            if (err || !response.ok) {
                res.send(err);
            } else {
                //接口返回转发数据，可以在这里处理之后拼装数据
                res.set('Content-Type', 'application/json');
                // res.set("")
                let cookie = response.header['set-cookie']             //从response中得到cookie
                if(cookie){
                    mycookie = cookie.toString().replace(/Path=\/,/g,"")
                }
                res.cookie(mycookie)
                res.send(JSON.stringify(response.body));
            }
        })
})

const host = '0.0.0.0'
app.listen(8083, host, () => {
    console.log(`start ${host} 8083`)
})
