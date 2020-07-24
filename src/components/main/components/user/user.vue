<template>
    <div class="user-avatar-dropdown">
        <Dropdown @on-click="handleClick">
            <!--<Badge :dot="!!messageUnreadCount">-->
            <Badge>
                <Avatar :src="userAvatar"/>
            </Badge>
            <Icon :size="18" type="md-arrow-dropdown"/>
            <DropdownMenu slot="list">
                <!--<DropdownItem name="message">消息中心-->
                <!--    <Badge style="margin-left: 10px" :count="messageUnreadCount"/>-->
                <!--</DropdownItem>-->
                <DropdownItem name="personal">个人中心</DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'

export default {
    name: 'User',
    props: {
        userAvatar: {
            type: String,
            default: ''
        },
        messageUnreadCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        tagNavList () {
            return this.$store.state.app.tagNavList
        }
    },
    methods: {
        ...mapActions([
            'handleLogout'
        ]),
        logout () {
            this.handleLogout().then(() => {
                this.$router.push({
                    name: 'login'
                })
            })
        },
        message () {
            this.$router.push({
                name: 'message_page'
            })
        },
        personal () {
            this.$router.push({
                name: 'personal'
            }).catch(data => {  })
        },
        handleClick (name) {
            switch (name) {
            case 'logout':
                this.logout()
                break
            case 'message':
                this.message()
                break
            case 'personal':
                this.personal()
                break
            }
        }
    }
}
</script>
