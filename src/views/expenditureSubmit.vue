<template>
  <div>
    <van-form @submit="onSubmit">
      <van-field
        readonly
        clickable
        name="date"
        :value="date"
        label="费用产生日期"
        placeholder="点击选择日期"
        @click="showCalendar = true"
      />
      <van-calendar
        v-model="showCalendar"
        @confirm="onConfirm"
        :min-date="minDate"
        color="#1989fa"
      />
      <van-field
        v-model="fee"
        name="fee"
        label="费用（元）"
        placeholder="费用"
        type="number"
        :rules="[{ required: true, message: '请填写费用' }]"
      />
      <van-field
        v-model="use"
        name="use"
        label="用途"
        placeholder="用途"
        :rules="[{ required: true, message: '请填写用途' }]"
      />
      <van-field
        v-model="address"
        name="address"
        label="地点"
        placeholder="地点"
        :rules="[{ required: true, message: '请填写地点' }]"
      />
      <van-field
        v-model="remark"
        name="remark"
        label="备注"
        placeholder="备注"
      />
      <!-- <van-field name="uploader" label="文件上传">
        <template #input>
          <van-uploader v-model="uploader" :after-read="afterRead" />
        </template>
      </van-field> -->
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import moment from "moment";
import * as qiniu from "qiniu-js";

export default {
  data() {
    return {
      fee: "",
      use: "",
      address: "",
      date: "",
      remark: "",
      showCalendar: false,
      uploader: [],
      filelist:[],
      minDate: new Date(2021, 11, 31),
    };
  },
  mounted() {},
  methods: {
    onSubmit(values) {
      console.log("submit", values);
      values.filelist=this.filelist
      this.$http.post("/api/expenditureSubmit", values).then(() => {
        this.$toast("提交成功");
        this.$router.back();
      });
    },
    onConfirm(date) {
      this.date = moment(date).format("YYYY-MM-DD");
      this.showCalendar = false;
    },
    async afterRead(file) {
      console.log(file);
      const token = await this.$http.get("/api/qiniu/token").then((res) => {
        return res.replace("your access key:", "");
      });
      const observable = qiniu.upload(file.file, encodeURI(file.file.name), token);
      observable.subscribe({
        complete(res) {
          console.log(res);
          this.filelist.push(res.key)
        },
        error(err) {
          console.log(err);
          throw err;
        },
      }); // 上传开始
    },
  },
};
</script>
