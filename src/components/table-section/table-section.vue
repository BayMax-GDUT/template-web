<template>
    <div>
        <div v-if="searchable" class="search-con">
            <Select v-for="(val, key) in searchCondition" v-model="selectCondition[key]" :key="`search-${key}`" :placeholder="$t('textbook.list.search.please select') + $t(`${key}`)" class="search-col">
                <Option v-for="(v, k) in val" :value="k" :key="`search-col-${k}`">{{ v }}</Option>
            </Select>
            <br/>
            <Select v-if="searchCol" v-model="searchKey" class="search-col">
                <Option v-for="item in columns" v-if="item.filter && item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
            </Select>
            <Input v-if="searchCol" clearable :placeholder="$t('please enter a search phrase')" class="search-input" v-model="searchValue"/>
            <Button @click="handleSearch" icon="ios-search" class="search-btn" type="primary">{{ $t('search') }}</Button>
            <Button @click="handleRefresh" icon="ios-refresh-circle" class="search-btn" type="primary">{{ $t('refresh') }}</Button>
            <slot name="buttons"/>
        </div>
        <Table
                ref="tablesMain"
                :data="insideTableData"
                :columns="insideColumns"
                :stripe="stripe"
                :border="border"
                :show-header="showHeader"
                :width="width"
                :height="height"
                :loading="loading"
                :disabled-hover="disabledHover"
                :highlight-row="highlightRow"
                :row-class-name="rowClassName"
                :size="size"
                :no-data-text="noDataText"
                :no-filtered-data-text="noFilteredDataText"
                @on-current-change="onCurrentChange"
                @on-select="onSelect"
                @on-select-cancel="onSelectCancel"
                @on-select-all="onSelectAll"
                @on-selection-change="onSelectionChange"
                @on-sort-change="onSortChange"
                @on-filter-change="onFilterChange"
                @on-row-click="onRowClick"
                @on-row-dblclick="onRowDblclick"
                @on-expand="onExpand"
        >
            <slot name="header" slot="header"/>
            <slot name="footer" slot="footer"/>
            <slot name="loading" slot="loading"/>
        </Table>
        <slot name="page"/>
    </div>
</template>

<script>
import './index.less'

export default {
    name: 'TableSection',
    props: {
        value: {
            type: Array,
            default () {
                return []
            }
        },
        columns: {
            type: Array,
            default () {
                return []
            }
        },
        queryCondition: {
            type: Object,
            default () {
                return {}
            }
        },
        size: String,
        width: {
            type: [Number, String]
        },
        height: {
            type: [Number, String]
        },
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightRow: {
            type: Boolean,
            default: false
        },
        rowClassName: {
            type: Function,
            default () {
                return ''
            }
        },
        context: {
            type: Object
        },
        noDataText: {
            type: String
        },
        noFilteredDataText: {
            type: String
        },
        disabledHover: {
            type: Boolean
        },
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * @description 是否可搜索
         */
        searchable: {
            type: Boolean,
            default: false
        }
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iView中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
    data () {
        return {
            searchCondition: {},
            selectCondition: {},
            insideColumns: [],
            insideTableData: [],
            editingCellId: '',
            editingText: '',
            searchValue: '',
            searchKey: '',
            searchCol: false
        }
    },
    methods: {
        supportHandle (item) {
            let insideBtn = []
            let btn = item.button ? [].concat(insideBtn, item.button) : insideBtn
            item.render = (h, params) => {
                params.tableData = this.value
                return btn.map(item => item(h, params, this))
            }
            return item
        },
        handleColumns (columns) {
            this.insideColumns = columns.map((item, index) => {
                if (item.key === 'handle') item = this.supportHandle(item)
                if (item.filter && item.key !== 'handle') this.searchCol = true
                return item
            })
        },
        setDefaultSearchKey () {
            this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
        },
        // 搜索
        handleSearch () {
            this.$emit('on-search', this.selectCondition, this.searchKey, this.searchValue)
        },
        // 重置
        handleRefresh () {
            this.selectCondition = {}
            this.searchKey = ''
            this.searchValue = ''
            this.$emit('on-search', this.selectCondition, this.searchKey, this.searchValue)
        },
        handleTableData () {
            this.insideTableData = this.value.map((item, index) => {
                let res = item
                res.initRowIndex = index
                return res
            })
        },
        onCurrentChange (currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow)
        },
        onSelect (selection, row) {
            this.$emit('on-select', selection, row)
        },
        onSelectCancel (selection, row) {
            this.$emit('on-select-cancel', selection, row)
        },
        onSelectAll (selection) {
            this.$emit('on-select-all', selection)
        },
        onSelectionChange (selection) {
            this.$emit('on-selection-change', selection)
        },
        onSortChange (column, key, order) {
            this.$emit('on-sort-change', column, key, order)
        },
        onFilterChange (row) {
            this.$emit('on-filter-change', row)
        },
        onRowClick (row, index) {
            this.$emit('on-row-click', row, index)
        },
        onRowDblclick (row, index) {
            this.$emit('on-row-dblclick', row, index)
        },
        onExpand (row, status) {
            this.$emit('on-expand', row, status)
        },
        handleSearchCondition () {
            this.searchCondition = this.queryCondition
            Object.keys(this.searchCondition).map(item => {
                this.selectCondition[item] = ''
            })
        }
    },
    watch: {
        columns (columns) {
            this.handleColumns(columns)
            this.setDefaultSearchKey()
        },
        value () {
            this.handleTableData()
        },
        queryCondition () {
            this.handleSearchCondition()
        }
    },
    mounted () {
        this.handleColumns(this.columns)
        this.setDefaultSearchKey()
        this.handleTableData()
        this.handleSearchCondition()
    }
}
</script>
