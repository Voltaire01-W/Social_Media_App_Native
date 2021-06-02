import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase'
import "firebase/firestore";
import { signupUser } from '../../redux/actions/index';
import { clearErrors } from '../../redux/actions/index';

export class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            errors: {}
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        signupUser(newUserData, history);
    }
    handleChange = (event) => {
        clearErrors();
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // onSignUp() {
    //     const { email, password, handle } = this.state;
    //     firebase.auth().createUserWithEmailAndPassword(email, password)
    //         .then((result) => {
    //             firebase.firestore().collection("users")
    //                 .doc(firebase.auth().currentUser.uid)
    //                 .set({
    //                     handle,
    //                     email
    //                 })
    //             console.log(result)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    render() {
        return (
            <View>
                <TextInput
                    placeholder="Username"
                    onChangeText={(handle) => this.setState({ handle })}
                />
                <TextInput
                    placeholder="Email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                />

                <Button
                    onPress={this.handleSubmit}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register
