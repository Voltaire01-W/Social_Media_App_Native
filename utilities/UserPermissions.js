import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

class UserPermissions { 
    getCameraPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to add a photo.");
            }
        }
    };
}

export default new UserPermissions();