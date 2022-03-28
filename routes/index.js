var express = require('express');
var router = express.Router();
const util = require('../util/common')
var {getNavMenu,getFooter,getLinks,getIndexPic,getHotArticle,getNewArticle,getArticle,
    getArticleTalk,getArticles,viewArticle} = require('../controller/getData')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//获取footer显示内容
router.get('/getFooter',getFooter)

//获取菜单
router.get('/getNavMenu',getNavMenu)

//获取友情链接
router.get('/getLinks',getLinks)

//获取首页轮播图片
router.get('/getIndexPic',getIndexPic)

//获取热点文章
router.get('/getHotArticle',getHotArticle)

//获取最新文章列表
router.get('/getNewArticle',getNewArticle)

//获取文章的详情
router.get('/getArticle/:id',getArticle)

//获取文章评论
router.get('/getArticleTalk/:id',getArticleTalk)

//获取小标签或者文章分类的内容
router.post('/getArticles',getArticles)

//文章被查看数自动+1
router.get('/viewArticle/:id',viewArticle)
module.exports = router;
