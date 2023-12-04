<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        attempt: Object
    },

    data() {
        return {
            opened: false
        }
    },

    computed: {
        ToggleIcon() {
            if (this.opened) {
                return '▼'
            } else {
                return '▶'
            }
        }
    }
})
//it would be cool if past attempts had a picture of the map with your clicked point, and where the point actually was
</script>
<template>
    <div class="attempt">
        <div @click="opened = !opened" class="toggle">Attempt {{ attempt.attempt_number }} {{ ToggleIcon }}</div>
        <div v-if="opened">
            <div>Distance: {{ attempt.attempt_distance }} meters</div>
            <div>Time Used: {{ attempt.attempt_time }} seconds</div>
        </div>
    </div>
    

</template>
<style scoped>

.attempt{
    border: .15rem #1a1463 solid;
    padding: 1rem;
}
.toggle{
    font-weight: bold;
    cursor: pointer;

}

</style>