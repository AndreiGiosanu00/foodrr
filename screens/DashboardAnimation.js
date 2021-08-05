import React, {Component} from "react";
import {View, Text, StyleSheet, Button, ImageBackground} from "react-native";
import firebase from "firebase";
import LottieView from "lottie-react-native";

class DashboardAnimation extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/login-background.jpg')} resizeMode="cover" style={styles.image}>
                    <LottieView source={require('../assets/loading-animation.json')} autoPlay loop={false} onAnimationFinish = {() => this.props.navigation.navigate('DashboardScreen')}/>
                </ImageBackground>
            </View>
        )
    }
}

export default DashboardAnimation;

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
