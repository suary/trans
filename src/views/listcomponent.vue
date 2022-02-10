<template>
<div>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in list"
          :key="index"
          :value="item.use || `${item.address}-${item.addressto}`"
          :label="item.date"
          @click="
            () => {
              $router.push('./detial/' + item._id);
            }
          "
        >
          <template #title>
            <span
              :style="{ color: item.type === 'income' ? '#07c160' : '#ee0a24' }"
              >{{ item.type === "income" ? "+" : "-" }}¥{{ item.totalfee }}</span
            >
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh></div>
</template>
<script>
export default {
  beforeCreate(){
    document.title="鼎旺物流-统计列表"
  },
  props:['date','sort'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 0,
    };
  },
  watch: {
    date() {
      this.onRefresh();
    },
  },
  methods: {
    onLoad() {
      this.$http.get(`/api/list/${this.date}/${this.page * 10}`).then((res) => {
        this.page += 1;
        this.list = [...this.list, ...res];
        if (this.sort) {
            console.log(1)
            this.list=this.list.sort((a,b)=>-a.totalfee+b.totalfee)
        }
        this.loading = false;
        if (!res.length) {
          this.finished = true;
        }
      });
    },
    onRefresh() {
      this.page = 0;
      this.list = [];
      this.finished = false;
      this.loading = true;
      this.onLoad();
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