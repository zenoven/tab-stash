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

	var bookmark = {
	        id: null,
	        title:  "tab-stash",
	        children: null
	    };

	var background = {

	    init: function() {
	        this.bindEvents();
	    },

	    bindEvents: function () {
	        this.initStash();
	        this.contextMenuEvent();
	        this.bookmarkModifyEvent();
	    },

	    initStash: function(){
	        stash.init();
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
	                    self.closeTab(tab.id);
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

	    get: function(){

	    },

	    create: function(options) {
	        tab.getAll(function (tabs, i) {
	            saveAllTabsToBookmark(tabs, i);
	        });
	    },

	    modify: function(stash) {
	        
	    }
	    
	}


/***/ }
/******/ ]);