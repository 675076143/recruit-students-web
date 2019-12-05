<template>
    <div class="user">


        <Card>
            <p slot="title" style="text-align: left">
                <Icon type="ios-contact" />
                用户管理
            </p>
            <Button slot="extra" type="primary" @click="show(-1)"><Icon type="md-add" />创建用户</Button>
            <Table class="user-table" border :columns="columns" :data="data" />
        </Card>

        <Modal
                v-model="modalEdit"
                :title="modalEditData.userID?'修改用户':'创建用户'"
                @on-ok="modalEditData.userID?updateOrCreateUser('update'):updateOrCreateUser('create')"
                @on-cancel="cancel">
            <Form :model="modalEditData" :label-width="80">
                <FormItem label="userName">
                    <Input v-model="modalEditData.userName" :disabled="modalEditData.userID?true:false" />
                </FormItem>
                <FormItem label="email">
                    <Input v-model="modalEditData.email" />
                </FormItem>
                <FormItem label="phone">
                    <Input v-model="modalEditData.phone" />
                </FormItem>
                <FormItem label="roleName">
                    <CheckboxGroup  v-model="modalEditData.roleName">
                        <Checkbox  v-for="role in roles" :label="role.roleName">{{role.roleName}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>

        </Modal>
    </div>



</template>

<script>
    import {reqCreateUser, reqGetAllRoles, reqGetAllUsers, reqUpdateUser, reqUpdateUserInRoleName} from "../api";

    export default {
        name: "User",
        data () {
            return {
                modalEdit:false,
                modalEditData:{},
                roles:[],
                columns: [
                    {
                        title: 'userName',
                        key: 'userName',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.userName)
                            ]);
                        }
                    },
                    {
                        title: 'userState',
                        key: 'userState',
                        render: (h, params) => {
                            return h('div', [
                                params.row.userState?'可用':'禁用'
                            ]);
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: 'email',
                        key: 'email'
                    },
                    {
                        title: 'phone',
                        key: 'phone'
                    },
                    {
                        title: 'roleName',
                        key: 'roleName',
                        render:(h,params)=>{
                            return params.row.roleName.map((value)=>{
                                return value+'  '
                            })
                        }
                    },
                    {
                        title: 'Action',
                        key: 'action',
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
                                }, 'Edit'),
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
                    },

                ],
                data: [
                ]
            }
        },
        methods: {
            async initUsers(){
                const userList = await reqGetAllUsers(this)
                const roles = await reqGetAllRoles(this)
                this.data = userList.data
                this.roles = roles.data
                console.log(roles)
                console.log(userList)
            },
            show (index) {
                // this.$Modal.info({
                //     title: 'User Info',
                //     content: `Name：${this.data[index].userName}<br>
                //               userState：${this.data[index].userState}`
                // })
                this.modalEdit=true
                if(index!=-1){
                    this.modalEditData = this.data[index]
                }
            },
            remove (index) {
                this.data.splice(index, 1);
            },
            async updateOrCreateUser (option) {
                const {userName,userID,email,phone,roleName} = this.modalEditData
                //判断是更新操作还是删除操作
                if(option==='update'){
                    const result = await reqUpdateUser(userID,email,phone,this)
                    if(result.code==="200"){
                        const result = await reqUpdateUserInRoleName({userID,roleName},this)
                        if(result.code==="200"){
                            this.$Message.success("更新成功！")
                            this.initUsers()
                        }else {
                            this.$Message.error("更新失败！")
                        }
                    }else {
                        this.$Message.error("更新失败")
                    }
                }else {
                    const result = await reqCreateUser(userName,email,phone,this)
                    const userID = result.data.userID
                    if(result.code==="200"){
                        const result = await reqUpdateUserInRoleName({userID,roleName},this)
                        if(result.code==="200"){
                            this.$Message.success("创建成功！")
                            this.initUsers()
                        }else {
                            this.$Message.error("创建失败！")
                        }
                    }else {
                        this.$Message.error("创建失败")
                    }
                }
                //更新结束后应该将数据清除
                this.modalEditData=[]

            },
            async createUser(){
                this.$Message
            },
            cancel () {
                this.$Message.info('Clicked cancel');
                this.modalEditData=[]
            }
        },
        mounted() {
            this.initUsers()
        }
    }
</script>

<style scoped lang="less">
.user{
    width: 100%;
}
</style>