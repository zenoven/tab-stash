var c   = chrome;
var tab = require('./tab');

// stash使用的书签文件夹对象，用于存储数据
var bookmarkConfig = {
    id: null,
    title:  "tab-stash",
    children: null
};

function saveTabToBookmark(tab, parentBookmarkId, callback){
    c.bookmarks.create({
        title: tab.title,
        index: tab.index,
        url:   tab.url,
        parentId: parentBookmarkId
    },function (result) {
        callback && callback(tab, result);
    });
}

function saveAllTabsToBookmark(tabs, activeTabIndex){
    c.bookmarks.create({title: tabs[activeTabIndex].title, parentId: bookmarkConfig.id}, function (result) {
        for(var i = 0; i < tabs.length; i++) {
            (function(index,length){
                saveTabToBookmark(tabs[i], result.id, function(tab){
                    // self.closeTab(tab.id);
                });
            })(i, tabs.length);
        }
    });
}

module.exports = {

    init: function(){
        // 如果没有创建书签文件夹，先创建一个
        c.bookmarks.search({title: bookmarkConfig.title}, function (bookmark) {
            if(bookmark.length ===0){
                c.bookmarks.create({title: bookmarkConfig.title}, function(result){
                    bookmarkConfig.id = result.id;
                    if(result.children && result.children.length) {
                        bookmarkConfig.children = result.children;
                    }
                });
            }else{
                bookmark = bookmark[0];
                bookmarkConfig.id = bookmark.id;
                if(bookmark.children && bookmark.children.length) {
                    bookmarkConfig.children = bookmark.children;
                }
            }
        })
    },

    create: function(options) {
        tab.getAll(function (tabs, i) {
            saveAllTabsToBookmark(tabs, i);
        });
    },

    getAll: function(){

    },

    modify: function(stashId) {
        
    },

    delete: function(stashId) {

    }
    
}
