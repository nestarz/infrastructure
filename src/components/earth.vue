<template>
  <div class="earth">
    <div
      class="title"
    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10.13.2019 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; infrastructure &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; design academy of eindhoven &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
    <div class="map">
      <composable-map :projection="projection" :projection-config="projectionConfig">
        <template v-slot:default="{path, projectionFunc}">
          <geographies :geography="geoUrl" :path="path" :projection="projectionFunc">
            <template v-slot:default="{geographies}">
              <geography
                v-for="geo in geographies"
                :key="geo.rsmKey"
                :geography="geo"
                :fill="`rgba(110,0,110,${Math.random() - 0.1})`"
                stroke="rgb(110,0,110)"
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
  const simpleMapModule = await import("/web_modules/vue-simple-maps.js");
  return simpleMapModule[name];
};

const projections = ["geoMercator"];

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
        rotate: [Math.random() * 158.0, Math.random() * 158.0],
        scale: 300
      },
      projection: projections[Math.floor(Math.random() * projections.length)],
      geoUrl: "/assets/json/world-110m.json"
    };
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