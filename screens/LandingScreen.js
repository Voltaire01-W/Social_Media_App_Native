import React, { useState,useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  Button,
  TextInput
} from "react-native";
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const LandingScreen = ({ navigation }) => {

  return (
    <Animatable.View
      animation='zoomIn'
      duration={600}
      style={styles.container}
    >
    <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#FFF" translucent={true} />
      <ImageBackground
        source={require("../assets/background.jpg")}
        resizeMode='stretch'
        style={styles.image2}
        imageStyle={styles.image2ImageStyle}
      >
        <View
          
          style={{
            height: 200,
            width: 200,
            marginTop: '69%',
            borderRadius: 28,
            shadowColor: "rgba(0,0,0,1)",
            shadowOffset: {
              width: 20,
              height: 20
            },
            elevation: 5,
            shadowOpacity: 0.42,
            shadowRadius: 0,
            backgroundColor:'#FFF'
          }}>
          <Image
            source={require('../assets/phoenix.jpg')}
            style={styles.logo}
          ></Image>
        </View>
      </ImageBackground>
      <View style={styles.bottom}>
        <View style={{
          alignItems: 'center',
        }}>
          <Animatable.View
            animation='fadeInLeft'
            duration={1000}
          >
            <Text style={styles.post}>Firebird</Text>
          </Animatable.View>

          
            <Text style={styles.txtbelow}>
              Welcome to Firebird
            </Text>
         
        </View>
        <View style={{
          marginTop: 25,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.btext}>
                Go
              </Text>
              <FontAwesome
                name="arrow-circle-right"
                color='#FFF'
                size={20}
              />
            </TouchableOpacity>
         
        </View>
      </View>
    </Animatable.View>

  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  logo: {
    height: 195,
    width: 195,
    borderRadius: 20,
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    justifyContent:'space-evenly',
    backgroundColor: '#FFF'
  },
  post: {
    fontFamily: "sans-serif",
    color: "#C62828",
    fontSize: 28,
    textAlign: "center",
    fontWeight:'bold'
  },
  button: {
    height: 75,
    width: 75,
    borderRadius: 50,
    shadowColor: "#C62828",
    shadowOffset: {
      width: 10,
      height: 10
    },
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 0,
    backgroundColor: "#C62828",
    padding: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  btext: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15

  },
  image2: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  image2ImageStyle: {
    width: '100%',
    height: '50%',
    marginTop: '20%'

  },
  txtbelow: {
    marginTop: 5,
    fontFamily: "sans-serif",
    color: "#C62828",
    textAlign: "center",
    fontSize: 13,
    opacity: 0.81
  }
});

export default LandingScreen;