<template>
  <i
    class="ye-icon"
    :class="[`ye-icon-${props.type}`]"
    :style="customStyles"
    v-bind="$attrs"
  >
  <!-- v-bind会直接解构对象，变成绑定的属性 -->
    <font-awesome-icon v-bind="filterProps" />
  </i>
</template>

<script setup lang="ts">
import type { IconProps } from './types'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { omit } from 'lodash-es'
import { computed } from 'vue'

defineOptions({
  name: 'YeIcon',
  inheritAttrs: false,
})

const props = defineProps<IconProps>()
const filterProps = computed(() => omit(props, ['type', 'color']))
const customStyles = computed(() => ({ color: props.color ?? void 0 }))
</script>

<style scoped>
.ye-icon {
  --ye-icon-color: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: var(--ye-icon-color);
  font-size: inherit;
}

@each $val in primary, info, success, warning, danger {
  .ye-icon--$(val) {
    --ye-icon-color: var(--ye-color-$(val));
  }
}
</style>
