import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Alert, ToastAndroid } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import ImagePicker from 'react-native-image-crop-picker';
import Fire from '../Fire';
import firebase from 'firebase';


export default function PostScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [uid, setUid] = useState('');
    const [description, setDescription] = useState("");

    useEffect(() => {
        setUid(firebase.auth().currentUser.uid)
    }, []);

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true
        }).then((image) => {
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true
        }).then((image) => {
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    };

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>
    };

    const handlePost = async () => {
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
                    firebase
                        .firestore()
                        .collection('posts')
                        .add({
                            userId: uid,
                            description: description,
                            comments: [],
                            likes: [],
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            uid: Math.floor((Math.random() * 1000000000))
                        })
                        .then(() => {
                            setUploading(false);
                            Toast.show({
                                text1: "Uploaded",
                                text2: "Please refresh your feed to see your post.",
                                type: 'Success',
                                visibilityTime: 4000,
                                position: 'bottom',
                                bottomOffset: 50
                            });
                            setUploading(false);
                            setDescription("");
                        })
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            const uploadUri = image;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;

            setUploading(true);
            setTransferred(0);
            console.log(filename, uploadUri)
            const task = firebase
                            .storage()
                            .ref('postImages/' + filename)
                            .putFile(uploadUri);

            task.on('state_changed', (taskSnapshot) => {
                console.log(
                    `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                );

                setTransferred(
                    Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
                );
            });

            try {
                await task;

                const url = await firebase
                                    .storage()
                                    .ref('postImage/' + filename)
                                    .getDownloadURL()
                console.log('URL', url)
                firebase
                    .firestore()
                    .collection('posts')
                    .add({
                        imageUrl: url,
                        userId: uid,
                        description: description,
                        comments: [],
                        likes: [],
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        uid: Math.floor((Math.random() * 1000000000))
                    })
                    .then(() => {
                        setUploading(false);
                        Toast.show({
                            text1: "Uploaded",
                            text2: "Please refresh to see your new post.",
                            type: "Success",
                            visibilityTime: 4000,
                            position: 'bottom',
                            bottomOffset: 50
                        });
                        setImage(null);
                        setDescription("");
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
                        onChangeText={(text) => setText(text)}
                        value={text}
                    ></TextInput>
                </View>

                <TouchableOpacity style={styles.photo} onPress={pickImage}>
                    <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
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
        paddingVertical: 40,
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