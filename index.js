import Vue from "/web_modules/vue/dist/vue.esm.browser.js";
import VueRouter from "/web_modules/vue-router/dist/vue-router.esm.browser.js";
import httpVueLoader from "/web_modules/http-vue-loader/src/httpVueLoader.js";
import "/web_modules/aframe/dist/aframe-v0.9.2.min.js";
import "/web_modules/aframe-forcegraph-component/dist/aframe-forcegraph-component.min.js";

import VueDrag from "/src/plugins/v-drag.js";
import VueTypeIt from "/src/plugins/typeit.js";
import VueRemarkable from "/src/plugins/remarkable.js";

Vue.use(VueRouter);
Vue.use(VueRemarkable);
Vue.use(VueTypeIt);
Vue.use(VueDrag);

const routes = [
  { path: "/", component: httpVueLoader("./src/pages/home.vue") },
  { path: "/categories", component: httpVueLoader("./src/pages/categories.vue") },
];

new Vue({
  router: new VueRouter({ routes }),
  template: "<router-view></router-view>"
}).$mount("#app");