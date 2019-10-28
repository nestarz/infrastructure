<template>
  <div class="artboard">
    <div class="sketch" @dragged="focus">
      <slot></slot>
      <textarea v-for="text in texts" :key="text.id" v-dragged :id="text.id" v-model="text.text"></textarea>
    </div>
    <div class="tools" tabindex="0" :class="{ open }">
      <div class="header option" @click="toggle">
        <div class="title">Artboard</div>
        <div class="button plus">+</div>
        <div class="button minus">-</div>
      </div>
      <div class="option">
        <div class="title">Config JSON</div>
        <div class="button">C</div>
        <a class="button" :href="positionsBase64" download="Artboard.json">S</a>
      </div>
      <div class="json">
        <textarea readonly v-model="positionsStr"></textarea>
      </div>
      <div class="option">
        <div class="title">Tools</div>
      </div>
      <div class="toolbox">
        <div class="button" @click="newText">T</div>
      </div>
      <div class="option">
        <div class="title">Layers</div>
      </div>
      <select class="layer" v-model="selected">
        <option
          class="name"
          v-for="([layer, value]) in Object.entries(positions)"
          v-bind:value="{layer, value}"
          :key="layer"
        >{{ layer }}</option>
      </select>
      <div class="config" v-if="selected">
        <div class="fieldset" v-for="[label, value] in Object.entries(selected.value)" :key="label">
          <label :for="label">{{ label }}</label>
          <input type="number" :id="label" :name="label" :value="value" />
        </div>
        <div class="fieldset add">
          <select class="layer" v-model="newoption.label">
            <option class="name" value="z-index">z-index</option>
          </select>
          <input type="number" id="new" name="new" v-model="newoption.value" />
          <div class="button" @click="add(newoption)">A</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      texts: [],
      positions: JSON.parse(localStorage.positions || "{}"),
      open: true,
      selected: null,
      newoption: {
        value: null,
        label: null
      }
    };
  },
  computed: {
    positionsStr() {
      return JSON.stringify(this.positions, null, 2);
    },
    positionsBase64() {
      return (
        "data:text/plain;charset=utf-8," + encodeURIComponent(this.positionsStr)
      );
    }
  },
  methods: {
    add(newoption) {
      if (!newoption.label) return;

      this.positions[this.selected.layer] = {
        ...this.positions[this.selected.layer],
        [newoption.label]: newoption.value
      };
      localStorage.positions = JSON.stringify(this.positions);
      console.log(localStorage.positions);
    },
    focus({ target: { id } }) {
      this.positions = JSON.parse(localStorage.positions || "{}");
      this.selected = {
        layer: id,
        value: this.positions[id]
      };
    },
    toggle() {
      this.open = !this.open;
    },
    newText() {
      console.log(this.texts)
      this.texts.push({
        id: Math.random(),
        text: "Test"
      });
    }
  }
};
</script>

<style>
:root {
  --color-text: #c3c3c3;
}

.artboard {
  display: grid;
  grid-template-columns: 1fr 220px;
}

.tools {
  font-size: 12px;
  color: var(--color-text);
  font-family: Lexend;
  margin: 1em;
  z-index: 999999;
  outline: none;
  cursor: pointer;
  max-height: calc(100vh - 2em);
  overflow: scroll;
}

.tools > * {
  visibility: hidden;
  border-radius: 7px;
  margin-bottom: 7px;
}

.tools.open > * {
  visibility: visible;
}

.tools .minus,
.tools.open .plus {
  display: none;
}

.tools .plus,
.tools.open .minus {
  display: inline;
  margin: 0 1em;
}

.header {
  visibility: visible;
}

.option {
  background: rgb(56, 56, 56);
  text-transform: uppercase;
  font-size: 1em;
  display: flex;
  user-select: none;
}

.title {
  margin-right: auto;
}

.option > div {
  padding: 0.5em 1em;
  padding-right: 0;
}

.button {
  display: inline;
  padding: 0.5em 1em;
  padding-left: 1em;
  cursor: pointer;
  background: rgb(56, 56, 56);
}

select {
  width: 100%;
  color: var(--color-text);
  background: rgb(41, 41, 41);
}

.button:hover {
  filter: brightness(2);
}

.tools textarea {
  width: 100%;
  box-sizing: border-box;
  background: rgb(41, 41, 41);
  color: var(--color-text);
  height: 120px;
  padding: 1em;
  border: none;
  resize: none;
  outline: none;
}

.fieldset {
  display: grid;
  grid-template-columns: 60px 1fr;
  background: rgb(56, 56, 56);
}

.fieldset.add {
  grid-template-columns: 20% 60% 20%;
  margin-top: 7px;
}

.fieldset input,
.fieldset label {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgb(41, 41, 41);
  color: var(--color-text);
  padding: 0.5em 1em;
  border: none;
}

.layer .name {
  white-space: nowrap;
  overflow: hidden;
}

.sketch textarea {
  background: none;
  color: inherit;
  border: none;
}
</style>