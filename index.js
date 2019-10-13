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

const router = new VueRouter({
  routes: [
    { path: "/", component: httpVueLoader("./src/pages/home.vue") },
    { path: "/slides/", component: httpVueLoader("./src/pages/slides.vue") },
    { path: "/a1/", component: httpVueLoader("./src/pages/a1.vue") },
    { path: "/anon/", component: httpVueLoader("./src/pages/anon.vue") },
    { path: "/notes/", component: httpVueLoader("./src/pages/notes.vue") },
    { path: "/timeline/", component: httpVueLoader("./src/pages/timeline.vue") },
  ]
});

new Vue({
  router: router,
  template: "<router-view></router-view>"
}).$mount("#app");