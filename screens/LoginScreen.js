import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions, TextInput, Alert} from "react-native";
import Svg, { Image, Circle, ClipPath } from 'react-native-svg';
import * as Google from 'expo-google-app-auth';
import firebase from "firebase";
import Animated, {Easing} from "react-native-reanimated";
import {TapGestureHandler, State} from "react-native-gesture-handler";

const {width, height} = Dimensions.get('window');
const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat
} = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}

let showSignUpForm = false;
function changeLoginForm(param) {
 showSignUpForm = param;
 console.log('da');
}

class LoginScreen extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        };
        this.buttonOpacity = new Value(1);
        this.onStateChangeLogin = event([
            {
                nativeEvent: ({state}) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))
                ])
            }
        ]);

        this.onCloseStateLogin = event([
            {
                nativeEvent: ({state}) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))
                ])
            }
        ]);

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate:Extrapolate.CLAMP
        });

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 3 - 30, 0],
            extrapolate:Extrapolate.CLAMP
        });

        this.textInputZIndex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate:Extrapolate.CLAMP
        });

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate:Extrapolate.CLAMP
        });

        this.textInputY =  interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate:Extrapolate.CLAMP
        });

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate:Extrapolate.CLAMP
        });
    }

    updateInputVal = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    };

    userLogin = () => {
        if(this.state.email === '' && this.state.password === '') {
            Alert.alert('Enter details to login!')
        } else {
            // Login cu user și parolă
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((res) => {
                    console.log(res);
                    console.log('User logged-in successfully!');
                    this.setState({
                        email: '',
                        password: ''
                    });
                    this.props.navigation.navigate('Home');
                })
                .catch(error => this.setState({ errorMessage: error.message }))
        }
    };

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
                     console.log('Snapshot', snapshot);
                  });
                }).catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;

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
                <Animated.View style={{...StyleSheet.absoluteFill, transform: [{translateY: this.bgY}]}}>
                    <Svg height={height + 60} width={width}>
                        <ClipPath id="clip">
                            <Circle r={height + 60} cx={width / 2}/>
                        </ClipPath>
                        <Image
                            href={require('../assets/login-background.jpg')}
                            width={width}
                            height={height + 60}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#clip)"
                        />
                    </Svg>
                </Animated.View>
                <View style={{height: height / 3, justifyContent: 'center'}}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChangeLogin}>
                        <Animated.View style={{...styles.button, opacity: this.buttonOpacity, transform: [{translateY: this.buttonY}] }}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Login</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <Animated.View style={{...styles.button, backgroundColor: '#4285F4', opacity: this.buttonOpacity, transform: [{translateY: this.buttonY}]}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}} onPress={() => this.signInWithGoogleAsync()}>Login with Google</Text>
                    </Animated.View>
                    <Animated.View style={{...styles.signUpLink, opacity: this.buttonOpacity, transform: [{translateY: this.buttonY}]}}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>First time here? <Text style={{color: '#4285F4', fontWeight: 'bold'}} onPress={() => this.props.navigation.navigate('RegisterScreen')}>Sign Up.</Text></Text>
                    </Animated.View>
                    <Animated.View style={{height: height / 3, ...StyleSheet.absoluteFill, top: null,
                        justifyContent: 'center', zIndex: this.textInputZIndex,
                        opacity: this.textInputOpacity, transform: [{translateY: this.textInputY}]}}
                    >
                        <TapGestureHandler onHandlerStateChange={this.onCloseStateLogin}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{fontSize: 15, fontWeight: 'bold', transform: [{rotate: concat(this.rotateCross, 'deg')}]}}>X</Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            value={this.state.email}
                            onChangeText={(val) => this.updateInputVal(val, 'email')}
                        />
                        <TextInput
                            placeholder="Password"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={(val) => this.updateInputVal(val, 'password')}
                        />
                        <Animated.View style={styles.button}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}} onPress={() => this.userLogin()}>Login</Text>
                        </Animated.View>
                    </Animated.View>
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
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: width / 2 - 20,
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 3
    },
    signUpLink: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
