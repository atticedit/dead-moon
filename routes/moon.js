var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var coloring = require('colors');
  //* once colors (or 'coloring' or any other name given for it) is initially defined, JSHint only accepts it
  //*   if it's used by name somewhere else
  //* logging satisfies that, and logging only index 0 prevents a verbose log
console.log(coloring[0]);
// var __ = require('lodash');

// Colors: bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow, zebra, random

/*
 * GET /
 */

exports.index = function(req, res){
    //* log the actual text 'moon.index' with the given styling
  console.log('moon.index'.bold.italic.underline.inverse);
    //* render the html from views/moon/index.jade with the title given
  res.render('moon/index', {title: 'Dead Moon'});
};

/*
 * POST /moon/start
 */

  //* when an ajax request is sent using the URL set up in initiateGame in app.js...
exports.start = function(req, res){
  console.log('moon.start'.bold.italic.underline.inverse);
  new Game(req.query).save(function(err, game){
    res.send({hand: game.hand, initial: game.initial, id: game.id});
    console.log(game);
  });
};