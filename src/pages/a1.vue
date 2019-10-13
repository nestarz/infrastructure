<template>
  <print>
    <div class="container">
      <div class="pinboard screenshots">
        <pinboard content-src="/assets/json/screens.json"></pinboard>
      </div>
      <ul class="pinboard logins">
        <li v-for="tuple in fortnite" :key="tuple.email">
          <div class="link">{{tuple.email}}</div>
          <div>{{tuple.password}}</div>
        </li>
      </ul>
      <ul class="pinboard onions">
        <li v-for="tuple in onions" :key="tuple.link">
          <div class="link">{{tuple.link}}</div>
          <div class="title">{{tuple.title}}</div>
        </li>
      </ul>
      <ul class="pinboard fbi">
        <li v-for="tuple in fbi" :key="tuple.link">
          <div class="link">{{tuple.name}}</div>
          <div class="title">{{tuple.address1}}</div>
          <div class="title">{{tuple.address2}}</div>
          <div class="title">{{tuple.phone}}</div>
        </li>
      </ul>
      <div class="pinboard logos">
        <pinboard content-src="/assets/json/logos.json"></pinboard>
      </div>
    </div>
  </print>
</template>

<script>
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

module.exports = {
  components: {
    print: httpVueLoader("src/components/print.vue"),
    pinboard: httpVueLoader("src/components/pinboard.vue")
  },
  data() {
    return {
      fortnite: [],
      onions: [],
      fbi: []
    };
  },
  mounted() {
    fetch("/assets/json/fort8.json")
      .then(response => response.json())
      .then(data => (this.fortnite = shuffleArray(data)));
    fetch("/assets/json/onions.json")
      .then(response => response.json())
      .then(data => (this.onions = shuffleArray(data)));
    fetch("/assets/json/fbi.json")
      .then(response => response.json())
      .then(data => (this.fbi = data));
  }
};
</script>

<style scoped>
img {
  width: 70mm;
}

.container {
  height: 100%;
  background: #fff;
  color: black;
  font-size: 50mm;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15mm;
  padding: 5mm;
  box-sizing: border-box;
}

ul {
  margin: 0;
  padding: 0;
}

.pinboard {
  font-size: 10mm;
  overflow: hidden;
}

.logos {
  position: absolute;
  top: 10mm;
  left: 10mm;
  right: 10mm;
  bottom: 10mm;
  z-index: 99999;
  mix-blend-mode: darken;
  overflow: hidden;
}

.pinboard li {
  display: grid;
  grid-template-columns: 58% 50%;
}

.pinboard.screenshots {
  grid-row: span 3;
}

.link,
.title {
  overflow: hidden;
  white-space: nowrap;
  display: inline;
}

.logos img {
  width: 30mm;
}
</style>