<template>
  <div :class="['work-wrapper', { 'modal-shown': isShowModal }]">
    <h2 v-html="locale.titles.work" class="heading"></h2>

    <ol class="work-list">
      <li
        class="list-item"
        v-for="(job, index) in locale.content.work.list"
        v-once
        :key="job.name"
        :style="`--primary-colour: ${screenshots[job.name].primary}`"
      >
        <router-link
          tabindex="-1"
          class="item-link button"
          :to="{name: 'work', params: {selectedName: job.name}}"
          @focus="$event.currentTarget.querySelector('button').focus()"
        >
          <work-figure
            :class="{ 'router-link-exact-active': selectedName === job.name }"
            :isShow="isSplitModal || !isShowModal"
            :isReverse="index % 2 == 0"
            :isResponsive="!isSplitModal || !isShowModal"
            :isPreloadImg="index < 2"
            v-bind="job"
          />
        </router-link>
      </li>
    </ol>

    <p v-html="locale.content.work.links"></p>

    <teleport :to="modalTarget">
      <work-modal
        v-if="isShowModal"
        :isFocusTrap="!isSplitModal"
        :returnFocusEls="itemLinkEls"
        :jobList="locale.content.work.list"
        :currIndex="jobSelectedIdx"
        :currScreenshotData="screenshots[selectedName]"
        :backLabel="locale.content.work.back"
        :notFoundError="locale.errors.projectNotFound"
        @click="localisedClickHandler"
      />
    </teleport>

    <contact-footer
      :contactUrl="locale.urls.linkedin"
      :copyText="locale.urls.linkedin"
      :actionText="locale.copy.action"
      :successText="locale.copy.success"
    >
      {{ locale.ctas.contact }}
    </contact-footer>
  </div>
</template>

<script>
import WorkFigure from '@/views/Work/WorkFigure.vue';
import WorkModal from '@/views/Work/WorkModal.vue';
import ContactFooter from '@/components/layout/ContactFooter.vue';
import useI8n from '@/composables/useI8n';
import useResize from '@/composables/useResize';

export default {
  name: 'Work',

  components: {
    WorkFigure,
    WorkModal,
    ContactFooter,
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

    modalTarget: {
      type: [String, Object],
      required: true,
    },

    modalSplitWidth: {
      type: Number,
      default: 99999999,
    },

    localisedClickHandler: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      jobSelectedIdx: -1,
      itemLinkEls: [],
    };
  },

  computed: {
    isShowModal() {
      return this.selectedName.length > 0;
    },

    isSplitModal() {
      return this.width >= this.modalSplitWidth;
    },
  },

  watch: {
    selectedName: {
      handler() {
        const workList = this.locale.content.work.list;
        this.jobSelectedIdx = workList.findIndex((job) => job.name === this.selectedName);
      },
      immediate: true,
    },
  },

  setup() {
    const { locale } = useI8n();
    const { width } = useResize();
    return {
      locale,
      width,
    };
  },

  mounted() {
    this.itemLinkEls = Array.from(this.$el.querySelectorAll('.item-link'));
  },
};
</script>

<style lang="scss" scoped>
.work-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;

  .heading {
    position: absolute;
    opacity: 0;
  }

  .work-list {
    list-style: none;
    margin-bottom: 2rem;

    .list-item {
      display: block;
      overflow: hidden;

      &:not(:first-child) {
        margin-top: 2.5rem;
      }

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

        &:hover, &:focus-within, &.router-link-exact-active {
          &:before {
            opacity: .5;
          }
        }
      }
    }
  }

  .contact-footer {
    z-index: auto;
    display: none;

    @media (min-width: 768px) and (min-height: 450px) {
      display: flex;
    }
  }

  .modal-shown {
    @media (min-width: 1024px) and (orientation: landscape) {
    }
  }
}
</style>
