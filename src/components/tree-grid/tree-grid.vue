<template>
    <div :style="{ width: tableWidth }" class="autoTable">
        <table class="table table-bordered" id="hl-tree-table">
            <thead>
            <tr>
                <th v-for="(column, index) in cloneColumns" :key="column.title" :style="{width: column._width}">
                    <label>{{ renderHeader(column, index) }}
                        <span class="ivu-table-sort" v-if="column.sortable"><Icon type="arrow-up-b" :class="{ on: column._sortType === 'asc' }" @click.native="handleSort(index, 'asc')"/><Icon type="arrow-down-b" :class="{ on: column._sortType === 'desc' }" @click.native="handleSort(index, 'desc')"/></span>
                    </label>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in initItems" :key="item.id" v-show="show(item)" :class="{ 'child-tr': item.parent} ">
                <td v-for="(column, num) in insideColumns" :key="column.key" :style="tdStyle(column)">
                    <label v-if="column.type === 'switch'">
                        <i-switch v-if="viewAccess(column.permissions)" size="small" @on-change="handleChange(item)" :value="item.visible === 1"/>
                    </label>
                    <div v-if="column.type === 'action'" align="center">
                        <MoreAction v-if="item.type === 1" :selects="menuActionList" :object="item" @on-action="handleOnAction"/>
                        <MoreAction v-if="item.type === 2" :selects="buttonActionList" :object="item" @on-action="handleOnAction"/>
                    </div>
                    <label @click="toggle(index, item)" v-if="!column.type">
                        <span v-if="num === iconRow()"><i v-html="item.spaceHtml"></i><i v-if="item.children && item.children.length > 0" class="ivu-icon" :class="{ 'ios-arrow-forward': !item.expanded, 'ios-arrow-down': item.expanded }"></i><i v-else class="ms-tree-space"></i></span> {{ renderBody(item, column) }}
                        <render-col v-if="column.render" :render="column.render" :column="column" :index="index"/>
                    </label>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import './index.less'
import RenderCol from './col'
import MoreAction from '../more-action/more-action'

