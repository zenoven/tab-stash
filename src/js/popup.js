var stash     = require('./lib/stash');
var Vue       = require('vue');
require('./lib/directives');
var App = require('../views/components/app.vue');
var utils = require('./lib/utils');
var app = new Vue({
    el: '#app',
    data: {
        stashList: [],
        currentStash: null,
        view: 'home'
    },
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
            app.currentStash = null;
            app.view = 'home';
        });
    }
});
