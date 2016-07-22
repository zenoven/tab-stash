<template>
    <header>
        <stash-button></stash-button>
    </header>
    <main>
        <stash-summary :summary="main.summary"></stash-summary>
        <!--<stash-list></stash-list>-->
    </main>

</template>
<script>
    import stash from '../../js/lib/stash'
    import StashButton from './stash-button.vue'
    import StashSummary from './stash-summary.vue'
//    import StashList from './stash-list.vue'

    export default{
        components:{
            StashButton,
            StashSummary,
//            StashList
        },
        props: ['main']
    }
</script>
