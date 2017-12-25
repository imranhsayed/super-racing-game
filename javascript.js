var Game = ( function ( $ ) {
	"use strict";
	var game = {};

		/**
		 * Init Function
		 */
		game.init = function () {
			game.config();
			game.screenSetUp( 'game-start-level-one', 'Start', 'home-screen-background' );
		};

		/**
		 * Game Configuration
		 */
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
		game.screenSetUp = function ( startBtnClassName, btnName, bodyBackgroundClass ) {
			game.createRoadBox();
			game.createRoadLines( 10 );
			game.startBttn = game.createElement( 'button', 'class', startBtnClassName );
			game.startBttn.textContent = btnName;
			game.body.appendChild( game.startBttn );
			game.startBtnAlignCenter( game.startBttn );
			game.body.classList.add( bodyBackgroundClass );
			game.startBttn.addEventListener( 'click', game.gameStart );

			/**
			 * Start the game on pressing enter key on computer
			 * 
			 * @todo remove this on release
			 */
			game.body.addEventListener( 'keydown', function ( event ) {
				if ( 13 === event.which ) {
					game.startBttn.click();
				}
				if ( 83 === event.which ) {
					game.stopAccelerationBtn.click();
				}

			} );
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
			game.setRoadLineContainerLeft();
			game.createAndDisplayDirectionBtn( carImage );
			game.createAndDisplayGearBtn();
			game.createAndDisplayMotionBtn();
			game.accelerateBtn = document.querySelector( '.accelerate-img' );
			game.stopAccelerationBtn = document.querySelector( '.stop-acceleration-img' );
			game.roadBoxDiv.style.top = -game.windowHeight + 'px';
			game.stopAccelerationBtn.addEventListener( 'click', game.stopRoad );
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
		 *
		 * @param {string} containerClassName Class name of the container div.
		 */
		game.createRoadBox = function ( containerClassName ) {
			game.roadBoxDiv = game.createElement( 'div', 'class', 'road-box' );
			game.body.insertBefore( game.roadBoxDiv, game.hiddenElement );
			game.roadBoxDiv.style.minWidth = game.windowWidth + 'px';
			game.roadBoxDiv.style.minHeight = game.windowHeight + 'px';
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
		game.setRoadLineContainerLeft = function () {
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
		 * Create and Display Motion Buttons Stop and Accelerate Buttons
		 */
		game.createAndDisplayMotionBtn = function () {
			var stopBtn = game.createElement( 'img', 'class', 'stop-acceleration-img' ),
				accelerateBtn = game.createElement( 'div', 'class', 'gear-control-container' );
			stopBtn.setAttribute( 'src', 'images/stop-button.png' );
			accelerateBtn.setAttribute( 'src', 'images/accelerate.png' );
			game.body.appendChild( stopBtn );
			game.body.appendChild( accelerateBtn );
		};

		/**
		 * Create and Display Gear Control Button.
		 */
		game.createAndDisplayGearBtn = function () {
			var gearBtn = game.createElement( 'div', 'class', 'gear-btn' );
			game.gearNumber = 0;
			game.reduceGear = false;
			gearBtn.textContent = '' + game.gearNumber + '';

			gearBtn.addEventListener( 'click', function () {
				if ( ( game.gearNumber >= 5 || true === game.reduceGear ) && 0 !== game.gearNumber ) {
					game.reduceGear = true;
					game.stopRoad();
					game.gearNumber--;
					gearBtn.textContent = '' + game.gearNumber + '';
					console.log( game.gearNumber );
					game.moveRoad();
				} else if ( game.gearNumber < 5 ) {
					game.reduceGear = false;
					game.stopRoad();
					game.gearNumber++;
					gearBtn.textContent = '' + game.gearNumber + '';
					console.log( game.gearNumber );
					game.moveRoad();
				}
			} );

			game.body.appendChild( gearBtn );
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

			/**
			 *  Allowing window arrow to control the direction
			 * @todo remove this line of code after testing.
			 */
			game.body.addEventListener( 'keydown', function ( event ) {
				if ( 37 === event.which ) {
					leftDirectionBtn.click();
				}
				if ( 39 === event.which ) {
					rightDirectionBtn.click();
				}
				if ( 32 === event.which ) {
					game.accelerateBtn.click();
				}
			} );
		};

		/**
		 * Sets the Road in Motion and then removes the event listener.
		 */
		game.moveRoad = function () {
			var roadCurrentPosition = parseFloat( game.roadBoxDiv.style.top );
			game.startRoadAnimation( game.roadBoxDiv, 1, game.gearNumber, roadCurrentPosition, 0, 'px' );
			game.accelerateBtn.removeEventListener( 'click', game.moveRoad );
			game.stopAccelerationBtn.addEventListener( 'click', game.stopRoad );
		};

		/**
		 * Stops Road movement
		 */
		game.stopRoad = function () {
			clearInterval( game.startRoadInterval );
			var roadCurrentPos = parseFloat( game.roadBoxDiv.style.top );
			game.stopRoadAnimation( game.roadBoxDiv, 1, 1, roadCurrentPos, game.windowHeight, 'px' );
			game.roadBoxDiv.style.top = -game.windowHeight + 'px';
			game.stopAccelerationBtn.removeEventListener( 'click', game.stopRoad );
		};

		/**
		 * Custom function to animate road setting it to infinite loop.
		 *
		 * @param {string} element
		 * @param {int} timeInSec
		 * @param {int} speed Range 1-5 Controls the speed.
		 * @param {int} startPos
		 * @param {int} endPos
		 * @param {string} unit px or %.
	 */
		game.startRoadAnimation = function ( element, timeInSec, speed, startPos, endPos, unit ) {
			clearInterval( game.stopRoadInterval );
			var pos = startPos;
				game.startRoadInterval = setInterval( frameStartFunc, timeInSec );

			function frameStartFunc() {
				if ( endPos === pos ) {
					clearInterval( game.startRoadInterval );
				} else {
					pos = ( endPos > pos ) ? pos + speed : pos - speed;
					if ( endPos <= pos || 0 === pos ) {
						pos = -window.innerHeight;
					}
					element.style.top = pos + unit;
				}
			};
		};

		/**
		 * Custom function to stop road animation and bring the road motion to rest.
		 *
		 * @param {string} element
		 * @param {int} timeInSec
		 * @param {int} speed Range 1-5 Controls the speed.
		 * @param {int} startPos
		 * @param {int} endPos
		 * @param {string} unit px or %.
		 */
		game.stopRoadAnimation = function ( element, timeInSec, speed, startPos, endPos, unit ) {
			var pos = startPos,
				targetEndPos = -game.windowHeight + 'px';
				game.stopRoadInterval = setInterval( frameStopFunc, timeInSec );

			function frameStopFunc() {
				if ( ( startPos + 100 ) === pos ) {
					clearInterval( game.stopRoadInterval );
				} else {
					pos = ( endPos > pos ) ? pos + speed : pos - speed;
					element.style.top = pos + unit;
				}
			}
		}

		/**
		 * Animates an element from position 0 to
		 *
		 * @param {string} element
		 * @param {int} timeInSec
		 * @param {int} startPos
		 * @param {int} endPos
		 * @param {string} unit px or %.
		 * @param {string} direction left, right, top or bottom
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