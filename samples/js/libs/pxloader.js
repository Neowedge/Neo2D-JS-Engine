function PxLoader(settings) {

    // merge settings with defaults
    settings = settings || {};

    // how frequently we poll resources for progress
    if (settings.statusInterval == null) {
        settings.statusInterval = 5000; // every 5 seconds by default
    }

    // delay before logging since last progress change
    if (settings.loggingDelay == null) {
        settings.loggingDelay = 20 * 1000; // log stragglers after 20 secs
    }

    // stop waiting if no progress has been made in the moving time window
    if (settings.noProgressTimeout == null) {
        settings.noProgressTimeout = Infinity; // do not stop waiting by default
    }

    var entries = [], // holds resources to be loaded with their status
        progressListeners = [],
        timeStarted,
        progressChanged = +new Date;

    /**
     * The status of a resource
     * @enum {number}
     */
    var ResourceState = {
        QUEUED: 0,
        WAITING: 1,
        LOADED: 2,
        ERROR: 3,
        TIMEOUT: 4
    };

    // places non-array values into an array.
    var ensureArray = function(val) {
        if (val == null) {
            return [];
        }

        if (Array.isArray(val)) {
            return val;
        }

        return [ val ];
    };

    // add an entry to the list of resources to be loaded
    this.add = function(resource) {

        // ensure tags are in an array
        resource.tags = ensureArray(resource.tags);

        // ensure priority is set
        if (resource.priority == null) {
            resource.priority = Infinity;
        }

        entries.push({
            resource: resource,
            state: ResourceState.QUEUED
        });
    };

    this.addProgressListener = function(callback, tags) {
        progressListeners.push({
            callback: callback,
            tags: ensureArray(tags)
        });
    };

    this.addCompletionListener = function(callback, tags) {
        progressListeners.push({
            tags: ensureArray(tags),
            callback: function(e) {
                if (e.completedCount === e.totalCount) {
                    callback();
                }
            }
        });
    };

    // creates a comparison function for resources
    var getResourceSort = function(orderedTags) {

        // helper to get the top tag's order for a resource
        orderedTags = ensureArray(orderedTags);
        var getTagOrder = function(entry) {
            var resource = entry.resource,
                bestIndex = Infinity;
            for (var i = 0, len = resource.tags.length; i < len; i++) {
                var index = orderedTags.indexOf(resource.tags[i]);
                if (index >= 0 && index < bestIndex) {
                    bestIndex = index;
                }
            }
            return bestIndex;
        };

        return function(a, b) {
            // check tag order first
            var aOrder = getTagOrder(a),
                bOrder = getTagOrder(b);
            if (aOrder < bOrder) return -1;
            if (aOrder > bOrder) return 1;

            // now check priority
            if (a.priority < b.priority) return -1;
            if (a.priority > b.priority) return 1;
            return 0;
        }
    };

    this.start = function(orderedTags) {
        timeStarted = +new Date;

        // first order the resources
        var compareResources = getResourceSort(orderedTags);
        entries.sort(compareResources);

        // trigger requests for each resource
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            entry.status = ResourceState.WAITING;
            entry.resource.start(this);
        }

        // do an initial status check soon since items may be loaded from the cache
        setTimeout(statusCheck, 100);
    };

    var statusCheck = function() {
        var checkAgain = false,
            noProgressTime = (+new Date) - progressChanged,
            timedOut = (noProgressTime >= settings.noProgressTimeout),
            shouldLog = (noProgressTime >= settings.loggingDelay);

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (entry.status !== ResourceState.WAITING) {
                continue;
            }

            // see if the resource has loaded
            entry.resource.checkStatus();

            // if still waiting, mark as timed out or make sure we check again
            if (entry.status === ResourceState.WAITING) {
                if (timedOut) {
                    entry.resource.onTimeout();
                }
                else {
                    checkAgain = true;
                }
            }
        }

        // log any resources that are still pending
        if (shouldLog && checkAgain) {
            log();
        }

        if (checkAgain) {
            setTimeout(statusCheck, settings.statusInterval);
        }
    };

    this.isBusy = function() {
        for (var i = 0, len = entries.length; i < len; i++) {
            if (entries[i].status === ResourceState.QUEUED ||
                entries[i].status === ResourceState.WAITING) {
                return true;
            }
        }
        return false;
    };

    // helper which returns true if two arrays share at least one item
    var arraysIntersect = function(a, b) {
        for (var i = 0, len = a.length; i < len; i++) {
            if (b.indexOf(a[i]) >= 0) {
                return true;
            }
        }
        return false;
    };

    var onProgress = function(resource, statusType) {
        // find the entry for the resource
        var entry = null;
        for(var i=0, len = entries.length; i < len; i++) {
            if (entries[i].resource === resource) {
                entry = entries[i];
                break;
            }
        }

        // we have already updated the status of the resource
        if (entry == null || entry.status !== ResourceState.WAITING) {
            return;
        }
        entry.status = statusType;
        progressChanged = +new Date;

        var numResourceTags = resource.tags.length;

        // fire callbacks for interested listeners
        for (var i = 0, numListeners = progressListeners.length; i < numListeners; i++) {
            var listener = progressListeners[i],
                shouldCall;

            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                shouldCall = true;
            }
            else {
                // listener only wants to hear about certain tags
                shouldCall = arraysIntersect(resource.tags, listener.tags);
            }

            if (shouldCall) {
                sendProgress(entry, listener);
            }
        }
    };

    this.onLoad = function(resource) {
        onProgress(resource, ResourceState.LOADED);
    };
    this.onError = function(resource) {
        onProgress(resource, ResourceState.ERROR);
    };
    this.onTimeout = function(resource) {
        onProgress(resource, ResourceState.TIMEOUT);
    };

    // sends a progress report to a listener
    var sendProgress = function(updatedEntry, listener) {
        // find stats for all the resources the caller is interested in
        var completed = 0,
            total = 0;
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i],
                includeResource;

            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                includeResource = true;
            }
            else {
                includeResource = arraysIntersect(entry.resource.tags, listener.tags);
            }

            if (includeResource) {
                total++;
                if (entry.status === ResourceState.LOADED ||
                    entry.status === ResourceState.ERROR ||
                    entry.status === ResourceState.TIMEOUT) {
                    completed++;
                }
            }
        }

        listener.callback({
            // info about the resource that changed
            resource: updatedEntry.resource,

            // should we expose StatusType instead?
            loaded: (updatedEntry.status === ResourceState.LOADED),
            error: (updatedEntry.status === ResourceState.ERROR),
            timeout: (updatedEntry.status === ResourceState.TIMEOUT),

            // updated stats for all resources
            completedCount: completed,
            totalCount: total
        });
    };

    // prints the status of each resource to the console
    var log = this.log = function(showAll) {
        if (!window.console) {
            return;
        }

        var elapsedSeconds = Math.round((+new Date - timeStarted) / 1000);
        window.console.log('PxLoader elapsed: ' + elapsedSeconds + ' sec');

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (!showAll && entry.status !== ResourceState.WAITING) {
                continue;
            }

            var message = 'PxLoader: #' + i + ' ' + entry.resource.getName();
            switch(entry.status) {
                case ResourceState.QUEUED:
                    message += ' (Not Started)';
                    break;
                case ResourceState.WAITING:
                    message += ' (Waiting)';
                    break;
                case ResourceState.LOADED:
                    message += ' (Loaded)';
                    break;
                case ResourceState.ERROR:
                    message += ' (Error)';
                    break;
                case ResourceState.TIMEOUT:
                    message += ' (Timeout)';
                    break;
            }

            if (entry.resource.tags.length > 0) {
                message += ' Tags: [' + entry.resource.tags.join(',') + ']';
            }

            window.console.log(message);
        }
    };
}

