<template>
    <div class="wrapper">
        <h3>【实验】：存储管理</h3>
        <h3>【内容】：采用“首次适应法”、“循环首次适应法”、“最佳适应法”和“最差适应法”模拟作业的内存分配。作业和分区的数量均为10。</h3>
        <el-row>
            <el-form>
                <el-col :sm="6" :md="6" :lg="6" :xl="3" class="row">
                    <el-button @click="createStorage">生成分区</el-button>
                    <el-button @click="createWork">生成作业</el-button>
                </el-col>
                <el-col :sm="9" :md="8" :lg="8" :xl="5" class="row">
                    <el-form-item class="inline-block">
                        <el-select v-model="mode" placeholder="请选择算法">
                            <el-option label="首次适应法" value="A"></el-option>
                            <el-option label="循环首次适应法" value="B"></el-option>
                            <el-option label="最佳适应法" value="C"></el-option>
                            <el-option label="最差适应法" value="D"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button @click="actionMode" :disabled="!(workFlag && storageFlag)">执行算法</el-button>
                </el-col>
                <el-col :sm="7" :md="6" :lg="6" :xl="3" class="row">
                    <el-button @click="restore" :disabled="!actionFlag">回收所有资源</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-col>
            </el-form>
        </el-row>
        <table-view :storage="originStorage" :work="originWork"></table-view>
    </div>
</template>
<style lang="scss" scoped>
    .wrapper {
        padding: 10px;
    }
    .inline-block {
        display: inline-block;
    }
    .el-form {
        padding: 10px;
        .row {
            margin: 5px 0;
        }
        .el-form-item {
            margin: 0;
        }
    }
</style>

