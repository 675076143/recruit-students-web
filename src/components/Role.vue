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
            <Form ref="formRole" :model="formRole" :rules="ruleRole" :label-width="80">
                <FormItem label="roleName" prop="roleName">
                    <Input v-model="formRole.roleName" placeholder="Enter your name" :disabled="formRole.roleName?true:false"></Input>
                </FormItem>
                <FormItem v-if="formRole.roleName">
                    <Tree :data="data4" show-checkbox multiple></Tree>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import {reqGetRoles, reqUpdateRolePermission} from "../api";

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
                }
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
            show(index){
                this.modalRole = true
                if(index!==-1){
                    this.formRole = this.data[index]
                    console.log(this.formRole)
                }
            },
            cancel(){
                this.formRole = {}
            },
            async updateOrCreate (option) {
                if(option==='update'){
                    //授权者是当前登录的用户
                    const authName = this.$store.state.user.userName
                    console.log(authName)
                    // const result = await reqUpdateRolePermission()
                }
            },
            remove (index) {
                this.data.splice(index, 1);
            },
            createRole(){

            }

        }
    }
</script>

<style scoped>

</style>