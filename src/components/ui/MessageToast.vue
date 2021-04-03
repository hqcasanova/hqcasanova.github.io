<template>
  <transition class="message-toast" name="slide">
    <div
      v-if="!isEmpty"
      class="toast"
      :class="{'info': isInfo}"
    >
      <div
        class="toast-heading"
        :data-icon="isInfo ? infoIcon : errorIcon"
      >
        <span
          class="toast-title"
          :class="{'only-heading': !body.length}"
        >
          {{title}}
        </span>
        <button class="toast-close" @click="onClick">&times;</button>
      </div>
      <p v-if="body" class="toast-body">{{body}}</p>
      <button class="toast-ok" @click="onClick">{{ okLabel }}</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MessageToast',

  props: {
    isInfo: {
      type: Boolean,
      default: false,
    },

    infoIcon: {
      type: String,
      default: 'i',
    },

    errorIcon: {
      type: String,
      default: '!',
    },

    title: {
      type: String,
      default: '',
    },

    body: {
      type: String,
      default: '',
    },

    okLabel: {
      type: String,
      default: 'OK',
    },
  },

  computed: {
    isEmpty() {
      return (this.body.length === 0) && (this.title.length === 0);
    },
  },

  methods: {
    onClick() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.toast {
  z-index: 4;
  position: fixed;
  top: 1rem;
  left: 0;
  right: 0;
  margin: 0 1rem;
  padding: 1.3em 1em;
  text-align: center;
  background: $white;
  color: lighten($dark-grey, 20%);
  border: .3em solid rgba($error, .6);
  border-radius: .6em;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);

  &.slide-enter-from, &.slide-leave-to {
    transform: translateY(calc(-100% - 1rem));
    opacity: 0;
  }

  &.slide-enter-active {
    transition: all $medium-transition ease-in;
  }

  &.slide-leave-active {
    transition: all $medium-transition ease-out;
  }

  .toast-heading {
    font-family: serif;
    font-size: .9em;

    &:before {
      content: attr(data-icon);
      display: inline-block;
      line-height: 1.5em;
      width: 1.5em;
      margin-right: .35em;
      font-size: 2.5em;
      font-weight: 700;
      border-radius: 50%;
      background-color: $error;
      color: $white;
    }

    .toast-title {
      display: block;
      margin-top: .5em;
      font-size: 1.5em;
      text-transform: uppercase;
      color: lighten($dark-grey, 12%);

      &.only-heading {
        font-family: sans-serif;
        font-size: 1.35em;
        text-transform: none;
      }

      @include accented-first-letter;
    }

    .toast-close {
      position: absolute;
      top: 0;
      right: 0;
      padding: .1em .5em;
      font-size: 1.75em;
      color: $light-grey;
      transition: color $short-transition linear;

      &:focus, &:hover {
        color: $dark-grey;
      }
    }

    @media (orientation: landscape) {
      .toast-title {
        display: inline-block;
      }
    }
  }

  .toast-body {
    text-align: left;
    margin-top: 1em;
  }

  .toast-ok {
    margin-top: 1.2em;
    padding: 0.8em 2em;
    font-size: .9em;
    text-transform: uppercase;
    border-radius: 20%/50%;
    border: .2em solid $primary;
    color: $primary;
    transition: all $short-transition linear;

    &:focus, &:hover {
      background-color: $primary;
      color: $white;
    }
  }

  &.info {
    border-color: rgba($info, .6);

    .toast-heading:before {
      background-color: $info;
    }

    .toast-ok {
      border-color: $info;
      color: $info;

      &:focus, &:hover {
        background-color: $info;
        color: $white;
      }
    }
  }

  @media (min-width: 500px) {
    width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-height: 450px) {
    margin-top: $bar-height;

    @media (orientation: landscape) {
      margin-right: 1rem;
      left: auto;
    }
  }
}
</style>
