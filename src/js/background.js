var c     = chrome;
var tab   = require('./lib/tab');
var stash = require('./lib/stash');
var utils = require('./lib/utils');
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
                }, function(){
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