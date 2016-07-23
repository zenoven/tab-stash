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
            <a href="#" class="js-expand" title="{{ i18n.ExpandList }}"><i class="icon-expand" @click="expand"></i></a>
            <a href="#" class="js-modify" title="{{ i18n.Modify }}"><i class="icon-modify" @click="modify"></i></a>
            <a href="#" class="js-delete" title="{{ i18n.Delete }}"><i class="icon-delete" @click="delete"></i></a>
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

            },
            delete(){
                var self = this;
                console.log(self);
                self.$dispatch('delete-stash', this.item.id);
//                stash.delete(this.item.id, function () {
//                    stash.getAll(function (r) {
//                        self.$root.$set('main', r);
//                    })
//                });
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
