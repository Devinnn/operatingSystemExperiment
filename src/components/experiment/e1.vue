<template>
    <div class="main">
        <h3>说明：该实验假定所有进程都在0时刻提交（就绪）。</h3>
        <max class="mg"></max>
        <queue class="mg"></queue>
        <simple class="mg"></simple>
    </div>
</template>
<script>
    import Max from 'components/e1_progress/max';
    import Queue from 'components/e1_progress/simple';
    import Simple from 'components/e1_progress/queue';
    export default {
        components: {
            Max,
            Queue,
            Simple
        }
    };
</script>
<style lang="scss" scoped>
    .main {
        padding: 10px 50px;
    }
    .mg {
        margin: 30px 0;
    }
</style>


