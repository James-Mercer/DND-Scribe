import {
  IdType,
  Options,
  NodeOptions,
  Font,
  FontStyles,
  OptionsShadow,
  EdgeOptions,
  OptionsScaling,
  ArrowHead,
  NodeChosen,
  ChosenLabelValues,
  ChosenNodeValues
} from 'vis-network/peer'
import {
  artifactTypeName,
  characterTypeName,
  locationTypeName,
  organisationTypeName,
  sessionTypeName,
  typeColors
} from './typeUtils'

export const fontFaceOptions: Array<string> = [
  'arial',
  'time new roman',
  'lucida console'
]

export const labelShapes: Array<string> = [
  'ellipse',
  'circle',
  'database',
  'box',
  'text'
]

export const shapes: Array<string> = [
  ...labelShapes,
  'diamond',
  'dot',
  'star',
  'triangle',
  'triangleDown',
  'hexagon',
  'square'
]
export function isLabelShape (shape: string) {
  return labelShapes.includes(shape)
}
export const nodeFontAlignments = ['left', 'center', 'right']
export const edgeFontAlignments = ['horizontal', 'top', 'middle', 'bottom']
export const arrowHeadTypes = ['arrow', 'bar', 'circle']
export const arrowHeadPlacements = ['none', 'to', 'middle', 'from', 'to/from']
export const edgeLineType = [
  'dynamic',
  'continuous',
  'discrete',
  'diagonalCross',
  'straightCross',
  'horizontal',
  'vertical',
  'curvedCW',
  'curvedCCW',
  'cubicBezier'
]

// Provide strick classes with default values for the configuration of the graph
export class Color {
  static defaultNodeBackground = '#D2E5FF'
  static defaultNodeBorder = '#2B7CE9'
  border: string
  background: string

  constructor (border: string, background: string) {
    this.border = border
    this.background = background
  }
}

export class DefaultLabelScaling {
  enabled = true
  min = 14
  max = 30
  maxVisible = 30
  drawThreshold = 5
}

export class DefaultScaling implements OptionsScaling {
  min = 1
  max = 15
  label: DefaultLabelScaling = new DefaultLabelScaling()
}

export class DefaultFontStyle implements FontStyles {
  color: string
  size: number
  face: string
  mod: string | 'bold' | 'italic'
  vadjust: number
  constructor (
    color: string,
    size: number,
    face: string,
    mod: string,
    vadjust: number
  ) {
    this.color = color
    this.size = size
    this.face = face
    this.mod = mod
    this.vadjust = vadjust
  }
}

export class DefaultFont implements Font {
  static defaultFontColor = '#343434'
  static defaultFontFace = 'arial'
  static defaultFontSize = 12
  static defaultStrokeWidth = 0
  static defaultStrokeColor = '#FFFFFF'

  size = DefaultFont.defaultFontSize
  face = DefaultFont.defaultFontFace
  align: string
  color = DefaultFont.defaultFontColor
  strokeWidth = DefaultFont.defaultStrokeWidth
  strokeColor = DefaultFont.defaultStrokeColor
  vadjust = 0
  bold: DefaultFontStyle = new DefaultFontStyle(
    this.color,
    this.size,
    this.face,
    'bold',
    0
  )

  ital: DefaultFontStyle = new DefaultFontStyle(
    this.color,
    this.size,
    this.face,
    'italic',
    0
  )

  boldital: DefaultFontStyle = new DefaultFontStyle(
    this.color,
    this.size,
    this.face,
    'bold',
    0
  )

  mono: DefaultFontStyle = new DefaultFontStyle(
    this.color,
    this.size,
    this.face,
    '',
    0
  )

  constructor (align: string, color?: string, size?: number, face?: string) {
    if (color !== undefined) {
      this.color = color
    }
    if (size !== undefined) {
      this.size = size
    }
    if (face !== undefined) {
      this.face = face
    }
    this.align = align
  }
}

export class DefaultShapeOptions {
  borderDashes: number[] | boolean = false // only for borders
  borderRadius = 6 // only for box shape
  interpolation = false // only for image and circularImage shapes
  useImageSize = false // only for image and circularImage shapes
  useBorderWithImage = false // only for image shape
  coordinateOrigin = 'center' // only for image and circularImage shapes
}

