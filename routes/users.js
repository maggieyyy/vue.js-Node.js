var express = require('express');
var router = express.Router();
//引入处理逻辑的js文件
var {userLogin, userRegister} = require('../controller/user')
var {checkUser} = require('../util/middleware')
router.post('/login',userLogin)
router.post('/register',userRegister)
console.log(checkUser)
router.use('/user',require('./userNeedCheck'))

module.exports = router;
