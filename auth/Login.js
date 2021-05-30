import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native';

export class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            errors: {}
        };
    }
    // static getDerivedStateFromProps(nextProps, state){
    //     if (nextProps.UI.errors !== state.errors) {
    //         return { errors: nextProps.UI.errors };
    //     } else {
    //         return null;
    //     }
    // };
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        this.props.loginUser(userData, this.props.history);
    }

    render() {
        // const { classes, UI: { loading } } = this.props;
        // const { errors } = this.state;
        return (
            <View>
                <TextInput 
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                />
                <TextInput 
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                />
                <Button 
                    title="Login"
                    onPress={this.handleSubmit}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

export default Login
