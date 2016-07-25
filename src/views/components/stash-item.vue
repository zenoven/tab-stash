<template>
    <li class="item">
        <span class="count">
            <span class="inner">{{stashItem.children.length}}</span>
        </span>
        <h3 class="title"  title="{{stashItem.dateAddedFull}} | {{stashItem.title}}" @click="open">
            <span class="date">{{stashItem.dateAddedShort}}</span> |
            <span class="text">{{stashItem.title}}</span>
        </h3>
        <div class="control">
            <a href="#" title="{{ i18n.ExpandList }}" @click="expand"><i class="icon-expand"></i></a>
            <a href="#" title="{{ i18n.Modify }}" @click="modify"><i class="icon-modify"></i></a>
            <a href="#" title="{{ i18n.Delete }}" @click="delete"><i class="icon-delete"></i></a>
        </div>
    </li>
</template>
<script>
    var c = chrome;
    import utils from '../../js/lib/utils'
    import stash from '../../js/lib/stash'
    export default{
        props: ['stashItem'],
        computed: {
            i18n: function () {
                return utils.getMsgArr([
                    {name: 'ExpandList'},
                    {name: 'Modify'},
                    {name: 'Delete'}
                ])
            }
        },
        events: {
            delete(stashId){
                if(stashId == this.stashItem.id){
                    this.delete();
                }
            }
        },
        methods: {
            open(){
                var tabList = this.stashItem.children;
                tabList.forEach(function (tab) {
                    c.tabs.create({url: tab.url})
                });
            },
            expand(){
                var self = this;
                var vm = self.$root;
                vm.currentStash = this.stashItem;
                vm.view = 'detail';
            },
            modify(){
                var self = this;
                var vm = self.$root;
                vm.currentStash = this.stashItem;
                vm.view = 'editor';
            },
            delete(){
                var self = this;
                var vm = self.$root;
                stash.delete(self.stashItem.id, function () {
                    vm.$get('stashList').forEach(function (stashItem, i) {
                        if(stashItem.id === self.stashItem.id) {
                            vm.stashList.$remove(vm.stashList[i]);
                        }
                    });
                });
            }
        }
    }
</script>
