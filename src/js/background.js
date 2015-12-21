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
        var self = this;
        stash.init(function(){
            stash.getAll(function(obj){
                console.log(obj.summary.groupCount)
                self.setBadge(obj.summary.groupCount);
            });
        });
    },

    setBadge: function(number){
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
        var bookmarkEventArr = ['onCreated', 'onRemoved','onChanged','onMoved'],
            self = this;
        
        bookmarkEventArr.forEach(function(event, i){
            c.bookmarks[event].addListener(function(){
                self.initStash();
            });
        });
    }
}

background.init();