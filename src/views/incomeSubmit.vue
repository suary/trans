<template>
  <div>
    <van-form @submit="onSubmit">
      <van-field
        readonly
        clickable
        name="date"
        :value="date"
        label="日期"
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
        label="总运费（元）"
        placeholder="总运费"
         type="number"
        :rules="[{ required: true, message: '请填写总运费' }]"
      />
      <van-field
        v-model="address"
        name="address"
        label="起点"
        placeholder="起点"
        :rules="[{ required: true, message: '请填写起始地点' }]"
      />
      <van-field
        v-model="addressto"
        name="addressto"
        label="终点"
        placeholder="终点"
        :rules="[{ required: true, message: '请填写起始地点' }]"
      />
      <van-field name="radio" label="是否有装卸费">
        <template #input>
          <van-radio-group v-model="radio1" direction="horizontal">
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="zcfee"
        v-if="radio1 == 1"
        name="zcfee"
         type="number"
        label="装卸费（元）"
        placeholder="装卸费"
        :rules="[{ required: true, message: '请填写装卸费' }]"
      />
      <van-field name="radio" label="是否有信息费">
        <template #input>
          <van-radio-group v-model="radio2" direction="horizontal">
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="infofee"
        v-if="radio2 == 1"
        name="infofee"
        label="信息费（元）"
         type="number"
        placeholder="信息费"
        :rules="[{ required: true, message: '请填写信息费' }]"
      />
      <van-field name="radio" label="是否产生其他费用">
        <template #input>
          <van-radio-group v-model="radio3" direction="horizontal">
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>
       <van-field
        v-model="otherfee"
        v-if="radio3 == 1"
        name="otherfee"
        label="其他费用（元）"
         type="number"
        placeholder="其他费用"
        :rules="[{ required: true, message: '请填写其他费用' }]"
      />
       <van-field
        v-model="servicefee"
        name="servicefee"
        label="运满满服务费（元）"
         type="number"
        placeholder="运满满服务费"
      />
      <van-field
        v-model="remark"
        name="remark"
        label="备注"
        placeholder="备注"
      />
      <!-- <van-field name="uploader" label="文件上传">
        <template #input>
          <van-uploader v-model="uploader" />
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
import moment from 'moment'

export default {
  data() {
    return {
      fee: "",
      zcfee: "",
      infofee: "",
      otherfee: "",
      address: "",
      addressto:'',
      servicefee:"",
      date:'',
      remark:'',
      showCalendar: false,
      // uploader: [],
      radio1: "1",
      radio2: "1",
      radio3: "2",
      minDate: new Date(2021, 11, 31),
    };
  },
  methods: {
    onSubmit(values) {
      console.log("submit", values);
      this.$http.post('/api/incomeSubmit',values).then(()=>{
        this.$toast('提交成功')
        this.$router.back()
      })
    },
    onConfirm(date) {
      this.date = moment(date).format('YYYY-MM-DD')

      //this.value = `${date.getMonth() + 1}/${date.getDate()}`;
      this.showCalendar = false;
    },
  },
};
</script>
