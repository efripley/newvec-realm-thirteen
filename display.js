function Display(){
	this.width = 0;
	this.height = 0;
	this.canvas = null;
	this.viewport = null;
	this.showDebug = false;
	this.numTiles = 0;
	this.tileWidth = 32;
	this.tileHeight = 24;
	this.frameTime = 0;
	this.elevationSlider = null;
	this.originX = 0;
	this.originY = 0;
	this.zoomSize = 4;

	this.init = function(){
		this.canvas = nvId('viewport');
		this.viewport = this.canvas.getContext('2d');
		
		this.resize();

		//UI components
		this.elevationSlider = nvId('slider');
		this.directionIndicator = nvId('direction');

	};

	this.resize = function(){
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.numTiles = Math.max(parseInt(this.width / this.tileWidth + 1), parseInt(this.height / this.tileHeight + 1));

		var numXTilePixels = this.numTiles * this.tileWidth;
		var numYTilePixels = this.numTiles * this.tileHeight;
		this.originX = parseInt((this.width - numXTilePixels) / 2);
		this.originY = parseInt((this.height - numYTilePixels)  / 2) - this.tileHeight;
	}

	this.applyPerspective = function(direction){
		var rotation = direction - world.direction;
		if(rotation < 0)
			rotation += 4;
		return rotation;
	};

	this.zoom = function(){
		this.zoomSize++;

		if(this.zoomSize > 4)
			this.zoomSize = 2;

		this.tileWidth = this.zoomSize * 8;
		this.tileHeight = this.zoomSize * 6;

		this.resize();
	}

	this.toggleDebug = function(){
		this.showDebug = !this.showDebug;
		if(this.showDebug)
			nvClass('debug')[0].style.display = 'block';
		else
			nvClass('debug')[0].style.display = 'none';
	}

	this.update = function(){
		var start = new Date().getTime();

		this.viewport.clearRect(0, 0, this.width, this.height);

		var drawX = this.originX;
		var drawY = this.originY;
		var topZ = player.location.z + 2;
		while(topZ < world.lengthZ){
			if(blocks[world.map[player.location.x][player.location.y][topZ]].transparent)
				topZ++;
			else{
				topZ = player.location.z + 2;
				break;
			}
		}
		var az = 0;
		var ay = 0;
		var ax = 0;
		var endY = 0;
		var endX = 0;
		if(world.direction == 0){
			ay = Math.ceil(player.location.y - (this.numTiles / 2) - player.location.z);
			ax = Math.ceil(player.location.x - (this.numTiles / 2));
			endY = ay + this.numTiles;
			endX = ax + this.numTiles;
		}
		else if(world.direction == 1){
			ay = Math.ceil(player.location.y - (this.numTiles / 2));
			ax = Math.floor(player.location.x + (this.numTiles / 2)) + player.location.z;
			endY = ay + this.numTiles;
			endX = ax - this.numTiles - 1;
		}
		else if(world.direction == 2){
			ay = Math.floor(player.location.y + (this.numTiles / 2)) + player.location.z;
			ax = Math.floor(player.location.x + (this.numTiles / 2));
			endY = ay - this.numTiles - 1;
			endX = ax - this.numTiles - 1;
		}
		else if(world.direction == 3){
			ay = Math.floor(player.location.y + (this.numTiles / 2));
			ax = Math.ceil(player.location.x - (this.numTiles / 2)) - player.location.z;
			endY = ay - this.numTiles - 1;
			endX = ax + this.numTiles;
		}

		while(az < topZ){
			while((ay < endY + az && world.direction == 0) || (ax > endX - az && world.direction == 1) || (ay > endY - az && world.direction == 2) || (ax < endX + az && world.direction == 3)){
				while((ax < endX && world.direction == 0) || (ay < endY && world.direction == 1) || (ax > endX && world.direction == 2) || (ay > endY && world.direction == 3)){
					if(nvInLimits2D(ax, 0, this.lengthX - 1, ay, 0, this.lengthY - 1) && nvInLimits2D(drawX, 0 - this.tileWidth, this.width + this.tileWidth, drawY, 0 - this.tileHeight * 2, this.height + this.tileHeight * 2)){
						if(world.map[ax][ay][az] == AIR && this.transparentAbove(ax, ay, az)){
							if(world.direction == 0 && !blocks[world.map[ax][ay][az - 1]].transparent){
								if(!blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawShadowLeft(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawShadowRight(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawShadowTop(drawX, drawY + this.tileHeight);
							}
							else if(world.direction == 1 && !blocks[world.map[ax][ay][az -1]].transparent){
								if(!blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawShadowLeft(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawShadowRight(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawShadowTop(drawX, drawY + this.tileHeight);
							}
							else if(world.direction == 2 && !blocks[world.map[ax][ay][az -1]].transparent){
								if(!blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawShadowLeft(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawShadowRight(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawShadowTop(drawX, drawY + this.tileHeight);
							}
							else if(world.direction == 3 && !blocks[world.map[ax][ay][az -1]].transparent){
								if(!blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawShadowLeft(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawShadowRight(drawX, drawY + this.tileHeight);
								if(!blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawShadowTop(drawX, drawY + this.tileHeight);
							}
						}
						if(world.map[ax][ay][az] != 0 && (this.transparentAbove(ax, ay, az) || az == topZ - 1)){
							blocks[world.map[ax][ay][az]].drawTop(drawX, drawY);

							if(world.direction == 0 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawLineTop(drawX, drawY);
								if(blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawLineBottom(drawX, drawY);
								if(blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawLineLeft(drawX, drawY);
								if(blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawLineRight(drawX, drawY);
							}
							else if(world.direction == 1 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawLineTop(drawX, drawY);
								if(blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawLineBottom(drawX, drawY);
								if(blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawLineLeft(drawX, drawY);
								if(blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawLineRight(drawX, drawY);
							}
							else if(world.direction == 2 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawLineTop(drawX, drawY);
								if(blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawLineBottom(drawX, drawY);
								if(blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawLineLeft(drawX, drawY);
								if(blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawLineRight(drawX, drawY);
							}
							else if(world.direction == 3 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawLineTop(drawX, drawY);
								if(blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawLineBottom(drawX, drawY);
								if(blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawLineLeft(drawX, drawY);
								if(blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawLineRight(drawX, drawY);
							}
						}
						if(ax == player.location.x && ay == player.location.y && az == player.location.z){
							player.drawBottom(drawX, drawY);
						}
						else if(ax == player.location.x && ay == player.location.y && az == player.location.z + 1){
							player.drawTop(drawX, drawY);
						}
						if(world.map[ax][ay][az] != 0 && this.transparentSide(ax, ay, az)){
							blocks[world.map[ax][ay][az]].drawSide(drawX, drawY);

							if(world.direction == 0 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawLineLeft(drawX, drawY + this.tileHeight);
								if(blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawLineRight(drawX, drawY + this.tileHeight);
							}
							else if(world.direction == 1 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawLineLeft(drawX, drawY + this.tileHeight);
								if(blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawLineRight(drawX, drawY + this.tileHeight);
							}
							else if(world.direction == 2 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax + 1][ay][az]].transparent)
									this.drawLineLeft(drawX, drawY + this.tileHeight);
								if(blocks[world.map[ax - 1][ay][az]].transparent)
									this.drawLineRight(drawX, drawY + this.tileHeight);
							}
							else if(world.direction == 3 && world.map[ax][ay][az] != LEAVES){
								if(blocks[world.map[ax][ay + 1][az]].transparent)
									this.drawLineLeft(drawX, drawY + this.tileHeight);
								if(blocks[world.map[ax][ay - 1][az]].transparent)
									this.drawLineRight(drawX, drawY + this.tileHeight);
							}
						}
					}

					drawX += this.tileWidth;
					if(world.direction == 0)
						ax++;
					else if(world.direction == 1)
						ay++;
					else if(world.direction == 2)
						ax--;
					else if(world.direction == 3)
						ay--;
				}
				drawY += this.tileHeight;
				drawX = this.originX;

				if(world.direction == 0){
					ax = Math.ceil(player.location.x - this.numTiles / 2);
					ay++;
				}
				else if(world.direction == 1){
					ax--;
					ay = Math.ceil(player.location.y - this.numTiles / 2);
				}
				else if(world.direction == 2){
					ay--;
					ax = Math.floor(player.location.x + this.numTiles / 2);
				}
				else if(world.direction == 3){
					ax++;
					ay = Math.floor(player.location.y + (this.numTiles / 2));
				}
			}
			drawX = this.originX;
			drawY = this.originY;

			if(world.direction == 0){
				ax = Math.ceil(player.location.x - this.numTiles / 2);
				ay = Math.ceil(player.location.y - this.numTiles / 2) + az - player.location.z;
			}
			else if(world.direction == 1){
				ax = Math.floor(player.location.x + this.numTiles / 2) - az + player.location.z;
				ay = Math.ceil(player.location.y - this.numTiles / 2); 
			}
			else if(world.direction == 2){
				ay = Math.floor(player.location.y + (this.numTiles / 2)) - az + player.location.z;
				ax = Math.floor(player.location.x + (this.numTiles / 2));
			}
			else if(world.direction == 3){
				ay = Math.floor(player.location.y + (this.numTiles / 2));
				ax = Math.ceil(player.location.x - (this.numTiles / 2)) + az - player.location.z;
			}

			az++;
		}

		this.updateUI();

		if(this.showDebug){
			player.debug();
			world.debug();

			var end = new Date().getTime();
			this.frameTime = end - start;

			this.debug();
		}

	};

	this.transparentAbove = function(x, y, z){
		if(z == world.lengthZ - 1)
			return true;
		else
			return blocks[world.map[x][y][z + 1]].transparent;
	}

	this.transparentSide = function(x, y, z){
		if(world.direction == 0){
			if(y == world.lengthY - 1)
				return true;
			else
				return blocks[world.map[x][y + 1][z]].transparent;
		}
		else if(world.direction == 1)
		{
			if(x == 1)
				return true;
			else
				return blocks[world.map[x - 1][y][z]].transparent;
		}
		else if(world.direction == 2)
		{
			if(y == 1)
				return true;
			else
				return blocks[world.map[x][y - 1][z]].transparent;
		}
		else if(world.direction == 3){
			if(x == world.lengthX - 1)
				return true;
			else
				return blocks[world.map[x + 1][y][z]].transparent;
		}
	}

	this.drawShadowLeft = function(drawX, drawY){
		this.viewport.fillStyle = "rgba(0, 0, 0, .5)";
		this.viewport.fillRect(drawX, drawY, this.tileWidth / 4, this.tileHeight);
		this.viewport.stroke();
	}

	this.drawShadowRight = function(drawX, drawY){
		this.viewport.fillStyle = "rgba(0, 0, 0, .5)";
		this.viewport.fillRect(drawX + (3 * this.tileWidth / 4), drawY, this.tileWidth / 4, this.tileHeight);
		this.viewport.stroke();
	}

	this.drawShadowTop = function(drawX, drawY){
		this.viewport.fillStyle = "rgba(0, 0, 0, .5)";
		this.viewport.fillRect(drawX, drawY, this.tileWidth, this.tileHeight / 2);
		this.viewport.stroke();
	}

	this.drawLineTop = function(drawX, drawY){
		this.viewport.fillStyle = "#000";
		this.viewport.fillRect(drawX, drawY, this.tileWidth, 1);
		this.viewport.stroke();
	}

	this.drawLineBottom = function(drawX, drawY){
		this.viewport.fillStyle = "#000";
		this.viewport.fillRect(drawX, drawY + this.tileHeight - 1, this.tileWidth, 1);
		this.viewport.stroke();
	}

	this.drawLineLeft = function(drawX, drawY){
		this.viewport.fillStyle = "#000";
		this.viewport.fillRect(drawX, drawY, 1, this.tileHeight);
		this.viewport.stroke();
	}

	this.drawLineRight = function(drawX, drawY){
		this.viewport.fillStyle = "#000";
		this.viewport.fillRect(drawX + this.tileWidth - 1, drawY, 1, this.tileHeight);
		this.viewport.stroke();
	}

	this.updateUI = function(){
		var sliderTop = 2.5 + (50 - (player.actElevation * 25));
		slider.style.top = sliderTop + '%';

		this.directionIndicator.setAttribute('style', 'transform: rotate(' + (world.direction * 90 * -1) + 'deg);');
		
		if(player.state == 1)
			nvId('jump-indicator').style.display = 'block';
		else
			nvId('jump-indicator').style.display = 'none';
		if(player.state == 2)
			nvId('action-indicator').style.display = 'block';
		else
			nvId('action-indicator').style.display = 'none';
		if(player.state == 3)
			nvId('action-lock-indicator').style.display = 'block';
		else
			nvId('action-lock-indicator').style.display = 'none';
	}

	this.debug = function(){
		if(nvId('debug-display-js')){
			nvId('debug-display-js').innerHTML = 'Display [frame-time:' + this.frameTime + ']';
		}
		else{
			var locationDiv = document.createElement('div');
			locationDiv.setAttribute('id', 'debug-display-js');
			locationDiv.innerHTML = 'Display [frame-time:' + this.frameTime + ']';
			nvId('debug-display').appendChild(locationDiv);
		}
	}
}

display = new Display();