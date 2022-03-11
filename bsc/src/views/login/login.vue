<template>
  <div class="login">
    <header-title></header-title>
    <div class="main">
      <div class="form">
        <div class="row">
          <div class="label">BSC Address：</div>
          <div class="ipt">
            <input
              type="text"
              v-model="address"
              placeholder="please input bsc-address to receive hop token"
            />
          </div>
          <div class="alt">
            Note: please read this article
            <a :href="downloadUrl" target="_blank">< hop-eth-bsc-swap.pdf ></a
            >to know how to get bsc address
          </div>
        </div>
        <div class="row">
          <div class="label">Verify Code：</div>
          <div class="ipt">
            <input
              type="text"
              v-model="code"
              placeholder="please input the verify code on picture"
            />
          </div>
          <div class="identify" @click="handleRefreshCode()">
            <Identify :identifyCode="identifyCode"></Identify>
          </div>
        </div>
        <div class="btn">
          <span class="act" @click="submit">Submit</span>
          <span @click="reset">Reset</span>
        </div>
      </div>
      <div class="tips">
        <div class="item">
          <i>1</i>
          <span
            >Please allow the browser to display the pop-up box, otherwise the
            mapping may not be completed normally; after the submission is
            successful, you will get a unique ETH recycling address for you,
            please keep this recycling address in mind, after the mapping
            starts, please send the original Hop ERC-20 Tokens are transferred
            to this unique address, and Hop will transfer the new bsc hop coins
            to the bsc address you submitted within 7 working days after
            receiving the tokens.</span
          >
        </div>
        <div class="item">
          <i>2</i>
          <span
            >For the safety of your assets, please look for the only recycling
            address that belongs to you, and do not trust the recycling address
            provided by any self-proclaimed official email, telegram, WeChat or
            Twitter. If you have not received the new INVE coins within 7
            working days after the transfer, please back up the transfer
            screenshots and other information, and contact our staff.</span
          >
        </div>
      </div>
    </div>
    <div class="modal-alt" v-show="modalShow">
      <div class="title">
        <p>You have successfully submitted,</p>
        <p>please record the recycling address and take a screenshot</p>
      </div>
      <div class="center">
        <h1><span>BSC Address：</span>{{ recycle_address }}</h1>
        <h1>
          <span>Recycle Addres On ETH：</span>{{ target_address }}
          <img
            v-clipboard:copy="target_address"
            v-clipboard:success="copySuccess"
            src="../../assets/image/icon-copy.png"
            alt="copy"
          />
        </h1>
        <p>
          (please send hop token into this recycle address on ether network)
        </p>
      </div>
      <div class="bottom">
        <span @click="modalShow = false">close</span>
      </div>
    </div>
    <div class="modal-bg" v-show="modalShow" @click="modalShow = false"></div>
    <!-- 错误提示 -->
    <div class="modal-alt error" v-show="errShow">
      <div class="title">error</div>
      <div class="center">
        <h2 v-if="nullValue">
          BSC address and verification code cannot be empty
        </h2>
        <h2 v-else>Incorrect verification code</h2>
      </div>
      <div class="bottom">
        <span @click="errShow = false">close</span>
      </div>
    </div>
    <div class="modal-bg" v-show="errShow" @click="errShow = false"></div>
  </div>
</template>

