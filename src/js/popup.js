var stash     = require('./lib/stash');
var Vue       = require('vue');
require('./lib/directives');
var App = require('../views/components/app.vue');
var utils = require('./lib/utils');
var emptyData = {
    stashList: [],
    currentStash: {
        dateAddedFull: '--',
        dateAddedShort: '--',
        title: '--',
        children: [],
    },
    view: 'home'
};
var app = new Vue({
    el: '#app',
    data: emptyData,
    components: {
        App
    }
});

stash.getAll(function (r) {
    app.$set('stashList', r);
});

utils.afterBookmarkModify(function () {
    if(!app.currentStash){
        stash.getAll(function (r) {
            app.$set('stashList', r);
            app.currentStash = emptyData.currentStash;
            app.view = emptyData.view;
        });
    }
});
