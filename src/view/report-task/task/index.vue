<template>
    <div>
        <Card style="min-height: calc(100vh - 130px)">
            <span style="font-size: 18px">信息化上报工作</span>
            <Divider  style="margin-top: 30px"/>
            <div class="topActionArea">
                <Button class="top-btn" @click="addVisible = true">新增</Button>
            </div>
            <div class="search">
                <Input v-model="searchCondition.taskName" class="search-input" prefix="ios-search-outline" placeholder="请输入任务名称"/>
                <Button type="info" @click="searchCondition.taskName = ''" style="margin-left: 10px">重置</Button>
                <Button type="primary" class="search-common" @click="getData">搜索</Button>
            </div>
            <Table :columns="columns" :data="data.data" style="margin-top: 10px;margin-bottom: 10px">
                <template slot="taskStatus" slot-scope="{ row }">
                    <span v-if="row.taskStatus === 0">未发布</span>
                    <span v-if="row.taskStatus === 1">已发布</span>
                </template>
                <template slot="action" slot-scope="{ row }">
                    <MoreAction v-if="row.taskStatus === 0" :selects="notReleaseActionList" :object="row" @on-action="handleAction"></MoreAction>
                    <MoreAction v-if="row.taskStatus === 1" :selects="releasedActionList" :object="row" @on-action="handleAction"></MoreAction>
                    <MoreAction v-if="row.taskStatus === 2" :selects="endActionList" :object="row" @on-action="handleAction"></MoreAction>
                </template>
            </Table>
            <!--底部增加空间，供页脚存放-->
            <div style="height: 30px"></div>
            <Page :total="data.total" class="tr" @on-change="pageChange" :current.sync="data.pageNum"
                  :page-size="data.pageSize"
                  @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total></Page>
        </Card>
        <Add v-if="addVisible" @cancel="onAddDrawerCancel"/>
        <Update v-if="updateVisible" :uId="actionObject.id" @cancel="onUpdateDrawerCancel"/>
        <Modal v-model="removeVisible" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="remove">确认删除</Button>
            </div>
        </Modal>
        <Modal v-model="releaseVisible" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>一旦发布，不可以再进行编辑，是否进行发布？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="release">确认发布</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import './index.less'
import { taskFindPage, taskUpdate, taskDelete } from '@/api/education/task'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import MoreAction from '@/components/more-action'
import Add from './components/add.vue'
import Update from './components/update.vue'

export default {
    data () {
        return {
            // 新增
            addVisible: false,
            // 编辑
            updateVisible: false,
            // 删除
            removeVisible: false,
            // 发布
            releaseVisible: false,
            uId: null,
            searchCondition: {
                taskName: ''
            },
            removeModal: false,
            setting: {
                loading: true,
                showBorder: true
            },
            // 未发布任务的可选操作
            notReleaseActionList: [
                {
                    auth: 'framework',
                    name: 'release',
                    title: '发布任务'
                },
                {
                    auth: 'framework',
                    name: 'update',
                    title: '编辑'
                },
                {
                    auth: 'framework',
                    name: 'delete',
                    title: '删除任务'
                }
            ],
            // 已发布任务的可选操作
            releasedActionList: [
                {
                    auth: 'framework',
                    name: 'check',
                    title: '查看'
                }
            ],
            // 已截止任务的可选操作
            endActionList: [
                {
                    auth: 'framework',
                    name: 'check',
                    title: '查看'
                },
                {
                    auth: 'framework',
                    name: 'data',
                    title: '数据统计'
                }
            ],
            columns: [
                {
                    title: '任务名称',
                    key: 'taskName',
                    width: 300,
                    sortable: false
                },
                {
                    title: '任务描述',
                    key: 'taskDesc',
                    ellipsis: true,
                    width: 340,
                    sortable: false
                },
                {
                    title: '任务开始时间',
                    key: 'startTime',
                    width: 300,
                    sortable: false
                },
                {
                    title: '任务结束时间',
                    key: 'endTime',
                    width: 300,
                    sortable: false
                },
                {
                    title: '状态',
                    slot: 'taskStatus',
                    width: 200,
                    sortable: false
                },
                {
                    title: '操作',
                    type: 'template',
                    width: 135,
                    prop: 'action',
                    slot: 'action'
                }
            ],
            data: {
                data: [],
                total: 0,
                pageSize: 1,
                pageNum: 1
            },
            dataFilter: {
                pageNum: 1,
                pageSize: 10
            },
            actionObject: null
        }
    },
    components: {
        Add,
        Update,
        MoreAction
    },
    created () {
        this.getData()
    },
    methods: {
        pageChange (p) {
            this.dataFilter.pageNum = p
            this.getData()
        },
        pageSizeChange (p) {
            this.dataFilter.pageSize = p
            this.getData()
        },
        // 重置分页参数
        resetPage () {
            this.dataFilter = {
                pageNum: 1,
                pageSize: 10
            }
        },
        remove () {
            this.removeVisible = false
            if (this.actionObject == null) {
                this.$Message.warning('删除对象为空，无法继续执行！')
                return false
            }
            this.setting.loading = true
            try {
                let objs = []
                objs.push(this.actionObject.id)
                taskDelete(objs).then(res => {
                    const { code } = res.data
                    if (code === 200000) {
                        this.$Message.success('删除成功')
                        this.actionObject = null
                        this.getData()
                    }
                })
            } catch (error) {
            }
            this.setting.loading = false
        },
        release () {
            let obj = {
                id: this.actionObject.id,
                taskStatus: 1
            }
            taskUpdate(obj).then(res => {
                const { code } = res.data
                if (code === 200000) {
                    this.$Message.success('发布成功')
                    this.actionObject = null
                    this.releaseVisible = false
                    this.getData()
                }
            })
        },
        getData () {
            this.setting.loading = true
            let obj = {}
            obj.pageSize = this.dataFilter.pageSize
            obj.pageNum = this.dataFilter.pageNum
            if (this.searchCondition.taskName) {
                obj.taskName = this.searchCondition.taskName
            }
            taskFindPage(obj).then(res => {
                const { data } = res.data
                this.data = data
            })
            this.setting.loading = false
            this.resetPage()
        },
        onAddDrawerCancel (up = false) {
            this.addVisible = false
            this.actionObject = null
            if (up) this.getData()
        },
        onUpdateDrawerCancel (up = false) {
            this.updateVisible = false
            this.actionObject = null
            if (up) this.getData()
        },
        // 更多操作
        handleAction (name, object) {
            this.actionObject = object
            if (name === 'release') {
                this.releaseVisible = true
            } else if (name === 'update') {
                this.updateVisible = true
            } else if (name === 'delete') {
                this.removeVisible = true
            } else if (name === 'check') {
            } else if (name === 'data') {
            } else {}
        }
    }
}
</script>

<style scoped>
    .topActionArea {
        height: 50px;
        width: 100%;
        background-color: #d5e8fc;
        position: relative
    }
    .top-btn {
        margin-left: 10px;
        top: 50%;
        transform: translateY(30%);
    }
    .search {
        margin: 10px 0;
    }
    .search-common {
        margin-left: 10px;
    }
</style>
