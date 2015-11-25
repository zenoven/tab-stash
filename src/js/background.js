var c = chrome;

var u = {

    init: function  (argument) {
        this.bindEvents();
    },

    bookmarkTitle: "tab-stash",

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
            self.saveToBookmark(tabs, function () {
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

    saveToBookmark: function (tabs,callback) {
        var self = this;

        function saveTabToBookmark(tab, parentBookmarkId){
            c.bookmarks.create({
                "title": tab.title,
                "index": tab.index,
                "url":   tab.url
            });
        }

        function saveTabsToBookmark(tabs, parentBookmarkId){
            for(var i = 0; i < tabs.length; i++) {
                saveTabToBookmark(tabs[i], parentBookmarkId);
            }
        }

        function createBookmarks(currentTab){
            if(!self.bookmarkCreated){
                // 创建插件书签文件夹
                c.bookmarks.create({"title": self.bookmarkTitle}, function (parentBookmarkTreeNode) {
                    self.bookmarkCreated = true;
                    // todo: 创建子文件夹，存储当前窗口所有tab
                    c.bookmarks.create({"title": currentTab.title}, function (childBookmarkTreeNode) {
                        saveTabsToBookmark(tabs, childBookmarkTreeNode.id);
                    });
                });
                
            }else{
                c.bookmarks.search({"title": self.bookmarkTitle}, function (parentBookmarkTreeNode) {
                    // todo: 创建子文件夹，存储当前窗口所有tab
                    c.bookmarks.create({"title": currentTab.title}, function (childBookmarkTreeNode) {
                        saveTabsToBookmark(tabs, childBookmarkTreeNode.id);
                    });
                })
            }
        }

        c.tabs.getCurrent(function(currentTab){
            console.log(currentTab);
            // todo: currentTab is undefined
            // createBookmarks(currentTab);
        });

        

        console.log('saving to bookmarks...');
        callback && callback();
    }


}

u.init();