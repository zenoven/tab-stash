/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var c     = chrome;
	var tab   = __webpack_require__(1);
	var stash = __webpack_require__(2);
	var utils = __webpack_require__(3);
	var st    = c.storage;

	var background = {

	    init: function() {
	        this.initStash();
	        this.initOptions();
	        this.bindEvents();
	    },

	    bindEvents: function () {
	        this.contextMenuEvent();
	        this.bookmarkModifyEvent();
	    },

	    initStash: function(){
	        stash.init();
	    },

	    initOptions: function(){
	        st.sync.get('options', function(result){
	            if(utils.isEmpty(result)){
	                st.sync.set({
	                    options: {
	                        preservTab: "blank"
	                    }
	                }, function(res){
	                    console.log('set initial options finished');
	                });
	            }else{
	                console.log('opions loaded');
	                console.log(result);
	            }
	        });
	    },

	    contextMenuEvent: function () {
	        var self = this;
	        c.contextMenus.create({
	            title:chrome.i18n.getMessage("extMenuTitle"),
	            contexts:['all'],
	            onclick: function (argument) {
	                stash.create();
	            }
	        });
	    },

	    bookmarkModifyEvent: function(){
	        c.bookmarks.onRemoved.addListener(function () {
	            stash.init();
	        });
	        c.bookmarks.onChanged.addListener(function () {
	            stash.init();
	        });
	        c.bookmarks.onMoved.addListener(function () {
	            stash.init();
	        });
	    }
	}

	background.init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	var c = chrome;

	function getAll(callback) {
	    c.windows.getCurrent(function (win) {
	        c.tabs.query( {'windowId': win.id}, function (tabs) {
	            for(var i = 0, len = tabs.length; i < len; i++) {
	                if(tabs[i].active) break;
	            }
	            callback && callback(tabs, i);
	        });
	    });
	}

	function close(tabId, callback){
	    c.tabs.remove(tabId, callback);
	}

	module.exports = {
	    getAll: getAll,
	    close: close
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var c   = chrome;
	var tab = __webpack_require__(1);
	var st  = c.storage; // 存储

	// stash使用的书签文件夹对象，用于存储数据
	var bookmarkConfig = {
	    id: null,
	    title:  "tab-stash",
	    children: null
	};

	function saveTabToBookmark(tab, parentBookmarkId, callback){
	    c.bookmarks.create({
	        title: tab.title,
	        index: tab.index,
	        url:   tab.url,
	        parentId: parentBookmarkId
	    },function (result) {
	        callback && callback(tab, result);
	    });
	}

	function saveAllTabsToBookmark(tabs, activeTabIndex){
	    c.bookmarks.create({title: tabs[activeTabIndex].title, parentId: bookmarkConfig.id}, function (result) {
	        for(var i = 0; i < tabs.length; i++) {
	            (function(index,length){
	                saveTabToBookmark(tabs[i], result.id, function(tab){
	                    // self.closeTab(tab.id);
	                });
	            })(i, tabs.length);
	        }
	    });
	}

	module.exports = {

	    init: function(){
	        // 如果没有创建书签文件夹，先创建一个
	        c.bookmarks.search({title: bookmarkConfig.title}, function (bookmark) {
	            if(bookmark.length ===0){
	                c.bookmarks.create({title: bookmarkConfig.title}, function(result){
	                    bookmarkConfig.id = result.id;
	                    if(result.children && result.children.length) {
	                        bookmarkConfig.children = result.children;
	                    }
	                });
	            }else{
	                bookmark = bookmark[0];
	                bookmarkConfig.id = bookmark.id;
	                if(bookmark.children && bookmark.children.length) {
	                    bookmarkConfig.children = bookmark.children;
	                }
	            }
	        })
	    },

	    create: function(options) {
	        tab.getAll(function (tabs, i) {
	            saveAllTabsToBookmark(tabs, i);
	        });
	    },

	    getAll: function(){

	    },

	    modify: function(stashId) {
	        
	    },

	    delete: function(stashId) {

	    }
	    
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	    isEmpty: function(value) {
	        var type;

	        if(value == null) { // 等同于 value === undefined || value === null
	            return true;
	        }

	        type = Object.prototype.toString.call(value).slice(8, -1);

	        switch(type) {
	            case 'String':
	                return !!$.trim(value);
	            case 'Array':
	                return !value.length;
	            case 'Object':
	                for(var v in value) {
	                    return false;
	                }
	                return true; 
	            default:
	                return false; // 其他对象均视作非空
	            }
	    }
	}

/***/ }
/******/ ]);