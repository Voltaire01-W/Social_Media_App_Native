import React from "react";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import HomeScreen from './screens/HomeScreen';
import MessageScreen from './screens/MessageScreen';
import NotificationScreen from './screens/NotificationScreen';
import PostScreen from './screens/PostScreen';
import ProfileScreen from './screens/ProfileScreen';

const AppContainer = createStackNavigator(
    {
        default: createBottomTabNavigator(
            {
                Home: {
                    screen: HomeScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="home" size={24} color={tintColor} />
                    }
                },
                Message: {
                    screen: MessageScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="chatbubbles" size={24} color={tintColor} />
                    }
                },
                Post: {
                    screen: PostScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => 
                            <Ionicons 
                                name="add-circle" 
                                size={48} 
                                color="#C62828"
                                style={{
                                    shadowColor: "#C62828",
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowRadius: 10,
                                    shadowOpacity: 0.3
                                }} />
                    }
                },
                Notification: {
                    screen: NotificationScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="notifications" size={24} color={tintColor} />
                    }
                },
                Profile: {
                    screen: ProfileScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="person" size={24} color={tintColor} />
                    }
                }
            },
            {
                defaultNavigationOptions: {
                    tabBarOnPress: ({ navigation, defaultHandler }) => {
                        if (navigation.state.key === "Post") {
                            navigation.navigate("postModal")
                        } else {
                            defaultHandler()
                        }
                    }
                },
                tabBarOptions: {
                    activeTintColor: "#C62828",
                    inactiveTintColor: "#BBBBC4",
                    showLabel: false
                }
            }
        ),
        postModal: {
            screen: PostScreen
        }
    },
    {
        mode: "modal",
        headerMode: "none",
    }
);

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
});

export default createAppContainer(
    createSwitchNavigator(
        {
            Loading: LoadingScreen,
            App: AppContainer,
            Auth: AuthStack
        },
        {
            initialRouteName: "Loading"
        }
    )
)

const styles = StyleSheet.create({

})