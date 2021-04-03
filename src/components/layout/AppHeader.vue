<template>
  <nav
    class="menu app-header"
    :class="{
      'at-home': atHome,
      'transition-start': isHeaderTransitioning,
      'transition-end': !isHeaderTransitioning,
    }"
  >
    <home-link
      class="menu-home-link"
      :isLogo="true"
    />
    <span class="menu-contact-wrapper">
      <contact-link
        class="menu-contact-link"
        :subject="locale.emailSubject"
      />
      <copy-button
        :copyText="contactAddress"
        :actionText="locale.copy.action"
        :successText="locale.copy.success"
        tooltipDirection="bottom"
      />
    </span>
    <ul
      class="menu-group menu-sections"
      ref="menuSections"
    >
      <li class="button-slot">
        <home-link class="section-home-link" />
      </li>
      <li v-if="locale">
        <router-link class="section-link"
          :to="{name: 'about'}"
          replace
          v-html="atHome ? locale.ctas.about : locale.routes.about"
        >
        </router-link>
      </li>
      <li v-if="locale">
        <router-link class="section-link"
          :to="{name: 'work'}"
          replace
          v-html="atHome ? locale.ctas.work : locale.routes.work"
        >
        </router-link>
      </li>
      <li class="button-slot contact-slot">
        <span class="contact-label">{{ locale.ctas.contact }}</span>
        <contact-link
          :subject="locale.emailSubject"
          @mounted="contactAddress = $event"
        />
        <copy-button
          :copyText="contactAddress"
          :actionText="locale.copy.action"
          :successText="locale.copy.success"
          tooltipDirection="top"
        />
      </li>
    </ul>
    <menu-utils class="menu-group" />
  </nav>
</template>

<script>
import HomeLink from '@/components/ui/HomeLink.vue';
import MenuUtils from '@/components/layout/MenuUtils.vue';
import ContactLink from '@/components/ui/ContactLink.vue';
import CopyButton from '@/components/ui/CopyButton.vue';
import useI8n from '@/composables/useI8n';

export default {
  name: 'AppHeader',

  components: {
    HomeLink,
    MenuUtils,
    ContactLink,
    CopyButton,
  },

  props: {
    isTransitioning: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    atHome() {
      return this.$route.name === 'home';
    },

    isHeaderTransitioning() {
      return this.isHeaderChange && this.isTransitioning;
    },
  },

  data() {
    return {
      isHeaderChange: false,
      contactAddress: '',
    };
  },

  watch: {
    $route(to, from) {
      if (to.name === 'home' || from.name === 'home') {
        this.isHeaderChange = true;
      } else {
        this.isHeaderChange = false;
      }
    },
  },

  setup() {
    const { locale } = useI8n();
    return {
      locale,
    };
  },

  mounted() {
    document.addEventListener('swiped-up', this.onSwipe.bind(this, 'work'));
    document.addEventListener('swiped-down', this.onSwipe.bind(this, 'about'));
  },

  methods: {
    onSwipe(toName) {
      if (this.atHome) {
        this.$router.push({ name: toName });
      }
    },
  },
};
</script>

<!-- For dynamic markup off the template -->
<style lang="scss">
i {
  display: inline-block;
  margin-bottom: -0.3em;
  text-transform: uppercase;

  @include accented-first-letter;
}
</style>

