import { resolve } from 'path'

export const chainWebpack = (config: any): void => {
  config.resolve.alias.set(
    'vue$',
    resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js')
  )
}
export const transpileDependencies = [
  'vuetify'
]
