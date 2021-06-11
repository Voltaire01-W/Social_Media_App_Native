import React, { Component } from 'react';
import {
    StyleSheet
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeNavigator from './HomeNavigator';
import ExploreNavigator from './ExploreNavigator';
import PostScreen from '../screens/PostScreen';
import NotificationNavigator from "./NotificationNavigator";
import ProfileNavigator from './ProfileNavigator';
import Tab from './Tab';

export default class BottomTabNavigator extends Component {


    render() {
      
      const Tabs = createBottomTabNavigator();

        return (
            <NavigationContainer>
                <Tabs.Navigator>
                    <Tabs.Screen name="Home" component={HomeNavigator} 
                        options={{
                            tabBarButton: (props) => <Tab label="home" {...props} />,
                        }}

                    />
                    <Tabs.Screen name="Explore" component={ExploreNavigator} 
                        options={{
                            tabBarButton: (props) => <Tab label="explore" {...props} />,
                        }}

                    />
                    <Tabs.Screen name="Post" component={PostScreen} 
                        options={{
                            tabBarButton: (props) => <Tab label="post" {...props} />,
                        }}

                    />
                    <Tabs.Screen name="Notifications" component={NotificationNavigator} 
                        options={{
                            tabBarButton: (props) => <Tab label="notifications" {...props} />,
                        }}

                    />
                    <Tabs.Screen name="Profile" component={ProfileNavigator} 
                        options={{
                            tabBarButton: (props) => <Tab label="profile" {...props} />,
                        }}

                    />
                </Tabs.Navigator>
            </NavigationContainer>

        )
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});