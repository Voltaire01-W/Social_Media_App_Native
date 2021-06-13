import React, { Component } from 'react'
import { View, Image, TextInput, StyleSheet, ActivityIndicator, Dimensions, FlatList } from 'react-native'
import Fire from '../Fire';
import { TouchableRipple } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import UserListItem from '../components/UserListItem';
import Header from '../components/Header'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class ExploreScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            users: [],
            loading: false
        }
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
        this.setState({ loading: true })
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
                console.log(userData)
                this.setState({ users: userData, loading: false })
            })
    }
    render() {
        return (
            <View style={{ backgroundColor:'#FFF', flex:1 }}>
                <Header
                    title={'Explore '}
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
                <View style={styles.searchBar} >
                    <TextInput
                        placeholder={'Search User'}
                        value={this.state.name}
                        onChangeText={(val) => this.searchUser(val)}

                    />
                    {this.state.loading ?
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
                <FlatList
                    vertical
                    showsVerticalScrollIndicator={false}
                    data={this.state.users}
                    keyExtractor={item => item.uid.toString()} 
                    renderItem={({ item }) => <TouchableRipple
                            onPress={this.props.chat ? () => this.props.navigation.push('ChatScreen', { name: item.name, avatar: item.avatar, uid: item.uid }) : () => this.props.navigation.push('ProfileScreen', { uid: item.uid })}
                            rippleColor="rgba(0, 0, 0, .32)"
                            style={{ backgroundColor:'#FFF' }}
                        >
                            <UserListItem
                                name={item.name}
                                avatar={item.avatar}
                                followers={item.followers.length}
                            />
                        </TouchableRipple>}

                    ListEmptyComponent={<View style={{ alignItems:'center', justifyContent:'center' }} >
                    <Image  style={{ resizeMode:'center', height: windowHeight, width: windowWidth }} source={require('../assets/images/profile_search.png')}></Image>
                </View>}

                    />
            </View>
        );
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

})