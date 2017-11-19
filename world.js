function World(){
	this.direction = 0;
	this.lengthX = 512;
	this.lengthY = 256;
	this.lengthZ = 32;
	this.map = null;

	this.init = function(){
		this.map = nvArray3D(this.lengthX, this.lengthY, this.lengthZ, AIR);
		for(var az = 0; az < this.lengthZ / 2; az++){
			for(var ay = 0; ay < this.lengthY; ay++){
				for(var ax = 0; ax < this.lengthX; ax++){
						this.map[ax][ay][az] = DIRT;
				}
			}
		}

		this.genDesert();
		this.genLakes();
		this.genRivers();
		this.genMountains();
		this.genTerrain();
		this.genTrees();
		this.genForrest();
	}

	this.genDesert = function(){
		var width = 0;
		var height = 0;
		var x = 0;
		var y = 0;
		var size = 0;
		var move = 0;
		for(var a = 0; a < this.lengthX / 128; a++)
		{
			x = nvRand(this.lengthX);
			y = nvRand(this.lengthY);
			console.log('Desert @ ' + x + ', ' + y);
			size = nvRand(64) + 32;
			for(var b = 0; b < size; b++)
			{
				width = nvRand(3) + 3;
				height = nvRand(3) + 3;
				for(var c = 0; c < height; c++)
				{
					for(var d = 0; d < width; d++)
					{
						if(y + c >= 0 && y + c < this.lengthY && x + d >= 0 && x + d < this.lengthX)
						{
								this.map[x + d][y + c][this.lengthZ / 2] = SAND;
						}
					}
				}
				move =  nvRand(4);
				if(move == 0) y -= 3;
				else if(move == 1) x += 3;
				else if(move == 2) y += 3;
				else if(move == 3) x -= 3;
			}
		}
	}

	this.genLakes = function(){
		var width = 0;
		var height = 0;
		var x = 0;
		var y = 0;
		var size = 0;
		var move = 0;
		for(var a = 0; a < this.lengthX / 20; a++)
		{
			x = nvRand(this.lengthX);
			y = nvRand(this.lengthY);
			size = nvRand(15) + 5;
			for(var b = 0; b < size; b++)
			{
				width = nvRand(3) + 3;
				height = nvRand(3) + 3;
				for(var c = 0; c < height; c++)
				{
					for(var d = 0; d < width; d++)
					{
						if(y + c >= 0 && y + c < this.lengthY && x + d >= 0 && x + d < this.lengthX)
						{
								this.map[x + d][y + c][this.lengthZ / 2] = WATER;
						}
					}
				}
				move =  nvRand(4);
				if(move == 0) y -= 3;
				else if(move == 1) x += 3;
				else if(move == 2) y += 3;
				else if(move == 3) x -= 3;
			}
		}
	}

	this.genRivers = function(){
		var width = 0;
		var direction = 0;
		var x = 0;
		var y = 0;
		var move = 0;
		for(var a = 0; a < 3; a++)
		{
			direction = nvRand(2);
			if(direction == 0)
			{
				y = 0;
				x = nvRand(this.lengthX);
				for(var b = 0; b < this.lengthY; b++)
				{
					width += nvRand(3) - 1;
					if(width > 11) width = 11;
					else if(width < 5) width = 5;
					for(var c = x; c < x + width; c++)
					{
						if(c >= 0 && c < this.lengthX && b >= 0 && b < this.lengthY)
						{
							this.map[c][b][this.lengthZ / 2] = WATER;
						}
					}
					move = nvRand(3) - 1;
					x += move;
				}
			}
			else if(direction == 1)
			{
				y = nvRand(this.lengthY);
				x = 0;
				for(var b = 0; b < this.lengthX; b++)
				{
					width += nvRand(3) - 1;
					if(width > 11) width = 11;
					else if(width < 5) width = 5;
					for(var c = y; c < y + width; c++)
					{
						if(c >= 0 && c < this.lengthY && b >= 0 && b < this.lengthX)
						{
							this.map[b][c][this.lengthZ / 2] = WATER;
						}
					}
					move = nvRand(4) - 1;
					y += move;
				}
			}
		}		
	}

	this.genMountains = function(){
		var width = 0;
		var length = 0;
		var x = 0;
		var y = 0;
		var z = 0;
		var range = 0;
		var rangex = 0;
		var rangey = 0;
		for(var b = 0; b < 3; b++)
		{
			range = nvRand(25) + 75;
			rangex = nvRand(this.lengthX);
			rangey = nvRand(this.lengthY);
			rangex -= Math.floor(range / 2);
			rangey -= Math.floor(range / 2);
			for(var a = 0; a < 100; a++)
			{
				width = nvRand(20) + 5;
				length = nvRand(20) + 5;
				x = nvRand(range) + rangex;
				y = nvRand(range) + rangey;
				for(var c = 0; c < length; c++)
				{
					for(var d = 0; d < width; d++)
					{
						if(y + c >= 0 && y + c < this.lengthY && x + d >= 0 && x + d < this.lengthX)
						{
							z = this.lengthZ;
							while(this.map[x + d][y + c][z - 1] == AIR)
							{
								z--;
							}
							if(this.map[x + d][c + y][z - 1] != WATER && this.map[x + d][c + y][z - 1] != SAND)
							{
								this.map[x + d][c + y][z] = DIRT;
							}
						}
					}
				}
			}
		}
	}

	this.genTerrain = function(){
		var width = 0;
		var length = 0;
		var x = 0;
		var y = 0;
		var z = 0;
		for(var a = 0; a < 10; a++)
		{
			width = nvRand(75) + 25;
			length = nvRand(75) + 25;
			x = nvRand(this.lengthX);
			y = nvRand(this.lengthY);
			for(var c = 0; c < length; c++)
			{
				for(var d = 0; d < width; d++)
				{
					if(y + c >= 0 && y + c < this.lengthY && x + d >= 0 && x + d < this.lengthX)
					{
						z = this.lengthZ;
						while(this.map[x + d][y + c][z - 1] == AIR)
						{
							z--;
						}
						if(this.map[x + d][c + y][z - 1] != WATER && this.map[x + d][c + y][z - 1] != SAND)
						{
							this.map[x + d][c + y][z] = DIRT;
						}
					}
				}
			}
		}

		for(var ay = 0; ay < this.lengthY; ay++){
			for(var ax = 0; ax < this.lengthX; ax++){
				z = this.lengthZ;
				while(this.map[ax][ay][z - 1] == AIR)
					z--;

				if(this.map[ax][ay][z - 1] != WATER && this.map[ax][ay][z - 1] != SAND)
					this.map[ax][ay][z] = GRASS;
			}
		}
	}

	this.genTrees = function(){
		var x = 0;
		var y = 0;
		var z = 0;
		for(var a = 0; a < 250; a++)
		{
			x = nvRand(this.lengthX);
			y = nvRand(this.lengthY);
			z = this.lengthZ;
			while(this.map[x][y][z - 1] == AIR)
				z--;
			
			if(this.map[x][y][z - 1] == GRASS)
			{
				for(var b = z; b < z + 6; b++)
				{
					this.map[x][y][b] = LOG;
				}
				for(var b = y - 2; b <= y + 2; b++)
				{
					for(var c = x - 2; c <= x + 2; c++)
					{
						if(b >= 0 && b < this.lengthY && c >= 0 && c < this.lengthX)
						{
							this.map[c][b][z + 6] = LEAVES;
						}
					}
				}
			}
		}
	}

	this.genForrest = function(){
		var x = 0;
		var y = 0;
		var z = 0;
		var range = 0;
		var rangex = 0;
		var rangey = 0;
		for(var b = 0; b < 3; b++)
		{
			range = nvRand(50) + 25;
			rangex = nvRand(this.lengthX);
			rangey = nvRand(this.lengthY);
			rangex -= Math.floor(range / 2);
			rangey -= Math.floor(range / 2);
			for(var a = 0; a < 100; a++)
			{
				x = nvRand(range) + rangex;
				y = nvRand(range) + rangey;
				z = this.lengthZ - 1;
				if(x >= 0 && x < this.lengthX && y >= 0 && y < this.lengthY)
				{
					while(this.map[x][y][z - 1] == AIR)
					{
						z--;
					}
					if(this.map[x][y][z - 1] == GRASS)
					{
						for(var b = z; b < z + 6; b++)
						{
							this.map[x][y][b] = LOG;
						}
						for(var b = y - 2; b <= y + 2; b++)
						{
							for(var c = x - 2; c <= x + 2; c++)
							{
								if(b >= 0 && b < this.lengthY && c >= 0 && c < this.lengthX)
								{
									this.map[c][b][z + 6] = LEAVES;
								}
							}
						}
					}
				}
			}
		}
	}

	this.requestMovement = function(location, height){
		if(location.x < 0 || location.x >= this.lengthX)
			return false;
		else if(location.y < 0 || location.y >= this.lengthY)
			return false;
		else if(location.z < 0 || location.z + height - 1 >= this.lengthZ)
			return false;
		else if(blocks[this.map[location.x][location.y][location.z]].colidable || blocks[this.map[location.x][location.y][location.z + height - 1]].colidable)
			return false;
		else
			return true;
	}

	this.rotate = function(){
		this.direction++;
		if(this.direction >= 4)
			this.direction = 0;
	};

	this.addEffect = function(location){
		location = this.dropEffect(location);

		return location;
	};

	this.dropEffect = function(location){
		while(this.map[location.x][location.y][location.z - 1] == AIR){
			location.z--;
		}

		return location;
	}

	this.draw = function(){
		
	}

	this.debug = function(){
		if(nvId('debug-world')){
			nvId('debug-world').innerHTML = 'World [direction:' + this.direction + ', size-x: ' + this.lengthX + ', size-y:' + this.lengthY + ', size-z:' + this.lengthZ + ']';
		}
		else{
			var locationDiv = document.createElement('div');
			locationDiv.setAttribute('id', 'debug-world');
			locationDiv.innerHTML = 'World [direction:' + this.direction + ', size-x: ' + this.lengthX + ', size-y:' + this.lengthY + ', size-z:' + this.lengthZ + ']';
			nvId('debug-display').appendChild(locationDiv);
		}
	};

	this.isATree = function(x, y, z){
		while(z < this.lengthZ){
			var block = this.map[x][y][z];

			if(block == LEAVES && z > player.location.z)
				return true;
			else if(block != LOG)
				return false;

			z++;
		}
	}

	this.empty = function(x, y, z){
		return this.map[x][y][z] == AIR;
	}
}

var world = new World();