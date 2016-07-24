var stash     = require('./lib/stash');
var Vue       = require('vue');
require('./lib/directives');
var App = require('../views/components/app.vue');
var utils = require('./lib/utils');
var app = new Vue({
    el: '#app',
    data: {
        stashList: [],
        currentStash: null
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
        });
    }
});



//
// var app = {
//
//     init: function(){
//         var self = this;
//         stash.init(function(){
//             self.render();
//         });
//         self.bindEvents();
//     },
//
//     bindEvents: function(){
//         this.bindStashEvents();
//         this.bindKeyboardEvents();
//     },
//
//     bindStashEvents: function(){
//         var self        = this;
//         var listWrapper = $('#wrapper');
//
//
//         listWrapper.on('click',function(event){
//             var tgt = $(event.target);
//
//             if(!tgt.hasClass('link')){
//                 event.preventDefault();
//             }else{
//                 c.tabs.create({url: tgt[0].href})
//             }
//
//             // 如果点击的是stash项
//             if(tgt.closest('.item').length > 0){
//                 var item = tgt.closest('.item');
//                 var linkWrapper = item.find('.tab-list');
//                 var linkList = item.find('.tab-list a.link');
//                 var tabList;
//                 if( !tgt.closest('.control, .tab-list-wrapper, .title-edit-wrapper').length) {
//                     linkList.each(function(i, link){
//                         c.tabs.create({url: link.href})
//                     });
//                 }else{
//                     // 点击展开
//                     if(tgt.closest('.js-expand').length) {
//                         item.toggleClass('expanded');
//                         return;
//                     }
//
//                     // 点击编辑
//                     if(tgt.closest('.js-modify').length) {
//                         $('.title-edit-wrapper').removeClass('show');
//                         item.find('.title-edit-wrapper').addClass('show').find('.ipt-title').select();
//                         $('.ipt-title', item).val(item.find('.title .text').html());
//                         return;
//                     }
//
//                     // 点击删除stash
//                     if(tgt.closest('.js-delete').length) {
//                         stash.delete(item.data('id'), function(){
//                             self.reRender();
//                         })
//                         return;
//                     }
//
//                     // 点击tab-list的关闭
//                     if(tgt.closest('.js-close').length){
//                         console.log('closing...')
//                         $('.stash-list > .item').removeClass('expanded') ;
//                         doRefresh && self.reRender();
//                         doRefresh = false;
//                         return;
//                     }
//
//                     // 如果点击的是编辑框之外的mask
//                     if(tgt.closest('.title-edit-wrapper').length && !tgt.closest('.editor-wrapper').length) {
//                         $('.title-edit-wrapper').removeClass('show');
//                         return;
//                     }
//
//                     // 点击删除tab
//                     if(tgt.closest('.js-delete-tab').length) {
//                         // debugger;
//                         tabListWrapper = $('.item.expanded .tab-list-wrapper');
//                         c.bookmarks.remove(tgt.closest('.tab').data('id') + '');
//                         tgt.closest('.tab').remove();
//                         tabList = $('.item.expanded .tab-list li');
//
//                         // 如果已经删除完了
//                         if( tabList.length == 0) {
//                             tabListWrapper.find('.js-close').trigger('click');
//                             tabListWrapper.closest('.item').find('.js-delete').trigger('click');
//                         }
//                         doRefresh = true;
//                         return;
//                     }
//                 }
//             }else {
//                 // 如果点击的是暂存按钮
//                 if(tgt.closest('.js-add-stash').length){
//                     stash.create(function(){
//                         self.render();
//                     });
//                 }
//             }
//
//         });
//     },
//
//     bindKeyboardEvents: function(){
//         var inputWrapper,
//             input,
//             self = this;
//
//         $(document).on('keyup', function(e){
//             inputWrapper = $('.title-edit-wrapper.show');
//             input = inputWrapper.find('.ipt-title');
//
//             // 回车时提交编辑
//             if(e.keyCode === 13) {
//                 stash.modify(inputWrapper.closest('.item').data('id'), input.val(), function(){
//                     inputWrapper.removeClass('show');
//                     self.reRender();
//                 })
//                 return;
//             }
//
//             // ESC时取消编辑
//             if(e.keyCode === 27) {
//                 $('.title-edit-wrapper').removeClass('show');
//                 return;
//             }
//         });
//     },
//
//     render: function(){
//         stash.getAll(function(obj){
//             html.title = tpl('title', {});
//             html.main = tpl('main', obj);
//             $('title').html(html.title);
//             $('#wrapper').html(html.main);
//         });
//     },
//
//     // 重新渲染
//     reRender: function (){
//         var self = this;
//         stash.init(function(){
//             self.render();
//         });
//     }
// };
//
// app.init();
