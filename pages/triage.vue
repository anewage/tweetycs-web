<template>
  <v-container fill-height fluid>
    <v-layout row justify-center>
      <v-flex xs8>
        <div :id="charts.chordDiagram.id">
          <chord-diagram
            :a="mySampleData"
            :fake-data="usersSet"
            :meta="charts.chordDiagram"
            :topics="topics"
          ></chord-diagram>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ChordDiagram from '../components/Chord/ChordDiagram'
export default {
  name: 'Triage',
  components: {
    ChordDiagram
  },
  data() {
    return {
      topics: [
        {
          id: 'democratic',
          title: 'Democratic Party Candidates',
          keywords: [
            'democrats',
            'dems',
            'Michael Bennet',
            'Bennet',
            'Joe Biden',
            'Biden',
            'Michael Bloomberg',
            'Bloomberg',
            'Cory Booker',
            'Booker',
            'Pete Buttigieg',
            'Julián Castro',
            'John Delaney',
            'Tulsi Gabbard',
            'Amy Klobuchar',
            'Deval Patrick',
            'Bernie Sanders',
            'Tom Steyer',
            'Elizabeth Warren',
            'Marianne Williamson',
            'Andrew Yang'
          ]
        },
        {
          id: 'impeachment',
          title: 'Impeachment-related Topics',
          keywords: [
            'Impeachment',
            'Impeached45',
            'ImpeachmentHearing',
            'ImpeachedPresident',
            'IMPOTUS'
          ]
        },
        {
          id: 'republican',
          title: 'Republican Party Candidates',
          keywords: [
            'Donald Trump',
            'trump',
            'Joe Walsh',
            'Bill Weld',
            'Mark Sanford'
          ]
        },
        {
          id: 'libertarian',
          title: 'Libertarian Party Candidates',
          keywords: [
            'Max Abramson',
            'Ken Armstrong',
            'Dan Behrman',
            'Jacob Hornberger',
            'Jo Jorgensen',
            'Adam Kokesh',
            'John McAfee',
            'Sam Robb',
            'Kim Ruff',
            'Vermin Supreme',
            'Arvin Vohra'
          ]
        },
        {
          id: 'green',
          title: 'Green Party Candidates',
          keywords: [
            'Howie Hawkins',
            'Dario Hunter',
            'Sedinam Moyowasifza-Curry',
            'Dennis Lambert',
            'Kent Mesplay',
            'David Rolde',
            'Chad Wilson'
          ]
        }
      ],
      mySampleData: 'Color Code:',
      usersSet: [
        { name: 'a', tweets: [{}, {}, {}] },
        { name: 'b', value: [{}, {}, {}] },
        { name: 'c', value: [{}, {}, {}] },
        { name: 'd', value: [{}, {}, {}] },
        { name: 'e', value: [{}, {}, {}] },
        { name: 'f', value: [{}, {}, {}] },
        { name: 'g', value: [{}, {}, {}] }
      ],
      flat: true,
      color: 'transparent',
      highlightedTopic: '',
      msg: '',
      temp: [],
      selectedUser: { screen_name: '' },
      // Charts and all of their configurations
      charts: {
        chordDiagram: {
          id: 'chord-diagram',
          label: 'Agent-Topic Association ',
          width: 600,
          height: 1000
        }
      }
    }
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize)
    // this.$nextTick(() => {
    //   debugger
    //
    // })
  },
  methods: {
    resize: function() {
      const chordDiv = document.getElementById(this.charts.chordDiagram.id)
      if (chordDiv) {
        this.charts.chordDiagram.width = chordDiv.clientWidth - 5
        // this.charts.chordDiagram.height = chordDiv.clientHeight - 5
      }
    },
    doSomething: function() {
      const a = 100
      window.alert(a)
    }
  }
}
</script>

<style scoped>
.no-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
