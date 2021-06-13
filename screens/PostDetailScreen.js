import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import Header from '../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { FAB, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import PostCard from '../components/PostCard';
import Fire from '../Fire';

export default class PostDetailScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: this.props.userName,
            avatar: this.props.avatar,
            postItem: this.props.postData,
            uid: Fire.shared.uid
        }
    }

    render() {
        return (
            <>
                <Header
                    title={'Post'}
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
                <PostCard
                    userName={this.state.name}
                    avatar={this.state.avatar}
                    postId={this.state.postItem.postId}
                    userId={this.state.uid}
                    postImageUrl={this.state.postItem.image}
                    postDescription={this.state.postItem.description}
                    postLikes={this.state.postItem.likes}
                    postComments={this.state.postItem.comments}
                />
            </>
        );
    }
}