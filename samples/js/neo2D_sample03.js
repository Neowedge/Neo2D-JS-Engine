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
var IMAGE_PLAYER_URL = "img/sfighter.png";
var IMAGE_PLAYER_TAG = 0; //"dimamicPlayer";

var IMAGE_PLAYER_WIDTH = 43;
var IMAGE_PLAYER_HEIGHT = 39;

//onload document:
function Init()
{
	//Get canvas element
	var canvas = document.getElementById("myCanvas");//$("#myCanvas")[0];
	//Instanciate a NeoApplication
	var app = new NeoApplication(canvas);
	
	app.resetBuffer(20);
	
	//Load your resources easly with PxLoader
	app.addImage(IMAGE_PLAYER_TAG, IMAGE_PLAYER_URL);
	app.startLoad();
	
	testLevel = new TestLevel("TestLevel");
	
	//Load the different levels on your application
	app.addLevel(testLevel);
	
	//Start your game when all resources are loaded
	app.onLoadCompleted = function() {	app.loadLevel("TestLevel", true);	}; 
}

//Game level
function TestLevel(name)
{
	NeoLevel.call(this, name); //Implement NeoLevel class and start to make magic!!!
	
	this.backgroundColor = "grey";
	
	this.tableLayer;
	this.playerSprite;
	this.playerRect;
	this.playerEllipse;
	this.playerPolygon;
	
	this.onStart = function()
	{
		this.tableLayer = new NeoTable(84, 54, 6, 5, IMAGE_PLAYER_WIDTH, IMAGE_PLAYER_HEIGHT, 3, "black", "ghostwhite");
		this.tableLayer.droppable = true;
		
		this.playerSprite = new NeoSprite(0, 0, this.application.getImage(IMAGE_PLAYER_TAG));
		this.playerSprite.draggable = true;
		
		this.playerRect = new NeoRect(0, 0, IMAGE_PLAYER_WIDTH, IMAGE_PLAYER_HEIGHT, "#ffff00", 12, "#ff00ff", LineCap.Square, LineJoin.Round);
		this.playerRect.draggable = true;
		
		this.playerEllipse = new NeoEllipse(0, 0, IMAGE_PLAYER_WIDTH, IMAGE_PLAYER_HEIGHT, "#00ffff", 6, "#ff0000");
		this.playerEllipse.draggable = true;
		
		var polygonPoints = new Array(new NeoPoint(5,0), 
				new NeoPoint(0,35), 
				new NeoPoint(20,IMAGE_PLAYER_HEIGHT), 
				new NeoPoint(15,30), 
				new NeoPoint(IMAGE_PLAYER_WIDTH,10));
		this.playerPolygon = new NeoPolygon(0, 0, polygonPoints, "#ff0000", 1, "#ff0000");
		this.playerPolygon.draggable = true;
		
		this.tableLayer.addChildAtCellIndex(0, this.playerSprite);
		this.tableLayer.addChildInCellByPosition(3, 1, this.playerRect);
		this.tableLayer.addChildInCellByPosition(1, 3, this.playerEllipse);
		this.tableLayer.addChildAtCellIndex(28, this.playerPolygon);
		this.addChild(this.tableLayer);
		
		this.application.controller.setInputPointerEnabled();
	}
}
TestLevel.prototype = new NeoLevel(); //I would like to get married with NeoLevel class ^^, and you????


//Initialization
window.onload = Init;