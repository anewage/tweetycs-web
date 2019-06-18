<template>
  <v-card :color="color" :flat="flat">
    <v-card-title>
      <h2>
        {{ label }}
      </h2>
    </v-card-title>
    <v-card-actions>
      <v-btn icon @click="meta.show = !meta.show">
        <v-icon>{{ meta.show ? 'help' : 'help_outline' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="meta.show">
        {{ meta.info }}
      </v-card-text>
    </v-slide-y-transition>
    <v-card-text>
      <div :id="divId">
        <sankey-diagram
          :id="id"
          :width="width"
          :height="height"
          :dataset="sankeyData"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import SankeyDiagram from './SankeyDiagram'
export default {
  name: 'SankeyDiagramWrapper',
  components: {
    'sankey-diagram': SankeyDiagram
  },
  props: {
    id: {
      type: String,
      default: 'sankey'
    },
    divId: {
      type: String,
      default: 'sankey-div'
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'transparent'
    },
    flat: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: 'This Amazing Sankey Diagram'
    },
    selectedMlMethod: {
      type: String,
      default: 'CNN'
    },
    dataset: {
      type: Object,
      default: function() {
        return {
          group_topics: [],
          theme_topics: []
        }
      }
    }
  },
  data() {
    return {
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      }
    }
  },
  computed: {
    groupsToTopics() {
      const temp = this.dataset.group_topics.filter(
        item => item._id === this.selectedMlMethod
      )
      if (temp.length > 0) return temp[0].items
      return []
    },
    themesToTopics() {
      const temp = this.dataset.theme_topics.filter(
        item => item._id === this.selectedMlMethod
      )
      if (temp.length > 0) return temp[0].items
      return []
    },
    nodesList() {
      const groups = new Set(this.groupsToTopics.map(it => it._id.group))
      const topics1 = new Set(this.groupsToTopics.map(it => it._id.topic))
      const topics2 = new Set(this.themesToTopics.map(it => it._id.topic))
      const themes = new Set(this.themesToTopics.map(it => it._id.theme))
      const nodes = [...new Set([...groups, ...topics1, ...topics2, ...themes])]
      return nodes.map(node => {
        return { id: node, name: node }
      })
    },
    linksList() {
      // eslint-disable-next-line no-unused-vars
      const links1 = this.groupsToTopics.map(it => {
        return {
          source: it._id.group,
          target: it._id.topic,
          value: it.count
        }
      })
      // eslint-disable-next-line no-unused-vars
      const links2 = this.themesToTopics.map(it => {
        return {
          source: it._id.topic,
          target: it._id.theme,
          value: it.count
        }
      })
      return [...links1, ...links2]
    },
    sankeyData() {
      // Get data from bak and update the values only by each emit
      const res = {
        nodes: [
          { id: 'user_categories', name: 'User Categories' },
          { id: 'topics', name: 'Topics' },
          { id: 'content_themes', name: 'Content Themes' }
        ],
        links: []
      }
      if (this.selectedMlMethod === '') return res
      res.nodes = this.nodesList
      res.links = this.linksList
      return res
    }
  }
}
</script>

<style scoped></style>
