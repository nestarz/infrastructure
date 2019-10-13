<template>
  <div class="timeline">
    <div class="map">
      <composable-map :projection="projection" :projection-config="projectionConfig">
        <template v-slot:default="{path, projectionFunc}">
          <geographies :geography="geoUrl" :path="path" :projection="projectionFunc">
            <template v-slot:default="{geographies}">
              <geography
                v-for="geo in geographies"
                :key="geo.rsmKey"
                :geography="geo"
                :fill="'white'"
                stroke="blue"
              ></geography>
            </template>
          </geographies>
          <map-marker
            :coordinates="[longitude, latitude]"
            v-for="({latitude, longitude}, index) in points"
            :projection="projectionFunc"
            :key="`marker-${index}`"
          >
            <circle r="0.4" fill="#F53" />
          </map-marker>
        </template>
      </composable-map>
    </div>
  </div>
</template>

<script>
const simpleMapImport = name => async () => {
  const simpleMapModule = await import(
    "https://raw.githack.com/nestarz/vue-simple-maps/master/dist/index.es.min.js"
  );
  return simpleMapModule[name];
};

module.exports = {
  components: {
    composableMap: simpleMapImport("ComposableMap"),
    mapMarker: simpleMapImport("Marker"),
    geographies: simpleMapImport("Geographies"),
    geography: simpleMapImport("Geography")
  },
  data() {
    return {
      projectionConfig: {
        rotate: [50, 20],
        scale: 100
      },
      projection: "geoConicConformal",
      geoUrl:
        "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json",
      points: null
    };
  },
  mounted() {
    import("/web_modules/papaparse/papaparse.min.js").then(
      ({ default: Papa }) => {
        const csv = Papa.parse(
          "/assets/others/globalterrorismdb_0919dist.csv",
          {
            download: true,
            complete: results => {
              const data = results.data;
              const points = data
                .slice(0, 10000)
                .map(point => ({
                  latitude: +point[13],
                  longitude: +point[14]
                }))
                .filter(({ latitude, longitude }) => latitude && longitude);
              this.points = points;
            }
          }
        );
      }
    );
  }
};
</script>

<style scoped>
.timeline {
  background: #fff;
}

svg {
  overflow: visible;
  box-shadow: 0px -0px 10000px transparent; /*trick for chrome*/
}

</style>