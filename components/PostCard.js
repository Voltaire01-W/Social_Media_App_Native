import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    Dimensions

} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Avatar, TouchableRipple } from 'react-native-paper';
import Comments from './Comments'
import Modal from 'react-native-modal';
import Fire from '../Fire';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class PostCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: false,
            likes: this.props.postLikes,
            comments: this.props.postComments,
            commentsModal: false
        }
    }

    handleExpand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }

    handleLike = () => {
        // Handle Unlike if statement
        if (this.state.likes.includes(this.props.userId)) {
            let id = this.props.userId

            let likeArray = this.state.likes.filter((item) => {
                return item !== id
            })
            this.setState({ likes: likeArray },
                () => Fire.shared.firestore.collection('posts').doc(this.props.postId).update({
                    likes: this.state.likes
                })
                .then(() => console.log('Unliked')))
        // Handle Like else statement
        } else {
            let likes = this.state.likes
            likes.push(this.props.userId)
            this.setState({ likes: likes },
                () => Fire.shared.firestore.collection('posts').doc(this.props.postId).update({
                    likes: this.state.likes
                }).then(() => console.log('liked')))
        }
    }

    handleComments = () => {
        this.setState({ commentsModal: true })
    }

    onBack = () => {
        this.setState({ commentsModal: false })
    }

    render() {

        const CommentModal = () => {
            return (
                <View>
                    <Modal
                        isVisible={this.state.commentsModal}
                        style={{ margin: 0, backgroundColor: '#FFF' }}
                        onBackButtonPress={() => this.onBack()}
                    >
                        <Comments 
                            postComments={this.state.comments}
                            postId={this.props.postId}
                            LeftIcon={<TouchableRipple
                                onPress={() => this.onBack()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <MaterialIcons 
                                    name="keyboard-arrow-left"
                                    color="#000"
                                    size={30}
                                />
                            </TouchableRipple>}
                        />
                    </Modal>
                </View>
            )
        }
        return (
            <View style={styles.post}>
                <View style={styles.header} >
                    <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                        <Avatar.Image size={50} source={{ uri: this.props.userAvatar }} style={{ marginTop: -15, marginLeft: -15}} />
                        <Text style={{ marginLeft: 15, marginBottom: 15 }}>{this.props.userName}</Text>
                    </View>
                    <TouchableRipple
                        onPress={() => console.log('Pressed')}
                        rippleColor="rgba(0, 0, 0, .32)"
                        borderless={true}
                    >
                        <Entypo 
                            name='dots-three-vertical'
                            color='#000'
                            size={20}
                            style={{ marginBottom: 15 }}
                        />
                    </TouchableRipple>

                </View>
                {typeof this.props.postImageUrl === 'undefined' ? null : <Image 
                    style={{ resizeMode: 'center', height: windowHeight * 0.4 }} source={{ uri: this.props.postImageUrl }}
                />}
                {typeof this.props.postImageUrl === 'undefined' ? 
                    <> 
                        {this.state.expand ?
                            <Text style={{ marginTop: 10 }}>{this.props.postDescription}</Text> :
                            <Text style={{ marginTop: 10 }}>{this.props.postDescription.slice(0, 50)}...</Text>    
                        }
                    </>
                    : null}

                <View style={styles.bottom}>
                    <View style={styles.bottomLeft} >
                        <TouchableRipple
                            onPress={() => this.handleLike()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            {this.state.likes.includes(this.props.userId) ? <AntDesign 
                                name="heart"
                                color="#e95950"
                                size={25}
                            /> :
                                <AntDesign 
                                    name="hearto"
                                    color="#000"
                                    size={25}
                                />}
                        </TouchableRipple>
                        <TouchableRipple
                            onPress={() => this.handleComments()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <EvilIcons
                                name='comment'
                                color='#000'
                                size={33}
                                style={{ marginLeft: 10 }}
                            />
                        </TouchableRipple>


                    </View>
                    <TouchableRipple
                        onPress={() => this.handleExpand()}
                        rippleColor="rgba(0, 0, 0, .32)"
                        borderless={true}
                    >
                        {this.state.expand ? <MaterialIcons
                            name='expand-less'
                            color='#000'
                            size={25}
                        /> : <MaterialIcons
                                name='expand-more'
                                color='#000'
                                size={25}
                            />
                        }
                    </TouchableRipple>
                </View>
                <View>
                    <Text>{this.state.likes.length} Likes</Text>
                    {this.state.comments.length ? <Text>{this.state.comments.length} Comments</Text> : null}
                </View>
                {typeof this.props.postImageUrl === 'undefined' ? null :
                    <>
                        {this.state.expand ?
                            <Text>{this.props.postDescription}</Text> :
                            <Text>{this.props.postDescription.slice(0, 50)}</Text>
                        }
                    </>}
                <CommentModal />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    post: {
        width: '100%',
        borderRadius: 15,
        padding: 15,
        backgroundColor: '#FFF',
        marginTop: 10,
        marginBottom: 15,
        shadowColor: "#7d86f8",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    header: {
        alignItems: "center",
        padding: 15,
        flexDirection: "row",
        backgroundColor: '#FFF',
        justifyContent: 'space-between',
        borderBottomWidth:0.5,
        borderColor:'#d4d4d4',
    },
    bottom: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    bottomLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }

})