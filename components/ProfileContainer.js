import React, { useCallback, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Linking,
    Button,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import { Avatar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Fire from "../Fire";


const ProfileSection = ({ count, title }) => {
    return (
        <View style={styles.profileSection}>
            <View style={{ marginLeft: 5, alignItems: 'center' }}>
                <Text style={[styles.profileSectionText, { color: '#303233', fontWeight: 'bold' }]}>{count}</Text>
                <Text style={styles.profileSectionText}>{title}</Text>
            </View>
        </View>
    );
}

const ProfileContainer = ({ uid, name, avatar, myprofile, followers, following, about, website, requests, propsid, navigation }) => {

    const [loading, setLoading] = useState(false);

    const OpenURLButton = ({ url }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);
            console.log(supported)
            if (supported) {
                await Linking.openURL(website);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <Text style={{ color: '#7d86f8' }} onPress={handlePress} >{website}</Text>
    };


    const FollowUnfollow = () => {
        if (myprofile) return null

        else if (following.includes(uid) && followers.includes(uid)) {
            return <View style={{ flexDirection: "row" }} >
                <TouchableOpacity
                    onPress={() => unfollowPress()}
                    style={[styles.profileButton, { backgroundColor: '#FFF', borderColor: '#FF0000', borderWidth: 1 }]} >
                    {loading ? <ActivityIndicator size='small' color='#FF0000' />
                        : <Text style={styles.profileButtonText, { color: '#FF0000' }} >Unfollow</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity style={[styles.profileButton, { backgroundColor: '#FFF', borderColor: '#303233', borderWidth: 1, marginLeft: 10 }]} >
                    <Text style={[styles.profileButtonText, { color: '#303233' }]} >Message</Text>
                </TouchableOpacity>
            </View>
        }

        else if (followers.includes(uid)) {
            return <TouchableOpacity
                onPress={() => unfollowPress()}
                style={[styles.profileButton, { backgroundColor: '#FFF', borderColor: '#FF0000', borderWidth: 1 }]} >
                {loading ? <ActivityIndicator size='small' color='#FF0000' />
                    : <Text style={styles.profileButtonText} >Unfollow</Text>
                }
            </TouchableOpacity>
        }

        else if (following.includes(uid)) {
            return <TouchableOpacity
                onPress={() => followBackPress()}
                style={[styles.profileButton, { width: '70%', alignItems: 'center' }]} >
                {loading ? <ActivityIndicator size='small' color='#FFF' />
                    : <Text style={styles.profileButtonText} >Follow Back</Text>
                }
            </TouchableOpacity>
        }

        else if (requests.includes(uid)) {
            return <TouchableOpacity 
            style={[styles.profileButton, { width: '70%', alignItems: 'center' }]} 
            onPress={() => requestWithdraw()}
            >
                <Text style={styles.profileButtonText} >Requested</Text>
            </TouchableOpacity>
        }

        else {
            return <TouchableOpacity
                onPress={() => followPress()}
                style={[styles.profileButton, { width: '70%', alignItems: 'center' }]} >
                {loading ? <ActivityIndicator size='small' color='#FFF' />
                    : <Text style={styles.profileButtonText} >Follow</Text>
                }
            </TouchableOpacity>
        }
    }

    const followPress = () => {
        setLoading(true)
        Fire.shared.firestore.collection('users').doc(propsid).update({
            requests: Fire.shared.firestore.FieldValue.arrayUnion(uid)
        }).then(() => {
            Toast.show({
                text1: 'request sent',
                type:'success',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            setLoading(false)
        });
    }

    const requestWithdraw = () => {
        setLoading(true)
        Fire.shared.firestore.collection('userDetails').doc(propsid).update({
            requests: Fire.shared.firestore.FieldValue.arrayRemove(uid)
        }).then(() => {
            Toast.show({
                text1: 'request withdrawn',
                type:'success',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            setLoading(false)
        });
    }

    const followBackPress = () => {
        setLoading(true)
        Fire.shared.firestore.collection('users').doc(uid).update({
            following: Fire.shared.firestore.FieldValue.arrayUnion(propsid)
        })
            .then(() => firestore().collection('users').doc(propsid).update({
                followers: Fire.shared.firestore.FieldValue.arrayUnion(uid)
            }))
            .then(() => setLoading(false));
    }

    const unfollowPress = () => {
        setLoading(true)
        firestore().collection('users').doc(uid).update({
            following: Fire.shared.firestore.FieldValue.arrayRemove(propsid)
        })
            .then(() => firestore().collection('users').doc(propsid).update({
                followers: Fire.shared.firestore.FieldValue.arrayRemove(uid)
            }))
            .then(() => setLoading(false));
    }

    return (
        <View
            style={styles.profile}
        >
            <View style={styles.profileTop} >
                <Avatar.Image size={80} source={{ uri: avatar }} />

                <View style={{ flex: 0.8, alignItems: 'center' }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#303233', marginTop: 5 }}>{name}</Text>
                    <Text style={{ fontSize: 12, color: '#9da5b7' }}>@{name}</Text>

                    <FollowUnfollow />
                </View>
            </View>
            <View style={styles.profileAbout}>
                <OpenURLButton url={website}></OpenURLButton>
                <Text style={{ color: '#9da5b7', fontSize: 12, marginTop: 5 }}>
                    {about}
                </Text>
            </View>
            <View style={styles.profileBottom}>
                <TouchableOpacity
                    onPress={() => navigation.push('FollowerScreen', { data: followers, navigation: navigation, title: 'Followers' })}
                >
                    <ProfileSection
                        count={followers.length}
                        title={'Followers'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.push('FollowerScreen', { data: following, navigation: navigation, title: 'Following' })}
                >
                    <ProfileSection
                        count={following.length}
                        title={'Following'}
                    />
                </TouchableOpacity>
            </View>
        </View>

    );
}

export default ProfileContainer;

const styles = StyleSheet.create({

    profile: {
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: '#FFF',
        width: '100%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,

    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around'
    },
    profileAbout: {
        padding: 10,
        marginTop: 15,
        width: '100%'
    },
    profileSection: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    profileSectionText: {
        color: '#9da5b7',
        fontSize: 12,
        fontWeight: '100'
    },
    profileBottom: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    profileButton: {
        borderRadius: 20,
        backgroundColor: '#7d86f8',
        padding: 5,
        paddingHorizontal: 15,
        marginTop: 10
    },
    profileButtonText: {
        color: '#FFF',
        fontWeight: 'bold'
    }

})