import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    ActivityIndicator

} from 'react-native';
import { Avatar, TouchableRipple } from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fire from '../Fire';
import Header from './Header';

export default class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            comments: this.props.postComments,
            postId: this.props.postId,
            fetchedComments: [],
            fetchedCommentsLoading: null,
            addCommentText: ''
        }
    }

    componentDidMount() {
        this.setState({
            uid: Fire.shared.uid,
            fetchedCommentsLoading: true
        })
        if (this.state.comments.length) {
            this.fetchComments();
        } else {
            this.setState({ fetchedCommentsLoading: false })
        }
    }

    fetchComments = () => {
        let comments = []
        this.state.comments.map((comment) => {
            Fire.shared
                .firestore
                .collection('users')
                .doc(comment.userId)
                .get()
                    .then((snap) => comments.push({ ...snap.data(), ...{ comment: comment.comment} }))
                    .then(() => this.setState({ fetchedComments: comments, fetchedCommentsLoading: false }))
        })
    }

    textInputChange = (val) => {
        this.setState({
            addCommentText: val
        })
    }

    handleAddComment = () => {
        let comments = this.state.comments

        comments.push({ comment: this.state.addCommentText, userId: this.state.uid })
        this.setState({
            comments: comments,
            addCommentText: '',
            fetchedCommentsLoading: true
        }, 
            () => Fire.shared
                    .firestore
                    .collection('posts')
                    .doc(this.state.postId)
                    .update({
                        comments: comments
                    })
                    .then(() => this.fetchComments()))
    }

    render() {
        return (
            <>
                <Header 
                    title={'Comments'}
                    LeftIcon={this.props.LeftIcon}
                    RightIcon={<EvilIcons
                        name='comment'
                        color='#000'
                        size={33}

                    />}
                />
                <View style={styles.main}>
                    {this.state.fetchedCommentsLoading ?
                        <ActivityIndicator size="large" color="#666" />
                        :
                        <ScrollView>
                            {this.state.fetchedComments.map((comment) => (
                                <View style={styles.commentSection} >
                                    <Avatar.Image size={30} source={{ uri: comment.avatar }} />
                                    <View>
                                        <Text style={{ marginLeft: 15, fontWeight: 'bold' }}>{comment.name}</Text>
                                        <Text style={{ marginLeft: 15 }}>{comment.comment}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>}
                    <View style={styles.addComment} >
                        <TextInput 
                            placeholder="Add a comment..."
                            value={this.state.addCommentText}
                            placeholderTextColor="#666666"
                            autoCapitalize="none"
                            onChangeText={this.textInputChange}
                        />
                        {this.state.addCommentText.trim().length ?
                            <TouchableRipple
                                onPress={() => this.handleAddComment()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <Text style={{ color: '#000' }}>Post</Text>
                            </TouchableRipple> :
                            <TouchableRipple
                                onPress={() => { }}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <Text style={{ color: '#666' }}>Post</Text>
                            </TouchableRipple>}
                    </View>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between'
    },
    commentSection: {
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: "#d4d4d4",
        borderBottomWidth: 0.5,
        padding: 5
    },
    addComment: {
        borderTopColor: "#d4d4d4",
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    }
})