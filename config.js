var express = require('express');
var path = require('path');
var less = require('express-less');

exports.initialize = function(app){
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/less', less(__dirname + '/less', { compress: true }));
  // app.use(express.cookieParser());
  // app.use(express.session({
  //   store : new RedisStore({host: 'localhost', port: 6379}),
  //   secret: 'change-this-to-a-super-secret-message',
  //   cookie: { maxAge: 60 * 60 * 1000 }
  // }));
  app.use(app.router);

  if ('development' === app.get('env')) {
    app.use(express.errorHandler());
  }
};
