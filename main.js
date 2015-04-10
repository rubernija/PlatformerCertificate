var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH;

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
//var chuckNorris = document.createElement("img");
//chuckNorris.src = "hero.png";
var heartImage = document.createElement("img");
heartImage.src = "heartImage.psd";

var score = 0;
var lives = 3;

var LAYER_COUNT = 3;
var MAP = {tw:131, th:19};
var TILE = 35;
var TILESET_TILE = 70;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;


var LAYER_PLATFORMS = 0;
var LAYER_BACKGROUND = 1;
var LAYER_LADDERS = 2;


var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;

var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;

var ANIM_MAX = 6;


var keyboard = new Keyboard();
var player = new Player();
var enemies = [];


 enemies.push(new Enemey(4550,290));
 enemies.push(new Enemey(750,290));
 //enemies.push(new Enemey(2050,290));
 //enemies.push(new Enemey(950,290));
 //enemies.push(new Enemey(1050,290));
 //enemies.push(new Enemey(1150,290));

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var timer = 0;


var cells = [];

function initializeCollision()
{
   for ( var layerIdx = 0 ; layerIdx < LAYER_COUNT ; ++layerIdx )
   {
      cells[layerIdx] = [];
	  var idx = 0;
        
		for ( var y = 0 ; y < TileMaps["level1"].layers[layerIdx].height ; ++y )
		{
		    cells[layerIdx][y] = [];
		    //loop through each cell
		    for ( var x = 0 ; x < TileMaps["level1"].layers[layerIdx].width ; x++)
		   {
		      if ( TileMaps["level1"].layers[layerIdx].data[idx] != 0)
		      {
			      cells[layerIdx][y][x] = 1;
				  cells[layerIdx][y-1][x] = 1;
				  cells[layerIdx][y-1][x+1] = 1;
				  cells[layerIdx][y-1][x+1] = 1;
			  
			  }
		     else if (cells[layerIdx][y][x] != 1)
			 {
			     cells[layerIdx][y][x] = 0;
			 }
		   
		    ++idx;
		   }
		}
	 }
   }

   function cellAtPixelCoord(layer, x, y)
{
    var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}
   
   
   
   
 function tileToPixel(tile_coord)
 {
     return tile_coord * TILE;
 }
 
 function pixelToTile(pixel)
 {
    return Math.floor(pixel / TILE);
 }
 
 
 function cellAtTileCoord(layer, tx, ty)
 {
     if ( tx < 0 || tx >= MAP.tw || ty < 0 )
	 {
	      return 1;
	 }
     
	 if ( ty >=MAP.th )
     {
	   return 0;
	 }	 
	
    return cells[layer][ty][tx];
}

   
   
   
function drawMap(offsetX, offsetY)	
{  

  //this loops over all the layers in our tilemap
  for (var layerIdx = 0 ; layerIdx < LAYER_COUNT ; ++layerIdx )
  {
    //render everything in the current layer (layerIdx)
    //look at every tile in the current layer, and render them.
    
	var idx = 0; 
	
	//look at each row
    for ( var y = 0 ; y < TileMaps["level1"].layers[layerIdx].height ; ++ y )
   {
     //look at each tile in the row 
    for ( var x = 0 ; x < TileMaps["level1"].layers[layerIdx].width ; ++ x )
	{
	  
	  var tileIndex = TileMaps["level1"].layers[layerIdx].data[idx] - 1;
	  
	    if ( tileIndex != -1 )
		{
		   //draws the  current tile at the current location 
		
		   var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X)*
                                      (TILESET_TILE + TILESET_SPACING);
		   var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_X))*
		                              (TILESET_TILE + TILESET_SPACING)
									  
		   var dx = x * TILE - offsetX;
		   var dy = (y-1) * TILE - offsetY;
		   
		   
		   context.drawImage(tileset, sx , sy, TILESET_TILE, TILESET_TILE,
		                              dx, dy, TILESET_TILE, TILESET_TILE); 
		  
		}
		
		++idx;
	}
   
   }	
  
  }
		
	
	
     for (var i=0; i<lives; i++)
	 {
	       //context.drawImage(heartImage);
	 }
 
    
 }

  
  var bgMusic = new Howl(
  {
     urls:["music.mp3"],
	 loop:true,
	 buffer:true,
	 volume:0.5
  }); 
  bgMusic.play(); 
  
function runSplash(deltaTime)
{
   if ( this.health <= 0 )
   {
         gameState = STATE_GAMEOVER;
		 return;
   }
       context.fillStyle = "#000";
	   context.font = "24px Arial";
	   context.fillText("You Lose", 200, 140);
  }

function run()
{
	context.fillStyle = "#143";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	if ( deltaTime > 0.03)
	{
	  deltaTime = 0.03;
	}
	
	switch(gameState)
	{
	case STATE_GAME:
		runSplash(deltaTime);
		break;
	case STATE_GAMEOVER:
	 runGameOver(deltaTime);
	}
	
	
	
	
	timer += deltaTime;
	
	var xScroll = player.position.x - player.startPos.x;
	var yScroll = 0;
	
	if ( xScroll < 0 )
	    xScroll =0;
	if (xScroll > MAP.tw * TILE - canvas.width)
	    xScroll = MAP.tw * TILE - canvas.width;
	
	//context.drawImage(chuckNorris, SCREEN_WIDTH/2 - chuckNorris.width/2, SCREEN_HEIGHT/2 - chuckNorris.height/2);
	drawMap(xScroll, 0);
	
	player.update(deltaTime);
	player.draw(xScroll, 0);
	
	context.fillStyle = "yellow";
	context.font = "32px Arial"; 
	var timerSeconds = Math.floor(timer);
	var timerMilliseconds = Math.floor((timer - timerSeconds ) * 1000);
	var textToDisplay = "Timer: " + timerSeconds + ":" + timerMilliseconds;
	context.fillText(textToDisplay, 1300, 30);
   
	
	
	
	for ( var i = 0 ; i < enemies.length ; ++i )
	{
		enemies[i].update(deltaTime);
		enemies[i].draw(xScroll,yScroll);
	}
	
	if ( player.health <=0 )
	{
	  player.position.set(canvas.width/8, canvas.height/2 );
	  player.health = 4;
	}

			
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}


//
//replace level1. 
//with TileMaps["level1"].
//

initializeCollision();
	



//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
