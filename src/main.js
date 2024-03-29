// APP DEPENDENCIES
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 3rd PARTY PLAIN JS
require('intersection-observer');
require('swiped-events');
require('wicg-inert');
const ClipboardJS = require('clipboard');

// INSTANTIATION AND GLOBALS
const app = createApp(App).use(store).use(router);
app.config.globalProperties.$Clipboard = ClipboardJS;

// ERROR HANDLING
app.config.errorHandler = function (error, vm, info) { // eslint-disable-line func-names
  const exception = `${error.toString()}. ${info}`;
  store.dispatch('newError', { source: 'app', exception });
};
window.onerror = function (message) { // eslint-disable-line func-names
  store.dispatch('newError', { source: 'system', exception: message });
};

// START
window.hqcApp = app.mount('#app');

// DEBUG INFO
console.log(
  '%c HQCasanova ',
  `background: ${process.env.VUE_APP_SCSS_BRAND_GREEN}; color: white; font-size: 20px; font-family: serif`,
);
console.log(process.env);
