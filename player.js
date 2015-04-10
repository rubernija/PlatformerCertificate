var Player = function()
{
  
  this.health = 4;
  this.heartImage = document.createElement("img");
  this.heartImage.src = "Health crate.png"; 
  
  
  this.startPos = new Vector2();
  this.startPos.set(600, 250);
  
  this.width = 165;
  this.height = 125;
  
  this.sprite = new Sprite("ChuckNorris.png"); 
   
  this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
        [0, 1, 2, 3, 4, 5, 6, 7]); //left idle animation

  this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[8, 9, 10, 11, 12] ); //left jump animation
  
  this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[13,14 ,15 , 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] );// left walk animation 
  
  this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[53, 53, 54, 56, 57, 58, 59]); //right idle animation
  
  this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[60, 61, 62, 63, 64]); // right jump animation

  this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 77, 78]); // right walk animation  
   
 
 for (var i = 0 ; i <ANIM_MAX ; ++i)
 {
    this.sprite.setAnimationOffset( i, -this.width/ 2, -this.height/2);
 }
 
  this.position = new Vector2();
  this.position.set(canvas.width /8, canvas.height/2);
  
  this.velocity = new Vector2();
  
  //set width and hight to actual hight of the image file 
 

  this.jumping = false;
  this.falling = false;
  
  
  this.velocityY = 0;
  this.velocityX = 0;
  
  this.angularVelocity = 0;
  
  this.rotation = 0;
  
};

Player.prototype.changeDirectionalAnimation = function (leftAnim, rightAnim)
{
	if  (this.direction == LEFT)
	{
		if ( this.sprite.currentAnimation != leftAnim )
		{
			this.sprite.setAnimation(leftAnim);
		}
	}
	else 
	{
		if (this.sprite.currentAnimation != rightAnim ) 
		{
			this.sprite.setAnimation(rightAnim);
		}
	}
}

Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime)
	
	
	var acceleration  = new Vector2();
	var playerAccel = 5000;

	var jumpForce = 50000;

	this.direction = RIGHT;
	
	
	var playerDrag = 10;
	var playerGravity = TILE * 9.8 * 5;




	acceleration.y = playerGravity ;

	if ( keyboard.isKeyDown(keyboard.KEY_A) )
	{
		acceleration.x -= playerAccel;
	    this.direction = LEFT;
	}
	if ( keyboard.isKeyDown(keyboard.KEY_D) )
	{
		acceleration.x += playerAccel;
	    this.direction = RIGHT;
	}

	if ( this.velocity.y > 0 )
	{
		this.falling
	}
	else 
	{
		this.falling = false;
	}

	if ( keyboard.isKeyDown(keyboard.KEY_SPACE) && !this.jumping && !this.falling )
	{
		acceleration.y -= jumpForce;
		this.jumping = true;
	}

	
	// do animation logic 
	if ( this.jumping || this.falling)
	{
	   this.changeDirectionalAnimation(ANIM_JUMP_LEFT, ANIM_JUMP_RIGHT) 
	}
	    else 
		{
		  if (Math.abs(this.velocity.x) > 25)
		  {
		     this.changeDirectionalAnimation(ANIM_WALK_LEFT , ANIM_WALK_RIGHT);
		  }
	   
	   	
	     else 
		 {
		    this.changeDirectionalAnimation(ANIM_IDLE_LEFT, ANIM_IDLE_RIGHT);
		 }
	
       }	
	
	
	
	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.y = 0;
	acceleration = acceleration.subtract(dragVector);

	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	var collisionOffset = new Vector2();
	collisionOffset.set(-TILE/2, this.height/2 - TILE);
	
	var collisionPos = this.position.add(collisionOffset);
	

	
	var tx = pixelToTile(collisionPos.x);
	var ty = pixelToTile(collisionPos.y);

	var nx = collisionPos.x % TILE;
	var ny = collisionPos.y % TILE;


	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty)
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1)
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1)

	if ( this.velocity.y > 0)
	{
		if ((cell_down && !cell) || (cell_diag && !cell_right && nx) )
		{
			this.position.y = tileToPixel(ty) - collisionOffset.y;
			this.velocity.y = 0;
			ny = 0;
			this.jumping = false;
		}
	}
	else if (this.velocity.y < 0 )
	{
		if ( (cell && !cell_down ) || (cell_right && !cell_diag && nx) )
		{
			this.position.y = tileToPixel(ty + 1) - collisionOffset.y ;
			this.velocity.y = 0;

			cell = cell_down;
			cell_right = cell_diag;
			cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+2)
			cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+2)
			ny = 0;
		}
	}
	
	if (this.velocity.x > 0)
	{
		if ( (cell_right && !cell) || (cell_diag && !cell_down && ny) )
		{
			this.position.x = tileToPixel(tx)- collisionOffset.x;
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0)
	{
		if ((cell && !cell_right) || (cell_down && ! cell_diag && ny ))
		{
			this.position.x = tileToPixel(tx+1)- collisionOffset.x;
			this.velocity.x = 0;
		}
	}
	if ( this.position.y > MAP.th * TILE + this.height)
	{
		this.position.set(10, 2);
		this.velocity.set(10,2);
		this.health -= 1;
		timer = 0;
	   
	}
    else 
	{
	  if (this.health < 1 )
	  var textToDisplay
	}
}
 
 

Player.prototype.draw = function(offsetX, offsetY)
{
 this.sprite.draw(context, this.position.x - offsetX, this.position.y - offsetY);
  
  for ( var h = 0 ; h < this.health ; ++h )
  {
    context.drawImage(this.heartImage, 10 + 40 *h, 20);
  }

 if( this.health < 1 )
 {
   context.fillStyle = "yellow";
   context.font = "32px Arial"; 
   var textToDisplay = " You lose";
  context.fillText(textToDisplay,1000, 30); 
 }
	    
 
 }












