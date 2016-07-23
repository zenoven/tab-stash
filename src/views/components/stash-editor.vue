<template>
    <div class="title-edit-wrapper" :class="{ 'show' : active }">
        <div class="editor-wrapper">
            <input class="ipt-title" type="text" v-model="currentStashItem.title" />
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            currentStashItem: {
                default(){
                    return {
                        title: ''
                    }
                }
            },
            active: {
                default: false
            }
        }

    }
</script>
