<template>
  <div class="ye-tooltip" ref="containerNode" v-on="outerEvents">
    <!-- 虚拟节点，包裹真实dom -->
    <!-- 没有开启虚拟触发时 -->
    <div class="ye-tooltip__trigger" ref="_triggerNode" v-on="events" v-if="!virtualTriggering">
      <slot></slot>
    </div>
    <slot name="default" v-else></slot>
    <transition :name="transition" @after-leave="destroyPopperInstance">
      <div class="ye-tooltip__popper" ref="popperNode" v-on="dropdownEvents" v-if="visible">
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'
import { createPopper, type Instance } from '@popperjs/core'
import { bind, debounce, isNil, type DebouncedFunc } from 'lodash-es'
import { ref, watchEffect, watch, computed, onUnmounted, type Ref } from 'vue'
import { useClickOutside } from '@yehan-ui/hooks'

import useEvenstToTiggerNode from './useEventsToTriggerNode'

// 单独用于这个组件
interface _TooltipProp extends TooltipProps {
  virtualRef: HTMLElement | void
  virtualTriggering?: boolean
}

defineOptions({
  name: 'YeTooltip',
})

const props = withDefaults(defineProps<_TooltipProp>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  showTimeout: 0,
  hideTimeout: 200,
})

const emits = defineEmits<TooltipEmits>()
const visible = ref(false)

// 初始化事件
const events: Ref<Record<string, EventListener>> = ref({})
const outerEvents: Ref<Record<string, EventListener>> = ref({})
const dropdownEvents: Ref<Record<string, EventListener>> = ref({})

// 获取DOM
const containerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()
const _triggerNode = ref<HTMLElement>()

// 如果虚拟触发，则使用虚拟节点
const triggerNode = computed(() => {
  if (props.virtualTriggering) {
    return (props.virtualRef as HTMLElement) ?? _triggerNode.value
  }
  return _triggerNode.value as HTMLElement
})

const popperOptions = computed(() => ({
  // 弹出位置
  placement: props.placement,
  // 位置与行为
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
  ],
  ...props.popperOptions,
}))

// 如果是hover触发，则定义防抖的延迟事件，否则不需要延迟时间，立即触发
const openDelay = computed(() => (props.trigger === 'hover' ? props.showTimeout : 0))
const closeDelay = computed(() => (props.trigger === 'hover' ? props.hideTimeout : 0))
let openDebounce: DebouncedFunc<() => void> | void
let closeDebounce: DebouncedFunc<() => void> | void

// 打开 这两个绑定在hover事件
// cancel是需要立即结束上次事件，因此需要直接触发，而不等待delay时间
function openFinal() {
  closeDebounce?.cancel()
  openDebounce?.()
}
// 关闭
function closeFinal() {
  openDebounce?.cancel()
  closeDebounce?.()
}
// 切换打开与关闭  绑定在click事件
function togglePopper() {
  visible.value ? closeFinal() : openFinal()
}

// 如果disabled，则不生效
function setVisible(val: boolean) {
  if (props.disabled) return
  visible.value = val
  emits('visible-change', val)
}

// 根据触发方式，绑定事件
function attachEvents() {
  if (props.disabled || props.manual) return
  if (props.trigger === 'hover') {
    events.value['mouseenter'] = openFinal
    outerEvents.value['mouseleave'] = closeFinal
    dropdownEvents.value['mouseenter'] = openFinal
    return
  }
  if (props.trigger === 'click') {
    events.value['click'] = togglePopper
    return
  }
  if (props.trigger === 'contextmenu') {
    events.value['contextmenu'] = (e) => {
      e.preventDefault()
      openFinal()
    }
    return
  }
}

let popperInstance: null | Instance

// 对popper实例进行销毁
function destroyPopperInstance() {
  if (isNil(popperInstance)) return
  popperInstance.destroy()
  popperInstance = null
}
// 重置事件
function resetEvents() {
  events.value = {}
  outerEvents.value = {}
  dropdownEvents.value = {}
  attachEvents()
}

// 方便外部调用（受控组件）
const show: TooltipInstance['show'] = openFinal
const hide: TooltipInstance['hide'] = function () {
  openDebounce?.cancel()
  setVisible(false)
}

// 初始化popper,如果visibel为false，则不初始化
watch(
  visible,
  (val) => {
    if (!val) return
    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
      console.log(popperInstance)
    }
  },
  // DOM更新后调用
  { flush: 'post' }
)

// 如果手动触发，则重置事件
watch(
  () => props.manual,
  (isManual) => {
    if (isManual) {
      resetEvents()
      return
    }
    attachEvents()
  }
)
// 监听trigger变化，重置事件
watch(
  () => props.trigger,
  (val, oldVal) => {
    if (val === oldVal) return
    openDebounce?.cancel()
    visible.value = false
    emits('visible-change', false)
    resetEvents()
  }
)
// 初始化
watchEffect(() => {
  if (!props.manual) {
    attachEvents()
  }
  // 初始化防抖
  openDebounce = debounce(bind(setVisible, null, true), openDelay.value)
  closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value)
})

// hover不走这个逻辑
useClickOutside(containerNode, () => {
  emits('click-outside')
  if (props.trigger === 'hover' || props.manual) return
  visible.value && closeFinal()
})

useEvenstToTiggerNode(props, triggerNode, events, ()=> {
  openDebounce?.cancel()
  setVisible(true)
})

onUnmounted(() => {
  console.log('unmount', popperInstance)
  destroyPopperInstance()
})

defineExpose<TooltipInstance>({
  show,
  hide,
})
</script>

<style scoped>
@import './style.css';
</style>
