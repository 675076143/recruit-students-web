<template>
    <Menu :theme="theme" class="left-nav" @on-select="redirect">
        <MenuItem :name="menu.key" v-for="menu in menus" v-if="!menu.children">
            <Icon :type="menu.icon" />
            {{menu.title}}
        </MenuItem>
        <Submenu :name="menu.key" v-for="menu in menus" v-if="menu.children" class="sub-menu">
            <template slot="title">
                <Icon :type="menu.icon" />
                {{menu.title}}
            </template>
            <MenuItem :name="child.key" v-for="child in menu.children">
                {{child.title}}
            </MenuItem>
        </Submenu>
    </Menu>
</template>

<script>
    import store from '../store'
    import menuConfig from "../config/menuConfig";

    export default {
        name: "LeftNav",
        mounted() {
            console.log('LefNav-mounted')
            const {permissionName} = store.state.user
            this.permissionNames = permissionName
            console.log(store.state.user)
            const menus = this.generateMenuByMenuConfig(menuConfig)
            this.menus = menus
            console.log("生成的menu=>",menus)
        },
        data(){
            return{
                user:store.state.user,
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
            * 使用reduce动态生成菜单
            * */
            generateMenuByMenuConfig(menuConfig){
                menuConfig = [...menuConfig]
                console.log(menuConfig)
                //得到当前请求的路由路径
                const path = this.$route.path
                return menuConfig.reduce((pre,cur)=>{
                    if(this.permission(cur)){//一级菜单
                        if(!cur.children){
                            pre.push(cur)
                        }else {
                            pre.push({
                                key:cur.key,
                                icon:cur.icon,
                                title:cur.title,
                                children:this.generateMenuByMenuConfig(cur.children)
                            })
                        }
                    }
                    return pre
                },[])
            },
            /**
             * 判断当前登录用户是否有权限
             */
            permission(item){
                const {isPublic} = item
                const {userName,permissionName} = this.user
                /**
                 * 1.当前用户是admin()
                 * 2.当前item是公开的
                 * 3.当前用户拥有此item的权限
                 */

                if(userName==='admin'||isPublic||permissionName.indexOf(item.key)!==-1){
                    console.log('permission-item=>',item.key)
                    return true
                }
                else if (item.children){
                    console.log("子item有权限")
                    //4. 如果当前用户有此item的某个子item的权限
                    console.log('permission-child-item=>',item.children.key)
                    return !!item.children.find(child=>permissionName.indexOf(child.key)!==-1);
                }
                else {
                    console.log("permission-没有权限=>",item)
                    return false
                }
            }
        },
        computed:{
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
.ivu-menu-item,.sub-menu{
    text-align: left!important;
}
</style>