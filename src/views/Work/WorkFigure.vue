<template>
  <figure
    class="work-figure"
    :class="{
      'caption-in': isImgReady && isShow,
      'dilute-img': isImgReady && !isShow,
      'allow-responsive': isResponsive,
      'reverse-layout': isReverse,
    }"
  >
    <lazy-image
      class="item-img"
      :src="`${baseUrl}${name}/0.jpg`"
      :initVisible="isPreloadImg"
      @ready="isImgReady = true"
    />
    <figcaption class="item-caption">
      <time class="item-period">{{ period }}</time>
      <button
        class="item-name secondary-btn"
        v-html="title"
      />
    </figcaption>
  </figure>
</template>

<script>
import LazyImage from '@/components/ui/LazyImage.vue';

export default {
  name: 'WorkFigure',

  components: {
    LazyImage,
  },

  props: {
    isShow: {
      type: Boolean,
      default: false,
    },

    isResponsive: {
      type: Boolean,
      default: true,
    },

    isReverse: {
      type: Boolean,
      default: false,
    },

    isPreloadImg: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      required: true,
    },

    period: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    baseUrl: {
      type: String,
      default: process.env.BASE_URL,
    },
  },

  data() {
    return {
      isImgReady: false,
    };
  },

  unmounted() {
    LazyImage.methods.cleanup();
  },
};
</script>

<style lang="scss" scoped>
.work-figure {
  position: relative;

  .item-img {
    width: 100%;
    height: 40vh;
    transition: opacity $medium-transition linear, transform $medium-transition linear;
  }

  &.dilute-img .item-img {
    opacity: 0;
    transform: scale(0.9);
  }

  .item-caption {
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: $white;
    background: rgba(0, 0, 0, .25);
    transform: scale(0.8);
    transition: opacity $medium-transition linear, transform $medium-transition linear;

    .item-period {
      font-size: 1.2em;
    }

    .item-name {
      display: block;
      min-width: 8rem;
      padding-top: .48em;
      padding-bottom: .1em;
      color: currentColor;
      font-family: serif;
      text-transform: uppercase;
      background-color: #000;
      border-color: currentColor;
    }
  }

  &.router-link-exact-active, &:hover {
    .item-name {
      color: lighten($secondary, 10%);
      border-color: lighten($secondary, 10%)  ;
    }
  }

  &.caption-in .item-caption {
    opacity: 1;
    transform: scale(1);
  }

  &.allow-responsive {
    @media (min-width: 768px), (orientation: landscape) {
      display: flex;
      align-items: center;

      &:before, &:after {
        content: '';
        opacity: 0;
        display: block;
        position: absolute;
        transition:
          opacity ($long-transition + $medium-transition) linear,
          transform ($long-transition + $medium-transition) linear;
      }

      &:before {
        z-index: 1;
        top: calc(50% + .8em);
        right: calc(25% + .2em);
        width: 20%;
        height: .1em;
        background: $white;
        background: linear-gradient(
          -90deg,
          $white 0%,
          $white 50%,
          var(--primary-colour) 80%
        );
      }

      &:after {
        top: calc(50% + .56em);
        right: 50%;
        width: .6em;
        height: .6em;
        background: $white;
        background: var(--primary-colour);
        border-radius: 50%;
        transform: translateX(5vw);
      }

      &.caption-in {
        &:before {
          opacity: 1;
          transform: scaleX(1.5);
        }
        &:after {
          opacity: 1;
          transform: translateX(0) !important;
        }
      }

      .item-img {
        flex: 0 0 58%;
        height: 25.9vw;
      }

      .item-caption {
        z-index: 1;
        position: static;
        color: $lighter-grey;
        background: none !important;
      }

      &.reverse-layout {
        flex-direction: row-reverse;

        &:before {
          left: calc(25% - .4em);
          right: auto;
          background: linear-gradient(
            90deg,
            $white 0%,
            $white 50%,
            var(--primary-colour) 80%
          );
        }
        &:after {
          transform: translateX(-5vw);
        }
      }
    }
  }
}
</style>
