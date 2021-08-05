import React, {Component} from "react";
import {View, StyleSheet, ImageBackground} from "react-native";
import LottieView from 'lottie-react-native';

class RegisterAnimation extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/login-background.jpg')} resizeMode="cover" style={styles.image}>
                    <LottieView source={require('../assets/loading-animation.json')} autoPlay loop={false} onAnimationFinish = {() => this.props.navigation.navigate('RegisterScreen')}/>
                </ImageBackground>
            </View>
        )
    }
}

export default RegisterAnimation;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    }
});
