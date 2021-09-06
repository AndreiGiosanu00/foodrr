import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, Image, Modal, Linking, Dimensions} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from "react-native-gesture-handler";
import {Row, Rows, Table} from "react-native-table-component";
import firebase from "firebase";

const {width, height} = Dimensions.get('window');


class FavoritesScreen extends Component {
    constructor() {
        super();

        this.state = {
            modalShow: false,
            foodItem: {
                food: 'Chicken salad',
                date: '27/08/2021',
                nutrients: [
                    ['Carbs', 3.3, 'g'],
                    ['Energy', 450, 'kcal'],
                    ['Sugars', 2.4, 'g'],
                    ['Saturated', 18, 'g'],
                    ['Protein', 40, 'g'],
                    ['Sodium', 420, 'mg']
                ]
            },
            tableHead: ['Nutrient', 'Quantity', 'Unit'],
            noFavorites: false,
            loading: false,
            favoritesFood: [],
            currentUser: firebase.auth().currentUser,
        }
    }

    componentDidMount() {
        firebase.database().ref('/favorites/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    console.log('da');
                    this.setState({favoritesFood: Object.values(snapshot.val())});
                    this.setState({loading: false});
                } else {
                    this.setState({noFavorites: true, loading: false});
                }
            });
    }

    deleteItemFromFavorites(id) {
        this.setState({loading: true});
        let foodItemRef = firebase.database().ref('favorites/' + id);
        foodItemRef.remove().then(() => {
            this.setState({reload: true});
            firebase.database().ref('/favorites/')
                .on('value', snapshot => {
                    if (snapshot.val() !== null) {
                        this.state.favoritesFood = Object.values(snapshot.val());
                    } else {
                        this.state.noHistory = true;
                    }
                    this.setState({loading: false});
                });
        });
    }

    openModal(foodItem) {
        this.state.foodItem = foodItem;
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
                    <View style={{marginTop: 5, borderBottomColor: '#dddddd', borderBottomWidth: 1, padding: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{width: 50, height: 50}} source={{uri:  restaurant.icon}}/>
                            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10, marginLeft: 15}}>{restaurant.name}</Text>
                            <TouchableRipple style={{backgroundColor: '#4285F4', color: 'white', paddingBottom: 5,
                                paddingTop: 5, alignItems: 'center', borderRadius: 50, width: 120, height: 35, marginLeft: 30,
                                marginTop: 5}} onPress={() => Linking.openURL('google.navigation:q=' + restaurant.vicinity)}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Navigate <Icon name="google-maps" color="white" size={20}/></Text>
                            </TouchableRipple>
                        </View>
                        <Text style={{color: '#777777'}}>
                            <Text style={{fontWeight: 'bold'}}> Location:</Text> {restaurant.vicinity} -  <Text style={{fontWeight: 'bold'}}>
                            {this.getDistanceFromLatLonInKm(this.latitude, this.longitude,
                                restaurant.location.lat, restaurant.location.lng).toFixed(2)}km from your current location
                        </Text>
                        </Text>
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
        if (this.state.noFavorites) {
            return (
                <View>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>Your Favorite Dishes</Text>
                    </View>
                    <Text style={{color: '#777777', textAlign: 'center', marginTop: 250, fontSize: 15, fontWeight: 'bold'}}>You have no items in your favorites list</Text>
                </View>
            );
        } else {
            this.state.favoritesView = [];
            this.state.favoritesFood.forEach(foodItem => {
                if (foodItem.user === this.state.currentUser.uid) {
                    this.state.favoritesView.push(
                        <View style={styles.foodItem}>
                            <Image style={styles.foodImage} source={{uri: foodItem.image}}/>
                            <View style={{marginLeft: 15}}>
                                <View style={{flexDirection: 'row', marginLeft: 50}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>
                                        {foodItem.food}
                                    </Text>
                                    <TouchableRipple onPress={() => {this.deleteItemFromFavorites(foodItem.id)}}>
                                        <Icon name="heart" color="#4285F4" size={25} style={{padding: 2}} />
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
                }
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
                                <Image style={{width: 85, height: 85, borderRadius: 25}} source={{uri: this.state.foodItem.image}}/>
                                <Text style={styles.modalText}>Below you will find more details about your favorite food</Text>
                                <TouchableRipple
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => this.closeModal()}
                                >
                                    <Icon name="close" color="white" size={15}/>
                                </TouchableRipple>
                                <View style={styles.modalContent}>
                                    <View style={styles.nutrientsTable}>
                                        <Text style={{color: '#777777', fontWeight: 'bold', textAlign: 'center', marginBottom: 5}}>Nutrients</Text>
                                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                            <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                                            <Rows data={this.state.foodItem.nutrients} textStyle={styles.text}/>
                                        </Table>
                                    </View>
                                    <Text style={{fontWeight: 'bold', color: '#777777'}}>Our recommendation:</Text>
                                    <Text style={{color: '#777777'}}>This dish goes well with {this.state.foodItem.recommendedDrink} and some {this.state.foodItem.recommendedFood} on the side.</Text>
                                    <Text style={{color: '#777777', fontWeight: 'bold', marginTop: 5}}>Restaurants in your area that serve this food:</Text>
                                    <ScrollView style={{maxHeight: 250, marginTop: 5}}>
                                        {this.state.restaurantsListView}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>Your Favorite Dishes</Text>
                    </View>
                    <ScrollView style={styles.foodsContainer}>
                        {this.state.favoritesView}
                    </ScrollView>
                </SafeAreaView>
            );
        }
    }
}

export default FavoritesScreen;

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
        marginTop: 5,
        marginBottom: 5
    }
});
