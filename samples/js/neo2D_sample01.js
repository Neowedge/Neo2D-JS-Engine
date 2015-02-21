/**
 * Author: Miguel López Ramírez
 * Date: 09/03/2012
 * Description: Test script
 * Engine: Neo2D Engine (GNU GPL)
 * Version: v0.0.1 Alfa
 * 
 * Objective:
 * Testing different features of first version of Neo2D Engine
 * 
 * Features tested:
 * - Double buffered!!
 * - Preload your resources!!!
 * - Easily and quickly creation of different 2D components!!!!
 * - Absolute control over game loop with only one function!!!
 * - Control over pause loop as a different level!!!
 * - Keyboard and pointer (mouse and touch!!!) easy and cross-platform access!!!
 * - Drag and drop with only 1 line!!!!
 * - Easily scrolling background!!!
 * 
 * Future features:
 * - Complete documentation
 * - More NeoEntity extended class: NeoButton, NeoTextBox, NeoListBox, etc.
 * - More NeoLayer extended class for ordering entities: NeoTable
 * - More NeoSprite extended class: NeoTileset
 * that it will allow you to get a NeoSprite object) 
 * - Automatic actions with new classes NeoAction and NeoSequence
 * - Pre-builded actions like NeoBubbleAction or NeoJumpAction
 * - Optimization of draw functions. 
 * - Post-render effects like light-maps and shadows-maps!!!
 * - Integration with physic engine
 * - Editor.
 *  
 *  IMPROVE YOUR GAME DEVELOPING EXPERIENCE WITH NEO2D ENGINE!!!!!!!!!!!!!
 *  ----------------------------------------------------------------------
 *  -------------          ITS FREE!!!!!!!!!!!!!!!           -------------
 *  ----------------------------------------------------------------------
 *  
*/

//onload document:
function Init()
{
	//Get canvas element
	var canvas = document.getElementById("myCanvas");//$("#myCanvas")[0];
	//Instanciate a NeoApplication
	var app = new NeoApplication(canvas);
	testLevel = new TestLevel("TestLevel");
	pauseLevel = new PauseLevel("PauseLevel");

	//Load the different levels on your application
	app.addLevel(testLevel);
	app.addLevel(pauseLevel);
	
	//Start your game when all resources are loaded
	app.loadLevel("TestLevel", true);	
}


function TestLevel(name)
{
	NeoLevel.call(this, name); //Implement NeoLevel class and start to make magic!!!
	var BASE_SPEED = 300;
	
	this.backgroundColor = "ghostwhite";
	this.droppable = true;
	
	this.velocityX = Math.random() * BASE_SPEED; //px/s
	this.velocityY = Math.random() * BASE_SPEED; //px/s
	
	this.testLabel1 = new NeoLabel(10, 10, "function update()");
	this.testLabel2 = new NeoLabel(100, 100, "Drag & Drop!!!", "purple", "Colibri", "24pt", FontStyle.Bold);
	this.testLabel3 = new NeoLabel(200, 200, "<- Arrows Keys ->", "blue", "Times New Roman", "21pt", FontStyle.ItalicBold);
	
	this.testLabel2.draggable = true; //Drag and drop with only 1 line!!!!!!! AWESOME!!!
	
	this.addChild(this.testLabel1);
	this.addChild(this.testLabel2);
	this.addChild(this.testLabel3);
	
	this.onStart = function()
	{
		//Events onStart(), onPause(), onResume() and onStop() will help you to control the game!!!!!!
		this.application.controller.setInputPointerEnabled();
		this.application.controller.setInputKeysEnabled();
	}
	
	this.update = function(delta)
	{
		//Control all your GAME LOOP implementing the function update!!!!!
		var x = delta * this.velocityX;
		var y = delta * this.velocityY;

		this.testLabel1.traslate(x, y);
		if (this.testLabel1.bound.x + this.testLabel1.bound.width > this.application.context.canvas.width || this.testLabel1.bound.x < 0)
		{
			this.velocityX = Math.random() * BASE_SPEED * (this.testLabel1.bound.x >= 0 ? -1 : 1);
		}
		if (this.testLabel1.bound.y + this.testLabel1.bound.height > this.application.context.canvas.height || this.testLabel1.bound.y < 0)
		{
			this.velocityY = Math.random() * BASE_SPEED * (this.testLabel1.bound.y >= 0 ? -1 : 1);
		}
		
		this.readInput(delta);
	}
	
	this.readInput = function(delta)
	{
		//Easy detection of INPUT frame by frame!!!!!!!!!!
		var controller = this.application.controller;
		var speed = delta * BASE_SPEED;
		
		if (controller.isKeyPressed(KeyCode.UpArrow))
		{
			this.testLabel3.traslate(0, -speed);
		}
		else if (controller.isKeyPressed(KeyCode.DownArrow))
		{
			this.testLabel3.traslate(0, speed);
		}
		if (controller.isKeyPressed(KeyCode.LeftArrow))
		{
			this.testLabel3.traslate(-speed, 0);
		}
		else if (controller.isKeyPressed(KeyCode.RightArrow))
		{
			this.testLabel3.traslate(speed, 0);
		}
		
		//Control the distinct events KeyDown, Key Pressed and KeyUp for improving your developing experience!!!!
		if (controller.isKeyDown(KeyCode.Enter))
		{
			//Set the current frame as background-image
			this.application.getLevel("PauseLevel").backgroundImage = this.application.context.canvas.getImage();
			//Load pause level
			this.application.loadLevel("PauseLevel", true, true);
		}
	}
}
TestLevel.prototype = new NeoLevel(); //I would like to get married with NeoLevel class ^^, and you????

//Pause level. This level will be loaded when player pause the game level
function PauseLevel(name)
{
	NeoLevel.call(this, name);
	
	this.onStart = function()
	{
		this.application.controller.setInputKeysEnabled();
	}
	
	this.update = function(delta)
	{
		this.readInput(delta);
	}
	
	this.readInput = function(delta)
	{
		if (this.application.controller.isKeyUp(KeyCode.Enter))
		{
			this.stop();
			this.application.loadLevel("TestLevel");
			this.application.getCurrentLevel().resume();
		}
	}
}
PauseLevel.prototype = new NeoLevel();

//Initialization
window.onload = Init;