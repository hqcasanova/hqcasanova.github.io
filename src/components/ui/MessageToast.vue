<template>
  <transition
    class="message-toast"
    name="slide"
    :css="isAnimated"
  >
    <div
      v-if="!isEmpty"
      ref="target"
      :class="['toast', { 'info': isInfo }]"
       @keydown.esc="onClick"
    >
      <focus-trap
        :active="true"
        :escapeDeactivates="false"
        :initial-focus="() => $refs.okButton"
      >
        <div>
          <div
            class="toast-heading"
            :data-icon="isInfo ? infoIcon : errorIcon"
          >
            <span
              :class="['toast-title', { 'only-heading': !body.length }]"
              v-html="title"
            />
          </div>
          <p v-if="body" class="toast-body">{{ body }}</p>
          <template v-if="isButtons">
            <button
              ref="okButton"
              class="toast-ok secondary-btn"
              @click="onClick"
            >
              {{ okLabel }}
            </button>
            <button
              class="toast-close"
              @click="onClick"
            />
          </template>
        </div>
      </focus-trap>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';
import useClickOutside from '@/composables/useClickOutside';
import { FocusTrap } from 'focus-trap-vue';

export default {
  name: 'MessageToast',

  components: {
    FocusTrap,
  },

  props: {
    isAnimated: {
      type: Boolean,
      default: true,
    },

    isInfo: {
      type: Boolean,
      default: false,
    },

    isButtons: {
      type: Boolean,
      default: true,
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

    closeEventName: {
      type: String,
      default: 'close',
    },
  },

  computed: {
    isEmpty() {
      return (this.body.length === 0) && (this.title.length === 0);
    },
  },

  watch: {
    isEmpty: {
      handler(isClosed) {
        document.body.classList.toggle('toast-shown', !isClosed);
      },
      immediate: true,
    },
  },

  setup(props, context) {
    const target = ref();

    useClickOutside(target, () => {
      context.emit(props.closeEventName);
    });

    return {
      target,
    };
  },

  methods: {
    onClick() {
      this.$emit(this.closeEventName);
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
  border: .3em solid rgba($error, .6);
  border-radius: .6em;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);

  @include modal-colours;

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

    @include char-bubble;

    .toast-title {
      display: block;
      margin-top: .5em;
      font-size: 1.5em;
      text-transform: uppercase;
      color: lighten($dark-grey, 12%);

      &.only-heading {
        font-family: 'Open Sans', sans-serif;
        font-size: 1.25em;
        text-transform: none;
      }

      &:first-letter {
        @include accented-text;
      }
    }

    @media (orientation: landscape) {
      .toast-title {
        display: inline-block;
        margin-left: .3em;
      }
    }
  }

  .toast-body {
    text-align: left;
    margin-top: 1em;
  }

  .toast-ok {
    margin-top: 1.2em;
    color: darken($secondary, 12%);
  }

  .toast-close {
    position: absolute;
    top: 0;
    right: 0;
    @include close-button;
  }

  &.info {
    border-color: rgba($info, .6);

    .toast-heading:before {
      background-color: $info;
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
