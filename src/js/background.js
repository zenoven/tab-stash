var c     = chrome;
var tab   = require('./lib/tab');
var stash = require('./lib/stash');
var utils = require('./lib/utils');
var st    = c.storage;
var conf  = require('../config.js');
var bookmarkConfig = conf.bookmark;

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

    initStash: function(callback){
        var self = this;
        // 如果没有创建书签文件夹，先创建一个
        c.bookmarks.search({title: bookmarkConfig.title}, function (bookmark) {
            if(bookmark.length ===0){
                c.bookmarks.create({title: bookmarkConfig.title}, function(result){
                    bookmarkConfig.id = result.id;
                    if(result.children && result.children.length) {
                        bookmarkConfig.children = result.children;
                    }
                    callback && callback();
                });
            }else{
                bookmark = bookmark[0];
                bookmarkConfig.id = bookmark.id;
                if(bookmark.children && bookmark.children.length) {
                    bookmarkConfig.children = bookmark.children;
                }
                callback && callback();
            }
        });
        stash.getAll(function(obj){
            self.setBadgeText(obj.summary.groupCount);
        });
    },

    setBadgeText: function(number){
        chrome.browserAction.setBadgeText({
            text: number + ''
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#398DE3'
        });
    },

    initOptions: function(){

        st.sync.get('options', function(result){
            if(utils.isEmpty(result)){
                st.sync.set({
                    options: conf.options
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
            title: utils.getMsg('extMenuTitle'),
            contexts:['all'],
            onclick: function (argument) {
                stash.create();
            }
        });
    },

    bookmarkModifyEvent: function(){
        var bookmarkEventArr = ['onCreated', 'onRemoved','onChanged','onMoved'],
            self = this;

        bookmarkEventArr.forEach(function(event, i){
            c.bookmarks[event].addListener(function(){
                self.initStash();
            });
        });
    }
};

background.init();
