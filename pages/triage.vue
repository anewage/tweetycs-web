<template>
  <v-container fill-height fluid>
    <v-layout row wrap justify-center>
      <v-flex xs3></v-flex>
      <v-flex xs6>
        <div :id="charts.topicUserDiagram.id">
          <v-btn
            @click="
              charts.topicUserDiagram.sunburst = !charts.topicUserDiagram
                .sunburst
            "
          >
            SUNBURST VIEW
          </v-btn>
          <topic-user
            :meta="charts.topicUserDiagram"
            :topics="topics"
            :users="usersSet"
          ></topic-user>
        </div>
      </v-flex>
      <v-flex xs3></v-flex>
      <v-flex xs3></v-flex>
      <v-flex xs6>
        <div :id="charts.concentricChart.id">
          <v-btn
            @click="
              charts.concentricChart.unit =
                (charts.concentricChart.unit + 1) % 5
            "
          >
            TIME UNIT {{ charts.concentricChart.unit }}
          </v-btn>
          <v-radio-group
            v-model="charts.concentricChart.timeUnit"
            :mandatory="false"
          >
            <v-radio label="Yearly" value="12"></v-radio>
            <v-radio label="Monthly" value="30"></v-radio>
            <v-radio label="Weekly" value="7"></v-radio>
            <v-radio label="Daily" value="24"></v-radio>
            <v-radio label="Hourly" value="60"></v-radio>
          </v-radio-group>
          <concentric-chart
            :meta="charts.concentricChart"
            :topics="topics"
          ></concentric-chart>
        </div>
      </v-flex>
      <v-flex xs3></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TopicUser from '../components/Triage/TopicUserAssociationDiagram'
import ConcentricChart from '../components/Triage/ConcentricChart'
export default {
  name: 'Triage',
  components: {
    TopicUser,
    ConcentricChart
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
        },
        {
          screen_name: 'h',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['Howie Hawkins'], topics: ['green'] },
            { keywords: ['Sedinam Moyowasifza-Curry'], topics: ['green'] },
            { keywords: ['Kent Mesplay'], topics: ['green'] },
            { keywords: ['Chad Wilson'], topics: ['green'] },
            { keywords: ['David Rolde'], topics: ['green'] }
          ],
          selected: false
        },
        {
          screen_name: 'i',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['Donald Trump'], topics: ['republican'] },
            { keywords: ['Mark Sanford'], topics: ['republican'] }
          ],
          selected: false
        },
        {
          screen_name: 'j',
          tweets: [
            { keywords: ['democrats'], topics: ['democratic'] },
            { keywords: ['Jo Jorgensen'], topics: ['libertarian'] },
            { keywords: ['Sam Robb'], topics: ['libertarian'] },
            { keywords: ['Donald Trump'], topics: ['republican'] }
          ],
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
        topicUserDiagram: {
          id: 'topic-user-diagram',
          label: 'Agent-Topic Association ',
          width: 600,
          height: 1000,
          sunburst: false
        },
        concentricChart: {
          id: 'concentric-chart',
          label: 'Agent-Time Association ',
          width: 600,
          height: 1000,
          unit: 0,
          timeUnit: 12
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
      const chordDiv = document.getElementById(this.charts.topicUserDiagram.id)
      const concentricDiv = document.getElementById(
        this.charts.concentricChart.id
      )
      if (chordDiv) {
        this.charts.topicUserDiagram.width = chordDiv.clientWidth - 5
      }
      if (concentricDiv) {
        this.charts.concentricChart.width = concentricDiv.clientWidth - 5
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