<!-- For markup in the template -->
<style lang="scss" scoped>
.menu {
  display: flex;
  align-items: center;
  padding: .6em 1.3em 0;
  font-size: 16px;

  // Use of vw instead of 100% to prevent scrollbar-induced reflow (https://stackoverflow.com/a/42987298)
  width: 100vw;

  .menu-home-link {
    padding: 0.44rem 0.4rem;
    font-size: 1.9rem;
    background-color: $primary;
    color: $white;
    border-radius: .4rem;
    transition: background-color $short-transition linear;

    &:hover, &:focus {
      background-color: $white;
      color: $primary;
    }
  }

  .menu-contact-wrapper {
    @include bottom-bar;
    justify-content: center;
    background: linear-gradient(
      0deg,
       rgba(0,0,0,1) 0%,
       rgba(0,0,0,0) 75%
    );
    box-shadow: none;

    .menu-contact-link {
      margin-left: .4rem;
      padding: .65rem 0;

      &:deep(svg) {
        display: none;
      }

      &:hover, &:focus {
        color: #fff;
      }
    }

    .copy-button {
      padding: .7rem;
    }

    @media (min-width: 675px) {
      position: static;
      height: auto;
      margin-left: .2rem;
      font-size: .9rem;
      background: none;
    }
  }

  .menu-group {
    display: flex;
    height: $bar-height;
    backface-visibility: hidden;
    list-style: none;
    text-align: center;

    a, select, svg {
      transition:
        color $short-transition linear,
        background-color $short-transition linear,
        border-color $short-transition linear;
    }
  }

  .menu-sections {
    @include bottom-bar;
    justify-content: space-between;
    color: $light-grey;
    transition: opacity $short-transition ease-in;

    li {
      display: inline-flex;

      a {
        width: 100%;
        text-align: center;

        &.router-link-exact-active, &:hover {
          color: lighten($secondary, 10%);
        }
      }
    }

    .button-slot {
      &:first-of-type {
        margin-left: .25em
      }
      &:last-of-type {
        margin-right: .25em
      }
    }

    .home-link, .contact-link {
      font-size: 1.7rem;
      padding: 0.35em 0.25em;
    }

    .home-link:deep(.home-logo) {
        display: none;
    }

    .section-link {
      display: inline-block;
      margin-bottom: -.3em;
      padding: 0.7em 0.4em;
      font-family: serif;
      font-size: .9rem;
      text-transform: uppercase;
      border-radius: .5em;

      @include accented-first-letter;
    }

    .contact-label, .contact-link:deep(.contact-address) {
      display: none;
    }
    .copy-button {
      display: none;
      padding: .45em;
    }
  }

  .menu-utils {
    flex-grow: 1;
    align-items: center;

    @media (min-width: 460px) {
      flex-grow: 0;
      margin-left: auto;
    }
  }

  @media (min-width: 768px) and (min-height: 450px) {
    position: fixed;
    top: 0;
    left: 0;
  }

  &.transition-start .menu-sections {
    visibility: hidden;
    opacity: 0;
  }

  &.transition-end .menu-sections {
    transition-delay: $scroll-delay;
    visibility: visible;
    opacity: 1;
  }

  &.transition-end.at-home .menu-sections {
    top: 49%;
    left: 50%;
    transform: translateX(-50%);
    bottom: auto;
    flex-direction: column;
    align-items: normal;
    min-width: 46.29vh;
    padding: 0;
    font-size: 1rem;
    background: transparent;
    box-shadow: none;

    li {
      margin-right: 0;
      flex: 1;

      &:nth-child(2) {
        margin-bottom: 1.1em;
      }

      &.button-slot {
        display: none;
      }

      .section-link {
        display: block;
        margin-bottom: 0;
        padding: 0.6em 1em;
        font-size: 1em;
        font-family: inherit;
        font-weight: 400;
        text-transform: none;
        white-space: nowrap;
        color: $primary;
        background-color: $white;
        border: .05em solid $white;

        &:first-letter {
          font: inherit;
          vertical-align: inherit;
        }

        &:after {
          display: none;
        }

        &:hover, &:focus, &.router-link-exact-active {
          background-color: #fff;
          border-color: $primary;
        }
      }
    }

    @media (orientation: landscape), (min-width: 768px) {
      flex-direction: row;

      li:nth-child(2) {
        margin-right: .95em;
        margin-bottom: 0;
      }
    }

    @media (orientation: landscape) {
      left: 0;
      width: 114vh;
      height: auto;
      transform: none;
      padding-left: 7%;

      @media (max-height: 500px) {
        top: 56%;
      }
    }
  }

  &.transition-end:not(.at-home) {
    @media (min-width: 768px) and (min-height: 450px) {
      .menu-contact-wrapper {
        display: none;
      }

      .menu-sections {
        position: static;
        height: auto;
        justify-content: flex-start;
        flex: 1;
        padding: 0;
        background: transparent;
        box-shadow: none;

        .section-home-link {
          display: none;
        }

        .section-link {
          margin-left: 1.6em;
          text-transform: uppercase;
        }

        .contact-slot {
          @include bottom-bar;
          margin: 0;
          justify-content: center;
          font-size: 1rem;

          .contact-label {
            display: inline;
            padding-right: .3em;
          }

          .contact-link {
            width: auto;
            height: auto;
            font-size: 1rem;
            color: $secondary;

            &:deep(svg) {
              display: none;
            }
            &:deep(.contact-address) {
              display: inline;
            }
          }

          .copy-button {
            display: block;
          }
        }
      }
    }
  }
}
</style>
