<template>
  <div id="config-options-container">
    <v-toolbar dense>
      <v-spacer></v-spacer>
      <v-btn @click="expandAll">
        <v-icon>mdi-arrow-expand-down</v-icon>
      </v-btn>
      <v-btn @click="collapseAll">
        <v-icon>mdi-arrow-collapse-up</v-icon>
      </v-btn>
    </v-toolbar>
    <v-expansion-panels
      id="config-expansion-panels"
      v-model="expanededPanels"
      multiple
      accordion
    >
      <v-expansion-panel>
        <v-expansion-panel-header>Nodes</v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0">
          <v-list tile dense>
            <!-- Label & font options -->
            <v-subheader>Standard Font</v-subheader>
            <v-list-item>
              <v-text-field
                label="Size"
                v-model.number="nodeFont.size"
                type="number"
              ></v-text-field>
              <v-select
                label="Face"
                v-model="nodeFont.face"
                :items="fontFaceOptions"
              ></v-select>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="nodeFont.strokeWidth"
                label="Stroke Width"
                type="number"
              ></v-text-field>
            </v-list-item>
            <v-divider></v-divider>
            <v-subheader>Selected Font</v-subheader>
            <v-list-item>
              <v-text-field
                label="Size"
                v-model.number="nodeFont.bold.size"
                type="number"
              ></v-text-field>
              <v-select
                label="Face"
                v-model="nodeFont.bold.face"
                :items="fontFaceOptions"
              ></v-select>
            </v-list-item>
            <v-divider></v-divider>

            <v-subheader>Label position</v-subheader>
            <v-list-item>
              <v-select
                v-model="nodeFont.align"
                label="Label Alignment"
                :items="nodeFontAlignments"
              ></v-select>
              <v-text-field
                v-model.number="nodeFont.vadjust"
                label="Vertical Adjustment"
                type="number"
              ></v-text-field>
            </v-list-item>

            <!-- Shape Options -->
            <v-divider></v-divider>
            <v-subheader>Shape</v-subheader>
            <v-list-item>
              <v-select v-model="nodes.shape" label="shape" :items="shapes">
              </v-select>
            </v-list-item>
            <v-list-item v-if="!isLabelShape(nodes.shape)">
              <v-text-field
                v-model.number="nodes.size"
                label="size"
                type="number"
              >
              </v-text-field>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <template>
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-variant
                    </v-icon>
                  </template>
                </template>
                <span>Size only effects shapes with external labels</span>
              </v-tooltip>
            </v-list-item>
            <v-list-item v-if="nodes.shape === 'box'">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model.number="nodeShapeProps.borderRadius"
                    label="Border Radius"
                    type="number"
                    :rules="[rules.borderRadius]"
                  >
                    <template v-slot:append>
                      <v-icon v-bind="attrs" v-on="on"
                        >mdi-information-variant</v-icon
                      >
                    </template>
                  </v-text-field>
                </template>
                <span>Only for box shapes</span>
              </v-tooltip>
            </v-list-item>
            <template v-if="isLabelShape(nodes.shape)">
              <v-subheader
                >margins
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" small
                      >mdi-information-variant</v-icon
                    >
                  </template>
                  <span>Margin only effects shapes with internal labels</span>
                </v-tooltip></v-subheader
              >
              <v-list-item>
                <v-text-field
                  v-model.number="nodes.margin.top"
                  label="top"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="nodes.margin.left"
                  label="left"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="nodes.margin.right"
                  label="right"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="nodes.margin.bottom"
                  label="bottom"
                  type="number"
                ></v-text-field>
              </v-list-item>
            </template>

            <v-subheader>Border</v-subheader>
            <v-list-item>
              <v-text-field
                v-model.number="nodes.borderWidth"
                label="Border Width"
                type="number"
                max="20"
                min="0"
                hide-details
              ></v-text-field>
              <v-text-field
                v-model.number="nodes.borderWidthSelected"
                label="Border Width Selected"
                type="number"
                hide-details
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-checkbox
                v-model="nodeDashEnabled"
                label="Border Dashes"
                hide-details
              ></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="nodeDashArray[0]"
                label="Dash Length"
                type="number"
                :disabled="!nodeDashEnabled"
              ></v-text-field>
              <v-text-field
                v-model.number="nodeDashArray[1]"
                label="Dash Gap"
                type="number"
                :disabled="!nodeDashEnabled"
              >
              </v-text-field>
            </v-list-item>

            <!-- Shadow Options -->
            <v-divider></v-divider>
            <v-subheader>Shadow Options</v-subheader>
            <v-list-item>
              <v-checkbox
                v-model="nodeShadow.enabled"
                label="Enabled"
                hide-details
                dense
              ></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model="nodeShadow.x"
                label="X"
                type="number"
                :disabled="!nodeShadow.enabled"
              ></v-text-field>
              <v-text-field
                v-model="nodeShadow.y"
                label="Y"
                type="number"
                :disabled="!nodeShadow.enabled"
              ></v-text-field>
              <v-text-field
                v-model="nodeShadow.size"
                label="size"
                type="number"
                :disabled="!nodeShadow.enabled"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <color-input
                label="Shadow Color"
                :color.sync="nodeShadow.color"
              ></color-input>
            </v-list-item>
            <!-- Scaling -->
            <v-subheader>Node Scaling</v-subheader>
            <v-list-item>
              <v-text-field
                v-model="nodeScaling.max"
                label="max"
              ></v-text-field>
              <v-text-field
                v-model="nodeScaling.min"
                label="min"
              ></v-text-field>
            </v-list-item>

            <v-divider></v-divider>
            <v-subheader>Label Scaling</v-subheader>
            <v-list-item>
              <v-text-field
                v-model="nodeScaling.label.max"
                label="max"
              ></v-text-field>
              <v-text-field
                v-model="nodeScaling.label.min"
                label="min"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model="nodeScaling.label.maxVisible"
                label="Max Visible"
              ></v-text-field>
              <v-text-field
                v-model="nodeScaling.label.drawThreshold"
                label="Draw Threshold"
              ></v-text-field>
            </v-list-item>
            <!-- Physics -->
            <v-subheader>Physics</v-subheader>
            <v-list-item>
              <v-select v-model="nodes.physics" label="Enabled"></v-select>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model="nodes.mass"
                label="Node Mass"
              ></v-text-field>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Edges</v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0">
          <v-list>
            <v-subheader>Edge Labels</v-subheader>
            <v-list-item>
              <v-text-field
                v-model.number="edgeFont.size"
                label="Size"
                type="number"
              ></v-text-field>
              <v-select
                v-model="edgeFont.face"
                label="Face"
                :items="fontFaceOptions"
              ></v-select>
            </v-list-item>
            <v-list-item>
              <color-input
                label="Font Color"
                :color.sync="edgeFont.color"
              ></color-input>
            </v-list-item>
            <v-list-item>
              <v-checkbox
                v-model="edges.arrowStrikethrough"
                label="Strikethrough"
              ></v-checkbox>
            </v-list-item>

            <v-divider></v-divider>
            <v-subheader>Selected Font</v-subheader>
            <v-list-item>
              <v-text-field
                v-model.number="edgeFont.bold.size"
                label="Size"
                type="number"
              ></v-text-field>
              <v-select
                v-model="edgeFont.bold.face"
                label="Face"
                :items="fontFaceOptions"
              ></v-select>
            </v-list-item>
            <v-list-item>
              <color-input
                label="Font Color"
                :color.sync="edgeFont.bold.color"
              ></color-input>
            </v-list-item>
            <v-list-item>
              <v-select
                v-model="edgeFont.align"
                label="aligment"
                :items="edgeFontAligments"
              ></v-select>
            </v-list-item>

            <v-divider></v-divider>
            <v-subheader>Stroke</v-subheader>
            <v-list-item>
              <v-text-field
                v-model.number="edgeFont.strokeWidth"
                label="Stroke Width"
                type="number"
              ></v-text-field>
            </v-list-item>

            <v-divider></v-divider>
            <v-subheader>Arrowhead</v-subheader>
            <v-list-item>
              <v-select
                v-model="arrowHeadPlacement"
                :items="arrowHeadPlacements"
              ></v-select>
              <v-select
                v-model="arrowType"
                label="type"
                :items="edgeArrowHeadTypes"
                :disabled="isArrowNone"
              ></v-select>
              <v-text-field
                v-model.number="arrowScale"
                label="Scale"
                type="number"
                :disabled="isArrowNone"
              ></v-text-field>
            </v-list-item>
            <v-divider></v-divider>
            <v-subheader>Line</v-subheader>
            <v-list-item>
              <v-checkbox
                v-model="edgeSmoothness.enabled"
                label="Enable Smooth Curves"
                hide-details
              ></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-select
                v-model="edgeSmoothness.type"
                label="Line type"
                :items="edgeLineTypes"
                :disabled="!edgeSmoothness.enabled"
              ></v-select>
            </v-list-item>
            <v-list-item v-if="edgeSmoothness.type === 'cubicBezier'">
              <v-select
                v-model="edgeSmoothness.forceDirection"
                :items="forceDirectionOptions"
                :disabled="!edgeSmoothness.enabled"
              ></v-select>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="edgeSmoothness.roundness"
                label="Curve Roundness"
                type="number"
                :disabled="!edgeSmoothness.enabled"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="edges.length"
                label="Length"
                type="number"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-checkbox
                v-model="edgeDashEnabled"
                label="Line Dashes"
                hide-details
              ></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="edgeDashArray[0]"
                label="Dash Length"
                type="number"
                :disabled="!edgeDashEnabled"
              ></v-text-field>
              <v-text-field
                v-model.number="edgeDashArray[1]"
                label="Dash Gap"
                type="number"
                :disabled="!edgeDashEnabled"
              >
              </v-text-field>
            </v-list-item>

            <v-divider></v-divider>
            <v-subheader>Shadow</v-subheader>
            <v-list-item>
              <v-checkbox
                label="enabled"
                v-model="edgeShadow.enabled"
                hide-details
              ></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="edgeShadow.x"
                label="X"
                :disabled="!edgeShadow.enabled"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model.number="edgeShadow.y"
                :disabled="!edgeShadow.enabled"
                label="Y"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model.number="edgeShadow.size"
                :disabled="!edgeShadow.enabled"
                label="size"
                type="number"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <color-input
                label="Shadow Color"
                :color.sync="edgeShadow.color"
                :disabled="!edgeShadow.enabled"
              ></color-input>
            </v-list-item>

            <v-divider></v-divider>
            <v-subheader>Scaling</v-subheader>
            <v-list-item>
              <v-text-field
                v-model.number="nodeScaling.max"
                label="max"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model.number="nodeScaling.min"
                label="min"
                type="number"
              ></v-text-field>
            </v-list-item>
            <v-subheader>Label Scaling</v-subheader>
            <v-list-item>
              <v-text-field
                v-model.number="edgeScaling.label.max"
                label="max"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model.number="edgeScaling.label.min"
                label="min"
                type="number"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="edgeScaling.label.maxVisible"
                label="Max Visible"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model.number="edgeScaling.label.drawThreshold"
                label="Draw Threshold"
                type="number"
              ></v-text-field>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Group Styling</v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0">
          <v-list>
            <template>
              <v-subheader>Session</v-subheader>
              <v-list-item>
                <color-input
                  :color.sync="sessionGroup.font.color"
                  label="Font Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="sessionGroup.font.strokeColor"
                  label="Stroke Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="sessionGroup.color.background"
                  label="Background"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="sessionGroup.color.border"
                  label="Border"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="sessionGroup.font.selectedColor"
                  label="Font Color (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="sessionGroup.color.highlight.border"
                  label="Border (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="sessionGroup.color.highlight.background"
                  label="Background (Selected)"
                ></color-input>
              </v-list-item>
              <v-divider></v-divider>
            </template>

            <template>
              <v-subheader>Character</v-subheader>
              <v-list-item>
                <color-input
                  :color.sync="characterGroup.font.color"
                  label="Font Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="characterGroup.font.strokeColor"
                  label="Stroke Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="characterGroup.color.background"
                  label="Background"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="characterGroup.color.border"
                  label="Border"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="characterGroup.font.selectedColor"
                  label="Font Color (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="characterGroup.color.highlight.border"
                  label="Border (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="characterGroup.color.highlight.background"
                  label="Background (Selected)"
                ></color-input>
              </v-list-item>
              <v-divider></v-divider>
            </template>

            <template>
              <v-subheader>Location</v-subheader>
              <v-list-item>
                <color-input
                  :color.sync="locationGroup.font.color"
                  label="Font Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="locationGroup.font.strokeColor"
                  label="Stroke Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="locationGroup.color.background"
                  label="Background"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="locationGroup.color.border"
                  label="Border"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="locationGroup.font.selectedColor"
                  label="Font Color (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="locationGroup.color.highlight.border"
                  label="Border (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="locationGroup.color.highlight.background"
                  label="Background (Selected)"
                ></color-input>
              </v-list-item>
              <v-divider></v-divider>
            </template>

            <template>
              <v-subheader>Organisation</v-subheader>
              <v-list-item>
                <color-input
                  :color.sync="organisationGroup.font.color"
                  label="Font Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="organisationGroup.font.strokeColor"
                  label="Stroke Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="organisationGroup.color.background"
                  label="Background"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="organisationGroup.color.border"
                  label="Border"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="organisationGroup.font.selectedColor"
                  label="Font Color (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="organisationGroup.color.highlight.border"
                  label="Border (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="organisationGroup.color.highlight.background"
                  label="Background (Selected)"
                ></color-input>
              </v-list-item>
              <v-divider></v-divider>
            </template>

            <template>
              <v-subheader>Artifact</v-subheader>
              <v-list-item>
                <color-input
                  :color.sync="artifactGroup.font.color"
                  label="Font Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="artifactGroup.font.strokeColor"
                  label="Stroke Color"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="artifactGroup.color.background"
                  label="Background"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="artifactGroup.color.border"
                  label="Border"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="artifactGroup.font.selectedColor"
                  label="Font Color (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="artifactGroup.color.highlight.border"
                  label="Border (selected)"
                ></color-input>
              </v-list-item>
              <v-list-item>
                <color-input
                  :color.sync="artifactGroup.color.highlight.background"
                  label="Background (Selected)"
                ></color-input>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Physics</v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0">
          <v-list>
            <v-list-item>
              <v-checkbox
                v-model="physics.enabled"
                label="Enabled"
                hide-details
              ></v-checkbox>
            </v-list-item>
            <template v-if="physics.enabled">
              <v-list-item>
                <v-select
                  v-model="physics.solver"
                  label="Physics Solver"
                  :items="physicsSolvers"
                ></v-select>
              </v-list-item>
              <v-subheader>Common Options</v-subheader>
              <v-list-item>
                <v-text-field
                  v-model.number="physics.maxVelocity"
                  label="Max Velocity"
                ></v-text-field>
                <v-text-field
                  v-model.number="physics.minVelocity"
                  label="Min Velocity"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="physics.timestep"
                  label="Timestep"
                ></v-text-field>
                <v-checkbox
                  v-model="physics.adaptiveTimestep"
                  label="Adaptive"
                  hide-details
                ></v-checkbox>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-checkbox
                  v-model="physics.stabilization.enabled"
                  label="Enable Stabilization"
                  hide-details
                ></v-checkbox>
              </v-list-item>
            </template>
            <template v-if="physics.solver === 'barnesHut'">
              <v-subheader>Barnes Hut</v-subheader>
              <v-list-item>
                <v-text-field
                  v-model.number="barnesHut.gravitationalConstant"
                  label="Gravity Constant"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="barnesHut.centralGravity"
                  label="Central Gravity"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="barnesHut.springLength"
                  label="Spring Length"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="barnesHut.springConstant"
                  label="Spring Constant"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="barnesHut.damping"
                  label="Damping"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="barnesHut.avoidOverlap"
                  label="Avoid Overlap"
                  type="number"
                ></v-text-field>
              </v-list-item>
            </template>
            <template v-if="physics.solver === 'repulsion'">
              <v-subheader>Repulsion</v-subheader>
              <v-list-item>
                <v-text-field
                  v-model.number="repulsion.nodeDistance"
                  label="Node Distance"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="repulsion.centralGravity"
                  label="Central Gravity"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="repulsion.springLength"
                  label="Spring Length"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="repulsion.springConstant"
                  label="Spring Constant"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="repulsion.damping"
                  label="Damping"
                  type="number"
                ></v-text-field>
              </v-list-item>
            </template>
            <template v-if="physics.solver === 'hierarchicalRepulsion'">
              <v-subheader>hierarchical Repulsion</v-subheader>
              <v-list-item>
                <v-text-field
                  v-model.number="hierarchicalRepulsion.nodeDistance"
                  label="Node Distance"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="hierarchicalRepulsion.centralGravity"
                  label="Central Gravity"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="hierarchicalRepulsion.springLength"
                  label="Spring Length"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="hierarchicalRepulsion.springConstant"
                  label="Spring Constant"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="hierarchicalRepulsion.damping"
                  label="Damping"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="hierarchicalRepulsion.avoidOverlap"
                  label="Avoid Overlap"
                  type="number"
                ></v-text-field>
              </v-list-item>
            </template>
            <template v-if="physics.solver === 'forceAtlas2Based'">
              <v-subheader>Force Atlas 2 Based</v-subheader>
              <v-list-item>
                <v-text-field
                  v-model.number="forceAtlas2Based.gravitationalConstant"
                  label="Gravity Constant"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="forceAtlas2Based.centralGravity"
                  label="Central Gravity"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="forceAtlas2Based.springLength"
                  label="Spring Length"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="forceAtlas2Based.springConstant"
                  label="Spring Constant"
                  type="number"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  v-model.number="forceAtlas2Based.damping"
                  label="Damping"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="forceAtlas2Based.avoidOverlap"
                  label="Avoid Overlap"
                  type="number"
                ></v-text-field>
              </v-list-item>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import NetworkOptions from '@/types/NetworkOptions'
