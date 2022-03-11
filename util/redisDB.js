//该文件用以连接数据库，并对数据库提供的方法进行改写和盖封装
let redis = require('redis');
// 获取数据库的配置
const {redisConfig} = require("../config/db")
// 获取redis连接
const redis_client = redis.createClient(redisConfig)
// 连接成功
redis_client.on("connect",()=>{
    console.log("连接成功")
})
// 错误处理
redis_client.on("error",(err)=>{
    console.log("err")
})

redis = {};

// 根据模式获取全部key 
keys = async(cursor, re, count) =>{
    let getTempKeys = await new Promise((resolve)=>{
        //从连接中获取该值并返回
        redis_client.scan([cursor,"MATCH",re,"COUNT",count],(err,res)=>{
            console.log(err)
            return resolve(res)
        })
    })
    return getTempKeys
}

redis.scan = async (re,cursor = 0, count=100)=>{
    return await keys(cursor,re,count)
}

// 设置该值进入数据库 set
redis.set = (key, value)=>{
    //将所有对象转换为JSON字符串进行保存
    //如果字符串过大，会导致性能下降
    value = JSON.stringify(value);
    return redis_client.set(key, value, (err) =>{
        if(err){
            console.log(err)
        }
    })
}

// 获取text，在获取时可以使用then调用 get
text = async(key)=>{
    let getTempValue = await new Promise((resolve)=>{
        //从连接中获取该值并返回
        redis_client.get(key,(err,res)=>{
            return resolve(res)
        })
    })
    getTempValue = JSON.parse(getTempValue)
    return getTempValue
}

// 获取返回的值
redis.get = async(key) =>{
    return await text(key)
}

//设置key的过期时间
redis.expire = (key, ttl)=>{
    redis_client.expire(key, parseInt(ttl))
}

//获取自增id
id = async(key)=>{
    console.log("查找"+key)
    let id = await new Promise((resolve)=>{
        redis_client.incr(key,(err,res)=>{
            console.log(res)
            return resolve(res)
        })
    })
    console.log(id)
    return id
}
redis.incr = async(key) =>{
    return await id(key)
}

//有序集合
//新增有序集合（键名，成员和分值）
redis.zadd = (key,member,num) =>{
    member = JSON.stringify(member)
    redis_client.zadd(key,num,member,(err)=>{
        if(err){
            console.log(err)
        }
    })
}

//获取一定范围内的元素
tempData = async(key,min,max)=>{
    let tData = await new Promise((resolve)=>{
        redis_client.zrevrange([key,min,max,'WITHSCORES'],(err,res)=>{
            return resolve(res)
        })
    })
    //同时获取分值，需要转换为对象
    let oData = []
    //构造
    for (let i = 0; i<tData.length;i =i+2){
        oData.push({member:JSON.parse(tData[i]),score:tData[i+1]})
    }
    return oData
}

redis.zrevrange = async(key, min=0,max=-1)=>{
    return tempData(key,min,max)
}

//有序集合的自增操作
redis.zincrby = (key,member,NUM=1)=>{
    member = JSON.stringify(member)
    redis_client.zincrby(key,NUM,member,(err)=>{
        if(err) console.log(err)
    })
}

//有序集合通过member获取其score值
tempZscore = async(key,member)=>{
    member = JSON.stringify(member)
    return await new Promise((resolve)=>{
        redis_client.zscore(key,member,(err,res)=>{
            console.log(res)
            return resolve(res)
        })
    })
}

redis.zscore = async(key,member)=>{
    return tempZscore(key,member)
}

module.exports = redis