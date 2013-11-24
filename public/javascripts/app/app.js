/* global document, sendAjaxRequest */

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('form#game').on('submit', initiateGame);
  $('#hand').on('click', '.card', clickCard);
}

function initiateGame(e){
  var player = $('input[name="player"]').val();
  var url = '/moon/start?player=' + player;

  // sendAjaxRequest expects values in this order:
  //   url, data, verb, altVerb, event, successFn
  sendAjaxRequest(url, {}, 'post', null, e, function(data){
    htmlInitiateGame(data);
  });
}

// called by initiateGame after the ajax request returns data
//
// exports.start used this line to tell the server what data it should send back:
//   res.send({hand: game.hand, id: game.id});
function htmlInitiateGame(game){
  $('form#game').remove();
  $('#run').removeClass('hidden');

  var cards = _.map(game.hand, function(h, i){return '<div class="card ' + game.hand[i] + '" data-position="' + i + '"></div>';});
  $('#hand').append(cards);
  $('#hand').attr('data-id', game.id);
}

function clickCard(){
  $(this).addClass('fadeout');
}