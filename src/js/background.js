var c     = chrome;
var tab   = require('./lib/tab');
var stash = require('./lib/stash');

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