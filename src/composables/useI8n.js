import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default function () {
  const store = useStore();
  const isLoadingLang = ref(false);
  const locale = computed(() => store.state.i8n.locale);
  const language = computed({
    get() {
      return store.getters.language;
    },

    set(value) {
      isLoadingLang.value = true;
      store.dispatch('changeLocale', value).finally(() => {
        isLoadingLang.value = false;
      });
    },
  });

  return {
    isLoadingLang,
    locale,
    language,
  };
}
