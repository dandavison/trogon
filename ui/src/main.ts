import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import _ from "lodash";
import i18n from "./i18n";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "../node_modules/@fortawesome/fontawesome-free/js/all.js";

import { LocationRequest } from "./types";
import App from "./App.vue";
const Map = () => import("./views/MapView.vue");
const Challenge = () => import("./views/ChallengeView.vue");

Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconPack: "fas",
  defaultContainerElement: "#content"
});

function makeLocationRequest(route: any): LocationRequest {
  return {
    ebirdLocId: route.query.location,
    latlng: route.query.coords
      ? (_.zipObject(["lat", "lng"], route.query.coords.split(",")) as any)
      : null
  };
}

const routes = [
  { path: "/", component: Map },
  {
    path: "/challenge/",
    component: Challenge,
    props: (route: any) => ({
      locationRequest: makeLocationRequest(route)
    })
  }
];

const router = new VueRouter({ mode: "history", routes });

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount("#app");
