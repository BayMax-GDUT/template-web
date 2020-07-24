<template>
    <div class="custom-region-cascade">
        <Select v-for="obj in regionArr" :disabled="obj.list.length === 0" v-model="obj.value" :key="`select-${obj.name}`" :style="styles" @on-change="handleChange(obj.name)">
            <Option v-for="item in obj.list" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
    </div>
</template>

<script>
import './index.less'

export default {
    name: 'RegionCascade',
    props: {
        width: {
            type: Number,
            default: 96
        },
        data: {
            type: Array,
            default () {
                return []
            }
        },
        selectCondition: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            regionArr: []
        }
    },
    computed: {
        styles () {
            let style = {}
            if (this.width) style.width = `${this.width}px`
            return style
        }
    },
    methods: {
        handleChange (name) {
            this.$emit('on-change', name)
        },
        handleProvinceData () {
            this.regionArr = this.data.map(item => item)
        }
    },
    watch: {
        data () {
            this.handleProvinceData()
        }
    },
    mounted () {
        this.handleProvinceData()
    }
}
</script>
