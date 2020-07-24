<template>
    <div :style="styles" class="treeSection">
        <slot name="buttons"/>
        <Row>
            <Tree ref="treeSection" :data="treeData" :render="renderContent"/>
        </Row>
    </div>
</template>
<script>
import './index.less'

export default {
    name: 'TreeSection',
    props: {
        canChangeOrNot: {
            type: Boolean
        },
        width: {
            type: Number
        },
        menuIcon: {
            type: String,
            default () {
                return 'ios-folder'
            }
        },
        menuIconColor: {
            type: String,
            default () {
                return '#4A77AC'
            }
        },
        data: {
            type: Array,
            default () {
                return []
            }
        },
        actionList: {
            type: Array,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            treeData: []
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
        renderContent (h, { root, node, data }) {
            return h('label', {
                attrs: {
                    custom: node.node.id
                },
                style: {
                    display: 'inline-block',
                    padding: '0 0 0 18px',
                    // backgroundColor: '#FFF',
                    width: 'calc(100% - 1px)',
                    height: '24px'
                },
                // 'class': 'custom-tree-section',
                'class': node.node.selected ? 'ivu-tree-title ivu-tree-title-selected' : 'ivu-tree-title',
                on: {
                    click: () => {
                        let labels = document.getElementsByClassName('custom-tree-section')
                        // for(let object in Object.keys(labels)) {
                        //     console.log(labels[object])
                        // }
                        Object.entries(labels).forEach(([key, value]) => {
                            let id = value.getAttribute('custom')
                            if (id === node.node.id.toString()) {
                                labels[key].style.backgroundColor = '#d5e8fc'
                            } else {
                                labels[key].style.backgroundColor = '#FFF'
                            }
                            // console.log(key, value)
                        })
                        if (!node.node.selected) {
                            // 手动选择树节点
                            this.$refs.treeSection.handleSelect(node.nodeKey)
                            this.$emit('on-select-change', new Array(node.node), node.node)
                        }
                        // node.node.style('backgroundColor', '#000')
                    }
                }
            }, [h('icon', {
                attrs: {
                    type: this.menuIcon
                },
                style: {
                    display: 'inline-block',
                    float: 'left',
                    padding: '6px 2px 0 0',
                    color: this.menuIconColor
                }
            }),
                h('span', {

                    style: {
                        // float : 'left',
                        display: 'inline-block',
                        maxWidth: 'calc(85% - 26px)',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        height: '24px',
                        lineHeight: '24px',
                        overflow: 'hidden'
                    },
                    on: {
                        click: () => {
                            // if (!node.node.selected) {
                            //     // 手动选择树节点
                            //     this.$refs.treeSection.handleSelect(node.nodeKey)
                            //     this.$emit('on-select-change', new Array(node.node), node.node)
                            // }
                        }
                    }
                }, data.title),
                // 判断显不显示三个点组件
                h('span', {
                        style: {
                            display: Object.keys(this.actionList).length > 0 && node.node.selected ? 'inline-block' : 'none',
                            cursor: 'pointer',
                            float: 'right',
                            height: '24px',
                            lineHeight: '22px'
                        }
                    }, this.canChangeOrNot && node.node.id !== '-1'
                    ? [h('MoreAction', {
                        props: {
                            selects: this.actionList,
                            object: node.node
                        },
                        attrs: { class: 'moreAction' },
                        styles: {
                            display: this.canChangeOrNot && node.node.id !== '-1' ? 'inline-block' : 'none'
                        },
                        on: {
                            'on-action': (name, object) => {
                                this.$emit('on-action', name, object)
                            }
                        }
                    })] : ''
                )])
        },
        handleTreeData () {
            if(this.data && this.data.length>0) this.$set(this.data[0],'expand',true)
            this.treeData = this.data.map(item => item)
        },
        cancelSelectedRecursively (treeData) {
            treeData.forEach(item => {
                this.$set(item, 'selected', false)
                if (item.children) {
                    this.cancelSelectedRecursively(item.children)
                }
            })
        }
    },
    watch: {
        data () {
            this.handleTreeData()
        }
    },
    mounted () {
        // this.handleTreeData()
        this.$nextTick(function () {
            // console.log(this.treeData)
            // console.log(Object.values(document.getElementsByClassName('custom-tree-section')))
        })

        // if (this.treeData) {
        //     this.treeData[0].render = (h, { root, node, data }) => {
        //         return h('label', {
        //             attrs: {
        //                 custom: node.node.id
        //             },
        //             style: {
        //                 display: 'block',
        //                 padding: '0 0 0 20px',
        //                 backgroundColor: '#d5e8fc'
        //             },
        //             'class': 'custom-tree-section',
        //             on: {
        //                 click: () => {
        //                     let labels = document.getElementsByClassName('custom-tree-section')
        //                     Object.entries(labels).forEach(([key, value]) => {
        //                         let id = value.getAttribute('custom')
        //                         if (id === node.node.id.toString()) {
        //                             labels[key].style.backgroundColor = '#d5e8fc'
        //                         }
        //                     })
        //                 }
        //             }
        //         }, [
        //             h('span', {
        //                 'class': node.node.selected ? 'ivu-tree-title ivu-tree-title-selected' : 'ivu-tree-title',
        //                 on: {
        //                     click: () => {
        //                         if (!node.node.selected) {
        //                             // 手动选择树节点
        //                             this.$refs.treeSection.handleSelect(node.nodeKey)
        //                             this.$emit('on-select-change', new Array(node.node), node.node)
        //                         }
        //                     }
        //                 }
        //             }, data.title),
        //             // 判断显不显示三个点组件
        //             h('span', {
        //                     style: {
        //                         display: node.node.selected ? 'inline' : 'none'
        //                     }
        //                 }, this.canChangeOrNot && node.node.id !== '-1'
        //                 ? [h('MoreAction', {
        //                     props: {
        //                         selects: this.actionList,
        //                         object: node.node
        //                     },
        //                     attrs: {class: 'moreAction'},
        //                     styles: {
        //                         display: this.canChangeOrNot && node.node.id !== '-1' ? 'inline-block' : 'none'
        //                     },
        //                     on: {
        //                         'on-action': (name, object) => {
        //                             this.$emit('on-action', name, object)
        //                         }
        //                     }
        //                 })] : ''
        //             )])
        //     }
        // }
    }
}
</script>
<style>
    .hover:hover .moreAction {
        cursor: pointer;
        float: right;
        margin-right: 10px;
        display: inline-block
    }

    .moreAction {
        cursor: pointer;
        float: right;
        margin-right: 10px;

    }

    .treeSection .ivu-tree-children li {
        position: relative;
    }

    .treeSection .ivu-tree-arrow {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 24px;
        line-height: 24px;
    }
</style>
