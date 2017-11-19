function Block(id, name, imageX, imageY, colidable, transparent){
	this.id = id;
	this.name = name;
	this.imageX = imageX;
	this.imageY = imageY;
	this.colidable = colidable;
	this.transparent = transparent;

	this.drawTop = function(x, y){
		display.viewport.drawImage(game.tiles, this.imageX, this.imageY, 32, 24, x, y, display.tileWidth, display.tileHeight);
	};

	this.drawSide = function(x, y){
		display.viewport.drawImage(game.tiles, this.imageX, this.imageY + 24, 32, 24, x, y + display.tileHeight, display.tileWidth, display.tileHeight);
	};
}

var blocks = new Array();
var newBlock = null;

var AIR = 0;
newBlock = new Block(AIR, 'Air', 0, 0, false, true);
blocks.push(newBlock);

var GRASS = 1;
newBlock = new Block(GRASS, 'Grass', 32, 0, true, false);
blocks.push(newBlock);

var DIRT = 2;
newBlock = new Block(DIRT, 'Dirt', 64, 0, true, false);
blocks.push(newBlock);

var SAND = 3;
newBlock = new Block(SAND, 'Sand', 96, 0, true, false);
blocks.push(newBlock);

var WATER = 4;
newBlock = new Block(WATER, 'Water', 128, 0, false, false);
blocks.push(newBlock);

var LOG = 5;
newBlock = new Block(LOG, 'Log', 160, 0, true, false);
blocks.push(newBlock);

var LEAVES = 6;
newBlock = new Block(LEAVES, 'Leaves', 192, 0, true, true);
blocks.push(newBlock);