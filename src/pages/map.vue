<template>
  <div class="mapok">
    <map-d3></map-d3>
  </div>
</template>

<script>
module.exports = {
  components: {
    mapD3: httpVueLoader("/src/components/map/map.vue")
  }
};
</script>

<style scoped>
.mapok {
  display: grid;
  max-height: 100vh;
  overflow: hidden;
}
</style>