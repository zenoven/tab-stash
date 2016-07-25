<template>
    <ul class="tab-list">
        <tab-item v-for="tabItem in currentStash.children" :tab-item="tabItem" :current-stash-id="currentStash.id"></tab-item>
    </ul>
</template>
<script>
    import TabItem from './tab-item.vue'
    export default{
        props: ['currentStash'],
        components:{
            TabItem
        }
    }
</script>
