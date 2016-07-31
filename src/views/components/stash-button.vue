<template>
    <Button  @click="createStash" >{{ i18n.StashBtn }}</Button>
</template>
<script>
    import utils from '../../js/lib/utils'
    import stash from '../../js/lib/stash'
    import Button from './button.vue'
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
        },
        components: {
            Button
        }
    }
</script>
