var c = chrome;
var st = c.storage;
var dateFormat = require('dateformat');
module.exports = {
    debug: function (flag,onFunction,offFunction) {
        if(flag){
            onFunction && onFunction();
        } else{
            offFunction && offFunction();
        }
    },
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

        st.sync.get(null, function(syncOptions){
            console.log('syncOptions');
            console.log(syncOptions);
            st.local.get(null, function (localOptions) {
                c.bookmarks.create({title: tabList[activeTabIndex].title, parentId: localOptions.bookmarkId}, function (result) {
                    for(var i = 0; i < tabList.length; i++) {
                        (function(index,length){
                            // todo: 根据options来判断保留的tab
                            console.log(syncOptions.preserveTab);
                            console.log(index);
                            if(syncOptions.preserveTab ==='blank' && index === 0) {
                                console.log('should create tab');
                                c.tabs.create({active: false},null);
                            }
                            self.saveTabToBookmark(tabList[index], result.id, function(tab){
                                index===length-1 && callback && callback();

                                if(syncOptions.preserveTab ==='first' && index === 0) {
                                    return;
                                }
                                if(syncOptions.preserveTab ==='last' && index === length-1) {
                                    return;
                                }
                                if(syncOptions.preserveTab ==='fixed' && tab.pinned) {
                                    return;
                                }
                                if(syncOptions.preserveTab ==='all') {
                                    return;
                                }

                                c.tabs.remove(tab.id);

                            });
                        })(i, tabList.length);
                    }
                });
            });
        });
    },

    convertBookmarkToStash: function (bookmark) {
        var list = [];

        if(!bookmark[0].children) return list;

        bookmark[0].children.map(function(item){
            list.push({
                title: item.title,
                id: item.id,
                dateAddedFull: dateFormat(item.dateAdded, 'yyyy-mm-dd hh:mm:ss'),
                dateAddedShort: dateFormat(item.dateAdded, 'mm-dd'),
                children: item.children
            });
        });

        return list;
    },
    afterBookmarkModify: function (callback) {
        var bookmarkEventArr = ['onCreated', 'onRemoved','onChanged','onMoved'];

        bookmarkEventArr.forEach(function(event){
            c.bookmarks[event].addListener(function(){
                callback && callback();
            });
        });
    }
};
