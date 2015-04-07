var Enemey = function()
{
  this.image = document.createElement("img");
  
  this.x = canvas.width / 1.5;
  this.y = canvas.height / 2;
  
  this.width = 159;
  this.height = 163;

  this.velocityY = 0;
  this.velocityX = 0;
  
  this.angularVelocity = 0;
  
  this.rotation = 0;
  
  this.image.src = "ship.png"; 
};

Enemey.prototype.update = function(deltaTime)
{
   if ( Keyboard.isKeyDown(Keyboard.KEY_SPACE) )
 {
  this.rotation -= deltaTime;
 }
 else 
 { 
 this.rotation += deltaTime;
}
 
 }
 

Enemey.prototype.draw = function()
{
   context.save();
     
	 context.translate(this.x, this.y);
	 context.rotate(this.rotation);
	 context.drawImage(this.image, -this.width/2, -this.height/2);
   
   context.restore(); 
}
