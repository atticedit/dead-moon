/* global document, window, setTimeout, sendAjaxRequest */

$(document).ready(initialize);

var player;

function initialize(){
  $(document).foundation();
    //* call the submitForm function when the form submit button is clicked
  $('form#game').on('submit', submitForm);
    //* call the prepareDemoMode function when the 'Enter Demo Mode' button is clicked
  $('#demo').on('click', prepareDemoMode);
    //* call the htmlDisplayTutorial function when the 'Tutorial' button is clicked
  $('#tutorial').on('click', htmlDisplayTutorial);
    //* call the clickCard function when a child of #hand with class of 'available' is clicked
  $('#hand').on('click', '.available', clickCard);
    //* call the restartGame function when the 'Start New Game' button is clicked
  $('#restart').on('click', restartGame);
}

//                                                                    //
// -------------------------- event handlers ------------------------ //
//                                                                    //

  //* called by the initialize function when the form submit button is clicked
function submitForm(e){

  if(!player){
      //* set 'player' variable to the value given in the 'player' field
    player = $('input[name="player"]').val();
  }
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

  //* called by the initialize function when the 'Enter Demo Mode' button is clicked
function prepareDemoMode(){
    //* call the function that will reset the board for a new game
  htmlClearGame();
    //* define game for purposes of the demo mode
  var game = {};
    //* define game.hand with an array of pairs each matching the one following it
  game.hand = [ 'btrs', 'btyc', 'rsyc', 'rcyt', 'bcrt', 'bsrs', 'ytrs', 'ytbs', 'rtbs', 'ycbs', 'ycrt', 'bcrt', 'bcrc', 'rcbc', 'rcys', 'rsyc' ];
    //* define game.id as 'demo-mode'
  game.id = 'demo-mode';
    //* call the function that will update the DOM
  htmlEnterDemoMode(game);
}

  //* called by the initialize function when a dynamically created div is clicked
function clickCard(){
    //* define clickedCard as the element that received a click
  var clickedCard = $(this);
    // * call the function that will check for a match
  checkForMatch(clickedCard);
}

  //* called by the initialize function when the restart game button is clicked
function restartGame(){
    //* call the function that will reset the board for a new game
  htmlClearGame();
    //* after a short pause, call the function that will
    //*   send the ajax request to populate the game board
  setTimeout(function() { submitForm(); }, 300);
}

//                                                                    //
// ------------------------ DOM manipulation ------------------------ //
//                                                                    //

  //* called by submitForm after the ajax request returns data
  //*
  //* exports.start used this line to tell the server what data it should send back:
  //*   res.send({hand: game.hand, id: game.id});
function htmlInitiateGame(game){

    //* if the game isn't in demo mode...
  if(game.id !== 'demo-mode'){
      //* set the h1 text to "Dead Moon" (since the text may have been changed by the
      //*   htmlEnterDemoMode function)
    $('#header h1').text('Dead Moon');
  }

    //* add a class of 'fadeIn' to the runscape where runs are assembled
  $('#runscape').addClass('fadeIn');
    //* remove the class of 'hidden' from the runscape
  $('#runscape').removeClass('hidden');

    //* remove the class of 'hidden' from the run (since the class may have been added by the
    //*   restartGame function)
  $('#run').removeClass('hidden');

    //* slowly reveal the button that will restart a game
  setTimeout(function() { $('#restart').removeClass('hidden').addClass('fadeIn'); }, 1000);
    //* remove the form from the page
  $('form#game').remove();

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
  var pairs = _.map(game.hand, function(h, i){return '<div class="' + game.hand[i] + ' available"></div>';});
    //* add the cards to the hand area
  $('#hand').append(pairs);
    //* give the parent div a data attribute of the game id
  $('#hand').attr('data-id', game.id);
    //* add a class of 'fadeIn' to the hand
  $('#hand').addClass('fadeIn');
    //* reveal the hand
  $('#hand').removeClass('hidden');
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
      //* decrement runPos.left by the pixel value a new match card adds to runWidth
      //*   (calculated by subtracting the overlap from the width of a card), in order to
      //*   shift #run left to accommodate a new card
    runPos.left -= 120;
      //* animate a shift of #run to the left position specified
    $('#run').animate( {'left':runPos.left}, 'slow', function(){} );
  }

    //* create a new card to be added to the run area
  var newRunCard = '<div class="run ' + clickedPair + '"></div>';
    //* add the card to the run area
  $('#run').append(newRunCard);
    //* calculate the number of pairs in the run area
  var runLength = $('.run').length;

    //* increment runWidth by the number of pixels a new card adds to runWidth (see above)
  runWidth += 120;
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
  setTimeout(function() { $(clickedCard).removeClass('unmatched'); }, 1000);
}

  //* called by htmlAddCardToRun when a card is added to the run area
