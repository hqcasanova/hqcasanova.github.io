<template>
  <div>
    <h2>{{ locale.titles.work }}</h2>
    <ol>
      <li v-for="job in locale.content.work" :key="job.name">
        <figure>
          <img />
          <figcaption>
            <h3 v-html="job.name"></h3>
            <time v-html="job.period"></time>
            <em v-html="job.framework"></em>
          </figcaption>
        </figure>
        <p v-html="job.description"></p>
      </li>
    </ol>
  </div>
</template>

<script>
import useI8n from '@/composables/useI8n';

export default {
  name: 'Work',

  setup() {
    const { locale } = useI8n();
    return {
      locale,
    };
  },
};
</script>

<style lang="scss" scoped>
div {
  margin-top: auto;
}
</style>
