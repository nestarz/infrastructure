<template>
  <div class="categories">
    <img
      v-for="site in websites"
      :key="site.url"
      :src="`${prefix}/${site.url.replace('http://', '')}.png`"
    />
  </div>
</template>

<script>
module.exports = {
  components: {},
  data() {
    return {
      websites: [],
      prefix: "/dark-crawler/output/latest/"
    };
  },
  mounted() {
    fetch(`${this.prefix}/tree.jsonl`)
      .then(response => response.text())
      .then(async data => {
        this.websites = data
          .trim()
          .split(/\r?\n/)
          // .slice(0, 1000)
          .map(item => JSON.parse(item));
        console.log(this.websites);
      });
  }
};
</script>

<style scoped>
.categories {
  background: dimgrey;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1em;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding: 1em;
}

img {
  width: 100%;
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