// TODO: change last paragraph to point to github profile once projects fixed.
<template>
  <div class="work-wrapper" :class="{'show-job': selectedName}">

    <!-- Title -->
    <h2>{{ locale.titles.work }}</h2>

    <!-- All jobs -->
    <ol class="work-list">
      <li
        class="list-item"
        v-for="(job, index) in locale.content.work.list"
        :key="job.name"
        :style="`--primary-colour: ${screenshots[job.name].primary}`"
      >
        <router-link
          class="item-link button"
          :to="{name: 'work', params: {selectedName: job.name}}"
        >
          <figure
            class="item-figure"
            :ref="setFigureRef"
          >
            <lazy-image
              class="item-img"
              :src="`${baseUrl}${job.name}/0.jpg`"
              @ready="onImgReady(index)"
            />
            <figcaption class="item-caption">
              <time class="item-period">{{ shortenPeriod(job.period) }}</time>
              <h3 class="item-name" v-html="job.title"></h3>
            </figcaption>
          </figure>
        </router-link>
      </li>
    </ol>

    <!-- End of list -->
    <p v-html="locale.content.work.links"></p>

    <!-- Job details -->
    <div ref="modal" class="modal">
      <router-link class="close-modal" :to="{name: 'work'}"></router-link>
      <work-details
        v-if="selectedName"
        v-bind="selectedJob"
        :screenshotsData="selectedScreenshots"
        :key="selectedName"
        :errorMessage="locale.errors.projectNotFound"
      />

      <!-- Jobs nav -->
      <div v-if="selectedName" class="modal-nav">
        <router-link
          class="modal-prev"
          :class="{'back-link': !prevJob.name}"
          :to="{name: 'work', params: {selectedName: prevJob.name}}"
          :key="prevJob.name"
          :style="`--primary-colour: ${prevJob.name && screenshots[prevJob.name].primary}`"
          replace
          @mousedown="onModalNav($event, prevJob.name)"
        >
          <svg role="img" aria-label="left-arrow" focusable="false" stroke="currentColor" fill="currentColor" width="512" height="512" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M492 236H68l71-70a20 20 0 10-29-28L6 242c-8 8-8 20 0 28l104 104a20 20 0 0029-28l-71-70h424a20 20 0 100-40z"/>
          </svg>
          <span class="modal-nav-title" v-html="prevJob.title"></span>
          <span v-if="prevJob.name" class="modal-nav-period">
            {{ shortenPeriod(prevJob.period) }}
          </span>
        </router-link>
        <router-link
          class="modal-next"
          :class="{'back-link': !nextJob.name}"
          :to="{name: 'work', params: {selectedName: nextJob.name}}"
          :key="nextJob.name"
          :style="`--primary-colour: ${nextJob.name && screenshots[nextJob.name].primary}`"
          replace
          @mousedown="onModalNav($event, nextJob.name)"
        >
          <span v-if="nextJob.name" class="modal-nav-period">
            {{ shortenPeriod(nextJob.period) }}
          </span>
          <span class="modal-nav-title" v-html="nextJob.title"></span>
          <svg role="img" aria-label="right-arrow" focusable="false" stroke="currentColor" fill="currentColor" width="512" height="512" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M506 242L402 138a20 20 0 00-29 28l71 70H20a20 20 0 100 40h424l-71 70a20 20 0 1029 28l104-104c8-8 8-20 0-28z"/>
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import LazyImage from '@/components/ui/LazyImage.vue';
import WorkDetails from '@/components/layout/WorkDetails.vue';
import useI8n from '@/composables/useI8n';

