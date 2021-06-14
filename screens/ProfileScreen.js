import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import Fire from '../Fire';
import ProfileContainer from '../components/ProfileContainer'
import { FAB, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import Header from '../components/Header';
import UserPostImageGrid from '../components/UserPostImageGrid'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import RBSheet from "react-native-raw-bottom-sheet";

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            name: '',
            avatar: null,
            email: '',
            website: '',
            requests: [],
            posts: [],
            followers: [],
            following: [],
            myPosts: [],
            about: '',
            loading: true
        }
    }

    componentDidMount() {
        const user = this.props.route.params.uid || Fire.shared.uid;

        this.setState({ uid: user },
            () => this.getUserData())
    }

    getUserData = () => {
        Fire.shared
            .firestore
            .collection('users')
            .doc(this.state.uid)
            .onSnapshot((snap) => {
                this.setState({
                    name: snap.data().name,
                    avatar: snap.data().avatar,
                    email: snap.data().email,
                    website: snap.data().website,
                    followers: snap.data().followers,
                    following: snap.data().following,
                    about: snap.data().about,
                    requests: snap.data().requests
                })

                this.getMyPosts()
            })
    }

    getMyPosts = () => {
        Fire.shared
            .firestore
            .collection('posts')
            .where('userId', '==', this.state.uid)
            .get()
                .then((posts) => {
                    let p = []
                    posts.docs.map((post) => {
                        p.push({ ...post.data(), ...{ postId: post.id } })
                    })
                    this.setState({ myPosts: p, loading: false })
                })
    }

    render() {
        switch (this.state.loading) {
            case false:
                return (
                    <View style={styles.profileScreen} >

                        <Header
                            title={'My Profile'}
                            LeftIcon={
                                <TouchableRipple
                                    onPress={() => this.props.navigation.goBack()}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <MaterialCommunityIcons
                                        name='arrow-left'
                                        color='#303233'
                                        size={30}
                                    />
                                </TouchableRipple>
                            }
                            RightIcon={
                                <TouchableRipple
                                    onPress={() => this.RBSheet.open()}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <Entypo
                                        name='dots-two-vertical'
                                        color='#9da5b7'
                                        size={30}
                                    />
                                </TouchableRipple>
                            }
                        />
                        <ScrollView>
                            <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
                                <ProfileContainer
                                    avatar={this.state.avatar}
                                    uid={Fire.shared.uid}
                                    name={this.state.name}
                                    navigation={this.props.navigation}
                                    followers={this.state.followers}
                                    following={this.state.following}
                                    posts={this.state.myPosts}
                                    website={this.state.website}
                                    propsid={this.props.route.params.uid}
                                    about={this.state.about}
                                    myprofile={this.state.uid === Fire.shared.uid}
                                    requests={this.state.requests}
                                />
                            </View>
                            <UserPostImageGrid
                                userName={this.state.name}
                                userAvatar={this.state.avatar}
                                myPosts={this.state.myPosts}
                                navigation={this.props.navigation}
                            />
                        </ScrollView>
                        <RBSheet
                            ref={ref => {
                                this.RBSheet = ref;
                            }}
                            height={150}
                            openDuration={250}
                            customStyles={{
                                container: {
                                    justifyContent: 'space-evenly',

                                }
                            }}
                        >
                            <TouchableRipple
                                onPress={() => Fire.shared.signOut()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                                style={styles.bottomButtons}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }} >
                                    <AntDesign
                                        name='logout'
                                        color='#ff0000'
                                        size={30}
                                    />
                                    <Text style={{ marginLeft: 15, color: '#23395D' }} >Sign Out</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={() => this.RBSheet.close()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                                style={styles.bottomButtons}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }} >
                                    <Entypo
                                        name='cross'
                                        color='#303233'
                                        size={30}
                                    />
                                    <Text style={{ marginLeft: 15, color: '#23395D' }} >Close</Text>
                                </View>
                            </TouchableRipple>
                        </RBSheet>
                        { this.props.route.params.uid === undefined || this.props.route.params.uid === Fire.shared.uid ?
                            <FAB
                                style={styles.fab}
                                icon="pencil"
                                onPress={() => this.props.navigation.push('EditProfileScreen', {
                                    uid: this.state.uid,
                                    name: this.state.name,
                                    avatar: this.state.avatar,
                                    email: this.state.email,
                                    about: this.state.about,
                                    website: this.state.website

                                })}
                            /> :
                            null}
                    </View>
                );
            default:
                return <View style={styles.loading} >
                    <ActivityIndicator size='large' color='#303233' />
                </View>
            }
        }
    }

const styles = StyleSheet.create({
    profileScreen: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#FFF'

    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#23395D'
    },
})

//     render() {
//         return (
//             <View style={styles.container}>
//                 <View style={{ marginTop: 64, alignItems: "center" }}>
//                     <View style={styles.avatarContainer}>
//                         <Image 
//                             style={styles.avatar} 
//                             source={
//                                 this.state.user.avatar 
//                                     ? {uri: this.state.user.avatar} 
//                                     : require("../assets/tempAvatar.jpg")
//                             }
//                         />
//                     </View>
//                     <Text style={styles.name}>{this.state.user.name}</Text>
//                 </View>
//                 <View style={styles.statsContainer}>
//                     <View style={styles.stats}>
//                         <Text style={styles.statAmount}>22</Text>
//                         <Text style={styles.statTitle}>Posts</Text>
//                     </View>
//                     <View style={styles.stats}>
//                         <Text style={styles.statAmount}>14990</Text>
//                         <Text style={styles.statTitle}>Followers</Text>
//                     </View>
//                     <View style={styles.stats}>
//                         <Text style={styles.statAmount}>48</Text>
//                         <Text style={styles.statTitle}>Following</Text>
//                     </View>
//                 </View>
//                 <Button 
//                     onPress={() => {
//                         Fire.shared.signOut();
//                         }} 
//                         title="Sign Out" 
//                 />
//             </View>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     avatarContainer: {
//         shadowColor: "#151734",
//         shadowRadius: 30,
//         shadowOpacity: 0,
//     },
//     avatar: {
//         width: 136,
//         height: 136,
//         borderRadius: 68
//     },
//     name: {
//         marginTop: 24,
//         fontSize: 16,
//         fontWeight: "bold"
//     },
//     statsContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         margin: 32
//     },
//     stats: {
//         alignItems: "center",
//         flex: 1
//     },
//     statAmount: {
//         color: "#4F566D",
//         fontSize: 18,
//         fontWeight: "bold"
//     },
//     statTitle: {
//         color: "#C3C5CD",
//         fontSize: 12,
//         fontWeight: "bold",
//         marginTop: 4
//     }
// })