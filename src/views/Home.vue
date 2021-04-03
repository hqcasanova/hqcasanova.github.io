<template>
  <div>
    <message-toast
      v-show="is404"
      :isInfo="true"
      :title="message404"
      :okLabel="locale.errors.ok"
      @close="message404 = ''"
    />
  </div>
</template>
<script>
import MessageToast from '@/components/ui/MessageToast.vue';
import useI8n from '@/composables/useI8n';

export default {
  name: 'Home',

  components: {
    MessageToast,
  },

  props: {
    is404: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const { locale } = useI8n();
    return {
      locale,
    };
  },

  data() {
    return {
      message404: this.locale.errors.pageNotFound,
    };
  },

  watch: {
    locale(newLocale) {
      this.message404 = newLocale.errors.pageNotFound;
    },
  },
};
</script>
