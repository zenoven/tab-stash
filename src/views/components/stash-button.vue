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
                ]),
                isInitialized: false
            }
        },
        methods: {
            createStash(){
                if(!this.isInitialized) {
                    this.isInitialized = true;
                    stash.init(function(){
                        stash.create(() => {
                            console.log('arrow....');
                            console.log('init stash created.');
                        });
                    });
                }else{
                    stash.create(function(){
                        console.log('stash created.');
                    });
                }

            }
        }
    }
</script>
