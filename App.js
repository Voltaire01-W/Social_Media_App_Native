import React, { Component } from "react";
import { View, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Fire from "./Fire";
import LottieView from 'lottie-react-native';
import Toast from "react-native-toast-message";

import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import BottomTabNavigator from "./components/BottomTabNavigator";

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs(['VirtualizedList']);
LogBox.ignoreLogs(['Animated: ']);
LogBox.ignoreLogs(['Attempted import error: ']);

const Stack = createStackNavigator();

class App extends Component {

    state = {
        loggedIn: null
    }

    componentDidMount() {
        setTimeout(() => Fire.shared.auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    loggedIn: true
                })
            } else {
                this.setState({
                    loggedIn: false
                })
            }
        }), 2200)
    }
    render() {
        switch (this.state.loggedIn) {
            case false:
                return (
                    <>
                        <NavigationContainer>
                            <Stack.Navigator>
                                <Stack.Screen options={{ headerShown: false }} name="LandingScreen" component={LandingScreen}/>
                                <Stack.Screen options={{ headerShown: false }} name="LoginScreen" component={LoginScreen}/>
                                <Stack.Screen options={{ headerShown: false }} name="RegisterScreen" component={RegisterScreen}/>
                            </Stack.Navigator>
                        </NavigationContainer>
                        <Toast ref={(ref) => Toast.setRef(ref)} />
                    </>
                );
            case true:
                return (
                    <>
                    <BottomTabNavigator />
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                    </>
                )
            default:
                return (
                <View style={{ flex: 1, backgroundColor: "#FFF", alignItems: 'center', justifyContent: 'flex-end' }} >
                    {/* <LottieView 
                        ref={animation => {
                            this.animation = animation;
                        }}
                        autoPlay
                        loop
                        source={require('./assets/phoenix.png')}
                    /> */}
                    <Text style={{ marginBottom: 100, color: '#C62828', fontSize: 18, fontWeight: 'bold' }} >Firebird</Text>
                </View>
            )
        }
    }
};

export default App;