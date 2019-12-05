<template>
    <Menu :theme="theme" class="my-menu" @on-select="redirect">
        <MenuItem name="/user">
            <Icon type="ios-contact" />
            用户管理
        </MenuItem>
        <MenuItem name="/role">
            <Icon type="ios-alert" />
            角色管理
        </MenuItem>
    </Menu>
</template>

<script>
    export default {
        name: "MyMenu",
        data(){
            return{
                theme:"dark"
            }
        },
        methods:{
            redirect(name){
                // console.log("redirect=>",name)
                this.$router.push(name)
            }
        }
    }
</script>

<style scoped lang="less">
.my-menu{
    position: fixed;
    top: 49px;
    left: 0;
    z-index: 1000;
    height: 100%;
    width: 180px !important;
}
</style>