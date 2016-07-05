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
        var c = chrome;
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
    }

};
