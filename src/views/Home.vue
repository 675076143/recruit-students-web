<template>
  <div class="home">
    <top-bar></top-bar>
    <left-nav></left-nav>
    <div id="main">
      <router-view/>
    </div>
  </div>
</template>
<style scoped lang="less">
.home{
  width: 100%;
  #main{
    padding-left:190px;
    padding-top: 59px;
    height: 100%;
    width: 100%;
  }
}
</style>
<script>
import store from '../store/index'
import LeftNav from "../components/LeftNav";
import TopBar from "../components/TopBar";
import storageUtils from "../util/storageUtils";
export default {
  name: 'home',
  components: {
    TopBar,
    LeftNav
    // HelloWorld
  }
}
</script>
