import React, {Component} from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import { withNavigation } from '@react-navigation/compat';
import firebase from "firebase";

class HistoryScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>History Screen</Text>
                <Button title={"Sign out!"} onPress={() => firebase.auth().signOut()}/>
            </View>
        )
    }
}

export default withNavigation(HistoryScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
