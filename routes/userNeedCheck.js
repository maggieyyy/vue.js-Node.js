var express = require('express')
var router = express.Router()

var {articleTalk,getUserInfo,changeUserInfo,sendMail,getMails,getUserMail,getArticleType,
    articleLike,articleCollection,getCollection} = require('../controller/userNeedCheck')
//评论
router.post('/article/talk',articleTalk)
//查看用户资料
router.get('/info/:username',getUserInfo)
//修改用户资料
router.post('/changeInfo',changeUserInfo)
//发送私信
router.post('/mail/:username',sendMail)
//获取私信列表
router.get('/mailsGet',getMails)
//获取私信
router.get('/mailGet/:id',getUserMail)
//文章分类
router.get('/getArticleType',getArticleType)
//文章“点赞”和踩“
router.get('/like/:id/:like',articleLike)
//文章收藏
router.get('/save/:id',articleCollection)
//获取收藏文章列表
router.get('/saveList',getCollection)

module.exports = router