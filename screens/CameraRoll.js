import React from 'react';
import {
    ActivityIndicator,
    Button,
    Clipboard,
    FlatList,
    Image,
    Share,
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

export default class CameraRoll extends React.Component {
    latitude = 0;
    longitude = 0;
    restaurantsInYourArea = [];

    constructor() {
        super();
        this.state = {
            image: null,
            uploading: false,
            googleResponse: null,
            tableHead: ['Nutrient', 'Quantity', 'Unit'],
            tableData: [],
            loading: false
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
            '&radius=2500&type=restaurant&keyword=' + this.state.detectedFood + '&key=AIzaSyDlbePn-1ooGqbMQdNb-2YQlv1JplGbxI4';
        fetch(restaurantsInMyArea)
            .then((response) => response.json())
            .then((JsonResponse) => {
                let i = 0;
                console.log(JsonResponse.results);
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
                this.setState({loading: false});
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
                    <View style={styles.getStartedContainer}>
                        {image ? null : (
                            <Text style={styles.getStartedText}>Foodrr</Text>
                        )}
                    </View>

                    <View style={styles.helpContainer}>
                        <Button
                            onPress={this._pickImage}
                            title="Pick an image from camera roll"
                        />

                        <Button onPress={this._takePhoto} title="Take a photo" />
                        {this.state.nutrientsResponse && (
                            <View style={styles.container}>
                                <Text>In your image it's a dish that contains {this.state.detectedFood}</Text>
                                <Text>Nutrients:</Text>
                                <View style={styles.container}>
                                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                        <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                                        <Rows data={this.state.tableData} textStyle={styles.text}/>
                                    </Table>
                                </View>
                            </View>
                        )}
                        {this._maybeRenderImage()}
                        {this._maybeRenderUploadingOverlay()}
                        {this._maybeRenderRestaurantsList()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    organize = array => {
        return array.map(function(item, i) {
            return (
                <View key={i}>
                    <Text>{item}</Text>
                </View>
            );
        });
    };

    _maybeRenderRestaurantsList = () => {
      if (this.state.nutrientsResponse)  {
         this.state.restaurantsListView = [];
          this.restaurantsInYourArea.forEach(restaurant => {
              this.state.restaurantsListView.push(
                  <View style={styles.restaurantContainer}>
                      <Image style={{width: 120, height: 120}} source={{uri: restaurant.icon}}/>
                      <Text>{restaurant.name}</Text>
                      <Text>Location: {restaurant.vicinity}</Text>
                      <Button title={'Go to restaurant'} onPress={() => Linking.openURL('google.navigation:q=' + restaurant.name)}/>
                  </View>
              );
          });
          return (
              <View style={styles.restaurantsView}>
                  <Text>Restaurants in your area that server this dish:</Text>
                  {this.state.restaurantsListView}
              </View>
          );
      }

      return;
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
                    width: 250,
                    borderRadius: 3,
                    elevation: 2
                }}
            >
                <Button
                    style={{ marginBottom: 10 }}
                    onPress={() => this.submitToGoogle()}
                    title="Analyze your image!"
                />

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
                    <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
                </View>
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
                            { type: 'LABEL_DETECTION', maxResults: 10 },
                            { type: 'LANDMARK_DETECTION', maxResults: 5 },
                            { type: 'FACE_DETECTION', maxResults: 5 },
                            { type: 'LOGO_DETECTION', maxResults: 5 },
                            { type: 'TEXT_DETECTION', maxResults: 5 },
                            { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
                            { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
                            { type: 'IMAGE_PROPERTIES', maxResults: 5 },
                            { type: 'CROP_HINTS', maxResults: 5 },
                            { type: 'WEB_DETECTION', maxResults: 5 }
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
            // console.log(responseJson);
            let analyzerResponses = [];
            let errorResponses = ['Food', 'Bun', 'Ingredient', 'Staple food', 'Recipe', 'Fast food', 'Baked goods', 'Cuisine', 'Tableware', 'Sandwich'];

            // filter the analyzer response
            if (responseJson.responses && responseJson.responses[0] && responseJson.responses[0].labelAnnotations ) {
                responseJson.responses[0].labelAnnotations.forEach((item) => {
                    if (errorResponses.indexOf(item.description) < 0) {
                        analyzerResponses.push(item);
                        console.log('Added to Analyzer: ' + item.description);
                    }
                });
            }

            let detectedFood = analyzerResponses[0] ? analyzerResponses[0].description : 'Hamburger';

            // Get nutrients details
            let nutrientsResponse = await fetch(
                'https://api.edamam.com/api/recipes/v2?app_id=8ea76b8a&app_key=d1e291d291d34d9d2eb4b26fddd3cbc1&type=public&q=' + detectedFood,
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
                uploading: false,
                tableHead: ['Nutrient', 'Quantity', 'Unit'],
                tableData: nutrientsTableData,
                detectedFood: detectedFood,
                loading: false,
                restaurantsListView: []
            });
            this.getCurrentLocationAndRestaurantsInYourArea();

        } catch (error) {
            console.log(error);
        }
    };
}

async function uploadImageAsync(uri) {
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
        marginVertical: 15,
        alignItems: 'center',
        marginHorizontal: 50
    },

    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center'
    },

    helpContainer: {
        marginTop: 15,
        alignItems: 'center'
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
    }
});
