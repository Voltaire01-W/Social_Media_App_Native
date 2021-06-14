import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Avatar, TouchableRipple } from "react-native-paper";
import Fire from '../Fire';
import Modal from 'react-native-modal';
import RBSheet from "react-native-raw-bottom-sheet";
import Header from '../components/Header'
import { ColorPicker, fromHsv } from 'react-native-color-picker'

const ChatMessage = ({ message, me, time, seen }) => {
    const color = me ? '#7d86f8' : '#FFF'
    const align = me ? 'flex-end' : 'flex-start'
    const textColor = me ? '#FFF' : '#23395D'
    return (
    <>
        <View style={[styles.message, { backgroundColor: color, alignSelf: align }]} >
            <Text style={{ color: textColor }} >{message}</Text>
            <Text style={{ fontSize: 5, alignSelf: 'flex-end', color: textColor }} >{time.slice(0, 22)}</Text>
        </View>
        <View style={{ alignSelf: 'flex-end', marginLeft: 5, marginRight: 5 }} >
            {seen && me ?
                <Ionicons
                    name='checkmark-done-circle'
                    color='#23395D'
                    size={15}
                /> :
                null
            }
        </View>
    </>
    )
}

export default class ChatScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            chatId: this.props.route.params.chatId,
            blocked: false,
            blockId: [],
            messages: [],
            typing: [],
            textMessage: '',
            colorModal: false,
            saveColorLoading: false,
            bgColor: this.props.route.params.bgColor,
        }
    }


    componentDidMount() {
        this.setState({
            blocked: this.props.route.params.blocked,
            blockId: this.props.route.params.blockId,
        })
        console.log(this.props.route.params.uid)
        if (typeof this.state.chatId !== 'undefined') {
            this.getChats()
        }

    }

    getChats = async () => {
        Fire.shared.firestore.collection('chats').doc(this.state.chatId).onSnapshot((snap) => {
            this.setState({ messages: snap.data().messages, typing: snap.data().typing }, () => console.log(this.state.messages))
            this.updateSeen()
        })
    }

    textInputChange = (val) => {

        this.setState({
            textMessage: val
        })

        if (val.length > 0) {
            Fire.shared.firestore.collection('chats').doc(this.state.chatId).update({
                typing: Fire.shared.firestore.FieldValue.arrayUnion(Fire.shared.uid)
            })
        }
        else {
            this.removeTypingId()
        }


    }

    removeTypingId = () => {
        Fire.shared.firestore.collection('chats').doc(this.state.chatId).update({
            typing: Fire.shared.firestore.FieldValue.arrayRemove(Fire.shared.uid)
        })
    }

    updateSeen = () => {
        let messages = this.state.messages
        let seenFound = false
        messages.map((message) => {
            if (!message.seen && message.uid !== Fire.shared.uid) {
                message['seen'] = true
                seenFound = true
            }
        })
        if (seenFound) {
            this.setState({ messages: messages })
            Fire.shared.firestore.collection('chats').doc(this.state.chatId).update({
                messages: messages
            })
        }
    }

    handleSendMessage = () => {
        this.removeTypingId()
        if (typeof this.state.chatId === 'undefined') {
            let data = this.state.messages
            let newMessage = {
                message: this.state.textMessage,
                seen: false,
                uid: Fire.shared.uid,
                timestamp: Fire.shared.timestamp
            }
            data.push(newMessage)
            this.setState({ messages: data, textMessage: '' })
            this.setNewChatId(newMessage)
        }
        else {
            let data = this.state.messages
            let newMessage = {
                message: this.state.textMessage,
                seen: false,
                uid: Fire.shared.uid,
                timestamp: Fire.shared.timestamp
            }
            data.push(newMessage)
            this.setState({ messages: data, textMessage: '' })

            Fire.shared.firestore.collection('chats').doc(this.state.chatId).update({
                messages: Fire.shared.firestore.FieldValue.arrayUnion(newMessage)
            })
        }
    }

    setNewChatId = (newMessage) => {

        let id = Math.floor((Math.random() * 1000000000)).toString()
        this.setState({ chatId: id }, () => {

            Fire.shared.firestore.collection('chats').doc(id).set({
                messages: [newMessage],
                blocked: false,
                blockId: [],
                typing: []
            }).then(() => Fire.shared.firestore.collection('users').doc(Fire.shared.uid).update({
                chats: Fire.shared.firestore.FieldValue.arrayUnion({
                    uid: this.props.route.params.uid,
                    chatId: this.state.chatId
                })
            })).then(() => Fire.shared.firestore.collection('users').doc(this.props.route.params.uid).update({
                chats: Fire.shared.firestore.FieldValue.arrayUnion({
                    uid: Fire.shared.uid,
                    chatId: this.state.chatId
                })
            }))
            console.log(typeof this.state.chatId)
        })
    }



    blockUser = () => {
        Fire.shared.firestore.collection('chats').doc(this.state.chatId).update({
            blocked: true,
            blockId: Fire.shared.firestore.FieldValue.arrayUnion(Fire.shared.uid)
        }).then(() => {
            let ar = this.state.blockId
            ar.push(Fire.shared.uid)
            this.setState({ blocked: true, blockId: ar })
            this.RBSheet.close()
        })
    }

    unbockUser = () => {

        let blocked = true

        if (this.state.blockId.length === 1 && this.state.blockId.includes(Fire.shared.uid)) {
            blocked = false
        }
        Fire.shared.firestore.collection('chats').doc(this.state.chatId).update({
            blocked: blocked,
            blockId: Fire.shared.firestore.FieldValue.arrayRemove(Fire.shared.uid)
        }).then(() => {
            let ar = this.state.blockId
            ar.splice(ar.indexOf(Fire.shared.uid), 1)
            this.setState({ blocked: blocked, blockId: ar })
            this.RBSheet.close()
        })
    }

    saveColor = (color) => {
        console.log('saved', color, '<<<<====')
        this.setState({ bgColor: color, saveColorLoading: true, colorModal: false })
        this.RBSheet.close()
        Fire.shared.firestore.collection('users').doc(Fire.shared.uid).update({
            bgColor: color
        }).then(() => {
            this.setState({
                saveColorLoading: false,
            })
            this.RBSheet.close()
        })


    }
    render() {

        const ChangeBackgroundColorModal = () => {

            let bgColor = '#FFF'

            return <Modal
                isVisible={this.state.colorModal}
                onBackButtonPress={() => this.props.navigation.goBack()}
                style={{ backgroundColor: '#FFF', margin: 0, justifyContent: 'flex-start' }}
            >
                <Header
                    title={'Change Color'}
                    LeftIcon={
                        <TouchableRipple
                            onPress={() => this.setState({ colorModal: false })}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <MaterialIcons
                                name='keyboard-arrow-left'
                                color='#000'
                                size={30}
                            />
                        </TouchableRipple>

                    }
                    RightIcon={
                        <MaterialIcons
                            name='color-lens'
                            color='#1aa260'
                            size={30}
                        />
                    }
                />
                <View style={{ flex: 0.5, padding: 15, justifyContent: 'space-evenly' }} >
                    <ColorPicker
                        onColorChange={(color) => bgColor = fromHsv(color)}
                        style={{ flex: 1 }}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => this.saveColor(bgColor)}
                    style={{ borderRadius: 20, backgroundColor: '#7d86f8', padding: 10, paddingHorizontal: 20, width: '40%', marginLeft: '30%' }}
                >
                    {this.state.saveColorLoading ?
                        <ActivityIndicator size='small' color='#FFF' />
                        :
                        <Text style={{ color: '#FFF', alignSelf: 'center' }} > Save Color </Text>}
                </TouchableOpacity>
            </Modal>
        }

        return (
            <Modal
                isVisible={true}
                onBackButtonPress={() => this.props.navigation.goBack()}
                style={{ backgroundColor: this.state.bgColor, margin: 0 }}
            >
                <View style={{ flex: 1 }} >

                    <View style={styles.header} >
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
                        </TouchableRipple>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <Avatar.Image size={40} source={{ uri: this.props.route.params.avatar }} />
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#23395D', marginLeft: 10 }} >{this.props.route.params.name}</Text>
                                {this.state.typing.includes(this.props.route.params.uid) ?
                                    <Text style={{ color: '#1aa260' }} >typing...</Text>
                                    :
                                    null}
                            </View>
                        </View>

                        <TouchableRipple
                            onPress={() => this.RBSheet.open()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <Entypo
                                name='dots-two-vertical'
                                color='#303233'
                                size={30}
                            />
                        </TouchableRipple>
                    </View>

                    <ScrollView style={{ flex: 1 }} >
                        {this.state.messages.map((message) => (
                            <ChatMessage
                                message={message.message}
                                time={message.timestamp}
                                seen={message.seen}
                                me={Fire.shared.uid === message.uid}

                            />
                        ))}
                    </ScrollView>

                    {this.state.blocked ?
                        <View style={styles.blockedView} >
                            <Text style={{ color: '#9da5b7' }} >Can't Send message to this user</Text>
                        </View>
                        :
                        <View style={styles.send__message} >
                            <TextInput
                                placeholder="Send message..."
                                multiline={true}
                                value={this.state.textMessage}
                                placeholderTextColor="#666666"
                                autoCapitalize="none"
                                onChangeText={this.textInputChange}
                                style={{ width: '80%'}}
                            />
                            {this.state.textMessage.trim().length ?
                                <TouchableRipple
                                    onPress={() => this.handleSendMessage()}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <FontAwesome
                                        name='send-o'
                                        color='#7d86f8'
                                        size={25}
                                    />
                                </TouchableRipple> :
                                <TouchableRipple
                                    onPress={() => { }}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <FontAwesome
                                        name='send-o'
                                        color='#9da5b7'
                                        size={25}
                                    />
                                </TouchableRipple>}
                        </View>
                    }
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
                        {this.state.blockId.includes(Fire.shared.uid) ?
                            <TouchableRipple
                                onPress={() => this.unbockUser()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                                style={styles.bottomButtons}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                    <Entypo
                                        name='block'
                                        color='#FF0000'
                                        size={30}
                                    />
                                    <Text style={{ marginLeft: 15, color: '#23395D' }} >Unblock</Text>
                                </View>
                            </TouchableRipple>
                            :
                            <TouchableRipple
                                onPress={() => this.blockUser()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                                style={styles.bottomButtons}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                    <Entypo
                                        name='block'
                                        color='#FF0000'
                                        size={30}
                                    />
                                    <Text style={{ marginLeft: 15, color: '#23395D' }} >Block</Text>
                                </View>
                            </TouchableRipple>}
                        <TouchableRipple
                            onPress={() => this.setState({ colorModal: true })}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                            style={styles.bottomButtons}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                <MaterialIcons
                                    name='color-lens'
                                    color='#1aa260'
                                    size={30}
                                />
                                <Text style={{ marginLeft: 15, color: '#23395D' }} >Change BackgroundColor</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple
                            onPress={() => this.RBSheet.close()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                            style={styles.bottomButtons}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                <Entypo
                                    name='cross'
                                    color='#303233'
                                    size={30}
                                />
                                <Text style={{ marginLeft: 15, color: '#23395D' }} >Close</Text>
                            </View>
                        </TouchableRipple>
                    </RBSheet>
                </View>
                <ChangeBackgroundColorModal />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,

        elevation: 13,
    },
    message: {
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 5,
        marginRight: 5,
        marginLeft: 5,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    comment__section: {
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#666',
        borderBottomWidth: 0.5,
        padding: 5
    },
    send__message: {
        borderTopColor: '#666',
        backgroundColor:'#FFF',
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        padding: 10,
        width: '100%',
    },
    blockedView: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#d6dbe0'
    },
    bottomButtons: {
        padding: 15
    }
})