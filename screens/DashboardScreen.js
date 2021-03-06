import React, {Component} from "react";
import {View, Text, StyleSheet, Button, Dimensions, SafeAreaView, Image, Pressable, Modal, Linking} from "react-native";
import { withNavigation } from '@react-navigation/compat';
import LottieView from "lottie-react-native";
import {TouchableRipple} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {ScrollView} from "react-native-gesture-handler";
import firebase from "firebase";
import {Row, Rows, Table} from "react-native-table-component";
import * as Location from "expo-location";

const {width, height} = Dimensions.get('window');

class DashboardScreen extends Component {
    latitude = 0;
    longitude = 0;

    recommendationModels = [
        {
            food: 'Shrimp salad',
            image: 'https://www.foodiecrush.com/wp-content/uploads/2017/07/Citrus-Shrimp-Avocado-Salad-foodiecrush.com-001.jpg',
            nutrients: [
                ['Carbs', 4.8, 'g'],
                ['Energy', 685, 'kcal'],
                ['Sugars', 3.7, 'g'],
                ['Saturated', 88, 'g'],
                ['Protein', 32, 'g'],
                ['Sodium', 680, 'mg']
            ],
            restaurantsList: [
                {
                    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
                    location: {
                        lat: 47.4647404594946,
                        lng: 26.299269430058718
                    },
                    name: 'Imperial Grill',
                    vicinity: 'Strada Sucevei 12, Falticeni'
                },
                {
                    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
                    location: {
                        lat: 47.6461668,
                        lng: 26.2604547
                    },
                    name: 'Lovegan',
                    vicinity: 'incinta hotel daily plaza, Strada Ștefan cel Mare 4, Suceava'
                },
            ],
            recommendedDrink: 'Coke',
            recommendedFood: 'Rice',
            date: 'Recommendation made using our AI',
            itsARecommendation: true
        },
        {
            food: 'Texas burger',
            image: 'https://www.sargento.com/assets/Uploads/Recipe/Image/burger_0.jpg',
            nutrients: [
                ['Carbs', 25.7, 'g'],
                ['Energy', 1600, 'kcal'],
                ['Sugars', 13.7, 'g'],
                ['Saturated', 98, 'g'],
                ['Protein', 62, 'g'],
                ['Sodium', 880, 'mg']
            ],
            restaurantsList: [
                {
                    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
                    location: {
                        lat: 47.4647404594946,
                        lng: 26.299269430058718
                    },
                    name: 'Imperial Grill',
                    vicinity: 'Strada Sucevei 12, Falticeni'
                },
                {
                    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
                    location: {
                        lat: 47.6461668,
                        lng: 26.2604547
                    },
                    name: 'Lovegan',
                    vicinity: 'incinta hotel daily plaza, Strada Ștefan cel Mare 4, Suceava'
                },
            ],
            recommendedDrink: 'Coke',
            recommendedFood: 'French fries',
            date: 'Recommendation made using our AI',
            itsARecommendation: true
        },
        {
            food: 'Tacos',
            image: 'https://mexican.ro/img/leoblog/b/1/16/lg-b-poza%20articol%207.jpeg',
            nutrients: [
                ['Carbs', 25.7, 'g'],
                ['Energy', 1600, 'kcal'],
                ['Sugars', 13.7, 'g'],
                ['Saturated', 98, 'g'],
                ['Protein', 62, 'g'],
                ['Sodium', 880, 'mg']
            ],
            restaurantsList: [
                {
                    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
                    location: {
                        lat: 47.4647404594946,
                        lng: 26.299269430058718
                    },
                    name: 'Imperial Grill',
                    vicinity: 'Strada Sucevei 12, Falticeni'
                },
                {
                    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
                    location: {
                        lat: 47.6461668,
                        lng: 26.2604547
                    },
                    name: 'Lovegan',
                    vicinity: 'incinta hotel daily plaza, Strada Ștefan cel Mare 4, Suceava'
                },
            ],
            recommendedDrink: 'Coke',
            recommendedFood: 'Salad',
            date: 'Recommendation made using our AI',
            itsARecommendation: true
        },
    ];