import * as NetworkOptionDefaults from '@/types/NetworkOptions'

import ColorInput from '@/components/ColorInput.vue'

@Component({ name: 'GraphConfigPanel', components: { ColorInput } })
export default class GraphConfigPanel extends Vue {
  @Prop({ required: true, type: NetworkOptions })
  config!: NetworkOptions

  isLabelShape (shape: string) {
    return NetworkOptionDefaults.isLabelShape(shape)
  }

  rules = {
    borderRadius: (value: number): boolean | string => {
      return (value >= 0 && value <= 10) || 'Radius must be a value from 0 - 10'
    }
  }

  get fontFaceOptions (): Array<string> {
    return NetworkOptionDefaults.fontFaceOptions
  }

  get nodeFontAlignments (): Array<string> {
    return NetworkOptionDefaults.nodeFontAlignments
  }

  get edgeFontAligments (): Array<string> {
    return NetworkOptionDefaults.edgeFontAlignments
  }

  get shapes (): Array<string> {
    return NetworkOptionDefaults.shapes
  }

  get edgeArrowHeadTypes (): Array<string> {
    return NetworkOptionDefaults.arrowHeadTypes
  }

  get arrowHeadPlacements () {
    return NetworkOptionDefaults.arrowHeadPlacements
  }

  get edgeLineTypes (): Array<string> {
    return NetworkOptionDefaults.edgeLineType
  }

