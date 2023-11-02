<script lang="ts">
// @ts-nocheck

import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { mapState, mapStores } from 'pinia';

import { defineComponent } from 'vue';
import * as runtimeCore from '@vue/runtime-core'

import { useAppStore } from '../stores/appStore';
import PastAttempt from '../components/PastAttempt.vue'


interface Location {
    photo: string
    latitude: number
    longitude: number
    difficulty_multiplier: number
}
interface State {
    current_location: Location
    timer_time: number
    timeIsEnabled: boolean
    attempt_number: number
    photoIsEnlarged: boolean
    hasMadeAttempt: boolean
    current_attempt_distance: number
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties{
        $refs: {
            picture: HTMLDivElement
        }
    }
}



export default defineComponent({

    components: {
        PastAttempt,
    },

    data():State {

        return {
            current_location: {
                photo: 'default value',
                latitude: 0,
                longitude: 0,
                difficulty_multiplier: 0,
            },

            timer_time: 60,

            timeIsEnabled: true,

            photoIsEnlarged: false,

            hasMadeAttempt: false,

            attempt_number: 0,

            current_attempt_distance: 0,
        }
    },


    computed: {
        ...mapStores(useAppStore),

        getBackgroundImage() {
            return `url(assets/${this.current_location.photo})`
        },

        getTimerColor() {
            if (this.timer_time > 30) {
                return '#1eb300'
            } else if (this.timer_time > 10) {
                return 'yellow'
            } else {
                return '#ff2700'
            }
        },
    },

    watch: {
        timer_time: {
            handler() {
                if (this.timer_time >= 0 && this.timeIsEnabled) {
                    setTimeout(() => {
                        this.timer_time--
                    }, 1000)
                    
                } else if(this.timer_time < 0) {
                    alert("Time's up! You can do better next time!")
                }
            },
            immediate: true
        },


        photoIsEnlarged() {
            if (this.photoIsEnlarged) {
                this.$refs.picture.style.backgroundSize = 'contain'
                this.$refs.picture.style.height = '75vh'
                this.$refs.picture.style.width = '75vh'
            } else {
                this.$refs.picture.style.backgroundSize = 'cover'
                this.$refs.picture.style.height = '20vh'
                this.$refs.picture.style.width = '20vh'
            }
        }
    },

    mounted() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'm') {/* this is "m" */
                this.photoIsEnlarged = !this.photoIsEnlarged
            }
        })

        this.renderMap()
    },

    methods: {
        nextPicture() {
            console.log('next')
            this.renderMap()
        },

        renderMap() {

            const random_index = Math.floor(Math.random() * this.appStore.unused_locations.length)

            this.current_location = this.appStore.unused_locations.splice(random_index, 1)[0]
            const actual_coords_lon = this.current_location.longitude
            const actual_coords_lat = this.current_location.latitude

            this.attempt_number += 1
            this.hasMadeAttempt = false

            console.log(random_index, this.current_location, this.appStore)
            


            let map = L.map('map').setView([35.699081, -81.288178], 18);

            map.on('keydown', (e) => { //starts new attempt
                if (e.originalEvent.key === 'Enter') {
                    map.remove()
                    this.renderMap()
                    this.timer_time = 60
                    this.timeIsEnabled = true
                }
            })
            
            map.on('click', (e) => {
                if (this.hasMadeAttempt === false) {

                    this.timeIsEnabled = false
                
                    let clicked_lat = e.latlng.lat
                    let clicked_lon = e.latlng.lng

                    this.current_attempt_distance = Math.sqrt((clicked_lon - actual_coords_lon)**2 + (clicked_lat - actual_coords_lat)**2) *111139 /*converts to meters? */
                    this.current_attempt_distance = Math.round(this.current_attempt_distance * 100) / 100 /*rounds to hundreths*/
                
                    this.hasMadeAttempt = true

                    this.current_location.attempt_distance = this.current_attempt_distance
                    this.current_location.attempt_number = this.attempt_number
                    this.current_location.attempt_time = this.timer_time
                    this.appStore.used_locations.push(this.current_location)


                    let actual_point:any = [{
                        "type": "Feature",
                        "properties":{
                            'point-type': 'actual-point',
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [ actual_coords_lon, actual_coords_lat]
                        }
                    }]

                    let actualMarkerOptions = {
                        radius: 5,
                        fillColor: "#33ff57",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }

                    L.geoJSON(actual_point, {
                        pointToLayer: function (feature: any, latlng: any) {
                            return L.circleMarker(latlng, actualMarkerOptions)
                        }
                    }).addTo(map);

                    let clicked_point:any = [
                        {
                        "type": "Feature",
                        "properties":{
                            'point-type': 'actual-point',
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [clicked_lon, clicked_lat]
                        }
                    }]
                    let clickedMarkerOptions = {
                        radius: 5,
                        fillColor: "#ff3351",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }
                    
                    L.geoJSON(clicked_point, {
                        pointToLayer: (feature: any, latlng: any) => {
                            return L.circleMarker(latlng, clickedMarkerOptions)
                        }
                    }).addTo(map);


                    let lines:any = {
                        "type":"Feature",
                        "geometry": {
                        "coordinates": [
                        [
                            clicked_lon,
                            clicked_lat
                        ],
                        [
                            actual_coords_lon,
                            actual_coords_lat
                        ]
                        ],
                        "type": "LineString"
                    }
                    }
                    let lineStyle = {
                        'color':'#ff6700',
                        'weight':3,
                        'opacity': .4,
                    }

                    L.geoJSON(lines, {style: lineStyle}
                    ).addTo(map);

                }
            })

            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { /* implements the mapping tiles */
                attribution: '',
                minZoom: 18,
                maxZoom: 20
            }).addTo(map);


            


            
            
        },

    }


})



