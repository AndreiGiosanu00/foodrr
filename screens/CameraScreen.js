import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions} from "react-native";

const {width, height} = Dimensions.get('window');

class CameraScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Camera Screen</Text>
            </View>
        )
    }
}

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
