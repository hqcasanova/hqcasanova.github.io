import { onBeforeUnmount, onMounted } from 'vue';

export default function (component, callback) {
  if (!component) {
    return {};
  }

  function onClick(event) {
    if (event.target !== component.value && event.composedPath().includes(component.value)) {
      return;
    }

    // It is assumed the callback is only useful while the component is rendered.
    if (typeof callback === 'function' && component.value) {
      callback();
    }
  }

  onMounted(() => {
    window.addEventListener('click', onClick);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', onClick);
  });

  return {
    onClick,
  };
}
