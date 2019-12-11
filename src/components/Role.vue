<template>
    <div class="role">
        <Card>
            <p slot="title" style="text-align: left">
                <Icon type="md-alert" />
                角色管理
            </p>
            <Button slot="extra" type="primary" @click="show(-1)"><Icon type="md-add" />创建角色</Button>
            <Table class="user-table" border :columns="columns" :data="data" />
        </Card>
        <Modal
                v-model="modalRole"
                :title="formRole.roleName?'修改':'创建'"
                @on-ok="formRole.roleName?updateOrCreate('update'):updateOrCreate('create')"
                @on-cancel="cancel">
            <Form ref="formRole" :model="formRole" :rules="ruleRole" :label-width="100">
                <FormItem label="roleName" prop="roleName">
                    <Input v-model="formRole.roleName" placeholder="Enter your name" :disabled="formRole.roleName?true:false"></Input>
                </FormItem>
                <FormItem label="permissions" v-if="formRole.roleName">
                    <Tree :data="permissions" ref="tree" show-checkbox multiple></Tree>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import {reqGetRoleByID, reqGetRoles, reqUpdateRolePermission} from "../api";
    import menuConfig from "../config/menuConfig";

    export default {
        name: "Role",
        data () {
            return {
                columns: [
                    {
                        title: 'roleName',
                        key: 'roleName',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.roleName)
                            ]);
                        }
                    },
                    {
                        title: 'createTime',
                        key: 'createTime'
                    },
                    {
                        title: 'authTime',
                        key: 'authTime'
                    },
                    {
                        title: 'authName',
                        key: 'authName'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '授权'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, 'Delete')
                            ]);
                        }
                    }
                ],
                data: [],
                modalRole:false,
                formRole:{},
                ruleRole:{
                    roleName:[
                        { required: true, message: 'The roleName cannot be empty', trigger: 'blur' }
                    ],
                },
                user:this.$store.state.user,
                permissions:[],
                permissionsLoading:false
            }
        },
        mounted() {
            this.initRoles()
        },
        methods: {
            async initRoles(){
                const result = await reqGetRoles(this)
                if(result.code==="200"){
                    this.data = result.data
                    this.$Message.success("success")
                }else {
                    this.$Message.error("error")
                }
            },
            //显示模态框
            async show(index){
                if(index!==-1){
                    this.formRole = this.data[index]
                    //"加载数据"
                    const result = await reqGetRoleByID(this.formRole.roleID,this)
                    if(result.code==='200'){
                        this.formRole = result.data
                        //1.获取到角色权限
                        const permissions = this.generateMenuByMenuConfig(menuConfig)
                        this.permissions = permissions
                        //2.生成permissions-tree
                        //3.显示模态框
                        this.modalRole = true
                    }else {
                        this.$Message.error(result.message)
                    }
                }
            },
            cancel(){
                this.formRole = {}
            },
            async updateOrCreate (option) {
                if(option==='update'){
                    //授权者是当前登录的用户
                    const authName = this.$store.state.user.userName
                    const selectedTree = this.$refs.tree.getCheckedAndIndeterminateNodes()
                    const permissions = selectedTree.map(item=>item.key)
                    //更新角色权限-----
                    const result = await reqUpdateRolePermission(this.formRole.roleID,authName,permissions,this)
                    if(result.code==='200'){
                        this.$Message.success(result.message)
                    }else {
                        this.$Message.error(result.message)
                    }
                }
            },
            remove (index) {
                this.data.splice(index, 1);
            },
            createRole(){

            },
            //获取当前修改的用户权限
            permission(item){
                const {isPublic} = item
                const {rolePermissions} = this.formRole
                /**
                 * 1.当前用户是admin
                 * 2.当前item是公开的
                 * 3.当前用户拥有此item的权限
                 */

                if(isPublic||rolePermissions.indexOf(item.key)!==-1){
                    return true
                }
                else if (item.children){
                    //4. 如果当前用户有此item的某个子item的权限
                    return !!item.children.find(child=>rolePermissions.indexOf(child.key)!==-1);
                }
                else {
                    return false
                }
            },
            /**
             * 使用reduce动态生成菜单
             * */
            generateMenuByMenuConfig(menuConfig){
                menuConfig = [...menuConfig]
                //得到当前请求的路由路径
                const path = this.$route.path
                return menuConfig.reduce((pre,cur)=>{
                    //先去除所有节点的选中状态
                    cur.checked=false
                    if(this.permission(cur)){//一级菜单
                        if(!cur.children){
                            //设置为选中
                            cur.checked=true
                            pre.push(cur)
                        }else {
                            pre.push({
                                key:cur.key,
                                icon:cur.icon,
                                title:cur.title,
                                checked:false,
                                children:this.generateMenuByMenuConfig(cur.children)
                            })
                        }
                    }else {
                        //不设置为选中，直接push
                        //由于之后push会把之前的选中状态覆盖掉，所以这里重新将其赋值
                        let children
                        if(cur.children){
                            children = cur.children.map(item=>{
                                item.checked = false
                                return item
                            })
                        }
                        pre.push({
                            title:cur.title,
                            key:cur.key,
                            icon:cur.icon,
                            children
                        })
                    }
                    return pre
                },[])
            }

        },
    }
</script>

<style scoped>

</style>