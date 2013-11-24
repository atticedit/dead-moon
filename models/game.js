var mongoose = require('mongoose');
var __ = require('lodash');

var Game = mongoose.Schema({
  player      : String,
  hand        : [],
  didWin      : {type: Boolean, default: null},
  // completedAt : Date,
  createdAt   : {type: Date, default: Date.now}
});

Game.pre('save', function(next){
  while(this.hand.length < 15){
    var shapes = ['bc', 'bs', 'bt', 'rc', 'rs', 'rt', 'yc', 'ys', 'yt'];
    var pair = __.sample(shapes, 2).join('');
    this.hand.push(pair);
    __.uniq(this.hand);
  }

  next();
});

// START working version that outputs duplicates //

// Game.pre('save', function(next){
//   if(!this.hand.length){
//     for(var i = 0; i < 15; i++){
//       var shapes = ['bc', 'bs', 'bt', 'rc', 'rs', 'rt', 'yc', 'ys', 'yt'];
//       var pair = __.sample(shapes, 2).join('');
//       this.hand.push(pair);
//     }
//   }
//   next();
// });

// END //

mongoose.model('Game', Game);