/* global document, sendAjaxRequest */

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('form#game').on('submit', submitForm);
  $('#hand').on('click', '.available', clickCard);
}

//                                                                    //
// -------------------------- event handlers ------------------------ //
//                                                                    //

function submitForm(e){
  var player = $('input[name="player"]').val();
  var url = '/moon/start?player=' + player;

    //* the sendAjaxRequest function expects values in this order:
    //*   url, data, verb, altVerb, event, successFn
  sendAjaxRequest(url, {}, 'post', null, e, function(data){
      //* call the function that will update the DOM
    htmlInitiateGame(data);
  });
}

  //* called by the initialize function when a dynamically created div is clicked
function clickCard(){
    //* add a class of 'clicked'
  $(this).addClass('clicked');
    //* call the function that will check for a match
  checkForMatch();
}

//                                                                    //
// ------------------------------ html ------------------------------ //
//                                                                    //

  //* called by submitForm after the ajax request returns data
  //*
  //* exports.start used this line to tell the server what data it should send back:
  //*   res.send({hand: game.hand, initial: game.initial, id: game.id});
function htmlInitiateGame(game){
    //* remove the form from the page
  $('form#game').remove();
    //* reveal the area below the header for assembling a run
  $('#buffer').removeClass('hidden');
  $('#trough').removeClass('hidden');
    //* create a div for the initial card to match to
  var initial = '<div class="run ' + game.initial + '" data-pair="' + game.initial + '"></div>';
    //* add the initial card to the run area
  $('#run').append(initial);

    //* convert the hand returned by the server to a series of divs, each with class of 'card', a class
    //*   with the code that defines its shapes and colors (for styling purposes), and a data attribute
    //*   called 'pair' with the same code (for targeting purposes)
  var cards = _.map(game.hand, function(h, i){return '<div class="available ' + game.hand[i] + '" data-pair="' + game.hand[i] + '"></div>';});
    //* add the card to the hand area
  $('#hand').append(cards);
    //* give the parent div a data attribute of the game id
  $('#hand').attr('data-id', game.id);
}

  //* called by checkForMatch if a match is found
function htmlAddCardToRun(){
    //* save the pair code of the matched card
  var pair = $('.matched').attr('data-pair');
    //* create a new card to be added to the run area
  var newRunCard = '<div class="run ' + pair + '" data-pair="' + pair + '"></div>';
    //* add the card to the run area
  $('#run').append(newRunCard);
    //* remove the class of 'clicked' to reset for next click
  $('.matched').removeClass('clicked');
    //* remove the class of 'matched' to reset for next match
  $('.matched').removeClass('matched');

  htmlUpdateDisplay();

    //* TO DO -- possibly add a graceful animation when card is added to #run
    //* TO DO -- test if last-child of parent will spotlight the newest card
    //*          - if not figure out how to make both of the steps below work
    //*            - add a class of 'newest-match' to the card
    //*            - remove the class of 'newest-match' from the previous card
}

  //* called by checkForMatch if a match isn't found
// function htmlIndicateFailedMatch(){
// }

function htmlUpdateDisplay(){
  var runLength = $('.run').length;
  console.log('Current run: ' + runLength);
}

//                                                                    //
// --------------------------- evaluations -------------------------- //
//                                                                    //

  //* called by clickCard
function checkForMatch(){

  // PSEUDOCODE // if there's a match // PSEUDOCODE //

    //* add a class of 'picked', which fades the card out from its position
  $('.clicked').addClass('picked');
    //* remove the class of 'available' to disable further clicks
  $('.clicked').removeClass('available');
    //* add a class of 'matched' to keep track of the card
  $('.clicked').addClass('matched');
    //* call the function that will update the DOM
  htmlAddCardToRun();

  // PSEUDOCODE // if there's no match // PSEUDOCODE //

  // htmlIndicateFailedMatch();
}