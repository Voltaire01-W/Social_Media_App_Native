import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import Header from '../components/Header'
import { Avatar, TouchableRipple } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from 'react-native-toast-message';
import Fire from "../Fire";

export default class EditProfileScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uid: this.props.route.params.uid,
            name: this.props.route.params.name,
            email: this.props.route.params.email,
            about: this.props.route.params.about,
            loading: false,
            image: this.props.route.params.avatar,
            website:  this.props.route.params.website,
            avatarRemoved: false
        }
    }

    takePhotoFromCamera = async () => {
        const permissionResult = ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    choosePhotoFromLibrary = async () => {
        const permissionResult = ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera roll.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    removeImage = () => {
        this.setState({
            image: 'https://firebasestorage.googleapis.com/v0/b/firebird-social.appspot.com/o/photos%2FmA27CSWjBvgDDZncQ2U80ZYv2Aw2%2Fphoenix.png?alt=media&token=60fce8ca-4346-4326-81ea-27cc5cbf3b5a',
            avatarRemoved: true
        })
        this.RBSheet.close()
    }


    updateProfile = async () => {
        if (this.state.name.length < 5) {
            Alert.alert('Name length must be at least 5 characters', [
                { text: 'Edit' }
            ]);
            return;
        }
        this.setState({ loading: true })
        if (this.state.image !== this.props.route.params.avatar && !this.state.avatarRemoved) {
            const uploadUri = this.state.image;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

            // Add timestamp to File Name
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;
            await Fire.shared.storage.ref('photos/' + filename).putFile(uploadUri);
            const url = await Fire.shared
                                  .storage
                                  .ref('photos/' + filename)
                                  .getDownloadURL()

            Fire.shared.firestore.collection('users').doc(this.state.uid).update({
                name: this.state.name,
                about: this.state.about,
                website: this.state.website,
                avatar: url
            }).then(this.onUpdate)
        }
        else if (this.state.avatarRemoved) {
            Fire.shared.firestore.collection('users').doc(this.state.uid).update({
                name: this.state.name,
                about: this.state.about,
                website: this.state.website,
                avatar: this.state.image
            }).then(this.onUpdate)
        }
        else {
            Fire.shared.firestore.collection('users').doc(this.state.uid).update({
                name: this.state.name,
                about: this.state.about,
                website: this.state.website,
            }).then(this.onUpdate)
        }
    }

    onUpdate = () => {

        Toast.show({
            text1: 'Profile updated',
            visibilityTime: 4000,
            position:'bottom',
            bottomOffset: 50
          });
        this.setState({ loading: false })
        this.props.navigation.goBack()
        return;
    }

    render() {
        return (
            <View style={{ backgroundColor: '#FFF', flex: 1 }}>
                <Header
                    LeftIcon={
                        <TouchableRipple
                            onPress={() => this.props.navigation.goBack()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <MaterialIcons
                                name='keyboard-arrow-left'
                                color='#032468'
                                size={30}
                            />
                        </TouchableRipple>
                    }
                    title={'Edit Profile'}
                    RightIcon={
                        <FontAwesome
                            name="user-circle"
                            size={30}
                            color={"#032468"}
                        />
                    }
                />
                <ScrollView>
                    <View style={styles.editProfile} >

                        <Avatar.Image size={100} source={{ uri: this.state.image }} />
                        <TouchableRipple
                            onPress={() => this.RBSheet.open()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <View style={styles.editProfileIcon} >
                                <FontAwesome5
                                    name="user-edit"
                                    size={15}
                                    color={"#032468"}
                                />
                                <Text style={styles.editProfileIconText} >Change Profile Photo</Text>
                            </View>
                        </TouchableRipple>
                        <RBSheet
                            ref={ref => {
                                this.RBSheet = ref;
                            }}
                            height={150}
                            openDuration={250}
                            customStyles={{
                                container: {
                                    justifyContent: 'space-evenly',

                                }
                            }}
                        >
                            <TouchableRipple
                                onPress={this.takePhotoFromCamera}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <View style={styles.editProfileBottomOption} >
                                    <FontAwesome
                                        name="camera"
                                        size={20}
                                        color={"#032468"}
                                    />
                                    <Text style={styles.editProfileBottomOptionText}  >Take Photo</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={this.choosePhotoFromLibrary}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <View style={styles.editProfileBottomOption} >
                                    <MaterialIcons
                                        name='perm-media'
                                        size={20}
                                        color={"#032468"}
                                    />
                                    <Text style={styles.editProfileBottomOptionText} >Choose from Gallery</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={this.removeImage}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <View style={styles.editProfileBottomOption} >
                                    <MaterialIcons
                                        name='delete'
                                        size={20}
                                        color={"#032468"}
                                    />
                                    <Text style={styles.editProfileBottomOptionText} >Remove Profile Photo</Text>
                                </View>
                            </TouchableRipple>
                        </RBSheet>
                        <View style={styles.editProfileForm} >

                            <Text style={styles.editProfileFormText} >Full Name</Text>
                            <TextInput
                                placeholder='name'
                                value={this.state.name}
                                onChangeText={(val) => this.setState({ name: val })}
                                style={styles.input}
                            />
                            <Text style={styles.editProfileFormText} >Email</Text>
                            <TextInput
                                placeholder='Enter email address'
                                editable={false}
                                value={this.state.email}
                                style={styles.input}
                            />
                            <Text style={styles.editProfileFormText} >Website</Text>
                            <TextInput
                                placeholder='Enter website link'
                                multiline={true}
                                numberOfLines={4}
                                value={this.state.website}
                                onChangeText={(val) => this.setState({ website: val })}
                                style={styles.input}
                            />
                            <Text style={styles.editProfileFormText} >About</Text>
                            <TextInput
                                placeholder='Something about yourself'
                                multiline={true}
                                numberOfLines={4}
                                value={this.state.about}
                                onChangeText={(val) => this.setState({ about: val })}
                                style={styles.input}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={this.updateProfile}

                        >
                            <View style={styles.editProfileUpdate} >
                                {this.state.loading ?
                                    <ActivityIndicator size='small' color='#032468' />
                                    :
                                    <>
                                        <FontAwesome5
                                            name='save'
                                            size={20}
                                            color={"#032468"}
                                        />

                                        <Text style={[styles.editProfileBottomOptionText, { fontWeight: 'bold' }]} >Update</Text>
                                    </>}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    editProfile: {
        flex: 1,
        alignItems: 'center',
        padding: 20

    },
    editProfileBottomOption: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 25
    },
    editProfileBottomOptionText: {
        marginLeft: 15
    },
    editProfileIcon: {
        flexDirection: 'row',
        marginTop: 10
    },
    editProfileIconText: {
        marginLeft: 10,
        color: '#032468',
    },
    editProfileForm: {
        width: '100%',
        marginTop: 15
    },
    editProfileFormText: {
        color: '#032468',
        marginTop: 10,
        fontWeight: 'bold'
    },
    input: {
        borderBottomWidth: 0.5,
        borderColor: '#9da5b7',

    },
    editProfileUpdate: {
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#7d86f8',
        padding: 10,
        paddingHorizontal: 15,
        marginTop: 20
    }
})