var c      = chrome;
var st     = c.storage; // 存储
var tab    = require('./tab');
var utils  = require('./utils');

module.exports = {

    create: function(callback) {
        tab.getAll(function (tabs, i) {
            utils.saveTabListToBookmark(tabs, i, callback);
        });
    },

    getAll: function(callback){
        st.local.get('bookmarkId', function(result){
            c.bookmarks.getSubTree(result.bookmarkId, function(bookmark) {
                callback && callback(utils.convertBookmarkToStash(bookmark));
            });
        });

    },

    modify: function(stashId, title, callback) {
        // stashId需为String
        stashId = stashId + '';
        c.bookmarks.update(stashId, {title: title}, function(nodes){
            callback && callback(nodes);
        });
    },

    delete: function(stashId, callback) {
        stashId = stashId + '';
        chrome.bookmarks.removeTree(stashId, function(){
            callback && callback();
        });
    }

};
