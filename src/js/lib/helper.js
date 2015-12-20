var tpl    = require('art-template');
var c      = chrome;
var getMsg = c.i18n.getMessage;

function initHelper(){
    tpl.helper('translte', function (text, dataArr) {
        if(!dataArr.length) {
            return getMsg(text);
        }else{
            if(text == "StashSummary"){
                return getMsg(text, dataArr);
            }
        }
    });
}

module.exports = {
    init: initHelper
}