import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.js";
import VueCompositionApi from '/web_modules/@vue/composition-api.js';
import VueRouter from "/web_modules/vue-router.js";
import httpVueLoader from "/web_modules/http-vue-loader/src/httpVueLoader.js";
import "/web_modules/aframe/dist/aframe-v0.9.2.min.js";
import "/web_modules/aframe-forcegraph-component/dist/aframe-forcegraph-component.min.js";
import "/web_modules/aframe-geo-projection-component/dist/aframe-geo-projection-component.min.js";

import Papa from "/web_modules/papaparse/papaparse.min.js";
window.Papa = Papa;

import VueDrag from "/src/plugins/v-drag.js";
import VueTypeIt from "/src/plugins/typeit.js";
import VueRemarkable from "/src/plugins/remarkable.js";

Vue.use(VueCompositionApi);
Vue.use(VueRouter);
Vue.use(VueRemarkable);
Vue.use(VueTypeIt);
Vue.use(VueDrag);

import {
  reactive,
  computed,
  watch,
  onMounted,
  ref
} from "/web_modules/@vue/composition-api.js";

const composition = { ref, reactive, computed, watch, onMounted };
Object.entries(composition).forEach(([name, api]) => {
  window[name] = api;
});

const routes = [
  { path: "/", component: httpVueLoader("./src/pages/home.vue") },
  { path: "/categories", component: httpVueLoader("./src/pages/categories.vue") },
  { path: "/documentation", component: httpVueLoader("./src/pages/documentation.vue") },
  { path: "/map", component: httpVueLoader("./src/pages/map.vue") },
];

new Vue({
  router: new VueRouter({ routes }),
  template: "<router-view></router-view>"
}).$mount("#app");