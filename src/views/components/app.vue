<template>
    <header>
        <stash-button></stash-button>
    </header>
    <main>
        <stash-summary :stash-list="stashList"></stash-summary>
        <stash-list :stash-list="stashList"></stash-list>
    </main>
    <stash-editor :current-stash="currentStash" :view="view"></stash-editor>

</template>
<script>
    import stash from '../../js/lib/stash'
    import StashButton from './stash-button.vue'
    import StashSummary from './stash-summary.vue'
    import StashList from './stash-list.vue'
    import StashEditor from './stash-editor.vue'
    import StashDetail from './stash-detail.vue'

    export default{
        components:{
            StashButton,
            StashSummary,
            StashList,
            StashEditor,
            StashDetail
        },
        props: ['stashList', 'currentStash', 'view']
    }
</script>
