/* global document, window, sendAjaxRequest */

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
    //* set the function to be called when the form submit button is clicked
  $('form#game').on('submit', submitForm);
    //* set the function to be called when the h1 in the header is clicked
  $('#header h1').on('click', htmlIrradiateHeader);
    //* set the function to be called when a child of #hand with class of 'available' is clicked
  $('#hand').on('click', '.available', clickCard);
}

//                                                                    //
// -------------------------- event handlers ------------------------ //
//                                                                    //

  //* called by the initialize function when the form submit button is clicked
function submitForm(e){
    //* set 'player' variable to the value given in the 'player' field
  var player = $('input[name="player"]').val();
    //* set the url using the player variable
  var url = '/moon/start?player=' + player;

    //* send an ajax Request using the given values
    //*
    //* the sendAjaxRequest function expects values in this order:
    //*   url, data, verb, altVerb, event, successFn
  sendAjaxRequest(url, {}, 'post', null, e, function(data){
      //* call the function that will update the DOM
    htmlInitiateGame(data);
  });
}

  //* called by the initialize function when a dynamically created div is clicked
function clickCard(){
    //* define clickedCard as the element that received a click
  var clickedCard = $(this);
    // * call the function that will check for a match
  checkForMatch(clickedCard);
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
  $('#runscape').removeClass('hidden');

    //* extract the first pair from the array
  var initialPair = game.hand.shift();
    //* create a div displaying the initial pair the player will attempt to match other cards to
  var initial = '<div class="run ' + initialPair + '"></div>';
    //* add the initial card to the run area
  $('#run').append(initial);

    //* convert the hand returned by the server (and reduced by one pair in the lines above)
    //*   to a series of divs, each with class of 'available' and a class with the code that
    //*   defines its shapes and colors for styling purposes (though it can also be used for
    //*   targeting the element rather than weighing each div down with separate data for that)
  var pairs = _.map(game.hand, function(h, i){return '<div class="footprint"><div class="' + game.hand[i] + ' available"></div></div>';});
    //* add the card to the hand area
  $('#hand').append(pairs);
    //* give the parent div a data attribute of the game id
  $('#hand').attr('data-id', game.id);
}

  // * called by checkForMatch if a match is found
function htmlAddCardToRun(clickedCard, clickedPair){

    //* add a class of 'matched' to the clicked card, which fades it out slowly
  $(clickedCard).addClass('matched');
    //* remove the class of 'available' from the clicked card to disable further clicks
  $('.matched').removeClass('available');

    //* get the width of the browser window
  var windowSize = $(window).width();
    //* set runPos to the positioning of #run in relation to left and top of the document
  var runPos = $('#run').offset();
    //* set runWidth to the width of the run area, expressed as a unit-less pixel value
  var runWidth = $('#run').width();
    //* set rightRunMargin to the remaining space in the browser window available to #run
  var rightRunMargin = windowSize - runPos.left - runWidth;

    //* determine whether there's less than 20% of available space for #run remaining
  if(rightRunMargin/windowSize < 0.2){
      //* decrement runPos.left by 110, the pixel value a new match card adds to runWidth,
      //*   in order to shift #run left to accommodate a new card
    runPos.left -= 110;
      //* animate a shift of #run to the left position specified
    $('#run').animate( {'left':runPos.left}, 'slow', function(){} );
  }

    //* create a new card to be added to the run area
  var newRunCard = '<div class="run ' + clickedPair + '"></div>';
    //* add the card to the run area
  $('#run').append(newRunCard);
    //* calculate the number of pairs in the run area
  var runLength = $('.run').length;

    //* increment runWidth by 110px
  runWidth += 110;
    //* set the width of the run area to runWidth
  $('#run').width(runWidth);

    //* call the function that will display the current run length
  htmlUpdateDisplay(runLength);
}

  //* called by checkForMatch if a match isn't found
function htmlIndicateFailedMatch(clickedCard){
    //* add a class of 'unmatched' to the clicked card, which quickly pulses it
  $(clickedCard).addClass('unmatched');
    //* after 1 second, remove the class of 'unmatched' to allow further clicks
  setTimeout(function() { $(clickedCard).removeClass('unmatched') }, 1000);
}

  //* called by htmlAddCardToRun when a card is added to the run area
function htmlUpdateDisplay(runLength){
    //* set the text to the number of pairs in the run area
  $('#notifier').text(runLength);
}

  //* called by the initialize function when the h1 in the header is clicked
function htmlIrradiateHeader(){
    //* toggle the class that will make the h1 glow
  $('#header h1').toggleClass('glow');
}

//                                                                    //
// --------------------------- evaluations -------------------------- //
//                                                                    //

  //* called by clickCard
function checkForMatch(clickedCard){
    //* define lastRunPair as the pair code of the last element in the run area
  var lastRunPair = $('#run').children().last().attr('class').split(' ').pop();
    //* define clickedPair as the pair code of the clicked card
  var clickedPair = $(clickedCard).attr('class').split(' ').shift();

    //* if last run card and clicked card match in both 1st and 2nd code positions
    //*   (meaning on the top they have the same color and shape)...
  if(lastRunPair[0] === clickedPair[0] && lastRunPair[1] === clickedPair[1]){
      //* call the function that will update the DOM with the new matched card
    htmlAddCardToRun(clickedCard, clickedPair);
    //* or if last run card and clicked card match in both 3rd and 4th code positions
    //*   (meaning on the bottom they have the same color and shape)...
  } else if(lastRunPair[2] === clickedPair[2] && lastRunPair[3] === clickedPair[3]){
    htmlAddCardToRun(clickedCard, clickedPair);
    //* if last run card and clicked card match in both 1st and 3rd code positions
    //*   (meaning both pairs have the same color)...
  } else if(lastRunPair[0] === clickedPair[0] && lastRunPair[2] === clickedPair[2]){
    htmlAddCardToRun(clickedCard, clickedPair);
    //* if last run card and clicked card match in both 2nd and 4th code positions
    //*   (meaning both pairs have the same shape)...
  } else if(lastRunPair[1] === clickedPair[1] && lastRunPair[3] === clickedPair[3]){
    htmlAddCardToRun(clickedCard, clickedPair);
    //* or if none of the above evaluates to true...
  } else {
      //* call the function that will indicate to the user no match was found
    htmlIndicateFailedMatch(clickedCard);
  }
}