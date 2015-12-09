var normalize = require('normalize.css');
var style     = require('../styles/popup.less');
var stash     = require('./lib/stash');

stash.init();

$('.js-add-stash').on('click', function () {
    stash.create(function (argument) {
        // body...
    });
});

console.log($('.js-add-stash').html());