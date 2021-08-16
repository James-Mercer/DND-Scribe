import {
  IdType,
  DateType,
  TimelineOptions,
  TimelineItem,
  TimelineItemType,
  TimelineGroup,
  TimelineOptionsOrientationType
} from 'vis-timeline/peer'

import Session from './Session'
import Character from './Character'
import Location from './Location'
import Organisation from './Organisation'
import Artifact from './Artifact'
import { Color, DefaultFont } from '@/types/NetworkOptions'
import {
  sessionTypeName,
  characterTypeName,
  locationTypeName,
  organisationTypeName,
  artifactTypeName,
  typeColors
} from './typeUtils'

export interface ScribeTimelineItem extends TimelineItem {
  content: string;
  end?: DateType;
  group?: IdType;
  id: IdType;
  start: DateType;
  title: string;
  type: TimelineItemType;
  isLink: boolean;
  linkTo?: { id: string; name: string };
  linkFrom?: { id: string; name: string };
}

export default class DefaultTimelineOptions implements TimelineOptions {
  width = '100%'
  height = '100%'
  autoResize = true
  clickToUse = false
  editable = false
  showCurrentTime = true
  orientation: TimelineOptionsOrientationType = {
    axis: 'bottom',
    item: 'bottom'
  }
}

export class DefaultTimelineGroup implements TimelineGroup {
  id: IdType
  title: string
  content: string
  visible = true
  className: string

  constructor (id: string) {
    this.id = id
    this.title = id
    this.content = id
    this.className = `vis-group-${id}`
  }
}

export const defaultTimelineGroups = [
  new DefaultTimelineGroup(Session.typeName),
  new DefaultTimelineGroup(Character.typeName),
  new DefaultTimelineGroup(Location.typeName),
  new DefaultTimelineGroup(Organisation.typeName),
  new DefaultTimelineGroup(Artifact.typeName)
]

class GroupStyle {
  static defaultBorderWidth = 1
  static defaultBorderRadius = 6
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  fontSize: number
  fontFace: string
  fontColor: string

  constructor (
    backgroundColor: string,
    borderColor?: string,
    borderWidth?: number,
    borderRadius?: number,
    fontSize?: number,
    fontFace?: string,
    fontColor?: string
  ) {
    this.backgroundColor = backgroundColor
    this.borderColor = borderColor || Color.defaultNodeBorder
    this.borderWidth = borderWidth || GroupStyle.defaultBorderWidth
    this.borderRadius = borderRadius || GroupStyle.defaultBorderRadius
    this.fontSize = fontSize || DefaultFont.defaultFontSize
    this.fontFace = fontFace || DefaultFont.defaultFontFace
    this.fontColor = fontColor || DefaultFont.defaultFontColor
  }
}

export class GroupStyles {
  [sessionTypeName]: GroupStyle = new GroupStyle(typeColors[sessionTypeName]);
  [characterTypeName]: GroupStyle = new GroupStyle(
    typeColors[characterTypeName]
  );

  [locationTypeName]: GroupStyle = new GroupStyle(typeColors[locationTypeName]);
  [organisationTypeName]: GroupStyle = new GroupStyle(
    typeColors[organisationTypeName]
  );

  [artifactTypeName]: GroupStyle = new GroupStyle(typeColors[artifactTypeName])
}
