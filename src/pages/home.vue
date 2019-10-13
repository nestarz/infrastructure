<template>
  <div class="home">
    <div class="overlay">
      <earth></earth>
    </div>
    <router-link to="/anon/">Anonymous</router-link>
  </div>
</template>

<script>
module.exports = {
  components: {
    earth: httpVueLoader("src/components/earth.vue")
  }
};
</script>

<style scoped>
.home {
  background: dimgrey;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding: 1em;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
}

a {
  z-index: 1;
}
</style>