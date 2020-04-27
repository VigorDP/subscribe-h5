<template>
  <div class="record">
    <section>
      <div style="padding:0 .2rem">
        <div class="form-line">
          <span>*预约人手机号</span>
          <input type="text" placeholder="请输入手机号" v-model="mobile" />
        </div>
        <div class="form-line">
          <span>*预约时间</span>
          <date-pick v-model="date"></date-pick>
        </div>
      </div>
    </section>

    <section class="submit">
      <button @click="handleSubmit">查询</button>
    </section>

    <section class="list">
      <div class="record-line" v-for="item in list" :key="item.id">
        <div class="left">
          <div class="item">
            <span>入园人姓名：</span>
            <span>{{ item.name }}</span>
          </div>
          <div class="item">
            <span>入园人身份证号：</span>
            <span>{{ item.idCard }}</span>
          </div>
          <div class="item">
            <span>状态：</span>
            <span>{{ item.status }}</span>
          </div>
        </div>
        <div class="right">
          <vue-qrcode :value="item.code" />
          <span>景区预约码：{{ item.code }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import dayjs from "dayjs";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";
import VueQrcode from "vue-qrcode";
export default {
  name: "Record",
  data: function() {
    return {
      mobile: "",
      date: "",
      list: []
    };
  },
  components: { DatePick, VueQrcode },
  methods: {
    handleSubmit() {
      this.list = [];
      if (!this.mobile) {
        this.$alert("预约人手机号为空或格式有误");
        return;
      }
      if (!this.date) {
        this.$alert("预约人手机号为空或格式有误");
        return;
      }
      axios
        .get(
          `/hl/pro/scenery/appoint/list?tel=${this.mobile}&date=${dayjs(
            this.date
          ).format("YYYY-MM-DD")}`
        )
        .then(res => {
          if (res.status === 200) {
            const data = res.data;
            if (data.code === "0") {
              this.list = data.data;
              if (this.list.length === 0) {
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

    &.list {
      margin-top: 1rem;
      .record-line {
        width: 6.34rem;
        margin: 0 auto;
        margin-bottom: 0.4rem;
        height: 2.93rem;
        border-radius: 0.16rem;
        text-align: center;
        border: 1px solid rgba(187, 187, 187, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left,
        .right {
          padding: 0.1rem;
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          left: 681px;
          color: rgba(16, 16, 16, 1);
          font-size: 0.28rem;
        }
        .left {
          border-right: 1px solid rgba(187, 187, 187, 1);
          justify-content: space-between;
          .item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .right {
          align-items: center;
          justify-content: space-between;
          img {
            width: 2rem;
            height: 2rem;
          }
        }
      }
    }
  }
}
// 覆盖
.vdpClearInput {
  display: none;
}
</style>
