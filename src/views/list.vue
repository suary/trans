<template>
  <div class="list">
    <div class="list_top">
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
      <div class="word">
        收入：<span :style="{ color: '#07c160' }">{{ income }}</span
        ><br />
        支出：<span :style="{ color: '#ee0a24' }">{{ expenditure }}</span>
      </div>
      <div class="word" @click="()=>{this.$router.push('./analysis')}">收支分析<van-icon name="arrow" /></div>
    </div>
    <list-component :date="date" />
  </div>
</template>
<script>
import moment from "moment";
import listComponent from './listcomponent'
export default {
  components:{
    listComponent:listComponent
  },
  beforeCreate(){
    document.title="鼎旺物流-统计列表"
  },
  data() {
    return {
      show: false,
      minDate: new Date(2020, 0, 1),
      currentDate: new Date(),
      income: "",
      expenditure: "",
    };
  },
  watch: {
    date() {
      this.getcollection();
    },
  },
  computed: {
    date() {
      return moment(this.currentDate).format("YYYY-MM");
    },
  },
  mounted() {
    this.getcollection();
  },
  methods: {
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    showPopup() {
      this.show = true;
    },
    confirm() {
      this.show = false;
    },
    getcollection() {
      this.$http.get(`/api/collection/${this.date}`).then((res) => {
        this.income = res.income;
        this.expenditure = res.expenditure;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.list {
  padding: 10px;

  .list_top {
    font-size: 20px;
    margin-bottom: 30px;
    .word {
      font-size: 14px;
    }
  }
}
</style>
