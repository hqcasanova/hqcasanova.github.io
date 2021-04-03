<template>
  <div>
    <h2>{{ locale.titles.about }}</h2>
    <p
      v-for="(paragraph, index) in locale.content.about"
      v-html="paragraph"
      :key="index"
      @click="onClick"
    >
    </p>
  </div>
</template>

<script>
import useI8n from '@/composables/useI8n';

export default {
  name: 'About',

  setup() {
    const { locale } = useI8n();
    return {
      locale,
    };
  },

  methods: {
    onClick(event) {
      const targetEl = event.target;
      const localRoutes = this.locale.routes;
      const routeNames = Object.keys(localRoutes);
      let targetRoute = '';

      if (targetEl.className === 'inline-section-link') {
        targetRoute = routeNames.find((routeName) => localRoutes[routeName] === targetEl.textContent);
        this.$router.replace({ name: targetRoute });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin-top: .65rem;
}

div {
  margin-top: auto;
  background: linear-gradient(0deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 100%);
}
</style>
