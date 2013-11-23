/* global document, sendAjaxRequest */

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('form#game').on('submit', initiateGame);
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
//   _____________________________
function htmlInitiateGame(game){
  /*___________________;*/
}