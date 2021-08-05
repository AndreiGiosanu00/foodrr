import React, {Component} from "react";
import {View, Text, StyleSheet, Button, Image, Dimensions} from "react-native";
import * as Google from 'expo-google-app-auth';
import firebase from "firebase";

const {width, height} = Dimensions.get('window');

class LoginScreen extends Component {

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };

    onSignIn = (googleUser) => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken, googleUser.accessToken);

                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential).then( result => {
                  console.log('User signed in!');
                  firebase.database().ref('/users/' + result.uid).set({
                      email: result.email,
                      profilePicture: result.photoURL,
                      displayName: result.displayName
                  }).then(snapshot => {
                     // console.log('Snapshot', snapshot);
                  });
                }).catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...

                    console.log(errorMessage);
                });
            } else {
                console.log('User already signed-in Firebase.');
            }
        }).bind(this);
    };

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: '74495830395-2do412qqhp07n2hbjnp2s34ggq8m5agq.apps.googleusercontent.com',
                /*iosClientId: '74495830395-2do412qqhp07n2hbjnp2s34ggq8m5agq.apps.googleusercontent.com',*/
                scopes: ['profile', 'email'],
                behavior: 'web'
            });

            if (result.type === 'success') {
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    };

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'flex-end'
            }}>
                <View style={{...StyleSheet.absoluteFill}}>
                    <Image
                        source={require('../assets/login-background.jpg')}
                        style={{flex: 1, height: null, width: null}}
                    />
                </View>
                <View style={{height: height / 3, alignItems: 'center'}}>
                    <View style={styles.button}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Sign In</Text>
                    </View>
                    <View style={{...styles.button, backgroundColor: '#4285F4'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}} onPress={() => this.signInWithGoogleAsync()}>Sign in with Google</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#fff',
        height: 70,
        width: 350,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 35,
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
