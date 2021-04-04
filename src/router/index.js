import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Work from '../views/Work.vue';

const routes = [
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    props: (route) => ({ is404: route.params.is404 === 'true' }),
  },
  {
    path: '/work',
    name: 'work',
    component: Work,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'home',
      params: { is404: true },
    },
  },
];

const routeNames = routes.map((route) => route.name).filter(Boolean);
const stageEls = document.querySelectorAll('.stage');
const router = createRouter({
  history: process.env.VUE_APP_IS_HASH === 'true' ? createWebHashHistory() : createWebHistory(),
  routes,
});

// Index for the stage element being shown initially.
let initStageIdx = -1;

// Global tracking of routes
router.historyTrace = [];

/**
 * Changes the value of a given CSS style property for all stage elements.
 * @param {String} propName Name of the CSS property.
 * @param {String} propValue New value for the property.
 */
const stageUpdate = (propName, propValue) => {
  stageEls.forEach((stageEl) => {
    const stageStyle = stageEl.style;
    stageStyle[propName] = propValue;
  });
};

/**
 * Programmatically scrolls to the content except during app initialisation.
 * Additionally, it changes styles for scroll-like CSS transition.
 * NOTE: Safari doesn't support scrollIntoView's "smooth" option.
 * @param {Object} to Data for the next route to navigate to.
 * @param {Object} from Data for the previous route navigating from.
 */
router.beforeEach((to, from) => {
  let steps = 0;
  let stageIdx = 0;

  // On user-triggered route change only => pure CSS scroll.
  if (from.name && stageEls.length) {
    stageIdx = routeNames.indexOf(to.name);
    steps = initStageIdx - stageIdx;
    stageUpdate('transform', `translateY(${steps * 100}%)`);

  // On app init => sets up the CSS transition and sets the origin point.
  } else {
    initStageIdx = routeNames.indexOf(to.name);
    stageUpdate('transition', 'transform 2s ease-in-out');
  }

  router.historyTrace.push(to.fullPath);
});

export default router;
