<template>
    <div class="tab-list-wrapper" :class="{ 'show' : active }" @click.self="hideDetail">
        <tab-summary :tab-summary="tabSummary"></tab-summary>
        <tab-list :current-stash="currentStash"></tab-list>
    </div>
</template>
<script>
    import utils from '../../js/lib/utils'
    import stash from '../../js/lib/stash';
    import TabSummary from './tab-summary.vue';
    import TabList from './tab-list.vue';
    export default {
        props: ['currentStash', 'view'],
        computed: {
            active() {
                return this.view == 'detail';
            },
            tabSummary(){
                return {
                    title: this.currentStash.title,
                    dateAddedFull: this.currentStash.dateAddedFull,
                    dateAddedShort: this.currentStash.dateAddedShort,
                }
            }
        },
        methods: {
            hideDetail(){
                this.$root.view = 'home';
            }
        },
        components: {
            TabSummary,
            TabList
        }
    }
</script>
