/**
 * LIBRARY:
 * Name: Neo2D Engine
 * Version: Neo2D Engine v0.0.1 Alfa
 * Author: Miguel López Ramírez "Neowedge"
 * Released: 09/03/2012
 * Contact: neo2d@neowedge.com
 * 
 * COPYRIGHT
 * Neo2D Engine Copyright (C) 2012 Miguel López Ramírez 
 * GNU General Public License (http://www.gnu.org/licenses/gpl.txt)
 * 
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>. 
 *
 * @license "LICENSE.txt"
 * 
 * DEPENDENCIES
 * Loader powered by: PxLoader (http://thinkpixellab.com/pxloader/)
 * Sound Manager powered by: Sound Manager 2 (http://www.schillmania.com/projects/soundmanager2/)
 * 
 * @depends "pxloader.js"
 * @depends "soundmanager2.js"
 */

//DEBUG
var DEBUG = false;

//CONSTANTS
var DEFAULT_FPS = 30;
var DEFAULT_CELL_HEIGHT = 30;
var DEFAULT_CELL_WIDTH = 30;
var DEFAULT_BORDER_WIDTH = 1;

//ENUMS
var FontStyle =
{
	None : "",
	Bold : "bold",
	Italic : "italic",
	ItalicBold : "italic bold"
};

var TextAlign =
{
	Start : "start",
	End : "end",
	Left : "left",
	Right : "right",
	Center : "center"
};

var TextBaseline =
{
	Alphabetic : "alphabetic",
	Bottom : "bottom",
	Hanging : "hanging",
	Ideographic : "ideographic",
	Middle : "ideographic",
	Top : "top"
};

var LineCap =
{
	Butt : "butt",
	Round : "round",
	Square : "square"
};

var LineJoin =
{
	Bevel : "bevel",
	Round : "round",
	Miter : "miter"
};

var CursorStyle =
{
	Auto : "auto",
	Default : "default",
	Crosshair : "crosshair",
	Help : "help",
	Move : "move",
	Pointer : "pointer",
	Progress : "progress",
	Text : "text",
	Wait : "wait",
	NorthResize : "n-resize",
	NortheastResize : "ne-resize",
	EastResize : "e-resize",
	SoutheastResize : "se-resize",
	SouthResize : "s-resize",
	SouthwestResize : "sw-resize",
	WestResize : "w-resize",
	NorthwestResize : "nw-resize"
};

var Scroll =
{
	None : 0,
	Horizontal : 1,
	Vertical : 2
};

var KeyCode =
{
	Backspace		: 8,
	Tab				: 9,
	Enter			: 13,
	Shift			: 16,
	Ctrl			: 17,
	Alt				: 18,
	Pause			: 19,
	CapsLock		: 20,
	Escape			: 27,
	PageUp 			: 33,
	PageDown		: 34,
	End				: 35,
	Home			: 36,
	LeftArrow		: 37,
	UpArrow			: 38,
	RightArrow		: 39,
	DownArrow		: 40,
	Insert			: 45,
	Delete			: 46,
	D0				: 48,
	D1				: 49,
	D2				: 50,
	D3				: 51,
	D4				: 52,
	D5				: 53,
	D6				: 54,
	D7				: 55,
	D8				: 56,
	D9				: 57,
	A				: 65,
	B				: 66,
	C				: 67,
	D				: 68,
	E				: 69,
	F				: 70,
	G				: 71,
	H				: 72,
	I				: 73,
	J				: 74,
	K				: 75,
	L				: 76,
	M				: 77,
	N				: 78,
	O				: 79,
	P				: 80,
	Q				: 81,
	R				: 82,
	S				: 83,
	T				: 84,
	U				: 85,
	V				: 86,
	W				: 87,
	X				: 88,
	Y				: 89,
	Z				: 90,
	LeftWindowKey	: 91,
	RightWindowKey	: 92,
	SelectKey		: 93,
	NumPad0			: 96,
	NumPad1			: 97,
	NumPad2			: 98,
	NumPad3			: 99,
	NumPad4			: 100,
	NumPad5			: 101,
	NumPad6			: 102,
	NumPad7			: 103,
	NumPad8			: 104,
	NumPad9			: 105,
	Multiply		: 106,
	Add				: 107,
	Subtract		: 109,
	DecimalPoint	: 110,
	Divide			: 111,
	F1				: 112,
	F2				: 113,
	F3				: 114,
	F4				: 115,
	F5				: 116,
	F6				: 117,
	F7				: 118,
	F8				: 119,
	F9				: 120,
	F10				: 121,
	F11				: 122,
	F12				: 123,
	NumLock			: 144,
	ScrollLock		: 145,
	SemiColon		: 186,
	EqualSign		: 187,
	Comma			: 188,
	Dash			: 189,
	Period			: 190,
	ForwardSlash	: 191,
	GraveAccent		: 192,
	OpenBracket		: 219,
	BackSlash		: 220,
	CloseBraket		: 221,
	SingleQuote		: 222	
};

var InputMode =
{
	Top : 0, //Change input state of top entity
	//Layer: 1, //Change input state of top layer
	All : 2 //Change input state of all entities
};

/**
 * 
 * @param canvas
 * @returns {NeoApplication}
 */
