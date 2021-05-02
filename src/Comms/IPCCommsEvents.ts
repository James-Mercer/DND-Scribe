// Handled on Main
const openFile = 'load:file' // Reading files into JSON Objects
const saveFile = 'save:file' // Wrting files into JSON files
// Handled on Renderer
const newCampaign = 'new:campaign' // Show new campaign dialog
const saveCampaignToFile = 'save:campaign:to:file' // Show save as dialog
const openCampaignFromObject = 'open:campaign:to:file'
const saveCurrentFile = 'save:current:file'

export default {
  openFile,
  /** args:
    *   path - file path to save the file too
    *   object - object to serialize and write to file
    *  */
  saveFile,
  // renderer
  newCampaign,
  saveCampaignToFile,
  saveCurrentFile,
  openCampaignFromObject
}
