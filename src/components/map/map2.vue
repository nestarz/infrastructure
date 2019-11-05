<template>
  <div ref="container">
    <svg ref="svgRef" />
  </div>
</template>

<style>
svg {
  width: 100%;
  height: 100%;
  flex: 1;
}

.land {
  fill: rgba(0, 0, 0, 0.12);
}

.border {
  stroke: rgba(255, 255, 255, 0.7);
  fill: none;
}
</style>

<script>
module.exports = {
  setup(props, { emit }) {
    const container = ref(null);
    const svgRef = ref(null);
    const coord = ref([]);
    const dragended = ref(true);
    const topojson_path = "/src/components/map/world-110m.json";

    const build = async () => {
      console.log("ok");
      const svg = svgRef.value;
      const d3 = await import("/web_modules/d3.js");
      const topojson = await import("/web_modules/topojson.js");
      const { zoom, drag } = await import("/src/components/map/zoom.js");
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      const r = 250;
      const projection = d3
        .geoMercator()
        .scale(250)
        .translate([width / 2, height / 2 + 40])
        .precision(1);
      const path = d3.geoPath(projection);
      const graticule = d3.geoGraticule().step([10, 10]);
      d3.select(svg)
        .append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "rgba(0,0,0,0.05)");
      d3.select(svg).call(drag(projection, path, svg));
      d3.select(svg).call(zoom(projection, path, svg));
      const world = await fetch(topojson_path).then(r => r.json());
      d3.select(svg)
        .append("path")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);
      borders = topojson.mesh(
        world,
        world.objects.countries,
        (a, b) => a !== b
      );
      d3.select(svg)
        .append("path")
        .datum(borders)
        .attr("class", "border")
        .attr("d", path);

      const data = await d3.csv("/assets/csv/registars.csv");
      const get = index => ({ longitude, latitude }) =>
        projection([latitude, longitude])[index];
      d3.select(svg)
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", get(0))
        .attr("cy", get(1))
        .attr("r", "4px")
        .attr(
          "fill",
          ({ type }) => ({ NIR: "grey", RIR: "black", IR: "red" }[type])
        );
      const observer = new ResizeObserver(() => {
        const width = svg.clientWidth;
        const height = svg.clientHeight;
        projection.translate([width / 2, height / 2 + 40]);
        d3.select(svg)
          .selectAll("path")
          .attr("d", path);
      });
      observer.observe(container.value);
    };

    onMounted(build);
    return {
      container,
      svgRef,
      coord
    };
  }
};
</script>