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
        this.bindKeyboardEvents();
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
                if( !tgt.closest('.control, .tab-list-wrapper, .title-edit-wrapper').length) {
                    linkList.each(function(i, link){
                        console.log(link)
                        console.log($(link))
                        c.tabs.create({url: link.href})
                    });
                }else{
                    // 点击展开
                    if(tgt.closest('.js-expand').length) {
                        item.toggleClass('expanded');
                        return;
                    }

                    // 点击编辑
                    if(tgt.closest('.js-modify').length) {
                        $('.title-edit-wrapper').removeClass('show');
                        item.find('.title-edit-wrapper').addClass('show').find('.ipt-title').select();
                        $('.ipt-title', item).val(item.find('.title .text').html());
                        return;
                    }

                    // 点击删除
                    if(tgt.closest('.js-delete').length) {
                        stash.delete(item.data('id'), function(){
                            self.reRender();
                        })
                        return;
                    }

                    // 点击tab-list的关闭
                    if(tgt.closest('.icon-close').length){
                        $('.stash-list > .item').removeClass('expanded') ;
                        return;
                    }

                    // 如果点击的是编辑框之外的mask
                    if(tgt.closest('.title-edit-wrapper').length && !tgt.closest('.editor-wrapper').length) {
                        $('.title-edit-wrapper').removeClass('show');
                    }
                }
            }

        });
    },

    bindChromeEvents: function(){
        var self = this;
        var bookmarkEventArr = ['onRemoved','onChanged','onMoved'];

        bookmarkEventArr.forEach(function(event, i){
            c.bookmarks[event].addListener(function(){
                self.reRender();
            });
        });

        c.contextMenus.onClicked.addListener(function (){
            self.reRender();
        });
    },

    bindKeyboardEvents: function(){
        var inputWrapper,
            input,
            self = this;

        $(document).on('keyup', function(e){
            inputWrapper = $('.title-edit-wrapper.show');
            input = inputWrapper.find('.ipt-title');

            // 回车时提交编辑
            if(e.keyCode === 13) {
                stash.modify(inputWrapper.closest('.item').data('id'), input.val(), function(){
                    inputWrapper.removeClass('show');
                    self.reRender();
                })
                return;
            }

            // ESC时取消编辑
            if(e.keyCode === 27) {
                $('.title-edit-wrapper').removeClass('show');
                return;
            }
        });
    },

    render: function(){
        stash.getAll(function(obj){
            html = tpl('stash-template', obj);
            $('.main').html(html);
        });
    },

    // 重新渲染
    reRender: function (){
        var self = this;
        stash.init(function(){
            self.render();
        });
    }
}

popup.init();
