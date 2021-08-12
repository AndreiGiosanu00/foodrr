import React, {Component} from "react";
import {View, Text, StyleSheet, Button, Dimensions} from "react-native";
import { withNavigation } from '@react-navigation/compat';
import LottieView from "lottie-react-native";

const {width, height} = Dimensions.get('window');

class DashboardScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <LottieView style={{width: 200, marginVertical: 35}} source={require('../assets/take-a-photo.json')} autoPlay />
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 25}}>Welcome to Foodrr app!</Text>
                    <Text>Right now you don't have any food dishes scanned.</Text>
                    <Text>To do that, click the camera icon from top-right corner.</Text>
                </View>
                <View style={{
                    backgroundColor: 'white',
                    marginHorizontal: 50,
                    marginVertical: 270,
                    borderRadius: 250,
                    height: height,
                    width: width + 140
                }}>
                    <Text style={{
                        color: 'black',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 25,
                        marginTop: 15
                    }}>
                        Hi!
                    </Text>
                </View>

            </View>
        )
    }
}

export default withNavigation(DashboardScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d1edf2',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});