function htmlUpdateDisplay(runLength){
    //* set the text to the number of pairs in the run area
  $('#notifier').text(runLength);

    //* FOR TESTING ONLY -- ALLOWS QUICK DISPLAY OF WIN MODAL
  // if(runLength === 2){

    //* check if all cards have been matched
  if(runLength === 16){
      //* call the function that handles all win behavior
    htmlIndicateWin();
  }
}

  //* called by htmlUpdateDisplay when all cards have been matched
function htmlIndicateWin(){
    //* if the name to be displayed is long enough to push to another line...
  if(player.length > 3){
      //* increase the height of the win message modal to accomodate another line
    $('#winModal').css('height', '410px');
  }

    //* set the win notification, incorporating the player's name
  $('#winMessage').text('Hot damn, ' + player + ', you\’ve matched all 16 cards!');
    //* trigger a modal notifying the player of a win
  setTimeout(function() { $('#winModal').foundation('reveal', 'open');}, 800);
    //* after an interval that will allow htmlAddCardToRun animations to conclude and a short added
    //*   pause, add a class of 'slideOutLeft' to the run, which will slide it off the left edge
  setTimeout(function() { $('#run').addClass('slideOutLeft'); }, 1400);
    //* after an interval that will allow slideOutLeft to conclude even if the browser is
    //*   full-screen, add a class of 'slideInRight' to the run, which will slide it in from the right
  setTimeout(function() { $('#run').addClass('slideInRight'); }, 3200);
}

  //* called by the initialize function when the 'Tutorial' button is clicked
function htmlDisplayTutorial(){
    //* trigger a modal displaying the tutorial
  setTimeout(function() { $('#tutorialModal').foundation('reveal', 'open');}, 100);
}

  //* called by the restartGame and prepareDemoMode functions
function htmlClearGame(){
    //* remove classes from the run that may have been added by the htmlIndicateWin function
  $('#run').removeClass('slideInRight').removeClass('slideOutLeft');

    //* reset the notifier count
  $('#notifier').empty();

    //* clear the run of all cards
  $('#run').empty();
    //* reset the run to its initial width
  $('#run').css('width', '150px');
    //* reset the run to its initial left position
  $('#run').css('left', '25px');
    //* hide the run to prepare for the new game
  $('#run').addClass('hidden');

    //* remove the class of 'fadeIn' from the hand
  $('#hand').removeClass('fadeIn');
    //* clear the hand of all cards
  $('#hand').empty();
}

function htmlEnterDemoMode(game){
    //* set the h1 text to "Demo Mode"
  $('#header h1').text('Demo Mode');
    //* call the function that will update the DOM with the new game
  htmlInitiateGame(game);
}


//                                                                    //
// --------------------------- evaluations -------------------------- //
//                                                                    //

//   //*** FOR TESTING ONLY ***
//   //*
//   //* called by clickCard
//   //*
//   //* disables matching requirements
// function noCheckForMatch(clickedCard){
//     //* define clickedPair as the pair code of the clicked card
//   var clickedPair = $(clickedCard).attr('class').split(' ').shift();
//     //* call the function that will update the DOM with the new card
//   htmlAddCardToRun(clickedCard, clickedPair);
// }

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