// props：提供所有 prop 的对象
// children: VNode 子节点的数组
// slots: 一个函数，返回了包含所有插槽的对象
// scopedSlots: (2.6.0+) 一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽。
// data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件
// parent：对父组件的引用
// listeners: (2.3.0+) 一个包含了所有父组件为当前组件注册的事件监听器的对象。这是data.on 的一个别名。
// injections: (2.3.0+) 如果使用了 inject 选项，则该对象包含了应当被注入的属性。
export default {
    name: 'RenderCol',
    functional: true,
    props: {
        render: Function,
        column: Object,
        index: Number
    },
    render: (h, ctx) => {
        const params = {
            column: ctx.props.column,
            index: ctx.props.index
        }
        return ctx.props.render(h, params)
    }
}