export class DefaultShadowOptions implements OptionsShadow {
  static defaultColor = 'rgba(0,0,0,0.5)'
  static defaultSize = 10
  static defaultX = 5
  static defaultY = 5
  enabled = false
  color = DefaultShadowOptions.defaultColor
  size = DefaultShadowOptions.defaultSize
  x = DefaultShadowOptions.defaultX
  y = DefaultShadowOptions.defaultY
}

export class DefaultNodeOptions implements NodeOptions {
  static defaultBorderWidth = 1
  static defaultSize = 25

  font: DefaultFont = new DefaultFont('center')
  labelHighlightBold = true
  shape = 'box'
  shapeProperties: DefaultShapeOptions = new DefaultShapeOptions()
  size = 25 // non-label shapes only
  margin = { top: 4, right: 4, bottom: 4, left: 4 } // only on box, cirlce, database, icon, or text
  borderWidth = DefaultNodeOptions.defaultBorderWidth
  borderWidthSelected: number | undefined =
    DefaultNodeOptions.defaultBorderWidth * 2

  color: Color = new Color(Color.defaultNodeBorder, Color.defaultNodeBackground)
  // opacity = 1.0
  shadow: DefaultShadowOptions = new DefaultShadowOptions()
  scaling: DefaultScaling = new DefaultScaling()
  physics = true
  mass = 1
  chosen: boolean | NodeChosen = true
}

export class DefaultChosenLabel implements ChosenLabelValues {
  color = DefaultFont.defaultFontColor
  face = DefaultFont.defaultFontFace
  mod = 'bold'
  size = DefaultFont.defaultFontSize
  strokeColor = '#FFFFFF'
  strokeWidth = DefaultFont.defaultStrokeWidth
  vadjust = 0
}

export class ArrowHeadOptions implements ArrowHead {
  enabled: boolean
  type: string | 'arrow' | 'bar' | 'circle'
  scaleFactor: number

  constructor (enabled: boolean, type = 'arrow', scaleFactor = 1) {
    this.enabled = enabled
    this.type = type
    this.scaleFactor = scaleFactor
  }
}

export class DefaultArrowOptions {
  to: ArrowHeadOptions = new ArrowHeadOptions(true)
  middle: ArrowHeadOptions = new ArrowHeadOptions(false)
  from: ArrowHeadOptions = new ArrowHeadOptions(false)
}

export class DefaultEdgeSmoothnessOptions {
  enabled = false
  type:
    | 'dynamic'
    | 'continuous'
    | 'discrete'
    | 'diagonalCross'
    | 'straightCross'
    | 'horizontal'
    | 'vertical'
    | 'curvedCW'
    | 'curvedCCW'
    | 'cubicBezier' = 'dynamic'

  forceDirection: 'horizontal' | 'vertical' | 'none' = 'none'
  roundness = 0.5
}

export class DefaultEdgeColor {
  color = '#848484'
  hover = '#848484'
  highlight = '#848484'
  opacity = 1.0
  inherit: false | 'from' | 'to' = false
}

export class DefaultEdgeOptions /* implements EdgeOptions */ {
  static defaultLength = 175
  static defaultWidth = 1

  arrows: DefaultArrowOptions = new DefaultArrowOptions()
  color: DefaultEdgeColor = new DefaultEdgeColor()
  arrowStrikethrough = false
  font: DefaultFont = new DefaultFont('horizontal')
  length = DefaultEdgeOptions.defaultLength
  width = DefaultEdgeOptions.defaultWidth
  dashes: number[] | boolean = false
  physics = true
  shadow: DefaultShadowOptions = new DefaultShadowOptions()
  smooth: DefaultEdgeSmoothnessOptions = new DefaultEdgeSmoothnessOptions()
  scaling: DefaultScaling = new DefaultScaling()
  chosen: boolean | ChosenEdge = true // EdgeOptions does not provide interface for funtion filters even though it is capable
}

// Chosen Options
export class DefaultChosenNode implements ChosenNodeValues {
  borderColor = Color.defaultNodeBorder
  borderDashes: boolean | number[] = false
  borderRadius = 0
  borderWidth = DefaultNodeOptions.defaultBorderWidth + 2
  color = Color.defaultNodeBackground
  shadow = false
  shadowColor = DefaultShadowOptions.defaultColor
  shadowSize = DefaultShadowOptions.defaultSize
  shadowX = DefaultShadowOptions.defaultX
  shadowY = DefaultShadowOptions.defaultY
  size = DefaultNodeOptions.defaultSize
}

