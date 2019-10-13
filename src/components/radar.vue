<template>
  <div id="radar" >
    <div class="beacon" id="beacon"></div>
    <div class="beacon" id="beacon-75"></div>
    <div class="beacon" id="beacon-50"></div>
    <div class="beacon" id="beacon-25"></div>
    <div class="circle" id="circle-big"></div>
    <div class="circle" id="circle-medium"></div>
    <div class="circle" id="circle-small"></div>
    <div class="circle" id="dot"></div>
    <div id="vertical"></div>
    <div id="horizontal"></div>
  </div>
</template>

<style scoped>
#radar {
  position: absolute;
  width: 100vmax;
  height: 100vmin;
  margin: 0px auto;
  border: 3px solid rgb(10, 63, 26);
  background-color: #000;
  mix-blend-mode: color-dodge;
  transform: translate3d(0, 0, 0);
  z-index: 1000;
  will-change: opacity;
  pointer-events: none;
  background-size: 10px 15px;
  background-image: linear-gradient(to right, rgb(10, 63, 26) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(10, 63, 26) 1px, transparent 1px);
}
#radar > * {
  position: absolute;
}
.beacon {
  left: 50%;
  top: 50%;
  border-style: solid;
  border-width: 20vmin 100vmin 20vmin 0;
  border-color: transparent;
  margin-top: -20vmin;
  transform-origin: 0 50%;
}
#beacon {
  border-right-color: rgb(0, 204, 0);
  animation: spin 10s 0s steps(23) infinite;
}
#beacon-75 {
  border-right-color: rgba(0, 204, 0, 0.75);
  animation: spin 10s 0.03s steps(23) infinite;
}
#beacon-50 {
  border-right-color: rgba(0, 204, 0, 0.5);
  animation: spin 5s 0.05s steps(12) infinite;
}
#beacon-25 {
  border-right-color: rgba(0, 204, 0, 0.25);
  animation: spin 2.5s 0.07s steps(13) infinite;
}
.circle {
  left: 50%;
  top: 50%;
  border: 1px solid rgb(10, 63, 26);
  border-radius: 50%;
}
#circle-big {
  width: calc(100vmin / 2);
  height: calc(100vmin / 2);
  margin: calc(-100vmin / 4);
}
#circle-medium {
  width: 200px;
  height: 200px;
  margin: -100px;
}
#circle-small {
  width: 100px;
  height: 100px;
  margin: -50px;
}
#dot {
  width: 8px;
  height: 8px;
  margin: -4px;
  background-color: rgb(10, 63, 26);
}
#vertical {
  left: 50%;
  top: 0;
  bottom: 0;
  border-left: 1px solid rgb(10, 63, 26);
}
#horizontal {
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid rgb(10, 63, 26);
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>