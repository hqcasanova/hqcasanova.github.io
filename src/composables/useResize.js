import {
  ref,
  nextTick,
  onMounted,
  onUnmounted,
} from 'vue';

export default function () {
  const height = ref(window.innerHeight);
  const width = ref(window.innerWidth);

  function onResize() {
    height.value = window.innerHeight;
    width.value = window.innerWidth;
  }

  onMounted(() => {
    nextTick(() => {
      window.addEventListener('resize', onResize);
    });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });

  return {
    height,
    width,
  };
}