export default {
    name: 'TreeGrid',
    components: {
        MoreAction,
        RenderCol
    },
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        },
        access: {
            type: Array,
            default: () => []
        },
        menuActionList: {
            type: Array,
            default: () => []
        },
        buttonActionList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            initItems: [], // 处理后数据数组
            cloneColumns: [], // 处理后的表头数据
            checkGroup: [], // 复选框数组
            checks: false, // 全选
            screenWidth: document.body.clientWidth, // 自适应宽
            tdsWidth: 0, // td总宽
            timer: false, // 控制监听时长
            dataLength: 0, // 树形数据长度
            insideColumns: []
        }
    },
    computed: {
        tableWidth () {
            return this.tdsWidth > this.screenWidth && this.screenWidth > 0 ? this.screenWidth + 'px' : '100%'
        }
    },
    watch: {
        screenWidth (val) {
            if (!this.timer) {
                this.screenWidth = val
                this.timer = true
                setTimeout(() => {
                    this.timer = false
                }, 400)
            }
        },
        items () {
            if (this.items) {
                this.dataLength = this.Length(this.items)
                this.initData(this.deepCopy(this.items), 1, null)
                this.checkGroup = this.renderCheck(this.items)
                if (this.checkGroup.length === this.dataLength) {
                    this.checks = true
                } else {
                    this.checks = false
                }
            }
        },
        columns: {
            handler (columns) {
                this.cloneColumns = this.makeColumns()
                this.handleColumns(columns)
            }
            // 默认值是 false，代表是否深度监听
            // deep: true
        },
        checkGroup (data) {
            this.checkAllGroupChange(data)
        }
    },
    mounted () {
        this.handleColumns(this.columns)
        if (this.items) {
            this.dataLength = this.Length(this.items)
            this.initData(this.deepCopy(this.items), 1, null)
            this.cloneColumns = this.makeColumns()
            this.checkGroup = this.renderCheck(this.items)
            if (this.checkGroup.length === this.dataLength) {
                this.checks = true
            } else {
                this.checks = false
            }
        }
        // 绑定onresize事件 监听屏幕变化设置宽
        this.$nextTick(() => {
            this.screenWidth = document.body.clientWidth
        })
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                this.screenWidth = window.screenWidth
            })()
        }
    },
    methods: {
        handleOnAction (name, obj) {
            this.$emit('on-action', name, obj)
        },
        viewAccess (accessArr) {
            return this.access.length > 0 ? hasOneOf(accessArr, this.access) : true
        },
        viewCondition (action, item) {
            if (action.condition) {
                const condition = action.condition
                return condition({ row: item })
            }
            return true
        },
        handleChange (item) {
            this.$emit('on-switch-change', item)
        },
        handleColumns (columns) {
            this.insideColumns = columns.map(item => {
                if (item.render) {
                    let render = item.render
                    item.render = (h, params) => {
                        params.row = this.initItems[params.index]
                        return render(h, params)
                    }
                }
                return item
            })
        },
        // 有无多选框折叠位置优化
        iconRow () {
            for (let i = 0, len = this.columns.length; i < len; i++) {
                if (this.columns[i].type === 'selection') {
                    return 1
                }
            }
            return 0
        },
        // 设置td宽度,td的align
        tdStyle (column) {
            let style = {}
            if (column.align) {
                style['text-align'] = column.align
            }
            if (column.width) {
                style['min-width'] = column.width + 'px'
            }
            return style
        },
        // 排序事件
        handleSort (index, type) {
            if (this.cloneColumns[index]._sortType === type) {
                this.cloneColumns[index]._sortType = 'normal'
            } else {
                this.cloneColumns[index]._sortType = type
            }
            this.$emit('on-sort-change', this.cloneColumns[index]['key'], this.cloneColumns[index]['_sortType'])
        },
        // 点击某一行事件
        handleClick (data, event, index, text) {
            let result = this.makeData(data)
            this.$emit('on-row-click', result, event, index, text)
        },
        // 点击事件 返回数据处理
        makeData (data) {
            const t = this.type(data)
            let o
            if (t === 'array') {
                o = []
            } else if (t === 'object') {
                o = {}
            } else {
                return data
            }
            if (t === 'array') {
                for (let i = 0; i < data.length; i++) {
                    o.push(this.makeData(data[i]))
                }
            } else if (t === 'object') {
                for (let i in data) {
                    if (i !== 'spaceHtml' && i !== 'parent' && i !== 'level' && i !== 'expanded' && i !== 'isShow' && i !== 'load') {
                        o[i] = this.makeData(data[i])
                    }
                }
            }
            return o
        },
        // 处理表头数据
        makeColumns () {
            let columns = this.deepCopy(this.columns)
            this.tdsWidth = 0
            columns.forEach((column, index) => {
                column._index = index
                column._width = column.width ? column.width : 'auto'
                column._sortType = 'normal'
                this.tdsWidth += column.width ? parseFloat(column.width) : 0
            })
            return columns
        },
        // 数据处理 增加自定义属性监听
        initData (items, level, parent) {
            this.initItems = []
            let spaceHtml = ''
            for (let i = 1; i < level; i++) {
                spaceHtml += '<i class=\'ms-tree-space\'></i>'
            }
            items.forEach(item => {
                item = Object.assign({}, item, {
                    'parent': parent,
                    'level': level,
                    'spaceHtml': spaceHtml
                })
                if (typeof item.expanded === 'undefined') {
                    item = Object.assign({}, item, {
                        'expanded': false
                    })
                }
                if (typeof item.show === 'undefined') {
                    item = Object.assign({}, item, {
                        'isShow': false
                    })
                }
                if (typeof item.isChecked === 'undefined') {
                    item = Object.assign({}, item, {
                        'isChecked': false
                    })
                }
                item = Object.assign({}, item, {
                    'load': item.expanded
                })
                this.initItems.push(item)
                if (item.children && item.expanded) {
                    this.initData(item.children, level + 1, item)
                }
            })
        },
        // 隐藏显示
        show (item) {
            return ((item.level === 1) || (item.parent && item.parent.expanded && item.isShow))
        },
        toggle (index, item) {
            let level = item.level + 1
            let spaceHtml = ''
            for (let i = 1; i < level; i++) {
                spaceHtml += '<i class=\'ms-tree-space\'></i>'
            }
            if (item.children) {
                if (item.expanded) {
                    item.expanded = !item.expanded
                    this.close(index, item)
                } else {
                    item.expanded = !item.expanded
                    if (item.load) {
                        this.open(index, item)
                    } else {
                        item.load = true
                        item.children.forEach((child, childIndex) => {
                            this.initItems.splice((index + childIndex + 1), 0, child)
                            // 设置监听属性
                            this.$set(this.initItems[index + childIndex + 1], 'parent', item)
                            this.$set(this.initItems[index + childIndex + 1], 'level', level)
                            this.$set(this.initItems[index + childIndex + 1], 'spaceHtml', spaceHtml)
                            this.$set(this.initItems[index + childIndex + 1], 'isShow', true)
                            this.$set(this.initItems[index + childIndex + 1], 'expanded', false)
                        })
                    }
                }
            }
        },
        open (index, item) {
            if (item.children) {
                item.children.forEach((child, childIndex) => {
                    child.isShow = true
                    if (child.children && child.expanded) {
                        this.open(index + childIndex + 1, child)
                    }
                })
            }
        },
        close (index, item) {
            if (item.children) {
                item.children.forEach((child, childIndex) => {
                    child.isShow = false
                    child.expanded = false
                    if (child.children) {
                        this.close(index + childIndex + 1, child)
                    }
                })
            }
        },
        checkAllGroupChange (data) {
            if (this.dataLength > 0 && data.length === this.dataLength) {
                this.checks = true
            } else {
                this.checks = false
            }
            this.$emit('on-selection-change', this.checkGroup)
        },
        All (data) {
            let arr = []
            data.forEach((item) => {
                arr.push(item.id)
                if (item.children && item.children.length > 0) {
                    arr = arr.concat(this.All(item.children))
                }
            })
            return arr
        },
        // 返回树形数据长度
        Length (data) {
            let length = data.length
            data.forEach((child) => {
                if (child.children) {
                    length += this.Length(child.children)
                }
            })
            return length
        },
        // 返回表头
        renderHeader (column, $index) {
            if ('renderHeader' in this.columns[$index]) {
                return this.columns[$index].renderHeader(column, $index)
            } else {
                return column.title || '#'
            }
        },
        // 返回内容
        renderBody (item, column) {
            return item[column.key]
        },
        // 默认选中
        renderCheck (data) {
            let arr = []
            data.forEach((item) => {
                if (item._checked) {
                    arr.push(item.id)
                }
                if (item.children && item.children.length > 0) {
                    arr = arr.concat(this.renderCheck(item.children))
                }
            })
            return arr
        },
        // 深度拷贝函数
        deepCopy (data) {
            let t = this.type(data)
            let o, i, ni
            if (t === 'array') {
                o = []
            } else if (t === 'object') {
                o = {}
            } else {
                return data
            }
            if (t === 'array') {
                for (i = 0, ni = data.length; i < ni; i++) {
                    o.push(this.deepCopy(data[i]))
                }
                return o
            } else if (t === 'object') {
                for (i in data) {
                    o[i] = this.deepCopy(data[i])
                }
                return o
            }
        },
        type (obj) {
            let toString = Object.prototype.toString
            let map = {
                '[object Boolean]': 'boolean',
                '[object Number]': 'number',
                '[object String]': 'string',
                '[object Function]': 'function',
                '[object Array]': 'array',
                '[object Date]': 'date',
                '[object RegExp]': 'regExp',
                '[object Undefined]': 'undefined',
                '[object Null]': 'null',
                '[object Object]': 'object'
            }
            return map[toString.call(obj)]
        }
    },
    beforeDestroy () {
        window.onresize = null
    }
}
</script>