  get arrowHeadPlacement () {
    const to = this.edges.arrows.to.enabled
    const middle = this.edges.arrows.middle.enabled
    const from = this.edges.arrows.from.enabled
    if (to && from) {
      return 'to/from'
    }
    if (to) {
      return 'to'
    }
    if (from) {
      return 'from'
    }
    if (middle) {
      return 'middle'
    }
    return 'none'
  }

  set arrowHeadPlacement (value: string) {
    this.edgeTo.enabled = false
    this.edgeMiddle.enabled = false
    this.edgeFrom.enabled = false
    switch (value) {
      case 'to/from':
        this.edgeTo.enabled = true
        this.edgeFrom.enabled = true
        break
      case 'to':
        this.edgeTo.enabled = true
        break
      case 'from':
        this.edgeFrom.enabled = true
        break
      case 'middle':
        this.edgeMiddle.enabled = true
        break
    }
  }

  get isArrowNone () {
    return this.arrowHeadPlacement === 'none'
  }

  get arrowType () {
    switch (this.arrowHeadPlacement) {
      case 'to/from':
        this.edgeFrom.type = this.edgeTo.type
        return this.edgeTo.type
      case 'to':
        return this.edgeTo.type
      case 'from':
        return this.edgeFrom.type
      case 'middle':
        return this.edgeMiddle.type
      default:
        return this.edgeTo.type
    }
  }

