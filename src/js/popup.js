var stash     = require('./lib/stash');
require('./lib/directives');
var App = require('../views/components/app.vue');

var app = new Vue({
    el: '#app',
    data: {
        stashList: [],
        currentStash: {
            title: '--',
            id: -1,
            dateAddedFull: '--',
            dateAddedShort: '--',
            children: []
        },
        view: 'home'
    },
    components: {
        App
    }
});

stash.getAll(function (r) {
    app.$set('stashList', r);
});
