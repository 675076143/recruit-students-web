<template>
    <div class="top-bar">
        <Icon type="ios-home" size="30" />
        <span>
            {{userInfo}}
            <a @click="logout">登出</a>
        </span>
    </div>
</template>

<script>
    import store from '../store'
    import storageUtils from "../util/storageUtils";
    export default {
        name: "TopBar",
        computed:{
            userInfo(){
                return "欢迎您："+store.state.user.userName
            }
        },
        methods:{
            logout(){
                store.commit('setUser',{})
                this.$router.push('/login')
                storageUtils.removeUser()
            }
        }
    }
</script>

<style scoped lang="less">
.top-bar{
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2c3e50;
    height: 49px;
    width: 100%;
    z-index: 999;
    color: white;
    padding: 10px;
    span{
        a{margin-left: 10px}
    }
}
</style>