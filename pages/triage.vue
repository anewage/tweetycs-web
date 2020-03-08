<template>
  <v-container fill-height fluid>
    <v-layout row justify-center>
      <v-flex xs8>
        <div :id="charts.chordDiagram.id">
          <v-btn
            @click="
              charts.chordDiagram.sunburst = !charts.chordDiagram.sunburst
            "
          >
            SUNBURST VIEW
          </v-btn>
          <chord-diagram
            :meta="charts.chordDiagram"
            :topics="topics"
            :users="usersSet"
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
        {
          screen_name: 'a',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['Adam Kokesh'], topics: ['libertarian'] },
            { keywords: ['IMPOTUS'], topics: ['impeachment'] }
          ],
          selected: false
        },
        {
          screen_name: 'b',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['ImpeachedPresident'], topics: ['impeachment'] },
            { keywords: ['David Rolde'], topics: ['green'] }
          ],
          selected: false
        },
        {
          screen_name: 'c',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['Dennis Lambert'], topics: ['green'] }
          ],
          selected: false
        },
        {
          screen_name: 'd',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['ImpeachedPresident'], topics: ['impeachment'] }
          ],
          selected: false
        },
        {
          screen_name: 'e',
          tweets: [
            { keywords: ['Bill Weld'], topics: ['republican'] },
            { keywords: ['ImpeachedPresident'], topics: ['impeachment'] }
          ],
          selected: false
        },
        {
          screen_name: 'f',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['Donald Trump'], topics: ['republican'] }
          ],
          selected: false
        },
        {
          screen_name: 'g',
          tweets: [{ keywords: ['Elizabeth Warren'], topics: ['democratic'] }],
          selected: false
        }
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
          height: 1000,
          sunburst: false
        }
      }
    }
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    resize: function() {
      const chordDiv = document.getElementById(this.charts.chordDiagram.id)
      if (chordDiv) {
        this.charts.chordDiagram.width = chordDiv.clientWidth - 5
      }
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
