var Game = ( function ( $ ) {
	"use strict";
	var game = {};

		game.init = function () {
			game.config();
			game.createRoadBox();
			game.createRoadLines( 5 );
			game.ScreenSetUp( 'game-start-level-one', 'Start', 'home-screen-background' );
		};

		game.config = function () {

			// Declaring the variables globally and assigning them values.
			game.startBttn = '';
			game.windowWidth = window.innerWidth;
			game.windowHeight = window.outerHeight;
			game.body = document.querySelector( 'body' );
			game.hiddenElement = document.querySelector( '.hidden-element' );
			game.roadLineContainer = game.createElement( 'div', 'class', 'road-line-container' );
			game.roadLineContainerLeft = game.createElement( 'div', 'class', 'road-line-container-left' );
			game.roadLineContainerRight = game.createElement( 'div', 'class', 'road-line-container-right' );
		};

		/**
		 * Sets up the screen
		 *
		 * @param startBtnClassName
		 * @param btnName Start button name.
		 * @param bodyBackgroundClass
		 * @constructor
		 */
		game.ScreenSetUp = function ( startBtnClassName, btnName, bodyBackgroundClass ) {
			game.startBttn = game.createElement( 'button', 'class', startBtnClassName );
			game.startBttn.textContent = btnName;
			game.body.appendChild( game.startBttn );
			game.startBtnAlignCenter( game.startBttn );
			game.body.classList.add( bodyBackgroundClass );
			game.startBttn.addEventListener( 'click', game.gameStart );
		};

		/**
		 * Aligns the Start Button in the center
		 *
		 * @param startBtn
		 */
		game.startBtnAlignCenter = function ( startBtn ) {
			var startBtnWidth = startBtn.offsetWidth,
				startBtnHeight = startBtn.offsetHeight;
			startBtn.style.top = ( game.windowHeight / 2 ) - ( startBtnHeight / 2 ) + 'px';
			startBtn.style.left = ( game.windowWidth / 2 )  - ( startBtnWidth / 2 ) + 'px';
		};

		/**
		 * Starts the game.
		 */
		game.gameStart = function () {
			var carImage;
				game.body.classList.remove( 'home-screen-background' );
				game.body.removeChild( game.startBttn );
				carImage = game.createAndDisplayCar();
				document.querySelector( '.road-box' ).style.display = 'block';
				game.moveRoadLineContainerLeft();
				game.createAndDisplayDirectionBtn( carImage );
		};

		/**
		 * Creates an elements and given attributes.
		 *
		 * @param {string} elementType The element type to be created.
		 * @param {string} attrName The Attribute name to be created.
		 * @param {string} attrVal The Attribute value to be created.
		 * @return {string} createdElement Created Element with the given attributes and attributes values.
		 *
		 */
		game.createElement = function ( elementType, attrName, attrVal ) {
			var createdElement = document.createElement( elementType );
			createdElement.setAttribute( attrName, attrVal );
			return createdElement;
		};

		/**
		 * Creates Road Box Divs on the left and right of the divider.
		 */
		game.createRoadBox = function () {
			var roadBoxDiv = game.createElement( 'div', 'class', 'road-box' );
				game.body.insertBefore( roadBoxDiv, game.hiddenElement );
				roadBoxDiv.style.minWidth = game.windowWidth + 'px';
				roadBoxDiv.style.minHeight = game.windowHeight + 'px';
				document.querySelector( '.road-box' ).appendChild( game.roadLineContainer );
				game.roadLineContainerLeft.style.minWidth = ( game.windowWidth / 2 ) + 'px';
				game.roadLineContainerLeft.style.minHeight = ( game.windowHeight ) + 'px';
				game.roadLineContainerRight.style.minWidth = ( game.windowWidth / 2.4 ) + 'px';
				game.roadLineContainerRight.style.minHeight = ( game.windowHeight ) + 'px';

			console.log( game.windowWidth );
			console.log( game.windowHeight );
		};

		/**
		 * Calls createRoadLinesLeft and createRoadLinesRight to create road line boxes
		 * on both side of the .road-line-container div.
		 *
		 * @param {number} roadLineCount Number of road lines to be made.
		 */
		game.createRoadLines = function ( roadLineCount ) {
			for ( var i = 0; i < roadLineCount; i++ ) {
				game.createRoadLinesLeft();
				game.createRoadLinesRight();
			}
		};

		/**
		 * Create Left Road Lines
		 */
		game.createRoadLinesLeft = function () {
			var roadLineBoxLeft = game.createElement( 'div', 'class', 'road-lines-left' );
			roadLineBoxLeft.style.maxWidth = ( game.windowWidth / 2 ) + 'px';
			roadLineBoxLeft.style.minHeight = ( game.windowHeight / 7 ) + 'px';
			game.roadLineContainerLeft.appendChild( roadLineBoxLeft );
			game.roadLineContainer.appendChild( game.roadLineContainerLeft );
		};

		/**
		 * Create right Road Lines.
		 */
		game.createRoadLinesRight = function () {
			var roadLineBoxRight = game.createElement( 'div', 'class', 'road-lines-right' );
			roadLineBoxRight.style.maxWidth = ( game.windowWidth / 2 ) + 'px';
			roadLineBoxRight.style.minHeight = ( game.windowHeight / 7 ) + 'px';
			game.roadLineContainerRight.appendChild( roadLineBoxRight );
			game.roadLineContainer.appendChild( game.roadLineContainerRight );
		};

		/**
		 * Set the road line container to left.
		 */
		game.moveRoadLineContainerLeft = function () {
			game.roadLineContainer.setAttribute( 'position', 'relative' );
			game.roadLineContainerLeft.setAttribute( 'position', 'absolute' );
		};

		/**
		 * Create and display car image.
		 *
		 * @return {string} carImage car Image element.
		 */
		game.createAndDisplayCar = function () {
			var carImage = game.createElement( 'img', 'class', 'car-img' );
			carImage.setAttribute( 'src', 'images/car-image.png' );
			game.body.appendChild( carImage );
			return carImage;
		};

		/**
		 * Create and Display direction button.
		 *
		 * @param carImage
		 */
		game.createAndDisplayDirectionBtn = function ( carImage ) {
			var leftDirectionBtn = game.createElement( 'img', 'class', 'left-direction-button' ),
				rightDirectionBtn = game.createElement( 'img', 'class', 'right-direction-button' ),
				directionBtnContainer = game.createElement( 'div', 'class', 'direction-button-container' );
			leftDirectionBtn.setAttribute( 'src', 'images/left-arrow.png' );
			rightDirectionBtn.setAttribute( 'src', 'images/right-arrow.png' );
			directionBtnContainer.appendChild( leftDirectionBtn );
			directionBtnContainer.appendChild( rightDirectionBtn );
			game.body.appendChild( directionBtnContainer );
			game.changeCarPos( leftDirectionBtn, rightDirectionBtn, carImage );
		};

		/**
		 * Changes car position from left to right and vice versa.
		 *
		 * @param leftDirectionBtn
		 * @param rightDirectionBtn
		 * @param carImage
		 */
		game.changeCarPos = function ( leftDirectionBtn, rightDirectionBtn, carImage ) {
			var carLeftPos, currentPos;
			leftDirectionBtn.addEventListener( 'click', function () {
				carLeftPos = parseFloat( window.getComputedStyle( carImage ).left );
				currentPos = Math.round( ( carLeftPos / game.windowWidth ) * 100 );
				game.animate( carImage, 5, currentPos, 19, '%', 'left' );
			} );

			rightDirectionBtn.addEventListener( 'click', function () {
				carLeftPos = parseFloat( window.getComputedStyle( carImage ).left );
				currentPos = Math.round( ( carLeftPos / game.windowWidth ) * 100 );
				game.animate( carImage, 5, currentPos, 67, '%', 'left' );
			} );
		};

		/**
		 * Animates an element from position 0 to
		 *
		 * @param element
		 * @param timeInSec
		 * @param startPos
		 * @param endPos
		 * @param unit px or %.
		 * @param direction left, right, top or bottom
		 */
		game.animate = function ( element, timeInSec, startPos, endPos, unit, direction ) {
			var pos = startPos,
				interval = setInterval( frameFunc, timeInSec );
			function frameFunc() {
				if ( endPos === pos ) {
					clearInterval( interval );
				} else {

					( endPos > pos ) ? pos++ : pos --;

					if ( 'left' === direction ) {
						element.style.left = pos + unit;
					}
					if ( 'right' === direction ) {
						element.style.right = pos + unit;
					}
					if ( 'top' === direction ) {
						element.style.top = pos + unit;
					}
					if ( 'bottom' === direction ) {
						element.style.bottom = pos + unit;
					}
				}
			}
		};

	return game;

})( jQuery );

Game.init();