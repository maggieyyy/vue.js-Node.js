var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {checkApp,checkAdmin,checkUser} = require('./util/middleware')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log(checkApp)
app.use('/', checkApp,indexRouter);
app.use('/users', usersRouter);
app.use('/admin',[checkApp,checkUser,checkAdmin],adminRouter)

module.exports = app;
