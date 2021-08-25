import React, {Component} from "react";
import {View, Text, StyleSheet, Button, Dimensions, SafeAreaView} from "react-native";
import { withNavigation } from '@react-navigation/compat';
import LottieView from "lottie-react-native";

const {width, height} = Dimensions.get('window');

class DashboardScreen extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            noHistory: false
        }
    }
    render() {
        if (this.state.noHistory) {
            return (
                <SafeAreaView style={styles.container}>
                    <LottieView style={{width: 200, marginVertical: 35}} source={require('../assets/take-a-photo.json')} autoPlay />
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>Welcome to Foodrr</Text>
                        <Text style={{color: '#777777'}}>Right now you don't have any food dishes scanned.</Text>
                        <Text style={{color: '#777777'}}>To do that, click the camera icon from top-right corner.</Text>
                    </View>
                    <View style={{
                        marginHorizontal: 50,
                        marginVertical: 270,
                        borderRadius: 250,
                        borderWidth: 1,
                        borderColor: '#dddddd',
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

                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={{fontWeight: 'bold', fontSize: 25}}>Welcome to Foodrr</Text>
                    <Text style={{fontSize: 15, color: '#777777'}}>Below you can find your latest scans</Text>
                </View>
            </SafeAreaView>
        );

    }
}

export default withNavigation(DashboardScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        alignItems: 'center',
        marginTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#dddddd'
    },
});
