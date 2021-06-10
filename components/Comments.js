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
import firebase from 'firebase';

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
            uid: firebase.auth().currentUser.uid,
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
            firebase
                .firestore()
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
            () => firebase
                    .firestore()
                    .collection('posts')
                    .doc(this.state.postId)
                    .update({
                        comments: comments
                    })
                    .then(() => this.fetchComments()))
    }

}