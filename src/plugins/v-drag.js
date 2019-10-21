var isDragging = null;
const unitMap = {
  em: { x: "em", y: "em" },
  px: { x: "px", y: "px" },
  vp: { x: "vw", y: "vh" },
  percent: { x: "%", y: "%" }
};

const onDragged = ({
  el,
  deltaX,
  deltaY,
  offsetX,
  offsetY,
  clientX,
  clientY,
  first,
  last,
  unit
}) => {
  if (first) {
    el.style.cursor = "grabbing";
    isDragging = true;
    return;
  }
  if (last) {
    isDragging = false;
    el.style.cursor = "grab";
    return;
  }
  const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
  el.style.left =
    parseFloat(el.style.left || 0) +
    deltaX / (window.innerWidth / 100) +
    unitMap[unit].x;
  el.style.top =
    parseFloat(el.style.top || 0) +
    deltaY / (window.innerHeight / 100) +
    unitMap[unit].y;
  el.style.position = "absolute";

  var positions = JSON.parse(localStorage.positions || "{}");
  positions[el.id] = {
    left: parseFloat(el.style.left || 0),
    top: parseFloat(el.style.top || 0)
  };
  localStorage.positions = JSON.stringify(positions);
};

const addEventListeners = (el, events, handler) => {
  for (var i = 0, len = events.length; i < len; i++) {
    el.addEventListener(events[i], handler);
  }
};

const removeEventListeners = (el, events, handler) => {
  for (var i = 0, len = events.length; i < len; i++) {
    el.removeEventListener(events[i], handler);
  }
};

const POINTER_START_EVENTS = ["mousedown", "touchstart"];
const POINTER_MOVE_EVENTS = ["mousemove", "touchmove"];
const POINTER_END_EVENTS = ["mouseup", "touchend"];
var draggedElem;

const directive = {
  inserted(el, binding, vnode) {
    if (!document) return;
    el.style.cursor = "grab";
    el.addEventListener("mousemove", e => {
      const event = new CustomEvent("dragged", {
        detail: {
          id: el.id
        },
        bubbles: true
      });
      el.dispatchEvent(event);
    });

    const defaultValue = { onDragged, unit: "percent" };
    const value = {
      ...defaultValue,
      ...(typeof binding.value === "function"
        ? { onDragged: binding.value }
        : typeof binding.value === "object"
        ? binding.value
        : {})
    };
    if (localStorage.positions) {
      const positions = JSON.parse(localStorage.positions);

      if (positions[el.id]) {
        el.style.left = positions[el.id].left + unitMap[value.unit].x;
        el.style.top = positions[el.id].top + unitMap[value.unit].y;
        el.style.position = "absolute";
      }
    }
    function onPointerStart(evt) {
      el.lastCoords = el.firstCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      value.onDragged({
        el,
        first: true,
        clientX: evt.clientX,
        clientY: evt.clientY,
        unit: value.unit
      });
      draggedElem = el;
    }
    function onPointerEnd(evt) {
      if (el !== draggedElem) return;
      evt.preventDefault();
      el.lastCoords = null;
      value.onDragged({
        el,
        last: true,
        clientX: evt.clientX,
        clientY: evt.clientY,
        unit: value.unit
      });
      draggedElem = null;
    }
    function onPointerMove(evt) {
      if (el !== draggedElem) return;
      evt.preventDefault();
      if (el.lastCoords) {
        var deltaX = evt.clientX - el.lastCoords.x;
        var deltaY = evt.clientY - el.lastCoords.y;
        var offsetX = evt.clientX - el.firstCoords.x;
        var offsetY = evt.clientY - el.firstCoords.y;
        var clientX = evt.clientX;
        var clientY = evt.clientY;

        value.onDragged({
          el,
          deltaX,
          deltaY,
          offsetX,
          offsetY,
          clientX,
          clientY,
          unit: value.unit
        });
        el.lastCoords = {
          x: evt.clientX,
          y: evt.clientY
        };
      }
    }
    addEventListeners(el, POINTER_START_EVENTS, onPointerStart);
    addEventListeners(
      document.documentElement,
      POINTER_END_EVENTS,
      onPointerEnd
    );
    addEventListeners(
      document.documentElement,
      POINTER_MOVE_EVENTS,
      onPointerMove
    );
  },

  unbind(el) {
    removeEventListeners(el, POINTER_START_EVENTS);
    removeEventListeners(document.documentElement, POINTER_END_EVENTS);
    removeEventListeners(document.documentElement, POINTER_MOVE_EVENTS);
  }
};

const defaultOptions = {};
export default {
  install: function(Vue, options) {
    options = Object.assign({}, defaultOptions, options);
    let major = Number(Vue.version.split(".")[0]);
    let minor = Number(Vue.version.split(".")[1]);
    if (major < 2 && minor < 1) {
      throw new Error(
        `v-dragged supports vue version 2.1 and above. You are using Vue@${Vue.version}. Please upgrade to the latest version of Vue.`
      );
    }
    // registration
    Vue.directive("dragged", directive);
  },
  directive
};
