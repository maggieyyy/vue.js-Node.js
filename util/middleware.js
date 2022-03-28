let redis = require("../util/redisDB")
// 存放用户状态判断
const {ALLOW_APP} = require('../config/app')
const { redisConfig } = require('../config/db')
const util = require('./common')
exports.checkApp = (req,res,next)=>{
    // if(!ALLOW_APP.includes(req.headers.fapp)){
    //     res.json(util.getReturnData(500,"来源不正确"))
    // }else{
        next()
    // }
}

exports.checkUser = (req,res,next)=>{
    console.log('检测用户登陆情况')
    /*if('token' in req.headers){
        let key = req.headers.fapp+":user:token:"+req.headers.token
        redis.get(key).then((data)=>{
            if(data){
                //保存用户名称
                req.username = data.username
                next()
            }else{
                //key值错误或登录过期已经被删除
                res.json(util.getReturnData(403,"登陆已过期，请重新登陆"))
            }
        })
    }else{
        res.json(util.getReturnData(403,"请登录"))
    }*/
    next()
}

exports.checkAdmin = (req,res,next)=>{
   /* console.log("检测管理员用户")
    console.log(req.username)
    if(req.username == 'admin'){
        //如果是管理员，则在redis中增加一个power
        let key = req.headers.fapp+":user:power:"+req.headers.token
        redis.set(key,'admin')
        next()
    }else{
        res.json(util.getReturnData(403,"权限不足"))
    }*/
    next()
}