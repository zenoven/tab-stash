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
            
            if(!tgt.hasClass('link')){
                event.preventDefault();
            }else{
                c.tabs.create({url: tgt[0].href})
            }

            // 如果点击的是stash项
            if(tgt.closest('.item').length > 0){
                var item = tgt.closest('.item');
                var linkWrapper = item.find('.tab-list');
                var linkList = item.find('.tab-list a');
                if( !tgt.closest('.control, .tab-list-wrapper').length) {
                    linkList.each(function(i, link){
                        console.log(link)
                        console.log($(link))
                        c.tabs.create({url: link.href})
                    });
                }else{
                    // 点击展开
                    if(tgt.closest('.expand').length) {
                        item.toggleClass('expanded');
                    }

                    if(tgt.closest('.icon-close').length){
                        $('.stash-list > .item').removeClass('expanded') ;
                    }
                }
            }

        });
    },

    bindChromeEvents: function(){
        var self = this;
        var bookmarkEventArr = ['onRemoved','onChanged','onMoved'];

        function reRender(){
            stash.init(function(){
                self.render();
            });
        }

        bookmarkEventArr.forEach(function(event, i){
            c.bookmarks[event].addListener(function(){
                reRender();
            });
        });

        c.contextMenus.onClicked.addListener(function (){
            reRender();
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
