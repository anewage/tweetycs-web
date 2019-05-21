<template>
  <v-layout>
    <v-flex text-xs-center>
      <text-changer
        :id="component_id"
        :width="chartWidth"
        :height="chartHeight"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import TextChanger from '../components/TextChanger'
export default {
  components: {
    'text-changer': TextChanger
  },
  data() {
    return {
      component_id: 'text-changer',
      chartHeight: 500,
      chartWidth: 100
    }
  },
  mounted() {
    const elem = document.getElementById(this.component_id)
    this.chartHeight = elem.clientHeight
    this.chartWidth = elem.clientWidth
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize: function() {
      const elem = document.getElementById(this.component_id)
      this.chartHeight = elem.clientHeight
      this.chartWidth = elem.clientWidth
    }
  }
}
</script>
