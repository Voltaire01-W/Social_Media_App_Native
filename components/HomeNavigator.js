import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import ChatScreen from '../screens/ChatScreen'

const Stack = createStackNavigator();


export default class HomeNavigator extends Component {
    state = {}
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />

                <Stack.Screen options={{ headerShown: false }} name="MessageScreen" component={MessageScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ChatScreen" component={ChatScreen} />
            </Stack.Navigator>

        );
    }
}