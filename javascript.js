var Game = ( function ( $ ) {
	"use strict";
	var game = {};

	/**
	 * Init Function
	 */
	game.init = function () {
		game.config();
		game.screenSetUp( 'game-start-level-one', '', 'home-screen-background' );
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
		game.gameOverImg = game.createImgElement( 'game-over-img', 'game-over.gif' );
		game.stageCleared = game.createImgElement( 'stage-cleared', 'stage-cleared.png' );
		game.restartBtnImg = game.createImgElement( 'restart-btn', 'restart-button.png' );
		game.homeCarImg = game.createImgElement( 'home-screen-car', 'home-screen-car-img.png' );
		game.explosionImg = game.createImgElement( 'explosion-img', 'explosion.gif' );
		game.introMusic = document.getElementById( 'intro-music' );
		game.backgroundMusic = document.getElementById( 'background-music' );
		game.carStartUpSound = document.getElementById( 'car-start-up-sound' );
		game.carRunningSound = document.getElementById( 'car-running-sound' );
		game.breaksSound = document.getElementById( 'breaks-music' );
		game.explosionSound = document.getElementById( 'explosion-sound' );
		game.distance = 0;
		game.divCount = 200;
		game.counter = 0;
		game.carWasStopped = false;
		game.collision = false;
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
		game.introMusic.play();
		game.createRoadBox();
		game.createRoadLines( game.divCount );
		game.startBttn = game.createElement( 'button', 'class', startBtnClassName );
		game.startBttn.textContent = btnName;
		game.body.appendChild( game.startBttn );
		game.body.appendChild( game.homeCarImg );
		game.alignCenter( game.startBttn, true );
		game.alignCenter( game.homeCarImg, false );
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
	 * Aligns the Element in the center of the screen.
	 * The element needs to be given position as absolute in the stylesheet.
	 *
	 * @param {string} element Element to be aligned in the center.
	 * @param {boolean} top Top position false if we only want the alignment in the center horizontally and not vertically
	 */
	game.alignCenter = function ( element, top ) {
		var elementWidth = element.offsetWidth,
			elementHeight = element.offsetHeight;
		element.style.left = ( game.windowWidth / 2 )  - ( elementWidth / 2 ) + 'px';
		if ( top ) {
			element.style.top = ( game.windowHeight / 2 ) - ( elementHeight / 2 ) + 'px';
		}

	};

	/**
	 * Starts the game.
	 */
	game.gameStart = function () {
		game.introMusic.pause();
		game.backgroundMusic.play();
		game.body.classList.remove( 'home-screen-background' );
		game.body.removeChild( game.startBttn );
		game.body.removeChild( game.homeCarImg );
		game.carImage = game.createAndDisplayCar();
		document.querySelector( '.road-box' ).style.display = 'block';
		game.createGameInfoBox();
		game.setRoadLineContainerLeft();
		game.createAndDisplayMotionBtn();
		game.createAndDisplayGearControls();
		game.distanceTextContainer.textContent = game.roadLineContainer.offsetHeight - window.innerHeight;
		game.stopAccelerationBtn = document.querySelector( '.stop-acceleration-img' );
		game.roadBoxDiv.style.top = -game.windowHeight + 'px';
		game.insertLeftVehicle();
		game.insertRightVehicle();
		game.currentVehicle = document.getElementById( 'bike-red' );
	};

	/**
	 * Stops acceleration in the click of stop button.
	 */
	game.stopAcceleration = function () {
		game.breaksSound.play();
		game.carRunningSound.pause();
		game.gearNumber = 0;
		game.gearCountText.textContent = '' + game.gearNumber + '';
		game.journeyPoint = parseFloat( game.roadBoxDiv.style.top );
		game.carWasStopped = true;
		game.stopRoad();
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
	 * Creates an Image element and sets the image source with the given imageName
	 *
	 * @param {string} className Class name for image.
	 * @param {string} imgName Image Name.
	 * @return {string} imgEl Returns created img element.
	 */
	game.createImgElement = function ( className, imgName ) {
		var imgEl = game.createElement( 'img', 'class', className ),
			srcVal = 'images/'+ imgName;
		imgEl.setAttribute( 'src', srcVal );
		return imgEl;
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
		game.roadLineContainerRight.style.minWidth = ( game.windowWidth / 2 ) + 'px';
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
			game.createRoadLinesLeft( i );
			game.createRoadLinesRight( i );
		}
	};

	/**
	 * Create Left Road Lines
	 *
	 * @param {int} i Counter for setting id.
	 */
	game.createRoadLinesLeft = function ( i ) {
		var roadLineBoxLeft = game.createElement( 'div', 'class', 'road-lines-left' );
		i = i + 1;
		i = 'id-' + i;
		roadLineBoxLeft.style.maxWidth = ( game.windowWidth ) + 'px';
		roadLineBoxLeft.style.minHeight = ( game.windowHeight / 7 ) + 'px';
		roadLineBoxLeft.setAttribute( 'id', i );
		game.roadLineContainerLeft.appendChild( roadLineBoxLeft );
		game.roadLineContainer.appendChild( game.roadLineContainerLeft );
	};

	/**
	 * Create right Road Lines.
	 *
	 * @param {int} i Counter for setting id
	 */
	game.createRoadLinesRight = function ( i ) {
		var roadLineBoxRight = game.createElement( 'div', 'class', 'road-lines-right' );
		i = i + 1 + game.divCount;
		i = 'id-' + i;
		roadLineBoxRight.style.maxWidth = ( game.windowWidth ) + 'px';
		roadLineBoxRight.style.minHeight = ( game.windowHeight / 7 ) + 'px';
		roadLineBoxRight.setAttribute( 'id', i );
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
		game.carImage = game.createElement( 'img', 'class', 'car-img' );
		game.carImage.setAttribute( 'src', 'images/car-forward.png' );
		game.body.appendChild( game.carImage );
		return game.carImage;
	};

	/**
	 * Create and Display Motion Buttons : Gear Up, Right Direction, Left Direction, Gear Down, Stop Button.
	 *
	 */
	game.createAndDisplayMotionBtn = function () {
		var stopBtn = game.createElement( 'img', 'class', 'stop-acceleration-img' ),
			gearControlContainer = game.createElement( 'div', 'class', 'gear-control-container' );
		game.leftDirectionBtn = game.createElement( 'img', 'class', 'left-direction-button' );
		game.rightDirectionBtn = game.createElement( 'img', 'class', 'right-direction-button' );

		game.upArrowBtn = game.createElement( 'img', 'class', 'gear-up-arrow' );
		game.downArrowBtn = game.createElement( 'img', 'class', 'gear-down-arrow' );

		stopBtn.setAttribute( 'src', 'images/stops-button.png' );
		game.upArrowBtn.setAttribute( 'src', 'images/up-arrow.png' );
		game.rightDirectionBtn.setAttribute( 'src', 'images/right-arrow.png' );
		game.downArrowBtn.setAttribute( 'src', 'images/down-arrow.png' );
		game.leftDirectionBtn.setAttribute( 'src', 'images/left-arrow.png' );

		gearControlContainer.appendChild( game.upArrowBtn );
		gearControlContainer.appendChild( game.leftDirectionBtn );
		gearControlContainer.appendChild( stopBtn );
		gearControlContainer.appendChild( game.rightDirectionBtn );
		gearControlContainer.appendChild( game.downArrowBtn );
		game.body.appendChild( gearControlContainer );
		game.clearFloatEl = game.createElement( 'div', 'class', 'clear' );
		gearControlContainer.appendChild( game.clearFloatEl );
		game.changeCarPos( game.leftDirectionBtn, game.rightDirectionBtn, game.carImage );

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
		game.stopAccelerationBtn.removeEventListener( 'click', game.stopAcceleration );
		game.stopAccelerationBtn.addEventListener( 'click', game.stopAcceleration );
		game.carStartUpSound.play();
		game.carRunningSound.play();
		game.journeyPoint = parseFloat( game.roadBoxDiv.style.top );
		game.reduceGear = false;
		game.stopRoad();
		game.gearNumber++;
		game.gearCountText.textContent = '' + game.gearNumber + '';
		game.moveRoad();
		game.carWasStopped = true;
	};

	/**
	 * Decreases the gear number.
	 */
	game.decreaseGear = function () {
		if ( 1 >= game.gearNumber || true === game.gameOver ) {
			return;
		}
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
	 */
	game.changeCarPos = function () {
		if ( true === game.gameOver ) {
			return;
		}

		game.rightDirectionBtn.addEventListener( 'click', game.moveCarRight );

		/**
		 *  Allowing window arrow to control the direction
		 * @todo remove this line of code after testing.
		 */
		game.body.addEventListener( 'keydown', function ( event ) {
			if ( 37 === event.which ) {
				game.leftDirectionBtn.click();
			}
			if ( 39 === event.which ) {
				game.rightDirectionBtn.click();
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
	 * Moves car Left on hitting the left directional button.
	 */
	game.moveCarLeft = function () {
		if ( true === game.gameOver ) {
			return;
		}
		game.carLeftPos = parseFloat( window.getComputedStyle( game.carImage ).left );
		game.currentPos = Math.round( ( game.carLeftPos / game.windowWidth ) * 100 );
		game.animate( game.carImage, 5, game.currentPos, 12, '%', 'left' );
		game.collideFromLeft();
	};

	/**
	 * Moves car Right when hitting the Right Directional button
	 */
	game.moveCarRight = function () {
		if ( true === game.gameOver ) {
			return;
		}
		game.carLeftPos = parseFloat( window.getComputedStyle( game.carImage ).left );
		game.currentPos = Math.round( ( game.carLeftPos / game.windowWidth ) * 100 );
		game.animate( game.carImage, 5, game.currentPos, 57, '%', 'left' );
		game.leftDirectionBtn.addEventListener( 'click', game.moveCarLeft );
		game.collideFromRight();
	};

	/**
	 * Creates settings for collision when left arrow is pressed
	 */
	game.collideFromLeft = function () {
		clearInterval( game.collideFromRightInterval );

		game.collideFromLeftInterval = setInterval( function () {
			if ( true === game.gameOver || true === game.collision ) {
				clearInterval( game.collideFromLeftInterval );
			} else {

				var vehicleRightPos = Math.round( game.currentVehicle.getBoundingClientRect().right ),
					vehicleYPos = Math.round( game.currentVehicle.getBoundingClientRect().y ),
					carYPos = Math.round( game.carImage.getBoundingClientRect().y ),
					carLeftPos = Math.round( game.carImage.getBoundingClientRect().left),
					carXPos = Math.round( game.carImage.getBoundingClientRect().x );
				if ( ( vehicleRightPos > carLeftPos ) && ( 200 > vehicleRightPos ) && 80 > carXPos ) {
					for ( var i = 0; i <= 5; i++ ) {
						if ( vehicleYPos === carYPos ) {
							game.collision = true;
							game.gameOverSettings( 0, true, false );
							break;
						}
						vehicleYPos++;
					}
				}
			}
		}, 1 );
	};

	/**
	 * Creates settings for collision when right arrow is pressed
	 */
	game.collideFromRight = function () {
		clearInterval( game.collideFromLeftInterval );

		game.collideFromRightInterval = setInterval( function () {
			if ( true === game.gameOver || true === game.collision ) {
				clearInterval( game.collideFromRightInterval );
			} else {

				var vehicleLeftPos = Math.round( game.currentVehicle.getBoundingClientRect().left ),
					vehicleYPos = Math.round( game.currentVehicle.getBoundingClientRect().y ),
					carYPos = Math.round( game.carImage.getBoundingClientRect().y ),
					carRightPos = Math.round( game.carImage.getBoundingClientRect().right),
					carXPos = Math.round( game.carImage.getBoundingClientRect().x );
				if ( ( vehicleLeftPos < carRightPos ) && ( 200 < vehicleLeftPos ) && 80 < carXPos ) {
					for ( var i = 0; i <= 5; i++ ) {
						if ( vehicleYPos === carYPos ) {
							game.collision = true;
							game.gameOverSettings( 0, true, false );
							break;
						}
						vehicleYPos++;
					}
				}
			}
		}, 1 );
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
		var vehicleYPos, carYPos, carXPos,
			pos = -game.roadLineContainer.offsetHeight + window.innerHeight;

		if ( true === game.gameOver || true === game.collision ) {
			return;
		}
		game.startRoadInterval = setInterval( frameStartFunc, timeInSec );
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
				game.calculateDistance( pos );
				game.gameOverSettings( pos, false, true );
				game.checkWhichVehicleIsInGameArea();
				game.setUpCollision( vehicleYPos, carYPos, carXPos );
			}
		}
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

		if ( true === game.gameOver || true === game.collision ) {
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
	 * Calls the collision functions basis the type of collision left or right.
	 *
	 * @param {int} vehicleYPos Vehicle's Y position.
	 * @param {int} carYPos  Car's Y Position.
	 * @param {int} carXPos Car's X Position
	 */
	game.setUpCollision = function ( vehicleYPos, carYPos, carXPos ) {
		if ( game.currentVehicle.classList.contains( 'vehicle-left' )  ) {
			game.setUpLeftCollision( vehicleYPos, carYPos, carXPos );
		} else if ( game.currentVehicle.classList.contains( 'vehicle-right' ) ) {
			game.setUpRightCollision( vehicleYPos, carYPos, carXPos )
		}
	};

	/**
	 * Create collision setting for Left Vehicles.
	 *
	 * @param {int} vehicleYPos Vehicle's Y position.
	 * @param {int} carYPos  Car's Y Position.
	 * @param {int} carXPos Car's X Position
	 */
	game.setUpLeftCollision = function ( vehicleYPos, carYPos, carXPos ) {

		vehicleYPos = ( Math.round( game.currentVehicle.getBoundingClientRect().y ) );
		carXPos = Math.round( game.carImage.getBoundingClientRect().x );
		carYPos = Math.round( game.carImage.getBoundingClientRect().y ) - game.carImage.getBoundingClientRect().height + 10;

		/* If the vehicle has not entered the play area then return. */
		if ( 0 > vehicleYPos && game.innerHeight < vehicleYPos ) {
			return;
		}
		if ( 80 > carXPos ) {
			for ( var i = 0; i <= 5; i++ ) {
				if ( vehicleYPos === carYPos ) {
					game.collision = true;
					game.gameOverSettings( 0, true, false );
					break;
				}
				vehicleYPos++;
			}
		}
	};

	/**
	 * Create collision setting for Right Vehicles.
	 *
	 * @param {int} vehicleYPos Vehicle's Y position.
	 * @param {int} carYPos  Car's Y Position.
	 * @param {int} carXPos Car's X Position
	 */
	game.setUpRightCollision = function ( vehicleYPos, carYPos, carXPos ) {

		vehicleYPos = ( Math.round( game.currentVehicle.getBoundingClientRect().y ) );
		carXPos = Math.round( game.carImage.getBoundingClientRect().x );
		carYPos = Math.round( game.carImage.getBoundingClientRect().y ) - game.carImage.getBoundingClientRect().height + 10;

		/* If the vehicle has not entered the play area then return. */
		if ( 0 > vehicleYPos && game.innerHeight < vehicleYPos ) {
			return;
		}

		if ( 180 < carXPos ) {
			for ( var i = 0; i <= 5; i++ ) {
				if ( vehicleYPos === carYPos ) {
					game.collision = true;
					game.gameOverSettings( 0, true, false );
					break;
				}
				vehicleYPos++;
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

	/**
	 * Inserts the vehicles on the left.
	 */
	game.insertLeftVehicle = function () {
		game.createVehicleAndAddToDom( 'id-188', 'bike-red', 'bikes-red.png', 'vehicle-left' );
		game.createVehicleAndAddToDom( 'id-170', 'bus-red', 'bus-red.png', 'vehicle-left' );
		game.createVehicleAndAddToDom( 'id-140', 'barricade-no-entry', 'barricade-noentry.png', 'vehicle-left' );
		game.createVehicleAndAddToDom( 'id-110', 'car-audi-left', 'car-audi.png', 'vehicle-left' );
		game.createVehicleAndAddToDom( 'id-100', 'caution', 'caution.gif', 'vehicle-left' );
		game.createVehicleAndAddToDom( 'id-70', 'car-gray', 'car-gray.png', 'vehicle-left' );
		game.createVehicleAndAddToDom( 'id-40', 'fire-left', 'fire.gif', 'vehicle-left' );
		game.createVehicleAndAddToDom( 'id-15', 'fire-left-two', 'fire.gif', 'vehicle-left' );
	};

	/**
	 * Inserts the vehicles on the right.
	 */
	game.insertRightVehicle = function () {
		game.createVehicleAndAddToDom( 'id-380', 'car-audi', 'car-audi.png', 'vehicle-right' );
		game.createVehicleAndAddToDom( 'id-350', 'car-police', 'car-police.png', 'vehicle-right' );
		game.createVehicleAndAddToDom( 'id-320', 'car-red', 'car-red.png', 'vehicle-right' );
		game.createVehicleAndAddToDom( 'id-280', 'man-drilling', 'man-drilling.gif', 'vehicle-right' );
		game.createVehicleAndAddToDom( 'id-250', 'fire-right', 'fire.gif', 'vehicle-right' );
		game.createVehicleAndAddToDom( 'id-230', 'car-orange', 'car-orange.png', 'vehicle-right' );
		game.createVehicleAndAddToDom( 'id-220', 'car-taxi', 'car-taxi.png', 'vehicle-right' );
	};

	/**
	 * Creates Vehicle image element based on give id and class name and appends it to the container div.
	 *
	 * @param {string} id ID for container div.
	 * @param {string} imageId ID for Image.
	 * @param {string} imageName Image name
	 * @param {string} classVal Class Name whether vehicle-left or vehicle-right.
	 */
	game.createVehicleAndAddToDom = function ( id, imageId, imageName, classVal ) {
		var divEl = document.getElementById( id ),
			className = 'vehicle-image ' + classVal,
			srcValue = 'images/' + imageName,
			vehicleImage = game.createElement( 'img', 'class', className );
		vehicleImage.setAttribute( 'src', srcValue );
		vehicleImage.setAttribute( 'id', imageId );
		divEl.appendChild( vehicleImage );
	};

	/**
	 * Checks which vehicle is in the game area and sets its value to game.currentVehicle
	 */
	game.checkWhichVehicleIsInGameArea = function () {
		game.allVehicles = document.querySelectorAll( '.vehicle-image' );
		var totalVehicleCount = game.allVehicles.length, vehicleYPos;

		for ( var i = 0; i < totalVehicleCount; i++ ) {
			vehicleYPos = ( Math.round( game.allVehicles[ i ].getBoundingClientRect().y ) );
			if ( 0 < vehicleYPos && game.windowHeight > vehicleYPos ) {
				game.currentVehicleId = game.allVehicles[ i ].getAttribute( 'id' );
				game.currentVehicle = document.getElementById( game.currentVehicleId );
				// game.gameOver = true;
			}
		}
	};

	/**
	 * Sets the game.gameOver to true when the position becomes equal to 0.
	 * Appends the game over image.
	 *
	 * @param {int} pos Current position.
	 * @param {bool} collision If collision has happened then pass collision value as true, false otherwise.
	 * @param {bool} missionCompleted If mission is completed pass the value as true, false otherwise.
	 */
	game.gameOverSettings = function ( pos, collision, missionCompleted ) {
		if ( 0 <= pos ) {
			if ( collision ) {
				game.actionsOnCollision();
			}
			if ( false === missionCompleted && ! game.body.contains( game.gameOverImg ) ) {
				game.body.appendChild( game.gameOverImg );
			} else {
				game.body.appendChild( game.stageCleared );
			}
			game.gameOver = true;
			game.carRunningSound.pause();
			clearInterval( game.startRoadInterval );

			game.body.appendChild( game.restartBtnImg );
			game.restartBtnImg.addEventListener( 'click', function () {
				location.reload();
			} );


		}
	};

	/**
	 * Performs certain actions on collision.
	 */
	game.actionsOnCollision = function () {
		/* Add display none to all the vehicles and remove car image. */
		game.roadLineContainer.classList.add( 'display' );
		game.carImage.remove();
		game.body.appendChild( game.explosionImg );
		game.explosionSound.play();
		setTimeout( function () {
			game.explosionImg.remove();
		}, 800 );
	};

	return game;

})( jQuery );

Game.init();