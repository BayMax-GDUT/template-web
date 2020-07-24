<template>
    <div>
        <Drawer :title="title" v-model="drawerVisible" width="600" :mask-closable="false" :styles="styles"
                @on-close="cancel">
            <Form ref="formData" :model="formData" :rules="ruleValidate">
                <FormItem label="任务名称" prop="taskName" :labelWidth="labelWidth">
                    <Input v-model="formData.taskName" style="width:220px"/>
                </FormItem>
                <FormItem label="任务描述" :labelWidth="labelWidth">
                    <Input type="textarea" :autosize="{ maxRows: 5 }" v-model="formData.taskDesc" style="width:220px"/>
                </FormItem>
                <FormItem label="任务开始时间" prop="startTime" :labelWidth="labelWidth">
                    <DatePicker v-model="formData.startTime" class="search-common" type="date" style="width: 220px" @on-change="changeStartTime"></DatePicker>
                </FormItem>
                <FormItem label="任务截止上报时间" prop="endTime" :labelWidth="labelWidth">
                    <DatePicker v-model="formData.endTime" class="search-common" type="date" style="width: 220px" @on-change="changeEndTime"></DatePicker>
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button type="default" :disabled="loading" @click="cancel(false)" style="margin-right: 10px">取消</Button>
                <Button type="primary" :loading="loading" @click="ok" style="margin-right: 10px">确定</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
import '../index.less'
import { taskGetByPrimaryKey, taskUpdate } from '@/api/education/task'

export default {
    data () {
        const startTimeValidator = (rule, value, callback) => {
            if (value) {
                callback()
            } else {
                return callback(new Error('请选择任务开始时间'))
            }
        }
        const endTimeValidator = (rule, value, callback) => {
            if (value) {
                callback()
            } else {
                return callback(new Error('请选择任务截止上报时间'))
            }
        }
        return {
            labelWidth: 120,
            title: '编辑数据上报任务',
            drawerVisible: true,
            formData: {
                taskName: '',
                taskDesc: '',
                startTime: '',
                endTime: ''
            },
            loading: false,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            ruleValidate: {
                taskName: [
                    { required: true, message: '请输入任务名称', trigger: 'blur' }
                ],
                taskDesc: [
                    { required: true, message: '请输入任务描述', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, validator: startTimeValidator, trigger: 'blur' }
                ],
                endTime: [
                    { required: true, validator: endTimeValidator, trigger: 'blur' }
                ]
            }
        }
    },
    props: {
        uId: String
    },
    created () {
        taskGetByPrimaryKey({ id: this.uId }).then(res => {
            const { data, code } = res.data
            if (code === 200000) {
                this.formData = data
            }
        })
    },
    methods: {
        changeStartTime (date) {
            this.formData.startTime = date
        },
        changeEndTime (date) {
            this.formData.endTime = date
        },
        cancel (up = false) {
            this.$emit('cancel', up)
        },
        ok () {
            this.$refs.formData.validate(valid => {
                if (valid) {
                    this.update()
                }
            })
        },
        update () {
            this.loading = true
            taskUpdate(this.formData).then(res => {
                const {  code } = res.data
                if (code === 200000) {
                    this.$Message.success('更新成功')
                    this.loading = false
                    this.cancel(true)
                }
            })
        }
    }
}
</script>
