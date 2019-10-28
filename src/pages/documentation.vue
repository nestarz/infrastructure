<template>
  <artboard>
    <div v-dragged id="Title">Infrastructure</div>
    <div
      v-dragged
      id="Title-1"
    >If domain names are server addreses, what authority legitimate the name ?</div>
    <div v-dragged id="Layer1">
      This document is a product of the Internet Engineering Task Force
      (IETF). It represents the consensus of the IETF community. It has
      received public review and has been approved for publication by the
      Internet Engineering Steering Group (IESG). Further information on
      Internet Standards is available in Section 2 of RFC 5741.
    </div>
    <div class="frame" v-dragged id="Layer2">
      <a-scene embedded>
        <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      </a-scene>
    </div>
  </artboard>
</template>

<script>
module.exports = {
  components: {
    artboard: httpVueLoader("/src/components/artboard.vue")
  }
};
</script>

<style>
.frame {
  width: 200px;
  height: 200px;
}

#Layer1 {
  width: 200px;
}
</style>