<template>
  <div class="home">
    <div class="header">
      <img alt="Vue logo" src="../assets/bac@2x.png" />
    </div>
    <div class="content">
      <header>
        <h2 class="title">沣东·沣河生态景区入园预约</h2>
        <router-link to="/record">预约查询</router-link>
      </header>
      <p class="desc">
        为了保障景区安全及您的游览体验，请在下方完成入园预约并持二维码进入。
      </p>
      <section>
        <h2>*请选择预约时间</h2>
        <div class="select">
          <span
            >请选择时间：{{
              "已选择" +
                currentSelectedDay.format("MM月DD日") +
                (currentSelectedDuration === "am"
                  ? "上午(9:00-12:00)"
                  : "下午(14:00-17.00)")
            }}</span
          >
          <div class="time-list">
            <radio name="robot" :value="today" v-model="currentSelectedDay">
              {{ today.format("MM月DD日") }}
            </radio>
            <radio
              name="robot"
              :value="today_after_1"
              v-model="currentSelectedDay"
            >
              {{ today_after_1.format("MM月DD日") }}
            </radio>
            <radio
              name="robot"
              :value="today_after_2"
              v-model="currentSelectedDay"
            >
              {{ today_after_2.format("MM月DD日") }}
            </radio>
          </div>
          <div class="time-duration">
            <div
              class="item"
              :class="
                currentSelectedDuration === 'am'
                  ? `selected ${today_class}`
                  : `${today_class}`
              "
              @click="select('am')"
            >
              <span>上午（9:00-12:00)</span>
              <span>
                {{
                  ticket_currentSelectedDay_am > 100
                    ? "充足"
                    : ticket_currentSelectedDay_am === 0
                    ? "已售完"
                    : `剩余${ticket_currentSelectedDay_am}`
                }}
              </span>
            </div>
            <div
              class="item"
              :class="
                currentSelectedDuration === 'pm'
                  ? `selected ${today_after_1_class}`
                  : `${today_after_1_class}`
              "
              @click="select('pm')"
            >
              <span>下午（14:00-17:00）</span>
              <span>
                {{
                  ticket_currentSelectedDay_pm > 100
                    ? "充足"
                    : ticket_currentSelectedDay_pm === 0
                    ? "已售完"
                    : `剩余${ticket_currentSelectedDay_pm}`
                }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>*请完善预约信息</h2>
        <div class="form">
          <div class="form-line">
            <span>*预约人手机号</span>
            <input
              type="text"
              placeholder="请输入手机号"
              v-model="mobile"
              maxlength="11"
            />
          </div>
          <div class="form-group" v-for="(person, key) in persons" :key="key">
            <div class="form-line person-type">
              <span>*游客类型：</span>
              <div class="type">
                <radio
                  :name="'robot' + key"
                  value="1"
                  v-model="person.personTarget"
                >
                  成人
                </radio>
                <radio
                  :name="'robot' + key"
                  value="2"
                  v-model="person.personTarget"
                  :disabled="key === 0"
                >
                  儿童
                </radio>
              </div>
              <span class="add" @click="addOrDeletePerson(key)">{{
                key === 0 ? "添加" : "删除"
              }}</span>
            </div>
            <div class="form-line">
              <span>*入园人姓名</span>
              <input
                type="text"
                placeholder="请输入姓名"
                v-model="person.name"
              />
            </div>
            <div class="form-line">
              <span>{{
                person.personTarget === "1" ? "*入园人身份证" : "入园人身份证"
              }}</span>
              <input
                type="text"
                placeholder="请输入身份证号,儿童可不填"
                v-model="person.idCard"
                maxlength="18"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="submit">
        <button @click="handleSubmit">提交预约</button>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import axios from "axios";
import dayjs from "dayjs/esm";
import { Checkbox, Radio } from "vue-checkbox-radio";

Vue.component("radio", Radio);
export default {
  name: "Home",
  today: dayjs(),
  beforeMount() {
    this.getTicketInfo();
  },
  data: function() {
    return {
      mobile: "",
      today: dayjs(),
      today_after_1: dayjs().add(1, "day"),
      today_after_2: dayjs().add(2, "day"),
      currentSelectedDay: dayjs(), // 当前选择日期
      ticket_currentSelectedDay_am: 0,
      ticket_currentSelectedDay_pm: 0,
      currentSelectedDuration: "am",
      persons: [
        {
          personTarget: "1",
          name: "",
          idCard: ""
        }
      ]
    };
  },
  mounted() {
    this.currentSelectedDay = this.today;
  },
  computed: {
    today_class: function() {
      return this.ticket_currentSelectedDay_am > 0 ? "enough" : "finish";
    },
    today_after_1_class: function() {
      return this.ticket_currentSelectedDay_pm > 0 ? "enough" : "finish";
    }
  },
  methods: {
    select(duration) {
      this.currentSelectedDuration = duration;
    },
    addOrDeletePerson(key) {
      if (key === 0) {
        this.persons.push({ personTarget: "1", name: "", idCard: "" });
      } else {
        this.persons.splice(key, 1);
      }
    },
    getTicketInfo() {
      axios.get("/hl/pro/scenery/appoint/stat").then(res => {
        if (res.status === 200) {
          const data = res.data;
          if (data.code === "0") {
            const res = data.data;
            if (this.currentSelectedDay === this.today) {
              this.ticket_currentSelectedDay_am =
                res.amLimit - res.firstAmCount;
              this.ticket_currentSelectedDay_pm =
                res.pmLimit - res.firstPmCount;
            } else if (this.currentSelectedDay === this.today_after_1) {
              this.ticket_currentSelectedDay_am =
                res.amLimit - res.secondAmCount;
              this.ticket_currentSelectedDay_pm =
                res.pmLimit - res.secondPmCount;
            } else {
              this.ticket_currentSelectedDay_am =
                res.amLimit - res.thirdAmCount;
              this.ticket_currentSelectedDay_pm =
                res.pmLimit - res.thirdPmCount;
            }
          } else {
            this.$alert(data.message);
          }
        } else {
          this.$alert("请求异常");
        }
      });
    },
    handleSubmit() {
      if (!this.currentSelectedDay) {
        this.$alert("请选择预约时间");
        return;
      }
      if (!this.mobile) {
        this.$alert("预约人手机号格式有误");
        return;
      }
      for (let i = 0; i < this.persons.length; i++) {
        if (!this.persons[i].name) {
          this.$alert("请输入入园人姓名");
          return;
        }
        if (this.persons[i].personTarget === "1" && !this.persons[i].idCard) {
          this.$alert("入园人身份证为空或格式有误");
          return;
        }
      }

      axios
        .post("/hl/pro/scenery/appoint/submit", {
          appointDate: this.currentSelectedDay.format("YYYY-MM-DD"),
          list: this.persons,
          timeInterval: this.currentSelectedDuration === "am" ? 1 : 2,
          tel: this.mobile
        })
        .then(res => {
          if (res.status === 200) {
            const data = res.data;
            if (data.code === "0") {
              this.date = "";
              this.name = "";
              this.idCard = "";
              this.$router.push({
                path: "/record-success",
                query: {
                  mobile: this.mobile,
                  currentSelectedDay: this.currentSelectedDay
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
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      font-size: 0.3rem;
      color: rgba(12, 178, 219, 1);
      font-weight: bold;
    }
  }
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
    .select {
      padding: 0.2rem;
      font-size: 0.3rem;
      .time-list {
        margin-top: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .time-duration {
        width: 100%;
        font-size: 0.28rem;
        margin-top: 0.2rem;
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
          font-size: 0.24rem;

          span {
            color: white;
          }
          &.enough {
            background: #5fd240;
          }
          &.selected {
            background: #3699e3;
          }
          &.finish {
            background: #ada3a3;
          }
        }
      }
    }
    .form {
      .form-line {
        font-size: 0.3rem;
        padding: 0.2rem;
        input[type="text"] {
          margin-top: 0.3rem;
          width: 6.5rem;
          height: 0.7rem;
          border: 1px solid rgba(220, 220, 220, 1);
          padding: 0 5px;
        }
      }
      .form-group {
        width: 6.9rem;
        height: 4.5rem;
        border: 1px solid rgba(220, 220, 220, 1);
        border-radius: 0.1rem;
        margin: 0.28rem 0;
        .person-type {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .type {
            display: flex;
            justify-content: space-around;
            padding-right: 1.5rem;
            flex: 1;
          }
          .add {
            font-size: 0.3rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(12, 178, 219, 1);
          }
        }
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

  .radio-component {
    .input-box {
      border-color: lightgray;
      .input-box-circle {
        background: #3699e3;
      }
    }
  }
}
</style>
