var c = chrome;

function getAll(callback) {
    c.windows.getCurrent(function (win) {
        c.tabs.query( {'windowId': win.id}, function (tabs) {
            for(var i = 0, len = tabs.length; i < len; i++) {
                if(tabs[i].active) break;
            }
            callback && callback(tabs, i);
        });
    });
}

function close(tabId, callback){
    c.tabs.remove(tabId, callback);
}

module.exports = {
    getAll: getAll,
    close: close
};