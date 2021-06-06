import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import Fire from '../Fire';


export default class ProfileScreen extends Component {
    state = {
        user: {}
    };

    unsubscribe = null;

    componentDidMount() {
        const user = this.props.uid || Fire.shared.uid

        this.unsubscribe = Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ user: doc.data() });
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginTop: 64, alignItems: "center" }}>
                    <View style={styles.avatarContainer}>
                        <Image 
                            style={styles.avatar} 
                            source={
                                this.state.user.avatar 
                                    ? {uri: this.state.user.avatar} 
                                    : require("../assets/tempAvatar.jpg")
                            }
                        />
                    </View>
                    <Text style={styles.name}>{this.state.user.name}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.stats}>
                        <Text style={styles.statAmount}>22</Text>
                        <Text style={styles.statTitle}>Posts</Text>
                    </View>
                    <View style={styles.stats}>
                        <Text style={styles.statAmount}>14990</Text>
                        <Text style={styles.statTitle}>Followers</Text>
                    </View>
                    <View style={styles.stats}>
                        <Text style={styles.statAmount}>48</Text>
                        <Text style={styles.statTitle}>Following</Text>
                    </View>
                </View>
                <Button 
                    onPress={() => {
                        Fire.shared.signOut();
                        }} 
                        title="Sign Out" 
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatarContainer: {
        shadowColor: "#151734",
        shadowRadius: 30,
        shadowOpacity: 0,
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius: 68
    },
    name: {
        marginTop: 24,
        fontSize: 16,
        fontWeight: "bold"
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 32
    },
    stats: {
        alignItems: "center",
        flex: 1
    },
    statAmount: {
        color: "#4F566D",
        fontSize: 18,
        fontWeight: "bold"
    },
    statTitle: {
        color: "#C3C5CD",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 4
    }
})