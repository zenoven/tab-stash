<template>
    <h2 class="summary">{{ i18n.StashSummary }}</h2>
</template>

<script>
    import utils from '../../js/lib/utils'

    export default {
        computed: {
            i18n: function () {
                var groupCount = this.list.length;
                var itemsCount = 0;
                this.list.forEach(function (item) {
                    itemsCount += item.children && item.children.length ? item.children.length : 0;
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
        props: ['list']
    }
</script>
