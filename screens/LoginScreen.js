import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation, ImageBackground } from 'react-native';
import firebase from "firebase";

export default class LoginScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };
    state = {
        email: "",
        password: "",
        errorMessage: null
    };

    handleLogin = () => {
        const { email, password } = this.state;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => this.setState({ errorMessage: error.message }))
        }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <ImageBackground
            source={require("../assets/phoenix.jpg")}
            style={{ flex: 1 }}>

                <View style={styles.container}>
                    <StatusBar barStyle="light-content"></StatusBar>
                    {/* <Image
                    source={require("../assets/phoenix.png")}
                    style={{ marginTop: 50, alignSelf: "center" }}
                    ></Image> */}
                    <Text style={styles.greeting}>
                        {'Hello again.\nWelcome back.'}
                    </Text>
                    <View style={styles.errorMessage}>
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </View>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.inputTitle}>Email Address</Text>
                            <TextInput 
                                style={styles.input} 
                                autoCapitalize="none" 
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                            ></TextInput>
                        </View>

                        <View style={{ marginTop: 32 }}>
                            <Text style={styles.inputTitle}>Password</Text>
                            <TextInput 
                                style={styles.input} 
                                secureTextEntry 
                                autoCapitalize="none"
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password}
                            ></TextInput>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                        <Text style={{ color: "#FFF", fontWeight: "bold" }}>Sign in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{alignSelf: "center", marginTop: 32 }}
                        onPress={() => this.props.navigation.navigate("Register")}
                    >
                        <Text style={{ 
                                color: "#FFF", 
                                fontSize: 16,
                                fontWeight: "bold",
                                textShadowColor: "black",
                                textShadowRadius: 10 }}>
                            New to Firebird?{' '}
                            <Text style={{ 
                                    fontWeight: "bold", 
                                    color: "#FFF", 
                                    textDecorationLine: "underline"
                                    }}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    greeting: {
        marginTop: 90,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
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
        color: "black"
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#C62828",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    }
})