import { CommitOptions, GetterTree, MutationTree, ActionTree } from 'vuex'
import ReactiveMap from '@/types/ReactiveMap'
import ScribeObject, { ScribeLink } from '@/types/ScribeObject'
import Session from '@/types/Session'
import NetworkOptions from '@/types/NetworkOptions'
import TimelineOptions, {
  GroupStyles,
  defaultTimelineGroups,
  ScribeTimelineItem
} from '@/types/TimelineOptions'
import Tag from '@/types/Tag'
import { DataSet } from 'vis-data/peer'
import { Node, Edge, IdType, Data } from 'vis-network/peer'
import { DataGroup, TimelineGroup } from 'vis-timeline/peer'

export const defaultCampaignName = 'Unnamed Campaign'

export interface PersistantState {
  title: string;
  objects: ReactiveMap;
  view: number;
  openTabs: Array<IdType>;
  tabIndex: number;
  networkOptions: NetworkOptions;
  timelineOptions: TimelineOptions;
  timelineGroups: Array<TimelineGroup>;
  timelineGroupStyles: GroupStyles;
}

export class StoreState implements PersistantState {
  filePath: string | undefined
  title: string
  view = 0
  objects: ReactiveMap = new ReactiveMap()
  openTabs: Array<IdType> = new Array<string>()
  tabIndex = -1
  tags: Array<Tag> = []

  networkOptions: NetworkOptions = new NetworkOptions()
  timelineOptions: TimelineOptions = new TimelineOptions()
  timelineGroups: Array<TimelineGroup> = defaultTimelineGroups
  timelineGroupStyles: GroupStyles = new GroupStyles()

  constructor (title?: string, path?: string) {
    this.title = title || defaultCampaignName
    this.filePath = path || undefined
  }
}

export interface StoreGetters extends GetterTree<StoreState, StoreState> {
  getTabTitles(state: StoreState): Array<string>;
  getCurrentTabObject(state: StoreState): ScribeObject | undefined;
  getStateToSave(state: StoreState): PersistantState;
}

export interface PayloadUpdateObject {
  id: IdType;
  field:
    | 'name'
    | 'content'
    | 'portrait'
    | 'tags'
    | 'irlStartDate'
    | 'irlEndDate'
    | 'igStartDate'
    | 'igEndDate';
  value: any;
}

export interface PayloadAddTab {
  id: IdType;
  index?: number;
  focus?: boolean;
}

export interface PayloadLoad {
  toLoad: PersistantState;
  path: string;
}

export interface PayloadNewCampaign {
  title?: string;
  path?: string;
}

export interface PayloadObjTag {
  objId: string;
  tagId: number;
}

export interface StoreMutations extends MutationTree<StoreState> {
  setTitle(state: StoreState, title: string): void;
  setView(state: StoreState, view: number): void;
  addObject(state: StoreState, obj: ScribeObject): void;
  updateObject(state: StoreState, payload: PayloadUpdateObject): void;
  removeObject(state: StoreState, id: string): void;
  addTag(state: StoreState, tag: Tag): void;
  updateTag(state: StoreState, tag: Tag): void;
  removeTag(state: StoreState, tag: Tag): void;
  addObjectTag(state: StoreState, payload: PayloadObjTag): void;
  removeObjectTag(state: StoreState, payload: PayloadObjTag): void;
  addTab(state: StoreState, payload: PayloadAddTab): void;
  removeTabById(state: StoreState, id: string): void;
  removeTabByIndex(state: StoreState, index: number): void;
  setCurrentTabIndex(state: StoreState, index: number): void;
  setNetworkOptions(state: StoreState, config: NetworkOptions): void;
  setTimelineOptions(state: StoreState, config: TimelineOptions): void;
  setTimelineGroupStyles(state: StoreState, groupStyles: GroupStyles): void;
  setFilePath(state: StoreState, path: string): void;
  newCampaign(state: StoreState, path?: PayloadNewCampaign): void;
  loadCampaign(state: StoreState, payload: PayloadLoad): void;
  createLink(state: StoreState, payload: Edge): void;
  removeLink(state: StoreState, payload: Edge): void;
}

export interface ActionContext {
  state: StoreState;
  getters: StoreGetters;
  dispatch: (type: string, payload?: any, options?: CommitOptions) => void;
}

export interface GraphFilters {
  nodesFilterFn: (item: ScribeObject) => boolean;
  edgesFilterFn: (item: ScribeLink) => boolean;
}

export interface NodesAndEdges {
  nodes: Array<Node>;
  edges: Array<Edge>;
}

export interface TimelineFilters {
  filterSessionFn: (item: Session) => boolean;
  filterLinkFn: (item: ScribeLink) => boolean;
}

export interface TimelineData {
  groups: Array<DataGroup>;
  items: DataSet<ScribeTimelineItem>;
}

export interface StoreActions extends ActionTree<StoreState, StoreState> {
  findObject(context: ActionContext, id: string): ScribeObject | undefined;
  getNodesAndEdges(context: ActionContext, filters: GraphFilters): NodesAndEdges;
  getTimelineItems(
    context: ActionContext,
    filters: TimelineFilters
  ): TimelineData;
}