export default {
  name: 'Work',

  components: {
    LazyImage,
    WorkDetails,
  },

  props: {
    selectedName: {
      type: String,
      default: '',
    },

    screenshots: {
      type: Object,
      default() {
        return JSON.parse(process.env.VUE_APP_SCREENSHOTS);
      },
    },

    baseUrl: {
      type: String,
      default: process.env.BASE_URL,
    },

    periodSeparator: {
      type: String,
      default: ' ~ ',
    },
  },

  data() {
    return {
      figureEls: [],
      jobSelectedIdx: -1,
      swipeLeftHandler: null,
      swipeRightHandler: null,
    };
  },

  computed: {
    selectedColour() {
      const jobName = this.selectedName;
      return jobName && this.screenshots[jobName].primary;
    },

    selectedJob() {
      return this.locale.content.work.list.find((job, index) => {
        const isSelected = job.name === this.selectedName;

        if (isSelected) {
          this.jobSelectedIdx = index;
        }
        return isSelected;
      });
    },

    selectedScreenshots() {
      return this.screenshots[this.selectedName];
    },

    prevJob() {
      let job;

      if (this.selectedName && this.jobSelectedIdx > 0) {
        job = this.locale.content.work.list[this.jobSelectedIdx - 1];
      } else if (!this.selectedName) {
        job = this.locale.content.work.list[this.locale.content.work.list.length - 1];
      } else {
        job = { name: '', title: this.locale.content.work.back };
      }

      return job;
    },

    nextJob() {
      let job;

      if (this.selectedName && (this.jobSelectedIdx < this.locale.content.work.list.length - 1)) {
        job = this.locale.content.work.list[this.jobSelectedIdx + 1];
      } else if (!this.selectedName) {
        job = this.locale.content.work.list[0];  // eslint-disable-line
      } else {
        job = { name: '', title: this.locale.content.work.back };
      }

      return job;
    },
  },

  watch: {

    /**
     * Makes all images above the fold and their captions show or hide whenever a work item is clicked.
     * Also resets scrolling in case the user is going back and forth within the job details modal.
     * @param {String} name - Name of the selected work item.
     */
    selectedName(name) {
      this.figureEls.forEach((el) => {
        if (el.classList.contains('visible')) {
          el.classList.toggle('caption-in', !name.length);
          el.classList.toggle('dilute-img', name.length);
        }
      });

      this.$refs.modal.scrollTop = 0;
    },
  },

  setup() {
    const { locale } = useI8n();
    return {
      locale,
    };
  },

  mounted() {
    this.swipeLeftHandler = this.onSwipe.bind(this, 'nextJob');
    document.addEventListener('swiped-left', this.swipeLeftHandler);

    this.swipeRightHandler = this.onSwipe.bind(this, 'prevJob');
    document.addEventListener('swiped-right', this.swipeRightHandler);
  },

  unmounted() {
    LazyImage.methods.cleanup();
    document.removeEventListener('swiped-left', this.swipeLeftHandler);
    document.removeEventListener('swiped-right', this.swipeRightHandler);
  },

  methods: {
    shortenPeriod(period) {
      return period.match(/(\d+)/g).join(this.periodSeparator);
    },

    setFigureRef(el) {
      if (el) {
        this.figureEls.push(el);
      }
    },

    onSwipe(jobPropName) {
      let routerAction;

      if (this[jobPropName].name) {
        routerAction = this.selectedName ? 'replace' : 'push';
        this.$router[routerAction]({ name: 'work', params: { selectedName: this[jobPropName].name } });
      } else {
        this.$router.go(-1);
      }
    },

    onImgReady(figureIdx) {
      const figureEl = this.figureEls[figureIdx];
      figureEl.classList.add('caption-in', 'visible');
    },

    onModalNav(event, jobName) {
      if (this.selectedJob && !jobName) {
        event.preventDefault();
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.work-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;

  .work-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin-bottom: 2.5rem;

    .list-item {
      display: block;
      overflow: hidden;
      margin-top: 2.5rem;

      .item-link {
        display: block;
        position: relative;
        color: $white;
        text-decoration: none;

        &:before {
          content: '';
          display: block;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: var(--primary-colour);
          transition: opacity $short-transition ease-in;
        }

        &:hover, &:focus, &.router-link-exact-active {
          &:before {
            opacity: .5;
          }
        }
      }

      .item-figure {
        position: relative;
      }

      .item-img {
        width: 100%;
        height: 40vh;
        transition: all $medium-transition linear;
      }

      .dilute-img .item-img {
        opacity: 0;
        transform: scale(0.9);
      }

      .item-caption {
        opacity: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .25);
        transform: scale(0.8);
        transition: all $medium-transition linear;

        &:hover, &:focus {
          background: rgba(0, 0, 0, .25);
        }

        .item-period {
          font-size: 1.2rem;
        }

        .item-name {
          @include primary-button;
          min-width: 8rem;
          padding-top: .48em;
          padding-bottom: .1em;
          border-radius: .5em;
        }
      }

      .caption-in .item-caption {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  @media (min-width: 768px), (orientation: landscape) {
    .work-list {
      flex: 1;
      display: flex;
      flex-direction: column;

      .list-item {
        flex: 1;
      }

      .item-figure {
        display: flex;
        align-items: center;

        &:before {
          content: '';
          opacity: 0;
          z-index: 1;
          display: block;
          position: absolute;
          top: calc(50% + .8em);
          right: calc(25% + .2em);
          width: 20%;
          height: .1em;
          background: linear-gradient(
            -90deg,
            $white 0%,
            $white 50%,
            var(--primary-colour) 80%
          );
          transition: all ($long-transition + $medium-transition) linear;
        }

        &:after {
          content: '';
          opacity: 0;
          display: block;
          position: absolute;
          top: calc(50% + .56em);
          right: 50%;
          width: .6em;
          height: .6em;
          background: var(--primary-colour);
          border-radius: 50%;
          transform: translateX(5vw);
          transition: all ($long-transition + $medium-transition) linear;
        }

        &.caption-in {
          &:before {
            opacity: 1;
            width: 25%;
          }
          &:after {
            opacity: 1;
            transform: translateX(0) !important;
          }
        }

        .item-img {
          flex: 0 0 58%;
          height: 25.9vw;
        }

        .item-caption {
          z-index: 1;
          position: static;
          background: none !important;
        }
      }

      .list-item:nth-child(odd) .item-figure {
        flex-direction: row-reverse;

        &:before {
          left: calc(25% - .4em);
          right: auto;
          background: linear-gradient(
            90deg,
            $white 0%,
            $white 50%,
            var(--primary-colour) 80%
          );
        }
        &:after {
          transform: translateX(-5vw);
        }
      }
    }
  }
}

.modal {
  z-index: -1;
  opacity: 0;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  bottom: $bar-height;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  transition: opacity $long-transition linear;

  @include modal-colours;

  .close-modal {
    position: absolute;
    top: 0;
    right: 0;
    text-decoration: none;
    @include close-button;
  }

  .modal-nav {
    margin: auto .5rem .5rem;

    a {
      display: inline-block;
      padding: 0 .5rem;
      line-height: 3rem;
      text-decoration: none;
      color: $primary;

      &.modal-next {
        float: right;
      }

      .modal-nav-title {
        margin: 0 .4rem;
      }

      svg {
        opacity: .7;
        height: 1.5rem;
        width: auto;
        stroke-width: .3rem;
        margin-bottom: -.16rem
      }

      &:not(.back-link) svg {
        padding: .2rem;
        stroke: $white;
        fill: $white;
        background-color: var(--primary-colour);
        border-radius: 50%;
      }

      &.back-link svg {
        margin-bottom: 0;
        vertical-align: text-bottom;
      }

      &:focus, &:hover, &.router-link-exact-active {
        svg {
          opacity: 1;
        }
      }
    }
  }

  .show-job & {
    z-index: 1;
    opacity: 1;
  }
}
</style>
