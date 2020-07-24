<template>
    <Dropdown v-if="show" trigger="click" placement="bottom-start" :transfer=true @on-click="getName" class="hover">
        <Icon type="md-more" size="20"/>
        <DropdownMenu slot="list">
            <DropdownItem v-for="obj in selects" :key="obj.name" :name="obj.name" v-if="isAuth(obj.auth)">{{obj.title}}</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
import { isAuthForScript } from '../../libs/util'

export default {
    name: 'MoreAction',
    props: {
        selects: Array,
        object: Object
    },
    data () {
        return {
        }
    },
    mounted () {
    },
    methods: {
        getName (name) {
            if (this.object) {
                this.$emit('on-action', name, this.object)
            } else {
                this.$emit('on-action', name)
            }
        }
    },
    computed: {
        // 组件是否显示
        show () {
            let show = false
            this.selects.forEach(item => {
                if (isAuthForScript(this, item.auth)) {
                    show = true
                }
            })
            return show
        }
    }
}
</script>

<style scoped>
    .hover {
        cursor: pointer
    }
</style>
