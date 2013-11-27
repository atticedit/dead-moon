//* START *// working version that prevents duplicates within the hand but allows them betwen initial and hand
           // (separate creation of initial and hand also isn't justified)

// Game.pre('save', function(next){
//   var shapes = ['bc', 'bs', 'bt', 'rc', 'rs', 'rt', 'yc', 'ys', 'yt'];
//   this.initial = __.sample(shapes, 2).join('');

//   while(this.hand.length < 15){
//     var pair = __.sample(shapes, 2).join('');
//     this.hand.push(pair);
//     this.hand =  __.uniq(this.hand);
//   }

//   next();
// });

///* END */// working version that prevents duplicates within the hand but allows them betwen initial and hand



//* START *// working version that allows duplicates

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

///* END */// working version that allows duplicates