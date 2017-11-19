function Input(){
	this.mode = 0;

	this.init = function(){
		window.addEventListener('keydown', function(key){input.handleKey(key);});
	};

	this.handleKey = function(key){
		if(key.keyCode == 87)//W | Up Key 38
			this.upKey();
		else if(key.keyCode == 68)//D | Right Key
			this.rightKey();
		else if(key.keyCode == 83)//S | Down Key
			this.downKey();
		else if(key.keyCode == 65)//A | Left Key
			this.leftKey();
		else if(key.keyCode == 32)//Space
			this.jumpButton();
		else if(key.keyCode == 74)//J
			this.button1();
		else if(key.keyCode == 75)//K
			this.button2();
		else if(key.keyCode == 73)//I
			this.button3();
		else if(key.keyCode == 76)//L
			this.button4();
		else if(key.keyCode == 49)//1
			this.debugButton();
		else if(key.keyCode == 90)//Z
			this.zoomButton();

		display.update();
	};

	this.upKey = function(){
		player.act(world.direction);
	};

	this.rightKey = function(){
		player.act(world.direction + 1);
	};

	this.downKey = function(){
		player.act(world.direction + 2);
	};

	this.leftKey = function(){
		player.act(world.direction + 3);
	};

	this.button1 = function(){
		player.toggleAction();
	};

	this.button2 = function(){
		player.cycleElevation();
	}

	this.button3 = function(){
		player.cycleInventory();
	}

	this.button4 = function(){
		world.rotate();
	}

	this.jumpButton = function(){
		player.toggleJump();
	}

	this.debugButton = function(){
		display.toggleDebug();
	};

	this.zoomButton = function(){
		display.zoom();
	}

}

var input = new Input();