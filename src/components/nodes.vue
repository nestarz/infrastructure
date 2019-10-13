<template>
  <div class="nodes">
    <a-scene transparent="true" vr-mode-ui="enabled: false">
      <a-entity id="camera-container" rotation="-90 0 0">
        <a-entity camera look-controls wasd-controls="acceleration: 1000" position="0 16 20"></a-entity>
      </a-entity>
      <template v-for="(box, index) in boxes">
        <a-box
          rotation="0 0 0"
          color="rgb(0, 204, 0)"
          :position="`${box.x} ${box.y} ${box.z}`"
          :width="box.width"
          :height="box.height"
          :key="`box-${index}`"
        ></a-box>
        <a-text
          text="font: https://cdn.aframe.io/fonts/mozillavr.fnt; value:"
          negate="true"
          scale="20 30 10"
          :position="`${box.x} ${box.y} ${box.z}`"
          :key="`box-text-${index}`"
          wrap-count="100"
          v-if="index === 3"
        ></a-text>
        <a-box
          rotation="0 0 0"
          color="rgb(10, 63, 26)"
          :position="`${box.x + (Math.random() > 0.5 ? -1 : 1) * (5 + Math.random() * 40)} ${box.y} ${box.z}`"
          :width="box.width"
          :height="box.height"
          v-for="x in 3"
          :key="`box-${index}-${x}`"
        ></a-box>
      </template>
      <template v-for="(box, index) in boxes">
        <a-entity
          :line="`
        start: ${box.x}, ${box.y + box.lineOffset}, ${box.z}; 
        end: ${boxes[index + 1].x} ${boxes[index + 1].y} ${boxes[index + 1].z}; 
        color: rgb(0, 204, 0)`"
          v-if="boxes[index + 1]"
          :key="`line-${index}`"
        ></a-entity>
      </template>
    </a-scene>
  </div>
</template>

<script>
module.exports = {
  components: {},
  data() {
    return {
      boxes: [...Array(4).keys()].map(index => ({
        x: index ? (Math.random() > 0.5 ? -1 : 1) * Math.random() * 10 : -4,
        y: 1.6,
        z: -(4 + index * 8),
        height: 1 + Math.floor(Math.random() * 2),
        width: 0.5,
        lineOffset: (Math.random() > 0.5 ? -1 : 1) * Math.random() * 0.5
      }))
    };
  },
  mounted() {
    console.log(this.boxes);
  }
};
</script>

<style scoped>
.nodes {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>