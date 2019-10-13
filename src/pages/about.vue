<template>
  <div class="about">
    <pinboard
      content-src="src/pinboard/content.json"
      position-src="src/pinboard/positions.json"
    ></pinboard>
  </div>
</template>

<script>
module.exports = {
  components: {
    pinboard: httpVueLoader("src/components/pinboard.vue")
  }
};
</script>

<style scoped>
.about {
  min-width: 100vw;
  min-height: 100vh;
  background: black;
  color: white;
}

img {
  max-width: 10em;
}
</style>