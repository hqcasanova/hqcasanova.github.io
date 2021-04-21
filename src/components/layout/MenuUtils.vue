<template>
  <ul class="menu-utils">
    <li class="util-language">
      <lang-selector ref="langSel"
        :selected="language"
        :isPulse="isLoadingLang"
        @change="onLangSelection"
      />
    </li>
    <li class="util-social">
      <a href="https://github.com/hqcasanova">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="1 1 13 13">
          <path fill="currentColor" d="M7.5 1a6.5 6.5 0 00-2 12.6c.3.1.5-.2.5-.5v-.8c-1.8.3-2.4-1-2.4-1-.3-.7-.6-.9-.6-.9-.6-.4 0-.4 0-.4.7 0 1 .6 1 .6.5.9 1.6.8 2 .7 0-.4 0-.7.2-1-2-.3-3.2-1.5-3.2-3 0-1 .3-1.8.9-2.4-.3-.3-.4-1.3 0-1.9 1.3 0 2 .9 2 .9s.6-.3 1.6-.3 1.6.3 1.6.3.7-.9 2-.9c.4.6.3 1.6 0 2 .6.5.9 1.2.9 2.2 0 1.6-1.1 2.8-3.1 3.2l.1.8v2c0 .2.2.5.6.4A6.5 6.5 0 007.5 1z"/>
        </svg>
      </a>
    </li>
    <li class="util-social">
      <a :href="locale.urls.linkedin">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
import LangSelector from '@/components/ui/LangSelector.vue';
import useI8n from '@/composables/useI8n';

export default {
  name: 'MenuUtils',
  components: {
    LangSelector,
  },

  setup() {
    const { isLoadingLang, language, locale } = useI8n();
    return {
      isLoadingLang,
      language,
      locale,
    };
  },

  methods: {
    onLangSelection(event) {
      this.language = event.target.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-utils {
  a, li {
    display: inline-flex;
  }

  li {
    margin-left: auto;

    @media (min-width: 460px) {
      margin-left: 2.4em;
    }
  }

  .util-social a {
    color: $lighter-grey;

    &:hover, &:focus {
      color: $white;
    }

    svg {
      display: block;
      height: 2.65em;
      padding: .3em;
      width: auto;
    }
  }
}
</style>
