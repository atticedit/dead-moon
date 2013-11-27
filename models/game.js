var mongoose = require('mongoose');
var __ = require('lodash');

var Game = mongoose.Schema({
  player      : String,
  hand        : [],
  score       : Number,
  createdAt   : {type: Date, default: Date.now}
});

  //* run before Game is created
Game.pre('save', function(next){
    //* define the 9 possible combinations of shape and color
  var shapes = ['bc', 'bs', 'bt', 'rc', 'rs', 'rt', 'yc', 'ys', 'yt'];

    //* create a loop that will run until this.hand has 16 values
  while(this.hand.length < 16){
      //* define 'pair' as 2 random selections from shapes, concatenated
    var pair = __.sample(shapes, 2).join('');
      //* add the new pair to this.hand
    this.hand.push(pair);
      //* redefine this.hand as itself minus any redundant values
      //*
      //* if the loop reaches 16 and a redundant value is removed, the loop will continue
    this.hand =  __.uniq(this.hand);
  }

    //* called at the end of middleware functions in order to continue
  next();
});

mongoose.model('Game', Game);