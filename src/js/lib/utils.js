var c = chrome;

module.exports = {

    isEmpty: function(value) {
        var type;

        if(value == null) { // 等同于 value === undefined || value === null
            return true;
        }

        type = Object.prototype.toString.call(value).slice(8, -1);

        switch(type) {
            case 'String':
                return !!$.trim(value);
            case 'Array':
                return !value.length;
            case 'Object':
                for(var v in value) {
                    return false;
                }
                return true;
            default:
                return false; // 其他对象均视作非空
            }
    },

    // 获取翻译后的字符串
    getMsg: function (msg, subSituationArray) {
        var translate = c.i18n.getMessage;
        if(!(subSituationArray && subSituationArray.length) ) {
            return translate(msg);
        }else{
            if(msg == "StashSummary"){
                return translate(msg, dataArr);
            }
        }
    },

    // 获取翻译后的字符串数组
    // msgObjArray  []
    getMsgArr: function (msgArr) {
        if(!msgArr || !msgArr.length) return;
        var self = this;
        var result = {};
        msgArr.forEach(function (msg) {
            if(!msg.subSituationArray || !msg.subSituationArray.length){
                result[msg.name] = self.getMsg(msg.name);
            }else{
                result[msg.name] = self.getMsg(msg.name, msg.subSituationArray);
            }
        });
        return result;
    },

    saveTabToBookmark: function(tab, callback){
        // todo: get parentBookmarkId
        parentBookmarkId = '';
        c.bookmarks.create({
            title: tab.title,
            index: tab.index,
            url:   tab.url,
            parentId: parentBookmarkId
        },function (result) {
            callback && callback(tab, result);
        });
    },

    saveTabListToBookmark: function(tabList, callback){
        // todo: get activeTabIndex, config
        activeTabIndex = '';
        config = {};

        c.bookmarks.create({title: tabList[activeTabIndex].title, parentId: bookmarkConfig.id}, function (result) {
            for(var i = 0; i < tabList.length; i++) {
                (function(index,length){
                    // todo: 根据options来判断保留的tab
                    if(config.preservTab ==='blank' && index === 0) {
                        c.tabs.create({active: false},null);
                    }
                    app.saveTabToBookmark(tabList[index], result.id, function(tab){
                        index===length-1 && callback && callback();

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
                })(i, tabList.length);
            }
        });
    }

};
