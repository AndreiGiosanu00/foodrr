import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions} from "react-native";
import {Camera} from 'expo-camera'
import {TouchableOpacity} from "react-native-gesture-handler";
import {StatusBar} from "react-native-web";
import CameraPreview from "./CameraPreview";

let camera = Camera;
const {width, height} = Dimensions.get('window');

export default function CameraScreen(props) {
    const [startCamera, setStartCamera] = React.useState(false);
    const [previewVisible, setPreviewVisible] = React.useState(false);
    const [capturedImage, setCapturedImage] = React.useState(null);
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = React.useState('off');

    const __startCamera = async () => {
        const {status} = await Camera.requestPermissionsAsync()
        console.log(status)
        if (status === 'granted') {
            setStartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }
    const __takePicture = async () => {
        const photo = await camera.takePictureAsync();
        console.log(photo);
        setPreviewVisible(true)
        //setStartCamera(false)
        setCapturedImage(photo)
    }
    const __savePhoto = () => {
        // here we will send the photo to the analyze API
    };
    const __retakePicture = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
        __startCamera()
    }
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }
    const __switchCamera = () => {
        if (cameraType === 'back') {
            setCameraType('front')
        } else {
            setCameraType('back')
        }
    }
        return (
            <View style={styles.container}>
                {startCamera ? (
                    <View
                        style={{
                            flex: 1,
                            width: width
                        }}
                    >
                        {previewVisible && capturedImage ? (
                            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                        ) : (
                            <Camera
                                type={cameraType}
                                flashMode={flashMode}
                                style={{flex: 1}}
                                ref={(r) => {
                                    camera = r
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <View
                                        style={{
                                            position: 'absolute',
                                            left: '5%',
                                            top: '10%',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => props.navigation.navigate('Home')}
                                            style={{
                                                marginTop: 0
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 30,
                                                    color: '#4285F4'
                                                }}
                                            >
                                                ⬅️
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={__switchCamera}
                                            style={{
                                                marginTop: 20,
                                                borderRadius: 50,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 30
                                                }}
                                            >
                                                {cameraType === 'front' ? '📷' : '🤳'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            flexDirection: 'row',
                                            flex: 1,
                                            width: '100%',
                                            padding: 20,
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <View
                                            style={{
                                                alignSelf: 'center',
                                                flex: 1,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={__takePicture}
                                                style={{
                                                    width: 70,
                                                    height: 70,
                                                    bottom: 0,
                                                    borderRadius: 50,
                                                    backgroundColor: '#fff'
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Camera>
                        )}
                    </View>
                ) : (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            onPress={__startCamera}
                            style={{
                                width: 130,
                                borderRadius: 4,
                                backgroundColor: '#14274e',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                Take picture
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <StatusBar style="auto" />
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