<script>
import { baseUrl, api } from "@/api/api";
import HeaderTitle from "@/components/HeaderTitle.vue";
import Identify from "@/components/Identity.vue";
export default {
  data() {
    return {
      address: "",
      code: "",
      identifyCode: "", // 验证码初始值
      identifyCodes: "1234567890", // 验证码的随机取值范围
      recycle_address: "",
      target_address: "",
      modalShow: false,
      errShow: false,
      nullValue: true,
      downloadUrl: "",
    };
  },
  components: {
    HeaderTitle,
    Identify,
  },
  created() {
    this.handleRefreshCode();
    this.downloadUrl = baseUrl + "/file/hop-eth-bsc-swap.pdf";
  },
  methods: {
    handleRefreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    randomNum(min, max) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min) + min);
    },
    makeCode(data, len) {
      for (let i = 0; i < len; i++) {
        this.identifyCode += data[this.randomNum(0, data.length - 1)];
      }
    },
    submit() {
      if (this.address.trim() == "" || this.code.trim() == "") {
        this.nullValue = true;
        this.errShow = true;
        return;
      }
      if (this.identifyCode != this.code) {
        this.nullValue = false;
        this.errShow = true;
        return;
      }
      this.code = "";
      this.handleRefreshCode();
      this.$http({
        method: "get",
        url: api.login,
        params: {
          target: this.address,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.recycle_address = res.data.recycle_address;
          this.target_address = res.data.target_address;
          this.modalShow = true;
        } else {
          this.$message(res.detail);
        }
      });
    },
    reset() {
      this.address = "";
      this.code = "";
      this.recycle_address = "";
      this.target_address = "";
    },
    copySuccess() {
      this.$message({
        message: "copy successfully",
        type: "success",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.modal-bg {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.4);
}
.modal-alt {
  position: fixed;
  z-index: 999;
  background: #fff;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  max-width: 850px;
  width: 80%;
  box-shadow: 0 0 10px #3c3c3c;
  &.error {
    top: 100px;
    transform: translate(-50%, 0);
  }
}
.modal-alt .title {
  padding: 30px;
  border-bottom: 1px solid #d0d0d0;
  text-align: center;
  font-size: 16px;
  line-height: 1.5;
}
.modal-alt .center {
  padding: 2% 12%;
  h1 {
    margin: 20px 0;
    font-size: 15px;
    color: #999;
    span {
      color: #333;
    }
    img {
      cursor: pointer;
      width: 20px;
      vertical-align: -4px;
      margin-left: 10px;
    }
  }
  h2 {
    text-align: center;
    font-size: 15px;
    color: #333;
    padding: 30px 0;
  }
  p {
    font-size: 15px;
    color: #999;
    margin-top: -5px;
    margin-bottom: 20px;
  }
}
.modal-alt .bottom {
  padding: 20px;
  border-top: 1px solid #d0d0d0;
  text-align: right;
  span {
    width: 110px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background: #596aff;
    color: #fff;
    font-size: 15px;
    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
  }
}
.main {
  background: url("../../assets/image/bg.png") no-repeat;
  background-size: cover;
  padding: 200px 5% 5% 5%;
  min-height: 100vh;
  box-sizing: border-box;
  .form {
    width: 800px;
    margin: 0 auto 120px;
    .row {
      position: relative;
      padding-bottom: 80px;
      display: flex;
      align-items: center;
      .label {
        width: 20%;
        min-width: 100px;
        font-size: 16px;
        color: #fff;
        text-align: right;
        padding-right: 10px;
      }
      .alt {
        position: absolute;
        bottom: 45px;
        text-align: center;
        color: #fff;
        left: 0;
        width: 100%;
        a {
          color: #ffd6d6;
        }
      }
      .ipt {
        flex: 1;
        input {
          width: 100%;
          background: #fff;
          border: none;
          outline: none;
          padding: 13px;
          border-radius: 5px;
          font-size: 16px;
          color: #333;
          box-sizing: border-box;
        }
      }
      .identify {
        width: 110px;
        margin-left: 20px;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        width: 160px;
        height: 40px;
        border-radius: 20px;
        background: #fff;
        text-align: center;
        line-height: 40px;
        margin: 0 15px;
        color: #333;
        cursor: pointer;
        &.act {
          color: #596aff;
        }
      }
    }
  }
  .tips {
    width: 1000px;
    margin: 0 auto;
    .item {
      margin-bottom: 20px;
      position: relative;
      padding-left: 30px;
      i {
        position: absolute;
        left: 0;
        top: 0;
        width: 22px;
        height: 22px;
        border-radius: 5px 5px 0 5px;
        background: #596aff;
        color: #fff;
        text-align: center;
        font-size: 12px;
        line-height: 22px;
      }
      span {
        font-size: 14px;
        color: #fff;
        line-height: 1.5;
        text-align: justify;
        display: inline-block;
      }
    }
  }
}
@media (max-width: 1200px) {
  .main {
    padding-top: 120px;
    .form {
      width: 100%;
      margin-bottom: 60px;
      .row {
        .label {
          font-size: 14px;
        }
        .ipt {
          input {
            font-size: 14px;
            padding: 10px;
          }
        }
      }
    }
    .tips {
      width: 100%;
      .item {
        span {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
