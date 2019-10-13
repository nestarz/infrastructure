<template>
  <div class="slide">
    <div class="title">
      <div>
        <slot name="title" />
      </div>
    </div>
    <div class="border">
      <!-- <div class="grid">
        <slot name="grid" />
      </div>-->
      <slot name="pinboard" />
    </div>
    <radar :radian="10"></radar>
    <div class="overlay">
      <div class="grid"></div>
    </div>
    <div class="overlay scene">
      <nodes></nodes>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {
    radar: httpVueLoader("src/components/radar.vue"),
    nodes: httpVueLoader("src/components/nodes.vue"),
    pinboard: httpVueLoader("src/components/pinboard.vue")
  }
};
</script>

<style scoped>
.slide,
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  height: 100vh;
  overflow: hidden;
  position: relative;
  transform-origin: 0px 0px;
}

.title {
  font-size: 1em;
  letter-spacing: 9em;
  margin-right: -9em;
  text-transform: uppercase;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  font-weight: bold;
  pointer-events: none;
}

.key {
  font-size: 200%;
  display: block;
}

.border {
  width: 110vh;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.border .grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1px;
  height: 100%;
}
.border .grid > div {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.overlay .grid {
  background-size: calc(33% / 10) calc(33% / 10);
  background-image: radial-gradient(
    circle,
    rgba(10, 63, 26, 1) 1px,
    rgba(255, 255, 255, 0) 1px
  );
  width: 110vh;
  height: 100vh;
  pointer-events: none;
}

.overlay.scene {
  z-index: 2;
}
</style>