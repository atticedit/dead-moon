/* global document, sendAjaxRequest */

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('form#game').on('submit', submitForm);
  $('#hand').on('click', '.card', clickCard);
}

//                                                                    //
// -------------------------- event handlers ------------------------ //
//                                                                    //

function submitForm(e){
  var player = $('input[name="player"]').val();
  var url = '/moon/start?player=' + player;

  // sendAjaxRequest expects values in this order:
  //   url, data, verb, altVerb, event, successFn
  sendAjaxRequest(url, {}, 'post', null, e, function(data){
    htmlInitiateGame(data);
  });
}

// called by the initialize function when a dynamically created div is clicked
function clickCard(){
  // --TEMPORARY-- add a class of 'matched'
  // $(this).addClass('matched');
  // add a class of 'clicked'
  $(this).addClass('clicked');
  checkForMatch();
}

//                                                                    //
// ------------------------------ html ------------------------------ //
//                                                                    //

// called by submitForm after the ajax request returns data
//
// exports.start used this line to tell the server what data it should send back:
//   res.send({hand: game.hand, initial: game.initial, id: game.id});
function htmlInitiateGame(game){
  // remove the form from the page
  $('form#game').remove();
  // reveal the area below the header for assembling a run
  $('#buffer').removeClass('hidden');
  $('#trough').removeClass('hidden');
  // create a div for the inital card the player tries to match to
  var initial = '<div class="run ' + game.initial + '"></div>';
  // add the initial card to the run area
  $('#run').append(initial);

  // convert the hand returned by the server to a series of divs, each with class names of
  //   'card' and the code that defines its shapes
  var cards = _.map(game.hand, function(h, i){return '<div class="card ' + game.hand[i] + '"></div>';});

  // * * (earlier version that included a data-position) * *
  // var cards = _.map(game.hand, function(h, i){return '<div class="card ' + game.hand[i] + '" data-position="' + i + '"></div>';});

  // add the card to the hand area
  $('#hand').append(cards);
  // give the parent div a data attribute of the game id
  $('#hand').attr('data-id', game.id);
}

// called by checkForMatch if a match is found
function htmlAddCardToRun(){
  // add a class of 'matched', which fades the card out from its position
  $('.clicked').addClass('matched');
  $('.matched').removeClass('clicked');
  var shape = $('.matched').attr()


  // TO DO -- add the card to #run, possibly with a graceful animation
  // TO DO -- test if last-child of parent will spotlight the newest card
  //          - if not figure out how to make both of the steps below work
  //            - add a class of 'newest-match' to the card
  //            - remove the class of 'newest-match' to the previous card
}

// called by checkForMatch if a match isn't found
function htmlIndicateFailedMatch(){

}


//                                                                    //
// --------------------------- evaluations -------------------------- //
//                                                                    //

// called by clickCard
function checkForMatch(){

  // if there's a match
  htmlAddCardToRun();
  // if there's no match
  // htmlIndicateFailedMatch();
}