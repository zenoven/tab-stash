<template>
    <div class="stash-editor-wrapper" :class="{ 'show' : active }" @click.self="hideEditor">
        <div class="inner">
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
        props: ['currentStash', 'view'],
        computed: {
            title: {
                get(){
                    return this.currentStash.title;
                },
                set(newTitle){
                    var self = this;
                    var stashItem = this.$root.currentStash;
                    stash.modify(this.currentStash.id, newTitle, function () {
                        self.currentStash.title = newTitle;
                        stashItem.title = newTitle;
                    })
                }
            },
            active: function () {
                return this.view == 'editor';
            }
        },
        methods: {
            hideEditor: function (e) {
                e.preventDefault();
                this.$root.view = 'home';
            }
        }

    }
</script>
