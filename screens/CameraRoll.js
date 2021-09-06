import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    ScrollView,
    View, Dimensions,
    Linking
} from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import uuid from 'react-native-uuid';
import Environment from '../config/environment';
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';
import {TouchableRipple} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const {width, height} = Dimensions.get('window');

export default class CameraRoll extends React.Component {
    latitude = 0;
    longitude = 0;
    restaurantsInYourArea = [];

    constructor(props) {
        super(props);
        this.state = {
            image: null,
            uploading: false,
            googleResponse: null,
            tableHead: ['Nutrient', 'Quantity', 'Unit'],
            tableData: [],
            loading: false,
            currentUser: firebase.auth().currentUser
        };
    }

    async getCurrentLocationAndRestaurantsInYourArea() {
        this.state.loading = true;
        this.restaurantsInYourArea = [];
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        this.latitude = location.coords.latitude;
        this.longitude = location.coords.longitude;

        let restaurantsInMyArea = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.latitude + ',' + this.longitude +
            '&radius=52000&type=restaurant&keyword=' + this.state.detectedFood + '&key=AIzaSyDlbePn-1ooGqbMQdNb-2YQlv1JplGbxI4';
        fetch(restaurantsInMyArea)
            .then((response) => response.json())
            .then((JsonResponse) => {
                let i = 0;
                JsonResponse.results.forEach(restaurant => {
                    if (i > 4) {
                        return;
                    }
                    i++;
                    this.restaurantsInYourArea.push({
                        name: restaurant.name,
                        icon: restaurant.icon,
                        location: restaurant.geometry.location,
                        vicinity: restaurant.vicinity
                    });
                });
                this.saveAnalyzedFoodData(this.restaurantsInYourArea);
                this.setState({loading: false, uploading: false});
            })
            .catch((error) => {
                alert('Something went wrong! Please try again.')
            });
    }

