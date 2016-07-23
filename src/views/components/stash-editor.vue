<template>
    <div class="title-edit-wrapper" :class="{ 'show' : active }" @click.self="hideEditor">
        <div class="editor-wrapper">
            <input class="ipt-title"
                   type="text"
                   v-model="title"
                   debounce="50"
                   @keyup.enter="hideEditor"
                   @keyup.esc="hideEditor"
                   v-focus="active"
            />
        </div>
    </div>
</template>
<script>
    require('../../js/lib/directives');
    import stash from '../../js/lib/stash';
    import directives from '../../js/lib/directives';
    export default {
        props: ['currentStashIndex'],
        computed: {
            title: {
                get(){
                    return this.currentStashIndex == -1 ? '' : this.$root.list[this.currentStashIndex].title
                },
                set(newTitle){
                    if(this.currentStashIndex == -1) return;
                    var stashItem = this.$root.list[this.currentStashIndex];
                    stash.modify(stashItem.id, newTitle, function () {
                        stashItem.title = newTitle;
                    })
                }
            },
            active: function () {
                return this.currentStashIndex != -1 ;
            }
        },
        methods: {
            hideEditor: function (e) {
                e.preventDefault();
                this.$root.currentStashIndex = -1;
            }
        }

    }
</script>
