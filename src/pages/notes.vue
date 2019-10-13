<template>
  <div class="notes">
    <div class="title">
      10.13.2019 ---------------------------------------------------------------- how to live together ? ---------------------------------------------------------------- design academy of eindhoven ---------------------------------------------------------------- about
    </div>
    <div class="map">
      <composable-map :projection="projection" :projection-config="projectionConfig">
        <template v-slot:default="{path, projectionFunc}">
          <geographies :geography="geoUrl" :path="path" :projection="projectionFunc">
            <template v-slot:default="{geographies}">
              <geography
                v-for="geo in geographies"
                :key="geo.rsmKey"
                :geography="geo"
                :fill="Math.random() > 0.999 ? 'rgba(0,0,255,0.5)' : 'rgba(0,0,200,0.5)'"
                stroke="midnightblue"
              ></geography>
            </template>
          </geographies>
          <annotation
            :subject="[Math.random() * 1000, Math.random() * 1000]"
            :dx="Math.random() * 10"
            :dy="Math.random()"
            :connector-props="{
              stroke: 'white',
              'stroke-width': Math.random() * 2,
              'stroke-linecap': 'round'
            }"
            :projection="projectionFunc"
            v-for="x in 100"
            :key="`${x}-anno`"
          ></annotation>
        </template>
      </composable-map>
    </div>
  </div>
</template>

<script>
const simpleMapImport = name => async () => {
  const simpleMapModule = await import(
    "http://localhost:63994/dist/index.es.js"
  );
  return simpleMapModule[name];
};

const projections = [
  "geoEqualEarth",
  "geoMercator",
  "geoOrthographic",
  "geoConicConformal"
];

module.exports = {
  components: {
    composableMap: simpleMapImport("ComposableMap"),
    annotation: simpleMapImport("Annotation"),
    geographies: simpleMapImport("Geographies"),
    geography: simpleMapImport("Geography")
  },
  data() {
    return {
      projectionConfig: {
        rotate: [58.0, 20.0],
        scale: 300
      },
      projection: projections[Math.floor(Math.random() * projections.length)],
      geoUrl:
        "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"
    };
  },
  mounted() {
    let index = 0;
    setInterval(() => {
      const [x, y] = this.projectionConfig.rotate;
      this.projectionConfig.rotate = [x + 0.4, y];
    }, 100);
    setInterval(() => {
      this.projection = projections[index];
      index = index ? index - 1 : projections.length - 1;
      console.log(this.projection);
    }, 4000);
  }
};
</script>

<style scoped>
.notes,
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1em;
  writing-mode: vertical-lr;
  flex-wrap: wrap;
}

.title {
  position: fixed;
  color: white;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: flex-start;
  padding: 1em;
}

svg {
  overflow: visible;
  box-shadow: 0px -0px 10000px transparent; /*trick for chrome*/
}

img {
      filter: grayscale(1) sepia(1) hue-rotate(167deg) contrast(0.5) opacity(0.5);
}

path {
  transition: transform 1s linear;
}
path:hover {
  fill: transparent;
  cursor: pointer;
}

.map {
  width: 800px;
  height: 600px;
  transform: scale(1.2, 1) skewX(10deg);
}
</style>