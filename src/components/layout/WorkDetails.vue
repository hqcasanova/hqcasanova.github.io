<template>
  <div
    v-if="name"
    class="work-details"
    :style="`border-color: ${primaryColour}; border-image: linear-gradient(180deg, ${primaryColour}, rgba(255,255,255,0)) 1 100%;`"
  >
    <h3>
      <span class="title" v-html="title"></span>
      <span class="period">{{ period }}</span>
    </h3>
    <p v-html="description"></p>
    <ul class="screenshots">
      <li v-for="src in screenshots" :key="src">
        <lazy-image :src="src" />
      </li>
    </ul>
  </div>
  <div v-else class="error" data-icon="i">
    <p v-html="errorMessage"></p>
  </div>
</template>

<script>
import LazyImage from '@/components/ui/LazyImage.vue';

export default {
  name: 'WorkDetails',

  components: {
    LazyImage,
  },

  props: {
    name: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    period: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      required: true,
    },

    screenshotsData: {
      type: Object,
      required: true,
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

  /**
   * Determines the extension of the image files based on the screenshot data passed on. The first
   * screenshot is always assumed to be a JPEG. The remainder are all assumed to be of the same type.
   * All images are expected to be located under a folder with the same name as the project they showcase.
   */
  created() {
    if (this.screenshotsData) {
      const imgNames = [...Array(this.screenshotsData.size).keys()];
      const imgTypes = Array(this.screenshotsData.size).fill(this.screenshotsData.type || 'jpg');
      const imgSrc = `${this.baseUrl}${this.name}/`;

      imgTypes[0] = 'jpg';
      this.screenshots = imgNames.map((imgName, index) => `${imgSrc}${imgName}.${imgTypes[index]}`);
    }
  },
};
</script>

<style scoped lang="scss">
.work-details {
  padding: 1.3rem 1.5rem 1.3rem 1.3rem;
  border-left: .6rem solid transparent;

  h3 {
    margin-bottom: .7rem;
    font-size: 1.5rem;
    color: $primary;

    .title, .period {
      display: block;
    }

    @media (min-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 1rem;
    }
  }

  p {
    margin-bottom: 1.8rem;
  }

  .screenshots {
    list-style: none;

    li:not(:last-child) {
      margin-bottom: 2.2rem;
    }

    .lazy-image {
      min-height: calc(47vw - 2rem);

      &:deep(img) {
        width: 100%;
        height: auto;
      }

      &:deep(svg) {
        background-color: $light-grey;
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

.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  width: 60%;
  font-family: serif;
  font-size: 1.5rem;
  text-align: center;

  @include char-bubble($info);

  p {
    margin-top: 1rem;

    @include accented-first-letter;
  }
}
</style>