    constructor() {
        super();
        this.state = {
            loading: false,
            noHistory: false,
            modalShow: false,
            recommendModalShow: false,
            recommendExpandedModalShow: false,
            recommendedFood: {
                food: 'Shrimp salad',
                image: 'https://www.foodiecrush.com/wp-content/uploads/2017/07/Citrus-Shrimp-Avocado-Salad-foodiecrush.com-001.jpg',
                date: 'Recommendation made using our AI',
                nutrients: [
                    ['Carbs', 4.8, 'g'],
                    ['Energy', 685, 'kcal'],
                    ['Sugars', 3.7, 'g'],
                    ['Saturated', 88, 'g'],
                    ['Protein', 32, 'g'],
                    ['Sodium', 680, 'mg']
                ],
                restaurantsList: [],
                recommendedDrink: 'Coke',
                recommendedFood: 'Rice',
                itsARecommendation: true
            },
            currentUser: firebase.auth().currentUser,
            foodItem: {
                food: 'Chicken salad',
                date: '27/08/2021',
                nutrients: [
                    ['Carbs', 4.8, 'g'],
                    ['Energy', 685, 'kcal'],
                    ['Sugars', 3.7, 'g'],
                    ['Saturated', 88, 'g'],
                    ['Protein', 32, 'g'],
                    ['Sodium', 680, 'mg']
                ],
                restaurantsList: []
            },
            tableHead: ['Nutrient', 'Quantity', 'Unit'],
            dashboardContent: [],
            totalCaloriesPerDay: 0
        };
    }

    async componentDidMount() {
        firebase.database().ref('/analyzed_food/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    this.state.analyzedFood = Object.values(snapshot.val());
                    let dashboardContent = [];
                    let totalCalories = 0;
                    this.state.analyzedFood.forEach(foodItem => {
                        if (foodItem.user === firebase.auth().currentUser.uid) {
                            dashboardContent.push(
                                <View style={styles.foodItem}>
                                    <Image style={styles.foodImage} source={{uri: foodItem.image}}/>
                                    <View style={{marginLeft: 15}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center'}}>{foodItem.food}</Text>
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

                            if (foodItem.date === '06/8/2021') {
                                totalCalories += (+foodItem.nutrients[1][1]);
                            }
                        }
                    });
                    if ( this.state.analyzedFood.length > 0 && dashboardContent.length > 0) {
                        this.setState({dashboardContent: dashboardContent, totalCaloriesPerDay: totalCalories});
                    } else {
                        this.setState({noHistory: true});
                    }
                } else {
                    this.setState({noHistory: true});
                }
            });

        setInterval(() => {
            if (!this.state.recommendModalShow) {
                this.setState({recommendModalShow: true, recommendedFood: this.recommendationModels[Math.floor(Math.random() * this.recommendationModels.length)]});
            }
        }, 125000);

        let location = await Location.getCurrentPositionAsync({});
        this.latitude = location.coords.latitude;
        this.longitude = location.coords.longitude;
    }

