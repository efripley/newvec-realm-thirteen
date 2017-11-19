function Player(){
	this.location = {x:0, y:0, z:0, dir:0};
	this.height = 2;
	this.state = 0;//0:move, 1:jump, 2:build 3:build lock
	this.actElevation = 0; //Elevation from player elevation to perform action
	this.sprite = null;
	this.inventory = new Array();
	this.slot = 0;

	this.init = function(){
		this.sprite = nvId('player-image');
		this.location.x = world.lengthX / 2;
		this.location.y = world.lengthY / 2;
		this.location.z = world.lengthZ - 1;
		world.addEffect(this.location);
		for(var a = 0; a < 5; a++)
			this.inventory.push({item:0, amount:0});
	}

	this.act = function(direction){
		this.location.dir = direction;
		if(this.location.dir >= 4)
			this.location.dir -= 4;

		if(this.state == 0)
			this.move();
		else if(this.state == 1)
			this.jump();
		else if(this.state == 2)
			this.action();
		else if(this.state == 3)
			this.actionLock();

		if(this.state != 3)
			this.state = 0;
	};

	this.move = function(){
		this.location.x += game.direction[this.location.dir][0];
		this.location.y += game.direction[this.location.dir][1];

		if(!world.requestMovement(this.location, this.height)){
			console.log('Can not move here');
			this.location.x -= game.direction[this.location.dir][0];
			this.location.y -= game.direction[this.location.dir][1];
		}
		else
			world.addEffect(this.location);
	};

	this.toggleJump = function(){
		if(this.state != 1)
			this.state = 1;
		else
			this.state = 0;
	}

	this.jump = function(){
		this.location.x += game.direction[this.location.dir][0];
		this.location.y += game.direction[this.location.dir][1];
		this.location.z++;

		if(!world.requestMovement(this.location, this.height)){
			console.log('Can not move here');
			this.location.x -= game.direction[this.location.dir][0];
			this.location.y -= game.direction[this.location.dir][1];
			this.location.z--;
		}
		else
			world.addEffect(this.location);
	}

	this.toggleAction =  function(){
		if(this.state == 2)
			this.state = 3;
		else if(this.state < 2)
			this.state = 2;
		else
			this.state = 0;
	}

	this.actionLock = function(){
		var actX = this.location.x + game.direction[this.location.dir][0];
		var actY = this.location.y + game.direction[this.location.dir][1];
		var actZ = this.location.z + this.actElevation;;

		if(this.actElevation >= 0 && world.empty(actX, actY, actZ)){
			console.log('moving');
			this.move();
			console.log('fliping');
			this.flipDirection();
			console.log('placing');

			actX = this.location.x + game.direction[this.location.dir][0];
			actY = this.location.y + game.direction[this.location.dir][1];
			actZ = this.location.z + this.actElevation;

			this.placeBlock(actX, actY, actZ);
		}
		else if(this.actElevation < 0 && !world.empty(actX, actY, actZ)){
			this.move();
			this.flipDirection();

			actX = this.location.x + game.direction[this.location.dir][0];
			actY = this.location.y + game.direction[this.location.dir][1];
			actZ = this.location.z + this.actElevation;

			var block = world.map[actX][actY][actZ];
			this.addToInventory(block);
			world.map[actX][actY][actZ] = AIR;
		}
		else if(this.actElevation >= 0 && !world.empty(actX, actY, actZ)){
			var block = world.map[actX][actY][actZ];
			this.addToInventory(block);
			world.map[actX][actY][actZ] = AIR;
			this.move();
		}
		else if(this.actElevation < 0 && world.empty(actX, actY, actZ)){
			this.placeBlock(actX, actY, actZ);
			this.move();
		}
	}

	this.action = function(){

		var actX = this.location.x + game.direction[this.location.dir][0];
		var actY = this.location.y + game.direction[this.location.dir][1];
		var actZ = this.location.z + this.actElevation;

		console.log(this.state);

		if(world.empty(actX, actY, actZ) && this.state == 3){
			console.log('moving');
			this.move();
			console.log('fliping');
			this.flipDirection();
			console.log('placing');

			actX = this.location.x + game.direction[this.location.dir][0];
			actY = this.location.y + game.direction[this.location.dir][1];
			actZ = this.location.z + this.actElevation;

			this.placeBlock(actX, actY, actZ);
		}

		else if(world.map[actX][actY][actZ] != AIR){
			if(world.isATree(actX, actY, actZ)){
				while(actZ < world.lengthZ){
					var block = world.map[actX][actY][actZ];

					if(block == LOG){
						this.addToInventory(block);
						world.map[actX][actY][actZ] = AIR;
					}
					else if(block == LEAVES){
						for(var ay = -2; ay <= 2; ay++){
							for(var ax = -2; ax <= 2; ax++){
								var block = world.map[actX + ax][actY + ay][actZ];
								if(block == LEAVES){
									world.map[actX + ax][actY + ay][actZ] = AIR;
								}
							}
						}
					}
					else
						break;

					actZ++;
				}
			}
			else if(this.addToInventory(world.map[actX][actY][actZ]))
				world.map[actX][actY][actZ] = AIR;
		}
		else{
			if(this.hasInventory()){
				world.map[actX][actY][actZ] = this.useInventory();
			}
		}
	}

	this.flipDirection = function(){
		this.location.dir += 2;

		if(this.location.dir >= 4)
			this.location.dir -= 4;
	}

	this.placeBlock = function(x, y, z){
		if(this.hasInventory()){
			world.map[x][y][z] = this.useInventory();
		}
	}

	this.cycleElevation = function(){
		this.actElevation++;

		if(this.actElevation >= 3)
			this.actElevation = -1;
	}

	this.isAt = function(x, y, z){
		if(x == this.location.x && y == this.location.y && z == this.location.z)
			return true;
		return false;
	}

	this.addToInventory = function(id){
		for(var a = 0; a < 5; a++){
			if(id == this.inventory[a].item && this.inventory[a].amount < 50){
				this.inventory[a].amount++;
				nvId('slot' + (a + 1)).innerHTML = this.inventory[a].amount;
				return true;
			}
		}
		for(var a = 0; a < 5; a++){
			if(this.inventory[a].item == 0){
				this.inventory[a].item = id;
				this.inventory[a].amount = 1;
				nvId('slot' + (a + 1)).innerHTML = this.inventory[a].amount;
				return true;
			}
		}
		return false;
	}

	this.hasInventory = function(){
		return this.inventory[this.slot].item != 0;
	}

	this.useInventory = function(){
		var item = this.inventory[this.slot].item;

		this.inventory[this.slot].amount--;
		if(this.inventory[this.slot].amount == 0){
			this.inventory[this.slot].item = 0;
			nvId('slot' + (this.slot + 1)).innerHTML = "";
		}
		else
			nvId('slot' + (this.slot + 1)).innerHTML = this.inventory[this.slot].amount;

		return item;
	}

	this.cycleInventory = function(){
		nvClass('slot')[this.slot].style.borderColor = " #c84b00";

		this.slot++;
		if(this.slot > 4)
			this.slot = 0;

		nvClass('slot')[this.slot].style.borderColor = " #fff";
	}

	this.draw = function (x, y){
		var spriteOffsetX = display.applyPerspective(this.location.dir) * 16; 
		var drawOffsetY = Math.floor(display.tileHeight / 4);
		if(this.location.dir == 1 || this.location.dir == 3)
			drawOffsetY = Math.floor(display.tileHeight / 6);
		display.viewport.drawImage(this.sprite, spriteOffsetX, 0, 16, 24, x, y - drawOffsetY, display.tileWidth, display.tileHeight * 2);
		
		this.drawInventory();
	}

	this.drawBottom = function(x, y){
		var spriteOffsetX = display.applyPerspective(this.location.dir) * 64 + 256; 
		display.viewport.drawImage(game.tiles, spriteOffsetX, 0, 32, 48, x, y, display.tileWidth, display.tileHeight * 2);
	}

	this.drawTop = function(x, y){
		var spriteOffsetX = display.applyPerspective(this.location.dir) * 64 + 288; 
		display.viewport.drawImage(game.tiles, spriteOffsetX, 0, 32, 48, x, y, display.tileWidth, display.tileHeight * 2);
		
		this.drawInventory();
	}

	this.drawInventory = function(){
		for(var a = 0; a < 5; a++){
			if(this.inventory[a].item != 0){
				var imageX = parseInt(blocks[this.inventory[a].item].imageX / 2);
				var imageY = parseInt(blocks[this.inventory[a].item].imageY / 2);

				nvId("slot" + (a + 1)).style.backgroundPosition = "-" + imageX + "px " + "-" + imageY + "px";
			}
			else
				nvId("slot" + (a + 1)).style.backgroundPosition = "0 0";
		}
	}

	this.debug = function(){
		if(nvId('debug-player-location')){
			nvId('debug-player-location').innerHTML = 'Player Location[x:' + this.location.x + ', y:' + this.location.y + ', z:' + this.location.z + ', direction:' + this.location.dir + ', act-elevation:' + this.actElevation + ']';
		}
		else{
			var locationDiv = document.createElement('div');
			locationDiv.setAttribute('id', 'debug-player-location');
			locationDiv.innerHTML = 'Player Location[x:' + this.location.x + ', y:' + this.location.y + ', z:' + this.location.z + ', direction:' + this.location.dir + ', act-elevation:' + this.actElevation + ']';
			nvId('debug-display').appendChild(locationDiv);
		}
	}
}

player = new Player();