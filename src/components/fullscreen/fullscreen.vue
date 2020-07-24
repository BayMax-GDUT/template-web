<template>
    <Modal v-model="isVisible" fullscreen :title="title" :closable="true" :footer-hide="footerHide" :z-index="zIndex" @on-visible-change="handleVisibleChange">
        <slot/>
        <div v-show="isDVisible" class="ivu-drawer-mask"/>
        <div :class="clazz">
            <div class="ivu-drawer ivu-drawer-right ivu-drawer-inner" :style="`width: ${dWidth}px`">
                <div class="ivu-drawer-content">
                    <div class="ivu-drawer-header">
                        <div class="ivu-drawer-header-inner">{{dTitle}}</div>
                    </div>
                    <div class="ivu-drawer-body" :style="styles">
                        <slot name="drawerPage"/>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import './index.less'

export default {
    name: 'Fullscreen',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        footerHide: {
            type: Boolean,
            default: true
        },
        zIndex: {
            type: Number,
            default: 1000
        },
        dTitle: {
            type: String,
            default: ''
        },
        dVisible: {
            type: Boolean,
            default: false
        },
        dWidth: {
            type: [String, Number],
            default: 600
        }
    },
    data () {
        return {
            isVisible: false,
            drawerTitle: '',
            isDVisible: false,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            }
        }
    },
    methods: {
        handleVisibleChange (bol) {
            this.$emit('on-visible-change', bol)
        },
        handleModalAction () {
            this.isVisible = this.value
        },
        handleDrawerTitleAction () {
            this.drawerTitle = this.dTitle
        },
        handleDrawerVisibleAction () {
            this.isDVisible = this.dVisible
        }
    },
    watch: {
        value () {
            this.handleModalAction()
        },
        dTitle () {
            this.handleDrawerTitleAction()
        },
        dVisible () {
            this.handleDrawerVisibleAction()
        }
    },
    computed: {
        clazz () {
            return this.isDVisible ? 'ivu-drawer-wrap' : 'ivu-drawer-wrap ivu-drawer-hidden'
        }
    },
    mounted () {
        this.handleModalAction()
        this.handleDrawerTitleAction()
        this.handleDrawerVisibleAction()
    }
}
</script>
