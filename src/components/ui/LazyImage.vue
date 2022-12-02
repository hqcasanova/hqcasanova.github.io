<template>
  <div
    class="lazy-image"
    :class="{
      'loaded': isLoaded,
      'visible': isVisible,
      'darkened': isDarkened,
    }"
  >
    <img :src="lazySrc" @load="onImgLoad" alt decoding="async" ref="image" />
    <svg role="img" aria-label="rectangle" focusable="false" stroke-width="1" stroke="currentColor" width="300" height="300" preserveAspectRatio="none" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 l300,0 M300,0 l0,300 M300,300 l-300,0 M0,300 l0,-300"></path>
    </svg>
  </div>
</template>

<script>
import { watch, ref } from 'vue';

// Prepares the ground to ensure a single observer for all the component's future instances.
let CONTEXT = new WeakMap();
let OBSERVER = null;

export default {
  name: 'LazyImage',

  props: {
    src: {
      type: String,
      required: true,
    },

    initVisible: {
      type: Boolean,
      default: false,
    },

    isDarkened: {
      type: Boolean,
      default: true,
    },
  },

  // Notifies the outside world when the image is both loaded and visible.
  setup(props, { emit }) {
    const isLoaded = ref(false);
    const isVisible = ref(props.initVisible);

    watch([isVisible, isLoaded], () => {
      if (isVisible.value && isLoaded.value) {
        emit('ready');
      }
    });

    return {
      isLoaded,
      isVisible,
    };
  },

  computed: {
    lazySrc() {
      if (this.isVisible) {
        return this.src;
      }

      return 'data:,';
    },
  },

  mounted() {
    if (this.initVisible) {
      this.$refs.image.decode();
    } else {
      CONTEXT.set(this.$el, this);

      if (!OBSERVER) {
        OBSERVER = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0) {
              CONTEXT.get(entry.target).isVisible = true;
              OBSERVER.unobserve(entry.target);
            }
          });
        });
      }

      OBSERVER.observe(this.$el);
    }
  },

  unmounted() {
    if (OBSERVER) {
      OBSERVER.unobserve(this.$el);
    }
  },

  methods: {
    onImgLoad() {
      this.isLoaded = true;
    },

    cleanup() {
      const hasDisconnect = OBSERVER && 'disconnect' in OBSERVER;

      if (hasDisconnect) {
        OBSERVER.disconnect();
      }
      CONTEXT = new WeakMap();
    },
  },
};
</script>

<style lang="scss" scoped>
.lazy-image {
  position: relative;
  overflow: hidden;
  color: $secondary;

  img {
    display: block;
    width: auto;
    height: 100%;
    transform: translateZ(0px);

    @supports (object-fit: cover) and (object-position: top) {
      min-width: 100%;
      object-position: top;
      object-fit: cover;
    }
  }

  svg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    stroke-width: 0.1em;
    stroke-dasharray: 300;
    stroke-dashoffset: 300;
    background-color: rgba(15, 15, 15, 1);
  }

  &.visible {
    svg {
      animation: hero-draw 2s linear forwards;
    }
    path {
      animation: hero-pulse 1s linear infinite alternate;
      animation-delay: 2s;
    }

    &.loaded {
      svg {
        animation: hero-undraw 2s linear forwards;
      }

      &:not(.darkened) svg {
        transition: opacity 2s ease-out;
        opacity: 0;
      }
    }
  }
}
</style>
