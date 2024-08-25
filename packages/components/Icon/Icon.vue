<template>
  <i class="ye-icon" :class="[`ye-icon-${props.type}`]" :style="customStyles" v-bind="$attrs">
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
@import './style.css';
</style>