function PxLoaderImage(id, url, tags, priority) {
    var self = this,
        loader = null;

    this.id = id;
    this.img = new Image();
    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function () {
        if (self.img.readyState == 'loaded' || self.img.readyState == 'complete') {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        self.unbind('load', onLoad);
        self.unbind('readystatechange', onReadyStateChange);
        self.unbind('error', onError);
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an image is in the cache.
        self.bind('load', onLoad);
        self.bind('readystatechange', onReadyStateChange);
        self.bind('error', onError);

        self.img.src = url;
    };

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        if (self.img.complete) {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        removeEventHandlers();
        if (self.img.complete) {
            loader.onLoad(self);
        }
        else {
            loader.onTimeout(self);
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };
    
	// cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        if (self.img.addEventListener) {
            self.img.addEventListener(eventName, eventHandler, false); 
        } else if (self.img.attachEvent) {
            self.img.attachEvent('on'+eventName, eventHandler);
        }
    };

	// cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        if (self.img.removeEventListener) {
            self.img.removeEventListener(eventName, eventHandler, false);
        } else if (self.img.detachEvent) {
            self.img.detachEvent('on'+eventName, eventHandler);
        }
    };

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addImage = function(id, url, tags, priority) {
    var imageLoader = new PxLoaderImage(id, url, tags, priority);
    this.add(imageLoader);

    // return the img element to the caller
    return imageLoader.img;
};

