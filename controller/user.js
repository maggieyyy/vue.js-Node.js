let redis = require("../util/redisDB")
const util = require('../util/common')
const crypto = require('crypto')
const e = require("express")

exports.userRegister = (req,res,next)=>{
    //获取用户名、密码和其他资料
    let username = req.body.username
    let password = req.body.password
    let ip = req.ip
    if(username||password){
    let key = 'book:user:info:'+username
    redis.get(key).then((user)=>{
        if(user){
            res.json(res.json(util.getReturnData(1,'用户已经存在')))
        }else{
            let userData = {
                username:username,
                phone:'phone' in req.body?req.body.phone:'未知',
                nikename:'nikename' in req.body?req.body.nikename:'未知',
                age:'age' in req.body?req.body.age:'未知',
                sex:'sex' in req.body?req.body.sex:'未知',
                password:password,
                ip:ip,
                login:0
            }
            //存储数据，注册成功
            redis.set(key,userData)
            res.json(util.getReturnData(0,'注册成功，请登陆'))
            }
        })
    }else{
        res.json(util.getReturnData(1,'资料不完整'))
    }
}

exports.userLogin = (req,res,next)=>{
    //获取用户名、密码和其他资料
    let username = req.body.username
    let password = req.body.password
    let key = req.headers.fapp + ":user:info:" + username
    redis.get(key).then((data)=>{
        if(data){
            if(data.login == 0){
                if(data.password != password){
                    res.json(util.getReturnData(1,'用户名或者密码错误'))
                }else{
                    //生成简单的token，根据用户名和当前时间戳直接生成md5值
                    let token = crypto.createHash('md5').update(Date.now()+username).digest('hex')
                    let tokenKey = req.headers.fapp + ":user:token:"+token
                    //为了方便查找，将user的资料放在以token为键的k-v对象中
                    delete data.password
                    //写入数据库并设置过期时间
                    redis.set(tokenKey,data)
                    //设置1000s过期
                    redis.expire(tokenKey,1000)
                    res.json(util.getReturnData(0,'登陆成功',{token:token}))
                }
            }
            else{
                res.json(util.getReturnData(1,'用户被封停'))
                }
        }else{
            res.json(util.getReturnData(1,'用户名或者密码错误'))
    }})
}