import { computed } from 'vue';
import { useStore } from 'vuex';

export default function () {
  const store = useStore();
  const errIsInfo = computed(() => store.state.error.source.indexOf('NotFound') >= 0);
  const errTitle = computed(() => store.state.i8n.locale.errors[store.state.error.source]);
  const errMessage = computed({
    get() {
      const { type } = store.state.error;
      if (type.length) {
        return store.state.i8n.locale.errors[type];
      }

      return store.state.error.exception;
    },

    set(value) {
      if (value.trim().length === 0) {
        store.dispatch('clearError');
      }
    },
  });

  return {
    errIsInfo,
    errTitle,
    errMessage,
  };
}
