var c = chrome;
var st = c.storage;
var dateFormat = require('dateformat');
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
                return translate(msg, subSituationArray);
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

    saveTabToBookmark: function(tab, parentBookmarkId, callback){
        st.sync.get('bookmark', function(result){
            c.bookmarks.create({
                title: tab.title,
                index: tab.index,
                url:   tab.url,
                parentId: parentBookmarkId
            },function (result) {
                callback && callback(tab, result);
            });
        });

    },

    saveTabListToBookmark: function(tabList, activeTabIndex, callback){
        var self = this;

        st.sync.get(null, function(options){
            console.log('options');
            console.log(options);
            c.bookmarks.create({title: tabList[activeTabIndex].title, parentId: options.bookmark.id}, function (result) {
                for(var i = 0; i < tabList.length; i++) {
                    (function(index,length){
                        // todo: 根据options来判断保留的tab
                        console.log(options.preserveTab);
                        console.log(index);
                        if(options.preserveTab ==='blank' && index === 0) {
                            console.log('should create tab');
                            c.tabs.create({active: false},null);
                        }
                        self.saveTabToBookmark(tabList[index], result.id, function(tab){
                            index===length-1 && callback && callback();

                            if(options.preserveTab ==='first' && index === 0) {
                                return;
                            }
                            if(options.preserveTab ==='last' && index === length-1) {
                                return;
                            }
                            if(options.preserveTab ==='fixed' && tab.pinned) {
                                return;
                            }
                            if(options.preserveTab ==='all') {
                                return;
                            }

                            c.tabs.remove(tab.id);

                        });
                    })(i, tabList.length);
                }
            });
        });
    },

    convertBookmarkToStash: function (bookmark) {
        var stash = {
            summary: {
                groupCount: bookmark[0].children ? bookmark[0].children.length : 0,
                itemsCount: 0
            },
            list: []
        };

        if(!bookmark[0].children) return stash;

        bookmark[0].children.map(function(item){
            stash.summary.itemsCount += item.children && item.children.length ? item.children.length : 0;
            stash.list.push({
                title: item.title,
                id: item.id,
                dateAdded: item.dateAdded,
                dateAddedFull: dateFormat(item.dateAdded, 'yyyy-mm-dd hh:mm:ss'),
                dateAddedShort: dateFormat(item.dateAdded, 'mm-dd'),
                children: item.children
            });
        });

        return stash;
    }
};
