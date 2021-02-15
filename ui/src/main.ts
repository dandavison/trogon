import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import _ from "lodash";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "../node_modules/@fortawesome/fontawesome-free/js/all.js";

import { LocationRequest } from "./types";
import App from "./App.vue";
import Root from "./Root.vue";
import GameRoot from "./GameRoot.vue";

Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconPack: "fas",
  defaultContainerElement: "#content"
});

const routes = [
  { path: "/", component: Root, name: "trogon-root" },
  {
    path: "/challenge/",
    component: GameRoot,
    props: (route: any) => ({
      locationRequest: {
        ebirdLocId: route.query.location,
        latlng: route.query.coords
          ? (_.zipObject(["lat", "lng"], route.query.coords.split(",")) as any)
          : null
      } as LocationRequest
    }),
    name: "trogon-game-root"
  },
];

const router = new VueRouter({ mode: "history", routes });

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
