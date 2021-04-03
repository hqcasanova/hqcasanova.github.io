<template>
  <a class="contact-link" target="_blank" rel="noopener noreferrer" :href="`mailto:${address}?subject=${subject}`">
    <svg aria-hidden="true" focusable="false" role="img" fill="currentColor" width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M467 61H45C20 61 0 81 0 106v300c0 25 20 45 45 45h422c25 0 45-20 45-45V106c0-25-20-45-45-45zm-6 30L257 295 51 91h410zM30 400V112l144 143L30 400zm21 21l145-145 50 51c6 5 16 5 22 0l49-50 144 144H51zm431-21L338 256l144-144v288z"/>
    </svg>
    <span class="contact-address">
      {{ address }}
    </span>
  </a>
</template>

<script>
export default {
  name: 'ContactLink',

  props: {
    subject: {
      type: String,
      default: '',
    },
  },

  computed: {
    address() {
      return `${this.a}@${this.b}.${this.c}`;
    },
  },

  created() {
    this.a = 'hqcasanova';
    this.b = 'outlook';
    this.c = 'com';
  },

  mounted() {
    this.$emit('mounted', this.address);
  },
};
</script>

<style lang="scss" scoped>
.contact-link {
  display: inline-block;

  svg {
    display: inherit;
    height: 1em;
    width: auto;
    vertical-align: middle;
  }

  .contact-address {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 1px;
  }
}
</style>