    openModal(foodItem) {
        this.setState({recommendModalShow: false});
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

    closeRecommendModal() {
        this.setState({recommendModalShow: false});
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
                {/*Try this dish Modal*/}
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.recommendModalShow}>
                    <View style={[styles.centeredView, {marginLeft: 45, marginTop: -500}]}>
                        <View style={[styles.modalView, {height: 100, width: width - 100}]}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableRipple
                                    style={{backgroundColor: '#4285F4', padding: 5, width: 25, height: 25, color: 'white', borderRadius: 50, marginRight: 15}}
                                    onPress={() => this.closeRecommendModal()}
                                >
                                    <Icon name="close" color="white" size={15} style={{fontWeight: 'bold'}}/>
                                </TouchableRipple>
                                <Text style={{color: '#777777', fontWeight: 'bold', marginRight: 40, fontSize: 16}}>Try this dish! - {this.state.recommendedFood.food}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={{uri: this.state.recommendedFood.image}}
                                       style={{width: 60, height: 60, borderRadius: 50}}
                                />
                                <TouchableRipple onPress={() => {this.openModal(this.state.recommendedFood)}}>
                                    <Text style={{color: '#4285F4', maxWidth: 150, marginLeft: 25, marginTop: 10}}>Click here if you want to see more details!</Text>
                                </TouchableRipple>
                            </View>

                        </View>
                    </View>
                </Modal>
                {/*Trey this food expanded Modal*/}
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.recommendExpandedModalShow}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Shrimp salad</Text>
                            <Image style={{width: 75, height: 75, borderRadius: 50}} source={{uri: 'https://www.foodiecrush.com/wp-content/uploads/2017/07/Citrus-Shrimp-Avocado-Salad-foodiecrush.com-001.jpg'}}/>
                            <Text style={styles.modalText}>Try this food that was found using our recommendation system</Text>
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
                                <Text style={{color: '#777777'}}>This dish goes well with White Wine and some Lemon on the side.</Text>
                                <Text style={{color: '#777777', fontWeight: 'bold', marginTop: 5}}>Restaurants in your area that serve this food:</Text>
                                <ScrollView style={{maxHeight: 250, marginTop: 5}}>
                                    <View style={{marginTop: 5, borderBottomColor: '#dddddd', borderBottomWidth: 1, padding: 5}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Image style={{width: 50, height: 50}} source={{uri: 'https://cdn3.vectorstock.com/i/1000x1000/12/02/restaurant-menu-icon-vector-4731202.jpg'}}/>
                                            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10, marginLeft: 15}}>Octopus</Text>
                                            <TouchableRipple style={{backgroundColor: '#4285F4', color: 'white', paddingBottom: 5, paddingTop: 5, alignItems: 'center', borderRadius: 50, width: 120, height: 35, marginLeft: 30, marginTop: 5}} onPress={() => Linking.openURL('google.navigation:q=Șoseaua București-Ploiești 42D')}>
                                                <Text style={{color: 'white', fontWeight: 'bold'}}>Navigate <Icon name="google-maps" color="white" size={20}/></Text>
                                            </TouchableRipple>
                                        </View>
                                        <Text style={{color: '#777777'}}><Text style={{fontWeight: 'bold'}}>Location:</Text> Șoseaua Nordului 1, București -  <Text style={{fontWeight: 'bold'}}>3.2 km from your current location</Text></Text>
                                    </View>
                                    <View style={{marginTop: 5, borderBottomColor: '#dddddd', borderBottomWidth: 1, padding: 5}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Image style={{width: 50, height: 50}} source={{uri: 'https://cdn3.vectorstock.com/i/1000x1000/12/02/restaurant-menu-icon-vector-4731202.jpg'}}/>
                                            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10, marginLeft: 15}}>Hard Rock Cafe</Text>
                                            <TouchableRipple style={{backgroundColor: '#4285F4', color: 'white', paddingBottom: 5, paddingTop: 5, alignItems: 'center', borderRadius: 50, width: 120, height: 35, marginLeft: 15, marginTop: 5}} onPress={() => Linking.openURL('google.navigation:q=Şoseaua Pavel D. Kiseleff nr. 32, București')}>
                                                <Text style={{color: 'white', fontWeight: 'bold'}}>Navigate <Icon name="google-maps" color="white" size={20}/></Text>
                                            </TouchableRipple>
                                        </View>
                                        <Text style={{color: '#777777'}}><Text style={{fontWeight: 'bold'}}>Location:</Text> Şoseaua Pavel D. Kiseleff nr. 32, București -  <Text style={{fontWeight: 'bold'}}>4.5 km from your current location</Text></Text>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/*More details Modal*/}
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.modalShow}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>{this.state.foodItem.itsARecommendation ? 'Try some ' + this.state.foodItem.food : this.state.foodItem.food}</Text>
                            <Image style={{width: 85, height: 85, borderRadius: 25}} source={{uri: this.state.foodItem.image}}/>
                            <Text style={styles.modalText}>
                                {(this.state.foodItem.itsARecommendation ?
                                    'We thought you\'d like this dish! Our AI-based algorithm found this dish similar to what you like, if you don\'t like this dish you can close this pop, and we will take note of this.'
                                    :
                                    'Below you will find more details about your food that was scanned using our app')}
                            </Text>
                            <TouchableRipple
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.closeModal()}
                            >
                                <Icon name="close" color="white" size={15}/>
                            </TouchableRipple>
                            <View style={styles.modalContent}>
                                <Text style={{color: '#777777'}}>
                                    {(this.state.foodItem.itsARecommendation) ? this.state.foodItem.date : 'Date: ' + this.state.foodItem.date}
                                </Text>
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
                    <Text style={{fontWeight: 'bold', fontSize: 25}}>Welcome to Foodrr</Text>
                    <Text style={{fontSize: 15, color: '#777777'}}>Below you can find your latest scans</Text>
                </View>
                <ScrollView style={styles.foodsContainer}>
                    <View style={styles.foodsDateContainer}>
                        <Text style={{fontSize: 15, color: '#777777', fontWeight: 'bold', marginLeft: 5}}>Scans from 07/09/2021</Text>
                        {this.state.dashboardContent}
                    </View>
                    {(firebase.auth().currentUser.uid === "08EG3z1kZTXNSXHA3X8PlX3lPL02") ?
                        <View style={styles.foodsDateContainer}>
                            <Text style={{fontSize: 15, color: '#777777', fontWeight: 'bold', marginLeft: 5}}>Scans from 03/09/2021</Text>
                            <View style={styles.foodItem}>
                                <Image style={styles.foodImage} source={{uri: 'https://s3.amazonaws.com/cms.ipressroom.com/67/files/20125/4ffe088229371a067f00000f_Milk_in_glass_verticle_from_above/Milk_in_glass_verticle_from_above_225d0276-39e4-4370-bb12-580776bf9b96-prv.jpg'}}/>
                                <View style={{marginLeft: 15}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center'}}>Milk</Text>
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                        <Text style={{color: '#777777' , fontSize: 15}}>90 kcal</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                        <Text style={{color: '#777777', fontSize: 15}}>03/09/2021</Text>
                                    </View>
                                    <TouchableRipple onPress={() => {}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                            <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                        </View>
                                    </TouchableRipple>
                                </View>
                            </View>
                        </View>
                        : null}
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
        height: height - 25,
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