  set arrowType (arrowType: string) {
    switch (this.arrowHeadPlacement) {
      case 'to/from':
        this.edgeTo.type = arrowType
        this.edgeFrom.type = arrowType
        break
      case 'to':
        this.edgeTo.type = arrowType
        break
      case 'from':
        this.edgeFrom.type = arrowType
        break
      case 'middle':
        this.edgeMiddle.type = arrowType
        break
      case 'none':
        break
      default:
        console.error(`Arrow type: "${arrowType}" is not recognised`)
        break
    }
  }

  get arrowScale (): number {
    switch (this.arrowHeadPlacement) {
      case 'to/from':
        this.edgeFrom.scaleFactor = this.edgeTo.scaleFactor
        return this.edgeTo.scaleFactor
      case 'to':
        return this.edgeTo.scaleFactor
      case 'from':
        return this.edgeFrom.scaleFactor
      case 'middle':
        return this.edgeMiddle.scaleFactor
      case 'none':
        return 1
      default:
        console.error(
          `Arrow position: "${this.arrowHeadPlacement}" is not recognised`
        )
        return this.edgeTo.scaleFactor
    }
  }

  set arrowScale (scale: number) {
    switch (this.arrowHeadPlacement) {
      case 'to/from':
        this.edgeFrom.scaleFactor = scale
        this.edgeTo.scaleFactor = scale
        break
      case 'to':
        this.edgeTo.scaleFactor = scale
        break
      case 'from':
        this.edgeFrom.scaleFactor = scale
        break
      case 'middle':
        this.edgeMiddle.scaleFactor = scale
        break
      default:
        console.error(
          `Arrow position: "${this.arrowHeadPlacement}" is not recognised`
        )
        break
    }
  }

