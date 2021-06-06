import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image } from 'react-native';

export default class ProfileScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Profile Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})