    render() {
        let { image } = this.state;

        if (this.state.loading) {
            return (
                <View style={styles.loading}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                >
                    <TouchableRipple style={styles.goBackButton}  onPress={() => {
                        this.props.navigation.navigate('BottomTabs');
                    }}>
                        <Icon name={'arrow-left'} size={25} color={'white'} style={{textAlign: 'center', marginTop: 2}}/>
                    </TouchableRipple>
                    <View style={styles.getStartedContainer}>
                        {image ? null : (
                            <View>
                                <Text style={styles.getStartedText}>Foodrr - Scan Food</Text>
                                <Text style={{color: '#777777', textAlign: 'center'}}>Welcome! Here you can analyze your favorite food by uploading an image with it from your local library or taking a photo right now of you dish that you are serving.</Text>
                            </View>
                        )}

                        {image ? (
                            <View>
                                <Text style={styles.getStartedText}>Foodrr - Scan Food</Text>
                                <Text style={{color: '#777777', textAlign: 'center'}}>There is your uploaded or taken image. Tap analyze to start the analyzing process.</Text>
                            </View>
                        ) : null}
                    </View>
                    <View style={styles.helpContainer}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#777777', fontSize: 15, fontWeight: 'bold', marginLeft: 50}}>Pick an image</Text>
                            <Text style={{marginLeft: 40, marginRight: 40, color: '#777777'}}> or </Text>
                            <Text style={{color: '#777777', fontSize: 15, fontWeight: 'bold', marginLeft: 0}}>Take a photo</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableRipple onPress={this._pickImage} style={styles.imageSelectorButton}>
                                <Icon name={'image-album'} size={75} color={'white'}/>
                            </TouchableRipple>
                            <TouchableRipple onPress={this._takePhoto} style={[styles.imageSelectorButton, {marginLeft: 120}]}>
                                <Icon name={'camera'} size={75} color={'white'}/>
                            </TouchableRipple>
                        </View>

                        {this.state.nutrientsResponse && (
                            <View style={[styles.container, {padding: 10}]}>
                                <Text style={{color: '#777777', textAlign: 'center'}}>In your image it's a dish that contains <Text style={{fontWeight: 'bold'}}>{this.state.detectedFood}</Text>.</Text>
                                <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#777777', marginTop: 10}}>Nutrients (per 100g)</Text>
                                <View style={[styles.container, {marginTop: 15}]}>
                                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                        <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                                        <Rows data={this.state.tableData} textStyle={styles.text}/>
                                    </Table>
                                </View>
                                <TouchableRipple style={[styles.imageSelectorButton, {marginLeft: 0}]} onPress={() => {
                                    this.addToFavorites(this.restaurantsInYourArea);
                                    this.props.navigation.navigate('FavoritesScreen');
                                }}>
                                    <Text style={{fontWeight: 'bold', color: 'white', fontSize: 16}}>Add this to your favorites list</Text>
                                </TouchableRipple>
                            </View>
                        )}
                        {this._maybeRenderImage()}
                        {this._maybeRenderUploadingOverlay()}
                        {this._maybeRenderRecommendationFoodAndDrinks()}
                        {this._maybeRenderRestaurantsList()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    _maybeRenderRestaurantsList = () => {
      if (this.state.nutrientsResponse) {
          this.state.restaurantsListView = [];
          this.restaurantsInYourArea.forEach(restaurant => {
              this.state.restaurantsListView.push(
                  <View style={{marginTop: 5, borderBottomColor: '#dddddd', borderBottomWidth: 1, padding: 5}}>
                      <View style={{flexDirection: 'row'}}>
                          <Image style={{width: 50, height: 50}} source={{uri: 'https://cdn3.vectorstock.com/i/1000x1000/12/02/restaurant-menu-icon-vector-4731202.jpg'}}/>
                          <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10, marginLeft: 15, color: '#777777'}}>{restaurant.name}</Text>
                          <TouchableRipple style={{backgroundColor: '#4285F4', color: 'white', paddingBottom: 5,
                              paddingTop: 5, alignItems: 'center', borderRadius: 50, width: 120, height: 35, marginTop: 5,
                              marginLeft: 30}} onPress={() => Linking.openURL('google.navigation:q=' + restaurant.vicinity)}>
                              <Text style={{color: 'white', fontWeight: 'bold'}}>Navigate <Icon name="google-maps" color="white" size={20}/></Text>
                          </TouchableRipple>
                      </View>
                      <Text style={{color: '#777777'}}><Text style={{fontWeight: 'bold'}}>Location:</Text> {restaurant.vicinity}</Text>
                      <Text style={{fontWeight: 'bold', color: '#777777'}}>{this.getDistanceFromLatLonInKm(this.latitude, this.longitude, restaurant.location.lat, restaurant.location.lng).toFixed(2)} km from your current location</Text>
                  </View>
              );
          });

          if (this.state.restaurantsListView.length > 0) {
              return (
                  <View style={styles.restaurantsView}>
                      <Text style={{color: '#777777', fontWeight: 'bold', textAlign: 'center'}}>Restaurants in your area that serve this dish</Text>
                      {this.state.restaurantsListView}
                  </View>
              );
          }

          return (
              <View style={styles.restaurantsView}>
                  <Text style={{color: '#777777', fontWeight: 'bold', textAlign: 'center'}}>There are no restaurants in your area that serve this dish.</Text>
              </View>
          );

      }
    };

    _maybeRenderRecommendationFoodAndDrinks = () => {
        let drinksToRecommend = ['White Wine', 'Red Wine', 'Water', 'Roze Wine', 'Coke', 'Sprite', 'Coffee', 'Latte', 'Beer'];
        let foodsToRecommend = ['Salad', 'Focaccia', 'Potatoes', 'Rice', 'Black Rice', 'Bread', 'Smashed Potatoes', 'Cheese'];
        this.state.recommendedDrink = drinksToRecommend[Math.floor(Math.random() * drinksToRecommend.length)];
        this.state.recommendedFood = foodsToRecommend[Math.floor(Math.random() * foodsToRecommend.length)];
        if (this.state.nutrientsResponse)  {
            return (
                <View>
                    <Text style={{color: '#777777', textAlign: 'center', marginTop: 10}}>With this dish a{/* {this.state.recommendedDrink}*/} Fresh Juice will be a great choice</Text>
                    <Text style={{color: '#777777', textAlign: 'center'}}>Also, you can try some{/* {this.state.recommendedFood}*/} Bread on the side</Text>
                </View>
            );
        }
    };

    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    ]}
                >
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };

    _maybeRenderImage = () => {
        let { image, googleResponse } = this.state;
        if (!image) {
            return;
        }

        return (
            <View
                style={{
                    marginTop: 20,
                    borderRadius: 3,
                    elevation: 2,
                    alignItems: 'center',
                    padding: 10
                }}
            >
                <View
                    style={{
                        borderTopRightRadius: 3,
                        borderTopLeftRadius: 3,
                        shadowColor: 'rgba(0,0,0,1)',
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 4, height: 4 },
                        shadowRadius: 5,
                        overflow: 'hidden'
                    }}
                >
                    <Image source={{ uri: image }} style={{ width: 350, height: 350, borderRadius: 15 }}/>
                </View>
                <TouchableRipple onPress={() => this.submitToGoogle()} style={[styles.imageSelectorButton, {borderRadius: 15, padding: 10, alignItems: 'center', marginLeft: 0, marginBottom: 10}]}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Analyze</Text>
                </TouchableRipple>
            </View>
        );
    };

    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        this._handleImagePicked(pickerResult);
    };

    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                let uploadUrl = await uploadImageAsync(pickerResult.uri);
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };

    submitToGoogle = async () => {
        try {
            this.setState({ uploading: true });
            this.state.restaurantsListView = [];
            let { image } = this.state;
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: 'WEB_DETECTION', maxResults: 10 }
                        ],
                        image: {
                            source: {
                                imageUri: image
                            }
                        }
                    }
                ]
            });
            let response = await fetch(
                'https://vision.googleapis.com/v1/images:annotate?key=' +
                Environment['GOOGLE_CLOUD_VISION_API_KEY'],
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: body
                }
            );
            let responseJson = await response.json();
            console.log(responseJson.responses);
            let analyzerResponses = [];
            let errorResponses = ['Food', 'Bun', 'Ingredient', 'Staple food', 'Recipe', 'Fast food', 'Baked goods',
                'Cuisine', 'Tableware', 'Sandwich', 'Plate', 'Dishware', 'Dish', 'Produce', 'European cuisine',
                'Flammekueche', 'Vegetarian cuisine', 'Dish Network', 'Mitsui cuisine M', 'Jamaican cuisine',
                'Meal', 'Salad', 'Meal preparation', 'Dinner', 'Lunch', 'Restaurant', 'Healthy diet', 'Low-carbohydrate diet',
                'Ketogenic diet'];

            // filter the analyzer response
            if (responseJson.responses && responseJson.responses[0] && responseJson.responses[0].webDetection ) {
                responseJson.responses[0].webDetection.webEntities.forEach((item) => {
                    if (errorResponses.indexOf(item.description) < 0) {
                        analyzerResponses.push(item);
                        console.log('Added to Analyzer: ' + item.description);
                    }
                });
            }

            let detectedFood = analyzerResponses[0] ? analyzerResponses[0].description : 'Hamburger';

            // Get nutrients details
            let nutrientsResponse = await fetch(
                'https://api.edamam.com/api/recipes/v2?app_id=a69a1703&app_key=f6893e16edff060f03f0273ef47c22d0&type=public&q=' + detectedFood,
                {
                    headers: {
                        "Accept-Encoding": 'gzip'
                    },
                    method: 'GET'
                }
            );
            let nutrientsJSON = await nutrientsResponse.json();
            let nutrientsTableData = [
                [nutrientsJSON.hits[0].recipe.totalNutrients["CHOCDF"].label, nutrientsJSON.hits[0].recipe.totalNutrients["CHOCDF"].quantity.toFixed(2), nutrientsJSON.hits[0].recipe.totalNutrients["CHOCDF"].unit],
                [nutrientsJSON.hits[0].recipe.totalNutrients["ENERC_KCAL"].label, nutrientsJSON.hits[0].recipe.totalNutrients["ENERC_KCAL"].quantity.toFixed(2), nutrientsJSON.hits[0].recipe.totalNutrients["ENERC_KCAL"].unit],
                [nutrientsJSON.hits[0].recipe.totalNutrients["SUGAR"].label, nutrientsJSON.hits[0].recipe.totalNutrients["SUGAR"].quantity.toFixed(2), nutrientsJSON.hits[0].recipe.totalNutrients["SUGAR"].unit],
                [nutrientsJSON.hits[0].recipe.totalNutrients["FASAT"].label, nutrientsJSON.hits[0].recipe.totalNutrients["FASAT"].quantity.toFixed(2), nutrientsJSON.hits[0].recipe.totalNutrients["FASAT"].unit],
                [nutrientsJSON.hits[0].recipe.totalNutrients["PROCNT"].label, nutrientsJSON.hits[0].recipe.totalNutrients["PROCNT"].quantity.toFixed(2), nutrientsJSON.hits[0].recipe.totalNutrients["PROCNT"].unit],
                [nutrientsJSON.hits[0].recipe.totalNutrients["NA"].label, nutrientsJSON.hits[0].recipe.totalNutrients["NA"].quantity.toFixed(2), nutrientsJSON.hits[0].recipe.totalNutrients["NA"].unit],
            ];

            this.setState({
                googleResponse: analyzerResponses,
                nutrientsResponse: nutrientsJSON.hits[0].recipe.totalNutrients,
                uploading: true,
                tableHead: ['Nutrient', 'Quantity', 'Unit'],
                tableData: nutrientsTableData,
                detectedFood: detectedFood,
                loading: false,
                restaurantsListView: []
            });
            console.log(this.state.tableData);
            this.getCurrentLocationAndRestaurantsInYourArea();
        } catch (error) {
            console.log(error);
        }
    };

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

    saveAnalyzedFoodData = (restaurantsInYourArea) => {
        const dateObj = new Date();
        const month = dateObj.getMonth();
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        const output = day + '/' + month + '/' + year;

        let id = Date.now();
        firebase.database().ref('/analyzed_food/' + id).set({
            image: this.state.image,
            food: this.state.detectedFood,
            nutrients: this.state.tableData,
            restaurantsList: restaurantsInYourArea,
            recommendedDrink: this.state.recommendedDrink,
            recommendedFood: this.state.recommendedFood,
            date: output,
            user: this.state.currentUser.uid,
            id: id
        }).then(snapshot => {
            // console.log('Snapshot', snapshot);
        });
        // add to history
        firebase.database().ref('/history/' + id).set({
            image: this.state.image,
            food: this.state.detectedFood,
            nutrients: this.state.tableData,
            restaurantsList: restaurantsInYourArea,
            recommendedDrink: this.state.recommendedDrink,
            recommendedFood: this.state.recommendedFood,
            date: output,
            user: this.state.currentUser.uid,
            id: id
        }).then(snapshot => {
            // console.log('Snapshot', snapshot);
        });
    };

    addToFavorites(restaurantsInYourArea) {
        const dateObj = new Date();
        const month = dateObj.getMonth();
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        const output = day + '/' + month + '/' + year;

        let id = Date.now();
        firebase.database().ref('/favorites/' + id).set({
            image: this.state.image,
            food: this.state.detectedFood,
            nutrients: this.state.tableData,
            restaurantsList: restaurantsInYourArea,
            recommendedDrink: this.state.recommendedDrink,
            recommendedFood: this.state.recommendedFood,
            date: output,
            user: this.state.currentUser.uid,
            id: id
        }).then(snapshot => {
            // console.log('Snapshot', snapshot);
        });
    }
}

async function uploadImageAsync(uri) {
    // se crează elementul blobb
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    // se încarcă imaginea în Firebase Storage
    const ref = firebase
        .storage()
        .ref()
        .child(uuid.v4());
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 10
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center'
    },
    contentContainer: {
        paddingTop: 30
    },

    getStartedContainer: {
        alignItems: 'center',
        padding: 10
    },

    getStartedText: {
        fontSize: 25,
        color: '#777777',
        fontWeight: 'bold',
        lineHeight: 24,
        textAlign: 'center'
    },

    helpContainer: {
        marginTop: 15
    },

    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },

    restaurantsView: {
        marginTop: 15,
        marginBottom: 15
    },

    restaurantContainer: {

    },

    restaurantImage: {

    },

    loading: {
        marginTop: 350,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center'
    },

    goBackButton: {
        width: 40,
        height: 40,
        backgroundColor: '#4285F4',
        alignItems: 'center',
        padding: 5,
        color: 'white',
        borderRadius: 50,
        marginTop: 10,
        marginLeft: 10
    },

    imageSelectorButton: {
        backgroundColor: '#4285F4',
        alignItems: 'center',
        padding: 5,
        color: 'white',
        borderRadius: 20,
        marginLeft: 60,
        marginTop: 10
    }
});
