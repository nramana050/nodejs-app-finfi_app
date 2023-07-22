<template>
  <div>
    <!-- first Header Section -->
    <div class="bg-blue-500 h-6"></div>

    <div class="bg-gray-100">
      <!-- Arrow section -->
      <div class="flex p-3">
        <button class="ml-5" @click="navToDashboard">
          <FaIcon class="mx-auto" icon="arrow-left" />
        </button>

        <p class="ml-4 pt-1 text-gray-600 font-roboto text-base font-medium">
          BeHilly Industries
        </p>
      </div>

      <div ref="map" style="width: 100%; height: 400px"></div>

      <div class="mt-3">
        <p class="text-gray-700 font-roboto text-xl font-medium mx-7">Step-2</p>

        <div class="w-370 h-1 bg-gray-300 mt-3" style="width: 383px"></div>
        <div class="m-4 flex items-center">
          <p
            class="text-gray-700 font-roboto text-base font-normal leading-6 mr-4"
          >
            Status
          </p>
          <p class="text-gray-700 font-roboto text-base font-normal leading-6">
            Step 1 done
          </p>
          <a href="/TaskPage" class="ml-auto">
            <img
              class="ml-auto"
              src="../../assets/Workforce/RightIcon.svg"
              alt=""
            />
          </a>
        </div>
        <div class="w-370 h-1 bg-gray-300 mt-3" style="width: 383px"></div>

        <div class="m-4 flex items-center">
          <p
            class="text-gray-700 font-roboto text-base font-normal leading-6 mr-4"
          >
            Manager's note
          </p>

          <a href="/TaskPage" class="ml-auto">
            <img
              class="ml-auto"
              src="../../assets/Workforce/RightIcon.svg"
              alt=""
            />
          </a>
        </div>
      </div>
      <div class="w-370 h-1 bg-gray-300 mt-3" style="width: 383px"></div>

      <div class="m-4 flex items-center">
        <p
          class="text-gray-700 font-roboto text-base font-normal leading-6 mr-4"
        >
          Details
        </p>

        <a href="/TaskPage" class="ml-auto">
          <img
            class="ml-auto"
            src="../../assets/Workforce/RightIcon.svg"
            alt=""
          />
        </a>
      </div>
      <div class="w-370 h-1 bg-gray-300 mt-3" style="width: 383px"></div>

      <div class="mt-5">
        <button
        @click = "navToClick"
          class="block my-10 w-11/12 h-12 text-center mx-auto text-white bg-blue-400 rounded-3xl hover:bg-blue-600"
        >
          Start Job
        </button>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>
<!-- import { gmapApi } from 'vue2-google-maps'; -->
<script>
export default {
  name: 'ShowLocation',
  head: {
    script: [
      {
        type: 'text/javascript',
        src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyD5OPNPtE5honF4E7LyLyND1PNMf-bmP24&callback=initMap&v=weekly`,
        async: true,
        defer: true,
        body: true,
      },
    ],
  },
  data() {
    return {
      map: null,
      infoWindow: null,
      marker_list: [],
      count: 0,
      locArr: [],
      Remove_locationButton: null,
      token: this.$auth.strategy.token.get(),
    }
  },

  beforeMount() {
    window.initMap = this.initMap
  },

  methods: {
    navToDashboard() {
      this.$router.push('/workforce/dashboardscreen')
    },
    navToClick() {
      this.$router.push('/Workforce/ClickImage')
    },
     initMap() {
      // Create a map object
      // let maxDistance = 0
      // let locationArray = {}
      // await this.$axios
      //   .get('/workforce/location')
      //   .then((response) => {
      //     // var maxDistance = 0;
      //     locationArray = response.data.payload["'location'"]
      //     for (let i = 0; i < locationArray.length; i++) {
      //       for (let j = 0; j < locationArray.length; j++) {
      //         const d =
      //           1000 *
      //           this.calcCrow(
      //             locationArray[i].locations.latitude,
      //             locationArray[i].locations.longitude,
      //             locationArray[j].locations.latitude,
      //             locationArray[j].locations.longitude
      //           )
      //         // console.log("d", d);
      //         maxDistance = Math.max(d, maxDistance)
      //       }
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })

      // const metersPerPx = maxDistance / (Math.sqrt(2) * 25)
      // const zoomLevel = Math.floor(Math.log2(40075016.686 / metersPerPx))

      // console.log('maxD: ', maxDistance)
      // console.log('zoom: ', zoomLevel)
      const map = new window.google.maps.Map(this.$refs.map, {
        center: { lat: 12.971599, lng: 12.971599},
        zoom: 15,
      })
      // const bounds = new window.google.maps.LatLngBounds()

      // for (let count = 0; count < locationArray.length; count++) {
      //   const marker = new window.google.maps.Marker({
      //     position: new window.google.maps.LatLng(
      //       locationArray[count].locations.latitude,
      //       locationArray[count].locations.longitude
      //     ),
      //     map: self.map,
      //     animation: window.google.maps.Animation.DROP,
      //     title: 'Location Number: ' + count.toString(),
      //   })

      //   bounds.extend(marker.getPosition())
      // }
      // map.setCenter(bounds.getCenter())

      // map.fitBounds(bounds)

      // remove one zoom level to ensure no marker is on the edge.
      map.setZoom(map.getZoom() - 1)

      // set a minimum zoom
      // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
      if (map.getZoom() > 15) {
        map.setZoom(15)
      }

      this.infowindow = new window.google.maps.InfoWindow({})

      // Try to get the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }

            // Set the map center to the user's location
            map.setCenter(pos)
            this.locArr.push(pos)

            this.map = map

            // Add a marker at the user's location
            this.marker_list = []
            this.marker_list.push(
              new window.google.maps.Marker({
                position: pos,
                map: this.map,
                title: 'Your Location',
              })
            )

            // const locData = {
            //   userId: 1234,
            //   locations: [
            //     {
            //       latitude: pos.lat,
            //       longitude: pos.lng,
            //     },
            //   ],
            // }
          },
          () => {
            // Handle location retrieval error
            console.log('Error: The Geolocation service failed.')
          }
        )
      } else {
        // Browser doesn't support Geolocation
        console.log("Error: Your browser doesn't support geolocation.")
      }
    },
  },
}
</script>

<style></style>
