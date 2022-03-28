let redis = require("../util/redisDB")
const util = require("../util/common")
const { getReturnData } = require("../util/common")
const crypto = require('crypto')
//菜单
exports.getNavMenu = (req,res,next) =>{
    // let key = req.headers.fapp +":nav:menu"
    let key ="book:nav:menu"
    //获取数据
    redis.get(key).then((data)=>{
        res.json(util.getReturnData(0,'',data))
    })
}

//footer
exports.getFooter = (req,res,next) =>{
    let key = req.headers.fapp +":footer"
    //获取数据
    redis.get(key).then((data)=>{
        res.json(util.getReturnData(0,'',data))
    })
}

//友情链接
exports.getLinks = (req,res,next) =>{
    let key = req.headers.fapp +":links"
    //获取数据
    redis.get(key).then((data)=>{
        res.json(util.getReturnData(0,'',data))
    })
}

//轮播
exports.getIndexPic = (req,res,next) =>{
    let key = req.headers.fapp +":indexPic"
    //获取数据
    redis.get(key).then((data)=>{
        console.log(data)
        res.json(util.getReturnData(0,'',data))
    })
}

//热点文章列表
exports.getHotArticle = (req,res,next) =>{
    let key = req.headers.fapp +":a_view"
    //获取集合，只取0、1、2、3、4五条数据
    redis.zrevrange(key,0,-1).then(async (data)=>{
        console.log('getzre'+data)
        let result = data.map((item) =>{
            //获取每篇文章的题目、ID及日期
            return redis.get(item.member).then((data1)=>{
                console.log('hot@'+data1)
                if(data1 && data1.show !=0){
                    return{
                        'title':data1.title,
                        'data':util.getLocalDate(data1.time),
                        'id':data1.a_id,
                        'view':item.score
                    }
                }else{
                    return {'title':'文章暂未上线','data':'','id':0}
                }
            })
        })
        let t_data = await Promise.all(result)
        res.json(util.getReturnData(0,'',t_data))
    })
}

//最新文章列表,如果用户有管理员权限，应当获得所有文章
exports.getNewArticle = (req,res,next) =>{
    let key = req.headers.fapp +":a_time"
    let isAdmin = false
    console.log('getna'+key)
    if('token' in req.headers){
        console.log('getna@t')
        let pKey = req.headers.fapp + ":user:power:" + req.headers.token
        redis.get(pKey).then((power)=>{
            console.log('power'+power)
           if(power == 'admin'){
                 //获取集合，只取0、1、2、3、4五条数据
                redis.zrevrange(key,0,20).then(async (data)=>{
                    console.log('getna'+data)
                    let result = data.map((item) =>{
                        //获取每篇文章的题目、ID及日期
                        return redis.get(item.member).then((data1)=>{
                            console.dir(data1)
                            if(data1){
                                return{
                                    'title':data1.title,
                                    'data':util.getLocalDate(data1.time),
                                    'id':data1.a_id,
                                    'show':data1.show
                                }
                            }
                        })
                    })
                    let t_data = await Promise.all(result)
                    console.log('getna'+t_data)
                    res.json(util.getReturnData(0,'',t_data))
                })
             }else{
                    //获取集合，只取0、1、2、3、4五条数据
                    redis.zrevrange(key,0,-1).then(async (data)=>{
                        console.log('getna'+data)
                        let result = data.map((item) =>{
                            //获取每篇文章的题目、ID及日期
                            return redis.get(item.member).then((data1)=>{
                                console.dir(data1)
                                if(data1 && data1.show !=0){
                                    return{
                                        'title':data1.title,
                                        'data':util.getLocalDate(data1.time),
                                        'id':data1.a_id,
                                        'show':data1.show
                                    }
                                }
                            })
                        })
                        let t_data = await Promise.all(result)
                        console.log('getna'+t_data)
                        res.json(util.getReturnData(0,'',t_data))
                    })
                }
        })
    }else{
        console.log('!getna@t')
        //获取集合，只取0、1、2、3、4五条数据
        redis.zrevrange(key,0,-1).then(async (data)=>{
            console.log(data)
            let result = data.map((item) =>{
                //获取每篇文章的题目、ID及日期
                return redis.get(item.member).then((data1)=>{
                    console.log(data1)
                    if(data1 && data1.show !=0){
                        return{
                            'title':data1.title,
                            'data':util.getLocalDate(data1.time),
                            'id':data1.a_id,
                        }
                    }else{
                        return {'title':'文章暂未上线','data':'','id':0}
                    }
                })
            })
            let t_data = await Promise.all(result)
            res.json(util.getReturnData(0,'',t_data))
        })
    }
}

//根据id获取文章的基本内容
exports.getArticle = (req,res,next) =>{
    let key = req.headers.fapp +":article:"+req.params.id
    redis.get(key).then(async (data)=>{
        console.log(data)
        //判断是否显示文章内容
        if(data){
            if(data.show ==1){
                //获取文章分类详情
                redis.get(req.headers.fapp+":a_type").then((type)=>{
                    type.map((item)=>{
                        if(item.uid == data.type){
                            data.typename = item.name
                        }
                    })
                    //获取文章的阅读量
                    redis.zscore(req.headers.fapp+":a_view",key).then((view)=>{
                        console.log(view)
                        data.view = view?view:0
                        //获取文章的点赞量
                        redis.zscore(req.headers.fapp+":a_like",key).then((like)=>{
                            data.like = like?like:0
                            res.json(util.getReturnData(0,'success',data))
                        })
                    })
                })
            }else{
                res.json(util.getReturnData(403,'该文章已经被删除或者不存在'))
            }
        }else{
            res.json(util.getReturnData(404,'该文章已经被删除或者不存在'))
        }
    })
}

//获取文章评论
exports.getArticleTalk = (req,res,next) =>{
    let key = req.headers.fapp +":article:"+req.params.id+":talk"
    //获取数据
    redis.get(key).then((data)=>{
        console.log(data)
        res.json(util.getReturnData(0,'',data))
    })
}

//根据小标签或者分类获取所有的文章
exports.getArticles = (req,res,next)=>{
    let key = req.headers.fapp
    console.log(req.body)
    if('tag' in req.body){
        let tKeyMd5 = crypto.createHash('md5').update(req.body.tag).digest("hex")
        key = key + ':tag:' + tKeyMd5
        console.log(key)
    }else if('type' in req.body){
        key = key +':a_type:'+req.body.type
        console.log(key)
    }else{
        res.json(util.getReturnData(1,'数据参数错误'))
        return
    }
    redis.get(key).then(async(data)=>{
        console.log(data)
        let result = data.map((item) =>{
            return redis.get(item).then((data1)=>{
                console.log(data1)
                if(data1&&data1.show!=0){
                    return{
                        'title':data1.title,
                        'data':util.getLocalDate(data1.time),
                        'id':data1.a_id,
                    }
                }else{
                    return {'title':'文章暂未上线','data':'','id':0}
                }
                })
            })
        let t_data = await Promise.all(result)
        res.json(util.getReturnData(0,'',t_data))
    })
}

//获取文章评论
exports.viewArticle = (req,res,next) =>{
    let key = req.headers.fapp +":article:"+req.params.id
    //获取数据
    redis.zincrby(req.headers.fapp+':a_view',key)
    res.json(util.getReturnData(0,'success'))
}
