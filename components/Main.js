import React, { Component } from 'react';
import { View, Text } from 'react-native';

import firebase from 'firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';

export class Main extends Component {
    componentDidMount(){
        this.props.fetchUser();
    }
    render() {
        const { currentUser } = this.props;
        if(currentUser === undefined) {
            <View></View>
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text>{firebase.auth().currentUser.uid} is logged in</Text>
            </View>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapActionsToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapActionsToProps)(Main);
