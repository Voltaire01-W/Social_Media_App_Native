import React, { Component } from 'react';
import { View, TextInput, StyleSheet, ScrollView, ActivityIndicator,Dimensions,Image } from 'react-native';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { TouchableRipple } from "react-native-paper";
import ExploreScreen from './ExploreScreen';
import Fire from '../Fire';
import UserListItem from '../components/UserListItem'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class MessagesScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            messagesData: [],
            chatsData: [],

            name: '',
            users: [],
            searchLoading: false,

            chatModal: false,
            chatId: '',
            userName: '',
            userAvatar: '',
            chatUid: '',

            loading: false,
            bgColor: '#FFF'

        }
    }

    componentDidMount() {
        this.getMessages()
    }



    getMessages = () => {
        this.setState({ loading: true })
        let data = []
        Fire.shared.firestore.collection('users').doc(Fire.shared.uid).onSnapshot((snap) => {
            data = snap.data().chats
            this.setState({ bgColor: snap.data().bgColor })
            if (data) {
                this.getLastMessage(data)
            }
            else {
                this.setState({ loading: false })
            }
        })
    }

    getLastMessage = (data) => {
        let chats = data
        chats.map((chat) => {
            Fire.shared.firestore.collection('chats').doc(chat.chatId).onSnapshot((snap) => {
                if (typeof snap.data().messages !== 'undefined') {
                    console.log(chat.chatId, snap.data())
                    chat['lastMessage'] = snap.data().messages[snap.data().messages.length - 1].message
                    chat['seen'] = snap.data().messages[snap.data().messages.length - 1].seen
                    chat['blocked'] = snap.data().blocked
                    chat['blockId'] = snap.data().blockId
                    chat['typing'] = snap.data().typing
                }
                if (chats.indexOf(chat) === chats.length - 1) {
                    this.getMessageData(chats)
                }
            })
        })
    }



    getMessageData = (data) => {
        let userData = []
        data.map(async (d) => {
            await Fire.shared.firestore.collection('users').doc(d.uid).get()
                .then((snap) => {
                    userData.push({
                        name: snap.data().name,
                        uid: d.uid,
                        avatar: snap.data().avatar,
                        lastMessage: d.lastMessage,
                        seenUid: d.uid,
                        chatId: d.chatId,
                        blocked: d.blocked,
                        blockId: d.blockId,
                        typing: d.typing
                    })
                })
            if (data.indexOf(d) === data.length - 1) {
                this.setState({
                    chatsData: userData,
                    loading: false
                })
            }
        })
    }

    searchUser = (val) => {
        console.log('searching for ', val, this.state.users)
        this.setState({ name: val }, () => {
            if (this.state.name.length) {
                this.fetchUser()
            }
            else {
                this.setState({ users: [] })
            }
        })
    }
    fetchUser = () => {
        this.setState({ searchLoading: true })
        console.log(this.state.name)
        let myid = Fire.shared.uid
        Fire.shared
            .firestore
            .collection('users')
            .orderBy('name')
            .startAt(this.state.name.trim().toLowerCase())
            .endAt(this.state.name.trim().toLowerCase() + '\uf8ff')
            .get()
            .then((snap) => {
                let userData = []
                snap.docs.map((data) => {


                    if (data.id !== myid) {

                        userData.push({ ...data.data(), ...{ uid: data.id } })
                    }
                })
                this.setState({ users: userData, searchLoading: false })
            })
    }

    findUid = (uid) => {
        this.state.chatsData.map((data) => {
            if (data.uid === uid) {
                return true
            }
        })
        return false
    }

    navigateChatScreen = (data) => {

        let found = false
        let findUid = data.uid
        let chatId = undefined
        let blocked = false
        let blockId =
            this.state.chatsData.map((data) => {
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
        switch (this.state.loading) {
            case false:
                return (
                    <View style={styles.messagesScreen}>
                        <Header
                            title={'Messages'}
                            LeftIcon={
                                <TouchableRipple
                                    onPress={() => this.props.navigation.goBack()}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <MaterialIcons
                                        name='keyboard-arrow-left'
                                        color='#000'
                                        size={30}
                                    />
                                </TouchableRipple>}
                            RightIcon={
                                <Entypo

                                    name='chat'
                                    color='#000'
                                    size={30}
                                />
                            }
                        />
                        <View>
                            <View style={styles.searchBar} >
                                <TextInput
                                    placeholder={'search user'}
                                    value={this.state.name}
                                    onChangeText={(val) => this.searchUser(val)}

                                />
                                {this.state.searchLoading ?
                                    <ActivityIndicator size='small' color='#7d86f8' />
                                    :
                                    <TouchableRipple
                                        onPress={() => console.log('Pressed')}
                                        rippleColor="rgba(0, 0, 0, .32)"
                                        borderless={true}
                                    >
                                        <MaterialCommunityIcons
                                            name='account-search-outline'
                                            size={24}
                                            color={"#222222"}
                                        />
                                    </TouchableRipple>}
                            </View>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                {this.state.users.map((user) => (
                                    <TouchableRipple
                                        onPress={() => this.navigateChatScreen(user)}
                                        rippleColor="rgba(0, 0, 0, .32)"

                                    >
                                        <UserListItem
                                            name={user.name}
                                            avatar={user.avatar}
                                            followers={user.followers.length}
                                        />
                                    </TouchableRipple>
                                ))}
                            </ScrollView>
                        </View>

                        {this.state.chatsData.length == 0 && this.state.users.length == 0 ? 
                            <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                    <Image  style={{ resizeMode:'center', height: windowHeight, width: windowWidth }} source={require('../assets/images/message.png')}></Image>
                </View>
                        :null}
                        {this.state.chatsData.map((data) => (
                            <TouchableRipple
                                onPress={() => this.props.navigation.push('ChatScreen', { name: data.name, uid: data.uid, avatar: data.avatar, chatId: data.chatId, blocked: data.blocked, blockId: data.blockId, typing: data.typing, bgColor: this.state.bgColor })}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <UserListItem
                                    name={data.name}
                                    avatar={data.avatar}
                                    chat
                                    typing={data.typing.length > 0 ? true : false}
                                    seen={data.seen}
                                    lastMessage={data.lastMessage}
                                />
                            </TouchableRipple>
                        ))}
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
    searchBar: {
        marginTop: 10,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderColor: '#9da5b7'
    },
    messagesScreen: {
        flex: 1,
        backgroundColor: '#FFF'
    },

    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    }
})