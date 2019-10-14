<template>
  <div class="home"></div>
</template>

<script>
module.exports = {
  components: {},
  data() {
    return {
      privacy: {}
    };
  },
  mounted() {
    import("/src/plugins/jsonifymd.js").then(async ({ default: JsonifyMd }) => {
      this.privacy = await JsonifyMd(
        "https://raw.githubusercontent.com/KevinColemanInc/awesome-privacy/master/readme.md",
        { toDict: true }
      );
      console.log(this.privacy);
    });
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