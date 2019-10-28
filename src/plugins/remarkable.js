import { Remarkable } from "/web_modules/remarkable.js";

export default {
  install: function(Vue, options) {
    Vue.prototype.$md = new Remarkable();
    Vue.component("remarkable", {
      render: function(createElement) {
        return createElement(
          "div", // nom de balise
          {
            domProps: {
              innerHTML: this.$md.render(
                this.$slots.default.reduce(
                  (prev, curr) => (prev.text ? prev.text: '') + curr.text,
                  ""
                )
              ) // tableau des enfants
            }
          }
        );
      }
    });
  }
};
