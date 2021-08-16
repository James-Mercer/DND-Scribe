import {
  StoreActions,
  ActionContext,
  GraphFilters,
  NodesAndEdges,
  TimelineFilters,
  TimelineData
} from './StoreInterfaces'
import ScribeObject, { ScribeLink } from '@/types/ScribeObject'
import { DataSet } from 'vis-data/peer'
import { Node, Edge } from 'vis-network/peer'
import Session from '@/types/Session'
import { ScribeTimelineItem } from '@/types/TimelineOptions'

const toNode = (obj: ScribeObject): Node => {
  return { id: obj.id, label: obj.name, group: obj.type }
}

const toEdge = (link: ScribeLink): Edge => {
  return { id: link.id, to: link.to, from: link.from, label: link.label }
}

const linkToTimelineItem = (
  context: ActionContext,
  link: ScribeLink,
  start: Date
): ScribeTimelineItem => {
  const toObj = context.state.objects.get(link.to)
  const fromObj = context.state.objects.get(link.from)
  const text = `${toObj?.name}${
    link.label.length > 0 ? ` - ${link.label}` : ''
  }`

  const returnItem: ScribeTimelineItem = {
    id: link.id,
    title: text,
    content: text,
    start: start,
    ...(toObj ? { group: toObj.type } : {}),
    type: 'box',
    isLink: toObj !== undefined && fromObj !== undefined
  }
  if (toObj !== undefined && fromObj !== undefined) {
    ;(returnItem.linkTo = { id: toObj.id.toString(), name: toObj.name }),
    (returnItem.linkFrom = { id: fromObj.id.toString(0), name: fromObj.name })
  }
  return returnItem
}

const sessionToTimelineItems = (
  context: ActionContext,
  session: Session,
  filter: (item: ScribeLink) => boolean,
  irl: boolean
): Array<ScribeTimelineItem> => {
  const items: Array<ScribeTimelineItem> = []
  const sessionItem: ScribeTimelineItem = {
    id: session.id,
    title: session.name,
    content: session.name,
    group: session.type,
    start: irl ? session.irlStartDate : session.igStartDate,
    end: irl ? session.irlEndDate : session.igEndDate,
    type: 'range',
    isLink: false
  }
  items.push(sessionItem)

  // generate a range of dates from the session start and end for each of its links
  const range = session.igEndDate.getTime() - session.igStartDate.getTime()
  const interval = range / (session.links.length + 1)
  session.links.forEach((link: ScribeLink, index: number) => {
    if (!filter(link)) {
      return
    }
    const time = session.igStartDate.getTime() + (index + 1) * interval
    items.push(linkToTimelineItem(context, link, new Date(time)))
  })
  return items
}

const actions: StoreActions = {
  findObject (context: ActionContext, id: string): ScribeObject | undefined {
    return context.state.objects.get(id)
  },

  getNodesAndEdges (
    context: ActionContext,
    filters: GraphFilters
  ): NodesAndEdges {
    console.log('getNodes')
    console.log(context)
    const nodes: Array<Node> = []
    const edges: Array<Edge> = []
    context.state.objects.forEach((obj: ScribeObject): void => {
      if (filters.nodesFilterFn(obj)) {
        nodes.push(toNode(obj))
        obj.links.forEach((link: ScribeLink) => {
          if (filters.edgesFilterFn(link)) {
            edges.push(toEdge(link))
          }
        })
      }
    })
    return { nodes, edges }
  },

  getTimelineItems (
    context: ActionContext,
    filters: TimelineFilters
  ): TimelineData {
    const timelineItems: DataSet<ScribeTimelineItem> = new DataSet<
      ScribeTimelineItem
    >()
    context.state.objects.forEach((obj: ScribeObject) => {
      const include = filters.filterSessionFn(obj as Session)
      if (obj.type === Session.typeName && include) {
        timelineItems.add(
          sessionToTimelineItems(
            context,
            obj as Session,
            filters.filterLinkFn,
            false
          )
        )
      }
    })
    return { groups: context.state.timelineGroups, items: timelineItems }
  }
}
export default actions