  forceDirectionOptions: Array<string> = ['horizontal', 'vertical', 'none']

  nodeDashArray: Array<number> = [2, 2]
  edgeDashArray: Array<number> = [2, 2]

  get nodeDashEnabled () {
    if (typeof this.nodeShapeProps.borderDashes === 'boolean') {
      return this.nodeShapeProps.borderDashes
    }
    return true
  }

  set nodeDashEnabled (enabled: boolean) {
    if (enabled === true) {
      this.nodeShapeProps.borderDashes = this.nodeDashArray
    } else {
      this.nodeShapeProps.borderDashes = false
    }
  }

  get edgeDashEnabled () {
    if (typeof this.edges.dashes === 'boolean') {
      return this.edges.dashes
    }
    return true
  }

  set edgeDashEnabled (enabled: boolean) {
    if (enabled === true) {
      this.edges.dashes = this.edgeDashArray
    } else {
      this.edges.dashes = false
    }
  }

  @Watch('nodeDashArray')
  nodeDashChange () {
    this.nodeShapeProps.borderDashes = this.nodeDashArray
  }

  @Watch('edgeDashArray', { deep: true })
  edgeDashChange () {
    this.edges.dashes = this.edgeDashArray
  }

  // Short hand getters for subcategories
  get nodes () {
    return this.config.nodes
  }

