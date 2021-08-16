export type SessionTypeName = 'session'
export type CharacterTypeName = 'character'
export type LocationTypeName = 'location'
export type OrganisationTypeName = 'organisation'
export type ArtifactTypeName = 'artifact'
export type ScribeTypeName =
  | 'scribe'
  | SessionTypeName
  | CharacterTypeName
  | LocationTypeName
  | OrganisationTypeName
  | ArtifactTypeName

export const scribeTypeName: ScribeTypeName = 'scribe'
export const sessionTypeName: SessionTypeName = 'session'
export const characterTypeName: CharacterTypeName = 'character'
export const locationTypeName: LocationTypeName = 'location'
export const organisationTypeName: OrganisationTypeName = 'organisation'
export const artifactTypeName: ArtifactTypeName = 'artifact'

export const typeNames: Array<ScribeTypeName> = [
  scribeTypeName,
  sessionTypeName,
  characterTypeName,
  locationTypeName,
  organisationTypeName,
  artifactTypeName
]

export const typeIcons = Object.freeze({
  [scribeTypeName]: 'mdi-file-question-outline',
  [sessionTypeName]: 'mdi-book-open-variant',
  [characterTypeName]: 'mdi-account',
  [locationTypeName]: 'mdi-map-marker',
  [organisationTypeName]: 'mdi-account-group',
  [artifactTypeName]: 'mdi-archive'
})

export const typeColors = Object.freeze({
  [sessionTypeName]: '#ADD8E6',
  [characterTypeName]: '#90EE90',
  [locationTypeName]: '#DB7093',
  [organisationTypeName]: '#FFFACD',
  [artifactTypeName]: '#40E0D0'
})
