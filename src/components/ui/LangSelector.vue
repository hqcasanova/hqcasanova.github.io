<template>
  <select
    :class="['lang-selector', {'pulse': isPulse}]"
    :value="selected"
    :disabled="isPulse"
  >
    <option
      v-for="language in languages"
      :key="language.code"
      :value="language.code"
      :lang="language.code"
      v-text="language.name"
    />
  </select>
</template>

<script>
export default {
  name: 'LangSelector',
  props: {
    languages: {
      type: Array,
      default() {
        return JSON.parse(process.env.VUE_APP_LANGUAGES);
      },
    },

    selected: {
      type: String,
      default: 'en',
    },

    isPulse: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.lang-selector {
  display: block;
  padding: 0.55em 1.4em 0.5em 0.5em;
  width: 100%;
  max-width: 100%;
  margin: 0;
  line-height: 1.3em;
  color: currentColor;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url(caret-svg());
  background-repeat: no-repeat, repeat;
  background-position: right 0.5em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
  background-color: transparent;
  border: .16em solid currentColor;
  border-radius: 0.5em;
  cursor: pointer;

  &::-ms-expand {
    display: none;
  }

  &:hover, &:focus {
    color: $darker-grey;
    background-image: url(caret-svg($darker-grey));
    background-color: $white;
    border-color: $white;
    outline: none;
  }

  &.pulse {
    animation: pulse 2s infinite;
    animation-delay: $feedback-delay;
    cursor: wait;
  }

  option {
    font-weight: normal;
  }

  @keyframes pulse {
    0% {
      background-color: $white;
      color: $darker-grey;
    }

    50% {
      background-color: rgba($white, .5);
      color: $white;
    }

    100% {
      background-color: $white;
      color: $darker-grey;
    }
  }
}
</style>
