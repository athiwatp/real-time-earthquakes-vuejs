<template>
    <div>
        <v-speed-dial v-model="fab" fixed bottom right direction="top" :transition="transition">
            <v-btn slot="activator" color="blue darken-2" dark fab hover v-model="fab">
                <v-icon>account_circle</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
            
            <v-btn fab dark small color="indigo">
                <v-icon>add</v-icon>
            </v-btn>
            <v-btn fab dark small color="red">
                <v-icon>delete</v-icon>
            </v-btn>
        </v-speed-dial>
    </div>
</template>

<script>
export default {
  data () {
    return {
      fab: true,
      transition: 'slide-y-reverse-transition'
    }
  }
}
</script>

