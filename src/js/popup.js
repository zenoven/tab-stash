var normalize = require('normalize.css');
var style     = require('../styles/popup.less');
var stash     = require('./lib/stash');
var tpl       = require('art-template');
var $         = require('jquery');
var html      = '';
var c         = chrome;


var popup = {

    init: function(){
        var self = this;
        stash.init(function(){
            self.render();
        });
        self.bindEvents();
    },

    bindEvents: function(){
        this.onStash();
        this.bookmarkModifyEvent();
    },

    onStash: function(){
        var self = this;
        $('.js-add-stash').on('click', function () {
            stash.create(function(){
                self.render();
            });
        });
    },

    bookmarkModifyEvent: function(){
        var self = this;
        c.bookmarks.onRemoved.addListener(function () {
            stash.init(function(){
                self.render();
            });
        });
        c.bookmarks.onChanged.addListener(function () {
            stash.init(function(){
                self.render();
            });
        });
        c.bookmarks.onMoved.addListener(function () {
            stash.init(function(){
                self.render();
            });
        });
    },

    render: function(){
        stash.getAll(function(obj){
            html = tpl('stash-template', obj);
            $('.main').html(html);
        });
    }
}

popup.init();
