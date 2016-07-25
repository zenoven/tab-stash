<template>
    <h4 class="tab-list-title"  title="{{tabSummary.dateAddedFull}} | {{tabSummary.title}}">
        <span class="date">{{tabSummary.dateAddedShort}}</span> |
        <span class="text">{{tabSummary.title}}</span>
        <i class="icon-close" title="{{ i18n.Close }}" @click.self="hideDetail"></i>
    </h4>
</template>

<script>
    import utils from '../../js/lib/utils'
    export default{
        props: ['tabSummary'],
        computed: {
            i18n() {
                return utils.getMsgArr([
                    {name: 'Close'},
                    {name: 'Open'},
                    {name: 'Delete'}
                ])
            }
        },
        methods: {
            hideDetail(){
                this.$root.view = 'home';
            }
        }
    }
</script>
