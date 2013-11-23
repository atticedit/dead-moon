var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var colors = require('colors');
// var __ = require('lodash');

// Colors
// bold, italic, underline, inverse, yellow, cyan,
// white, magenta, green, red, grey, blue, rainbow,
// zebra, random

/*
 * GET /
 */

exports.index = function(req, res){
  // log the actual text 'moon.index' with the given styling
  console.log('moon.index'.bold.italic.underline.blue);
  // render the html from views/moon/index.jade with the title given
  res.render('moon/index', {title: 'Dead Moon'});
};

/*
 * POST /moon/start
 */

// when an ajax request is sent using the URL set up in initiateGame in app.js...
exports.start = function(req, res){
  console.log('moon.start'.bold.italic.underline.blue);
  new Game(req.query).save(function(err, game){
    res.send({hand: game.hand, id: game.id});
  });
};