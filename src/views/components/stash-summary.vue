<template>
    <h2 class="summary">{{ i18n.StashSummary }}</h2>
</template>

<script>
    import utils from '../../js/lib/utils'

    export default {
        data(){
            return {
                i18n: utils.getMsgArr([
                    {
                        name: 'StashSummary',
                        subSituationArray: [
                            this.summary.groupCount,
                            this.summary.itemsCount
                        ]
                    }
                ])
            }
        },
        props: [
            'summary'
        ]
    }
</script>
