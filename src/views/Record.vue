<template>
  <div class="record">
    <section>
      <div style="padding:0 .2rem">
        <div class="form-line">
          <span>*预约人手机号</span>
          <input type="text" placeholder="请输入手机号" v-model="mobile" />
        </div>
      </div>
    </section>

    <section class="submit">
      <button @click="handleSubmit">查询</button>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import dayjs from "dayjs";
import VueQrcode from "vue-qr";
export default {
  name: "Record",
  data: function() {
    return {
      mobile: "",
      logoSrc: require("../assets/logo.png")
    };
  },
  components: { VueQrcode },
  methods: {
    handleSubmit() {
      if (!this.mobile) {
        this.$alert("预约人手机号为空或格式有误");
        return;
      }
      axios
        .get(
          `/hl/pro/scenery/appoint/list?tel=${
            this.mobile
          }&date=${dayjs().format("YYYY-MM-DD")}`
        )
        .then(res => {
          if (res.status === 200) {
            const data = res.data;
            if (data.code === "0") {
              this.$router.push({
                path: "/record-list",
                query: {
                  mobile: this.mobile,
                  list: data.data
                }
              });
              if (data.data.length === 0) {
                this.$alert("暂无记录");
              }
            } else {
              this.$alert(data.message);
            }
          } else {
            this.$alert("请求异常");
          }
        });
    }
  }
};
</script>

<style lang="scss">
.record {
  width: 7.5rem;
  padding: 0.4rem 0.3rem;
  section {
    margin-top: 0.3rem;
    h2 {
      font-size: 0.34rem;
    }
    > div {
      width: 100%;
      font-size: 0.28rem;
      margin-top: 0.2rem;
      &.section1 {
        height: 2rem;
      }
      &.section2 {
        height: auto;
      }
      .form-line {
        input {
          margin-top: 0.33rem;
          width: 6.5rem;
          height: 0.7rem;
          border: 1px solid rgba(220, 220, 220, 1);
          padding: 0 5px;
        }
        margin-bottom: 0.48rem;
      }
    }
    &.submit {
      // height: 10rem;
      width: 100%;
      button {
        display: block;
        margin: 0 auto;
        width: 5.6rem;
        height: 0.8rem;
        border: 1px solid rgba(12, 178, 219, 1);
        border-radius: 0.2rem;
        background: white;
        font-size: 0.3rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(12, 178, 219, 1);
      }
    }
  }
}
// 覆盖
.vdpClearInput {
  display: none;
}
</style>
