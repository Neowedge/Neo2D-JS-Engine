/**
 * Author: Miguel López Ramírez
 * Date: 16/03/2012
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

//Define your image's tags and urls
var IMAGE_BACKGROUND_URL = "img/background.png";
var IMAGE_SPLAYER_URL = "img/sfighter.png";
var IMAGE_DPLAYER_URL = "img/dfighter.png";
var IMAGE_BACKGROUND_TAG = 1; //"background";
var IMAGE_SPLAYER_TAG = 2; //"dimamicPlayer";
var IMAGE_DPLAYER_TAG = 3; //"staticPlayer";

var ANIMATION_DPLAYER_STATIC = 0;
var ANIMATION_DPLAYER_RIGHT = 1;
var ANIMATION_DPLAYER_RSTATIC = 2;
var ANIMATION_DPLAYER_LEFT = 3;
var ANIMATION_DPLAYER_LSTATIC = 4;

//onload document:
function Init()
{
	//Get canvas element
	var canvas = document.getElementById("myCanvas");//$("#myCanvas")[0];
	//Instanciate a NeoApplication
	var app = new NeoApplication(canvas);
	
	//Load your resources easly with PxLoader
	app.addImage(IMAGE_BACKGROUND_TAG, IMAGE_BACKGROUND_URL);
	app.addImage(IMAGE_SPLAYER_TAG, IMAGE_SPLAYER_URL);
	app.addImage(IMAGE_DPLAYER_TAG, IMAGE_DPLAYER_URL);
	app.startLoad();
	
	testLevel = new TestLevel("TestLevel");
	pauseLevel = new PauseLevel("PauseLevel");
	
	//Load the different levels on your application
	app.addLevel(testLevel);
	app.addLevel(pauseLevel);
	
	//Start your game when all resources are loaded
	app.onLoadCompleted = function() {	app.loadLevel("TestLevel", true);	}; 
}

//Game level
function TestLevel(name)
{
	NeoLevel.call(this, name); //Implement NeoLevel class and start to make magic!!!
	var BASE_SPEED = 120;
	var MOVE_SPEED = 90;
	
	var _speedX = 0;
	var _speedY = 0;

	this.droppable = true;
	this.staticPlayerSprite;
	this.dinamicPlayerSprite;

	
	this.onStart = function()
	{
		//Define quickly a background with scroll using your resources!!!!!!!
		this.backgroundImage = this.application.getImage(IMAGE_BACKGROUND_TAG);
		//this.backgroundRepeatX = true;
		this.backgroundRepeatY = true;
		//this.backgroundStretchX = true; //You can no stretch your background
		this.backgroundStretchY = false;
		//this.backgroundConstraint = false; //No keep the proportions on stretching
		this.backgroundScroll = Scroll.Vertical;
		this.backgroundScrollSpeed = BASE_SPEED;
		this.backgroundScrollLoop = -1; //Infinite

		this.staticPlayerSprite = new NeoSprite(this.application.context.canvas.width-120, this.application.context.canvas.height-100, this.application.getImage(IMAGE_SPLAYER_TAG));
		this.staticPlayerSprite.draggable = true;
		
		//Create a sprite sheet and define animations!!!!
		this.dinamicPlayerSprite = new NeoSpriteSheet(120, this.application.context.canvas.height-100, this.application.getImage(IMAGE_DPLAYER_TAG), true, this.application.getImage(IMAGE_DPLAYER_TAG).width/7, this.application.getImage(IMAGE_DPLAYER_TAG).height);
		this.dinamicPlayerSprite.addAnimation(ANIMATION_DPLAYER_STATIC, new Array(new NeoPoint(3, 0)));
		this.dinamicPlayerSprite.addAnimation(ANIMATION_DPLAYER_LEFT, new Array(new NeoPoint(2, 0), new NeoPoint(1, 0), new NeoPoint(0, 0)));
		this.dinamicPlayerSprite.addAnimation(ANIMATION_DPLAYER_LSTATIC, new Array(new NeoPoint(1, 0), new NeoPoint(2, 0), new NeoPoint(3, 0)));
		this.dinamicPlayerSprite.addAnimation(ANIMATION_DPLAYER_RIGHT, new Array(new NeoPoint(4, 0), new NeoPoint(5, 0), new NeoPoint(6, 0)));
		this.dinamicPlayerSprite.addAnimation(ANIMATION_DPLAYER_RSTATIC, new Array(new NeoPoint(5, 0), new NeoPoint(4, 0), new NeoPoint(3, 0)));

		this.dinamicPlayerSprite.playAnimation(ANIMATION_DPLAYER_STATIC);
		
		this.addChild(this.staticPlayerSprite);
		this.addChild(this.dinamicPlayerSprite);
		
		this.application.controller.setInputKeysEnabled();
		this.application.controller.setInputPointerEnabled();
	}
	
	this.update = function(delta)
	{		
		//Control all your GAME LOOP implementing the function update!!!!!
		var previousSpeedX = _speedX;
		var previousSpeedY = _speedY;
		_speedX = 0;
		_speedY = 0;
		
		this.readInput(delta);
		
		if (!this.isPaused())
		{
			this.dinamicPlayerSprite.traslate(_speedX, _speedY);
			
			//Simple animations
			if (_speedX > 0 && previousSpeedX <= 0)
				this.dinamicPlayerSprite.playAnimation(ANIMATION_DPLAYER_RIGHT);
			else if (_speedX == 0 && previousSpeedX > 0)
				this.dinamicPlayerSprite.playAnimation(ANIMATION_DPLAYER_RSTATIC);
			else if (_speedX < 0 && previousSpeedX >= 0)
				this.dinamicPlayerSprite.playAnimation(ANIMATION_DPLAYER_LEFT);
			else if (_speedX == 0 && previousSpeedX < 0)
				this.dinamicPlayerSprite.playAnimation(ANIMATION_DPLAYER_LSTATIC);
		}
		else
		{
			//Set the current frame as background-image
			this.application.getLevel("PauseLevel").backgroundImage = this.application.context.canvas.getImage();
			//Load pause level
			this.application.loadLevel("PauseLevel", true);
		}
	}
	
	this.readInput = function(delta)
	{
		//Easy detection of INPUT frame by frame!!!!!!!!!!
		var controller = this.application.controller;
		var speed = delta * MOVE_SPEED;
		
		//Control with WASD
		if (controller.isKeyPressed(KeyCode.UpArrow) || controller.isKeyPressed(KeyCode.W))
			_speedY -= speed;
		
		if (controller.isKeyPressed(KeyCode.DownArrow) || controller.isKeyPressed(KeyCode.S))
			_speedY += speed;

		if (controller.isKeyPressed(KeyCode.LeftArrow) || controller.isKeyPressed(KeyCode.A))
			_speedX -= speed;

		if (controller.isKeyPressed(KeyCode.RightArrow) || controller.isKeyPressed(KeyCode.D))
			_speedX += speed;
		
		
		//Control the distinct events KeyDown, Key Pressed and KeyUp for improving your developing experience!!!!
		if (controller.isKeyDown(KeyCode.Enter))
			this.pause();
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
		if (this.application.controller.isKeyDown(KeyCode.Enter))
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