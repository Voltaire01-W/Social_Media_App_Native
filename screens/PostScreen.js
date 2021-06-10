import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Fire from '../Fire';
import firebase from 'firebase';
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
    const [description, setDescription] = useState("");

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            const galleryStatus = await Camera.requestPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
        setUid(Fire.shared.uid)
    }, []);

    const takePhotoFromCamera = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
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
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#D8D9DB"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePost}>
                        <Text style={{ fontWeight: "bold" }}>Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Image source={require("../assets/tempAvatar.jpg")} style={styles.avatar}></Image>
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

                <TouchableOpacity style={styles.photo} onPress={takePhotoFromCamera}>
                    <Ionicons name="camera-outline" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photo} onPress={choosePhotoFromLibrary}>
                    <Ionicons name="md-images-outline" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>

                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150}}>
                    {image && <Image source={{uri: image}} style={{ flex: 1 }}></Image>}
                </View>
            </SafeAreaView>
        );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    }
})