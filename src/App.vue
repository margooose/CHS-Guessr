<script lang="ts">

import MainDesktop from './components/MainDesktop.vue'
import MainMobile from './components/MainMobile.vue'

export default {

    

    components: {
        MainDesktop,
        MainMobile,
    },

    computed: {
        getAppLayout() {
            if (screen.width > screen.height) {
                console.log('desktop')
                return true
            } else {
                console.log('mobile')
                return false
            }
        }
    }

}
</script>
<template>
    <MainDesktop v-if="getAppLayout" />
    <MainMobile v-if="!getAppLayout" />
</template>