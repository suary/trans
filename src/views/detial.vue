<template>
  <div class="detail">
    <div class="center">
      <div>{{ data.type === "income" ? "收入" : "支出" }}</div>
      <div :style="{ color: data.type === 'income' ? '#07c160' : '#ee0a24' }">
        {{ data.type === "income" ? "+" : "-" }}¥{{ data.totalfee }}
      </div>
    </div>
    <van-cell-group>
      <van-cell title="时间" :value="data.date" />
      <template v-if="data.type === 'income'">
        <van-cell title="总运费" :value="data.fee" />
        <van-cell title="起点" :value="data.address" />
        <van-cell title="终点" :value="data.addressto" />
      <van-cell title="装车费" :value="data.zcfee" v-if="data.zcfee" />
      <van-cell title="信息费" :value="data.infofee" v-if="data.infofee"/>
      <van-cell title="其他费用" :value="data.otherfee" v-if="data.otherfee" />
      </template>
      <template v-else>
      <van-cell title="费用（元）" :value="data.fee" />
      <van-cell title="用途" :value="data.use" />
      <van-cell title="地点" :value="data.address" />
      </template>
      <van-cell title="备注" :value="data.remark||'无'" />
      <!-- <van-cell title="文件">
        <template #value>
          <van-image
            width="100"
            height="100"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
        </template>
      </van-cell> -->
    </van-cell-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    this.$http.get(`/api/detail/${this.$route.params.id}`).then((res) => {
      this.data = res;
    });
  },
};
</script>
<style lang="less" scoped>
.detail {
  .center {
    text-align: center;
    font-size: 30px;
  }
}
</style>
