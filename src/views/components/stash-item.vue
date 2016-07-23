<template>
    <li class="item">
        <span class="count">
        <span class="inner">{{item.children.length}}</span>
    </span>
        <h3 class="title"  title="{{item.dateAddedFull}} | {{item.title}}">
            <span class="date">{{item.dateAddedShort}}</span> |
            <span class="text">{{item.title}}</span>
        </h3>
        <div class="control">
            <a href="#" title="{{ i18n.ExpandList }}" @click="expand"><i class="icon-expand"></i></a>
            <a href="#" title="{{ i18n.Modify }}" @click="modify"><i class="icon-modify"></i></a>
            <a href="#" title="{{ i18n.Delete }}" @click="delete"><i class="icon-delete"></i></a>
        </div>
    </li>
</template>
<script>
    import utils from '../../js/lib/utils'
    import stash from '../../js/lib/stash'
    export default{
        props: ['item'],
        methods: {
            expand(){

            },
            modify(){
                var self = this;
                var vm = self.$root;
                var list = vm.list;
                var currentItem = this.item;
                vm.currentStashIndex = list.indexOf(currentItem);
                vm.$set('currentStashIndex',list.indexOf(currentItem) );
                console.log(vm.currentStashIndex);
            },
            delete(){
                var self = this;
                var vm = self.$root;
                stash.delete(self.item.id, function () {
                    vm.$get('list').forEach(function (item, i) {
                        if(item.id === self.item.id) {
                            vm.list.$remove(vm.list[i]);
                        }
                    });
                });
            }
        },
        computed: {
            i18n: function () {
                return utils.getMsgArr([
                    {name: 'ExpandList'},
                    {name: 'Modify'},
                    {name: 'Delete'}
                ])
            }
        }
    }
</script>
