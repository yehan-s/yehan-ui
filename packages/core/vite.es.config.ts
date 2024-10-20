import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { readdirSync } from 'fs'
import { map, filter } from 'lodash-es'

function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true })

  return map(entries, (entry) => {
    filter(entries, () => entry.isDirectory()), (entry: { name: any }) => entry.name
  })
}

const COMP_NAMES = [
  'Alert',
  'Button',
  'Collapse',
  'Dropdown',
  'Form',
  'Icon',
  'Input',
  'Loading',
  'Message',
  'MessageBox',
  'Notification',
  'Overlay',
  'Popconfirm',
  'Select',
  'Switch',
  'Tooltip',
  'Upload',
] as const

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: '../../tsconfig.build.json',
      outDir: 'dist/types',
    }),
  ],
  build: {
    outDir: 'dist/es',
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'yehan-ui',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        '@popperjs/core',
        'async-validator',
      ],
      output: {
        assetFileNames: (assetInfo) => {
          console.log(assetInfo, '---')
          if (assetInfo.name === 'style.css') return 'index.css'
          return assetInfo.name as string
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id === 'plugin-vue:export-helper') {
            return 'utils'
          }
          if (id.includes('/packages/hooks')) {
            return 'hooks'
          }
          if (id.includes('/packages/utils')) {
            return 'utils'
          }
          for (const dirName of getDirectoriesSync('../components')) {
            if (id.includes(`/packages/components/${dirName}`)) {
              return dirName
            }
          }
        },
      },
    },
  },
})
