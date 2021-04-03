import { createStore } from 'vuex';
import i8n from './i8n';
import error from './error';

const store = createStore({
  modules: {
    i8n,
    error,
  },
});

export default store;
