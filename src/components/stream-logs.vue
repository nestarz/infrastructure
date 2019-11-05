<template>
  <div>
    <div v-for="x in browserlogs" :key="x" v-html="x"></div>
  </div>
</template>

<script>
module.exports = {
  props: {
    ws: { type: String, required: true },
    max: { type: Number, default: 20 }
  },
  setup(props) {
    const browserlogs = ref([]);
    import("/src/plugins/ansi-to-html.esm.min.js").then(
      ({ default: Convert }) => {
        const convert = new Convert();
        const ws = new WebSocket(props.ws);
        ws.onmessage = event => {
          if (!event.data.startsWith("ERROR")) {
            browserlogs.value = browserlogs.value.slice(0, props.max);
            browserlogs.value.unshift(convert.toHtml(event.data));
          }
        };
      }
    );
    return { browserlogs };
  }
};
</script>

<style>
</style>