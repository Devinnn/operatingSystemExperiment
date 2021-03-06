/* 先来先服务FCFS算法 */
<template>
    <div>
        <h3>
            先来先服务FCFS算法
        </h3>
        <p>【说明】：选择进程数，最大设置为8。
        </p>
        <p>【过程】：根据FCFS执行，先来先服务，如同队列一样先进先出。
        </p>
        <div>
            <el-form ref="form" :model="form">
                <el-row :gutter="5">
                    <el-col :span="3">
                        <el-form-item label="选择进程数">
                            <el-select v-model="form.sum" placeholder="请选择进程数量">
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                                <el-option label="6" value="6"></el-option>
                                <el-option label="7" value="7"></el-option>
                                <el-option label="8" value="8"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="3">
                    <el-button type="primary" @click="onSubmit" :disabled="flagRepete || flagControlCreatBtn ? 'disabled' : false">随机生成进程</el-button>
                    <el-button type="primary" v-if="flagControlAction" @click="actionOperate">执行算法</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <p v-if="!flagControlCreate" class="tipText">请先输入相关内容后再执行进程</p>
            <transition-group name="list-complete" tag="p" v-if="flagControlCreate">
                <div class="box list-complete-item" v-for="obj in originArray" :key="obj.index" :class="obj.color ? 'blue': ''">
                    <p class="text">{{obj.state}}</p>
                    <p class="text">{{obj.name}}</p>
                    <p class="text">...</p>
                </div>
            </transition-group>
            <p v-if="flagControlCreate" class="progress-show">
                <span>【过程显示】：</span>{{tipText}}
            </p>
            <p class="progress-show">【执行列表】</p>
            <el-table :data="recordTable" style="width: 50%" v-if="flagControlCreate" :border="true" :row-class-name="'animated fadeIn'">
                <el-table-column prop="index" label="执行顺序">
                </el-table-column>
                <el-table-column prop="name" label="进程名">
                </el-table-column>
            </el-table>
        </div>
        <hr>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    sum: ''
                },
                // 防止重复点击生成按钮
                flagRepete: false,
                // 控制执行时不能点击生成按钮
                flagControlCreatBtn: false,
                // 控制模拟线程的生成
                flagControlCreate: false,
                // 控制执行按钮
                flagControlAction: false,
                tipText: '',
                originArray: [],
                recordTable: []
            };
        },
        methods: {
            onSubmit() {
                if (!this.form.sum) {
                    console.log('必须填完信息才可以生成进程');
                    this.msg({ message: '必须填完信息才可以生成进程', type: 'warning' });
                    return;
                }
                this.msg({ message: '生成成功', type: 'success' });
                this.tipText = '生成进程';
                this.createProgress(this.form);
                this.flagRepete = true;
                setTimeout(() => {
                    this.$message.closeAll();
                    this.flagRepete = false;
                }, 1000);
            },
            // 生成模拟进程
            createProgress({ sum }) {
                this.originArray = [];
                for (var i = 0; i < sum; i++) {
                    this.originArray.unshift({
                        name: `进程${i + 1}`,
                        index: i + 1,
                        state: 'W就绪',
                        color: false
                    });
                }
                this.flagControlCreate = true;
                this.flagControlAction = true;
                this.recordTable = [];
            },
            // 该表状态
            changeState() {
                this.originArray[this.originArray.length - 1].color = true;
                this.originArray[this.originArray.length - 1].state = 'R运行';
                this.tipText = `运行进程${this.originArray[this.originArray.length - 1]
                    .index}`;
                var timer = setTimeout(
                    function fn() {
                        var len = this.originArray.length;
                        if (len !== 0) {
                            if (len - 2 >= 0) {
                                this.originArray[len - 2].color = true;
                                this.originArray[len - 2].state = 'R运行';
                                this.tipText = `运行进程${this.originArray[len - 2]
                                    .index}`;
                            }
                            var tmp = this.originArray.pop();
                            this.recordTable.push(tmp);
                            timer = setTimeout(fn.bind(this), 1500);
                        } else {
                            this.tipText = '结束';
                            this.flagControlCreatBtn = false;
                            clearTimeout(timer);
                        }
                    }.bind(this),
                    1500
                );
            },
            // 执行整个过程
            actionOperate() {
                this.flagControlAction = false;
                this.flagControlCreatBtn = true;
                this.msg({ message: '执行成功', type: 'success' });
                // 改变状态，由于动画效果时间执行一秒，所以需要等待一秒
                this.tipText = '执行进程';
                this.changeState();
            },
            msg(m) {
                this.$message(m);
            }
        }
    };
</script>
<style lang="scss" scoped>
    h3 {
        margin-bottom: 10px;
    }
    .box {
        display: inline-block;
        width: 150px;
        height: 150px;
        padding: 5px;
        margin: 10px;
        margin-left: 0;
        border: 2px #6f6f6f dashed;
        border-radius: 3px;
        vertical-align: top;
        background-color: #fff;
        .text {
            margin: 0;
            padding: 5px 0;
        }
    }
    .tipText {
        margin: 10px 0;
    }
    .progress-show {
        margin: 10px 0;
    }
    .blue {
        border-color: #66b1ff;
        border-style: solid;
    }
    .el-table {
        margin-bottom: 10px;
    }
    .list-complete-item {
        transition: all 1.5s;
    }
    .list-complete-enter,
    .list-complete-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
    .list-complete-leave-active {
        position: absolute;
    }
</style>