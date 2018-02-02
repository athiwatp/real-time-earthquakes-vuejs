<template>
  <div>
    <no-ssr>
    <gmap-map
    ref="mainMap"
    :center="center"
    :zoom="zoom"
    :mapTypeId="'terrain'"
    style="width: 100%; height: 100vh;"
    :options="{styles: mapStyle}"
    >
    <gmap-marker 
    :position="center" 
    v-show="myCoords.lat && myCoords.lng"
    ></gmap-marker>
    <gmap-circle
        v-for="(m, i) in limitBy(markers, markerLimit)"
        :key="i"
        :center ="m.position"
        :radius="m.position.radius"
        :options="earthquakeSpot"
        :clickable="true"
        @click="$store.commit('SET_MARKER', m)"
    >
    </gmap-circle>
  </gmap-map>
  </no-ssr>
  <v-dialog v-model="markerDialog" max-width="400" persistent>
    <v-card>
      <v-card-title>
        <div class="headline">{{markerDetails.place}}</div>
      </v-card-title>
      <v-card-text class="subheading grey--text text--lighten-3 pt-0">
        <p class="display-3 text-xs-center">{{markerDetails.mag}}</p>
        <p>Date/Time: {{markerDetails.time | readableDate}}</p>
        <p>Depth: {{ markerDetails.depth }} km</p>
        <p>Distance from you: {{ distanceFromUser }} km</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="$store.commit('READ_MORE_FROM_USGS', markerDetails.url)">More</v-btn>
        <v-btn flat @click.native="$store.commit('CLOSE_MARKER_DIALOG')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
 import moment from 'moment'
 export default {
   data () {
     return {
       mapStyle: [
         {
           'featureType': 'all',
           'elementType': 'labels.text.fill',
           'stylers': [
             {
               'saturation': 36
             },
             {
               'color': '#000000'
             },
             {
               'lightness': 40
             }
           ]
         },
         {
           'featureType': 'all',
           'elementType': 'labels.text.stroke',
           'stylers': [
             {
               'visibility': 'on'
             },
             {
               'color': '#000000'
             },
             {
               'lightness': 16
             }
           ]
         },
         {
           'featureType': 'all',
           'elementType': 'labels.icon',
           'stylers': [{
             'visibility': 'off'
           }]
         },
         {
           'featureType': 'administrative',
           'elementType': 'geometry.fill',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 20
             }
           ]
         },
         {
           'featureType': 'administrative',
           'elementType': 'geometry.stroke',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 17
             },
             {
               'weight': 1.2
             }
           ]
         },
         {
           'featureType': 'landscape',
           'elementType': 'geometry',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 20
             }
           ]
         },
         {
           'featureType': 'poi',
           'elementType': 'geometry',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 21
             }
           ]
         },
         {
           'featureType': 'road.highway',
           'elementType': 'geometry.fill',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 17
             }
           ]
         },
         {
           'featureType': 'road.highway',
           'elementType': 'geometry.stroke',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 29
             },
             {
               'weight': 0.2
             }
           ]
         },
         {
           'featureType': 'road.arterial',
           'elementType': 'geometry',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 18
             }
           ]
         },
         {
           'featureType': 'road.local',
           'elementType': 'geometry',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 16
             }
           ]
         },
         {
           'featureType': 'transit',
           'elementType': 'geometry',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 19
             }
           ]
         },
         {
           'featureType': 'water',
           'elementType': 'geometry',
           'stylers': [
             {
               'color': '#000000'
             },
             {
               'lightness': 17
             }
           ]
         }
       ],
       earthquakeSpot: {
         strokeColor: '#FF0000',
         strokeOpacity: 0.8,
         strokeWeight: 2,
         fillColor: '#FF0000',
         fillOpacity: 0.35
       }
     }
   },
   computed: {
     markers () {
       return this.$store.state.markers
     },
     center () {
       return this.$store.getters.GET_CENTER_LOCATION
     },
     markerDetails () {
       return this.$store.state.markerDetails
     },
     markerDialog () {
       return this.$store.state.markerDialog
     },
     markerLimit () {
       return this.$store.state.markerLimit
     },
     distanceFromUser () {
       return this.$store.getters.GET_DISTANCE_FROM_USER
     },
     zoom () {
       return this.$store.state.zoom
     },
     myCoords () {
       return this.$store.state.myCoords
     }
   },
   created () {
     if (process.browser) {
       if (window.location.href.includes('http:')) location.href = 'https://earthquakes.robertsoriano.com'
       this.$store.dispatch('GET_LOCATION')
     }
     this.$store.dispatch('GET_MARKERS')
   },
   filters: {
     readableDate (val) {
       return moment(val).format('MMMM DD, YYYY h:mm A')
     }
   },
   watch: {
     '$vuetify.breakpoint.name' () {
       this.$refs.mainMap.resizePreserveCenter()
     },
     'markerDetails.lat' () {
       const { lat, lng } = this.markerDetails
       this.$refs.mainMap.panTo({ lat, lng })
     }
   }
 }
</script>
