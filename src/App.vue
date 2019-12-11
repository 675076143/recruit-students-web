<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/login">Login</router-link>-->
<!--    </div>-->
    <router-view/>
  </div>
</template>
<script>
    import storageUtils from "./util/storageUtils";
    import store from "./store";

    export default {
        created() {
            //从localStorage中读取用户信息
            if(storageUtils.getUser()){
                store.commit('setUser',storageUtils.getUser())
                console.log('store中保存user信息')
                console.log(store.state.user)
            }
            //如果没有user信息, 重定向到登录页面
            if(!store.state.user.token){
                console.log('store中没有user信息,重定向到登录')
                this.$router.push('/login')
                console.log(store.state.user)
            }
        },
        mounted() {

        }
    }

</script>
<style lang="less">
html,body{
    height: 100%;
    width: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
