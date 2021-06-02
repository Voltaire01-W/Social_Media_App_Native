import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase'

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) {
        return true;
    } else {
        return false;
    }
}

const isEmpty = (string) => {
    if(string.trim() === '') {
        return true;
    } else {
        return false;
    }
}

export class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: ''
        };

        this.onLogin = this.onLogin.bind(this);
        this.validateLoginData = this.validateLoginData.bind(this);
    }

    validateLoginData = (data) => {
        let errors = {};
    
        if(isEmpty(data.email)) errors.email = "Must not be empty";
        if(isEmpty(data.password)) errors.password = "Must not be empty";
    
        return {
            errors,
            valid: Object.keys(errors).length === 0 ? true : false
        }
    };

    onLogin = (req, res) => {
        const user = {
            email: req.body.email,
            password: req.body.password
        };
    
        const { valid, errors } = validateLoginData(user);
    
        if(!valid) return res.status(400).json(errors);
    
        firebase
            .auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(data => {
                return data.user.getIdToken();
            })
            .then(token => {
                return res.json({ token })
            })
            .catch(err => {
                console.error(err);
                    return res.status(403).json({ general: 'Wrong credentials, please try again' }); 
            });
    };

    render() {
        return (
            <View>
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
                    onPress={() => this.onLogin()}
                    title="Login"
                />
            </View>
        )
    }
}

export default Login;