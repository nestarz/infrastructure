import TypeIt from "/web_modules/typeit/dist/typeit.min.js";

export default {
  install: function(Vue, options) {
    Vue.component("type-it", {
      props: ["speed", "values", "loop", "breakLines", "lifeLike"],

      template: `<div><div class="slot-wrapper" style="display: none;"><slot/></div><span class="type-it"></span></div>`,

      mounted() {
        new TypeIt(this.$el.getElementsByClassName("type-it")[0], {
          strings:
            this.values ||
            [
              ...this.$el.getElementsByClassName("slot-wrapper")[0].childNodes
            ].map(node => node.innerHTML || ''),
          breakLines: this.breakLines,
          loop: this.loop,
          speed: this.speed,
          lifeLike: this.lifeLike,
        }).go();
      }
    });
  }
};
