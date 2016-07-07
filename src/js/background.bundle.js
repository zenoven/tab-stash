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
	var utils = __webpack_require__(4);
	var st = c.storage;

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

	    initStash: function initStash() {
	        var self = this;
	        stash.init(function () {
	            stash.getAll(function (obj) {
	                self.setBadge(obj.summary.groupCount);
	            });
	        });
	    },

	    setBadge: function setBadge(number) {
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
	var tab = __webpack_require__(1);
	var st = c.storage; // 存储
	var dateFormat = __webpack_require__(3);
	var options;
	var bookmarkConfig = { // stash使用的书签文件夹对象，用于存储数据
	    id: null,
	    title: "tab-stash",
	    children: null
	};

	var app = {
	    init: function init() {
	        this.bindEvents();
	    },

	    bindEvents: function bindEvents() {
	        st.sync.get('options', function (rs) {
	            options = rs.options;
	            console.log(options);
	        });

	        st.onChanged.addListener(function (changes, areaName) {
	            options = changes.newValue.options;
	        });
	    },

	    saveTabToBookmark: function saveTabToBookmark(tab, parentBookmarkId, callback) {
	        c.bookmarks.create({
	            title: tab.title,
	            index: tab.index,
	            url: tab.url,
	            parentId: parentBookmarkId
	        }, function (result) {
	            callback && callback(tab, result);
	        });
	    },

	    saveAllTabsToBookmark: function saveAllTabsToBookmark(tabs, activeTabIndex, config, callback) {

	        c.bookmarks.create({ title: tabs[activeTabIndex].title, parentId: bookmarkConfig.id }, function (result) {
	            for (var i = 0; i < tabs.length; i++) {
	                (function (index, length) {
	                    // todo: 根据options来判断保留的tab
	                    if (config.preservTab === 'blank' && index === 0) {
	                        c.tabs.create({ active: false }, null);
	                    }
	                    app.saveTabToBookmark(tabs[index], result.id, function (tab) {
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
	                })(i, tabs.length);
	            }
	        });
	    }
	};

	module.exports = {

	    init: function init(callback) {
	        var self = this;
	        self.initTimer && clearTimeout(self.initTimer);

	        self.initTimer = setTimeout(function () {
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
	        }, 100);
	    },

	    create: function create(callback) {
	        tab.getAll(function (tabs, i) {
	            app.saveAllTabsToBookmark(tabs, i, options, callback);
	        });
	    },

	    getAll: function getAll(callback) {
	        var self = this;
	        c.bookmarks.getSubTree(bookmarkConfig.id, function (tree) {
	            console.log(tree);
	            callback && callback(self.convertTreeToData(tree));
	        });
	    },

	    convertTreeToData: function convertTreeToData(tree) {
	        var data = {
	            summary: {
	                groupCount: tree[0].children.length,
	                itemsCount: 0
	            },
	            list: []
	        };
	        var temp = {};

	        tree[0].children.map(function (item, index) {
	            data.summary.itemsCount += item.children.length;
	            temp = {
	                title: item.title,
	                id: item.id,
	                dateAdded: item.dateAdded,
	                dateAddedFull: dateFormat(item.dateAdded, 'yyyy-mm-dd hh:mm:ss'),
	                dateAddedShort: dateFormat(item.dateAdded, 'mm-dd'),
	                children: item.children
	            };
	            data.list.push(temp);
	        });

	        return data;
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

	app.init();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*
	 * Date Format 1.2.3
	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	 * MIT license
	 *
	 * Includes enhancements by Scott Trenda <scott.trenda.net>
	 * and Kris Kowal <cixar.com/~kris.kowal/>
	 *
	 * Accepts a date, a mask, or a date and a mask.
	 * Returns a formatted version of the given date.
	 * The date defaults to the current date/time.
	 * The mask defaults to dateFormat.masks.default.
	 */

	(function (global) {
	  'use strict';

	  var dateFormat = function () {
	    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
	    var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	    var timezoneClip = /[^-+\dA-Z]/g;

	    // Regexes and supporting functions are cached through closure
	    return function (date, mask, utc, gmt) {

	      // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
	      if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
	        mask = date;
	        date = undefined;
	      }

	      date = date || new Date();

	      if (!(date instanceof Date)) {
	        date = new Date(date);
	      }

	      if (isNaN(date)) {
	        throw TypeError('Invalid date');
	      }

	      mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);

	      // Allow setting the utc/gmt argument via the mask
	      var maskSlice = mask.slice(0, 4);
	      if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
	        mask = mask.slice(4);
	        utc = true;
	        if (maskSlice === 'GMT:') {
	          gmt = true;
	        }
	      }

	      var _ = utc ? 'getUTC' : 'get';
	      var d = date[_ + 'Date']();
	      var D = date[_ + 'Day']();
	      var m = date[_ + 'Month']();
	      var y = date[_ + 'FullYear']();
	      var H = date[_ + 'Hours']();
	      var M = date[_ + 'Minutes']();
	      var s = date[_ + 'Seconds']();
	      var L = date[_ + 'Milliseconds']();
	      var o = utc ? 0 : date.getTimezoneOffset();
	      var W = getWeek(date);
	      var N = getDayOfWeek(date);
	      var flags = {
	        d: d,
	        dd: pad(d),
	        ddd: dateFormat.i18n.dayNames[D],
	        dddd: dateFormat.i18n.dayNames[D + 7],
	        m: m + 1,
	        mm: pad(m + 1),
	        mmm: dateFormat.i18n.monthNames[m],
	        mmmm: dateFormat.i18n.monthNames[m + 12],
	        yy: String(y).slice(2),
	        yyyy: y,
	        h: H % 12 || 12,
	        hh: pad(H % 12 || 12),
	        H: H,
	        HH: pad(H),
	        M: M,
	        MM: pad(M),
	        s: s,
	        ss: pad(s),
	        l: pad(L, 3),
	        L: pad(Math.round(L / 10)),
	        t: H < 12 ? 'a' : 'p',
	        tt: H < 12 ? 'am' : 'pm',
	        T: H < 12 ? 'A' : 'P',
	        TT: H < 12 ? 'AM' : 'PM',
	        Z: gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
	        o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
	        S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
	        W: W,
	        N: N
	      };

	      return mask.replace(token, function (match) {
	        if (match in flags) {
	          return flags[match];
	        }
	        return match.slice(1, match.length - 1);
	      });
	    };
	  }();

	  dateFormat.masks = {
	    'default': 'ddd mmm dd yyyy HH:MM:ss',
	    'shortDate': 'm/d/yy',
	    'mediumDate': 'mmm d, yyyy',
	    'longDate': 'mmmm d, yyyy',
	    'fullDate': 'dddd, mmmm d, yyyy',
	    'shortTime': 'h:MM TT',
	    'mediumTime': 'h:MM:ss TT',
	    'longTime': 'h:MM:ss TT Z',
	    'isoDate': 'yyyy-mm-dd',
	    'isoTime': 'HH:MM:ss',
	    'isoDateTime': 'yyyy-mm-dd\'T\'HH:MM:sso',
	    'isoUtcDateTime': 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
	    'expiresHeaderFormat': 'ddd, dd mmm yyyy HH:MM:ss Z'
	  };

	  // Internationalization strings
	  dateFormat.i18n = {
	    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	  };

	  function pad(val, len) {
	    val = String(val);
	    len = len || 2;
	    while (val.length < len) {
	      val = '0' + val;
	    }
	    return val;
	  }

	  /**
	   * Get the ISO 8601 week number
	   * Based on comments from
	   * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
	   *
	   * @param  {Object} `date`
	   * @return {Number}
	   */
	  function getWeek(date) {
	    // Remove time components of date
	    var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	    // Change date to Thursday same week
	    targetThursday.setDate(targetThursday.getDate() - (targetThursday.getDay() + 6) % 7 + 3);

	    // Take January 4th as it is always in week 1 (see ISO 8601)
	    var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

	    // Change date to Thursday same week
	    firstThursday.setDate(firstThursday.getDate() - (firstThursday.getDay() + 6) % 7 + 3);

	    // Check if daylight-saving-time-switch occured and correct for it
	    var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
	    targetThursday.setHours(targetThursday.getHours() - ds);

	    // Number of weeks between target Thursday and first Thursday
	    var weekDiff = (targetThursday - firstThursday) / (86400000 * 7);
	    return 1 + Math.floor(weekDiff);
	  }

	  /**
	   * Get ISO-8601 numeric representation of the day of the week
	   * 1 (for Monday) through 7 (for Sunday)
	   * 
	   * @param  {Object} `date`
	   * @return {Number}
	   */
	  function getDayOfWeek(date) {
	    var dow = date.getDay();
	    if (dow === 0) {
	      dow = 7;
	    }
	    return dow;
	  }

	  /**
	   * kind-of shortcut
	   * @param  {*} val
	   * @return {String}
	   */
	  function kindOf(val) {
	    if (val === null) {
	      return 'null';
	    }

	    if (val === undefined) {
	      return 'undefined';
	    }

	    if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object') {
	      return typeof val === 'undefined' ? 'undefined' : _typeof(val);
	    }

	    if (Array.isArray(val)) {
	      return 'array';
	    }

	    return {}.toString.call(val).slice(8, -1).toLowerCase();
	  };

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return dateFormat;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
	    module.exports = dateFormat;
	  } else {
	    global.dateFormat = dateFormat;
	  }
	})(undefined);

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

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
	        var c = chrome;
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
	    }

	};

/***/ }
/******/ ]);