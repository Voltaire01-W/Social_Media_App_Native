import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ToastAndroid
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { TouchableRipple, ActivityIndicator, Avatar } from 'react-native-paper';
import Header from '../components/Header';
import Fire from '../Fire';
import Toast from 'react-native-toast-message';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class RequestScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            requestsData: [],
            uid: Fire.shared.uid,
            requests: this.props.data,
            chats: this.props.chats,
            bgColor: this.props.bgColor
        }
    }

    componentDidMount() {
        console.log(this.state.requests)
        this.getRequestsData()
    }

    getRequestsData = async () => {
        let data = []
        this.state.requests.map(async (request) => {
            await Fire.shared
                      .firestore
                      .collection('users')
                      .doc(request)
                      .get()
                        .then((snap) => {
                            data.push({
                                name: snap.data().name,
                                avatar: snap.data().avatar,
                                uid: request,
                                followers: snap.data().followers,
                                following: snap.data().following
                            })
                    console.log('data=>>>', data)
                })

            if (this.state.requests.indexOf(request) === this.state.requests.length - 1) {
                this.setState({
                    requestsData: data,
                    loading: false
                })

            }
        })
    }

    deletePress = (id, remove) => {
        this.setState({ loading: false })
        console.log(this.state.requestsData, remove)
        const array = this.state.requestsData
        const index = array.indexOf(remove)
        if (index > -1) { array.splice(index, 1) }
        console.log('after delte', this.state.requestsData)

        this.setState({ requestsData: array })
        Fire.shared
            .firestore
            .collection('users')
            .doc(this.state.uid)
            .update({
                requests: firestore.FieldValue.arrayRemove(id)
            })
            .then(() => this.setState({ loading: false }));
    }



    confirmPress = (id) => {
        this.setState({ loading: true })
        Fire.shared.firestore.collection('users').doc(this.state.uid).update({
            followers: Fire.shared.firestore.FieldValue.arrayUnion(id)
        })
            .then(() => Fire.shared.firestore.collection('users').doc(id).update({
                following: Fire.shared.firestore.FieldValue.arrayUnion(this.state.uid)
            }))
            .then(() => this.componentDidMount());
    }

    followBackPress = (id, remove) => {
        this.setState({ loading: true })
        Fire.shared.firestore.collection('users').doc(this.state.uid).update({
            following: firestore.FieldValue.arrayUnion(id)
        })
            .then(() => Fire.shared.firestore.collection('users').doc(id).update({
                followers: firestore.FieldValue.arrayUnion(this.state.uid)
            }))
            .then(() => this.deletePress(id, remove));
    }

    onSwipeUp(gestureState, uid, item) {
        if (item.following.includes(this.state.uid)) {
            this.followBackPress(item.uid, item)
        }
        else {
            this.confirmPress(uid)
        }

    }

    onSwipeDown(gestureState, item) {
        this.deletePress(item.uid, item)
    }

    navigateToChat = (data) => {
        let found = false
        let findUid = data.uid
        let chatId = undefined
        let blocked = false
        let blockId =
            this.state.chats.map((data) => {
                if (data.uid === findUid) {
                    found = true
                    chatId = data.chatId
                    blocked = data.blocked
                    blockId = data.blockId
                }
            })

        if (found) {
            console.log('found', chatId)
            this.props.navigation.push('ChatScreen', { name: data.name, avatar: data.avatar, uid: data.uid, chatId: chatId, blocked: blocked, blockId: blockId, typing: [], bgColor: this.state.bgColor })
        }
        else {
            console.log('not found')
            this.props.navigation.push('ChatScreen', { name: data.name, avatar: data.avatar, uid: data.uid, blocked: false, blockId: [], typing: [], bgColor: this.state.bgColor })
        }
    }


    render() {

        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (
            <>
                <Header
                    title={'Follow Requests'}
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
                    RightIcon={<Entypo
                        name='dots-two-vertical'
                        color='#303233'
                        size={30}
                    />}
                />
                <FlatList
                    horizontal
                    style={{ backgroundColor: '#FFF' }}
                    data={this.state.requestsData}
                    keyExtractor={item => item.uid}
                    renderItem={({ item }) => <GestureRecognizer
                        onSwipeUp={(state) => this.onSwipeUp(state, item.uid, item)}
                        onSwipeDown={(state) => this.onSwipeDown(state, item)}
                        config={config}
                        style={{
                            flex: 1,
                            backgroundColor: '#FFF'
                        }}
                    >

                        <ScrollView>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.push('ProfileScreen', { uid: item.uid })}
                                style={{ flex: 1, width: '100%' }}
                            >

                                <View style={styles.UserListItem} >
                                    <Image
                                        style={styles.profileImage}
                                        source={{ uri: item.avatar }} />

                                    <View style={styles.profileName} >

                                        <View style={[styles.profileNameSection, { borderLeftColor: '#FFF' }]} >

                                            <Avatar.Image size={20} source={{ uri: item.avatar }} />
                                            <Text style={{ fontWeight: 'bold', color: '#303233' }} >{item.name}</Text>

                                        </View>

                                        <View style={styles.profileNameSection} >

                                            <Text style={[styles.profileSectionText, { color: '#303233', fontWeight: 'bold' }]} > {item.followers.length} </Text>
                                            <Text style={styles.profileSectionText} >Followers</Text>

                                        </View>

                                        <View style={styles.profileNameSection} >

                                            <Text style={[styles.profileSectionText, { color: '#303233', fontWeight: 'bold' }]}  > {item.following.length} </Text>
                                            <Text style={styles.profileSectionText} >Following</Text>

                                        </View>
                                    </View>

                                </View>


                                <View style={styles.bottomButtons} >

                                    {this.state.loading ?
                                        <ActivityIndicator size='small' color='#7d86f8' />
                                        :
                                        <>
                                            {item.following.includes(this.state.uid) ?
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }} >

                                                    <TouchableRipple
                                                        onPress={() => ToastAndroid.show('Swipe Up from bottom to follow back', ToastAndroid.SHORT)}
                                                        rippleColor="rgba(0, 0, 0, .32)"
                                                        style={styles.button} >

                                                        <Fontisto
                                                            name='spinner-rotate-forward'
                                                            color='#ff6666'
                                                            size={40}
                                                        />


                                                    </TouchableRipple>
                                                    <TouchableRipple
                                                        onPress={() => this.navigateToChat(item)}
                                                        rippleColor="rgba(0, 0, 0, .32)"
                                                        borderless={true}
                                                    >
                                                        <Entypo
                                                            name='chat'
                                                            color='#7d86f8'
                                                            size={45}
                                                        />
                                                    </TouchableRipple>
                                                </View>
                                                :
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }} >
                                                    <TouchableRipple
                                                        onPress={() => ToastAndroid.show('Swipe Up from bottom to accept', ToastAndroid.SHORT)}
                                                        rippleColor="rgba(0, 0, 0, .32)"
                                                        style={styles.button}
                                                    >


                                                        <AntDesign
                                                            name='checkcircle'
                                                            color='#1aa260'
                                                            size={40}
                                                        />

                                                    </TouchableRipple>
                                                    <TouchableRipple
                                                        onPress={() => this.navigateToChat(item)}
                                                        rippleColor="rgba(0, 0, 0, .32)"
                                                        borderless={true}
                                                    >
                                                        <Entypo
                                                            name='chat'
                                                            color='#7d86f8'
                                                            size={45}
                                                        />
                                                    </TouchableRipple>
                                                    <TouchableRipple
                                                        onPress={() => ToastAndroid.show('Swipe Down to reject', ToastAndroid.SHORT)}
                                                        rippleColor="rgba(0, 0, 0, .32)"
                                                        style={styles.button}
                                                    >

                                                        <Entypo
                                                            name='circle-with-cross'
                                                            color='#ff0000'
                                                            size={50}
                                                        />


                                                    </TouchableRipple>
                                                </View>}
                                        </>}
                                </View>

                            </TouchableOpacity>
                        </ScrollView>
                    </GestureRecognizer>}

                />

            </>
        );
    }
}

const styles = StyleSheet.create({
    UserListItem: {
        marginTop: 20,
        borderColor: '#f2f2f2',
        borderRadius: 20,
        marginLeft: windowWidth * 0.1,
        marginRight: windowWidth * 0.1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },
    button: {
        paddingHorizontal: 20,
        padding: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#FFF'
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    profileImage: {
        height: windowHeight * 0.5,
        width: windowWidth * 0.8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20

    },
    profileName: {
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    profileNameSection: {
        alignItems: "center",
        borderLeftWidth: 0.5,
        borderLeftColor: '#9da5b7',
        padding: 10
    },
    profileSectionText: {
        color: '#9da5b7',
        fontSize: 12,
        fontWeight: '100'
    },
    bottomButtons: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    }
})