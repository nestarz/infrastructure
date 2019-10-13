<template>
  <div class="A1">
    <div class="feuille">
      <slot />
    </div>
  </div>
</template>

<script>
module.exports = {};
</script>

<style>
@page {
  size: A1;
  margin: 0;
}

@media screen {
  .A1 .feuille {
    zoom: 0.25;
  }
}

@media print {
  body,
  html {
    background: #fff;
  }
}

.A1 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.A1 .feuille {
  position: relative;
  width: 594mm;
  height: 840mm;
  background: #fff;
  overflow: hidden;
}
</style>