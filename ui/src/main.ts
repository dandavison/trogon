import Vue from "vue";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);
Vue.use(VueRouter);

import About from "./About.vue";
import MyMap from "./MyMap.vue";
import Home from "./Home.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import i18n from "./i18n";

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: "fas",
  defaultContainerElement: "#content",
});

const routes = [
  { path: "/map", component: MyMap },
  { path: "/about", component: About },
];

const router = new VueRouter({ routes });

new Vue({
  i18n,
  router,
  render: (h) => h(Home),
}).$mount("#app");
