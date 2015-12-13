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
        this.bindStashEvents();
        this.bindChromeEvents();
    },

    bindStashEvents: function(){
        var self        = this;
        var addBtn      = $('.js-add-stash');
        var listWrapper = $('.main');

        addBtn.on('click', function () {
            stash.create(function(){
                self.render();
            });
        });

        listWrapper.on('click',function(event){
            var tgt = $(event.target);

            // 如果点击的是stash项，根据设置打开该stash下的所有tab
            if(true){

            }

            // 如果点击的是stash项，根据设置打开该stash下的所有tab
            if(true){

            }
        });
    },

    bindChromeEvents: function(){
        var self = this;
        var bookmarkEventArr = ['onRemoved','onChanged','onMoved'];

        function rerender(){
            stash.init(function(){
                self.render();
            });
        }

        bookmarkEventArr.forEach(function(event, i){
            c.bookmarks[event].addListener(function(){
                rerender();
            });
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
