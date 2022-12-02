<template>
  <div class="work-nav" :class="{'icons-only': isIconsOnly}">
    <router-link
      :class="['work-prev work-link', { 'back-link': !prevJob.name }]"
      :to="{name: routeName, params: prevJob.name ? {selectedName: prevJob.name} : {}}"
      :key="prevJob.name"
      :replace="prevJob.name ? true : false"
    >
      <span class="chevron left"></span>
      <span class="work-nav-title" v-html="prevJob.title"></span>
      <span v-if="prevJob.name" class="work-nav-period">
        {{ prevJob.period }}
      </span>
    </router-link>

    <slot />

    <router-link
      :class="['work-next work-link', { 'back-link': !nextJob.name }]"
      :to="{name: routeName, params: nextJob.name ? {selectedName: nextJob.name} : {}}"
      :key="nextJob.name"
      :replace="nextJob.name ? true : false"
    >
      <span v-if="nextJob.name" class="work-nav-period">
        {{ nextJob.period }}
      </span>
      <span class="work-nav-title" v-html="nextJob.title"></span>
      <span class="chevron right"></span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'WorkNav',

  props: {
    prevJob: {
      type: Object,
      required: true,
    },

    nextJob: {
      type: Object,
      required: true,
    },

    isIconsOnly: {
      type: Boolean,
      default: false,
    },

    routeName: {
      type: String,
      default: 'work',
    },
  },
};
</script>

<style lang="scss" scoped>
.work-nav {
  .work-link {
    display: inline-block;
    padding: .6em 0;
    text-decoration: none;
    color: $secondary;

    &.work-next *:not(:first-child) {
      margin-left: .5rem;
    }
    &.work-prev *:not(:last-child) {
      margin-right: .5rem;
    }

    &:focus:active {
      box-shadow: none;
    }

    .chevron {
      &:before {
        content: '';
        display: inline-block;
        height: 0.7em;
        left: 0.15em;
        position: relative;
        bottom: 0.05em;
        transform: rotate(-45deg);
        width: 0.7em;
        border-color: currentColor;
        border-style: solid;
        border-width: 0.17em 0.17em 0 0;
      }

      &.left:before {
        left: 0.25em;
        transform: rotate(-135deg);
      }

      &.right:before {
        left: 0;
        transform: translateX(-0.2em) rotate(45deg);
      }
    }

    .work-nav-title {
      letter-spacing: -.05em;

      @media (min-width: 300px) {
        letter-spacing: normal;
      }
    }

    &:focus, &:hover {
      .chevron:before {
        color: lighten($secondary, 10%);
      }
    }

    &:not(.back-link) {
      .work-nav-title {
        display: none;
        font-family: serif;
        text-transform: uppercase;

        @media (min-width: 768px) {
          display: inline;
        }
      }
    }
  }

  &.icons-only {
    .work-link {
      padding: .5em .8em;
      border-radius: .5em;

      &:focus {
        box-shadow: 0 .2em .6em lighten($secondary, 10%);
      }

      .chevron {
        margin: 0;
      }
    }

    .work-nav-period, .work-nav-title {
      display: none !important;
    }
  }
}
</style>
