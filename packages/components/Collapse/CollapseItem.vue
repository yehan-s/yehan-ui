<template>
  <div class="ye-collapse-item" :class="{ 'is-disabled': disabled }">
    <!-- 标题区 -->
    <div
      class="ye-collapse-item__header"
      :id="`item-header-${name}`"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive,
      }"
      @click="handleClick"
    >
      <span class="ye-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <ye-icon icon="angle-right" class="header-angle"></ye-icon>
    </div>
    <!-- 内容区 -->
    <transition name="slide" v-on="transitionEvents">
      <div class="ye-collapse-item__wapper" v-show="isActive">
        <div class="ye-collapse-item__content" :id="`item-content-${name}`">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { CollapseItemProps } from './types'
import { COLLAPSE_CTX_KEY } from './constants'
import transitionEvents from './transitionEvents'

defineOptions({
  name: 'CollapseItem',
})
const props = defineProps<CollapseItemProps>()
const ctx = inject(COLLAPSE_CTX_KEY, void 0)
const isActive = computed(() => ctx?.activeNames.value?.includes(props.name))

// Collapse中提供itemClick方法
const handleClick = () => {
  if (props.disabled) return
  ctx?.handleItemClick(props.name)
}
</script>

<style scoped>
@import './style.css';
</style>
