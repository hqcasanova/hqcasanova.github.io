<template>
  <section
    v-if="locale"
    :class="{ 'scroll-hidden': isNoScroll }"
    :tabindex="this.isLanded('home') ? -1 : 0"
  >
    <app-header />
    <about
      :class="['content', fadeClass('about')]"
      :inert="!isLanded('about')"
      @click="onLocalisedClick"
      @vnode-mounted="reset"
    />
    <home
      :class="['content', fadeClass('home')]"
      :inert="!isLanded('home')"
    />
    <work
      ref="work"
      :class="['content', fadeClass('work')]"
      :selectedName="$route.params.selectedName"
      modalTarget="body"
      :modalSplitWidth="1280"
      :inert="!isLanded('work')"
      :localisedClickHandler="onLocalisedClick"
      @vnode-mounted="reset"
    />
    <message-toast
      class="global-toast"
      :isInfo="errIsInfo"
      :title="errTitle"
      :body="errMessage"
      :okLabel="locale.errors.ok"
      @close="errMessage = ''"
    />
  </section>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import MessageToast from '@/components/ui/MessageToast.vue';
import useI8n from '@/composables/useI8n';
import useError from '@/composables/useError';
import About from '@/views/About.vue';
import Home from '@/views/Home.vue';
import Work from '@/views/Work/Work.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    MessageToast,
    About,
    Home,
    Work,
  },

  computed: {
    isModal() {
      const routeParams = this.$route.params;
      const hasParams = routeParams.constructor === Object && Object.values(routeParams).some(Boolean);
      return this.isLanded('work') && hasParams;
    },

    is404() {
      const routeParams = this.$route.params;
      return routeParams.is404 === 'true';
    },

    isNoScroll() {
      return this.errTitle || this.isModal || this.isLanded('home');
    },
  },

  watch: {
    '$route.name': function () { // eslint-disable-line func-names
      if (this.locale) {
        requestAnimationFrame(this.reset.bind(this));
      }
    },

    is404(isNew) {
      if (isNew) {
        this.$store.dispatch('newError', { source: 'pageNotFound', exception: '' });
      }
    },
  },

  setup() {
    const { locale } = useI8n();
    const { errIsInfo, errTitle, errMessage } = useError();
    return {
      locale,
      errIsInfo,
      errTitle,
      errMessage,
    };
  },

  methods: {
    fadeClass(sectionName) {
      if (this.isLanded(sectionName)) {
        return 'fade-in';
      }

      return 'fade-out';
    },

    isLanded(sectionName) {
      return this.$route.name === sectionName;
    },

    reset() {
      this.$el.scrollTop = 0;
      this.$el.focus();
    },

    /**
     * Supports regular anchor tags with an href pointing to an internal route within the language
     * JSON files. Without this logic the app would of course refresh, especially the links within the
     * work modal, which is teleported as child of the body element outside the app.
     * @param {Object} event - DOM event triggered after the click.
     */
    onLocalisedClick(event) {
      const targetEl = event.target;
      const link = targetEl.getAttribute('href');
      const isRouterLink = targetEl.classList.contains('router-link-active');

      if (link && !isRouterLink && this.$router.resolve(link).name) {
        event.preventDefault();
        this.$router.replace(link);
      }
    },
  },
};
</script>

<style lang="scss">
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

h2, h3, h4, i {
  font-family: serif;
  line-height: 1.5em;
  text-transform: uppercase;
}

/* Font effect for locale text */
i {
  @include accented-text;
}

/* Interactive elements */
a, select, svg, button, .button {
  transition:
    color $short-transition linear,
    background-color $short-transition linear,
    border-color $short-transition linear;

  &.primary-btn {
    @include primary-button;
  }
  &.secondary-btn {
    @include secondary-button;
  }
}
a:not(.home-link):not(.section-link) {
  color: lighten($secondary, 10%);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 1px;
  text-decoration-skip: edges;
  text-decoration-color: rgba(lighten($secondary, 10%), 0.5);

  &:hover, &:focus {
    text-decoration-color: lighten($secondary, 10%);
  }
}
a:focus, button:focus {
  @include link-focus;
}

/* Pure-css tooltips */
@import '~cooltipz-css/src/cooltipz';

[data-cooltipz-dir] {

  // Prevents tooltip's target elements break-up due to line wrapping.
  // NOTE: Mobile Chrome behaves bizarrely if inline-block is used, leaving a big gap between the text and right edge.
  display: inline-flex;

  // Tooltips show on focus too, which is not ideal on mobile. Kill it altogether.
  // NOTE: Tooltips do not do auto-positioning. Consequently, they are sometimes truncated on mobile.
  &:focus:before, &:focus:after {
    display: none;
  }
}

/* Toast overlay */
.toast-shown:after {
  content: "";
  z-index: 1;
  display: block;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  backdrop-filter: blur(2px);
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
  outline: none;

  &.scroll-hidden {
    overflow-y: hidden;
  }

  .message-toast.global-toast {
    z-index: 100;
  }

  .content {
    padding: 1rem 1.55rem 1.2rem;
    transition: opacity $long-transition ease-in;
    transition-delay: $scroll-delay;

    &:not(:first-of-type) {
      position: absolute;
      left: 0;
      right: 0;
    }

    &.work-wrapper {
      top: calc(#{$bar-height} + 1rem);
    }

    &.fade-out {
      opacity: 0;
      transform: scale(0);
    }

    &.fade-in {
      opacity: 1;
    }

    h2 {
      font-size: 2rem;
      color: $secondary;
    }
  }

  @media (min-width: 768px) and (min-height: 450px) {
    top: calc(#{$bar-height} + 1rem);

    .content.work-wrapper {
      top: auto;
    }
  }
}

.at-work.modal-shown {
  @media (min-width: 1280px) and (orientation: landscape) {
    .app-header, section, .contact-footer {
      width: 425px;
    }

    .app-header {
      .home-link {
        font-size: 2.2em;
      }
      .section-link {
        margin-left: .9em;
        font-size: 1.1em;
      }

      .menu-utils {
        font-size: .9em;

        .lang-selector {
          display: none;
        }

        .util-social {
          &:first-of-type {
            margin-left: 0;
          }
          &:last-of-type {
            display: none;
          }
        }
      }
    }

    section {
      &.scroll-hidden {
        overflow-y: auto;
      }

      .work-wrapper {
         font-size: 16px;
      }
    }

    .modal {
      left: 425px;
      right: 0;

      .modal-bar {
        height: 89px;
      }

      .screenshots {
        .lazy-image {
          min-height: 13.5vw;
        }

        @media (min-width: 1710px) {
          column-count: 2;
          column-fill: balance;
        }
      }
    }
  }
}
</style>
