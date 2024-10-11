import type { Ref } from 'vue'
export type CollapseItemName = string | number

export interface CollapseProps {
  modelValue: CollapseItemName[] // 当前激活的项
  accordion?: boolean // 是否手风琴模式
}

export interface CollapseItemProps {
  name: CollapseItemName // 唯一标识符
  title: string // 标题
  disabled?: boolean // 是否禁用
}

// 当前活动面板，在手风琴模式下其类型是string，在其他模式下是array
// change 切换当前活动面板，在手风琴模式下其类型是string，在其他模式下是array
export interface CollapseEmits {
  (e: 'update:modelValue', value: CollapseItemName[]): void
  (e: 'change', value: CollapseItemName[]): void
}

export interface CollapseContext {
  activeNames: Ref<CollapseItemName[]>  
  handleItemClick: (name: CollapseItemName) => void
}

