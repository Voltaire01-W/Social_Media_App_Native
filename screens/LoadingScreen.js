import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class LoadingScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Loading Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})