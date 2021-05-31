import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase'
import "firebase/firestore";

export class Register extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            handle: ''
        };

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, handle } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        handle,
                        email
                    })
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder="Username"
                    onChangeText={(handle) => this.setState({ handle })}
                />
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                <Button
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register
