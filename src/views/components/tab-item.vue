<template>
    <li class="tab" >
        <a class="link" href="{{tabItem.url}}" title="{{ i18n.Open }}>>{{tabItem.title}}">{{tabItem.title}}</a>
        <a href="#" class="delete" title="{{ i18n.Delete }}">
            <i class="icon-delete" @click.prevent="delete"></i>
        </a>
    </li>
</template>
<script>
    import utils from '../../js/lib/utils'
    var c = chrome;
    export default{
        props: ['tabItem','currentStashId'],
        computed: {
            i18n() {
                return utils.getMsgArr([
                    {name: 'Close'},
                    {name: 'Delete'}
                ])
            }
        },
        methods: {
            delete(){
                var self = this;
                var vm = self.$root;
                c.bookmarks.remove(this.tabItem.id + '', function () {
                    vm.currentStash.children.forEach(function (tabItem) {
                        if(tabItem.id === self.tabItem.id) {
                            vm.currentStash.children.$remove(tabItem);
                            if(vm.currentStash.children.length === 0){
                                vm.view = 'home';
                                vm.$broadcast('delete');
                                console.log('sending broadcast...');
                            }
                        }
                    });
                });
            }
        }
    }
</script>
