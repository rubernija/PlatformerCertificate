var Enemey = function(x, y)
{
  this.image = document.createElement("img");
  this.image.src = "enemey.png";
  

  
  this.width = 98;
  this.height = 64;
  
  this.position = new Vector2();
  this.position.set(x,y);
  this.velocity = new Vector2();

  
 this. direction = RIGHT;

};

Enemey.prototype.update = function(deltaTime)
{
 var acceleration = new Vector2();
 var enemyAccel = 4000;
 var enemyDrag = 10;
 
 if ( this.direction == RIGHT)
 {
   acceleration.x = enemyAccel;
   
 }
 else
 {
    acceleration.x = -enemyAccel;
 }
   var dragX = this.velocity.x * enemyDrag;
   acceleration.x -= dragX;
   this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
   this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
 
    var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	ty++;
	tx++;
	
	
	
	var nx = this.position.x % TILE;
	var ny = this.position.y % TILE;


	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty)
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1)
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1)
 
   //walk along platform
      
   
  
  //if enemy runs into wall or falls off platform we will have him turn around 
  
	if ( this.direction == RIGHT )
	{
		if ( ! cell && (cell_right && nx ) )
		{
			this.direction = LEFT;
		}
		if (cell_down && (!cell_diag && nx) )
		{
			this.direction = LEFT;
		}
	}
	else
	{
		if (  cell && (!cell_right && nx ) )
		{
			this.direction = RIGHT;
		}
		if ( !cell_down && (cell_diag && nx) )
		{
			this.direction = RIGHT;
		}
	}
   
 
 }
 

Enemey.prototype.draw = function(offsetX, offsetY)
{
context.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY, this.width, this.height);
 }
