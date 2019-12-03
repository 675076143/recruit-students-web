<template>
    <div class="login">
        <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" class="login-form">
            <h1>Login</h1>
            <FormItem prop="userName">
                <Input type="text" v-model="formLogin.userName" placeholder="Username">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="formLogin.password" placeholder="Password">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <div class="login-form-operation">
                    <Checkbox v-model="remember">记住密码</Checkbox>
                    <a>忘记密码</a>
                </div>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formLogin')" long>Signin</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {reqLogin} from "../api";
    import store from '../store/index'
    import storageUtils from "../util/storageUtils";

    export default {
        name: "Login",
        data () {
            return {
                remember:false,
                formLogin: {
                    userName: '',
                    password: ''
                },
                ruleLogin: {
                    userName: [
                        { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate(async (valid) => {
                    if (valid) {
                        const {userName,password} = this.formLogin
                        const result = await reqLogin(userName,password,this)
                        if(result.code === '200'){
                            this.$Message.success("登录成功！")
                            store.commit('setUser',result.data)
                            this.$router.push("/")
                        }else {
                            this.$Message.error(result.message)
                        }
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
.login{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2c3e50;
    .login-form{
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,1);
        width: 90%;
        max-width: 350px;
        padding: 10px;

        h1{
          margin: 10px 0;
        }
        .login-form-operation{
            text-align: left;
        }
    }
}
</style>