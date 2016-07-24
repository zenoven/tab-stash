<template v-if="stashList && stashList.length > 0">
    <ul class="stash-list" >
        <template v-for="stashItem in stashList"  class="item">
            <stash-item :stash-item="stashItem"></stash-item>
        </template>
    </ul>
</template>

<script>
    import StashItem from './stash-item.vue'
    export default{
        components: {
            StashItem
        },
        props: ['stashList']
    }
</script>
