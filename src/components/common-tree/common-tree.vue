<template>
    <div>
        <Input v-model="treeSelectKey" @on-change="treeSelect" style="width: 80%" clearable v-if="canSearchOrNot">
            <Icon type="ios-search" slot="prefix"/>
        </Input>
        <slot name="title"/>
        <Icon type="ios-add" size="24" class="add" v-if="canChangeOrNot && isAuth(addPermission)" @click="add"/>
        <Divider id="contentLeftDivider"/>
        <TreeSection :data="treeSelectData" :canChangeOrNot="canChangeOrNot" :actionList="actionList"
                     @on-select-change="treeSelectChange" @on-action="handleAction"/>
    </div>
</template>

<script>
import TreeSection from '@/components/tree-section'
import Vue from 'vue'

export default {
    name: 'CommonTree',
    props: {
        addPermission: {
            type: String,
            default: ''
        },
        actionList: {
            type: Array,
            default: () => []
        },
        canChangeOrNot: {
            type: Boolean,
            default: false
        },
        canSearchOrNot: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    components: {
        TreeSection
    },
    data () {
        return {
            // 数据动态搜索关键词
            treeSelectKey: '',
            treeData: [],
            // 根据搜索展示的数据
            treeSelectData: []
        }
    },
    mounted () {
    },
    methods: {
        // 初始化树数据
        getData () {
            this.$nextTick(() => {
                this.treeData = JSON.parse(JSON.stringify(this.data))
                if (this.treeData.length > 0) {
                    // 初始化的时候选中第一个树节点
                    // this.$set(this.treeData[0], 'selected', true)
                    this.treeSelectData = this.treeData
                    // 返回父组件进行请求
                    this.$emit('tree-select-change', this.treeData[0].id)
                }
            })

        },
        // 选中的树节点变更事件
        treeSelectChange (nodeArray, node) {
            // node为被选中的节点，获取节点id返回上一层
            this.$emit('tree-select-change', node.id)
        },
        // 管理组列表根据输入动态查询
        treeSelect () {
            let key = this.treeSelectKey.trim()
            if (key.length < 1) {
                this.treeSelectData = this.treeData
            } else {
                this.treeSelectData = []
                this.selectForeach(this.treeData, key)
                if (this.treeSelectData.length > 0) {
                    this.$set(this.treeSelectData[0], 'selected', true)
                    this.$emit('tree-select-change', this.treeSelectData[0].id)
                }
            }
        },
        // 根据关键字筛选管理组列表的迭代函数
        selectForeach (treeData, key) {
            let result = []
            if (treeData.length < 1) {
                return result
            } else {
                treeData.forEach(item => {
                    // 遍历时顺带清选择状态
                    this.$set(item, 'selected', false)
                    if (item.children && item.children.length > 0) {
                        this.selectRecursively(item.children, key)
                    }
                    if (item.title.indexOf(key) >= 0) {
                        Vue.delete(item, 'children')
                        this.treeSelectData.push(item)
                    }
                })
            }
        },
        selectRecursively (treeData, key) {
            let result = []
            if (treeData.length < 1) {
                return result
            } else {
                treeData.forEach(item => {
                    if (item.children && item.children.length > 0) {
                        this.selectRecursively(item.children, key)
                    }
                    if (item.title.indexOf(key) >= 0) {
                        Vue.delete(item, 'children')
                        this.treeSelectData.push(item)
                    }
                })
            }
        },
        add () {
            this.$emit('add')
        },
        // 更多操作
        handleAction (name, object) {
            this.$emit('on-action', name, object)
        }
    }
}
</script>

<style scoped>
    .add:hover {
        cursor: pointer
    }

    .add {
        float: right;
        margin-right: 15px;
        margin-top: 5px
    }
</style>
