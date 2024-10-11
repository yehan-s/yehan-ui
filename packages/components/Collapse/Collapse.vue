<template>
  <div class="ye-collapse">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import type { CollapseEmits, CollapseItemName, CollapseProps } from './types'
import { COLLAPSE_CTX_KEY } from './constants'

defineOptions({
  name: 'YeCollapse',
})

// 接收 v-model 传的name数组和 点击事件
const props = defineProps<CollapseProps>()
// 接收一个change事件与一个model更新事件
const emits = defineEmits<CollapseEmits>()
const activeNames = ref(props.modelValue)

const handleItemClick = (item: CollapseItemName) => {
  // 取到所有展开项
  let _activeNames = [...activeNames.value]
  // 进入手风琴模式
  if (props.accordion) {
    // 如果点击的是展开项，则清空所有项，否则只保留点击项
    _activeNames = [_activeNames[0] === item ? '' : item]
    updateActiveNames(_activeNames)
    return
  }
  // 找到点击项索引
  const index = _activeNames.indexOf(item)
  // >-1 说明点击的是展开项，需要收起
  if (index > -1) {
    // 删掉点击项
    _activeNames.splice(index, 1)
  } else {
    // 添加点击项
    _activeNames.push(item)
  }
  updateActiveNames(_activeNames)
}

// 更新当前激活项，并进行处理
const updateActiveNames = (newNames: CollapseItemName[]) => {
  // 直接赋值不会触发 watch，所以手动触发
  activeNames.value = newNames
  emits('update:modelValue', newNames)
  emits('change', newNames)
}

// 观察 props.modelValue 的变化，并更新 activeNames
watch(
  () => props.modelValue,
  (newNames) => updateActiveNames(newNames)
)
// 提供展开项，和点击项的处理函数
provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
})
</script>

<style scoped>
@import './style.css';
</style>
