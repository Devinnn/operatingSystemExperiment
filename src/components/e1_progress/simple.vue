/* 最高优先数 */
<template>
    <div>
        <h3>
            简单轮转法
        </h3>
        <p>【说明】：选择进程数，最大设置为8。输入一个进程需要运行的时间，系统随机生成进程的不同运行时间。 然后根据进程的时间生成与其成倍关系的CPU时间片，能够使执行过程更快结束。
        </p>
        <p>【过程】：根据FCFS执行，每个进程分配相同时间片进行执行，如果执行完毕消失，在相同时间内还没有执行完毕则入队继续执行。 如果执行完CPU时间片尚未用完，直接执行下一个进程。
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
                    <el-col :span="3">
                        <el-form-item label="进程运行时间">
                            <el-input v-model="form.progress"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="CPU时间片" v-if="form.progress">
                            <el-select v-model="form.cpu" placeholder="请选择CPU时间片">
                                <el-option label="1/4" :value="Math.floor(Number(form.progress) / 4)">{{Math.floor(Number(form.progress) / 4)}}</el-option>
                                <el-option label="1/3" :value="Math.floor(Number(form.progress) / 3)">{{Math.floor(Number(form.progress) / 3)}}</el-option>
                                <el-option label="1/2" :value="Math.floor(Number(form.progress) / 2)">{{Math.floor(Number(form.progress) / 2)}}</el-option>
                                <el-option label="1" :value="Number(form.progress)">{{form.progress}}</el-option>
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
                    <p class="text">进程{{obj.index}}</p>
                    <p class="text">运行时间：{{obj.value}}</p>
                    <p class="text">...</p>
                </div>
            </transition-group>
            <p v-if="flagControlCreate" class="progress-show">
                <span>【过程显示】：</span>{{tipText}}
            </p>
            <p class="progress-show">【执行列表】</p>
            <el-table :data="recordTable" style="width: 50%" v-if="flagControlCreate" :border="true" :row-class-name="'animated fadeIn'">
                <el-table-column type="index" label="执行顺序" width="100px">
                </el-table-column>
                <el-table-column prop="name" label="进程名">
                </el-table-column>
                <el-table-column prop="originTime" label="需要运行的时间">
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
                    sum: '',
                    cpu: '',
                    progress: ''
                },
                cpuTime: 0,
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
                if (!this.form.sum || !this.form.cpu || !this.form.progress) {
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
                }, 1500);
            },
            // 生成模拟进程
            createProgress({ sum, cpu, progress }) {
                this.originArray = [];
                this.cpuTime = Number(cpu);
                for (var i = 0; i < sum; i++) {
                    let tmp =
                        Number(progress) +
                        Number(
                            Math.random() * 10 > 5
                                ? -Math.floor(Math.random() * 10)
                                : Math.floor(Math.random() * 10)
                        );
                    tmp = Math.abs(tmp);
                    this.originArray.unshift({
                        value: tmp,
                        name: `进程${i + 1}`,
                        index: i + 1,
                        state: 'W就绪',
                        color: false,
                        originTime: tmp
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
                            var tmp = this.originArray[len - 1].value;
                            if (len - 2 >= 0) {
                                this.originArray[len - 2].color = true;
                                this.originArray[len - 2].state = 'R运行';
                                this.tipText = `运行进程${this.originArray[len - 2]
                                    .index}`;
                            }
                            if (tmp - this.cpuTime > 0) {
                                // 大于0直接入队尾
                                var del = this.originArray.pop();
                                del.value = tmp - this.cpuTime;
                                del.color = false;
                                del.state = 'W就绪';
                                this.originArray.unshift(del);
                                this.tipText = `进程${del.index}重新入队`;
                                timer = setTimeout(fn.bind(this), 1500);
                            } else {
                                // 小于0直接丢弃，视为执行完
                                var _del = this.originArray.pop();
                                this.recordTable.push(_del);
                                this.tipText = `进程${_del.index}运行完毕`;
                                timer = setTimeout(fn.bind(this), 1500);
                            }
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