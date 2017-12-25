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
			game.distance = 0;
			game.carWasStopped = false;
			game.gameOver = false;
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
			game.createRoadLines( 40 );
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

			console.log( 'height = ' + game.roadLineContainer.offsetHeight );
			game.body.classList.remove( 'home-screen-background' );
			game.body.removeChild( game.startBttn );
			carImage = game.createAndDisplayCar();
			document.querySelector( '.road-box' ).style.display = 'block';
			game.createGameInfoBox();
			game.setRoadLineContainerLeft();
			game.createAndDisplayMotionBtn( carImage );
			game.createAndDisplayGearControls();
			game.distanceTextContainer.textContent = game.roadLineContainer.offsetHeight - window.innerHeight;
			game.stopAccelerationBtn = document.querySelector( '.stop-acceleration-img' );
			game.roadBoxDiv.style.top = -game.windowHeight + 'px';
			game.stopAccelerationBtn.addEventListener( 'click', function () {
				game.gearNumber = 0;
				game.gearCountText.textContent = '' + game.gearNumber + '';
				game.journeyPoint = parseFloat( game.roadBoxDiv.style.top );
				game.carWasStopped = true;
				game.stopRoad();
			} );
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
		 */
		game.createRoadBox = function () {
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
			carImage.setAttribute( 'src', 'images/car-forward.png' );
			game.body.appendChild( carImage );
			return carImage;
		};

		/**
		 * Create and Display Motion Buttons : Gear Up, Right Direction, Left Direction, Gear Down, Stop Button.
		 *
		 * @param carImage
		 */
		game.createAndDisplayMotionBtn = function ( carImage ) {
			var stopBtn = game.createElement( 'img', 'class', 'stop-acceleration-img' ),
				gearControlContainer = game.createElement( 'div', 'class', 'gear-control-container' ),
				leftDirectionBtn = game.createElement( 'img', 'class', 'left-direction-button' ),
				rightDirectionBtn = game.createElement( 'img', 'class', 'right-direction-button' );

			game.upArrowBtn = game.createElement( 'img', 'class', 'gear-up-arrow' );
			game.downArrowBtn = game.createElement( 'img', 'class', 'gear-down-arrow' );

			stopBtn.setAttribute( 'src', 'images/stops-button.png' );
			game.upArrowBtn.setAttribute( 'src', 'images/up-arrow.png' );
			rightDirectionBtn.setAttribute( 'src', 'images/right-arrow.png' );
			game.downArrowBtn.setAttribute( 'src', 'images/down-arrow.png' );
			leftDirectionBtn.setAttribute( 'src', 'images/left-arrow.png' );

			gearControlContainer.appendChild( game.upArrowBtn );
			gearControlContainer.appendChild( leftDirectionBtn );
			gearControlContainer.appendChild( stopBtn );
			gearControlContainer.appendChild( rightDirectionBtn );
			gearControlContainer.appendChild( game.downArrowBtn );
			game.body.appendChild( gearControlContainer );
			game.clearFloatEl = game.createElement( 'div', 'class', 'clear' );
			gearControlContainer.appendChild( game.clearFloatEl );
			game.changeCarPos( leftDirectionBtn, rightDirectionBtn, carImage );

		};

		/**
		 * Create and Display Gear Control Button.
		 * And Set Event Handlers to change the gears and control the speed.
		 */
		game.createAndDisplayGearControls = function () {
			game.gearNumber = 0;
			game.reduceGear = false;
			game.gearCountText.textContent = '' + game.gearNumber + '';

			game.upArrowBtn.addEventListener( 'click', game.increaseGear );
			game.downArrowBtn.addEventListener( 'click', game.decreaseGear );
		};

		/**
		 * Increases the gear number.
		 */
		game.increaseGear = function () {
			if ( 5 <= game.gearNumber || true === game.gameOver ) {
				return;
			}
			game.journeyPoint = parseFloat( game.roadBoxDiv.style.top );
			game.reduceGear = false;
			game.stopRoad();
			game.gearNumber++;
			game.gearCountText.textContent = '' + game.gearNumber + '';
			game.moveRoad();
			console.log( 'increase' );
			game.carWasStopped = true;
		};

		/**
		 * Decreases the gear number.
		 */
		game.decreaseGear = function () {
			if ( 1 >= game.gearNumber || true === game.gameOver ) {
				return;
			}
			console.log( 'decrease' );
			game.journeyPoint = parseFloat( game.roadBoxDiv.style.top );
			game.reduceGear = true;
			game.stopRoad();
			game.gearNumber--;
			game.gearCountText.textContent = '' + game.gearNumber + '';
			game.moveRoad();
			game.carWasStopped = true;
		};

		/**
		 * Creates and Displays the Game info at the top like Current Score and Gear Number.
		 */
		game.createGameInfoBox = function () {
			var scoreLabel = game.createElement( 'p', 'class', 'score-label' ),
				gearCountLabel = game.createElement( 'p', 'class', 'gear-count-label' );
			game.distanceTextContainer = game.createElement( 'p', 'class', 'score-text-container' );

			game.gearCountText = game.createElement( 'p', 'class', 'gear-count-text' );
			scoreLabel.textContent = 'Distance';
			gearCountLabel.textContent = 'Gear';
			game.gameInfoContainer = game.createElement( 'div', 'class', 'game-info-container' );
			game.gameInfoContainer.appendChild( scoreLabel );
			game.gameInfoContainer.appendChild( game.distanceTextContainer );
			game.gameInfoContainer.appendChild( gearCountLabel );
			game.gameInfoContainer.appendChild( game.gearCountText );

			game.body.appendChild( game.gameInfoContainer );
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
				game.animate( carImage, 5, currentPos, 12, '%', 'left' );
			} );

			rightDirectionBtn.addEventListener( 'click', function () {
				carLeftPos = parseFloat( window.getComputedStyle( carImage ).left );
				currentPos = Math.round( ( carLeftPos / game.windowWidth ) * 100 );
				game.animate( carImage, 5, currentPos, 62, '%', 'left' );
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
				if ( 38 === event.which ) {
					game.upArrowBtn.click();
				}
				if ( 40 === event.which ) {
					game.downArrowBtn.click();
				}
			} );
		};

		/**
		 * Sets the Road in Motion and then removes the event listener.
		 */
		game.moveRoad = function () {
			var roadCurrentPosition = parseFloat( game.roadBoxDiv.style.top );
			game.startRoadAnimation( game.roadBoxDiv, 1, game.gearNumber, roadCurrentPosition, 0, 'px' );
			game.stopAccelerationBtn.addEventListener( 'click', game.stopRoad );
		};

		/**
		 * Stops Road movement
		 */
		game.stopRoad = function () {
			console.log( 'stop' );
			clearInterval( game.startRoadInterval );
			var roadCurrentPos = parseFloat( game.roadBoxDiv.style.top );
			console.log( 'journeyPoint = ' + game.journeyPoint );
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
			console.log( 'startPos = ' + startPos + ' endpPos = ' + endPos );
			var pos = -game.roadLineContainer.offsetHeight + window.innerHeight;

			if ( true === game.gameOver ) {
				return;
			}
				game.startRoadInterval = setInterval( frameStartFunc, timeInSec );
				console.log( 'my pos= ' + pos );
			if ( true === game.carWasStopped ) {
				pos = game.journeyPoint;
			}

			function frameStartFunc() {
				if ( endPos === pos || 0 <= pos ) {
					game.gameOver = true;
					clearInterval( game.startRoadInterval );
				} else {
					pos = ( endPos > pos ) ? pos + speed : pos - speed;
					element.style.top = pos + unit;
					console.log( pos );
					game.calculateDistance( pos );
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
			var pos = startPos;

			if ( true === game.gameOver ) {
				return;
			}
				game.stopRoadInterval = setInterval( frameStopFunc, timeInSec );

			function frameStopFunc() {
				if ( ( startPos + 1 ) === pos ) {
					clearInterval( game.stopRoadInterval );
				} else {
					pos = ( endPos > pos ) ? pos + speed : pos - speed;
					element.style.top = pos + unit;
				}
			}
		};

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

		/**
		 * Calculate Distance.
		 *
		 * @param pos Position
		 */
		game.calculateDistance = function ( pos ) {
			if ( 0 >= game.distance ) {
				if ( 0 < pos ) {
					game.distanceTextContainer.textContent = 0;
				} else {
					game.distanceTextContainer.textContent = -( pos );
				}
			}
		};

	return game;

})( jQuery );

Game.init();