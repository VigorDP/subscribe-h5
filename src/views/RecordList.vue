<template>
  <div class="record">
    <section>
      <div style="padding:0 .2rem">
        <div class="form-line">
          <span>预约人手机号:&nbsp;{{ $route.query.mobile }}</span>
        </div>
        <div class="form-line">
          <span>当前查询日期:</span>
          <div class="date">{{ date.format("YYYY年MM月DD日") }}</div>
        </div>
      </div>
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
            <span>{{ item.idCard || "无" }}</span>
          </div>
          <div class="item">
            <span>状态：</span>
            <span
              :style="{
                color:
                  item.status === 1
                    ? 'green'
                    : item.status === 2
                    ? 'gray'
                    : 'red'
              }"
            >
              {{
                item.status === 1
                  ? "可用"
                  : item.status === 2
                  ? "已核销"
                  : "已过期"
              }}
            </span>
          </div>
        </div>
        <div class="right" @click="handleClick(item.code)">
          <vue-qrcode :text="item.code" :size="250" :logoSrc="logoSrc" />
          <span>景区预约码：{{ item.code }}</span>
        </div>
        <img class="label" :src="getImage(item)" />
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import dayjs from "dayjs";
import axios from "axios";
import VueQrcode from "vue-qr";
export default {
  name: "Record",
  data: function() {
    return {
      date: dayjs(),
      list: [],
      logoSrc: require("../assets/logo.png")
    };
  },
  components: { VueQrcode },
  beforeMount() {
    const mobile = this.$route.query.mobile;
    axios
      .get(
        `/hl/pro/scenery/appoint/list?tel=${mobile}&date=${dayjs().format(
          "YYYY-MM-DD"
        )}`
      )
      .then(res => {
        if (res.status === 200) {
          const data = res.data;
          if (data.code === "0") {
            this.list = data.data;
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
  },
  methods: {
    handleClick(code) {
      this.$router.push({
        path: "/record-success",
        query: {
          code
        }
      });
    },
    getImage(item) {
      return item.personTarget === 2
        ? require("../assets/child@2x.png")
        : require("../assets/adult@2x.png");
    }
  }
};
</script>

<style lang="scss" scoped>
.record {
  width: 7.5rem;
  padding: 0.4rem 0.3rem;
  section {
    margin-top: 0.3rem;
    > div {
      width: 100%;
      .form-line {
        span {
          font-size: 0.26rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
        }
        .date {
          width: 2.4rem;
          height: 0.7rem;
          line-height: 0.7rem;
          text-align: center;
          background: rgba(12, 178, 219, 1);
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          margin: 0 auto;
          margin-top: 0.3rem;
        }
      }
    }

    &.list {
      margin-top: 1rem;
      h2 {
        font-size: 0.3rem;
      }
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
        position: relative;
        .label {
          position: absolute;
          top: 0;
          right: 0;
          width: 0.7rem;
          height: 0.4rem;
        }
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
