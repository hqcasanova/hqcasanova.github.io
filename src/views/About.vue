<template>
  <div class="about-wrapper">
    <h2 v-html="locale.titles.about"></h2>
    <p
      v-for="(paragraph, index) in locale.content.about"
      v-html="paragraph"
      :key="index"
    >
    </p>
    <contact-footer
      :contactUrl="locale.urls.linkedin"
      :copyText="locale.urls.linkedin"
      :actionText="locale.copy.action"
      :successText="locale.copy.success"
    >
      {{ locale.ctas.contact }}
    </contact-footer>
  </div>
</template>

<script>
import ContactFooter from '@/components/layout/ContactFooter.vue';
import useI8n from '@/composables/useI8n';

export default {
  name: 'About',

  components: {
    ContactFooter,
  },

  setup() {
    const { locale } = useI8n();
    return {
      locale,
    };
  },
};
</script>

<style lang="scss" scoped>
.about-wrapper {
  margin-top: auto;
  background: linear-gradient(0deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 100%);

  p {
    margin-top: .65rem;
  }

  .contact-footer {
    display: none;

    @media (min-width: 768px) and (min-height: 450px) {
      display: flex;
    }
  }
}
</style>
