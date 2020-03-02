<template>
  <v-layout row wrap>
    <v-flex xs12>
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
        { name: 'a', value: 100 },
        { name: 'b', value: 90 },
        { name: 'c', value: 20 },
        { name: 'd', value: 200 },
        { name: 'e', value: 150 },
        { name: 'f', value: 50 },
        { name: 'g', value: 160 }
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
          height: 600
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
      if (chordDiv) this.charts.chordDiagram.width = chordDiv.clientWidth - 5
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
