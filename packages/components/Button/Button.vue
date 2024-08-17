<template>
  <!-- type: 如果tag是button，nativeType才生效，否则忽略type属性 -->
  <component
    :is="props.tag"
    ref="_ref"
    class="ye-button"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    :class="{
      [`ye-button--${type}`]: type,
      [`ye-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
  >
  <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'

defineOptions({
  name: 'YeButton',
})
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
})

const slots = defineSlots()

const _ref = ref<HTMLButtonElement>()
</script>

<style scoped>
@import './style.css';
</style>