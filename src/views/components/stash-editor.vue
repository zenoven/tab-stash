<template>
    <div class="title-edit-wrapper" :class="{ 'show' : active }">
        <div class="editor-wrapper">
            <input class="ipt-title" type="text" v-model="title" />
        </div>
    </div>
</template>
<script>
    export default {
        props: ['currentStashIndex'],
        computed: {
            title: function () {
                return this.currentStashIndex == -1 ? '' : this.$root.list[this.currentStashIndex].title
            },
            active: function () {
                return this.currentStashIndex != -1 ;
            }
        }

    }
</script>
