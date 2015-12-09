webpackJsonp([0],[
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
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {module.exports = {
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }
]);