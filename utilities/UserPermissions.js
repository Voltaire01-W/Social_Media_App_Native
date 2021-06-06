import { Camera } from "expo-camera"

class UserPermissions { 
    getCameraPermission = async () => { 
        const { status } = await Camera.requestPermissionsAsync();

        if (status != 'granted') {
            alert("We need permission to use your camera roll")
        };
    }
}

export default new UserPermissions();