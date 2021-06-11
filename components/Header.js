import React from "react";
import {
    StyleSheet,
    View,
    Text,
} from "react-native";

const Header = ({ title, RightIcon }) => {

    return (
        <View style={styles.main} >
            <Text style={styles.profileHeader} >{title}</Text>
                {RightIcon}
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    main: {
        padding: 15,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    profileIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    profileHeader: {
        color: '#C62828',
        fontWeight: 'bold',
        fontSize: 18,
    }
})