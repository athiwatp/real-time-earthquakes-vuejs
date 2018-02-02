import axios from 'axios'
import moment from 'moment'

function deg2rad (deg) {
  return deg * (Math.PI / 180)
}

export const state = () => ({
  markers: [],
  myCoords: {
    lat: 16.436085,
    lng: 121.275879
  },
  markerDetails: {
    position: {
      lat: null,
      lng: null
    },
    radius: null,
    time: null,
    place: null,
    mag: null,
    depth: null,
    url: null,
    id: null
  },
  markerDialog: false,
  markerLimit: 500,
  zoom: 2,
  url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson',
  currentCenter: 'user'
})

export const getters = {
  GET_DISTANCE_FROM_USER (state, payload) {
    var R = 6371 // Radius of the earth in km
    const userCoordinates = state.myCoords
    const markerDetails = state.markerDetails.position
    const dLat = deg2rad(markerDetails.lat - userCoordinates.lat)
    const dLon = deg2rad(markerDetails.lng - userCoordinates.lng)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(userCoordinates.lat)) * Math.cos(deg2rad(markerDetails.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return Math.round(d * 100) / 100
  },
  GET_CENTER_LOCATION (state, payload) {
    return state.currentCenter === 'user' ? state.myCoords : state.markerDetails.position
  }
}

export const mutations = {
  SET_MARKERS (state, payload) {
    state.markers = payload
  },
  SET_LOCATION (state, payload) {
    state.currentCenter = 'user'
    Object.assign(state.myCoords, payload)
  },
  SET_MARKER (state, payload) {
    Object.assign(state.markerDetails, payload)
    state.markerDialog = true
  },
  LOAD_MORE_MARKERS (state, payload) {
    state.markerLimit += 100
  },
  CLOSE_MARKER_DIALOG (state, payload) {
    state.markerDialog = false
  },
  FOCUS_TO_MARKER (state, payload) {
    state.currentCenter = 'eq-marker'
    Object.assign(state.markerDetails, payload)
    state.zoom = 6
    state.markerDialog = true
  },
  READ_MORE_FROM_USGS (state, payload) {
    window.open(payload, '_blank')
  }
}

export const actions = {
  GET_MARKERS (context, payload) {
    const today = moment().startOf('year').format('YYYY-MM-DD')
    const tomorrow = moment().endOf('year').format('YYYY-MM-DD')
    const url = `${context.state.url}&starttime=${today}&endtime=${tomorrow}`
    axios.get(url).then(res => {
      const markers = res.data.features.map(m => {
        return {
          position: {
            lat: m.geometry.coordinates[1],
            lng: m.geometry.coordinates[0]
          },
          radius: (Math.exp(m.properties.mag / 1.01 - 0.13)) * 1000,
          time: m.properties.time,
          place: m.properties.place,
          mag: m.properties.mag,
          depth: m.geometry.coordinates[2],
          url: m.properties.url,
          id: m.id
        }
      })
      context.commit('SET_MARKERS', markers)
    })
  },
  GET_LOCATION (context, payload) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        context.commit('SET_LOCATION', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      })
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }
}
