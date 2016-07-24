<template>
    <h2 class="summary">{{ i18n.StashSummary }}</h2>
</template>

<script>
    import utils from '../../js/lib/utils'

    export default {
        computed: {
            i18n: function () {
                var groupCount = this.stashList.length;
                var itemsCount = 0;
                this.stashList.forEach(function (stash) {
                    itemsCount += stash.children && stash.children.length ? stash.children.length : 0;
                });
                return utils.getMsgArr([
                    {
                        name: 'StashSummary',
                        subSituationArray: [
                            groupCount,
                            itemsCount
                        ]
                    }
                ])
            }
        },
        props: ['stashList']
    }
</script>
