var normalize = require('normalize.css');
var style     = require('../styles/popup.less');
var stash     = require('./lib/stash');
var tpl       = require('art-template');
var $         = require('jquery');
var html      = '';


function render(){
    stash.getAll(function(obj){
        console.log('start rendering...');
        console.log(obj);
        html = tpl('stash-template', obj);
        $('.main').html(html);
    });
}

stash.init(function(){
    render();
});

$('.js-add-stash').on('click', function () {
    stash.create(function(){
        render();
        console.log('sdfasdf');
    });
});
