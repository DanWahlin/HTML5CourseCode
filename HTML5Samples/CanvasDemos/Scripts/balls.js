/**
	Ball game 
	Author 	: Shameer
	mail 	: me@shameerc.com
**/

var Balls = function(options){
	
	var defaults   = {
				canvas : '#canvas',
				onstart : function(){},
				onstop : function(){},
				onPause : function(){},
				angle  : Math.PI/6
			};

	var options = $.extend({},defaults, options);

	canvas = $(options.canvas)[0];

	var ctx, 
		CELL_SIZE 	= 5,
		// set the size of canvas
		C_WIDTH = canvas.width, C_HEIGHT = canvas.height-10;

	// directions
	var UP = 2, DOWN = 4, LEFT = 8, RIGHT = 16;

	var PI    = Math.PI;
	
	var angle 		= options.angle, 
		interval 	= 1000/30, timer, // interval in ms
		radius 		= 10, 
		step 		= 10, 	// speed of ball
		vDir 		= DOWN,
		hDir 		= LEFT,
		barWidth 	= 100,
		displacement= 10,
		paused		= true,
		stopped		= false,
		p_inc		= 5,
		points		= 0;


	// ball position
	var lastHit = ball = {x:100,y:radius};

	// position of bar
	var bar = {x:100,y:0};

	if(canvas.getContext('2d')){
		ctx = canvas.getContext('2d');
	}
	// cross browser event listener for keyboard events
	if(window.addEventListener){
		window.addEventListener('keypress',moveBar,false);
		if($.browser.webkit){
			window.addEventListener('keydown',moveBar,false);
		}
	}
	else if(window.attachEvent){
		window.attachEvent('keypress',moveBar,false);
	}

	// start game function
	function startGame(){
		if((typeof timer == 'undefined' || paused) && ! stopped){
			timer = setInterval(gameLoop,interval);
		}
		paused = false;
	}

	// stop the game and calll any callback functions
	function stopGame(){
		clearInterval(timer);
		stopped 	= true;
		options.onstop();
		$('#result').html('Game finished, points : ' + points);
	}

	// pause the game and call any callback function
	function pauseGame(){
		clearInterval(timer);
		paused 		= true;
		options.onPause();
	}

	// gameloop, which will be called in each interval
	function gameLoop(){

		//draw ojects
		clearCanvas();
		drawBall();
		placeBar();
		
		// collision detection
		checkCollision();
		
		// update state
		setDirections();
		getCoords();
	}

	// function to draw ball
	function drawBall(){
		ctx.fillStyle = 'orange';
		ctx.beginPath();
		ctx.arc(ball.x, ball.y,radius,0, 2*PI,false);
		ctx.fill();
	}

	// set the horizontal and vertical directions on 
	function setDirections(){
		if(ball.y + radius >= C_HEIGHT){
			lastHit = {x:ball.x,y:C_HEIGHT};
			vDir = UP;
		}
		else if(ball.y - radius <= 0){
			lastHit = {x:ball.x,y:0};
			vDir = DOWN;
		}
		else if(ball.x<=0){
			lastHit = {x:0,y:ball.y};
			hDir  = RIGHT;
		}
		else if(ball.x >= C_WIDTH){
			lastHit = {x:C_WIDTH,y:ball.y};
			hDir  = LEFT;
		}

	}


	// function to get the coordinates of the ball
	function getCoords(){

		// get the absolute value of difference in y coord
		// to be moved (For finding the x coords to be moved)
		yAbs    = Math.abs(ball.y-lastHit.y);	
		// to avoid multiplied by zero error
		if(yAbs == 0){
			newX = Math.tan(angle) * 1;
		}
		else{
			newX = Math.round( Math.tan(angle) * yAbs);
		}
		// if the ball is moving down
		// y must be added with the step value
		if(vDir == DOWN){
			// if the direction is right
			// x must be added
			if(hDir == RIGHT){
				ball = {x: lastHit.x+newX, y : ball.y+step};
			}
			else{
				// direction is left, so subtract the x
				ball = { x: lastHit.x-newX, y : ball.y+step};
			}
		}
		else{
			// direction is up
			// subtract step from y
			if(hDir == RIGHT){
				// direction is right, add x
				ball = { x: lastHit.x+newX, y : ball.y-step};
			}
			else{
				// direction is left, subtract s
				ball = { x: lastHit.x-newX, y : ball.y-step};
			}
		}
	}

	// place the moving bar 
	function placeBar(){
		ctx.save();
		ctx.translate(0,C_HEIGHT);
		ctx.fillStyle = 'blue';
		ctx.fillRect(bar.x, 0, barWidth, 10); 
		ctx.restore();
	}

	// change the postion of bar in each interval 
	// if there is a keyboard event
	function moveBar(e){
		keyCode  = e.keyCode || e.which;
		switch(keyCode){
			case 37 : changeBarPosition('left');
					  break;
			case 108 : changeBarPosition('left');
					  break;
			case 39 : changeBarPosition('right');
					  break;		  
			case 114 : changeBarPosition('right');
					  break;		  
		}
	}

	// function to change the bar position
	function changeBarPosition(dir){
		if(dir == 'right'){
			if((bar.x+barWidth) < C_WIDTH){
				bar.x += displacement;
			}
		}	
		else if(dir == 'left'){
			if((bar.x)>0){
				bar.x -= displacement;
			}
		}
	}


	// collission detection logic
	function checkCollision(){
		if(ball.y+radius==C_HEIGHT && (
				(ball.x < bar.x) || (bar.x + barWidth) < ball.x ) ){
					stopGame();
				}
		else if(ball.y+radius==C_HEIGHT ){

			updatePonits();
		}		
	}

	// update points and display on the screen
	function updatePonits(){
		points	+= p_inc;
		$('#current-point').html(points);
	}

	function clearCanvas(){
		ctx.clearRect(0,0,C_WIDTH+10,C_HEIGHT+10);
	}

	function speedUp(){
		step++;
	}

	function speedDown(){
		step--;
	}

	return {
		start : startGame,
		stop  : stopGame,
		pause : pauseGame,
	};
}

jQuery(function(){
	$ = jQuery;
	balls = new Balls({
					canvas : '#canvas'
				});
	$('#starter').click(function(){
		balls.start();
	})
	$('#stoper').click(function(){
		balls.pause();
	})
	
})
