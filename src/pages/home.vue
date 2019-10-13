<template>
  <div class="home">
    <router-link to="/anon/">Anonymous</router-link>
    <router-link to="/slides/">Slides</router-link>
    <router-link to="/a1/">A1</router-link>
    <router-link to="/notes/">Notes</router-link>
    <router-link to="/timeline/">Timeline</router-link>
  </div>
</template>

<script>
module.exports = {
  components: {}
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>