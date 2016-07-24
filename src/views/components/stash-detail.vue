<template>
    <div class="tab-list-wrapper" :class="{ 'show' : active }" @click.self="hideDetail">
        <h4 class="tab-list-title"  title="{{currentStash.dateAddedFull}} | {{currentStash.title}}">
            <span class="date">{{currentStash.dateAddedShort}}</span> |
            <span class="text">{{currentStash.title}}</span>
            <i class="icon-close" title="{{ i18n.Close }}" @click.self="hideDetail"></i>
        </h4>
        <ul class="tab-list">
            <li class="tab" v-for="tab in currentStash.children" data-id="{{tab.id}}">
                <a class="link" href="{{tab.url}}" title="{{ i18n.Open }}>>{{tab.title}}">{{tab.title}}</a>
                <a href="#" class="delete" title="{{ i18n.Delete }}"><i class="icon-delete"></i></a>
            </li>
        </ul>
    </div>
</template>
<script>
    import utils from '../../js/lib/utils'
    import stash from '../../js/lib/stash';
    export default {
        props: ['currentStash', 'view'],
        computed: {
            i18n() {
                return utils.getMsgArr([
                    {name: 'Close'},
                    {name: 'Open'},
                    {name: 'Delete'}
                ])
            },
            active() {
                return this.view == 'detail';
            }
        },
        methods: {
            hideDetail(){
                this.$root.view = 'home';
            }
        }
    }
</script>
