import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Button, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Fire from '../Fire';
import Header from '../components/Header'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {
    InputField,
    InputWrapper,
    AddImage,
    SubmitBtn,
    SubmitBtnText,
    StatusWrapper,
} from '../styles/AddPost';


export default function PostScreen({ navigation }) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [uid, setUid] = useState('');
    const [type, setType] = useState(null);
    const [description, setDescription] = useState("");

    useEffect(() => {
        (async () => {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
        setUid(Fire.shared.uid)
    }, []);

    const takePhotoFromCamera = async () => {
        const permissionResult = hasCameraPermission;
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {
            setImage(result.uri);
        }
    }

    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handlePost = () => {
        if (image === null) {
            if (description.length === 0) {
                Alert.alert(
                    'Empty!',
                    'Please enter something to post...'
                );
            } else {
                setUploading(true);
                setTransferred(100)
                try {
                    Fire.shared
                        .firestore
                        .collection('posts')
                        .add({
                            userId: Fire.shared.uid,
                            description: description,
                            comments: [],
                            likes: [],
                            timestamp: Fire.shared.timestamp,
                            uid: Math.floor((Math.random() * 1000000000))
                        })
                        .then(() => {
                            setUploading(false);
                            setDescription("");
                            navigation.goBack();   
                        })
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            setUploading(true);
            try {
                Fire.shared
                    .addPost({ description: description.trim(), localUri: image })
                    .then(() => {
                        setUploading(false);
                        setImage(null);
                        setDescription("");
                        navigation.goBack();   
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }
        return (
            <>
                <Header
                    LeftIcon={
                        <TouchableRipple
                            onPress={() => { }}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <MaterialIcons
                                name='keyboard-arrow-left'
                                color='#000'
                                size={30}
                            />
                        </TouchableRipple>
                    }
                    title={'Post'}
                    RightIcon={<MaterialIcons
                        name='add-to-photos'
                        color='#000'
                        size={30}
                        onPress={handlePost}
                    />}
                />

                <View style={styles.inputContainer}>

                    <TextInput 
                        autoFocus={true} 
                        multiline={true} 
                        numberOfLines={4} 
                        style={{ flex: 1, marginTop: -20 }} 
                        placeholder="What's on your mind?"
                        onChangeText={(val) => setDescription(val)}
                        value={description}
                    ></TextInput>
                    {uploading ? ( <StatusWrapper>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </StatusWrapper> ) : null}   
                </View>
                <ActionButton buttonColor="#C62828">
                    <ActionButton.Item
                        buttonColor="#e95950"
                        title="Take Photo"
                        onPress={takePhotoFromCamera}
                        >
                        <Icon name="camera-outline" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor="#951E1E"
                        title="Choose Photo"
                        onPress={choosePhotoFromLibrary}>
                        <Icon name="md-images-outline" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
                

                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150}}>
                    {image && <Image source={{uri: image}} style={{ flex: 1 }}></Image>}
                </View>
            </>
        );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 30,
        paddingTop: 100,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    actionButtonIcon: {
        fontSize: 32,
        height: 32,
        color: 'white'
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
      }
})