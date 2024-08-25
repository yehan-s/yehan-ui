<!-- type: 如果tag是button，nativeType才生效，否则忽略type属性 -->
<!-- props 自动展开，不需要前缀 -->
<template>
  <component
    :is="tag"
    ref="_ref"
    :autofocus="autofocus"
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
    @click="
      (e: MouseEvent) =>
        useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)
    "
  >
  <!-- 为loading则隐藏icon -->
    <template v-if="loading">
      <slot name="loading">
        <Ye-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'spinner'"
          :style="iconStyle"
          size="1x"
          spin
        />
      </slot>
    </template>
    <Ye-icon
      v-if="icon && !loading"
      :icon="icon"
      :style="iconStyle"
      size="1x"
    />
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { ButtonProps, ButtonEmits, ButtonInstance } from './types'
import { throttle } from 'lodash-es'
import { BUTTON_GROUP_CTX_KEY } from './contants.ts'
import YeIcon  from '../Icon/Icon.vue'

defineOptions({
  name: 'YeButton',
})
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
  useThrottle: true,
  throttleDuration: 500,
})
const emits = defineEmits<ButtonEmits>()

const slots = defineSlots()
// 第二值是默认值
const ctx = inject(BUTTON_GROUP_CTX_KEY, void 0)
const _ref = ref<HTMLButtonElement>()
const size = computed(() => ctx?.size ?? props.size ?? '')
const type = computed(() => ctx?.type ?? props.type ?? '')
// 相当于给了一个默认 false，当有 button 的值为true 时会单独生效
const disabled = computed(() => ctx?.disabled || props?.disabled || false)

const iconStyle = computed(() => ({
  marginRight: slots.default ? '6px' : '0px',
}))

const handleBtnClick = (e: MouseEvent) => emits('click', e)
const handleBtnClickThrottle = throttle(
  handleBtnClick,
  props.throttleDuration,
  { trailing: false }
)

defineExpose<ButtonInstance>({
  ref: _ref,
})
</script>

<style scoped>
@import './style.css';
</style>
