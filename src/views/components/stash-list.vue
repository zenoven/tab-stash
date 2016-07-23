<template v-if="list && list.length > 0">
    <ul class="stash-list" >
        <template v-for="item in list"  class="item">
            <stash-item :item="item"></stash-item>
        </template>
    </ul>
</template>

<script>
    import StashItem from './stash-item.vue'
    export default{
        components: {
            StashItem
        },
        props: ['list']
    }
</script>
