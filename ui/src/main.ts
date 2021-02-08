import Vue from "vue";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);
Vue.use(VueRouter);

import _ from "lodash";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "../node_modules/@fortawesome/fontawesome-free/js/all.js";

import About from "./About.vue";
import LandingPage from "./LandingPage.vue";
import MapView from "./MapView.vue";
import SiteDetail from "./SiteDetail.vue";
import Home from "./Home.vue";
import i18n from "./i18n";
import { LocationRequest } from "./sounds/types";
import SoundsRoot from "./sounds/Root.vue";
import SoundsGameRoot from "./sounds/GameRoot.vue";

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: "fas",
  defaultContainerElement: "#content"
});

const routes = [
  { path: "/", component: LandingPage },
  { path: "/sounds/", component: SoundsRoot, name: "sounds-root" },
  {
    path: "/sounds/challenge/",
    component: SoundsGameRoot,
    props: (route: any) => ({
      locationRequest: {
        ebirdLocId: route.query.location,
        latlng: route.query.coords
          ? (_.zipObject(["lat", "lng"], route.query.coords.split(",")) as any)
          : null
      } as LocationRequest
    }),
    name: "sounds-game-root"
  },
  { path: "/map", component: MapView },
  {
    path: "/site/:siteIdString",
    component: SiteDetail,
    props: true,
    name: "site"
  },
  { path: "/about", component: About }
];

const router = new VueRouter({ mode: "history", routes });

new Vue({
  i18n,
  router,
  render: h => h(Home)
}).$mount("#app");
