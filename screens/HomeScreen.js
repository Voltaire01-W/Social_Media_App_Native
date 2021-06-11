 import React, { Component } from 'react';
 import {
    View,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet
} from "react-native";
import Fire from '../Fire'
import { Ionicons } from "@expo/vector-icons";
import Header from '../components/Header'
import moment from 'moment'
import PostCard from '../components/PostCard'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TouchableRipple } from "react-native-paper";

let onEndReachedCalledDuringMomentum = false;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: Fire.shared.uid,
            isLoading: null,
            moreLoading: null,
            lastDoc: [],
            posts: [],
            myFollowing: []
        }
    }

    componentDidMount() {
        this.getFollowing();
    }

    getFollowing = () => {
        this.setState({ isLoading: true });
        Fire.shared
            .firestore
            .collection('users')
            .doc(Fire.shared.uid)
            .get()
                .then((snap) => this.setState({ myFollowing: snap.data().following }))
                .then(() => this.getPosts())
    }

    getPosts = async () => {
        this.setState({ isLoading: true });
        const snapshot = await Fire.shared
                                    .firestore
                                    .collection('posts')
                                    .orderBy('timestamp', 'desc')
                                    .limit(10)
                                    .get();
        if (!snapshot.empty) {
            let newPosts = [];
            this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

            for (let i = 0; i < snapshot.docs.length; i++) {
                let userData = {}
                console.log(snapshot.docs[i].data().userId)

                if (this.state.myFollowing.includes(snapshot.docs[i].data().userId) || 
                    snapshot.docs[i].data().userId === Fire.shared.uid) {
                    Fire.shared
                        .firestore
                        .collection('users')
                        .doc(snapshot.docs[i].data().userId)
                        .get()
                            .then(snap => userData = snap.data())
                            .then(() => {
                                newPosts.push({ ...snapshot.docs[i].data(), ...userData, ...{ postId: snapshot.docs[i].id } });
                            })
                }
            }

            this.setState({ posts: newPosts })
        } else {
            this.setState({ lastDoc: null })
        }
        setTimeout(() => this.setState({ isLoading: false }), 1200)
    }

    getMore = async () => {
        if (this.state.lastDoc) {
            this.setState({ moreLoading: true });

            setTimeout(async () => {
                let snapshot = await Fire.shared
                                        .firestore
                                        .collection('posts')
                                        .orderBy('timestamp', 'desc')
                                        .startAfter(this.state.lastDoc.data().uid)
                                        .limit(10)
                                        .get();
                if (!snapshot.empty) {
                    let newPosts = this.state.posts;

                    this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

                    for (let i = 0; i < snapshot.docs.length; i++) {
                        let userData = {}

                        if (this.state.myFollowing.includes(snapshot.docs[i].data().userId) || 
                            snapshot.docs[i].data().userId === Fire.shared.uid) {
                                Fire.shared
                                    .firestore
                                    .collection('users')
                                    .doc(snapshot.docs[i].data().userId)
                                    .get()
                                        .then(snap => userData = snap.data())
                                        .then(() => {
                                            newPosts.push({ ...snapshot.docs[i].data(), ...userData, ...{ postId: snapshot.docs[i].id } });
                                        })
                            }
                    }

                    this.setState({ posts: newPosts })
                    if (snapshot.docs.length < 10) this.setState({ lastDoc: null });
                } else {
                    this.setState({ lastDoc: null });
                }

                this.setState({ moreLoading: false });
            }, 1000);
        }

        onEndReachedCalledDuringMomentum = true;
    }

    onRefresh = () => {
        setTimeout(() => {
            this.getPosts();
        }, 1000);
    }

    renderFooter = () => {
        if (!this.state.moreLoading) return true;

        return (
            <ActivityIndicator 
                size="large"
                color={'#D83E64'}
                style={{ marginBottom: 10 }}
            />
        )
    }

    render() {
        return (
            <View style={{ flex: 1,backgroundColor:'#FFF' }}>
             <StatusBar barStyle='light-content' hidden={false} backgroundColor='#C62828' translucent={false} />
                <Header
                    title={'Firebird'}
                    LeftIcon={<MaterialIcons
                        name='keyboard-arrow-left'
                        color='#000'
                        size={30}
                    />}
                    RightIcon={
                        <TouchableRipple
                            onPress={() => this.props.navigation.push('MessageScreen')}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <Entypo
                                name='chat'
                                color='#000'
                                size={30}
                            />
                        </TouchableRipple>
                    }
                />
                <FlatList
                    vertical
                    showsVerticalScrollIndicator={false}
                    data={this.state.posts}
                    keyExtractor={item => item.timestamp.toString()}
                    renderItem={({ item }) =>
                        <PostCard
                            userName={item.name}
                            userAvatar={item.avatar}
                            postId={item.postId}
                            userId={this.state.uid}
                            postImageUrl={item.image}
                            postDescription={item.description}
                            postLikes={item.likes}
                            postComments={item.comments}
                        />
                    }
                    ListFooterComponent={this.renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.onRefresh}
                        />
                    }
                    initialNumToRender={2}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum && !this.state.isLoading) {
                            this.getMore();
                        }
                    }
                    }

                    ListEmptyComponent={<View style={{ alignItems:'center', justifyContent:'center' }} >
                    <Image  style={{ resizeMode:'center', height: windowHeight, width: windowWidth }} source={require('../assets/images/empty.png')}></Image>
                </View>}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFECF4"
    },
    header: {
        paddingTop: 64,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: {height: 5},
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#454D65",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    }
})