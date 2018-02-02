<template>
  <v-app dark>
    <v-navigation-drawer
      clipped
      fixed
      v-model="drawer"
      app
    >
      <v-subheader class="mt-1 grey--text text--darken-1">Total: {{markers.length}} | Showing: {{markerLimit}} <br> Year: 2018</v-subheader>
      <!-- <div class="px-2">
        <v-expansion-panel popout>
          <v-expansion-panel-content>
            <div slot="header"> <v-icon left>filter_list</v-icon> FILTER </div>
            <v-card>
              <v-card-text>
                <p class="text-xs-center">Coming soon</p>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div> -->
      <v-list three-line dense>
        <v-list-tile @click="$store.commit('FOCUS_TO_MARKER', m)" v-for="(m, i) in limitBy(filterBy(markers, searchRegion), markerLimit)" :key="i">
          <!-- <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action> -->
          <v-list-tile-content>
            <v-list-tile-title v-html="m.place"></v-list-tile-title>
            <v-list-tile-sub-title>
              <timeago :since="m.time" :auto-update="60"></timeago>
            </v-list-tile-sub-title>
            <v-list-tile-sub-title v-html="`Magnitude ${m.mag}`"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div class="text-xs-center pt-3">
        <v-btn @click="$store.commit('LOAD_MORE_MARKERS')">Load more</v-btn>
      </div>
    </v-navigation-drawer>
    <v-toolbar fixed app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">Real-Time Earthquakes</v-toolbar-title>
        <v-text-field
          placeholder="Search region..."
          single-line
          append-icon="search"
          :append-icon-cb="() => {}"
          class="white--text"
          hide-details
          v-model="searchRegion"
        ></v-text-field>
      <v-spacer></v-spacer>
        <v-btn icon @click="$store.dispatch('GET_LOCATION')">
          <v-icon>my_location</v-icon>
        </v-btn>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer :fixed="fixed" app>
      <v-spacer></v-spacer>
      <span>&copy; 2018 USGS Earthquake API</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        fixed: true,
        drawer: null,
        searchRegion: null
      }
    },
    computed: {
      markers () {
        return this.$store.state.markers
      },
      markerLimit () {
        return this.$store.state.markerLimit
      }
    }
  }
</script>
