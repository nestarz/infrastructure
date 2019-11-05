<template>
  <composable-map :projection="projection" :projection-config="config" :width="width" :height="height">
    <geographies :geography="geoUrl">
      <template v-slot:default="{geographies}">
        <geography v-for="geo in geographies" :key="geo.rsmKey" :geography="geo"></geography>
      </template>
    </geographies>
    <template v-for="{longitude, latitude, name, initial, type} in registars">
      <line-rsm :from="[latitude, longitude]" :to="[icann.latitude, icann.longitude]" :key="name"></line-rsm>
      <annotation :subject="[latitude, longitude]" :class="type" :key="initial" :dx="0" :dy="0">
        <text :x="-8">{{ initial }}</text>
      </annotation>
    </template>
  </composable-map>
</template>

<script>
// "/web_modules/vue-simple-maps.js"
const simpleMapImport = name => async () =>
  (await import("/assets/vsm.js"))[name];

const projections = ["geoMercator", "geoOrthographic"];

module.exports = {
  components: {
    composableMap: simpleMapImport("ComposableMap"),
    annotation: simpleMapImport("Annotation"),
    geographies: simpleMapImport("Geographies"),
    geography: simpleMapImport("Geography"),
    "line-rsm": simpleMapImport("Line")
  },
  setup() {
    const registars = ref({});
    fetch("/assets/csv/registars.csv")
      .then(response => response.text())
      .then(text => Papa.parse(text, { header: true }).data)
      .then(json => (registars.value = json));
    const icann = computed(() =>
      registars.value.find(({ initial }) => initial === "ICANN")
    );
    return {
      registars,
      icann,
      config: ref({ scale: 240 }),
      projection: projections[Math.floor(Math.random() * projections.length)],
      geoUrl: "/assets/json/world-110m.json",
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
};
</script>

<style scoped>
.rsm-geography {
  fill: rgba(0, 0, 0, 0.12);
  stroke: rgba(255, 255, 255, 0.7);
}

g.RIR path {
  stroke: black;
  stroke-width: 0.5em;
  stroke-linecap: round;
}

g.IR path {
  stroke: red;
  stroke-width: 1em;
  stroke-linecap: round;
}

text {
  text-anchor: end;
  alignment-baseline: middle;
  fill: #000;
  font-size: 0.5em;
}

.rsm-line {
  stroke: black;
  stroke-width: 1px;
}

svg {
  height: 100%;
  width: 100%;
}
</style>