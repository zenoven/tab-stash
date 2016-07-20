var c     = chrome;
var tab   = require('./lib/tab');
var stash = require('./lib/stash');
var utils = require('./lib/utils');
var st    = c.storage;
var conf  = require('./config.js');
var bookmarkConfig = conf.bookmark;

var background = {

    init: function() {
        this.initStash();
        this.bindEvents();
    },

    bindEvents: function () {
        this.optionsEvent();
        this.contextMenuEvent();
        this.bookmarkModifyEvent();
    },

    initStash: function(callback){
        var self = this;
        // 如果没有创建书签文件夹，先创建一个
        c.bookmarks.search({title: bookmarkConfig.title}, function (bookmark) {
            if(bookmark.length ===0){
                c.bookmarks.create({title: bookmarkConfig.title}, function(result){
                    bookmarkConfig.id = result.id;
                    st.sync.set({
                        bookmark: bookmarkConfig
                    }, function(){
                        console.log('set initial bookmarkConfig');
                    });
                    callback && callback();
                });
            }else{
                bookmark = bookmark[0];
                bookmarkConfig.id = bookmark.id;
                st.sync.set({
                    bookmark: bookmarkConfig
                }, function(){
                    console.log('set initial bookmarkConfig');
                });
                callback && callback();
            }
            self.setBadgeText();
        });

    },

    setBadgeText: function(){
        stash.getAll(function(obj){
            chrome.browserAction.setBadgeText({
                text: obj.summary.groupCount + ''
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: conf.badge.color
            });
        });

    },

    optionsEvent: function(){

        st.sync.get(null, function(result){
            if(utils.isEmpty(result)){
                st.sync.set(conf);
            }
        });
    },

    contextMenuEvent: function () {
        c.contextMenus.create({
            title: utils.getMsg('extMenuTitle'),
            contexts:['all'],
            onclick: function () {
                stash.create();
            }
        });
    },

    bookmarkModifyEvent: function(){
        var bookmarkEventArr = ['onCreated', 'onRemoved','onChanged','onMoved'],
            self = this;

        bookmarkEventArr.forEach(function(event){
            c.bookmarks[event].addListener(function(){
                self.initStash();
            });
        });
    }
};

background.init();