  get nodeFont (): NetworkOptionDefaults.DefaultFont {
    return this.config.nodes.font
  }

  get nodeShapeProps () {
    return this.config.nodes.shapeProperties
  }

  get nodeShadow () {
    return this.config.nodes.shadow
  }

  get nodeScaling () {
    return this.config.nodes.scaling
  }

  get edges () {
    return this.config.edges
  }

  get edgeTo () {
    return this.edges.arrows.to
  }

  get edgeMiddle () {
    return this.edges.arrows.middle
  }

  get edgeFrom () {
    return this.edges.arrows.from
  }

  get edgeFont () {
    return this.edges.font
  }

  get edgeShadow () {
    return this.config.edges.shadow
  }

  get edgeSmoothness () {
    return this.config.edges.smooth
  }

  get edgeScaling () {
    return this.config.edges.scaling
  }

  get physics () {
    return this.config.physics
  }

  get barnesHut () {
    return this.physics.barnesHut
  }

  get forceAtlas2Based () {
    return this.physics.forceAtlas2Based
  }

  get repulsion () {
    return this.physics.repulsion
  }

  get hierarchicalRepulsion () {
    return this.physics.hierarchicalRepulsion
  }

  physicsSolvers: Array<string> = [
    'barnesHut',
    'repulsion',
    'hierarchicalRepulsion',
    'forceAtlas2Based'
  ]

  get groups () {
    return this.config.groups
  }

  get sessionGroup () {
    return this.groups.session
  }

  get characterGroup () {
    return this.groups.location
  }

  get locationGroup () {
    return this.groups.location
  }

  get organisationGroup () {
    return this.groups.organisation
  }

  get artifactGroup () {
    return this.groups.artifact
  }

  expanededPanels: Array<number> = []

  expandAll () {
    this.expanededPanels = [0, 1, 2, 3]
  }

  collapseAll () {
    this.expanededPanels = []
  }
}
</script>

<style scoped>
#config-options-container {
  width: 100%;
  height: auto;
}
#config-expansion-panels {
  padding: 0px 2px 0px 2px;
}
</style>

<style>
.v-expansion-panel-content__wrap {
  padding: 0 8px 8px 8px;
}
</style>
