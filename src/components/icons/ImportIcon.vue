<script setup lang="ts">
import { h } from 'vue';
import importSvg from '@/assets/icons/import.svg?raw';

defineOptions({ name: 'ImportIcon' });

const props = defineProps({
  size: {
    type: [Number, String],
    default: 22, // Соответствует collapsed-icon-size в NMenu
  },
  color: {
    type: String,
    default: 'currentColor',
  },
});

const svgProps = {
  innerHTML: importSvg,
  style: {
    width: `${props.size}px`,
    height: `${props.size}px`,
    fill: props.color,
    verticalAlign: 'middle',
  },
};
</script>

<template>
  <span v-bind="svgProps"></span>
</template>