export class ChosenEdgeValues {
  dashes?: number[] | boolean
  toArrow?: boolean
  toArrowScale?: number
  toArrowType?: string
  middleArrow?: boolean
  middleArrowScale?: number
  middleArrowType?: string
  fromArrow?: boolean
  fromArrowScale?: number
  fromArrowType?: string
  arrowStrikethrough?: boolean
  color?: string
  inheritsColor = true
  opacity?: number
  hidden = false
  length: number = DefaultEdgeOptions.defaultLength
  shadow?: boolean
  shadowColor?: string
  shadowSize?: string
  shadowX?: number
  shadowY?: number
  width: number = DefaultEdgeOptions.defaultWidth * 2
}

export class ChosenOptions {
  node: DefaultChosenNode = new DefaultChosenNode()
  nodeLabel: DefaultChosenLabel = new DefaultChosenLabel()
  edge: ChosenEdgeValues = new ChosenEdgeValues()
  edgeLabel: DefaultChosenLabel = new DefaultChosenLabel()
}

export class ChosenEdge {
  edge:
    | boolean
    | ((
        values: ChosenEdgeValues,
        id: IdType,
        selected: boolean,
        hovering: boolean
      ) => void) = false

  label:
    | boolean
    | ((
        values: ChosenLabelValues,
        id: IdType,
        selected: boolean,
        hovering: boolean
      ) => void) = false
}

class GroupColor extends Color {
  highlight: Color

  constructor (
    background: string,
    border = '#808080',
    highlightBackground?: string,
    highlightBorder?: string
  ) {
    super(border, background)
    this.highlight = new Color(
      highlightBorder || border,
      highlightBackground || background
    )
  }
}

export class Group {
  color: GroupColor
  font = {
    color: DefaultFont.defaultFontColor,
    selectedColor: DefaultFont.defaultFontColor,
    strokeColor: DefaultFont.defaultStrokeColor
  }

  constructor (background: string) {
    this.color = new GroupColor(background)
    this.font
  }

  chosen = {
    node: true,
    label: (values: ChosenLabelValues) => {
      values.color = this.font.selectedColor
    }
  }
}

export class DefaultGroups {
  session: Group = new Group(typeColors[sessionTypeName])
  character: Group = new Group(typeColors[characterTypeName])
  location: Group = new Group(typeColors[locationTypeName])
  organisation: Group = new Group(typeColors[organisationTypeName])
  artifact: Group = new Group(typeColors[artifactTypeName])
}

export class BarnesHut {
  theta = 0.5
  gravitationalConstant = -2000
  centralGravity = 0.3
  springLength = 95
  springConstant = 0.04
  damping = 0.09
  avoidOverlap = 0
}

export class ForceAtlas2Based {
  theta = 0.5
  gravitationalConstant = -50
  centralGravity = 0.01
  springLength = 100
  springConstant = 0.08
  damping = 0.4
  avoidOverlap = 0
}

export class Repulsion {
  nodeDistance = 100
  centralGravity = 0.2
  springLength = 200
  springConstant = 0.05
  damping = 0.09
}

export class HierarchicalRepulsion {
  nodeDistance = 120
  centralGravity = 0.0
  springLength = 100
  springConstant = 0.01
  damping = 0.09
  avoidOverlap = 0
}

export class Stabilization {
  enabled = true
  iterations = 1000
  updateInterval = 50
  onlyDynamicEdges = false
  fit = true
}

export class DefaultPhysics {
  enabled = true
  solver:
    | 'barnesHut'
    | 'repulsion'
    | 'hierarchicalRepulsion'
    | 'forceAtlas2Based' = 'barnesHut'

  stabilization: Stabilization = new Stabilization()
  barnesHut: BarnesHut = new BarnesHut()
  forceAtlas2Based: ForceAtlas2Based = new ForceAtlas2Based()
  repulsion: Repulsion = new Repulsion()
  hierarchicalRepulsion = new HierarchicalRepulsion()
  maxVelocity = 50
  minVelocity = 0.1
  timestep = 0.5
  adaptiveTimestep = true
}

export default class NetworkOptions /* implements Options */ {
  autoResize = true
  clickToUse = false
  width = '100%'
  height = '100%'
  nodes: DefaultNodeOptions = new DefaultNodeOptions()
  edges: DefaultEdgeOptions = new DefaultEdgeOptions()
  groups: DefaultGroups = new DefaultGroups()
  physics: DefaultPhysics = new DefaultPhysics()
}
