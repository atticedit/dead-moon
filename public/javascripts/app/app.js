/* global document, sendAjaxRequest */

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('form#game').on('submit', submitForm);
  $('#header h1').on('click', htmlIrradiateHeader);
  $('#hand').on('click', '.available', clickCard);
}

//                                                                    //
// -------------------------- event handlers ------------------------ //
//                                                                    //

function submitForm(e){
  var player = $('input[name="player"]').val();
  var url = '/moon/start?player=' + player;

    //* the sendAjaxRequest function expects values in this order
    //*   url, data, verb, altVerb, event, successFn
  sendAjaxRequest(url, {}, 'post', null, e, function(data){
      //* call the function that will update the DOM
    htmlInitiateGame(data);
  });
}

  //* called by the initialize function when a dynamically created div is clicked
function clickCard(){
    //* remove the class of 'unmatched' from last failed match to reset for next click
  $('#hand div').removeClass('unmatched');
    //* add a class of 'clicked'
  $(this).addClass('clicked');
    //* call the function that will check for a match
  checkForMatch();
}

//                                                                    //
// ------------------------ DOM manipulation ------------------------ //
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

    //* convert the hand returned by the server to a series of divs, each with class of 'available', a class
    //*   with the code that defines its shapes and colors (for styling purposes), and a data attribute
    //*   called 'pair' with the same code (for targeting purposes)
  var cards = _.map(game.hand, function(h, i){return '<div class="' + game.hand[i] + ' available" data-pair="' + game.hand[i] + '"></div>';});
    //* add the card to the hand area
  $('#hand').append(cards);
    //* give the parent div a data attribute of the game id
  $('#hand').attr('data-id', game.id);
}

  // * called by checkForMatch if a match is found
function htmlAddCardToRun(){
    //* add a class of 'matched', which fades the card out from its position
  $('.clicked').addClass('matched');
    //* remove the class of 'available' to disable further clicks
  $('.clicked').removeClass('available');
    //* save the pair code of the clicked card
  var pair = $('.clicked').attr('data-pair');
    //* create a new card to be added to the run area
  var newRunCard = '<div class="run ' + pair + '" data-pair="' + pair + '"></div>';

    //* set runWidth to 73 plus the width of the run area (expressed as a unit-less pixel value)
  var runWidth = 73 + ($('#run').width());
    //* set the width of the run area to runWidth
  $('#run').width(runWidth);

    //* add the card to the run area
  $('#run').append(newRunCard);
    //* calculate the number of pairs in the run area
  var runLength = $('.run').length;

    //* remove the class of 'clicked' to reset for next click
  $('.clicked').removeClass('clicked');

  htmlUpdateDisplay(runLength);
}

//   //* called by checkForMatch if a match isn't found
// function htmlIndicateFailedMatch(){
//     //* add a class of 'unmatched', which quickly fades the card out and in
//   $('.clicked').addClass('unmatched');
//     //* remove the class of 'clicked' to reset for next click
//   $('.clicked').removeClass('clicked');

//   htmlUpdateDisplay(runLength);
// }

function htmlUpdateDisplay(runLength){
    //* reveal the area that displays length of the player's run
  $('#notifier').removeClass('hidden');
    //* set the text to the number of pairs in the run area
  $('#notifier span').text(runLength);
}

  //* called by the initialize function when the h1 in the header is clicked
function htmlIrradiateHeader(){
  $('#header h1').toggleClass('glow');
}

//                                                                    //
// --------------------------- evaluations -------------------------- //
//                                                                    //

  //* called by clickCard
function checkForMatch(){

    //* TO DO -- test if last-child of parent will spotlight the newest card
    //*          - if not figure out how to make both of the steps below work
    //*            - add a class of 'newest-match' to the card
    //*            - remove the class of 'newest-match' from the previous card

  // PSEUDOCODE // if there's a match // PSEUDOCODE //

    //* call the function that will update the DOM
  htmlAddCardToRun();

  // PSEUDOCODE // if there's no match // PSEUDOCODE //

  // htmlIndicateFailedMatch();
}