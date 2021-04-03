import * as MutationTypes from './mutation-types';

export default {
  state: {

    // Where does the exception come from (eg: failed request or app error).
    source: '',

    // Effectively, a key pointing to the corresponding localised error message.
    type: '',

    // Error itself.
    exception: '',
  },

  getters: {
    isError: (state) => (type) => state.type === type,
  },

  mutations: {
    [MutationTypes.ERROR_UPDATE](state, { source, exception, type = '' }) {
      state.source = source;
      state.type = type;
      state.exception = exception;
    },

    [MutationTypes.ERROR_CLEAR](state) {
      state.source = '';
      state.type = '';
      state.exception = '';
    },
  },

  actions: {
    newError(context, { source, exception, type = '' }) {
      context.commit(MutationTypes.ERROR_UPDATE, { source, type, exception });
      console.error(`${source} -`, exception);
    },

    clearError(context) {
      context.commit(MutationTypes.ERROR_CLEAR);
    },
  },
};
