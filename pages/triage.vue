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
            Topic/Keyword
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
              charts.concentricChart.tracks =
                charts.concentricChart.tracks < 10
                  ? charts.concentricChart.tracks + 1
                  : 1
            "
          >
            NUMBER OF TRACKS {{ charts.concentricChart.tracks }}
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
            :users="usersSet"
            :number-of-tracks="charts.concentricChart.tracks"
          ></concentric-chart>
        </div>
      </v-flex>
      <v-flex xs3></v-flex>
      <v-flex xs3></v-flex>
      <v-flex xs6>
        <div :id="charts.userSimilarity.id">
          <v-btn
            @click="
              charts.userSimilarity.tracks =
                charts.userSimilarity.tracks < 4
                  ? charts.userSimilarity.tracks + 1
                  : 1
            "
          >
            NUMBER OF Neighbors {{ charts.userSimilarity.tracks }}
          </v-btn>
          <v-btn
            @click="
              charts.userSimilarity.adjacency = !charts.userSimilarity.adjacency
            "
          >
            Adjacency
          </v-btn>
          <user-similarity
            :meta="charts.userSimilarity"
            :topics="topics"
            :users="usersSet"
            :number-of-tracks="charts.userSimilarity.tracks"
          ></user-similarity>
        </div>
      </v-flex>
      <v-flex xs3></v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs8>
        <treemap :users="usersSet"></treemap>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TopicUser from '../components/Triage/TopicUserAssociationDiagram'
import ConcentricChart from '../components/Triage/ConcentricChart'
import UserSimilarity from '../components/Triage/UserSimilarity'
import Treemap from '../components/Treemap/Treemap'
export default {
  name: 'Triage',
  components: {
    UserSimilarity,
    TopicUser,
    ConcentricChart,
    Treemap
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
          w2v: 1,
          tweets: [
            {
              id: 2,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu May 15 15:20:20 +0000 2020'
            },
            {
              id: 31,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Mar 14 13:24:15 +0000 2020'
            },
            {
              id: 32,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Mar 14 13:24:15 +0000 2020'
            },
            {
              id: 33,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Mar 14 13:24:15 +0000 2020'
            },
            {
              id: 34,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Mar 14 13:24:15 +0000 2020'
            }
          ],
          selected: false
        },
        {
          screen_name: 'b',
          w2v: 2,
          tweets: [
            {
              id: 4,
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Mon May 13 15:24:15 +0000 2020'
            },
            {
              id: 5,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu May 14 19:21:20 +0000 2020'
            },
            {
              id: 51,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Apr 1 20:20:20 +0000 2020'
            },
            {
              id: 52,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu May 2 03:20:20 +0000 2020'
            },
            {
              id: 53,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Mar 13 13:18:20 +0000 2020'
            },
            {
              id: 54,
              keywords: ['Booker'],
              topics: ['democraticn'],
              created_at: 'Thu Feb 18 19:18:20 +0000 2020'
            },
            {
              id: 55,
              keywords: ['Cory Booker'],
              topics: ['democratic'],
              created_at: 'Thu May 12 19:18:20 +0000 2019'
            },
            {
              id: 55,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Feb 14 19:18:20 +0000 2018'
            }
          ],
          selected: false
        },
        {
          screen_name: 'c',
          w2v: 3,
          tweets: [
            {
              id: 7,
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Mon Dec 13 15:24:15 +0000 2014'
            },
            {
              id: 8,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Mar 11 19:20:20 +0000 2017'
            },
            {
              id: 9,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2020'
            }
          ],
          selected: false
        },
        {
          screen_name: 'd',
          w2v: 4,
          tweets: [
            {
              id: 10,
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Mon Dec 13 15:24:15 +0000 2019'
            },
            {
              id: 11,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Mar 11 19:20:20 +0000 2019'
            },
            {
              id: 12,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2020'
            }
          ],
          selected: false
        },
        {
          screen_name: 'e',
          w2v: 1,
          tweets: [
            {
              id: 13,
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Mon Dec 13 15:24:15 +0000 2019'
            },
            {
              id: 14,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Mar 11 19:20:20 +0000 2018'
            },
            {
              id: 15,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2018'
            }
          ],
          selected: false
        },
        {
          screen_name: 'f',
          w2v: 2,
          tweets: [
            {
              id: 16,
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Mon Dec 13 15:24:15 +0000 2019'
            },
            {
              id: 17,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Mar 11 19:20:20 +0000 2019'
            },
            {
              id: 18,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 30 15:24:15 +0000 2020'
            }
          ],
          selected: false
        },
        {
          screen_name: 'g',
          w2v: 6,
          tweets: [
            {
              id: 19,
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Mon Dec 13 15:24:15 +0000 2019'
            },
            {
              id: 20,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Mar 11 19:20:20 +0000 2017'
            },
            {
              id: 21,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2020'
            }
          ],
          selected: false
        },
        {
          screen_name: 'h',
          w2v: 1,
          tweets: [
            {
              id: 22,
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Mon Dec 13 15:24:15 +0000 2014'
            },
            {
              id: 23,
              keywords: ['Adam Kokesh'],
              topics: ['libertarian'],
              created_at: 'Thu Mar 12 18:20:20 +0000 2020'
            },
            {
              id: 24,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2020'
            },
            {
              id: 25,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2020'
            },
            {
              id: 26,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2020'
            },
            {
              id: 27,
              keywords: ['IMPOTUS'],
              topics: ['impeachment'],
              created_at: 'Thu Jan 2 15:24:15 +0000 2020'
            }
          ],
          selected: false
        } /*
        ,
        {
          screen_name: 'b',
          tweets: [
            {
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Thu Mar 11 19:20:20 +0000 2020'
            },
            {
              keywords: ['ImpeachedPresident'],
              topics: ['impeachment'],
              created_at: 'Thu Feb 11 19:20:20 +0000 2020'
            },
            {
              keywords: ['David Rolde'],
              topics: ['green'],
              created_at: 'Thu Mar 11 19:20:20 +0000 2020'
            }
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
            {
              keywords: ['democrats'],
              topics: ['democratic'],
              created_at: 'Thu Apr 06 15:24:15 +0000 2017'
            },
            {
              keywords: ['Donald Trump'],
              topics: ['republican'],
              created_at: 'Thu Apr 06 15:24:15 +0000 2017'
            }
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
        } */
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
          padding: { top: 20, bottom: 0, left: 0, right: 0 },
          tracks: 3,
          timeUnit: '12'
        },
        userSimilarity: {
          id: 'user-similarity',
          label: 'Agents Similarity',
          width: 600,
          height: 1000,
          padding: { top: 20, bottom: 0, left: 0, right: 0 },
          tracks: 3,
          focalUser: 0,
          adjacency: false
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