<script>
    import TableView from 'components/e3_storage/tableView';
    export default {
        components: {
            TableView
        },
        data() {
            return {
                mode: '',
                originWork: [],
                originStorage: [],
                // 是否已经执行算法
                actionFlag: false,
                // 是否已经生成作业
                workFlag: false,
                // 是否已经生成分区
                storageFlag: false
            };
        },
        methods: {
            // 生成作业
            createWork() {
                this.originWork = [];
                for (var i = 0; i < 10; i++) {
                    // 取5~100之间的随机数
                    var rd = Math.floor(Math.random() * (100 - 5 + 1) + 5);
                    var tmp = {
                        ID: i,
                        work: rd,
                        corresponse: '',
                        status: 'N'
                    };
                    this.originWork.push(tmp);
                }
                // 保存为字符串以便复制
                this.workStr = JSON.stringify(this.originWork);
                // 按钮逻辑控制
                this.workFlag = true;
            },
            // 生成分区
            createStorage() {
                this.originStorage = [];
                var nextFirstAd = 0;
                for (var i = 0; i < 10; i++) {
                    // 取5~100之间的随机数作为空间的大小
                    var rdStorage = Math.floor(Math.random() * (100 - 5 + 1) + 5);
                    // 取地址之间的间隔，为1~10之间的随机数
                    var rdAdress = Math.floor(Math.random() * (10 - 1 + 1) + 1);
                    var tmp = {
                        ID: i,
                        storage: rdStorage,
                        surplus: rdStorage,
                        firstAdress: nextFirstAd,
                        distributeWork: ''
                    };
                    nextFirstAd = nextFirstAd + rdStorage + rdAdress;
                    this.originStorage.push(tmp);
                }
                this.storageStr = JSON.stringify(this.originStorage);
                // 按钮逻辑控制
                this.storageFlag = true;
            },
            // 排序算法
            // 传入数组，和是否需要反转数组，默认为false
            sort(_array, tag) {
                var length = _array.length;
                for (var i = 0; i < length - 1; i++) {
                    for (var j = i; j < length; j++) {
                        if (_array[i].surplus > _array[j].surplus) {
                            var tmp = _array[j];
                            _array[j] = _array[i];
                            _array[i] = tmp;
                        }
                    }
                }
                if (tag === false) {
                    return _array;
                } else {
                    return _array.reverse();
                }
            },
            // 执行算法
            actionMode() {
                if (this.mode === '') {
                    return this.msg({ message: '执行失败，请先选择需要执行的算法。', type: 'warning' });
                }
                this.mode === 'A'
                    ? this.modeA()
                    : this.mode === 'B'
                        ? this.modeB()
                        : this.mode === 'C'
                            ? this.modeC()
                            : this.modeD();
                // 按钮逻辑控制
                this.actionFlag = true;
                this.workFlag = false;
                this.storageFlag = false;
            },
            // 首次适应法
            modeA() {
                /**
                 * 1. 先从work表中取出一个，然后和storage表中的第一条记录进行比较
                 * 2. 如果比storage剩余空间小，则分配成功，剩余空间更新，作业表状态更新。然后进行下一个work的分配。
                 * 3. 如果比storage剩余空间大，则往下面继续找符合情况的项。如果找得到，重复2。如果找不到，作业表状态更新为N。
                 * 4. 继续从作业表中取记录，重复执行2、3步骤。
                 * 5. 当作业表中的记录全部被取完的时候，分配结束。
                **/
                // work表中取出一个
                for (var i = 0; i < 10; i++) {
                    // 拿出一个作业
                    var thisWork = this.originWork[i].work;
                    for (var j = 0; j < 10; j++) {
                        // 拿出一块内存
                        var thisStorage = this.originStorage[j].surplus;
                        if (thisWork <= thisStorage) {
                            // 分配成功
                            // 更新剩余空间
                            this.originStorage[j].surplus -= thisWork;
                            // 写入分配到的作业
                            this.originStorage[j].distributeWork = (this.originStorage[j].distributeWork + ' / ' + this.originWork[i].ID).trim();
                            // 更新作业的状态
                            this.originWork[i].status = 'Y';
                            this.originWork[i].corresponse = this.originStorage[j].ID;
                            break;
                        } else {
                            // 如果最后找到最后一个还没有适合的内存空间，分配失败
                            if (j === 9) {
                                // 分配失败，更新work状态
                                this.originWork[i].corresponse = '未分配';
                            }
                            // 否则继续找
                            continue;
                        }
                    }
                }
            },
            // 循环首次适应法
            modeB() {
                /**
                 * 1. 先从storage中取出一个记录，记索引storageIndex
                 * 2. 检测work表中是否还有记录可找
                 * 2. 从work表中拿出一个记录，和当前索引的storage记录的剩余内存比较大小
                 * 3. 如果比它大，storageIndex加一，如果比它小，那么分配成功，work记录减1
                 * 4. 如果循环了一个storageIndex都没有找到可分配的空间那么分配失败，下次storageIndex从这个位置开始找
                 * 5. 循环1的步骤
                **/
                var workIndex = 0;
                var storageIndex = 0;
                var originStorageIndex = 0;
                while (workIndex < 10) {
                    // 拿到这个具体的work
                    var thisWork = this.originWork[workIndex];
                    if (thisWork.work <= this.originStorage[storageIndex].surplus) {
                        // 说明分配成功
                        // 更新记录
                        this.originStorage[storageIndex].surplus -= thisWork.work;
                        // 写入分配到的作业
                        this.originStorage[storageIndex].distributeWork = (this.originStorage[storageIndex].distributeWork + ' / ' + thisWork.ID).trim();
                        // 更新作业的状态
                        thisWork.status = 'Y';
                        thisWork.corresponse = this.originStorage[storageIndex].ID;
                        // workIndex加一
                        workIndex++;
                        // 更新两个值
                        storageIndex = originStorageIndex = (storageIndex + 1) % 10;
                        // 跳出循环进行下一个work的分配
                        continue;
                    }
                    if (thisWork.work > this.originStorage[storageIndex].surplus) {
                        // 说明分配失败，有两种情况
                        // 先给storageIndex+1，这样便于后面循环
                        storageIndex = (storageIndex + 1) % 10;
                        while (storageIndex !== originStorageIndex) {
                            // 第一种是能直接能够找到可分配的空间
                            if (thisWork.work <= this.originStorage[storageIndex].surplus) {
                                // 说明分配成功
                                // 更新记录
                                this.originStorage[storageIndex].surplus -= thisWork.work;
                                // 写入分配到的作业
                                this.originStorage[storageIndex].distributeWork = (this.originStorage[storageIndex].distributeWork + ' / ' + thisWork.ID).trim();
                                // 更新作业的状态
                                thisWork.status = 'Y';
                                thisWork.corresponse = this.originStorage[storageIndex].ID;
                                // workIndex++
                                workIndex++;
                                storageIndex = originStorageIndex = (storageIndex + 1) % 10;
                                // 跳出内循环进行下一个work分配
                                break;
                            }
                            // 第二种是不能够直接找到可分配的空间
                            if (thisWork.work > this.originStorage[storageIndex].surplus) {
                                // 说明分配失败
                                // 如果已经循环了一次，说明没有可分配的，分配失败更新状态。
                                if ((storageIndex + 1) % 10 === originStorageIndex) {
                                    // 分配失败
                                    // 此时originStorageIndex赋值给storageIndex
                                    storageIndex = originStorageIndex;
                                    // 更新状态
                                    thisWork.corresponse = '未分配';
                                    // 同时workIndex+1
                                    workIndex++;
                                    break;
                                }
                                // 否则的话需要进行下一个的判断
                                // storageIndex要加1
                                storageIndex = (storageIndex + 1) % 10;
                            }
                        }
                    }
                }
            },
            // 最佳适应法
            modeC() {
                /**
                 * 1. 从work表中取出一个记录。
                 * 2. 先对storage表剩余内存从小到大进行排序，与storage表的最后一个记录的剩余内存进行比较，如果比它还大，分配失败。直接更新状态。
                 * 3. 如果与storage表的最后一个记录的剩余内存进行比较，如果比它小，说明可分配。
                 * 4. 对storage表进行查找，找到第一个不小于它的内存地址。更新状态，继续分配下一个作业的内存。
                 * 4. 循环步骤1
                 * 5. 当work表中的记录都被取完的时候，分配结束
                **/
                var sortArray = JSON.parse(JSON.stringify(this.originStorage));
                for (var i = 0; i < 10; i++) {
                    // 拿出一个作业
                    var thisWork = this.originWork[i].work;
                    // 并且对storage表进行排序、由小到大排列
                    this.sort(sortArray, false);
                    if (thisWork > sortArray[9].surplus) {
                        // 比最大的还大，说明不能进行分配了
                        this.originWork[i].corresponse = '未分配';
                        // 进行下一个作业的分配
                        continue;
                    } else {
                        // 否则，说明可以进行分配
                        for (var j = 0; j < 10; j++) {
                            if (sortArray[j].surplus >= thisWork) {
                                // 分配成功
                                // 更新排序数组剩余空间
                                sortArray[j].surplus -= thisWork;
                                var index = sortArray[j].ID;
                                // 更新原数组的剩余空间和状态
                                this.originStorage[index].surplus -= thisWork;
                                // 写入分配到的作业
                                this.originStorage[index].distributeWork = (this.originStorage[index].distributeWork + ' / ' + this.originWork[i].ID).trim();
                                // 更新作业的状态
                                this.originWork[i].status = 'Y';
                                this.originWork[i].corresponse = this.originStorage[index].ID;
                                break;
                            }
                        }
                        // 继续往下面执行
                    }
                }
            },
            // 最差适应法、与最佳适应法相反
            modeD() {
                var sortArray = JSON.parse(JSON.stringify(this.originStorage));
                for (var i = 0; i < 10; i++) {
                    // 拿出一个作业
                    var thisWork = this.originWork[i].work;
                    // 并且对storage表进行排序、由大到小排列
                    this.sort(sortArray, true);
                    if (thisWork > sortArray[0].surplus) {
                        // 比最大的还大，说明不能进行分配了
                        this.originWork[i].corresponse = '未分配';
                        // 进行下一个作业的分配
                        continue;
                    } else {
                        // 否则，说明可以进行分配
                        for (var j = 0; j < 10; j++) {
                            if (sortArray[j].surplus >= thisWork) {
                                // 分配成功
                                // 更新排序数组剩余空间
                                sortArray[j].surplus -= thisWork;
                                var index = sortArray[j].ID;
                                // 更新原数组的剩余空间和状态
                                this.originStorage[index].surplus -= thisWork;
                                // 写入分配到的作业
                                this.originStorage[index].distributeWork = (this.originStorage[index].distributeWork + ' / ' + this.originWork[i].ID).trim();
                                // 更新作业的状态
                                this.originWork[i].status = 'Y';
                                this.originWork[i].corresponse = this.originStorage[index].ID;
                                break;
                            }
                        }
                        // 继续往下面执行
                    }
                }
            },
            // 回收所有资源
            restore() {
                for (var i = 0; i < 10; i++) {
                    this.originStorage[i].surplus = this.originStorage[i].storage;
                    this.originStorage[i].distributeWork = '';
                    this.originWork[i].corresponse = '';
                    if (this.originWork[i].status === 'Y') {
                        this.originWork[i].status = '已完成';
                    }
                }
                // 按钮逻辑控制
                this.workFlag = true;
                this.storageFlag = true;
                this.actionFlag = false;
            },
            // 重置
            reset() {
                this.originWork = [];
                this.originStorage = [];
                this.workStr = '';
                this.storageStr = '';
                this.mode = '';
                // 按钮逻辑控制
                this.workFlag = false;
                this.storageFlag = false;
                this.actionFlag = false;
            },
            msg(m) {
                this.$message(m);
            }
        }
    };
</script>

