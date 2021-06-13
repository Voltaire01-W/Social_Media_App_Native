import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { FAB, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import Header from '../components/Header';
import Fire from '../Fire';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const FollowRequests = ({ requests }) => {
    if (requests)
        return <View style={styles.followRequests} >
            <View style={styles.followRequestsNumber} >
                <Text style={{ color: '#303233', fontWeight: 'bold', fontSize: 20 }} >{requests}</Text>
            </View>
            <View style={{ marginLeft: 20 }} >
                <Text style={{ fontSize: 15, color: '#303233', fontWeight: 'bold' }} >Follow requests</Text>
                <Text style={{ fontSize: 12, color: '#9da5b7' }} >Accept or ignore...</Text>
            </View>
        </View>
    else return null
}

export default class Notification extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            uid: Fire.shared.uid,
            requests: [],
            chats: [],
            bgColor: '#FFF'
        }
    }

    componentDidMount() {
        this.getRequests()
    }

    getRequests = () => {
        this.setState({ loading: true })
        let req = []
        let chatData = []
        Fire.shared.firestore.collection('users').doc(this.state.uid)
            .onSnapshot((snap) => {
                req = snap.data().requests
                chatData = snap.data().chats
                this.setState({ requests: req, chats: chatData, bgColor: snap.data().bgColor, loading: false })
            })
    }

    render() {
        switch (this.state.loading) {
            case false:
                return (
                    <>
                        <Header
                            title={'Notifications'}
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
                        {this.state.requests.length == 0 ? 
                            <View style={{ backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }} >
                    <Image  style={{ resizeMode: 'center', height: windowHeight, width: windowWidth }} source={require('../assets/images/notification.png')}></Image>
                </View>
                :
                        <TouchableOpacity
                            onPress={() => this.props.navigation.push('RequestScreen', { data: this.state.requests, chats: this.state.chats, bgColor: this.state.bgColor })}
                        >
                            <FollowRequests
                                requests={this.state.requests.length}
                            />
                        </TouchableOpacity>}
                    </>
                );
            default:
                return <View style={styles.loading} >
                    <ActivityIndicator size='large' color='#303233' />
                </View>
        }
    }
}

const styles = StyleSheet.create({
    followRequests: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 0.5,
        borderBottomColor: '#cce1ec',
        backgroundColor: '#FFF',
        padding: 20,
        flexDirection: 'row',

    },
    followRequestsNumber: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderColor: '#303233',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 25
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    }
})