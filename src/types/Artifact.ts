import ScribeObject from './ScribeObject'
import { artifactTypeName, ArtifactTypeName } from './typeUtils'

export default class Artifact extends ScribeObject {
  static typeName: ArtifactTypeName = artifactTypeName

  constructor (name: string) {
    super(name)
    this.type = Artifact.typeName
  }
}
