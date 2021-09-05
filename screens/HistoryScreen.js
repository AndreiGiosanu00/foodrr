import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, Image, Dimensions, Modal, Button, Linking} from 'react-native';
import {
    Text,
    TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from "react-native-gesture-handler";
import firebase from "firebase";
import {Row, Rows, Table} from "react-native-table-component";

const {width, height} = Dimensions.get('window');

class HistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foodsScanned: [],
            noHistory: false,
            foodItem: {
                food: '',
                date: '',
                recommendedDrink: '',
                recommendedFood: '',
                nutrients: [],
                image: '',
                restaurantsList: [],
                user: ''
            },
            modalShow: false,
            tableHead: ['Nutrient', 'Quantity', 'Unit']
        };
        firebase.database().ref('/history/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    this.state.foodsScanned = Object.values(snapshot.val());
                } else {
                    this.state.noHistory = true;
                    console.log('da')
                }
            });
    }

    componentDidMount() {
        firebase.database().ref('/history/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    this.state.foodsScanned = Object.values(snapshot.val());
                } else {
                    this.state.noHistory = true;
                }
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        firebase.database().ref('/history/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    this.state.foodsScanned = Object.values(snapshot.val());
                } else {
                    this.state.noHistory = true;
                }
            });
    }

    openModal(foodItem) {
        this.state.foodItem = foodItem;
        console.log(foodItem);
        this.state.restaurantsListView = [];
        if (!foodItem.restaurantsList) {
            this.state.restaurantsListView.push(
                <View>
                    <Text style={{textAlign: 'center'}}>There are no restaurants in your area serving this type of food.</Text>
                </View>
            )
        } else {
            foodItem.restaurantsList.forEach(restaurant => {
                this.state.restaurantsListView.push(
                    <View>
                        <Image style={{width: 120, height: 120}} source={{uri: restaurant.icon}}/>
                        <Text>{restaurant.name}</Text>
                        <Text>Location: {restaurant.vicinity}</Text>
                        <Text>{this.getDistanceFromLatLonInKm(this.latitude, this.longitude, restaurant.location.lat, restaurant.location.lng).toFixed(2)}km</Text>
                        <Button title={'Go to restaurant'}
                                onPress={() => Linking.openURL('google.navigation:q=' + restaurant.vicinity)}/>
                    </View>
                )
            });
        }
        this.setState({modalShow: true});
    }

    closeModal() {
        this.setState({modalShow: false});
    }

    render() {
        if (this.state.noHistory) {
            return (
                <View>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>History</Text>
                    </View>
                    <Text style={{color: '#777777', textAlign: 'center', marginTop: 250, fontSize: 15, fontWeight: 'bold'}}>You have no items in your history</Text>
                </View>
            );
        } else {
            let foodItemsView = [];
            this.state.foodsScanned.forEach(foodItem => {
                foodItemsView.push(
                    <View style={styles.foodItem}>
                        <Image style={styles.foodImage} source={{uri: foodItem.image}}/>
                        <View style={{marginLeft: 15}}>
                            <View style={{flexDirection: 'row', marginLeft: 50}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>
                                    {foodItem.food}
                                </Text>
                                <TouchableRipple onPress={() => {this.deleteItemFromHistory(foodItem.id)}}>
                                    <Icon name="close-box" color="#4285F4" size={25} style={{padding: 2}} />
                                </TouchableRipple>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777' , fontSize: 15}}>{foodItem.nutrients[1][1]} kcal</Text>
                            </View>

                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777', fontSize: 15}}>{foodItem.date}</Text>
                            </View>
                            <TouchableRipple onPress={() => {this.openModal(foodItem)}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                    <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>
                );
            });
            return (
                <SafeAreaView style={styles.container}>
                    {/*More details Modal*/}
                    <Modal animationType="slide"
                           transparent={true}
                           visible={this.state.modalShow}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>{this.state.foodItem.food}</Text>
                                <Text style={styles.modalText}>Below you will find more details about your food that was scanned using our app</Text>
                                <TouchableRipple
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => this.closeModal()}
                                >
                                    <Icon name="close" color="white" size={15}/>
                                </TouchableRipple>
                                <View style={styles.modalContent}>
                                    <Text style={{color: '#777777', fontWeight: 'bold'}}>Date: <Text style={{fontWeight: 'normal'}}>{this.state.foodItem.date}</Text></Text>
                                    <View style={styles.nutrientsTable}>
                                        <Text style={{color: '#777777', fontWeight: 'bold'}}>Nutrients</Text>
                                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                            <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                                            <Rows data={this.state.foodItem.nutrients} textStyle={styles.text}/>
                                        </Table>
                                    </View>
                                    <Text style={{color: '#777777'}}>This dish goes well with {this.state.foodItem.recommendedDrink} and some {this.state.foodItem.recommendedFood} on the side.</Text>
                                    <ScrollView style={{maxHeight: 255}}>
                                        <Text style={{color: '#777777', fontWeight: 'bold'}}>Restaurants in your area that serve this food:</Text>
                                        {this.state.restaurantsListView}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>History</Text>
                    </View>
                    <ScrollView style={styles.foodsContainer}>
                        {foodItemsView}
                    </ScrollView>
                </SafeAreaView>
            );
        }
    }

    deleteItemFromHistory(foodItemId) {
        let foodItemRef = firebase.database().ref('history/' + foodItemId);
        foodItemRef.remove().then(() => {
            this.setState({reload: true});
            firebase.database().ref('/history/')
                .on('value', snapshot => {
                    if (snapshot.val() !== null) {
                        this.state.foodsScanned = Object.values(snapshot.val());
                    } else {
                        this.state.noHistory = true;
                    }
                    this.setState({reload: false});
                });
        });
    }

    getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
        let R = 6371; // Radius of the earth in km
        let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        let dLon = this.deg2rad(lon2-lon1);
        let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c; // Distance in km
        return d;
    };

    deg2rad = (deg) => {
        return deg * (Math.PI/180)
    };
}

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        alignItems: 'center',
        marginTop: 10,
        paddingBottom: 5
    },
    foodsContainer: {
        width: 400
    },
    foodItem: {
        marginTop: 10,
        marginBottom: 10,
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
