<template>
  <div>
    <ul class="cta-group">
      <li v-if="locale">
        <router-link
          class="section-link secondary-btn"
          :to="{name: 'about'}"
          replace
          v-html="locale.ctas.about"
        />
      </li>

      <li v-if="locale">
        <router-link
          class="section-link primary-btn"
          :to="{name: 'work'}"
          replace
          v-html="locale.ctas.work"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import useI8n from '@/composables/useI8n';

export default {
  name: 'Home',

  setup() {
    const { locale } = useI8n();
    return {
      locale,
    };
  },
};
</script>

<style lang="scss" scoped>
.cta-group {
  position: fixed;
  top: 49%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  min-width: 46.29vh;
  padding: 0 2%;
  font-size: 1rem;
  list-style: none;
  text-align: center;
  backface-visibility: hidden;

  li {
    margin-right: 0;
    flex: 1;

    &:first-child {
      margin-bottom: 1.1em;
    }

    .section-link {
      display: block;
      font-family: inherit;
      font-weight: 400;
      font-size: 1em;
      text-shadow: none;

      &:focus {
        box-shadow: 0 .2em .6em lighten($secondary, 10%);

        &:active {
          box-shadow: none;
        }
      }
    }
  }

  /* Folded portrait */
  @media screen and (max-width: 280px) {
    padding: 0 6%;
  }

  @media (orientation: landscape), (min-width: 768px) {
    flex-direction: row;
    padding: 0;

    li:first-child {
      margin-right: .95em;
    }
  }

  @media (orientation: landscape) {
    left: 0;
    width: 114vh;
    height: auto;
    transform: none;
    padding-left: 7%;

    @media (max-height: 500px) {
      display: none;
    }
  }
}
</style>
