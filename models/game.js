var mongoose = require('mongoose');
var __ = require('lodash');

var Game = mongoose.Schema({
  player      : String,
  hand        : [],
  initial     : String,
  didWin      : {type: Boolean, default: null},
  // completedAt : Date,
  createdAt   : {type: Date, default: Date.now}
});

Game.pre('save', function(next){
  var shapes = ['bc', 'bs', 'bt', 'rc', 'rs', 'rt', 'yc', 'ys', 'yt'];
  this.initial = __.sample(shapes, 2).join('');

  while(this.hand.length < 15){
    var pair = __.sample(shapes, 2).join('');
    this.hand.push(pair);
    this.hand =  __.uniq(this.hand);
  }

  next();
});

mongoose.model('Game', Game);