Dead Moon
=========

### A game of complex matching logic and colorful shapes built with Node.js and MongoDB

Dead Moon uses combinations of 3 shapes (circles, squares, & triangles) and 3 colors (blue, red, & yellow) to form pairs that can be matched to each other through shape, color, or both.

## Gameplay

Players attempt to assemble a run of 16 cards, each matching to the previous card played.

The player is dealt 15 cards face up, and another card appears in the run area at the top of the page as a starting point for matching. Cards match by having the same shapes, same colors, or a combination.

## Technologies

Dead Moon is built with JavaScript, jQuery, Node.js, MongoDB, Express, Jade, & Less. 

Here's the full set of 81 possible cards, from which the player is dealt a random selection of 16:

![81-piece array](https://github.com/atticedit/dead-moon/raw/master/public/images/sprite.png "Dead Moon 81-piece array")

This image is used as a sprite in the project, which uses Less.js to programmatically handle the appropriate offsets for display of a given card.

A range of animations and interactions were designed for the game, many of them adapted from the animate.css animations by Dan Eden.
