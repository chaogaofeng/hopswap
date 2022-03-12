<template>
  <div class="header">
    <router-link to="/" class="logo">
        <img src="../assets/image/logo.png" alt="logo">
    </router-link>
    <div class="person">
      <img src="../assets/image/headerImg.jpg">
      <span>admin</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 100;
  width: 100%;
  height: 70px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  box-shadow: 0px 7px 16px 0px rgba(0, 0, 0, 0.09);
  .logo {
    width: 159px;
    display: block;
    img{
      width: 100%;
    }
  }
  .person{
    display: flex;
    align-items: center;
    img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    span{
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
