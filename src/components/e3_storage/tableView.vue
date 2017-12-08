<template>
    <div class="table">
        <el-row :gutter="3">
            <el-col :span="12">
                <p>【分区表一览】</p>
                <el-table :data="storage" :border="true" :cell-class-name="'animated bounceIn'">
                    <el-table-column prop="ID" label="ID">
                    </el-table-column>
                    <el-table-column prop="storage" label="原始空间">
                    </el-table-column>
                    <el-table-column prop="surplus" label="剩余空间">
                    </el-table-column>
                    <el-table-column prop="firstAdress" label="首地址">
                    </el-table-column>
                    <el-table-column prop="distributeWork" label="分配的作业">
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <p>【作业表一览】</p>
                <el-table :data="work" :border="true" :cell-class-name="'animated bounceIn'">
                    <el-table-column prop="ID" label="ID">
                    </el-table-column>
                    <el-table-column prop="work" label="作业大小">
                    </el-table-column>
                    <el-table-column prop="corresponse" label="对应区块">
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        props: ['storage', 'work']
    };
</script>
<style lang="scss">
    .table {
        margin-top: 10px;
    }
    p {
        margin: 5px 0;
    }
    .el-table__body-wrapper {
        overflow: hidden;
    }
</style>