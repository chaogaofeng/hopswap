<template>
  <div class="login">
    <div class="main">
      <div class="tit">
        <img src="../../assets/image/logo.png" alt="logo" />
        <p>HOP-ETH兑换HOP-BSC控制台</p>
      </div>
      <div class="form">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="ruleForm"
        >
          <div class="title"><span>账户密码登录</span></div>
          <div class="ipt">
            <el-form-item prop="name">
              <el-input
                placeholder="请输入账号"
                prefix-icon="el-icon-user"
                v-model="ruleForm.name"
              >
              </el-input
            ></el-form-item>
          </div>
          <div class="ipt">
            <el-form-item prop="pass">
              <el-input
                show-password
                placeholder="请输入密码"
                prefix-icon="el-icon-s-goods"
                v-model="ruleForm.pass"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="autologin">
            <el-checkbox v-model="checked">自动登录</el-checkbox>
          </div>
          <div class="submit">
            <el-button type="primary" size="medium" @click="login('ruleForm')"
              >登录</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="info">copyright © HOP 开源基金会</div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
export default {
  data() {
    var validatename = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    var validatepass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        pass: "",
      },
      checked: false,
      rules: {
        name: [{ validator: validatename, trigger: "blur" }],
        pass: [{ validator: validatepass, trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            method: "post",
            url: api.login,
            data: {
              password: this.ruleForm.pass,
              user: this.ruleForm.name,
            },
          }).then((rel) => {
            console.log(rel);
            if (rel.code == 200) {
              this.$router.push(this.$route.query.redirect || "/");
            } else {
              this.$message({
                message: rel.message,
                type: "error",
              });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  background: url("../../assets/image/bg.jpg") no-repeat;
  background-size: cover;
  min-height: 100vh;
  box-sizing: border-box;
  .tit {
    padding: 70px 0 50px;
    text-align: center;
    img {
      display: block;
      margin: 0 auto 20px;
      width: 140px;
    }
    p {
      color: #666;
      font-size: 15px;
    }
  }
  .form {
    width: 400px;
    margin: 0 auto 100px;
    .title {
      margin-bottom: 30px;

      text-align: center;
      span {
        display: inline-block;
        color: #596aff;
        font-size: 18px;
        border-bottom: 1px solid #596aff;
        padding: 15px;
      }
    }
    .ipt {
      margin-bottom: 20px;
    }
    .autologin {
      padding: 0 0 20px;
    }
    .submit {
      padding: 20px 0;
      button {
        height: 45px;
        width: 100%;
        background: #596aff;
      }
    }
  }
  .info {
    text-align: center;
    color: #666;
    font-size: 14px;
  }
}
</style>
