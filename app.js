var express = require('express');
var mongoose = require('mongoose');

  //* model definitions
require('require-dir')('./models');

  //* route definitions
var moon = require('./routes/moon');
var app = express();
mongoose.connect('mongodb://localhost/dead-moon');

  //* configure express
require('./config').initialize(app/*, RedisStore*/);

  //* routes
app.get('/', moon.index);
app.post('/moon/start', moon.start);