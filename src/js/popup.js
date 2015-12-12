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
        this.onChromeEvent();
    },

    onStash: function(){
        var self = this;
        $('.js-add-stash').on('click', function () {
            stash.create(function(){
                self.render();
            });
        });
    },

    onChromeEvent: function(){
        var self = this;

        function rerender(){
            stash.init(function(){
                self.render();
            });
        }

        c.bookmarks.onRemoved.addListener(function () {
            rerender();
        });

        c.bookmarks.onChanged.addListener(function () {
            rerender();
        });

        c.bookmarks.onMoved.addListener(function () {
            rerender();
        });
        
        c.contextMenus.onClicked.addListener(function (){
            rerender();
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
