/* 最高优先数 */
<template>
    <div>
        <h3>
            最高优先数优先
        </h3>
        <p>【说明】：选择进程数，最大设置为8，输入一个优先数，系统会依据这个数字生成不同的优先数。</p>
        <p>【过程】：先根据优先数对进程进行排序，之后执行进程。</p>
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
                        <el-form-item label="优先数">
                            <el-input v-model="form.num"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="3">
                    <el-button type="primary" @click="onSubmit" :disabled="flagRepete || flagControlCreatBtn  ? 'disabled' : false">随机生成进程</el-button>
                    <el-button type="primary" v-if="flagControlAction" @click="actionOperate">执行算法</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <p v-if="!flagControlCreate" class="tipText">请先输入相关内容后再执行进程</p>
            <transition-group name="list-complete" tag="p" v-if="flagControlCreate">
                <div class="box list-complete-item" v-for="obj in originArray" :key="obj.index" :class="obj.color ? 'blue': ''">
                    <p class="text">{{obj.state}}</p>
                    <p class="text">{{obj.name}}</p>
                    <p class="text">优先数：{{obj.value}}</p>
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
                <el-table-column prop="value" label="进程优先数">
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
                    num: ''
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
                if (!this.form.sum || !this.form.num) {
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
            createProgress({ sum, num }) {
                this.originArray = [];
                for (var i = 0; i < sum; i++) {
                    let tmp =
                        Number(num) +
                        Number(
                            Math.random() * 10 > 5
                                ? -Math.floor(Math.random() * 10)
                                : Math.floor(Math.random() * 10)
                        );
                    tmp = Math.abs(tmp);
                    this.originArray.unshift({
                        value: tmp,
                        index: i + 1,
                        name: `进程${i + 1}`,
                        state: 'W就绪',
                        color: false
                    });
                }
                this.flagControlCreate = true;
                this.flagControlAction = true;
                this.recordTable = [];
            },
            // 使用冒泡排序
            sort() {
                var length = this.originArray.length;
                for (var i = 0; i < length - 1; i++) {
                    for (var j = i; j < length; j++) {
                        if (this.originArray[i].value > this.originArray[j].value) {
                            var tmp = this.originArray[j];
                            this.originArray[j] = this.originArray[i];
                            this.originArray[i] = tmp;
                        }
                    }
                }
                this.originArray = this.originArray.slice();
            },
            // 该表状态
            changeState() {
                var len = this.originArray.length;
                var i = len - 1;
                var timer = setTimeout(
                    function fn() {
                        if (i !== -1) {
                            this.tipText = `进程${this.originArray[i].index}运行`;
                            this.originArray[i].state = 'R运行';
                            this.originArray[i].color = true;
                            if (i !== len - 1) {
                                let tmp = this.originArray.pop();
                                this.recordTable.push(tmp);
                            }
                            i--;
                            timer = setTimeout(fn.bind(this), 1000);
                        } else {
                            let tmp = this.originArray.pop();
                            this.recordTable.push(tmp);
                            this.tipText = '结束';
                            this.flagControlCreatBtn = false;
                            clearTimeout(timer);
                        }
                    }.bind(this),
                    1000
                );
            },
            // 执行整个过程
            actionOperate() {
                this.flagControlAction = false;
                this.flagControlCreatBtn = true;
                // 排序
                this.tipText = '根据优先数进行排序';
                this.sort();
                this.msg({ message: '执行成功', type: 'success' });
                // 改变状态，由于动画效果时间执行一秒，所以需要等待一秒
                setTimeout(() => {
                    this.tipText = '执行进程';
                    this.changeState();
                }, 1000);
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
        transition: all 1s;
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