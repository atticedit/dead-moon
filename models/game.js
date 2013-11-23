var mongoose = require('mongoose');
// var __ = require('lodash');

var Game = mongoose.Schema({
  player    : String,
  hand      : [{}],
  didWin    : {type: Boolean, default: null},
  createdAt : {type: Date, default: Date.now}
});

Game.pre('save', function(next){

  // next();
});

mongoose.model('Game', Game);