import Vue from "vue";
import VueI18n from "vue-i18n"

Vue.use(VueI18n);
import App from "./App.vue";
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import i18n from './i18n'

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultContainerElement: '#content',
})

new Vue({
  i18n,
  render: (h) => h(App)
}).$mount("#app");
