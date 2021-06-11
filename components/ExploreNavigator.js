import React, { Component } from 'react';
import {

    View,
    Text
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FollowerScreen from '../screens/FollowerScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen'

const Stack = createStackNavigator();


export default class ExploreNavigator extends Component {
    state = {}
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="ExploreScreen" component={ExploreScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen options={{ headerShown: false }} name="FollowerScreen" component={FollowerScreen} />
                <Stack.Screen options={{ headerShown: false }} name="PostDetailScreen" component={PostDetailScreen} />
                <Stack.Screen options={{ headerShown: false }} name="EditProfileScreen" component={EditProfileScreen} />

            </Stack.Navigator>

        );
    }
}