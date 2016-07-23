<template>
    <div class="title-edit-wrapper" :class="{ 'show' : active }" @click.self="hideEditor">
        <div class="editor-wrapper">
            <input class="ipt-title" type="text" v-model="title" @keyup.enter="hideEditor" />
        </div>
    </div>
</template>
<script>
    import stash from '../../js/lib/stash';
    export default {
        props: ['currentStashIndex'],
        computed: {
            title: {
                get(){
                    return this.currentStashIndex == -1 ? '' : this.$root.list[this.currentStashIndex].title
                },
                set(newVal){
                    if(this.currentStashIndex == -1) return;
                    var stashItem = this.$root.list[this.currentStashIndex];
                    stash.modify(stashItem.id, newVal, function () {
                        stashItem.title = newVal;
                    })
                }
            },
            active: function () {
                return this.currentStashIndex != -1 ;
            }
        },
        methods: {
            hideEditor: function () {
                this.$root.currentStashIndex = -1;
            }
        }

    }
</script>
