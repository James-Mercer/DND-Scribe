module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: 'src/preload.js'
    }
  },
  transpileDependencies: [
    'vuetify',
    'vuex-module-decorators'
  ],
  lintOnSave: false
}
