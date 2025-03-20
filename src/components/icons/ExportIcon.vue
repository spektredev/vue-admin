<script setup lang="ts">
import { h } from 'vue';
import exportSvg from '@/assets/icons/export.svg?raw';

defineOptions({ name: 'ExportIcon' });

const props = defineProps({
  size: {
    type: [Number, String],
    default: 22,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
});

const svgProps = {
  innerHTML: exportSvg,
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