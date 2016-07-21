<template>
    <span class="btn btn-primary js-add-stash" @click="createStash" >{{ i18n.StashBtn }}</span>
</template>
<script>
    import utils from '../../js/lib/utils'
    import stash from '../../js/lib/stash'
    export default{
        data(){
            return{
                i18n: utils.getMsgArr([
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
