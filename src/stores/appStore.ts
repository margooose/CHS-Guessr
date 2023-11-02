import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

/*export interface AppStoreInterface {
    unused_locations: Ref<{ photo: string, latitude: number, longitude: number, difficulty_multiplier: number}[]>
    used_locations: Ref<{ photo: string, latitude: number, longitude: number, difficulty_multiplier: number, attempt_distance: number}[]>
}*/
interface bruh {
    photo: string, latitude: number, longitude: number, difficulty_multiplier: number, attempt_distance: number, attempt_number: number
}



export const useAppStore = defineStore('app', () => {

    let unused_locations = ref(
        [
            { "photo": "Copy_of_IMG_3941.png", "latitude": 35.698877722083878, "longitude": -81.286659124088999, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3940.png", "latitude": 35.698856596745514, "longitude": -81.286577549849412, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3939.png", "latitude": 35.698560626140051, "longitude": -81.286612677109417, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3938.png", "latitude": 35.698525584837455, "longitude": -81.286591264760759, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3937.png", "latitude": 35.698631069005089, "longitude": -81.286500674781365, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3936.png", "latitude": 35.698803095406376, "longitude": -81.286773377020126, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3935.png", "latitude": 35.69894287519466, "longitude": -81.287496387440243, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3934.png", "latitude": 35.699252621380708, "longitude": -81.287566252527299, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3933.png", "latitude": 35.69956700920207, "longitude": -81.287219720766828, "difficulty_multiplier": 1.0 },
            { "photo": "Copy_of_IMG_3932.png", "latitude": 35.699530588684539, "longitude": -81.286972861470275, "difficulty_multiplier": 1.0 },
            { "photo": "20230503_095402.jpg", "latitude": 35.699553577354692, "longitude": -81.288861157500534, "difficulty_multiplier": 1.0 },
            { "photo": "20230503_095303.jpg", "latitude": 35.699137159359779, "longitude": -81.288111914890578, "difficulty_multiplier": 1.0 },
            { "photo": "20230503_083936.jpg", "latitude": 35.700338145954362, "longitude": -81.287564587239828, "difficulty_multiplier": 1.0 },
            { "photo": "20230503_083907.jpg", "latitude": 35.699922091999312, "longitude": -81.287405388559549, "difficulty_multiplier": 1.0 },
            { "photo": "20230503_083804.jpg", "latitude": 35.699645390696929, "longitude": -81.286208693356627, "difficulty_multiplier": 1.0 },
            { "photo": "20230503_083725.jpg", "latitude": 35.699168524769448, "longitude": -81.286148309354431, "difficulty_multiplier": 1.0 },
            { "photo": "20230503_083604.jpg", "latitude": 35.69922984095524, "longitude": -81.284962050208591, "difficulty_multiplier": 1.0 },
            { "photo": "20230309_083532.jpg", "latitude": 35.698858847268326, "longitude": -81.285488352805132, "difficulty_multiplier": 1.0 },
            { "photo": "20220919_095637.jpg", "latitude": 35.697432377482187, "longitude": -81.289518942168471, "difficulty_multiplier": 1.0 },
        ]
    )

    let used_locations:Ref<{}[]> = ref([
        //should start as empty, and then fill up as the user goes through more pictures
    ])

    
    return {unused_locations, used_locations}
})