<template>
    <header>
        <stash-button></stash-button>
    </header>
    <main>
        <stash-summary :list="list"></stash-summary>
        <stash-list :list="list"></stash-list>
    </main>
    <stash-editor :current-stash-index="currentStashIndex"></stash-editor>

</template>
<script>
    import stash from '../../js/lib/stash'
    import StashButton from './stash-button.vue'
    import StashSummary from './stash-summary.vue'
    import StashList from './stash-list.vue'
    import StashEditor from './stash-editor.vue'

    export default{
        components:{
            StashButton,
            StashSummary,
            StashList,
            StashEditor
        },
        props: ['list', 'currentStashIndex']
    }
</script>
