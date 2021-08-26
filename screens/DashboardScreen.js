import React, {Component} from "react";
import {View, Text, StyleSheet, Button, Dimensions, SafeAreaView, Image, Pressable, Modal} from "react-native";
import { withNavigation } from '@react-navigation/compat';
import LottieView from "lottie-react-native";
import {TouchableRipple} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {ScrollView} from "react-native-gesture-handler";

const {width, height} = Dimensions.get('window');

class DashboardScreen extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            noHistory: false,
            modalShow: false
        }
    }

    changeModalState(value) {
        console.log('da');
        this.setState({modalShow: value});
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
                {/*More details Modal*/}
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.modalShow}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Pizza</Text>
                            <Text style={styles.modalText}>Below you will find more details about your food that was scanned using our app</Text>
                            <TouchableRipple
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.changeModalState(false)}
                            >
                                <Icon name="close" color="white" size={15}/>
                            </TouchableRipple>
                            <View style={styles.modalContent}>
                                <Text style={{color: '#777777', fontWeight: 'bold'}}>Date: <Text style={{fontWeight: 'normal'}}>26/08/2021</Text></Text>
                                <View style={styles.nutrientsTable}>
                                    <Text style={{color: '#777777', fontWeight: 'bold'}}>Nutrients</Text>
                                </View>
                                <Text style={{color: '#777777'}}>This dish goes well with a Diet Coke and some Rice on the side.</Text>
                                <ScrollView>
                                    <Text style={{color: '#777777', fontWeight: 'bold'}}>Restaurants in your area that serve this food:</Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.title}>
                    <Text style={{fontWeight: 'bold', fontSize: 25}}>Welcome to Foodrr</Text>
                    <Text style={{fontSize: 15, color: '#777777'}}>Below you can find your latest scans</Text>
                </View>
                <ScrollView style={styles.foodsContainer}>
                    <View style={styles.foodsDateContainer}>
                        <Text style={{fontSize: 15, color: '#777777', fontWeight: 'bold', marginLeft: 5}}>Scans from 25/08/2021</Text>
                        <View style={styles.foodItem}>
                            <Image style={styles.foodImage} source={require('../assets/foodrr-logo.png')}/>
                            <View style={{marginLeft: 15}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center'}}>Pizza</Text>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                                </View>
                                <TouchableRipple onPress={() => {this.changeModalState(true);}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                        <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                        <View style={styles.foodItem}>
                            <Image style={styles.foodImage} source={require('../assets/foodrr-logo.png')}/>
                            <View style={{marginLeft: 15}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center'}}>Burger</Text>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                                </View>
                                <TouchableRipple onPress={() => {this.changeModalState(true);}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                        <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                    <View style={styles.foodsDateContainer}>
                        <Text style={{fontSize: 15, color: '#777777', fontWeight: 'bold', marginLeft: 5}}>Scans from 24/08/2021</Text>
                        <View style={styles.foodItem}>
                            <Image style={styles.foodImage} source={require('../assets/foodrr-logo.png')}/>
                            <View style={{marginLeft: 15}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center'}}>Burger</Text>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                                </View>
                                <TouchableRipple onPress={() => {this.changeModalState(true);}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                        <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                    <View style={styles.foodsDateContainer}>
                        <Text style={{fontSize: 15, color: '#777777', fontWeight: 'bold', marginLeft: 5}}>Scans from 20/08/2021</Text>
                        <View style={styles.foodItem}>
                            <Image style={styles.foodImage} source={require('../assets/foodrr-logo.png')}/>
                            <View style={{marginLeft: 15}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center'}}>Pasta</Text>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                                </View>
                                <TouchableRipple onPress={() => {this.changeModalState(true);}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                        <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
    foodsContainer: {
        width: 400
    },
    foodItem: {
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#dddddd',
        padding: 5,
        flexDirection: 'row',
    },
    foodImage: {
        width: 150,
        height: 150
    },
    foodsDateContainer: {
        marginTop: 5,
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        borderRadius: 30
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: width
    },
    modalView: {
        margin: 10,
        width: width - 20,
        height: height - 150,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 5,
        elevation: 2,
        position: 'absolute',
        top: 7,
        left: 357
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#4285F4",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTitle: {
      fontSize: 25,
      fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 15,
        color: '#777777'
    },
    modalContent: {

    },
    nutrientsTable: {

    }
});
