<template>
  <div class="categories">
    <main>
      {{ last.url }}
      <img class="last" :src="format(last.url)" v-if="last" />
      <img :src="format(url)" v-for="{url} in websites" :key="url" />
    </main>
    <div class="logs">
      <nav>
        <a href="#">Crawler</a>
        <a href="#">Glossary</a>
      </nav>
      <stream-logs ws="ws://localhost:8081"></stream-logs>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {
    streamLogs: httpVueLoader("/src/components/stream-logs.vue")
  },
  setup() {
    const prefix = "/dark-crawler/output/latest/";
    const websites = ref([]);
    const darkFetch = () =>
      fetch(`${prefix}/tree.jsonl`)
        .then(response => response.text())
        .then(async data => {
          websites.value = data
            .trim()
            .split(/\r?\n/)
            .reverse()
            .slice(0, 20)
            .map(item => JSON.parse(item));
        });
    darkFetch();
    setInterval(darkFetch, 1000);
    return {
      websites,
      format: url => (url ? `${prefix}/${url.replace("http://", "")}.png` : ""),
      last: computed(() => (websites.value.length ? websites.value[0] : {}))
    };
  }
};
</script>

<style scoped>
.categories {
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: CascadiaCode, monospace;
  font-size: 2em;
}

main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 1em;
}

img:not(.last) {
  max-width: 100px;
  margin: 5px;
}

.last {
  max-width: 100%;
}

.logs {
  font-size: 1rem;
  background: rgb(210, 210, 210);
  padding: 1em;
  overflow: hidden;
  max-height: calc(100vh - 2em);
  display: grid;
  grid-template-rows: 1fr 1fr;
}

.logs *[style="color:#FFF"] {
  color: black !important;
}

nav a {
  background: black;
}
</style>