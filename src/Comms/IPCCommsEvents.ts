// Handled on Main
const openFile = 'load:file' // Reading files into JSON Objects
const saveFile = 'save:file' // Wrting files into JSON files
const pickAndSaveFile = 'pick:save:file' // pick a file and write to json
const showError = 'show:error'
// Handled on Renderer
const newCampaign = 'new:campaign' // 
const saveCampaignToFile = 'save:campaign:to:file' // 
const openCampaignFromObject = 'open:campaign:to:file'
const saveCurrentFile = 'save:current:file'
const updateFilePath = 'update:path'

export default {
  openFile,
  /** Save a 
  * Thread - main 
  * args:
  *   path - file path to save the file too
  *   StateToSave: StateToSave - a subset of the store that we want to save
  */
  saveFile,
  pickAndSaveFile,
  showError,
  // renderer
  newCampaign,
  saveCampaignToFile, // Get the campaign state to save with an already provided path
  saveCurrentFile,    //
  openCampaignFromObject,
  updateFilePath
}
