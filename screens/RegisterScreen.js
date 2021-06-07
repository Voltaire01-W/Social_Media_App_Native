import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, StatusBar, Image } from 'react-native';
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import UserPermissions from '../utilities/UserPermissions';
import Fire from '../Fire';

export default class RegisterScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        user: {
            name: "",
            email: "",
            password: "",
            avatar: null,
            followers: [],
            following: [],
            requests: [],
            comments: [],
            messages: [],
            about: 'About me',
            website: ''
        },
        errorMessage: null
    };

    handlePickAvatar = async () => {
        UserPermissions.getCameraPermission();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);

        if (!result.cancelled) {
            this.setState({ user: {...this.state.user, avatar: result.uri }})
        }
    };

    handleSignUp = () => {
        Fire.shared.createUser(this.state.user);
    }

    render() {
        return (
        <ImageBackground
            source={require("../assets/phoenixsignup.png")}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>

                <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}>
                    <Ionicons name="arrow-back" size={32} color="#FFF"></Ionicons>
                </TouchableOpacity>

                <View>
                    <Text style={styles.greeting}>
                        {'Welcome.\nSign up to get started.'}
                    </Text>
                    <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
                        <Image source={{ uri: this.state.user.avatar }} style={styles.avatar} />
                        <Ionicons name="add" size={40} color="#FFF" style={{ marginTop: 6, marginLeft: 2}}></Ionicons>
                    </TouchableOpacity>
                </View>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Full Name</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none" 
                            onChangeText={name => this.setState({ user: { ...this.state.user, name} })}
                            value={this.state.user.name}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none" 
                            onChangeText={email => this.setState({ user: { ...this.state.user, email} })}
                            value={this.state.user.email}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <TextInput 
                            style={styles.inputWhite} 
                            secureTextEntry 
                            autoCapitalize="none"
                            onChangeText={password => this.setState({ user: { ...this.state.user, password} })}
                            value={this.state.user.password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{ color: "#FFF", fontWeight: "bold" }}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{alignSelf: "center", marginTop: 32 }}
                    onPress={() => this.props.navigation.navigate("Login")}
                >
                    <Text style={{ 
                            color: "white", 
                            fontSize: 15,
                            fontWeight: "bold",
                            textShadowColor: "black",
                            textShadowRadius: 10 
                        }}    
                    >
                        Already have an account?{' '}
                            <Text style={{ 
                                fontWeight: "bold", 
                                color: "white", 
                                textShadowColor: "black", 
                                textShadowRadius: 10,
                                textDecorationLine: "underline"
                            }}
                            >Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop: 36,
        marginBottom: 45,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: "black",
        textShadowRadius: 10,
        color: "white"
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    error: {
        color: "#C62828",
        fontWeight: "bold",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 15,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        textShadowColor: "black",
        textShadowRadius: 5,
        color: "white",
        fontWeight: "bold"
    },
    inputWhite: {
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        textShadowColor: "black",
        textShadowRadius: 10,
        color: "black",
        fontWeight: "bold"
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#C62828",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    back: {
        // position: "absolute",
        
        top: 32,
        left: 32,
        width: 32,
        height: 32,
        borderRadius: 32,
        backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center"
    },
    avatarPlaceholder: {
        position: "absolute",
        top: 90,
        left: 150,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#E1E2E6",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    }
})