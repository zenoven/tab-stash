<template>
    <span class="btn btn-primary js-add-stash" @click="createStash" >{{ i18n.StashBtn }}</span>
</template>
<script>
    import util from '../../js/lib/utils'
    import stash from '../../js/lib/stash'
    export default{
        data(){
            return{
                i18n: util.getMsgArr([
                    {name: 'StashBtn'}
                ])
            }
        },
        methods: {
            createStash(){
                stash.create();
            }
        }
    }
</script>
