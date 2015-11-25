var c = chrome;

var u = {

    init: function  (argument) {
        this.bindEvents();
    },

    bindEvents: function () {
        this.iconEvent();
        this.contextMenuEvent();
    },

    iconEvent: function(){
        var self = this;
        c.browserAction.onClicked.addListener(function (argument) {
            self.stash();
        });
    },

    contextMenuEvent: function () {
        var self = this;
        c.contextMenus.create({
            title:chrome.i18n.getMessage("extMenuTitle"),
            contexts:['all'],
            onclick: function (argument) {
                self.stash();
            }
        });
    },

    stash: function(argument) {
        var self = this;
        this.getAllTabs(function (tabs) {
            console.log(tabs);
            self.saveToBookmark(function () {
                self.close();
            });
        });
    },

    close: function(tabId, callback){
        console.log('closing...');
        // c.tabs.remove(tabId, callback);
    },

    getAllTabs: function (callback) {
        c.windows.getCurrent(function (win) {
            c.tabs.query( {'windowId': win.id}, function (tabs) {
                callback && callback(tabs);
            });
        });
    },

    saveToBookmark: function (callback) {
        // todo: save
        console.log('saving to bookmarks...');
        callback && callback();
    }


}

u.init();