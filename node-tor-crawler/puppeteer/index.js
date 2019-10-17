const utils = require("./utils");

const now = Date.now();

const Tor = (browser, parents = [], id = null) => ({
  id: id || utils.generate_id(),
  browser,
  page: null,
  stack: [...parents],
  visited: [],
  currentFolder: `/output/${now}/`,
  value: [],
  currentItem: {},
  savePush(item) {
    this.value.push(item);
    console.log(`saving ${this.id}-tree.json`);
    utils.save(this.value, this.currentFolder, `${this.id}-tree.json`);
  },
  async analyze({ id, url }) {
    try {
      await utils.goto(this.page, url);
    } catch (error) {
      return { results: null, error };
    }

    const links = await utils.getExternalSiteLinks(this.page, {
      hostblacklist: this.visited,
      dir: this.currentFolder
    });
    const filtered = utils.shuffle(
      links.map(link => ({
        parent: url,
        url: link
      }))
    );

    await utils.goto(this.page, url);
    await utils.screenshot(this.page, id, this.currentFolder);
    return {
      results: {
        links: filtered,
        lang: await this.page.evaluate(
          () => document.querySelector("html").lang
        )
      },
      error: null
    };
  },

  async browse() {
    while (this.stack.length) {
      const link = this.stack.pop();
      this.url = link;
      this.currentItem = {
        parent: link.parent,
        url: link.url,
        ressourceType: {}
      };
      const hostname = utils.getHostname(link.url);
      if (this.visited.includes(hostname)) {
        continue;
      }

      console.log(this.id, "trying", hostname);
      const { results, error } = await this.analyze({
        id: hostname,
        url: link.url
      });

      this.visited = [...this.visited, hostname];

      if (error) {
        console.log(this.id, "err", link.url, error);
        continue;
      }

      this.currentItem = {
        ...this.currentItem,
        lang: results.lang
      };
      this.savePush(this.currentItem);

      console.log(this.id, "done", hostname);

      this.stack = [...this.stack, ...results.links];
      console.log(this.id, "stack", this.stack.length);
    }
  },

  async start() {
    utils.mkdir(this.currentFolder);
    this.page = await utils.newPage(this.browser, {
      eventRequestAbort: event => {
        this.currentItem.porn = {
          ...(this.currentItem.porn || { value: 0, count: 0 })
        };
        this.currentItem.porn.value =
          event.value > this.currentItem.porn.value
            ? event.value
            : this.currentItem.porn.value;
        this.currentItem.porn.count = this.currentItem.porn.count + 1;
      }
    });
    await this.browse();
    console.log(this.id, "finished");
  }
});

(async () => {
  const parents = require("./links.json")
    .map(utils.withHttp)
    .map(x => ({
      parent: null,
      url: x
    }));
  const instances = 5;
  const browser = await utils.connect();
  [...Array(instances).keys()].map(() =>
    Tor(browser, utils.shuffle(parents)).start()
  );
})();
