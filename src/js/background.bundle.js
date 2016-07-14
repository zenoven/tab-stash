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

	'use strict';

	var c = chrome;
	var tab = __webpack_require__(1);
	var stash = __webpack_require__(2);
	var utils = __webpack_require__(3);
	var st = c.storage;
	var conf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../config.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var bookmarkConfig = conf.bookmark;

	var background = {

	    init: function init() {
	        this.initStash();
	        this.initOptions();
	        this.bindEvents();
	    },

	    bindEvents: function bindEvents() {
	        this.contextMenuEvent();
	        this.bookmarkModifyEvent();
	    },

	    initStash: function initStash(callback) {
	        var self = this;
	        // 如果没有创建书签文件夹，先创建一个
	        c.bookmarks.search({ title: bookmarkConfig.title }, function (bookmark) {
	            if (bookmark.length === 0) {
	                c.bookmarks.create({ title: bookmarkConfig.title }, function (result) {
	                    bookmarkConfig.id = result.id;
	                    if (result.children && result.children.length) {
	                        bookmarkConfig.children = result.children;
	                    }
	                    callback && callback();
	                });
	            } else {
	                bookmark = bookmark[0];
	                bookmarkConfig.id = bookmark.id;
	                if (bookmark.children && bookmark.children.length) {
	                    bookmarkConfig.children = bookmark.children;
	                }
	                callback && callback();
	            }
	        });
	        stash.getAll(function (obj) {
	            self.setBadgeText(obj.summary.groupCount);
	        });
	    },

	    setBadgeText: function setBadge(number) {
	        chrome.browserAction.setBadgeText({
	            text: number + ''
	        });
	        chrome.browserAction.setBadgeBackgroundColor({
	            color: '#398DE3'
	        });
	    },

	    initOptions: function initOptions() {

	        st.sync.get('options', function (result) {
	            if (utils.isEmpty(result)) {
	                st.sync.set({
	                    options: {
	                        preservTab: "blank"
	                    }
	                }, function () {
	                    console.log('set initial options finished');
	                });
	            } else {
	                console.log('opions loaded');
	                console.log(result);
	            }
	        });
	    },

	    contextMenuEvent: function contextMenuEvent() {
	        var self = this;
	        c.contextMenus.create({
	            title: utils.getMsg('extMenuTitle'),
	            contexts: ['all'],
	            onclick: function onclick(argument) {
	                stash.create();
	            }
	        });
	    },

	    bookmarkModifyEvent: function bookmarkModifyEvent() {
	        var bookmarkEventArr = ['onCreated', 'onRemoved', 'onChanged', 'onMoved'],
	            self = this;

	        bookmarkEventArr.forEach(function (event, i) {
	            c.bookmarks[event].addListener(function () {
	                self.initStash();
	            });
	        });
	    }
	};

	background.init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var c = chrome;

	function getAll(callback) {
	    c.windows.getCurrent(function (win) {
	        c.tabs.query({ 'windowId': win.id }, function (tabs) {
	            for (var i = 0, len = tabs.length; i < len; i++) {
	                if (tabs[i].active) break;
	            }
	            callback && callback(tabs, i);
	        });
	    });
	}

	function close(tabId, callback) {
	    c.tabs.remove(tabId, callback);
	}

	module.exports = {
	    getAll: getAll,
	    close: close
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var c = chrome;
	var st = c.storage; // 存储
	var tab = __webpack_require__(1);
	var utils = __webpack_require__(3);

	module.exports = {

	    create: function create(callback) {
	        tab.getAll(function (tabs, i) {
	            app.saveAllTabsToBookmark(tabs, i, options, callback);
	        });
	    },

	    getAll: function getAll(callback) {
	        var self = this;
	        c.bookmarks.getSubTree(bookmarkConfig.id, function (bookmark) {
	            callback && callback(utils.convertBookmarkToStash(bookmark));
	        });
	    },

	    modify: function modify(stashId, title, callback) {
	        // stashId需为String
	        stashId = stashId + '';
	        c.bookmarks.update(stashId, { title: title }, function (nodes) {
	            callback && callback(nodes);
	        });
	    },

	    delete: function _delete(stashId, callback) {
	        stashId = stashId + '';
	        chrome.bookmarks.removeTree(stashId, function () {
	            callback && callback();
	        });
	    }

	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var c = chrome;

	module.exports = {
	    isEmpty: function isEmpty(value) {
	        var type;

	        if (value == null) {
	            // 等同于 value === undefined || value === null
	            return true;
	        }

	        type = Object.prototype.toString.call(value).slice(8, -1);

	        switch (type) {
	            case 'String':
	                return !!$.trim(value);
	            case 'Array':
	                return !value.length;
	            case 'Object':
	                for (var v in value) {
	                    return false;
	                }
	                return true;
	            default:
	                return false; // 其他对象均视作非空
	        }
	    },

	    // 获取翻译后的字符串
	    getMsg: function getMsg(msg, subSituationArray) {
	        var translate = c.i18n.getMessage;
	        if (!(subSituationArray && subSituationArray.length)) {
	            return translate(msg);
	        } else {
	            if (msg == "StashSummary") {
	                return translate(msg, dataArr);
	            }
	        }
	    },

	    // 获取翻译后的字符串数组
	    // msgObjArray  []
	    getMsgArr: function getMsgArr(msgArr) {
	        if (!msgArr || !msgArr.length) return;
	        var self = this;
	        var result = {};
	        msgArr.forEach(function (msg) {
	            if (!msg.subSituationArray || !msg.subSituationArray.length) {
	                result[msg.name] = self.getMsg(msg.name);
	            } else {
	                result[msg.name] = self.getMsg(msg.name, msg.subSituationArray);
	            }
	        });
	        return result;
	    },

	    saveTabToBookmark: function saveTabToBookmark(tab, callback) {
	        // todo: get parentBookmarkId
	        parentBookmarkId = '';
	        c.bookmarks.create({
	            title: tab.title,
	            index: tab.index,
	            url: tab.url,
	            parentId: parentBookmarkId
	        }, function (result) {
	            callback && callback(tab, result);
	        });
	    },

	    saveTabListToBookmark: function saveTabListToBookmark(tabList, callback) {
	        // todo: get activeTabIndex, config
	        activeTabIndex = '';
	        config = {};

	        c.bookmarks.create({ title: tabList[activeTabIndex].title, parentId: bookmarkConfig.id }, function (result) {
	            for (var i = 0; i < tabList.length; i++) {
	                (function (index, length) {
	                    // todo: 根据options来判断保留的tab
	                    if (config.preservTab === 'blank' && index === 0) {
	                        c.tabs.create({ active: false }, null);
	                    }
	                    app.saveTabToBookmark(tabList[index], result.id, function (tab) {
	                        index === length - 1 && callback && callback();

	                        if (config.preservTab === 'first' && index === 0) {
	                            return;
	                        }
	                        if (config.preservTab === 'last' && index === length - 1) {
	                            return;
	                        }
	                        if (config.preservTab === 'fixed' && tab.pinned) {
	                            return;
	                        }
	                        if (config.preservTab === 'all') {
	                            return;
	                        }

	                        c.tabs.remove(tab.id);
	                    });
	                })(i, tabList.length);
	            }
	        });
	    }

	};

/***/ }
/******/ ]);
