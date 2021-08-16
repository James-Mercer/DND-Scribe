import ScribeObject from '@/types/ScribeObject'
import { OrganisationTypeName, organisationTypeName } from './typeUtils'

export default class Organisation extends ScribeObject {
  static typeName: OrganisationTypeName = organisationTypeName

  constructor (name: string) {
    super(name)
    this.type = Organisation.typeName
  }
}
