<template>
  <div class="pinboard">
    <div class="panel" ref="panel">
      <template v-for="pin in pins">
        <component
          v-if="pin.list && pin.type === 'img'"
          v-for="item in pin.list"
          v-bind:is="pin.type ? pin.type : 'div'"
          :id="item"
          :key="item"
          :src="item"
          v-dragged="{ unit: 'percent' }"
          :style="`
            top: ${Math.random() * 100}%; 
            left: ${Math.random() * 100}%; 
            z-index: ${Math.floor(Math.random() * pin.list.length)};
            transform: translateX(-35mm) translateY(-35mm);
          `"
        ></component>
        <component
          v-else
          v-bind:is="pin.type ? pin.type : 'div'"
          :id="pin.id"
          :key="pin.id"
          v-bind="pin"
          v-dragged="{ unit: 'percent' }"
        >{{ pin.text }}</component>
      </template>
      <slot />
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {},
  props: ["contentSrc", "positionSrc", "forceInitial"],
  data() {
    return {
      localStorage: localStorage,
      initialPositions: {},
      zoomRatio: 0.9,
      pins: null
    };
  },
  mounted() {
    console.log("ok");
    if (this.contentSrc)
      fetch(this.contentSrc)
        .then(response => response.json())
        .then(data => (this.pins = data));
    if (this.positionSrc)
      fetch(this.positionSrc)
        .then(response => response.json())
        .then(data => (this.initialPositions = data));
  },
  watch: {
    pins() {
      const positions = JSON.parse(localStorage.positions);
      this.position(positions);
    },
    initialPositions() {
      console.log(this.initialPositions);
      localStorage.positions = JSON.stringify(
        this.forceInitial
          ? {
              ...JSON.parse(localStorage.positions || "{}"),
              ...this.initialPositions
            }
          : {
              ...this.initialPositions,
              ...JSON.parse(localStorage.positions || "{}")
            }
      );
      const positions = JSON.parse(localStorage.positions);
      this.position(positions);
    }
  },
  methods: {
    copy() {
      this.$refs.xy.select();
      document.execCommand("copy");
    },
    zoomSlider(e) {
      this.$refs.panel.style.fontSize = e.target.value + "%";
    },
    position(positions) {
      Object.keys(positions).map(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.top = positions[id].top + "%";
          el.style.left = positions[id].left + "%";
          el.style.position = "absolute";
        }
      });
    }
  }
};
</script>

<style scoped>
* {
  -webkit-user-drag: none;
}

.pinboard {
  width: 100%;
  height: 100%;
}

div {
  user-select: none !important;
}

.panel > * {
  cursor: pointer;
  position: absolute;
}

.panel {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: scroll;
}
</style>