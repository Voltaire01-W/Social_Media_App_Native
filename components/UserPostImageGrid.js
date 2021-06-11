import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { Avatar, TouchableRipple } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LikeComment = ({ like, comment }) => {
    return (
        <View style={styles.postInfo} >
            <>
                {like ? <AntDesign
                    name='heart'
                    color='#000'
                    size={15}
                /> :
                    <AntDesign
                        name='hearto'
                        color='#000'
                        size={15}
                    />}
                <Text>{like}</Text>
            </>
            <>
                <EvilIcons
                    name='comment'
                    color='#000'
                    size={20}
                    style={{ marginLeft: 10 }}
                />
                <Text>{comment}</Text>
            </>
        </View>
    )
}

const MyPostComponent = ({ image, likes, comments, description }) => {
    return (
        <View style={styles.myPost} >
            {typeof image === 'undefined' ?
                <>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', flex: 1, padding: 5 }} >
                        <Text>
                            {description.slice(0, 85)}...
            </Text>
                    </View>
                    <LikeComment
                        like={likes}
                        comment={comments} />
                </>
                :
                <ImageBackground
                    source={{ uri: image }}
                    style={{
                        flex: 1,
                        resizeMode: "cover",
                        justifyContent: 'flex-end',
                        backgroundColor: 20,


                    }}
                >
                    <LikeComment
                        like={likes}
                        comment={comments} />
                </ImageBackground>}

        </View>
    );
}


export default class UserPostImageGrid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            myPosts: this.props.myPosts
        }
    }


    render() {
        return (
            <SafeAreaView>
                <FlatList
                    style={{ marginTop: 20 }}
                    numColumns={3}
                    data={this.state.myPosts}
                    // keyExtractor={item => item.uid.toString()}
                    renderItem={({ item }) =>
                        <TouchableRipple
                            onPress={() => this.props.navigation.push('PostDetailScreen', { postData: item, userName: this.props.userName, userAvatar: this.props.userAvatar })}
                            borderless={true}

                        >
                            <MyPostComponent
                                image={item.image}
                                description={item.description}
                                likes={item.likes.length}
                                comments={item.comments.length}
                            />
                        </TouchableRipple>
                    }
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    myPost: {
        borderRadius: 20,
        height: windowHeight * 0.2,
        width: windowWidth * 0.3,
        marginLeft: (windowWidth * 0.1) / 4,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#d4d4d4',

    },
    postInfo: {
        backgroundColor: '#FFF',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'

    }
})