</script>
<template>
<div id="main">
    
    <div id="map">
        
    </div>

    <div id="attempts">
            <div id="current-attempt">
                <div>Attempt #{{ attempt_number }}</div>
                <div>Distance: {{ current_attempt_distance }} meters</div>
                <div>Time Elapsed: </div>
                <div v-show="hasMadeAttempt" @click="nextPicture()" id="next-button">Next [Enter]</div>
                <div v-show="hasMadeAttempt === false" id="instructions">[Click the location of the picture]</div>
            </div>

            <div id="past-attempts">
                <PastAttempt v-for="attempt in appStore.used_locations" :attempt="attempt" :key="attempt.attempt_number" />
                
            </div>
        </div>

        <div id="timer" :style="{color: getTimerColor}">{{ timer_time }}</div>
            
        

        <div id="picture" :ref="'picture'" @click="photoIsEnlarged = !photoIsEnlarged" :style="{backgroundImage: getBackgroundImage}"></div>
    

    
    
</div>
</template>

<style scoped>

#main{
    display:flex;
    flex-direction: column;
    height: 100vh;
}

#attempts{
    position: absolute;
    z-index: 701;

    height: 50vh;
    min-width: 18vw;
    right: 1vw;
    top: 15vh;
    background-color: #902bf5;
    border: .5em solid #1a1463;
    border-radius: 1rem;

    display: flex;
    flex-direction: column;
    
}

#current-attempt{
    flex: 1;
    padding: 1rem;
    margin: 1rem;
    border: .15em solid #1a1463;
}
#next-button{
    cursor: pointer;
    background-color: #42b883;
    color: #39494e;
    border: .25rem solid #39494e;
    max-width: fit-content;
    padding: 1rem;
    margin-top: 2rem;
}
#instructions{
    margin-top: 1rem;
    color: darkorange;
    font-weight: bold;
}

#past-attempts{
    flex: 1;
    margin: 1rem;
    overflow: scroll;
}



#timer{
    position: absolute;
    z-index: 701;

    height: 5vh;
    width: 5vw;
    right: 2vw;
    bottom: 1vh;
    background-color: #902bf5;
    border: .5em solid #1a1463;
    border-radius: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bolder;
    font-size: large;
    
}



#map{
    flex: 1;
    position: relative;
    z-index: 1;
}

#picture{
    position: absolute;
    width: 20vh;
    height: 20vh;
    bottom: 2vh;
    left: 1vw;
    z-index: 702; /* anything above 700 should work */

    background-size: cover;
    background-position: bottom left;
    background-repeat: no-repeat;
    background-image: url(../../public/favicon.ico); /* default image, should never normally be seen */
    filter: drop-shadow(#1a1463 0 .25rem) drop-shadow(#1a1463 .25rem 0rem) drop-shadow(#1a1463 -.25rem 0rem) drop-shadow(#1a1463 0rem -.25rem);
    
    
    cursor: pointer;
}

</style>