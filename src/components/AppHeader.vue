<template>
  <nav class="menu app-header">
    <home-link
      class="menu-home-link"
      :isLogo="true"
    />
    <ul
      class="menu-group menu-sections"
    >
      <li class="home-slot">
        <home-link class="section-home-link" :isLogo="width < 320" />
      </li>
      <li v-if="locale">
        <router-link
          ref="aboutLink"
          class="section-link"
          :to="{name: 'about'}"
          replace
          v-html="locale.routes.about"
        >
        </router-link>
      </li>
      <li v-if="locale">
        <router-link
          ref="workLink"
          class="section-link"
          :to="{name: 'work'}"
          replace
          v-html="locale.routes.work"
        >
        </router-link>
      </li>
    </ul>
    <menu-utils
      class="menu-group"
      :isSocialIcons="true"
    />
  </nav>
</template>

<script>
import HomeLink from '@/components/ui/HomeLink.vue';
import MenuUtils from '@/components/layout/MenuUtils.vue';
import useI8n from '@/composables/useI8n';
import useResize from '@/composables/useResize';

export default {
  name: 'AppHeader',

  components: {
    HomeLink,
    MenuUtils,
  },

  setup() {
    const { locale } = useI8n();
    const { width } = useResize();
    return {
      locale,
      width,
    };
  },

  mounted() {
    const linkEl = this.$refs[`${this.$route.name}Link`];

    if (linkEl) {
      linkEl.$el.classList.add('router-link-active', 'router-link-exact-active');
    }
  },
};
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: .6em 1.3em 0;
  font-size: 16px;

  // Use of vw instead of 100% to prevent scrollbar-induced reflow (https://stackoverflow.com/a/42987298)
  width: 100vw;

  .menu-home-link {
    display: none;
    padding: 0.44rem 0.4rem;
    font-size: 1.9rem;
    background-color: $primary;
    color: $lighter-grey;
    border-radius: .4rem;
    transition: background-color $short-transition linear;

    &:focus {
      color: #fff;
      box-shadow: 0 .2em .6em lighten($secondary, 10%);

      &:active {
        box-shadow: none;
        text-shadow: none;
      }
    }

    &.router-link-exact-active, &:hover {
      background-color: darken($secondary, 5%);
      color: #fff;
    }
  }

  .menu-group {
    display: flex;
    backface-visibility: hidden;
    list-style: none;
    text-align: center;
    color: $lighter-grey;
  }

  .menu-sections {
    @include bottom-bar;
    justify-content: space-between;
    color: $light-grey;
    transition: opacity $short-transition ease-in;
    will-change: opacity;
    transition-delay: $scroll-delay;
    visibility: visible;
    opacity: 1;

    li {
      display: inline-flex;

      a {
        width: 100%;
        text-align: center;

        &.router-link-active, &:hover {
          color: lighten($secondary, 10%);
        }

        &:focus:active {
          box-shadow: none;
          text-shadow: none;
        }
      }
    }

    .home-link {
      font-size: 1.7rem;
      padding: 0.35em 0.25em;

      &:focus {
        border-radius: .3em;
        box-shadow: 0 .2em .6em lighten($secondary, 10%);
      }
    }

    .section-link {
      display: inline-block;
      padding: .6em .4em .3em .4em;
      font-family: serif;
      font-size: 1rem;
      border-radius: .5em;
      text-transform: uppercase;
    }

    @media (min-width: 768px) and (min-height: 450px) {
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
      }
    }
  }

  .menu-utils {
    flex-grow: 1;
    height: $bar-height;
    align-items: center;

    @media (min-width: 460px) {
      flex-grow: 0;
      margin-left: auto;
    }
  }

  @media screen and (min-width: 320px) {
    .menu-home-link {
      display: block;
    }
  }

  @media (min-width: 768px) and (min-height: 450px) {
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
