import React from 'react'
import {
    View,
    Text,
    StyleSheet,

} from 'react-native'
import { Avatar } from 'react-native-paper'


const UserListItem = ({ name, avatar, followers, chat, lastMessage, seen, typing }) => {
    return (
        <View style={styles.user} >
            <Avatar.Image size={50} source={{ uri: avatar }} />
            <View style={styles.userData} >
                <Text style={{ fontSize: 15, fontWeight: 'bold' }} >{name}</Text>
                {typeof chat === 'undefined' ?
                    <>
                        {followers ? <Text style={{ color: '#878787', fontSize: 10 }} > followed by {followers} users</Text> :
                            <Text style={{ color: '#878787', fontSize: 10 }} >new user</Text>}
                    </>
                    :
                    <>
                        {typing ?
                            <Text style={{color:'#1aa260'}} >typing...</Text>
                            :
                            <>
                                {!seen ? <Text style={{ color: '#878787', fontSize: 15, fontWeight: 'bold' }} >{typeof lastMessage === 'undefined' ? null : lastMessage.slice(0, 20)}...</Text> :
                                    <Text style={{ color: '#878787', fontSize: 15 }} >{typeof lastMessage === 'undefined' ? null : lastMessage.slice(0, 20)}...</Text>}
                            </>}
                    </>

                }
            </View>
        </View>
    );
}

export default UserListItem;

const styles = StyleSheet.create({
    user: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        padding: 5,
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: '#f2f2f2',
        alignItems: 'center',
        borderRadius: 30
    },
    userData: {
        marginLeft: 15,
        justifyContent: 'space-evenly',

    }
})