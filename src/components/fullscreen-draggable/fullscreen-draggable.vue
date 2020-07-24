<template>
    <Modal v-model="isVisible" fullscreen :title="title" :closable="true" :footer-hide="true" :z-index="zIndex" @on-visible-change="handleVisibleChange">
        <Row>
            <Col span="12">
                <Row>
                    <Col span="8">
                        <Tree/>
                    </Col>
                    <Col span="16">
                        <table>
                            <thead>
                            <tr>
                                <th>T1</th>
                            </tr>
                            </thead>
                            <draggable v-model="list" v-bind="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
                                <transition-group type="transition" tag="tbody">
                                    <tr v-for="element in list" :key="element.order" @click="element.fixed =! element.fixed">
                                        <td>{{element.name}}</td>
                                    </tr>
                                </transition-group>
                            </draggable>
                        </table>
                    </Col>
                </Row>
            </Col>
            <Col span="12">
                <Row>
                    <Col span="16">
                        <table>
                            <thead>
                            <tr>
                                <th>T1</th>
                            </tr>
                            </thead>
                            <draggable v-model="list2" v-bind="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
                                <transition-group type="transition" tag="tbody">
                                    <tr v-for="element in list2" :key="element.order" @click="element.fixed =! element.fixed">
                                        <td>{{element.name}}</td>
                                    </tr>
                                </transition-group>
                            </draggable>
                        </table>
                    </Col>
                    <Col span="8">
                        <Tree/>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Modal>
</template>

<script>
import './index.less'
import Draggable from 'vuedraggable'

const message = [
    'vue.draggable',
    'draggable',
    'component',
    'for',
    'vue.js 2.0',
    'based',
    'on',
    'Sortablejs'
]

export default {
    name: 'FullscreenDraggable',
    components: {
        Draggable
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        zIndex: {
            type: Number,
            default: 1000
        }
    },
    data () {
        return {
            isVisible: false,
            list: message.map((name, index) => {
                return { name, order: index + 1, fixed: false }
            }),
            list2: [],
            editable: true,
            isDragging: false,
            delayedDragging: false
        }
    },
    methods: {
        handleVisibleChange (bol) {
            this.$emit('on-visible-change', bol)
        },
        handleModalAction () {
            this.isVisible = this.value
        },
        onMove ({ relatedContext, draggedContext }) {
            const relatedElement = relatedContext.element
            const draggedElement = draggedContext.element
            return (
                (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
            )
        }
    },
    computed: {
        dragOptions () {
            return {
                animation: 0,
                group: 'description',
                disabled: !this.editable,
                ghostClass: 'ghost'
            }
        }
    },
    watch: {
        value () {
            this.handleModalAction()
        },
        isDragging (newValue) {
            if (newValue) {
                this.delayedDragging = true
                return
            }
            this.$nextTick(() => {
                this.delayedDragging = false
            })
        }
    },
    mounted () {
        this.handleModalAction()
    }
}
</script>
