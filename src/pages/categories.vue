<template>
  <div class="categories">
    <div
      class="category"
      v-for="category in categories"
      :key="category.title"
      :class="category.title"
    >
      <div v-if="category.title === 'NSFW'" class="title">classified NSFW</div>
      <div class="logs" v-if="category.title === 'SFW'">
        <div v-for="x in browserlogs" :key="x" v-html="x"></div>
      </div>
      <img
        tabindex="0"
        v-for="site in category.sites"
        :key="site.url + site.instance"
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
      prefix: "/dark-crawler/output/latest/",
      browserlogs: []
    };
  },
  mounted() {
    this.fetch();
    setInterval(this.fetch, 1000);
    this.setLogs();
  },
  methods: {
    async setLogs() {
      const Convert = (await import("/src/plugins/ansi-to-html.esm.min.js"))
        .default;
      const convert = new Convert();
      const ws = new WebSocket("ws://localhost:8081/");
      ws.onmessage = event => {
        if (!event.data.startsWith("ERROR")) {
          this.browserlogs = this.browserlogs.slice(0, 100);
          this.browserlogs.unshift(convert.toHtml(event.data));
        }
      };
    },
    fetch() {
      fetch(`${this.prefix}/tree.jsonl`)
        .then(response => response.text())
        .then(async data => {
          this.websites = data
            .trim()
            .split(/\r?\n/)
            .reverse()
            .slice(0, 250)
            .map(item => JSON.parse(item));
        });
    }
  },
  computed: {
    categories() {
      const sfw = this.websites.filter(x => !(x.details && x.details.NSFW));
      const nsfw = this.websites.filter(x => x.details && x.details.NSFW);
      return [
        {
          title: "SFW",
          sites: sfw.reverse().slice(0, 71)
        },
        {
          title: "NSFW",
          sites: nsfw.reverse().slice(0, 71)
        }
      ];
    }
  }
};
</script>

<style scoped>
.categories {
  font-family: CascadiaCode, monospace;
  background: rgb(231, 231, 231);
  display: grid;
  grid-template-columns: 0.7fr 0.3fr;
  grid-gap: 10px;
}

.title {
  font-size: 200%;
  grid-column: 1/-2;
  background: black;
}

.category {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  grid-auto-rows: 0fr;
  grid-gap: 10px;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  z-index: 9;
  padding: 1em;
}

.logs {
  font-size: 12px;
  white-space: nowrap;
  font-family: CascadiaCode, monospace;
  filter: saturate(100);
  grid-column: 2/-3;
  grid-row: 8/ 11;
  overflow: hidden;
  background: rgb(10, 10, 10);
  height: 100%;
  position: fixed;
  bottom: 1em;
  left: 0em;
  right: 1em;
  top: 80vh;
  z-index: 999999;
  padding: 0 1em;
}

.NSFW {
  background: rgb(10, 10, 10);
  z-index: 0;
}

.category:focus-within {
  z-index: 999999999999999999;
}

img {
  width: 100%;
  cursor: pointer;
}

.SFW img:first-of-type {
  grid-column: 1/-4;
  grid-row: 1/7;
}

img:focus {
  position: fixed;
  width: 80vw;
  z-index: 999999999999999999;
  left: 1em;
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