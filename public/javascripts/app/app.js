/* global document, window, sendAjaxRequest */

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

    //* extract the first pair from the array
  var initialPair = game.hand.shift();
    //* create a div displaying the initial pair to match other cards to
  var initial = '<div class="run ' + initialPair + '" data-pair="' + initialPair + '"></div>';
    //* add the initial card to the run area
  $('#run').append(initial);

    //* convert the hand returned by the server to a series of divs, each with class of 'available', a class
    //*   with the code that defines its shapes and colors (for styling purposes), and a data attribute
    //*   called 'pair' with the same code (for targeting purposes)
  var pairs = _.map(game.hand, function(h, i){return '<div class="' + game.hand[i] + ' available" data-pair="' + game.hand[i] + '"></div>';});
    //* add the card to the hand area
  $('#hand').append(pairs);
    //* give the parent div a data attribute of the game id
  $('#hand').attr('data-id', game.id);
}

  // * called by checkForMatch if a match is found
function htmlAddCardToRun(){
    //* add a class of 'matched', which fades the card out from its position
  $('.clicked').addClass('matched');
    //* remove the class of 'available' to disable further clicks
  $('.clicked').removeClass('available');

    //* get the width of the browser window
  var windowSize = $(window).width();
    //* set runPos to the positioning of #run in relation to left and top of the document
  var runPos = $('#run').offset();
    //* set runWidth to the width of the run area, expressed as a unit-less pixel value
  var runWidth = $('#run').width();
    //* set rightRunMargin to the remaining space in the browser window available to #run
    //*   after the next match is added
  var rightRunMargin = windowSize - runPos.left - runWidth - 73;

    //* determine whether there's less than 10% of available space for #run remaining
  if(rightRunMargin/windowSize < 0.1){
      //* decrement runPos.left by 73 in order to shift #run left
    runPos.left -= 73;
      //* animate a shift of #run to the left position specified
    $('#run').animate( {'left':runPos.left}, 'slow', function(){} );
  }

    //* increment runWidth by 73px
  runWidth += 73;
    //* set the width of the run area to runWidth
  $('#run').width(runWidth);

    //* save the pair code of the clicked card
  var pair = $('.clicked').attr('data-pair');
    //* create a new card to be added to the run area
  var newRunCard = '<div class="run ' + pair + '" data-pair="' + pair + '"></div>';
    //* add the card to the run area
  $('#run').append(newRunCard);
    //* calculate the number of pairs in the run area
  var runLength = $('.run').length;

    //* remove the class of 'clicked' to reset for next click
  $('.clicked').removeClass('clicked');

    //* call the function that will display the current run length
  htmlUpdateDisplay(runLength);
}

//   //* called by checkForMatch if a match isn't found
// function htmlIndicateFailedMatch(){
//     //* add a class of 'unmatched', which quickly fades the card out and in
//   $('.clicked').addClass('unmatched');
//     //* remove the class of 'clicked' to reset for next click
//   $('.clicked').removeClass('clicked');
// }

  //* called by htmlAddCardToRun when a card is added to the run area
function htmlUpdateDisplay(runLength){
    //* reveal the area that displays the length of the player's run
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

    //* call the function that will update the DOM with the new matched card
  htmlAddCardToRun();

  // PSEUDOCODE // if there's no match // PSEUDOCODE //

    //* call the function that will indicate to the user no match was found
  // htmlIndicateFailedMatch();
}