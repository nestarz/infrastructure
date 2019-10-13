<template>
  <div class="anon">
    <a-scene transparent="true" vr-mode-ui="enabled: false">
      <a-assets>
        <a-asset-item id="my-obj" src="assets/models/castle.obj"></a-asset-item>
        <a-asset-item id="my-obj-mtl" src="assets/models/castle.mtl"></a-asset-item>
      </a-assets>
      <a-entity id="camera-container" rotation="0 25 0">
        <a-entity camera look-controls wasd-controls="acceleration: 10000" position="0 0 1000"></a-entity>
      </a-entity>
      <a-entity ref="forcegraph"></a-entity>
      <a-obj-model id="group" src="#my-obj" mtl="#my-obj-mtl" :visible="false"></a-obj-model>
      <a-entity
        :model-subset="`target: #group; name: node-${index};`"
        v-for="(node, index) in nodes"
        :key="index"
        :id="`node-${index}`"
        scale="20 100 100"
        mouse-react
      ></a-entity>
    </a-scene>
  </div>
</template>

<script>
AFRAME.registerComponent("mouse-react", {
  init() {
    setInterval(() => {
      this.el.object3D.rotateX(Math.random() / 10);
      this.el.object3D.rotateY(Math.random() / 10);
      this.el.object3D.rotateZ(Math.random() / 10);
    }, 200);
  }
});

AFRAME.registerComponent("model-subset", {
  schema: {
    target: { default: "", type: "selector" },
    name: { default: "" }
  },
  init() {
    this.data.target.addEventListener("model-loaded", e =>
      this.el.setObject3D("mesh", e.detail.model.clone())
    );
  }
});

const N = 500;

module.exports = {
  components: {},
  data() {
    return {
      nodes: [...Array(N).keys()].map(id => ({
        id,
        name: id,
        group: id % 2,
        val: Math.floor(Math.random() * 1)
      })),
      links: [...Array(N).keys()].map(id => ({
        source: Math.floor(Math.random() * N),
        target: Math.floor(Math.random() * N),
        color: "white"
      }))
    };
  },
  mounted() {
    this.$refs.forcegraph.setAttribute("forcegraph", {
      nodes: JSON.stringify(this.nodes),
      links: JSON.stringify(this.links),
      numDimensions: 3,
      nodeLabel: "id",
      nodeAutoColorBy: "group",
      linkWidth: 10,
      linkOpacity: 0.5,
      linkCurvature: .1,
      nodeThreeObject: node =>
        document.querySelector(`#node-${node.id}`).object3D
    });
  },
  methods: {
    getObj() {
      console.log("ok");
    }
  }
};
</script>

<style scoped>
.anon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>