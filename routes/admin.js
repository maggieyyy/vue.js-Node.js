var express = require('express')
var router = express.Router()
var {setArticle,showArticle,setArticleType,getAllUser,stopLogin,setIndexPic,setNavMenu,
    setFooter,setLinks} = require('../controller/admin')

//发布文章
router.post('/setArticle',setArticle)
//发布和删除文章
router.post('/showArticle',showArticle)
//分类的发布
router.post('/setArticleType',setArticleType)
//获取所有的用户
router.get('/getAllUser',getAllUser)
//用户封停操作
router.get('/stopLogin',stopLogin)
//修改首页轮播图片
router.post('/setIndexPic',setIndexPic)
//修改导航菜单
router.post('/changeNav',setNavMenu)
//修改底部内容
router.post('/setFooter',setFooter)
//修改友情链接
router.post('/setLinks',setLinks)
module.exports= router