<template>
  <div
    v-if="name"
    class="work-details"
  >
    <h3
      class="title"
      :style="`color: ${primaryColour}`"
      v-html="title"
    />
    <p v-html="description"></p>
    <ul class="screenshots">
      <li v-for="src in screenshots" :key="src">

        <!-- Imgs lazy-loaded at once as quick work-around for obscure 12 Safari bug with flexbox -->
        <lazy-image
          :src="src"
          :isDarkened="false"
          :initVisible="true"
        />
      </li>
    </ul>
    <slot />
  </div>
  <div v-else class="error-details">
    <message-toast
      class="error-message"
      :isAnimated="false"
      :isInfo="true"
      :title="errorMessage"
      :isButtons="false"
    />
    <slot />
  </div>
</template>

<script>
import LazyImage from '@/components/ui/LazyImage.vue';
import MessageToast from '@/components/ui/MessageToast.vue';

export default {
  name: 'WorkDetails',

  components: {
    LazyImage,
    MessageToast,
  },

  props: {
    name: {
      type: String,
      default: '',
    },

    title: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    screenshotsData: {
      type: Object,
      default() {
        return {};
      },
    },

    baseUrl: {
      type: String,
      default: process.env.BASE_URL,
    },

    errorMessage: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      screenshots: [],
    };
  },

  computed: {
    primaryColour() {
      return this.screenshotsData.primary;
    },
  },

  watch: {
    name: {
      /**
       * Determines the extension of the image files based on the screenshot data passed on. The first
       * screenshot is always assumed to be a JPEG. The remainder are all assumed to be of the same type.
       * All images are expected to be located under a folder with the same name as the project they showcase.
       */
      handler() {
        if (this.screenshotsData) {
          const imgNames = [...Array(this.screenshotsData.size).keys()];
          const imgTypes = Array(this.screenshotsData.size).fill(this.screenshotsData.type || 'jpg');
          const imgSrc = `${this.baseUrl}${this.name}/`;

          imgTypes[0] = 'jpg';
          this.screenshots = imgNames.map((imgName, index) => `${imgSrc}${imgName}.${imgTypes[index]}`);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.work-details {
  padding: 1.3rem 1.2rem 0;

  h3 {
    margin-bottom: .7rem;
    font-size: 1.5em;
  }

  p {
    margin-bottom: 1.8rem;
  }

  .screenshots {
    list-style: none;

    li {
      margin-bottom: 2.2rem;
    }

    .lazy-image {
      min-height: calc(47vw - 2rem);

      &:deep(img) {
        width: 100%;
        height: auto;
      }

      &:deep(svg) {
        background-color: $lighter-grey;
      }
    }

    @media (min-width: 1025px) {
      column-count: 2;
      column-fill: balance;

      .lazy-image {
        min-height: 22vw;
      }
    }
  }
}

.error-details {
  padding: 0 1.2em;

  .error-message {
    position: static;
    margin: auto auto 0;
    padding: 0;
    max-width: 24em;
    font-size: 1.1em;
    border: none;
    box-shadow: none;
  }
}
</style>
<style lang="scss">
.work-details, .error-details {
  a {
    color: darken($secondary, 12%) !important;
  }
}
</style>
