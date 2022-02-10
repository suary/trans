import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Form,Field,Button,DatetimePicker,Popup,Calendar,Uploader,Cell, CellGroup,RadioGroup, Radio,List,Icon,PullRefresh,Tab, Tabs,Picker  } from 'vant'
import axios from './api/http'
import VueAxios from 'vue-axios'
import 'vant/lib/index.css'
import 'lib-flexible'
// import VCharts from 'v-charts'
import VeLine from 'v-charts/lib/line.common'


Vue.use(Form).use(Field).use(Button).use(DatetimePicker).use(Popup).use(Calendar).use(Uploader).use(Cell)
.use(CellGroup).use(Radio).use(RadioGroup).use(List).use(Icon).use(PullRefresh).use(Tab).use(Tabs).use(Picker);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.component(VeLine.name, VeLine)
document.title="鼎旺物流"
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

