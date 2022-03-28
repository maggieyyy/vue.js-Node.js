var express = require('express');
var router = express.Router();
//引入处理逻辑的js文件
var {userLogin, userRegister} = require('../controller/user')
var {checkUser} = require('../util/middleware')
router.post('/login',userLogin)
router.post('/register',userRegister)
router.use('/user',checkUser,require('./userNeedCheck'))

module.exports = router;
