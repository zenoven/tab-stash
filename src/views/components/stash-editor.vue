<template>
    <div class="title-edit-wrapper" :class="{ 'show' : active }" @click.self="hideEditor">
        <div class="editor-wrapper">
            <input class="ipt-title"
                type="text"
                v-model="title"
                @keyup.enter="hideEditor"
                @keyup.esc="hideEditor"
                v-focus="active"
            />
        </div>
    </div>
</template>
<script>

    import stash from '../../js/lib/stash';
    import directives from '../../js/lib/directives';
    export default {
        props: ['currentStash'],
        computed: {
            title: {
                get(){
                    return this.currentStash ? this.currentStash.title : '';
                },
                set(newTitle){
                    if(!this.currentStash) return '';
                    var stashItem = this.$root.currentStash;
                    stash.modify(this.currentStash.id, newTitle, function () {
                        stashItem.title = newTitle;
                    })
                }
            },
            active: function () {
                return !!this.currentStash;
            }
        },
        methods: {
            hideEditor: function (e) {
                e.preventDefault();
                this.$root.currentStash = null;
            }
        }

    }
</script>
