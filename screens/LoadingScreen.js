import React, {Component} from "react";
import {View, Text, StyleSheet, ActivityIndicator} from "react-native";
import firebase from "firebase";

class LoadingScreen extends Component {

    componentDidMount() {
        this.checkedIfLoggedIn();
    }

    checkedIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
           if (user) {
               this.props.navigation.navigate('DashboardAnimation');
           } else {
               this.props.navigation.navigate('LoginAnimation');
           }
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
}

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
