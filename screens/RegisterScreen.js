import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions, TextInput, ImageBackground} from "react-native";
import firebase from "firebase";
import Animated from "react-native-reanimated";

const {width, height} = Dimensions.get('window');

class RegisterScreen extends Component {
    render() {
        return (
            <View style={{...styles.container}}>
                <ImageBackground source={require('../assets/login-background.jpg')} resizeMode="cover" style={styles.image}>
                    <Animated.View style={{backgroundColor: 'white', padding: 15, width: width - 30, borderRadius: 25}}>
                        <Animated.View style={styles.loginLink}>
                            <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 15}}>Foodrr - Sign Up</Text>
                        </Animated.View>
                        <TextInput
                            placeholder="Name"
                            style={styles.textInput}
                            placeholderTextColor="grey"
                        />
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            placeholderTextColor="grey"
                        />
                        <TextInput
                            placeholder="Password"
                            style={styles.textInput}
                            placeholderTextColor="grey"
                        />
                        <TextInput
                            placeholder="Confirm your password"
                            style={styles.textInput}
                            placeholderTextColor="grey"
                        />
                        <Animated.View style={{...styles.button, marginTop: 15}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Sign Up</Text>
                        </Animated.View>
                        <Animated.View style={{...styles.loginLink}}>
                            <Text>Do you have an account? <Text style={{color: '#4285F4', fontWeight: 'bold'}} onPress={() => this.props.navigation.navigate('LoginScreen')}>Login.</Text></Text>
                        </Animated.View>
                    </Animated.View>
                </ImageBackground>
            </View>
        )
    }
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        backgroundColor: '#fff',
        height: 70,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 3
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)'
    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    loginLink: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
