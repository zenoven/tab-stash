var utils = require('./lib/utils');
var title = new Vue({
    el: 'title',
    data: {
        i18n: utils.getMsgArr([{
            name: 'Options'
        }])
    }
});

// var app = new Vue({
//     el: '#app'
// });
