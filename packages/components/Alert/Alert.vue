<template>
  <transition name="ye-alert-fade">
    <div
      v-show="visible"
      class="ye-alert"
      role="alert"
      :class="{ [`ye-alert__${type}`]: type, [`ye-alert__${effect}`]: effect, 'text-center': center }"
    >
      <ye-icon v-if="showIcon" class="ye-alert__icon" :class="{ 'big-icon': withDescription }" :icon="iconName" />

      <div class="ye-alert__content">
        <span
          class="ye-alert__title"
          :class="{ 'with-desc': withDescription }"
          :style="{ display: center && !showIcon ? 'flow' : 'inline' }"
        >
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="ye-alert__description">
          <slot>{{ description }}</slot>
        </p>
        <template v-if="closable">
          <div v-if="closeText" class="ye-alert__close" @click.stop="close">
            {{ closeText }}
          </div>
          <ye-icon v-else name="close" icon="xmark" class="ye-alert__close" @click.stop="close" />
        </template>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { YeIcon } from '../Icon'
import type { AlertEmits, AlertInstance, AlertProps } from './types'
import { computed, ref, useSlots } from 'vue'
import { typeIconMap } from '@yehan-ui/utils'

defineOptions({
  name: 'YeAlert',
})

const props = withDefaults(defineProps<AlertProps>(), {
  effect: 'light',
  type: 'info',
  closable: true,
})

const emits = defineEmits<AlertEmits>()
const slots = useSlots()

let visible = ref(true)

const iconName = computed(() => typeIconMap.get(props.type) ?? 'circle-info')
const withDescription = computed(() => props.description || slots.default)

const close = () => {
  visible.value = false
  emits('close')
}

const open = () => {
  visible.value = true
}

defineExpose<AlertInstance>({
  close,
  open,
})
</script>

<style scoped>
@import './style.css';
</style>
