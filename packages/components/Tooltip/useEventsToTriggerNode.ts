import { each, isElement } from 'lodash-es'
import { onMounted, onUnmounted, watch } from 'vue'
import type { ComputedRef, Ref, WatchStopHandle } from 'vue'
import type { TooltipProps } from './types'

// 用于将事件绑定到虚拟触发节点的组合函数
export function useEvenstToTiggerNode(
  props: TooltipProps & { virtualTriggering?: boolean },
  triggerNode: ComputedRef<HTMLElement | undefined>,
  events: Ref<Record<string, EventListener>>,
  closeMethod: () => void
) {
  // 用于停止观察的句柄
  let watchEventsStopHandle: WatchStopHandle | void
  let watchTriggerNodeStopHandle: WatchStopHandle | void

  // 事件处理映射
  const _eventHandleMap = new Map()

  // 绑定事件到虚拟触发节点的内部方法
  const _bindEventToVirtualTiggerNode = () => {
    const el = triggerNode.value
    isElement(el) &&
      each(events.value, (fn, event) => {
        _eventHandleMap.set(event, fn)
        el?.addEventListener(event as keyof HTMLElementEventMap, fn)
      })
  }

  // 解绑事件从虚拟触发节点的内部方法
  const _unbindEventToVirtualTiggerNode = () => {
    const el = triggerNode.value
    isElement(el) &&
      each(
        ['mouseenter', 'click', 'contextmenu'],
        (key) => _eventHandleMap.has(key) && el?.removeEventListener(key, _eventHandleMap.get(key))
      )
  }

  // 组件挂载时的操作
  onMounted(() => {
    watchTriggerNodeStopHandle = watch(triggerNode, () => props.virtualTriggering && _bindEventToVirtualTiggerNode(), {
      immediate: true,
    })

    watchEventsStopHandle = watch(
      events,
      () => {
        if (!props.virtualTriggering) return
        _unbindEventToVirtualTiggerNode()
        _bindEventToVirtualTiggerNode()
        closeMethod()
      },
      { deep: true }
    )
  })

  // 组件卸载时的清理操作
  onUnmounted(() => {
    watchTriggerNodeStopHandle?.()
    watchEventsStopHandle?.()
  })
}

// 导出 useEvenstToTiggerNode 函数作为默认导出
export default useEvenstToTiggerNode
