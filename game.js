function Game(){
	this.direction = [[0, -1], [1, 0], [0, 1], [-1, 0]]; //uses rotation number (0 to 3) to find respective dirX and dirY
	this.tiles = nvId('tiles-image');
	
	this.init = function(){
		world.init();
		player.init();
		display.init();
		input.init();

		display.update();

		window.alert('Welcome To Realm Thirteen! \n Controls are as follows:\n Use "wasd" keys to move\n Use "space-bar" to jump\n Use "j" key to remove and place blocks\n Use "k" key to cycle the layer to place/remove blocks\n Use "L" key to cycle through the invnetory\n Use "I" key to cycle through the 4 viewing directions\n Use "Z" key to zoom through 3 zoom settings\n Use "1" key to turn on debug info\n\n All ACTIONS buttons pressed in the game must be followed by a direction to perform the action\n Example: "space-bar" to jump and "w" for the up direction');
	};
}

var game = new Game();

window.addEventListener('load', function(){game.init();});
window.addEventListener('resize', function(){display.resize(); display.update();});