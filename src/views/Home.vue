<template>
  <div class="home">
    <div class="header">
      <img alt="Vue logo" src="../assets/bac@2x.png" />
    </div>
    <div class="content">
      <h2 class="title">沣东·沣河生态景区入园预约</h2>
      <p class="desc">
        为了保障景区安全及您的游览体验，请在下方完成入园预约并持二维码进入。
      </p>
      <section>
        <h2>*当前票源信息</h2>
        <div class="section1">
          <div class="line">
            <div class="item" :class="today_class">
              <span>{{ today }}</span>
              <span>{{
                ticket_today > 100
                  ? "充足"
                  : ticket_today === 0
                  ? "已售完"
                  : `剩余${ticket_today}`
              }}</span>
            </div>
            <div class="item" :class="today_after_1_class">
              <span>{{ today_after_1 }}</span>
              <span>{{
                ticket_today_after_1 > 100
                  ? "充足"
                  : ticket_today_after_1 === 0
                  ? "已售完"
                  : `剩余${ticket_today_after_1}`
              }}</span>
            </div>
          </div>
          <div class="line">
            <div class="item" :class="today_after_2_class">
              <span>{{ today_after_2 }}</span>
              <span>{{
                ticket_today_after_2 > 100
                  ? "充足"
                  : ticket_today_after_2 === 0
                  ? "已售完"
                  : `剩余${ticket_today_after_2}`
              }}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>*请完善预约信息</h2>
        <div style="padding:0 .2rem">
          <div class="form-line">
            <span>*预约时间</span>
            <date-pick
              v-model="date"
              :isDateDisabled="isFutureDate"
              :inputAttributes="{ readonly: true }"
              :startWeekOnSunday="true"
              :weekdays="[
                '周一',
                '周二',
                '周三',
                '周四',
                '周五',
                '周六',
                '周日'
              ]"
              :months="[
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
              ]"
            ></date-pick>
          </div>
          <div class="form-line">
            <span>*预约人手机号</span>
            <input type="text" placeholder="请输入手机号" v-model="mobile" />
          </div>
          <div class="form-line">
            <span>*入园人姓名</span>
            <input type="text" placeholder="请输入姓名" v-model="name" />
          </div>
          <div class="form-line">
            <span>*入园人身份证</span>
            <input type="text" placeholder="请输入身份证号" v-model="idCard" />
          </div>
        </div>
      </section>

      <section class="submit">
        <button @click="handleSubmit">提交预约</button>
        <button><router-link to="/record">预约查询</router-link></button>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import DatePick from "vue-date-pick";
import dayjs from "dayjs/esm";
import "vue-date-pick/dist/vueDatePick.css";
export default {
  name: "Home",
  today: dayjs(),
  beforeMount() {
    this.getTicketInfo();
  },
  data: function() {
    return {
      date: "",
      mobile: "",
      name: "",
      idCard: "",
      ticket_today: 0,
      ticket_today_after_1: 0,
      ticket_today_after_2: 0,
      today: dayjs().format("MM月DD日"),
      today_after_1: dayjs()
        .add(1, "day")
        .format("MM月DD日"),
      today_after_2: dayjs()
        .add(2, "day")
        .format("MM月DD日")
    };
  },
  computed: {
    today_class: function() {
      return this.ticket_today > 100
        ? "enough"
        : this.ticket_today === 0
        ? "finish"
        : "left";
    },
    today_after_1_class: function() {
      return this.ticket_today_after_1 > 100
        ? "enough"
        : this.ticket_today_after_1 === 0
        ? "finish"
        : "left";
    },
    today_after_2_class: function() {
      return this.ticket_today_after_2 > 100
        ? "enough"
        : this.ticket_today_after_2 === 0
        ? "finish"
        : "left";
    }
  },
  components: { DatePick },
  methods: {
    isFutureDate(date) {
      const currentDate = new Date() - 1 * 24 * 60 * 60 * 1000;
      return date < currentDate;
    },
    getTicketInfo() {
      axios.get("/hl/pro/scenery/appoint/stat").then(res => {
        if (res.status === 200) {
          const data = res.data;
          if (data.code === "0") {
            const res = data.data;
            this.ticket_today = res.dayLimit - res.firstCount;
            this.ticket_today_after_1 = res.dayLimit - res.secondCount;
            this.ticket_today_after_2 = res.dayLimit - res.thirdCount;
          } else {
            this.$alert(data.message);
          }
        } else {
          this.$alert("请求异常");
        }
      });
    },
    handleSubmit() {
      if (!this.date) {
        this.$alert("请选择预约时间");
        return;
      }
      if (!this.mobile) {
        this.$alert("预约人手机号手机号格式有误");
        return;
      }
      if (!this.name) {
        this.$alert("*请输入预约人姓名");
        return;
      }
      if (!this.idCard) {
        this.$alert("预约人身份证格式有误");
        return;
      }
      axios
        .post("/hl/pro/scenery/appoint/submit", {
          appointDate: this.date,
          idCard: this.idCard,
          name: this.name,
          tel: this.mobile
        })
        .then(res => {
          if (res.status === 200) {
            const data = res.data;
            if (data.code === "0") {
              this.date = "";
              this.mobile = "";
              this.name = "";
              this.idCard = "";
              this.$router.push({
                path: "/record-success",
                query: {
                  code: data.data
                }
              });
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
.header {
  width: 7.5rem;
  height: 4rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.content {
  width: 7.5rem;
  padding: 0.4rem 0.3rem;
  .title {
    font-size: 0.34rem;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(34, 34, 34, 1);
  }
  .desc {
    font-size: 0.3rem;
    font-family: PingFang SC;
    color: rgba(102, 102, 102, 1);
    margin-top: 0.3rem;
    line-height: 1.5;
  }
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
      .line {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          width: 2.76rem;
          height: 0.8rem;
          padding: 0.1rem;
          font-size: 0.24rem;

          span {
            color: white;
          }
          &.enough {
            background: #5fd240;
          }
          &.left {
            background: #3699e3;
          }
          &.finish {
            background: #ada3a3;
          }
        }
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
        &:last-child {
          margin-top: 0.3rem;
        }
        a {
          color: rgba(12, 178, 219, 1);
        }
      }
    }
  }

  // 覆盖
  .vdpClearInput {
    display: none;
  }
}
</style>
