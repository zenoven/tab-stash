var c   = chrome;
var tab = require('./tab');
var st  = c.storage; // 存储
var options;

st.sync.get('options',function (rs) {
    options = rs.options;
    console.log(options);
});

st.onChanged.addListener(function(changes, areaName) {
    options = changes.newValue.options;
});

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

function saveAllTabsToBookmark(tabs, activeTabIndex, config, callback){
    
    c.bookmarks.create({title: tabs[activeTabIndex].title, parentId: bookmarkConfig.id}, function (result) {
        for(var i = 0; i < tabs.length; i++) {
            (function(index,length){
                // todo: 根据options来判断保留的tab
                if(config.preservTab ==='blank' && index === 0) {
                    c.tabs.create({active: false},null);
                }
                saveTabToBookmark(tabs[index], result.id, function(tab){
                    console.log(config)
                    if(config.preservTab ==='first' && index === 0) {
                        return;
                    }
                    if(config.preservTab ==='last' && index === length-1) {
                        return;
                    }
                    if(config.preservTab ==='fixed' && tab.pinned) {
                        return;
                    }
                    if(config.preservTab ==='all') {
                        return;
                    }
                    c.tabs.remove(tab.id);
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

    create: function(callback) {
        tab.getAll(function (tabs, i) {
            saveAllTabsToBookmark(tabs, i, options, callback);
        });
    },

    getAll: function(){

    },

    modify: function(stashId) {
        
    },

    delete: function(stashId) {

    }
    
}
