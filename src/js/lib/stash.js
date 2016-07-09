var c      = chrome;
var st     = c.storage; // 存储
var tab    = require('./tab');
var utils  = require('./utils');

module.exports = {

    create: function(callback) {
        tab.getAll(function (tabs, i) {
            app.saveAllTabsToBookmark(tabs, i, options, callback);
        });
    },

    getAll: function(callback){
        var self = this;
        c.bookmarks.getSubTree(bookmarkConfig.id, function(bookmark) {
            callback && callback(utils.convertBookmarkToStash(bookmark));
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
