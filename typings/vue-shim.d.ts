// 处理解析 ts 中的声明文件 （vue）


declare module '*.vue' {
  // 定义的组件类型
  import {defineComponent, App} from 'vue'
  const component: ReturnType <typeof defineComponent> & {
    install(app: App): void
  }

  // 导出组件

  export default component
}