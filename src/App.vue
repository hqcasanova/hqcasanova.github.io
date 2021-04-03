<template>
  <section v-if="locale">
    <message-toast
      class="global-toast"
      :title="errTitle"
      :body="errMessage"
      :okLabel="locale.errors.ok"
      @close="errMessage = ''"
    />
    <app-header :isTransitioning="isTransitioning" />
    <router-view
      class="content"
      v-slot="{ Component }"
    >
      <transition
        name="fade"
        mode="out-in"
        @leave="isTransitioning = true"
        @enter="isTransitioning = false"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import MessageToast from '@/components/ui/MessageToast.vue';
import useI8n from '@/composables/useI8n';
import useError from '@/composables/useError';

export default {
  name: 'App',
  components: {
    AppHeader,
    MessageToast,
  },

  data() {
    return {
      isTransitioning: false,
    };
  },

  setup() {
    const { locale } = useI8n();
    const { errTitle, errMessage } = useError();
    return {
      locale,
      errTitle,
      errMessage,
    };
  },
};
</script>

<style lang="scss">

/* Font for titles */
@font-face {
  font-family: 'Accent';
  src: url('~@/assets/accent.woff2') format('woff2'),
       url('~@/assets/accent.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

/* Fluid typography */
@media screen and (min-width: 320px) {
  html {
    font-size: calc(16px + 6 * ((100vw - 320px) / 680));
  }
}
@media screen and (min-width: 1000px) {
  html {
    font-size: 22px;
  }
}

/* Pure-css tooltips */
@import '~cooltipz-css/src/cooltipz';

[data-cooltipz-dir] {

  // Prevents tooltips target elements break up due to line wrapping.
  // NOTE: Mobile Chrome behaves bizarrely if inline-block is used, leaving a big gap between the text and right edge.
  display: inline-flex;

  // Tooltip show on focus too, which is not ideal on mobile. Kill it altogether.
  // NOTE: Tooltips do not do auto-positioning. Consequently, they are sometimes truncated on mobile.
  &:focus:before, &:focus:after {
    display: none;
  }
}

/* Global layout */
section {
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none;
  top: 0;
  bottom: $bar-height;
  display: flex;
  flex-direction: column;
  width: 100%;
  scrollbar-color: $primary $darker-grey;

  &::-webkit-scrollbar {
    width: auto;
  }
  &::-webkit-scrollbar-track {
    background: $darker-grey;

    &:hover {
      background: $dark-grey;
    }
  }
  &::-webkit-scrollbar-thumb {
    background: $primary;
  }

  .message-toast.global-toast {
    z-index: 100;
  }

  .content {
    padding: 1rem 1.55rem 1.2rem;

    &.fade-enter-from, &.fade-leave-to {
      opacity: 0;
    }

    &.fade-leave-active {
      transition: opacity $short-transition linear;
    }

    &.fade-enter-active {
      transition: opacity $long-transition ease-in;
      transition-delay: $scroll-delay;
    }

    h2 {
      margin-bottom: -.75rem;
      font-size: 2rem;
      text-transform: uppercase;
      color: $secondary;

      @include accented-first-letter;
    }

    a, .inline-section-link {
      color: lighten($secondary, 10%);
    }

    a {
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 1px;
      text-decoration-skip: edges;
    }

    .inline-section-link {
      cursor: pointer;
      @include absolute-underline(lighten($secondary, 10%));
    }
  }

  a:focus, button:focus, .inline-section-link:focus {
    background-color: rgba($lighter-grey, .2);
    border-radius: .3em;
  }

  @media (min-width: 768px) and (min-height: 450px) {
    top: calc(#{$bar-height} + 1rem);
  }
}
</style>
