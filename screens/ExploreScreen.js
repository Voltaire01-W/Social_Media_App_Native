import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native';

export default class ExploreScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Explore Screen</Text>
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