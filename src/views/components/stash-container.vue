<template>
    <header>
        <stash-button></stash-button>
    </header>
    <main></main>

</template>
<script>
    import StashButton from './stash-button.vue'
    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
            StashButton
        }
    }
</script>
