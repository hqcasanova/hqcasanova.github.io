<template>
  <focus-trap :active="isFocusTrap" :returnFocusOnDeactivate="false">
    <div
      class="modal"
      tabindex="-1"
      @keydown.esc="$router.push({ name: routeName })"
      @keydown.left="onSwipeArrow('prevJob')"
      @keydown.right="onSwipeArrow('nextJob')"
    >
      <work-details
        class="modal-content"
        tabindex="0"
        ref="modalContent"
        v-bind="currJob"
        :screenshotsData="currScreenshotData"
        :errorMessage="notFoundError"
      >
        <work-nav
          class="modal-bottom"
          :prevJob="prevJob"
          :nextJob="nextJob"
          :routeName="routeName"
        />
      </work-details>

      <div
        class="modal-bar"
        :style="`border-color: ${primaryColour}`"
      >
        <work-nav
          :prevJob="prevJob"
          :nextJob="nextJob"
          :routeName="routeName"
          :isIconsOnly="true"
        >
          {{ currJob.period }}
        </work-nav>
        <menu-utils :isLightMode="true" />
        <router-link
          class="modal-close"
          :to="{name: routeName}"
        />
      </div>
    </div>
  </focus-trap>
</template>

<script>
import WorkDetails from '@/views/Work/WorkDetails.vue';
import WorkNav from '@/views/Work/WorkNav.vue';
import MenuUtils from '@/components/layout/MenuUtils.vue';
import { FocusTrap } from 'focus-trap-vue';

export default {
  name: 'WorkModal',

  components: {
    WorkDetails,
    WorkNav,
    MenuUtils,
    FocusTrap,
  },

  props: {
    isFocusTrap: {
      type: Boolean,
      default: true,
    },

    jobList: {
      type: Array,
      default() {
        return [];
      },
    },

    returnFocusEls: {
      type: Array,
      required: true,
    },

    currIndex: {
      type: Number,
      default: 0,
    },

    currScreenshotData: {
      type: Object,
      default() {
        return {};
      },
    },

    backLabel: {
      type: String,
      default: 'Back',
    },

    notFoundError: {
      type: String,
      default: 'Not found',
    },

    routeName: {
      type: String,
      default: 'work',
    },
  },

  data() {
    return {
      swipeLeftHandler: null,
      swipeRightHandler: null,
      returnFocusEl: null,
    };
  },

  computed: {
    primaryColour() {
      if (this.currScreenshotData) {
        return this.currScreenshotData.primary;
      }

      return '';
    },

    currJob() {
      return this.currIndex >= 0 && this.jobList[this.currIndex];
    },

    prevJob() {
      let job;

      if (this.currJob.name && this.currIndex > 0) {
        job = this.jobList[this.currIndex - 1];
      } else if (!this.currJob.name) {
        job = this.jobList[this.jobList.length - 1];
      } else {
        job = { name: '', title: this.backLabel };
      }

      return job;
    },

    nextJob() {
      let job;

      if (this.currJob.name && (this.currIndex < this.jobList.length - 1)) {
        job = this.jobList[this.currIndex + 1];
      } else if (!this.currJob.name) {
        job = this.jobList[0];  // eslint-disable-line
      } else {
        job = { name: '', title: this.backLabel };
      }

      return job;
    },
  },

  mounted() {
    this.swipeLeftHandler = this.onSwipeArrow.bind(this, 'nextJob');
    document.addEventListener('swiped-left', this.swipeLeftHandler);
    this.swipeRightHandler = this.onSwipeArrow.bind(this, 'prevJob');
    document.addEventListener('swiped-right', this.swipeRightHandler);

    document.body.classList.add('modal-shown');

    this.$refs.modalContent.$el.focus();
    this.returnFocusEl = this.returnFocusEls[this.currIndex];
  },

  updated() {
    this.$refs.modalContent.$el.focus();
    this.$refs.modalContent.$el.scrollTop = 0;
    this.returnFocusEl = this.returnFocusEls[this.currIndex];
  },

  unmounted() {
    document.removeEventListener('swiped-left', this.swipeLeftHandler);
    document.removeEventListener('swiped-right', this.swipeRightHandler);

    document.body.classList.remove('modal-shown');

    if (this.returnFocusEl) {
      this.returnFocusEl.focus();
    }
  },

  methods: {
    /**
     * Navigates to the correct route depending on the swipe/arrow direction. It also determines the
     * type of navigation so that visits to one or multiple jobs are treated as a single
     * routing event separate from the rest of the app. That way, the browser's back button acts as
     * a modal close when pressed while the modal is open.
     * @param {string} jobObjAction - Name of computed property yielding the data object for the
     * previous or next job.
     */
    onSwipeArrow(jobObjAction) {
      let routerAction;

      if (this[jobObjAction].name) {
        routerAction = this.currJob.name ? 'replace' : 'push';
        this.$router[routerAction]({ name: this.routeName, params: { selectedName: this[jobObjAction].name } });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  z-index: 1;
  opacity: 0;
  position: fixed;
  overflow: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column-reverse;
  animation: fadein $long-transition linear forwards;

  @include modal-colours;

  .modal-content {
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    &:focus {
      outline: none;
    }
  }

  .modal-bar {
    width: 100%;
    height: $bar-height;
    padding: 0 .5em;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    background-color: $white;
    border-bottom: .15em solid currentColor;

    .work-nav {
      font-size: 1.1em;
    }

    .menu-utils {
      margin-left: auto;
      display: flex;
      font-size: .8em;

      /* Folded portrait */
      @media screen and (max-width: 280px) {
        display: none;
      }

      @media screen and (min-width: 540px) {
        position: absolute;
        right: 5em;
      }
    }

    .modal-close {
      @include close-button;
      margin-top: -0.1em;
      margin-left: auto;
    }
  }

  .modal-bottom {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: auto;
  }
}
</style>
