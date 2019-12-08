<template>
    <Menu :theme="theme" class="left-nav" @on-select="redirect">
        <MenuItem name="/user">
            <Icon type="ios-contact" />
            用户管理
        </MenuItem>
        <MenuItem name="/role">
            <Icon type="ios-alert" />
            角色管理
        </MenuItem>
        <MenuItem name="/data">
            <Icon type="ios-alert" />
            数据录入
        </MenuItem>
        {{menus}}
    </Menu>
</template>

<script>
    import store from '../store'
    import menuConfig from "../config/menuConfig";

    export default {
        name: "LeftNav",
        mounted() {
            const {permissionName} = store.state.user
            this.permissionNames = permissionName
            console.log(permissionName)
            this.initMenu(menuConfig)
        },
        data(){
            return{
                theme:"dark",
                permissionNames:[],
                menus:[]
            }
        },
        methods:{
            redirect(name){
                // console.log("redirect=>",name)
                console.log('menus=>',this.menus)
                this.$router.push(name)
            },
            /**
             * 判断当前登录用户是否有权限
             */
            initMenu(menu){
                //map菜单栏
                const permissions = menu.map((value,key,arr)=>{
                    //遍历权限
                    for(let item of this.permissionNames){
                        if(item===value.key){
                            const {key,icon,title} = this.menus
                            this.menus.push({key,icon,title})
                        }
                    }
                    if(value.children){
                        this.initMenu(value.children)
                    }
                })

            }
        }
    }
</script>

<style scoped lang="less">
.left-nav{
    position: fixed;
    top: 49px;
    left: 0;
    z-index: 1000;
    height: 100%;
    width: 180px !important;
}
</style>