function NeoApplication(canvas)
{
	if (window.G_vmlCanvasManager) //IE < 9
	    canvas = window.G_vmlCanvasManager.initElement(canvas);
	
	this.context = canvas.getContext("2d");

	this.bufferMargin = 0;
	this.buffer = document.createElement('canvas');
	this.buffer.height = canvas.height;
	this.buffer.width = canvas.width;
	
	if (window.G_vmlCanvasManager) //IE < 9
		this.buffer = window.G_vmlCanvasManager.initElement(this.buffer);
	
	this.buffer = this.buffer.getContext("2d");

	this.controller = new NeoInputController(canvas);
	
	var _loader = new PxLoader(); 
	var _levels = new Object();
	var _currentLevel = null;
	
	var _images = new Object;
	var _sounds = new Object;
	var _scripts = new Object;
	
	var _loadedImagesCount = 0;
	var _loadedSoundsCount = 0;
	var _loadedScriptsCount = 0;
	
	var _totalImagesCount = 0;
	var _totalSoundsCount = 0;
	var _totalScriptsCount = 0;
	
	var _loading = false;
	
	this.getLoadedImagesCount = function()	{	return _loadedImagesCount;	}
	this.getLoadingSoundsCount = function()	{	return _loadedSoundsCount;	}
	this.getLoadingScriptsCount = function(){	return _loadedScriptsCount;	}
	this.getTotalImagesCount = function()	{	return _totalImagesCount;	}
	this.getTotalSoundsCount = function()	{	return _totalSoundsCount;	}
	this.getTotalScriptsCount = function()	{	return _totalScriptsCount;	}
	
	this.resetBuffer = function(bufferMargin)
	{
		this.bufferMargin = bufferMargin;
		this.buffer = document.createElement('canvas');
		this.buffer.height = canvas.height + (this.bufferMargin * 2);
		this.buffer.width = canvas.width + (this.bufferMargin * 2);
		
		if (window.G_vmlCanvasManager) //IE < 9
			this.buffer = window.G_vmlCanvasManager.initElement(this.buffer);
		
		this.buffer = this.buffer.getContext("2d");
	}
	
	/**
	 * 
	 */
	this.getAbsoluteBound = function()
	{
		return new NeoBound(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	/**
	 * 
	 */
	this.setLevels = function(levelArray)
	{
		_levels = new Object();
		this.addLevels(levelArray);
	}
	
	/**
	 * 
	 */
	this.getLevel = function(levelName)
	{
		return _levels[levelName];
	}
	
	this.getCurrentLevel = function()
	{
		return _currentLevel;
	}
	
	/**
	 * 
	 * @param levelArray
	 * @return boolean
	 */
	this.addLevel = function(level)
	{
		if (!(level instanceof NeoLevel))
			return false
		
		level.setApplication(this);
		_levels[level.name] = level;
		return true;
	}

	/**
	 * 
	 * @param levelArray
	 * @return integer
	 */
	this.addLevels = function(levelArray)
	{
		var count = 0;
		for (var i in levelArray) 
			if (this.addLevel(levelArray))
				count++;
		return count;
	}
	
	/**
	 * 
	 */
	this.removeLevel = function(levelName)
	{
		if (_levels[levelName] != null)
		{
			_levels[levelName].stop();
			_levels[levelName] = null;
		}
	}
	
	/**
	 * 
	 */
	this.loadLevel = function(levelName, startLevel, pauseCurrent)
	{	
		if (_currentLevel != _levels[levelName])
		{
			if (startLevel == null)
				startLevel = false;
			
			if (pauseCurrent == null)
				pauseCurrent = false;
			
			if (pauseCurrent && _currentLevel != null)
				_currentLevel.pause();
			
			_currentLevel = _levels[levelName];
			
			if (startLevel)
				_currentLevel.start();
			
			return true;
		}
		return false;
	}
	
	/**
	 * 
	 * @param id
	 * @param url
	 * @param tags
	 * @param priority
	 */
	this.addImage = function(id, url, tags, priority)
	{
		_loader.addImage(id, url, tags, priority);
		_totalImagesCount++;
	}
	
	/**
	 * 
	 * @param id
	 * @param url
	 * @param tags
	 * @param priority
	 */
	this.addSound = function(id, url, tags, priority)
	{
		_loader.addSound(id, url, tags, priority);
		_totalSoundsCount++;
	}

	/**
	 * 
	 * @param id
	 * @param url
	 * @param tags
	 * @param priority
	 */
	this.addScript = function(id, url, tags, priority)
	{
		_loader.addScript(id, url, tags, priority);
		_totalScriptsCount++;
	}	
	
	/**
	 * 
	 */
	this.startLoad = function(orderedTags)
	{
		if (!_loading) //TODO: Test without verification (!loading)
		{
			var me = this;
			_loading = true;
			_loader.addProgressListener(function(e) { me.resourceLoaded(e); });
			_loader.addCompletionListener(function(e) { me.loadCompleted(e); });
			_loader.start(orderedTags);
		}
	}

	/**
	 * 
	 * @param e
	 * @returns
	 */
	this.resourceLoaded = function(e)
	{
		if (e.resource instanceof PxLoaderImage)
		{
			_images[e.resource.id] = e.resource.img;
			_loadedImagesCount++;
			this.onResourceLoaded(_images[e.resource.id]);
		}
		else if (e.resource instanceof PxLoaderSound)
		{
			_sounds[e.resource.id] = e.resource.sound;
			_loadedSoundsCount++;
			this.onResourceLoaded(_sounds[e.resource.id]);
		}
		else if (e.resource instanceof PxLoaderScript)
		{
			_scripts[e.resource.id] = e.resource.script;
			_loadedScriptsCount++;
			this.onResourceLoaded(_scripts[e.resource.id]);
		}
	}

	/**
	 * 
	 * @returns
	 */
	this.loadCompleted = function()
	{
		_loading = false;
		this.onLoadCompleted();
		//this.clearImageLoaderCounters();
	}
	
	/**
	 * 
	 */
	this.playSound = function(soundId, options)
	{
		_sounds[sound].play(soundId, options);
	}
	
	/**
	 * 
	 */
	this.stopSound = function(soundId)
	{
		_sounds[soundName].stop(soundId);
	}
	
	/**
	 * 
	 */
	this.clearImageLoaderCounters = function()
	{
		if (!_loading)
		{
			_loadedSoundsCount = 0;
			_totalSoundsCount = 0;
			return true
		}
		else return false;
	}
	
	/**
	 * Override this event
	 */
	this.onResourceLoaded = function(resource){}
	
	/**
	 * Override this event
	 */
	this.onLoadCompleted = function(){}
	
	/**
	 * 
	 */
	this.clearSoundLoaderCounter = function()
	{
		if (!_loading)
		{
			_loadedSoundsCount = 0;
			_totalSoundsCount = 0;
			return true;
		}
		else return false
	}

	/**
	 * 
	 */
	this.getImage = function(imageId)
	{
		return _images[imageId];
	}
	
	/**
	 * 
	 */
	this.getSound = function(soundId)
	{
		return _sounds[soundId];
	}

	/**
	 * 
	 */
	this.getScript = function(scriptId)
	{
		return _scripts[scriptId];
	}
	
	/**
	 * 
	 */
	this.start = function()
	{
		_currentLevel.start();
	}

	/**
	 * 
	 */
	this.pause = function()
	{
		_currentLevel.pause();
	}

	/**
	 * 
	 */
	this.resume = function()
	{
		_currentLevel.resume();
	}
	
	/**
	 * 
	 */
	this.stop = function(sound)
	{
		_currentLevel.stop();
	}
}

/**
 * 
 * @param app
 * @param name
 * @returns {NeoLevel}
 */
function NeoLevel(name)
{
	this.application = null;
	this.name = name;

	this.backgroundColor = null;
	this.backgroundImage = null;
	this.backgroundScaleX = 1;
	this.backgroundScaleY = 1;
	this.backgroundStretchX = true;
	this.backgroundStretchY = true;
	this.backgroundConstraint = true;
	this.backgroundRepeatX = false;
	this.backgroundRepeatY = false;
	this.backgroundScroll = Scroll.None;
	this.backgroundScrollSpeed = 0;
	this.backgroundScrollLoop = 0;
	this.backgroundPosition = new NeoPoint(0, 0);
	
	this.defaultCursor = CursorStyle.Auto;
	this.visible = true;
	this.droppable = false;

	var _bound = new NeoBound(0, 0, 0, 0);
	
	var _running = false;
	var _paused = false;
	var _frameRate = DEFAULT_FPS;
	var _timeFrame = 1000/_frameRate;
	var _lastUpdate = null;
	var _timer = null;

	var _children = new Array();
	var _draggedEntity = null;
	var _dragXInset = 0;
	var _dragYInset = 0;

	this.getFrameRate = function(){ return _frameRate; }
	this.getTimeFrame = function(){ return _timeFrame; }
	this.isPaused = function(){	return _paused;	}
	
	this.setApplication = function(application)
	{
		if (application instanceof NeoApplication && this.application != application)
		{
			this.application = application;
			_bound.width = this.application.context.canvas.width;
			_bound.height = this.application.context.canvas.height;
			
			this.application.loadLevel();
			return true;
		}
		return false;
	}
	
	/**
	 * 
	 */
	this.addChild = function(child)
	{
		_children.push(child);
		child.setLevel(this);
	}

	/**
	 * 
	 */
	this.addChildAt = function(child, index)
	{
		_children.splice(index, 0, child);
		child.setLevel(this);
	}
	
	/**
	 * 
	 */
	this.removeChild = function(child)
	{
		var index = _children.indexOf(child);
		this.removeChildAt(index);
	}
	
	/**
	 * 
	 */
	this.removeChildAt = function(index)
	{
		if (index > -1 && index < _children.length)
		{
			_children.splice(index, 1);
			_children[i].setLevel(null);
		}
	}

	/**
	 * 
	 */
	this.getChildren = function()
	{
		var children = new Array();
		for (var i in _children)
			children.push(_children[i]);
		
		return children;
	}
	
	/**
	 * 
	 */
	this.getAllChildren = function()
	{
		var children = new Array();
		for (var i in _children)
		{
			 children.push(_children[i]);
			 if (_children[i] instanceof NeoLayer)
				 children = children.concat(_children[i].getAllChildren());
		}
		return children;
	}
	
	/**
	 * 
	 */
	this.getAllChildrenInPoint = function(x, y, relative)
	{
		if (relative == null)
			relative = true;
		
		var entities = new Array();
		for (var i in _children)
		{
			if (_children[i].checkPoint(x, y, relative))
			{
				entities.push(_children[i]);
			
				//TODO: x and x convert to next relative
				if (_children[i] instanceof NeoLayer)
					entities = entities.concat(_children[i].getAllChildrenInPoint(x, y, relative));
			}
		}	
		
		return entities;
	}
	
	/**
	 * Set the number of frames per second
	 * @param fps 
	 */
	this.setFrameRate = function(fps)
	{
		_frameRate = fps;
		_timeFrame = 1000	/_frameRate;
		if (_running)
		{
			clearInterval(_timer);
			_timer = setInterval(run, timeFrame);
		}
	}
	
	/**
	 * Set the number of milliseconds per frame
	 * @param milliseconds
	 */
	this.setTimeFrame = function(milliseconds)
	{
		_frameRate = 1000/milliseconds;
		_timeFrame = milliseconds;
		if (running)
		{
			clearInterval(timer);
			_timer = setInterval(run, _timeFrame);
		}
	}
	
	
	//Logic
	/**
	 * 
	 */
	this.start = function()
	{
		if (!_running)
		{
			this.onStart();
			_running = true;
			//run();
			var me = this;
			_timer = setInterval(function()	{	me.run();	}, _timeFrame);
		}
	}
	
	/**
	 * 
	 */
	this.pause = function()
	{
		_paused = true;
		this.onPause();
	}
	
	/**
	 * 
	 */
	this.resume = function()
	{
		this.onResume();
		_lastUpdate = new Date().getTime();
		_paused = false;
	}
	
	/**
	 * 
	 */
	this.stop = function()
	{
		if (_running)
		{
			_running = false;
			clearInterval(_timer);
			setTimeout(_timeFrame);
			this.onStop();
		}
	}

	/**
	 * Loop
	 * @returns
	 */
	
	this.run = function()
	{
		if (!_paused)
		{
			var milliseconds = new Date().getTime();
			var delta = (_lastUpdate == null ? 0 : (milliseconds - _lastUpdate)) * 0.001;
			_lastUpdate = milliseconds;
			
			this.updateInputs();
			//this.updateActions(delta);
			this.update(delta);
			if (this.visible && !_paused)
				this.draw(delta);
			
			this.updateLate(delta);
			//this.updatePhysics(delta);
			this.application.controller.restore();
		}
	}
	
	
	/**
	 * Update physics
	 */
	/*
	this.updatePhysics = function()
	{
		
	}
	*/
	
	/**
	 * Update automatic actions
	 */
	/*
	this.updateActions = function()
	{
		
	}
	*/
	
	/**
	 * Update entities input states
	 */
	this.updateInputs = function()
	{
		if (this.application.controller.isInputPointerEnabled())
		{
			var pointedChildren = this.getAllChildrenInPoint(this.application.controller.pointerPosition.x, this.application.controller.pointerPosition.y, false);
			var children = this.getAllChildren();
			var topPointedChild = pointedChildren[pointedChildren.length-1];
			
			for (var i in children)
			{
				if (pointedChildren.length > 0 && pointedChildren.indexOf(children[i] >= 0)) //Is pointed
				{
					//Pointer enter/over
					if (!children[i].isPointerOver && (children[i].inputMode == InputMode.All || (children[i].inputMode == InputMode.Top && children[i] == topPointedChild))) //Is pointed and enter
					{
						children[i].isPointerEnter = children[i] != _draggedEntity;
						children[i].isPointerOver = children[i] == _draggedEntity;
						children[i].isPointerOut = false;
					}
					else if (children[i].isPointerOver && (children[i].inputMode == InputMode.Top && children[i] != topPointedChild)) //Is pointed but out
					{
						children[i].isPointerEnter = false;
						children[i].isPointerOver = children[i] == _draggedEntity;
						children[i].isPointerOut = children[i] != _draggedEntity;
					}
					else //is pointed and over
					{
						children[i].isPointerEnter = false;
						//children[i].isPointerOver = true;
						children[i].isPointerOut = false;
					}
					
					//Input states
					if (children[i].inputMode == InputMode.All || (children[i].inputMode == InputMode.Top && children[i] == topPointedChild))
					{
						children[i].isPointerDown = this.application.controller.isPointerDown;
						children[i].isPointerPressed = this.application.controller.isPointerPressed;
						children[i].isPointerUp = this.application.controller.isPointerUp;
					}
				}
				else
				{
					//Pointer out
					if (children[i].isPointerOver) //It outs
					{
						children[i].isPointerEnter = false;
						children[i].isPointerOver = children[i] == _draggedEntity;
						children[i].isPointerOut = children[i] != _draggedEntity;
					}
					else //Its out
					{
						children[i].isPointerEnter = false;
						children[i].isPointerOver = children[i] != _draggedEntity;
						children[i].isPointerOut = false;
					}
					
					//Input states
					children[i].isPointerDown = false;
					children[i].isPointerPressed = children[i] != _draggedEntity;
					children[i].isPointerUp = false;
				}
			}
			
			//Drag and drop
			if (_draggedEntity == null && topPointedChild != null && topPointedChild.draggable && this.application.controller.isPointerDown)
			{
				_draggedEntity = topPointedChild;
				_draggedEntity.dragInitBound = new NeoBound(_draggedEntity.bound.x, _draggedEntity.bound.y, _draggedEntity.bound.width, _draggedEntity.bound.height);
				
				var bound = _draggedEntity.getAbsoluteBound();

				_dragXInset = this.application.controller.pointerPosition.x - _draggedEntity.bound.x;
				_dragYInset = this.application.controller.pointerPosition.y - _draggedEntity.bound.y;
				
				if (_draggedEntity.cursorOnDrag != null)
					this.application.context.canvas.style.cursor = _draggedEntity.cursorOnDrag;
			}
			else if (_draggedEntity != null)
			{
				if (this.application.controller.isPointerPressed) //drag
				{
					
					_draggedEntity.locate(this.application.controller.pointerPosition.x - _dragXInset, this.application.controller.pointerPosition.y - _dragYInset);
				}
				else if (this.application.controller.isPointerUp) //drop
				{
					var topPointedDroppableLayer = null;
					
					for (var i=pointedChildren.length-1; i>=0; i--)
					{
						if (pointedChildren[i] instanceof NeoLayer && pointedChildren[i].droppable)
						{
							topPointedDroppableLayer = pointedChildren[i];
							break;
						}
					}
					
					if (topPointedDroppableLayer != null)
					{
						topPointedDroppableLayer.dropChild(_draggedEntity, this.application.controller.pointerPosition, new NeoPoint(_dragXInset, _dragYInset));
					}
					else if (this.droppable)
					{
						_draggedEntity.locate(this.application.controller.pointerPosition.x - _dragXInset, this.application.controller.pointerPosition.y - _dragYInset);
					}
					else
					{
						_draggedEntity.bound = _draggedEntity.dragInitBound;
					}
					_draggedEntity = null;
				}
			}
			
			//Cursor
			if (_draggedEntity == null)
			{	
				if (topPointedChild != null && topPointedChild.cursorOnOver != null)
					this.application.context.canvas.style.cursor = topPointedChild.cursorOnOver;
				else if (this.defaultCursor != null)
					this.application.context.canvas.style.cursor = this.defaultCursor;
			}
		}
	}
	
	this.applyBackground = function(delta)
	{
		if (this.backgroundColor != null)
		{
			this.application.buffer.fillStyle = this.backgroundColor;
			this.application.buffer.fillRect(0, 0, this.application.buffer.canvas.width, this.application.buffer.canvas.height);
			this.application.buffer.restore();
		}
		else this.application.buffer.clearRect(0, 0, this.application.buffer.canvas.width, this.application.buffer.canvas.height);

		if (this.backgroundImage != null)	
		{

			if (this.backgroundStretchX && this.backgroundStretchY)
			{
				this.backgroundScaleX = this.application.context.canvas.width / this.backgroundImage.width;
				this.backgroundScaleY = this.application.context.canvas.height / this.backgroundImage.height;
			}
			else if (this.backgroundStretchX)
			{
				this.backgroundScaleX = this.application.context.canvas.width / this.backgroundImage.width;
				if (this.backgroundConstraint)
					this.backgroundScaleY = this.backgroundScaleX;
			}
			else if (this.backgroundStretchY)
			{
				this.backgroundScaleY = this.application.context.canvas.height / this.backgroundImage.height;
				if (this.backgroundConstraint)
					this.backgroundScaleX = this.backgroundScaleY;
			}

			var backgroundWidth = this.backgroundImage.width * this.backgroundScaleX;
			var backgroundHeight = this.backgroundImage.height * this.backgroundScaleY;
			
			if (this.backgroundScroll != Scroll.None && this.backgroundScrollLoop != 0)
			{
				if (this.backgroundScroll == Scroll.Horizontal)
					this.backgroundPosition.x += this.backgroundScrollSpeed * delta;
				else if (this.backgroundScroll == Scroll.Vertical)
					this.backgroundPosition.y += this.backgroundScrollSpeed * delta;
								
				if (this.backgroundPosition.x > this.application.context.canvas.width)
				{
					this.backgroundPosition.x -= backgroundWidth;
					if (this.backgroundScrollLoop > 0)
						this.backgroundScrollLoop--;
				}
				
				else if (this.backgroundPosition.x + backgroundWidth < 0)
				{
					this.backgroundPosition.x += backgroundWidth;
					if (this.backgroundScrollLoop > 0)
						this.backgroundScrollLoop--;
				}
				
				if (this.backgroundPosition.y > this.application.context.canvas.height)
				{
					this.backgroundPosition.y -= backgroundHeight;
					if (this.backgroundScrollLoop > 0)
						this.backgroundScrollLoop--;
				}
				
				else if (this.backgroundPosition.y + backgroundHeight < 0)
				{
					this.backgroundPosition.y += backgroundHeight;
					if (this.backgroundScrollLoop > 0)
						this.backgroundScrollLoop--;
				}
			}
			//this.drawImage(this.backgroundImage, this.backgroundPosition.x, this.backgroundPosition.y, this.application.buffer.canvas.width, this.application.buffer.canvas.height);
			
			var x = this.backgroundPosition.x;
			while(x > -backgroundWidth)
			{
				var y = this.backgroundPosition.y;
				while(y > -backgroundHeight)
				{
					this.application.buffer.drawImage(this.backgroundImage, x + this.application.bufferMargin, y + this.application.bufferMargin, backgroundWidth, backgroundHeight);
					if (this.backgroundRepeatY) 
						y -= backgroundHeight;
					else
						y= -backgroundHeight;
				}
				
				if (this.backgroundRepeatY)
				{
					y = this.backgroundPosition.y + backgroundHeight;
					while(y < this.application.buffer.canvas.height)
					{
						this.application.buffer.drawImage(this.backgroundImage, x + this.application.bufferMargin, y + this.application.bufferMargin,  backgroundWidth, backgroundHeight);
						y += backgroundHeight;
					}
				}
				
				if (this.backgroundRepeatX)
					x -= backgroundWidth;
				else
					x= -backgroundWidth;
			}
			if (this.backgroundRepeatX)
			{
				x = this.backgroundPosition.x + backgroundWidth;
				while(x < this.application.context.canvas.width)
				{
					var y = this.backgroundPosition.y;
					while(y > -backgroundHeight)
					{
						this.application.buffer.drawImage(this.backgroundImage, x + this.application.bufferMargin, y + this.application.bufferMargin,  backgroundWidth, backgroundHeight);
						if (this.backgroundRepeatY)
							y -= backgroundHeight;
						else
							y= -backgroundHeight;
					}
					
					if (this.backgroundRepeatY)
					{
						y = this.backgroundPosition.y + backgroundHeight;
						while(y < this.application.context.canvas.height)
						{
							this.application.buffer.drawImage(this.backgroundImage, x + this.application.bufferMargin, y + this.application.bufferMargin,  backgroundWidth, backgroundHeight);
							y += backgroundHeight;
						}
					}
					
					x += backgroundWidth;
				}
			}
		}
	}
	
	/**
	 * You must override this function with your init function
	 * @returns
	 */
	this.onStart = function(){}
	
	/**
	 * You must override this function with your pause function
	 * @returns
	 */
	this.onPause = function(){}
	
	/**
	 * You must override this function with your resume function
	 * @returns
	 */
	this.onResume = function(){}
	
	/**
	 * You must override this function with your finish function
	 * @returns
	 */
	this.onStop = function()
	{
		
	}
	
	/**
	 * You must override this function with your application loop
	 * @returns
	 */
	this.update = function(delta)
	{

	}
	
	/**
	 * You must override this function with your application loop after draw
	 * @returns
	 */
	this.updateLate = function(delta)
	{
		
	}	
	
	/**
	 * 
	 * @returns
	 */
	this.draw = function(delta)
	{
		//Background	
		this.applyBackground(delta);

		//Children
		for (var i in _children) if (_children[i] != _draggedEntity)
			 _children[i].draw(this.application.buffer, delta);

		//Drag
		if (_draggedEntity != null)
			_draggedEntity.draw(this.application.buffer, delta);

		//Effects post-draw
		//this.applyLightmap();
		//this.applyShadowsmap();
		//this.applyBrightness();
		
		this.application.context.clearRect(0, 0, this.application.context.canvas.width, this.application.context.canvas.height);
		this.application.context.drawImage(this.application.buffer.canvas, this.application.bufferMargin, this.application.bufferMargin, this.application.context.canvas.width, this.application.context.canvas.height,
										   0, 0, this.application.context.canvas.width, this.application.context.canvas.height);
	}
}

/**
 * Basic 2D entity
 * @returns {NeoEntity}
 */
function NeoEntity(x, y)
{
	this.bound = new NeoBound(x, y);
	this.rotation = 0;
		
	this.visible = true;
	var _level = null;
	var _parent = null;
	
	this.inputMode = InputMode.Top;
	this.draggable = false;
	this.dragInitBound = null;
	
	this.cursorOnOver = CursorStyle.Pointer;
	this.cursorOnDrag = CursorStyle.Move;
	
	this.isPointerEnter = false;
	this.isPointerOver = false;
	this.isPointerOut = false;
	this.isPointerDown = false;
	this.isPointerPressed = false;
	this.isPointerUp = false;

	this.getAbsoluteBound = function()
	{
		var refBound;
		if (_parent instanceof NeoLayer)
			refBound = _parent.getAbsoluteBound();
		else
			refBound = new NeoBound(0, 0, 0, 0);
		
		var absoluteX = this.bound.x + refBound.x;
		var absoluteY = this.bound.y + refBound.y;
		var absoluteWidth = this.bound.width; //Math.min(this.bound.width, refBound.width - this.bound.x);
		var absoluteHeight = this.bound.height; //Math.min(this.bound.height,   - this.bound.y);
	
		return new NeoBound(absoluteX, absoluteY, absoluteWidth, absoluteHeight);
	}
	
	/**
	 * 
	 * @param entity
	 * @returns
	 */
	this.setParent = function(entity) //TODO: parent.addChild
	{
		if (entity instanceof NeoLayer) 
		{
			if (entity == null && _parent != null)
			{
				_parent.removeChild(this);
				entity = _level;
			}
			else if (entity != null && _parent != null && entity != _parent)
			{
				_parent.removeChild(this);
			}
			
			_parent = entity;
			
			if (_parent instanceof NeoLayer && _level != _parent.getLevel())
				this.setLevel(_parent.getLevel(), false);
			
			return true;
		}
		return false;
	}
	
	this.getParent = function()
	{
		return _parent;
	}
	
	/**
	 * 
	 */
	this.setLevel = function(entity, removeParent) //TODO: level.addChild
	{	
		if (removeParent == null)
			removeParent = true;

		if (entity instanceof NeoLevel) 
		{
			if (entity == null && _level != null)
			{
				_level.removeChild(this);
			}
			else if (entity != null && _level != null && entity != _level)
			{
				_level.removeChild(this);
				if (removeParent)
					this.setParent(null);
				if (_parent == null)
					_parent = entity;
				
				if (this instanceof NeoLayer)
					for (var i in _children)
						_children[i].setLevel(entity, false);
			}

			_level = entity;
			
			if (this instanceof NeoLayer)
				for (var i in this.getChildren())
					this.getChild(i).setLevel(_level);
			
			return true;
		}
		
		return false;
	}
	
	this.getLevel = function() {	return _level;	}
	
	this.locate = function(x, y, relative)
	{
		if (relative == null)
			relative = true;

		var refX;
		var refY;
		
		if (!relative)
		{
			var bound = this.getAbsoluteBound();
			refX = x - bound.x;
			refY = y - bound.y;
		}
		else
		{
			refX = x;
			refY = y;
		}
		
		this.bound.x = refX;
		this.bound.y = refY;
	}
	
	this.traslate = function(x, y)
	{
		this.bound.x += x;
		this.bound.y += y;
	}
	
	this.detectCollision = function(entity)
	{
		var bound1 = this.getAbsoluteBound();
		var bound2 = entity.getAbsoluteBound();
		if ((bound1.x + bound1.width) <= bound2.x || bound1.x >= (bound2.x + bound2.width) ||
			(bound1.y + bound1.height) <= bound2.y || bound1.y >= (bound2.y + bound2.height))
				return false;
		else
				return true;
	}
	
	this.checkPoint = function(x, y, relative)
	{
		if (relative == null)
			relative = true;
		
		var bound;
		if (relative)
			bound = this.bound;
		else
			bound = this.getAbsoluteBound();

		if (x < bound.x || x >= (bound.x + bound.width) ||
			y < bound.y || y >= (bound.y + bound.height))
			return false;
		else
			return true;
	}
	
	this.draw = function(context)	{	}
};

/**
 * 
 * @returns {NeoLayer}
 */
function NeoLayer(x, y)
{
	NeoEntity.call(this, x, y);

	this.droppable = false;
	
	var _children = new Array();
	
	/**
	 * 
	 */
	this.addChild = function(child)
	{
		if (child.getParent() != this)
		{
			_children.push(child);
			child.setParent(this);
		}
	}
	
	/**
	 * 
	 */
	this.addChildAt = function(child, index)
	{
		if (child.getParent() != this)
		{
			_children.splice(index, 0, child);
			child.setParent(this);
		}
	}
	
	/**
	 * 
	 */
	this.removeChild = function(child)
	{
		var index = _children.indexOf(child);
		this.removeChildAt(index);
	}
	
	/**
	 * 
	 */
	this.removeChildAt = function(index)
	{
		if (index > -1 && index < _children.length)
		{
			_children.splice(index, 1);
			child.setParent(null);
		}
	}
	
	this.dropChild = function(child, pointerPosition, dragInset)
	{
		if (child instanceof NeoEntity)
		{
			this.addChild(child);
			child.locate(pointerPosition.x - dragInset.x, pointerPosition.y - dragInset.y);
		}
	}
	
	/**
	 * 
	 */
	this.getChildren = function()
	{
		/*
		var children = new Array();
		for (var i in _children)
			children.push(_children[i]);
		
		return children;
		*/
		return _children;
	}
	
	/**
	 * 
	 */
	this.getChild = function(index)
	{
		return _children[index];
	}
	
	/**
	 * 
	 */
	this.getAllChildren = function()
	{
		var children = new Array();
		for (var i in _children)
		{
			 children.push(_children[i]);
			 if (_children[i] instanceof NeoLayer)
				 children = children.concat(_children[i].getAllChildren());
		}
		return children;
	}
	
	/**
	 * 
	 */
	this.getAllChildrenInPoint = function(x, y, relative)
	{
		if (relative == null)
			relative = true;
		
		var entities = new Array();
		for (var i in _children)
		{
			if (_children[i].checkPoint(x, y, relative))
			{
				entities.push(_children[i]);
			
				//TODO: x and x convert to next relative
				if (_children[i] instanceof NeoLayer)
					entities = entities.concat(_children[i].getAllChildrenInPoint(x, y, relative));
			}
		}
		
		return entities;
	}
	
	/**
	 * 
	 */
	this.draw = function(context)
	{
		if (this.visible)
			for (var i in _children) 
				_children[i].draw(context);
	}
};
NeoLayer.prototype = new NeoEntity();


function NeoTable(x, y, numCols, numRows, cellWidth, cellHeight, borderWidth, borderColor, backgroundColor)
{
	NeoLayer.call(this, x, y);
	
	var _numCols = numCols == null ? 1 : numCols;
	var _numRows = numRows == null ? 1 : numRows;
	var _rowsHeight = new Array();
	var _colsWidth = new Array();
	
	this.cells = new Array();
	
	this.cells.length = _numCols * _numRows;
	_rowsHeight.length = _numRows;
	_colsWidth.length = _numCols;
	
	this.borderWidth = borderWidth == null ? DEFAULT_BORDER_WIDTH : borderWidth;
	this.borderColor = borderColor == null ? "#000000" : borderColor;
	this.backgroundColor = backgroundColor;
	
	this.bound.width = this.borderWidth;
	this.bound.height = this.borderWidth;
	
	for (var col=0; col<_colsWidth.length;col++)
	{
		_colsWidth[col] = cellWidth == null ? DEFAULT_CELL_HEIGHT : cellWidth;
		this.bound.width += _colsWidth[col] + this.borderWidth;
	}
	
	for (var row=0; row<_rowsHeight.length;row++)
	{
		_rowsHeight[row] = cellHeight == null ? DEFAULT_CELL_WIDTH : cellHeight;
		this.bound.height += _rowsHeight[row] + this.borderWidth;
	}
	
	this.getNumCols = function() { return _numCols; }
	this.getNumRows = function() { return _numRows; }
	this.getRowHeight = function(row) { return _rowsHeight[parseInt(row)]; }
	this.getColWidth = function(col) { return _colsWidth[parseInt(col)]; }
	
	this.dropChild = function(child, pointerPosition, dragInset)
	{
		dragInset = null;
		
		this.addChildInCellByPixelCoords(pointerPosition.x, pointerPosition.y, child);
	}
	
	this.addChildAtCellIndex = function(index, child)
	{
		if (child instanceof NeoEntity)
		{
			this.addChild(child);
			this.cells[index] = child;
			var position = this.getCellPosition(index);			
			var x = this.borderWidth;
			var y = this.borderWidth;
			
			for (c=0; c<position.x; c++)
				x += this.getColWidth(c) + this.borderWidth;

			for (r=0; r<position.y; r++)
				y += this.getRowHeight(r) + this.borderWidth;
			
			child.bound.height = Math.min(child.bound.height, this.getRowHeight(position.y));
			child.bound.width = Math.min(child.bound.width, this.getColWidth(position.x));
			child.bound.x = x;
			child.bound.y = y;
		}
	}
	
	this.addChildInCellByPosition = function(col, row, child)
	{
		if (child instanceof NeoEntity)
		{
			this.addChild(child);
			this.cells[this.getCellIndex(col, row)] = child;
			var x = this.borderWidth;
			var y = this.borderWidth;
			
			for (c=0; c<col; c++)
				x += this.getColWidth(c) + this.borderWidth;
			for (r=0; r<row; r++)
				y += this.getRowHeight(r) + this.borderWidth;
			
			child.bound.height = Math.min(child.bound.height, this.getRowHeight(row));
			child.bound.width = Math.min(child.bound.width, this.getColWidth(col));
			child.bound.x = x; 
			child.bound.y = y;
		}
	}
	
	this.addChildInCellByPixelCoords = function(x, y, child)
	{
		this.addChildAtCellIndex(this.getCellIndexByPixelCoords(x, y), child);
	}
	
	this.getCellIndex = function(col, row)
	{
		return row * _numCols + parseInt(col);
	}
	
	this.getCellPosition = function(index)
	{
		return new NeoPoint(index % _numCols, parseInt(index / _numCols));
	}
	
	this.getCellIndexByPixelCoords = function(x, y)
	{
		var bounds = this.getAbsoluteBound();
	
		var width = 0;
		if (x < bounds.x || y < bounds.y)
			return null;
		
		for (var col in _colsWidth)
		{
			width += this.getColWidth(col) + this.borderWidth;
			if (x < bounds.x + width)
				break;
		}
		
		var height = 0;
		for (var row in _rowsHeight)
		{
			height += this.getRowHeight(row) + this.borderWidth;;
			if (y < bounds.y + height)
				break;
		}
		
		return this.getCellIndex(col, row);
	}
	
	this.getCellsIndexByCol = function(col)
	{
		var cells = new Array();
		
		for (row=0; row<_numRows; row++)
			cells.push(this.getCellIndex(col, row));
		
		return cells;
	}
	
	this.getCellsIndexByRow = function(row)
	{
		var cells = new Array();
		
		for (col=0; com<_numCols; col++)
			cells.push(this.getCellIndex(col, row));

		return cells;
	}
	
	this.getCellEntity = function(col, row)
	{
		return this.cells[this.getCellIndex(col, row)];
	}
	
	this.getCellEntityByPosition = function(x, y)
	{
		return this.cells[this.getCellIndexByPosition(x, y)];
	}
	
	this.getCellsEntityByCol = function(col)
	{
		return this.cells[this.getCellsIndexByCol(col)];
	}
	
	this.getCellsEntityByRow = function(row)
	{
		return this.cells[this.getCellsIndexByRow(row)];
	}
	
	/**
	 * 
	 */
	this.draw = function(context)
	{		
		if (this.visible)
		{
			var bound = this.getAbsoluteBound();
			
			if (this.backgroundColor != null)
			{
				context.fillStyle = this.backgroundColor;
				context.fillRect(bound.x + this.getLevel().application.bufferMargin, bound.y + this.getLevel().application.bufferMargin, bound.width, bound.height);
			}
			
			if (this.borderWidth > 0)
			{
				context.fillStyle = this.borderColor;
				var x = bound.x + this.getLevel().application.bufferMargin;
				var y = bound.y + this.getLevel().application.bufferMargin;

				//Columns
				var lineX = x;
				context.fillRect(lineX, y, this.borderWidth, bound.height);
				for (col=0; col<_numCols; col++)
				{
					lineX += this.getColWidth(col) + this.borderWidth;
					context.fillRect(lineX, y, this.borderWidth, bound.height);
				}
				
				//Rows
				var lineY = y;
				context.fillRect(x, lineY, bound.width, this.borderWidth);
				for (row=0; row<_numRows; row++)
				{
					lineY += this.getRowHeight(row) + this.borderWidth;
					context.fillRect(x, lineY, bound.width, this.borderWidth);
				}
				
				context.restore();
			}
			
			for (var i in this.getChildren()) 
				this.getChild(i).draw(context);
		}
	}
}
NeoTable.prototype = new NeoLayer();

/**
 * 
 * @param points
 * @param lineColor
 * @param lineWidth
 * @param lineCap
 * @param lineJoin
 * @param fillColor
 * @returns
 */
function NeoLine(x, y, points, fillColor, lineWidth, lineColor, lineCap, lineJoin)
{
	NeoEntity.call(this, x, y);
	
	this.lineColor = lineColor;
	this.lineWidth = lineWidth;
	this.lineCap = lineCap;
	this.lineJoin = lineJoin;
	this.fillColor = fillColor;
	var _points = points;
	
	var _xMin = null;
	var _yMin = null;
	var _xMax = null;
	var _yMax = null;
	
	var calculateBound = function()
	{
		//Recalculate bound
		_xMin = null;
		_yMin = null;
		_xMax = null;
		_yMax = null;
		for (var i in points)
		{
			_xMin = _xMin == null ? points[i].x : Math.min(_xMin, points[i].x);
			_xMax = _xMax == null ? points[i].x : Math.max(_xMax, points[i].x);
			_yMin = _yMin == null ? points[i].y : Math.min(_yMin, points[i].y);
			_yMax = _yMax == null ? points[i].y : Math.max(_yMax, points[i].y);
		}
		return new NeoBound(x + _xMin, y + _yMin, _xMax-_xMin, _yMax-_yMin);
	}

	this.bound = calculateBound();

	this.addPoint = function(point)
	{
		_points.push(point);
		this.bound = calculateBound();
	}
	
	this.addPointAt = function(point, index)
	{
		_points.splice(index, 0, point);
		this.bound = calculateBound();
	}
	
	this.removePoint = function(point)
	{
		var index = _points.indexOf(point);
		this.removePointAt(index);
	}
	
	this.removePointAt = function(index)
	{
		if (index > -1 && index < _points.length)
		{
			_points.splice(index, 1);
			this.bound = calculateBound();
		}
	}
	
	this.draw = function(context)
	{
		var bound = this.getAbsoluteBound();
		
		context.strokeStyle = this.lineColor;
		context.lineWidth = this.lineWidth;
		context.lineCap = this.lineCap;
		context.lineJoin = this.lineJoin;
		context.fillStyle = this.fillColor;
		
		context.beginPath();
		context.moveTo(bound.x + _points[0].x + this.getLevel().application.bufferMargin, bound.y + _points[0].y + this.getLevel().application.bufferMargin);
		
		for (i=1; i<_points.length; i++)
			context.lineTo(bound.x + _points[i].x + this.getLevel().application.bufferMargin, bound.y + _points[i].y + this.getLevel().application.bufferMargin);
		
		context.stroke();
		if (this.fillColor != null)
			context.fill();
		
		context.restore();
	}
}
NeoLine.prototype = new NeoEntity();

/**
 * 
 * @param points
 * @param lineColor
 * @param lineWidth
 * @param lineCap
 * @param lineJoin
 * @param fillColor
 * @returns
 */
function NeoPolygon(x, y, points, fillColor, lineWidth, lineColor, lineCap, lineJoin)
{
	if (points[0] != points[points.length])
		points.push(points[0]);
	NeoLine.call(this, x, y, points, fillColor, lineWidth, lineColor, lineCap, lineJoin);
}
NeoPolygon.prototype = new NeoLine();

/**
 * 
 * @param x
 * @param y
 * @param width
 * @param height
 * @param lineColor
 * @param lineWidth
 * @param lineCap
 * @param lineJoin
 * @param fillColor
 * @returns
 */
function NeoRect(x, y, width, height, fillColor, lineWidth, lineColor, lineCap, lineJoin)
{
	NeoEntity.call(this, x, y);
	this.lineColor = lineColor;
	this.lineWidth = lineWidth;
	this.lineCap = lineCap;
	this.lineJoin = lineJoin;
	this.fillColor = fillColor;
	
	this.bound.width = width;
	this.bound.height = height;
	
	this.draw = function(context)
	{
		var bound = this.getAbsoluteBound();	
		
		bound.x += this.lineWidth/2;
		bound.y += this.lineWidth/2;
		bound.width -= this.lineWidth;
		bound.height -= this.lineWidth;
		
		context.strokeStyle = this.lineColor;
		context.lineWidth = this.lineWidth;
		context.lineCap = this.lineCap;
		context.lineJoin = this.lineJoin;
		context.fillStyle = this.fillColor;
		
		if (this.lineWidth > 0)
			context.strokeRect(bound.x + this.getLevel().application.bufferMargin, bound.y + this.getLevel().application.bufferMargin, bound.width, bound.height);
		
		if (this.fillColor != null)
			context.fillRect(bound.x + this.getLevel().application.bufferMargin, bound.y + this.getLevel().application.bufferMargin, bound.width, bound.height);
		
		context.restore();
	}
}
NeoRect.prototype = new NeoEntity();

/**
 * 
 * @param x
 * @param y
 * @param width
 * @param height
 * @param lineColor
 * @param lineWidth
 * @param fillColor
 * @returns
 */
function NeoEllipse(x, y, width, height, fillColor, lineWidth, lineColor)
{
	NeoEntity.call(this, x, y);
	this.lineColor = lineColor;
	this.lineWidth = lineWidth;
	this.fillColor = fillColor;
	
	this.bound.width = width;
	this.bound.height = height;
	
	this.draw = function(context)
	{
		var bound = this.getAbsoluteBound();
		
		var scaleX = 1;
		var scaleY = this.bound.height / this.bound.width;		
		
		bound.x += this.lineWidth/2;
		bound.y += this.lineWidth/(2*scaleY);
		bound.width -= this.lineWidth;
		bound.height -= this.lineWidth/scaleY;

		var centerX = (bound.x + bound.width/2) + this.getLevel().application.bufferMargin;
		var centerY = ((bound.y + Math.round(bound.height/2)) / scaleY) + this.getLevel().application.bufferMargin;
		var radius = bound.width/2;
		
		context.save();
		context.scale(scaleX, scaleY);
		
	    context.beginPath();
	    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	    
	    context.restore();
		context.strokeStyle = this.lineColor;
		context.lineWidth = this.lineWidth;
		context.fillStyle = this.fillColor;
		
		if (this.lineWidth > 0)
			context.stroke();
		
		if (this.fillColor != null)
			context.fill();
		
		context.restore();
	}
}
NeoEllipse.getCircleBound = function(center, radius)
{
	var diameter = radius*2;
	return new NeoBound(center.x-radius, center.y-radius, diameter, diameter);
}
NeoEllipse.prototype = new NeoEntity();

/**
 * Basic label object
 * @param x
 * @param y
 * @param text
 * @param color
 * @param fontFamily
 * @param fontSize
 * @param fontStyle
 * @param textAlign
 * @param textBaseline
 * @returns {NeoLabel}
 */
function NeoLabel(x, y, text, color, fontFamily, fontSize, fontStyle, textAlign, textBaseline)
{
	NeoEntity.call(this, x, y);
	
	this.text = text;
	this.color = color == null ? "black" : color;
	this.fontFamily = fontFamily == null ? "Courier" : fontFamily;
	this.fontSize = fontSize == null ? "12pt" : fontSize;
	this.fontStyle = fontStyle == null ? FontStyle.None : fontStyle;
	this.textAlign = textAlign == null ? TextAlign.Start : textAlign;
	this.textBaseline = textBaseline == null ? TextBaseline.Top : textBaseline;
	
	this.draw = function(context)
	{
		if (this.visible)
		{		
			context.rotate(this.rotation);
			context.font = "{0} {1} {2}".format(this.fontStyle, this.fontSize, this.fontFamily);

			context.fillStyle = this.color;
			context.textAlign = this.textAlign;
			context.textBaseline = this.textBaseline;
			
			var dim = context.measureText(this.text);
			this.bound.width = dim.width;
			this.bound.height = dim.height || dim.width/text.length * 2; //Height aproximated to double of average width
			var bound = this.getAbsoluteBound();

			context.fillText(this.text, bound.x + this.getLevel().application.bufferMargin, bound.y + this.getLevel().application.bufferMargin);
			context.restore();
		}
	}
};
NeoLabel.prototype = new NeoEntity();

/**
 * 
 * @param x
 * @param y
 * @param image
 */
function NeoSprite(x, y, image)
{
	NeoEntity.call(this, x, y);
	
	this.image = image;
	this.bound.width = image == null ? 0 : image.width;
	this.bound.height = image == null ? 0 : image.height;
	this.scaleX = 1;
	this.scaleY = 1;
	
	
	this.resize = function(width, height)
	{
		this.bound.width = width;
		this.bound.height = height;
		//TODO: Resize image
	}
	
	this.scale = function(x, y)
	{
		this.bound.width *= x;
		this.bound.height *= y;
		//TODO: Scale image
	}
		
	this.draw = function(context)
	{
		if (this.visible)
		{
			var bound = this.getAbsoluteBound();
			
			context.rotate(this.rotation);
			context.scale(this.scaleX, this.scaleY);
			context.drawImage(this.image, bound.x + this.getLevel().application.bufferMargin, bound.y + this.getLevel().application.bufferMargin, bound.width, bound.height);
			context.restore();
		}
	}
};
NeoSprite.prototype = new NeoEntity();

/**
 * 
 * @param x
 * @param y
 * @param image
 * @param animationMap
 * @returns {NeoAnimatedSprite}
 */
function NeoSpriteSheet(x, y, image, autoFrame, frameWidth, frameHeight)
{
	NeoSprite.call(this, x, y, image);
	
	var animations = new Object();
	var currentAnimation = null;
	var currentFrame = 0;
	
	this.loop = 0;
	this.autoFrame = autoFrame == null ? false : autoFrame;
	this.frameWidth = this.autoFrame ? frameWidth : 0;
	this.frameHeight = this.autoFrame ? frameHeight : 0;
	
	this.addAnimation = function(tag, frames)
	{
		animations[tag] = new Array();
		for (var i in frames)
		{
			if (frames[i] instanceof NeoPoint)
			{
				animations[tag].push(new NeoBound(frames[i].x * this.frameWidth, frames[i].y * this.frameHeight, this.frameWidth, this.frameHeight));
			}
			else if (frames[i] instanceof NeoBound)
			{
				animations[tag].push(frames[i]);
			}
		}
	}
	
	this.playAnimation = function(tag, loop)
	{
		currentAnimation = tag;
		this.loop = loop == null ? 1 : loop;
	}
	
	this.stopAnimation = function()
	{
		this.loop = 0;
	}
	
	this.draw = function(context)
	{
		if (this.visible)
		{
			var frame = animations[currentAnimation][currentFrame];
			this.resize(frame.width, frame.height);
			var bound = this.getAbsoluteBound();
						
			context.rotate(this.rotation);
			context.scale(this.scaleX, this.scaleY);
			context.drawImage(this.image, frame.x, frame.y, frame.width, frame.height, bound.x + this.getLevel().application.bufferMargin, bound.y + this.getLevel().application.bufferMargin, bound.width, bound.height);
			context.restore();
			
			if (currentFrame + 1 < animations[currentAnimation].length)
			{
				currentFrame++;
			}
			else if (this.loop != 0)
			{
				this.loop--;
				currentFrame = 0;
			}
		}
	}
};
NeoSpriteSheet.prototype = new NeoSprite();

/**
 * 
 * @param canvas
 * @returns {NeoInputController}
 */
function NeoInputController(canvas)
{
	this.canvas = canvas;
	
	var _inputKeysEnabled = false;
	var _inputPointerEnabled = false;
	
	this.keysDown = new Array();
	this.keysPressed = new Array();
	this.keysUp = new Array();
	
	this.isPointerDown = false;
	this.isPointerPressed = false;
	this.isPointerUp = false;
	
	this.pointerPosition = new NeoPoint(0, 0);
	
	this.isInputKeysEnabled = function() { return _inputKeysEnabled; };
	this.isInputPointerEnabled = function() { return _inputPointerEnabled; };
	
	this.isKeyDown = function(key) { return this.keysDown.indexOf(key) >= 0; };
	this.isKeyPressed = function(key) { return this.keysPressed.indexOf(key) >= 0; };
	this.isKeyUp = function(key) { return this.keysUp.indexOf(key) >= 0; };
	
	/**
	 * Init pointer detection (mouse and touch)
	 * @param bool 
	 */
	this.setInputKeysEnabled = function(enabled)
	{
		if (enabled == null)
			enabled = true;
		
		if (_inputKeysEnabled != enabled)
		{
			_inputKeysEnabled = enabled;
			
			var me = this;
			if (enabled)
			{
				if (window.addEventListener)
				{
					window.addEventListener("keydown", function(e) { me.onKeyDown(e); }, false);			
					window.addEventListener("keyup", function(e) {me.onKeyUp(e); }, false);
				}
				else if (window.attachEvent)
				{
					window.attachEvent("keydown", function(e) { me.onKeyDown(e); });
					window.attachEvent("keyup", function(e) {me.onKeyUp(e); });
				}
			}
			else
			{
				if (window.addEventListener)
				{
					window.removeEventListener("keydown", null);			
					window.removeEventListener("keyup", null);
				}
				else if (window.attachEvent)
				{
					window.attachEvent("keydown", null);			
					window.attachEvent("keyup", null);
				}
			}
		}
	}
	
	/**
	 * Init pointer detection (mouse and touch)
	 * @param bool 
	 */
	this.setInputPointerEnabled = function(enabled)
	{
		if (enabled == null)
			enabled = true;
		
		if (_inputPointerEnabled != enabled)
		{
			_inputPointerEnabled = enabled;
	
			var me = this;
			if (enabled)
			{
				if (this.canvas.addEventListener)
				{
					this.canvas.addEventListener("mousedown", function(e) { me.onPointerDown(e); }, false);
					this.canvas.addEventListener("touchstart", function(e) {me.onPointerDown(e); }, false);
					
					this.canvas.addEventListener("mousemove", function(e) {me.onPointerMove(e); }, false);
					this.canvas.addEventListener("touchmove", function(e) {me.onPointerMove(e); }, false);
					
					this.canvas.addEventListener("mouseup", function(e) {me.onPointerUp(e); }, false);
					this.canvas.addEventListener("touchend", function(e) {me.onPointerUp(e); }, false);
				}
				else if (this.canvas.attachEvent)
				{
					this.canvas.attachEvent("onmousedown", function(e) { me.onPointerDown(e); });
					this.canvas.attachEvent("touchstart", function(e) {me.onPointerDown(e); });
					
					this.canvas.attachEvent("onmousemove", function(e) {me.onPointerMove(e); });
					this.canvas.attachEvent("touchmove", function(e) {me.onPointerMove(e); });
					
					this.canvas.attachEvent("onmouseup", function(e) {me.onPointerUp(e); });
					this.canvas.attachEvent("touchend", function(e) {me.onPointerUp(e); });
				}
			}
			else
			{
				if (this.canvas.removeEventListener)
				{
					this.canvas.removeEventListener("mousedown", null);
					this.canvas.removeEventListener("touchstart", null);
					
					this.canvas.removeEventListener("mousemove", null);
					this.canvas.removeEventListener("touchmove", null);
					
					this.canvas.removeEventListener("mouseup", null);
					this.canvas.removeEventListener("touchend", null);
				}
				else if (this.canvas.detachEvent)
				{
					this.canvas.detachEvent("onmousedown", null);
					this.canvas.detachEvent("touchstart", null);
					
					this.canvas.detachEvent("onmousemove", null);
					this.canvas.detachEvent("touchmove", null);
					
					this.canvas.detachEvent("onmouseup", null);
					this.canvas.detachEvent("touchend", null);
				}
			}
		}
	}
	
	this.onKeyDown = function(e)
	{
		var key = e.charCode || e.keyCode;

		if (!this.isKeyPressed(key) && this.keysDown.indexOf(key) < 0)
			this.keysDown.push(key);
		
		if (this.keysPressed.indexOf(key) < 0)
			this.keysPressed.push(key);
	}
	
	this.onKeyUp = function(e)
	{
		var key = e.charCode || e.keyCode;
		
		if (this.keysUp.indexOf(key) < 0)
			this.keysUp.push(key);
		
		//this.keysPressed.remove(key);
		this.keysPressed.splice(this.keysPressed.indexOf(key), 1);
	}
	
	this.onPointerDown = function(e)
	{
		var clientX = (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
		var clientY = (e.touches && e.touches.length) ? e.touches[0].clientY : e.clientY;
		this.pointerPosition = this.transformCoords(new NeoPoint(clientX, clientY));

		this.isPointerDown = true;
		this.isPointerPressed = true;
	}
	
	this.onPointerMove = function(e)
	{
		var clientX = (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
		var clientY = (e.touches && e.touches.length) ? e.touches[0].clientY : e.clientY;
		this.pointerPosition = this.transformCoords(new NeoPoint(clientX, clientY));
	}
	
	this.onPointerUp = function(e)
	{
		var clientX = (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
		var clientY = (e.touches && e.touches.length) ? e.touches[0].clientY : e.clientY;
		_pointerPosition = this.transformCoords(new NeoPoint(clientX, clientY));
		
		this.isPointerUp = true;
		this.isPointerPressed = false;
	}
	
	this.transformCoords = function(clientCoords)
	{
		var obj = this.canvas;
	    var top = 0;
	    var left = 0;
	    while (obj && obj.tagName != 'BODY')
	    {
	        top += obj.offsetTop;
	        left += obj.offsetLeft;
	        obj = obj.offsetParent;
	    }
	 
	    // return relative position
	    var canvasX = clientCoords.x - left + window.pageXOffset;
	    var canvasY = clientCoords.y - top + window.pageYOffset;
	
	    return new NeoPoint(canvasX, canvasY);
	}
	
	this.restore = function()
	{
		//_keysDown.clear();
		//_keysUp.clear();
		this.keysDown.splice(0, this.keysDown.length);
		this.keysUp.splice(0, this.keysUp.length);
		this.isPointerDown = false;
		this.isPointerUp = false;
	}
}

/**
 * 
 * @param x
 * @param y
 * @returns {NeoPoint}
 */
function NeoPoint(x, y)
{
	this.x = x;
	this.y = y;
};

/**
 * 
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {NeoBound}
 */
function NeoBound(x, y, width, height)
{
	this.x = x == null ? 0 : x;
	this.y = y == null ? 0 : y;
	this.width = width == null ? 0 : width;
	this.height = height == null ? 0 : height;
	
	this.getXMin = function() { return x; }
	this.getXMax = function() { return x + width; }
	this.getYMin = function() { return y; }
	this.getYMax = function() { return y + height; }
};

/**
 * 
 * @param red
 * @param green
 * @param blue
 * @param alpha
 * @returns {NeoColor}
 */
function NeoColor(red, green, blue, alpha)
{
	this.r = red == null ? 1 : red;
	this.g = green == null ? 1 : green;
	this.b = blue == null ? 1 : blue;
	this.a = alpha == null ? 1 : alpha;
	
	
	//OPERATIONS
	this.sum(value)
	{
		if (value instanceof NeoColor)
		{
			var r = NeoColor.saturate(this.r + (value.r * value.a));
			var g = NeoColor.saturate(this.g + (value.g * value.a));
			var b = NeoColor.saturate(this.b + (value.b * value.a));
		}
		else
		{
			var r = NeoColor.saturate(this.r + value);
			var g = NeoColor.saturate(this.g + value);
			var b = NeoColor.saturate(this.b + value);
		}
		return new NeoColor(r, g, b, this.a);
	}
	
	this.subtract(value)
	{
		if (value instanceof NeoColor)
		{
			var r = NeoColor.saturate(this.r - (value.r * value.a));
			var g = NeoColor.saturate(this.g - (value.g * value.a));
			var b = NeoColor.saturate(this.b - (value.b * value.a));
		}
		else
		{
			var r = NeoColor.saturate(this.r - value);
			var g = NeoColor.saturate(this.g - value);
			var b = NeoColor.saturate(this.b - value);
		}
		return new NeoColor(r, g, b, this.a);
	}
	
	this.multiply(value)
	{
		if (value instanceof NeoColor)
		{
			var r = this.r * value.r;
			var g = this.g * value.g;
			var b = this.b * value.b;
		}
		else
		{
			var r = NeoColor.saturate(this.r * value);
			var g = NeoColor.saturate(this.g * value);
			var b = NeoColor.saturate(this.b * value);
		}
		return new NeoColor(r, g, b, this.a);
	}
	
	this.divide(value)
	{
		if (value instanceof NeoColor)
		{
			var r = NeoColor.saturate(this.r / value.r);
			var g = NeoColor.saturate(this.g / value.g);
			var b = NeoColor.saturate(this.b / value.b);
		}
		else
		{
			var r = NeoColor.saturate(this.r / value);
			var g = NeoColor.saturate(this.g / value);
			var b = NeoColor.saturate(this.b / value);
		}
		return new NeoColor(r, g, b, this.a);
	}
	
	this.max(value)
	{
		if (value instanceof NeoColor)
		{
			var r = Math.max(this.r, value.r * value.a);
			var g = Math.max(this.g, value.g * value.a);
			var b = Math.max(this.b, value.b * value.a);
		}
		else
		{
			var r = Math.max(this.r, value);
			var g = Math.max(this.g, value);
			var b = Math.max(this.b, value);
		}
		return new NeoColor(r, g, b, this.a);
	}
	
	this.min(value)
	{
		if (value instanceof NeoColor)
		{
			var r = Math.min(this.r, value.r);
			var g = Math.min(this.g, value.g);
			var b = Math.min(this.b, value.b);
		}
		else
		{
			var r = Math.min(this.r, value);
			var g = Math.min(this.g, value);
			var b = Math.min(this.b, value);
		}
		return new NeoColor(r, g, b, this.a);
	}
	
	this.merge = function(color)
	{
		var r = this.r + ((color.r-this.r) * value.a);
		var g = this.g + ((color.g-this.g) * value.a);
		var b = this.b + ((color.b-this.b) * value.a);

		return new NeoColor(r, g, b, this.a);
	}
	
	this.interpolate = function(color, amount)
	{
		if (amount == null)
			amount = 0.5;
			
		var r = this.r + ((color.r-this.r) * amount);
		var g = this.g + ((color.g-this.g) * amount);
		var b = this.b + ((color.b-this.b) * amount);
		var b = this.a + ((color.a-this.a) * amount);

		return new NeoColor(r, g, b, this.a);
	}
	
	this.invert = function()
	{
		var r = 1 - this.r;
		var g = 1 - this.g;
		var b = 1 - this.b;
		return new NeoColor(r, g, b, this.a);
	}
	
	//EFFECTS
	this.toGreyScale = function()
	{
		var average = (this.r + this.g + this.b) / 3;
		return new Color(average, average, average, this.a);
	}
	
	this.toBlackAndWhite = function()
	{
		var average = (this.r + this.g + this.b) / 3;
		var round = average < 0.5 ? 0 : 1;
		return new Color(round, round, round, this.a);
	}
	
	this.correctBrightness = function(value)
	{
		var brighthness = new NeoColor(1, 1, 1, value);
		return this.merge(brighthness);
	}
	
	this.correctGamma = function(value)
	{
		var r = NeoColor.saturate(Math.pow(this.r, value));
		var g = NeoColor.saturate(Math.pow(this.g, value));
		var b = NeoColor.saturate(Math.pow(this.b, value));
		return new NeoColor(r, g, b, this.a);
	}
}
NeoColor.saturate = function(value)
{
	if (value < 0)
		value = 0;
	if (value > 1)
		value = 1;
	
	return value;
}


/**
 * 
 * @param width
 * @param height
 * @param pixels
 */
function NeoImageData(width, height, pixels)
{
	this.width = width == null ? 0 : width;
	this.height = height == null ? 0 : height;
	this.pixels = pixels == null ? new Array() : pixels;
	this.time = new Date().getTime();
	
	this.getPixel = function(x, y)
	{
		if (x >=this.width || y >= this.height)
			return null;
		
		return this.pixels[this.width * y + x];
	}
	
	this.setPixel = function(x, y, color)
	{
		if (x >=this.width || y >= this.height)
			return false;
		
		this.pixels[this.width * y + x] = color;
		return true;
	}
	
	this.addPixel(pixel)
	{
		if (pixel instanceof NeoPixel)
		{
			this.pixels.push(pixel);
			return true;
		}
		else return false;
	}
	
	this.getPixelPosition(i)
	{
		return new Point(i%this.width, i/this.width);
	}
	
	this.toGreyScale = function()
	{
		for (var i in this.pixels)
		{
			this.pixels[i] = this.pixels[i].this.toGreyScale();
		}
	}
	
	this.toBlackAndWhite = function()
	{
		for (var i in this.pixels)
		{
			this.pixels[i] = this.pixels[i].this.toBlackAndWhite();
		}
	}
	
	this.correctBrightness = function(value)
	{
		for (var i in this.pixels)
		{
			this.pixels[i] = this.pixels[i].this.correctBrightness(value);
		}
	}
	
	this.correctGamma = function(value)
	{
		for (var i in this.pixels)
		{
			this.pixels[i] = this.pixels[i].this.correctGamma(value);
		}
	}
	
	this.applyShader = function(shaderScriptName)
	{
		var imageData = new NeoImageData(this.width, this.height)
		var shaderScript = window[shaderScript];
		var shader = new shaderScript(this);
		for (var i in this.pixels)
		{
			this.addPixel(shader.PixelShaderFunction(this.getPixelPosition(i), resources));
		}
		this.pixels = imageData.pixels;
	}
	
	this.toImageData()
	{
		var imageData = new ImageData();
		imageData.width = this.width;
		imageData.height = this.height;
		
		for (var i in this.pixels)
		{
			imageData.data.push(pixels[i].r);
			imageData.data.push(pixels[i].g);
			imageData.data.push(pixels[i].b);
			imageData.data.push(pixels[i].a);
		}
		
		return imageData;
	}
}
NeoImageData.fromImageData = function(imageData)
{
	var neoImageData = new NeoImageData(imageData.width, imageData.height);
	
	for (i=0; i<imageData.data.length;i+=4)
		neoImageData.addPixel(new NeoColor(imageData.data[i], imageData.data[i+1], imageData.data[i+2]. imageData.data[i+3]));
	
	return neoImageData;
}

/**
 * 
 * @param dataImage
 */
function NeoPixelShader(dataImage)
{
	this.dataImage = dataImage;
	this.time = new Date().getTime();
	
	/**
	 * 
	 * @return NeoColor
	 */
	this.PixelShaderFunction(coords)
	{
		var pixel = new NeoColor();
		
		return pixel;
	}
}


//HELPER FUNCTIONS
HTMLCanvasElement.prototype.getImage = function(type)
{
	var image = new Image();
	image.src = this.toDataURL(type);
	return image;
}

CanvasRenderingContext2D.prototype.getNeoImageData = function(x, y, width, height)
{
	return NeoImageData.fromImageData(this.getImageData(x, y, width, height));
}

function sleep(milliSeconds)
{
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}