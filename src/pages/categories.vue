<template>
  <div class="categories">
    <div class="category">
      <img
        v-for="site in sfw"
        :key="site.url"
        :src="`${prefix}/${site.url.replace('http://', '')}.png`"
      />
    </div>
    <div class="category">
      <img
        v-for="site in nsfw"
        :key="site.url"
        :src="`${prefix}/${site.url.replace('http://', '')}.png`"
      />
    </div>
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
    this.fetch();
    setInterval(this.fetch, 1000);
  },
  methods: {
    fetch() {
      fetch(`${this.prefix}/tree.jsonl`)
        .then(response => response.text())
        .then(async data => {
          this.websites = data
            .trim()
            .split(/\r?\n/)
            // .slice(0, 1000)
            .map(item => JSON.parse(item));
        });
    }
  },
  computed: {
    sfw() {
      return this.websites.filter(x => !(x.details && x.details.NSFW));
    },
    nsfw() {
      return this.websites.filter(x => x.details && x.details.NSFW);
    }
  }
};
</script>

<style scoped>
.categories {
  background: dimgrey;
  display: grid;
  grid-template-columns: 1fr 0.5fr;
}

.category {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  grid-auto-rows: 0fr;
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