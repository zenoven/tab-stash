webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var c = chrome;
	var tab = __webpack_require__(1);
	var stash = __webpack_require__(2);
	var utils = __webpack_require__(3);
	var st = c.storage;
	var conf = __webpack_require__(5);
	var bookmarkConfig = conf.bookmark;

	var background = {

	    init: function init() {
	        var self = this;
	        self.initOptions();
	        self.bindEvents();
	    },

	    initOptions: function initOptions() {
	        var self = this;
	        st.sync.get(null, function (result) {
	            if (utils.isEmpty(result)) {
	                st.sync.set(conf, function () {
	                    self.initStash(function () {
	                        self.setBadgeText();
	                    });
	                });
	            } else {
	                self.initStash(function () {
	                    self.setBadgeText();
	                });
	            }
	        });
	    },

	    initStash: function initStash(callback) {
	        var self = this;
	        // 如果没有创建书签文件夹，先创建一个
	        c.bookmarks.search({ title: bookmarkConfig.title }, function (bookmark) {
	            if (bookmark.length === 0) {
	                c.bookmarks.create({ title: bookmarkConfig.title }, function (result) {
	                    st.local.set({
	                        bookmarkId: result.id
	                    }, function () {
	                        console.log('set initial local storage {bookmarkId: "' + result.id + '"}');
	                        callback && callback();
	                    });
	                });
	            } else {
	                st.local.set({
	                    bookmarkId: bookmark[0].id
	                }, function () {
	                    console.log('otherwise, reset local storage: {bookmarkId: "' + bookmark[0].id + '"}');
	                    callback && callback();
	                });
	            }
	        });
	    },

	    setBadgeText: function setBadgeText() {
	        stash.getAll(function (list) {
	            chrome.browserAction.setBadgeText({
	                text: list.length + ''
	            });
	            chrome.browserAction.setBadgeBackgroundColor({
	                color: conf.badge.color
	            });
	        });
	    },
	    bindEvents: function bindEvents() {
	        this.contextMenuEvent();
	        this.bookmarkModifyEvent();
	    },

	    contextMenuEvent: function contextMenuEvent() {
	        c.contextMenus.create({
	            title: utils.getMsg('extMenuTitle'),
	            contexts: ['all'],
	            onclick: function onclick() {
	                stash.create();
	            }
	        });
	    },

	    bookmarkModifyEvent: function bookmarkModifyEvent() {
	        var self = this;
	        utils.afterBookmarkModify(function () {
	            self.initOptions();
	        });
	    }
	};

	// utils.debug(false,function () {
	//     st.sync.clear();
	//     st.local.clear();
	//     // background.init();
	// }, function () {
	//     background.init();
	// });

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
	            utils.saveTabListToBookmark(tabs, i, callback);
	        });
	    },

	    getAll: function getAll(callback) {
	        st.local.get('bookmarkId', function (result) {
	            c.bookmarks.getSubTree(result.bookmarkId, function (bookmark) {
	                callback && callback(utils.convertBookmarkToStash(bookmark));
	            });
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
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    bookmark: {
	        title: "tab-stash"
	    },
	    badge: {
	        color: '#398DE3'
	    },
	    preserveTab: 'blank'
	};

/***/ }
]);