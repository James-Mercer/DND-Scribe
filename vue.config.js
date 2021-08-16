module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: 'src/preload.js'
    }
  },
  transpileDependencies: [
    'vuetify',
    'vuex-module-decorators'
  ],
  lintOnSave: true
}
