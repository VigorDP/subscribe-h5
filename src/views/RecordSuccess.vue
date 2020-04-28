<template>
  <div class="record_success">
    <section>
      <div class="top">
        <div class="title">预约入场券</div>
        <div class="content">
          <span>{{ code }}</span>
          <vue-qrcode :text="code" :size="200" :logoSrc="logoSrc" />
        </div>
        <span class="tip">请截图保存当前页面，以作为核销凭证</span>
      </div>
      <div class="bottom">使用说明：请在景区入口出示工作人员进行核销</div>
    </section>
  </div>
</template>

<script>
import VueQrcode from "vue-qr";
export default {
  name: "Record",
  components: { VueQrcode },
  beforeMount() {
    const code = this.$route.query.code;
    this.code = code;
  },
  data: function() {
    return {
      code: "12345",
      logoSrc: require("../assets/logo.png")
    };
  }
};
</script>

<style lang="scss" scoped>
.record_success {
  width: 7.5rem;
  padding: 0.4rem 0.3rem;
  font-size: 0.3rem;
  section {
    width: 100%;
    height: 9rem;
    padding: 0.16rem;
    background: rgba(12, 178, 219, 1);
    box-shadow: 0px 1px 6px 0px rgba(110, 18, 0, 0.1);
    border-radius: 0.3rem 0.25rem 0.25rem 0.25rem;
    .top {
      height: 7.54rem;
      background: rgba(255, 255, 255, 1);
      border-radius: 0.2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.42rem;
      .title {
        width: 2.9rem;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        background: url(../assets/bg@2x.png) center/cover;
        font-size: 0.36rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .content {
        height: 4.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        span {
          font-size: 0.4rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          margin-top: 0.1rem;
        }
      }
      .tip {
        font-size: 0.34rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: red;
      }
    }
    .bottom {
      margin-top: 0.5rem;
      font-size: 0.24rem;
      font-family: PingFang SC;
      text-align: center;
      font-weight: 500;
      color: rgba(220, 248, 255, 1);
    }
  }
}
</style>