function PxLoaderSound(id, url, tags, priority) {
    var self = this,
        loader = null;

    this.id = id;
    this.tags = tags;
    this.priority = priority;
    this.sound = soundManager['createSound']({
        'id': id,
        'url': url,
        'autoLoad': false,
        'onload': function() { loader.onLoad(self); },

        // HTML5-only event: Fires when a browser has chosen to stop downloading.
        // "The user agent is intentionally not currently fetching media data,
        // but does not have the entire media resource downloaded."
        'onsuspend': function() { loader.onTimeout(self); },

        // Fires at a regular interval when a sound is loading and new data
        // has been received.
        'whileloading': function() {
            var bytesLoaded = this['bytesLoaded'],
                bytesTotal = this['bytesTotal'];

            // TODO: provide percentage complete updates to loader?

            // see if we have loaded the file
            if (bytesLoaded > 0 && (bytesLoaded === bytesTotal)) {
                loader.onLoad(self);
            }
        }
    });

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // On iOS, soundManager2 uses a global audio object so we can't
        // preload multiple sounds. We'll have to hope they load quickly
        // when we need to play them. Unfortunately, SM2 doesn't expose
        // a property to indicate its using a global object. For now we'll
        // use the same test they do: only when on an iDevice
        var iDevice = navigator.userAgent.match(/(ipad|iphone|ipod)/i);
        if (iDevice) {
            loader.onTimeout(self);
        }
        else {
            this.sound['load']();
        }
    };

    this.checkStatus = function() {
        switch(self.sound['readyState']) {
            case 0: // uninitialised
            case 1: // loading
                break;
            case 2: // failed/error
                loader.onError(self);
                break;
            case 3: // loaded/success
                loader.onLoad(self);
                break;
        }
    };

    this.onTimeout = function() {
        loader.onTimeout(self);
    };

    this.getName = function() {
        return url;
    }
    
	// cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        if (self.script.addEventListener) {
            self.script.addEventListener(eventName, eventHandler, false); 
        } else if (self.script.attachEvent) {
            self.script.attachEvent('on'+eventName, eventHandler);
        }
    };

	// cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        if (self.script.removeEventListener) {
            self.script.removeEventListener(eventName, eventHandler, false);
        } else if (self.script.detachEvent) {
            self.script.detachEvent('on'+eventName, eventHandler);
        }
    };
}

// add a convenience method to PxLoader for adding a sound
PxLoader.prototype.addSound = function(id, url, tags, priority) {
    var soundLoader = new PxLoaderSound(id, url, tags, priority);
    this.add(soundLoader);
    return soundLoader.sound;
};


function PxLoaderScript(id, url, tags, priority) { 
    var self = this; 
        loader = null; 
 
    // used by the loader to categorize and prioritize 
    this.id = id;
    this.tags = tags;
    this.priority = priority; 
    this.script = document.createElement("script");
    this.script.id = this.id;
 
    var onReadyStateChange = function () {
        if (self.script.readyState == 'loaded' || self.script.readyState == 'complete') {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        self.unbind('load', onLoad);
        self.unbind('readystatechange', onReadyStateChange);
        self.unbind('error', onError);
    };
    
    // called by PxLoader to trigger download 
    this.start = function(pxLoader) { 
        // we need the loader ref so we can notify upon completion 
        loader = pxLoader; 
 
        // set up event handlers so we send the loader progress updates 
 
        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an script is in the cache.
        self.bind('load', onLoad);
        self.bind('readystatechange', onReadyStateChange);
        self.bind('error', onError);

        self.script.src = url;
    }; 
 
    // called by PxLoader to check status of image (fallback in case 
    // the event listeners are not triggered). 
    this.checkStatus = function() { 
        if (self.script.readyState == 'loaded' || self.script.readyState == 'complete') {
            removeEventHandlers();
            loader.onLoad(self);
        }
    }; 
 
    // called by PxLoader when it is no longer waiting 
    this.onTimeout = function() { 
        removeEventHandlers();
        if (self.script.readyState == 'loaded' || self.script.readyState == 'complete') {
            loader.onLoad(self);
        }
        else {
            loader.onTimeout(self);
        }
    }; 
 
    // returns a name for the resource that can be used in logging 
    this.getName = function() { 
        return url; 
    } 
} 
//add a convenience method to PxLoader for adding a script
PxLoader.prototype.addScript = function(id, url, tags, priority) {
    var scriptLoader = new PxLoaderScript(id, url, tags, priority);
    this.add(scriptLoader);
    return scriptLoader.script;
};





// shims to ensure we have newer Array utility methods

// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
}

// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

if (!Array.remove) {
	Array.remove = function(object)
	{
        "use strict";
        if (this == null)
            throw new TypeError();
            
		var index = this.indexOf(object);
		if (index >= 0 && index < array.length)
			array.splice(index, 1);
	};
}

if (!Array.clear) {
	Array.clear = function()
	{
        "use strict";
        if (this == null)
            throw new TypeError();

		this.splice(0, this.length);
	};
}

if (!String.prototype.format) {
	String.prototype.format = function()
	{
	    var formatted = this;
	    for (var i = 0; i < arguments.length; i++)
	    {
	        formatted = formatted.replace("{" + i + "}", arguments[i]);
	    }
	    return formatted;
	};
}