import * as MutationTypes from './mutation-types';

// List of available languages, each expressed as a (code, name) pair eg {'en', 'English'}
const LANGUAGES = JSON.parse(process.env.VUE_APP_LANGUAGES);

export default {
  state: {

    // Object with key-value pairs for each possible text snippet or message
    locale: null,
  },

  getters: {
    language(state) {
      if (state.locale === null) {
        return null;
      }

      return state.locale.language;
    },

    languageName(state) {
      if (!LANGUAGES.length || state.locale === null) {
        return '';
      }

      const currLangItem = LANGUAGES.find((langItem) => langItem.code === state.locale.language);
      return currLangItem.name;
    },

    localisedError: (state) => (errorKey) => {
      if ((state.locale === null) || !('errors' in state.locale) || (errorKey.length === 0)) {
        return '';
      }

      return state.locale.errors[errorKey];
    },
  },

  mutations: {
    [MutationTypes.LOCALE_UPDATE](state, currLocale) {
      state.locale = currLocale;
    },
  },

  actions: {
    initialise(context, currLocale) {
      if (currLocale) {
        context.commit(MutationTypes.LOCALE_UPDATE, currLocale);
      } else {
        context.dispatch('newError', {
          source: 'app',
          type: 'language',
          exception: 'Current locale not provided while initialising store',
        });
      }
    },

    changeLocale(context, language) {
      return window.hqcFetchLocale(language)

        // Success => updates pre-loading markup, saves to localstorage and clears any previous error
        .then((locale) => {
          window.hqcCriticalI8n(locale);
          context.commit(MutationTypes.LOCALE_UPDATE, locale);

          if (window.hqcIsStorage) {
            localStorage.setItem(window.hqcLocaleKey, JSON.stringify(locale));
          }

          if (context.getters.isError('language')) {
            context.dispatch('clearError');
          }

        // Failure => leaves present locale unchanged and signals an error
        }).catch((error) => {
          context.dispatch('newError', {
            source: 'request',
            type: 'language',
            exception: error,
          });
        });
    },
  },
};
