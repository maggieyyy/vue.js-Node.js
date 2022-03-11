let redis = require("../util/redisDB")
const util = require("../util/common")
const { getReturnData } = require("../util/common")
const crypto = require('crypto')
const { resourceLimits } = require("worker_threads")

//添加文章
exports.setArticle = (req,res,next)=>{
    //获取传递的值
    let data = req.body.article
    //任何修改或新上线的文章都不显示
    data.show = 0
    console.log(data)
    let key = ''
    if('a_id' in req.body.article){
        key = req.headers.fapp + ":article:" + req.body.article.a_id
        //存储
        redis.set(key, data)
        res.json(util.getReturnData(0,'修改成功'))
    }else{
        //新文章需要初始化点赞数0、观看数0和时间戳
        data.time = Date.now()
        key = req.headers,fapp + ":article:"
        redis.incr(key).then((id)=>{
            //方便取用
            data.a_id = id
            key = key + id
            //存储文章
            redis.set(key,data)
            //存储分类及小标签
            let a_type = data.type
            //获取
            redis.get(req.headers.fapp + ":a_type:" + a_type).then((data1)=>{
                if(!data1){
                    data1 = []
                }
                //数组对象
                data1.push(key)
                //再次存储
                redis.set(req.headers.fapp + ":a_type:" + a_type,data1)
            })
            //小标签需要循环操作
            let tags = data.tag
            tags.map((item)=>{
                let tKeyMd5 = crypto.createHash('md5').update(item).digest("hex")
                console.log(tKeyMd5)
                redis.get(req.headers.fapp + ':tag:' + tKeyMd5).then((data1)=>{
                    if(!data1){
                        data1 = []
                    }
                    data1.push(key)
                    //再次存储
                    redis.set(req.headers.fapp + ":tag:" + tKeyMd5,data1)
                })
            })
            //新文章需要建立新的有序集合：点赞数0，观看数0和时间戳
            redis.zadd(req.headers.fapp+':a_time',key,Date.now())
            redis.zadd(req.headers.fapp+':a_view',key,0)
            redis.zadd(req.headers.fapp+':a_like',key,0)
            res.json(util.getReturnData(0,'新建文章成功'))
        })
    }
}

//文章的发布和删除
exports.showArticle = (req,res,next)=>{
    //获取传递的值
    let key = req.headers.fapp + ":article:" + req.body.a_id
    redis.get(key).then((data)=>{
        if(!data) res.json(util.getReturnData(404,'没有该文章'))
        //修改显示
        if(data.show==1){
            data.show = 0
        }else{
            data.show = 1
        }
        redis.set(key,data)
    })
    res.json(util.getReturnData(0,'文章修改成功'))
}

//分类的发布
exports.setArticleType=(req,res,next)=>{
    //获取传递的值
    //应当确定的是type中对应的唯一key是不重复的
    let data = req.body.type
    console.log(data)
    let key = req.headers.fapp + ':a_type'
    //根据key直接更新内容
    redis.set(key,data)
    //循环整个传递的值，依次创建唯一id对应的键值对
    data.map((item)=>{
        console.log(item.uid)
        let tKey = req.headers.fapp + ':a_type:' + item.uid
        redis.get(tKey).then((data1)=>{
            if(!data1){
                redis.set(tKey,{})
            }
        })
    })
    res.json(util.getReturnData(0,'创建分类成功'))
}

//获取全部用户
exports.getAllUser = (req,res,next)=>{
    //获取用户key值的模式
    let re = req.headers.fapp + ':user:info:*'
    redis.scan(re).then(async(data)=>{
        //这里通过循环获取用户的详细资料
        let result = data[1].map((item)=>{
            //获取每个用户的username
            return redis.get(item).then((user)=>{
                return {'username':user.username,'login':user.login,'ip':user.ip}
            })
        })
        let t_data = await Promise.all(result)
        res.json(util.getReturnData(0,"",t_data))
    })
}

//封停用户
exports.stopLogin = (req,res,next)=>{
    //获取传递的值
    let key = req.headers.fapp + ':user:info:' + req.params.id
    redis.get(key).then((user) =>{
        if (user.login ==0){
            user.login = 1
        }else{
            user.login = 0
        }
        redis.set(key,user)
        res.json(util.getReturnData(0,'用户修改成功'))
    })
}

//设置首页轮播图片
exports.setIndexPic = (req,res,next) =>{
    let key = req.headers.fapp + ":indexPic"
    //获取传递的值
    let data = req.body.setIndexPic
    console.log(data)
    //存储
    redis.set(key,data)
    res.json(util.getReturnData(0,'修改成功'))
}

//修改导航菜单
exports.setNavMenu = (req,res,next) =>{
    let key = req.headers.fapp + ":nav_menu"
    //获取传递的值
    let data = req.body.nav_menu
    console.log(data)
    //存储
    redis.set(key,data)
    res.json(util.getReturnData(0,'修改成功'))
}

//修改底部内容
exports.setFooter = (req,res,next) =>{
    let key = req.headers.fapp + ":footer"
    //获取传递的值
    let data = req.body.footer
    console.log(data)
    //存储
    redis.set(key,data)
    res.json(util.getReturnData(0,'修改成功'))
}

//修改友情链接
exports.setLinks = (req,res,next) =>{
    let key = req.headers.fapp + ":links"
    //获取传递的值
    let data = req.body.links
    console.log(data)
    //存储
    redis.set(key,data)
    res.json(util.getReturnData(0,'修改成功'))
}
