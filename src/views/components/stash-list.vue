<template v-if="stashList && stashList.length > 0">
    <ul class="stash-list" >
        <template v-for="stash in stashList"  class="item">
            <stash-item :item="stash"></stash-item>
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
