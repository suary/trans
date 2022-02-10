<template>
  <div class="analysis">
    <van-tabs v-model="active" color="#1989fa">
      <van-tab title="按月">
        <div class="analysis_top">
          <div @click="showPopup">
            {{ date }}
            <van-icon name="arrow-down" />
          </div>
          <van-popup v-model="show" position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="year-month"
              title="选择年月"
              :min-date="minDate"
              :formatter="formatter"
              @confirm="confirm"
              @cancel="show = false"
            />
          </van-popup>
          <!-- <van-radio-group v-model="radio" direction="horizontal">
            <van-radio :name="1">收入</van-radio>
            <van-radio :name="2">支出</van-radio>
          </van-radio-group> -->
        </div>
        <div class="word">
          <span>收入{{incomeCount}}笔</span>
          <span>{{income}}元</span>
          <br>
          <span>支出{{expenditureCount}}笔</span>
          <span>{{expenditure}}元</span>
        </div>
        <!-- <div class="word">¥：***</div> -->
        <div class="card">
          <ve-line :data="chartData" height="300px" width="100%"></ve-line>
        </div>
        <div class="card">
          <div style="margin-left: 10px; font-size: 15px">排行榜</div>
              <list-component :date="date" :sort="true" />
        </div>
      </van-tab>
      <van-tab title="按年"
        ><div class="analysis_top">
          <div @click="showPopupyear">
            {{ year }}
            <van-icon name="arrow-down" />
          </div>
          <van-popup v-model="showyear" position="bottom">
            <van-picker
              title="标题"
              show-toolbar
              :columns="columns"
              @confirm="onConfirm"
              @cancel="onCancel"
            />
          </van-popup>
          <!-- <van-radio-group v-model="radioyear" direction="horizontal">
            <van-radio name="1">收入</van-radio>
            <van-radio name="2">支出</van-radio>
          </van-radio-group> -->
        </div>
        <div class="word">
          <span>收入{{incomeCount}}笔</span>
          <span>{{income}}元</span>
          <br>
          <span>支出{{expenditureCount}}笔</span>
          <span>{{expenditure}}元</span>
        </div>
        <!-- <div class="word">¥：***</div> -->
        <div class="card">
          <ve-line :data="chartData" height="300px" width="100%"></ve-line>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import moment from "moment";
import listComponent from './listcomponent'

export default {
  components:{
    listComponent:listComponent
  },
  data() {
    return {
      active: 0,
      date: moment().format("YYYY-MM"),
      minDate: new Date(2020, 0, 1),
      currentDate: new Date(),
      show: false,
      radio: 1,
      year: moment().year(),
      columns: [],
      showyear: false,
      radioyear: 1,
      income:0,
      expenditure:0,
      incomeCount:0,
      expenditureCount:0,
      list: [{ pirce: "20", dec: "轮胎", value: "12-9" }],
      chartData: {
        columns: ["时间", "收入", "支出"],
        rows: [
          { 时间: "22", 收入: 32371 },
          { 时间: "23", 收入: 12328 },
          { 时间: "24", 收入: 92381 },
        ],
      },
    };
  },
  watch: {
    active(value) {
      if (value) {
        this.getYear();
      } else {
        this.getMonth();
      }
    },
    date() {
      this.getMonth();
    },
    year() {
      this.getYear();
    },
  },
  mounted() {
    this.getMonth();
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    showPopupyear() {
      this.columns = [];
      for (let a = 2020; a <= moment().year(); a++) {
        this.columns.push(a);
      }

      this.showyear = true;
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    confirm(time) {
      console.log(time);
      this.date = moment(time).format("YYYY-MM");
      this.show = false;
    },
    onConfirm(value) {
      this.year = value;
      this.showyear = false;
    },
    onCancel() {
      this.showyear = false;
    },
    getYear() {
      this.incomeCount = 0;
      this.expenditureCount = 0;
      this.income=0;
      this.expenditure=0;
      this.$http.get("/api/chartyear/" + this.year).then((res) => {
        this.chartData.rows = res.map((item) => {
          this.incomeCount+=item.incomeCount
          this.expenditureCount+=item.expenditureCount
          return {
            时间: item.month,
            收入: item.income,
            支出: item.expenditure,
          };
        });
      });
      this.$http.get(`/api/collection/${this.date}`).then((res) => {
        this.income = res.income;
        this.expenditure = res.expenditure;
      });
    },
    getMonth() {
      this.incomeCount = 0;
      this.expenditureCount = 0;
      this.income=0;
      this.expenditure=0;
      this.$http.get("/api/chartmonth/" + this.date).then((res) => {
        this.chartData.rows = res.map((item) => {
          this.incomeCount += item.incomeCount;
          this.expenditureCount += item.expenditureCount;
          return { 时间: item.date, 收入: item.income, 支出: item.expenditure };
        });
      });
      this.$http.get(`/api/collection/${this.date}`).then((res) => {
        this.income = res.income;
        this.expenditure = res.expenditure;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.analysis {
  background: #f7f8fa;
  height: 100vh;
  .analysis_top {
    display: flex;
    justify-content: space-around;
    font-size: 16px;
    margin-top: 10px;
    padding: 10px;
  }
  .word {
    font-size: 20px;
    margin-top: 10px;
    padding-left: 10px;
  }
  .card {
    background: #ffff;
    margin: 10px;
    border-radius: 5px;
    padding-top: 10px;
  }
}
</style>
