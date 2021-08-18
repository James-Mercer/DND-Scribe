module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: 'src/preload.js'
    }
  },
  transpileDependencies: [
    'vuetify',
    'vuex-module-decorators'
  ],
  lintOnSave: true
}
