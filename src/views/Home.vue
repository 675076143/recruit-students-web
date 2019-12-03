<template>
  <div class="home">
    <top-bar></top-bar>
    <MyMenu></MyMenu>
  </div>
</template>

<script>
import store from '../store/index'
import MyMenu from "../components/MyMenu";
import TopBar from "../components/TopBar";
export default {
  name: 'home',
  components: {
    TopBar,
    MyMenu
    // HelloWorld
  },
  mounted() {
    //如果没有user信息, 重定向到登录页面
    if(!store.state.user.token){
      this.$router.push('/login')
      console.log(store.state.user)
    }
  }
}
</script>
