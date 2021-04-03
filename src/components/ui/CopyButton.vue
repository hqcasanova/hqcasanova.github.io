<template>
  <button class="copy-button"
    v-show="isSupported"
    :aria-label="tooltipText"
    :data-cooltipz-dir="tooltipDirection"
    @mouseleave="tooltipText = actionText"
  >
    <svg role="img" focusable="false" fill="currentColor" width="469.3" height="469.3" viewBox="0 0 469.3 469.3" xmlns="http://www.w3.org/2000/svg">
      <path d="M331 0H75C51 0 32 19 32 43v298h43V43h256V0z"/>
      <path d="M395 85H160c-24 0-43 19-43 43v299c0 23 19 42 43 42h235c23 0 42-19 42-42V128c0-24-19-43-42-43zm0 342H160V128h235v299z"/>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'CopyButton',
  props: {
    actionText: {
      type: String,
      required: true,
    },

    successText: {
      type: String,
      required: true,
    },

    copyText: {
      type: String,
      required: true,
    },

    tooltipDirection: {
      type: String,
      default: 'bottom',
    },
  },

  computed: {
    isSupported() {
      return this.$Clipboard.isSupported();
    },
  },

  data() {
    return {
      clipboard: null,
      tooltipText: this.actionText,
    };
  },

  watch: {
    actionText(newText) {
      this.tooltipText = newText;
    },
  },

  mounted() {
    const textFn = () => this.copyText;

    this.clipboard = new this.$Clipboard('.copy-button', {
      text: textFn,
    });
    this.clipboard.on('success', this.onSuccess.bind(this));
    this.clipboard.on('error', this.onFail.bind(this));
  },

  unmounted() {
    this.clipboard.destroy();
    this.clipboard = null;
  },

  methods: {
    onSuccess() {
      this.tooltipText = this.successText;
      this.$emit('copy-success');
    },

    onFail() {
      this.$emit('copy-fail');
    },
  },
};
</script>

<style scoped lang="scss">
.copy-button {
  display: inherit;
  padding: .45em;

  svg {
    display: block;
    height: 1.2em;
    width: auto;
  }
}
</style>
