import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, Image} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from "react-native-gesture-handler";

class FavoritesScreen extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={{fontWeight: 'bold', fontSize: 25}}>Your Favorite Dishes</Text>
                </View>
                <ScrollView style={styles.foodsContainer}>
                    <View style={styles.foodItem}>
                        <Image style={styles.foodImage} source={require('../assets/foodrr-logo.png')}/>
                        <View style={{marginLeft: 15}}>
                            <View style={{flexDirection: 'row', marginLeft: 50}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>Pizza</Text>
                                <TouchableRipple onPress={() => {}}>
                                    <Icon name="heart" color="#4285F4" size={25} style={{padding: 2}} />
                                </TouchableRipple>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                            </View>

                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                            </View>
                            <TouchableRipple onPress={() => {}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
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
                            <View style={{flexDirection: 'row', marginLeft: 50}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>Pizza</Text>
                                <TouchableRipple onPress={() => {}}>
                                    <Icon name="heart" color="#4285F4" size={25} style={{padding: 2}} />
                                </TouchableRipple>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                            </View>

                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                            </View>
                            <TouchableRipple onPress={() => {}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
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
                            <View style={{flexDirection: 'row', marginLeft: 50}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>Pizza</Text>
                                <TouchableRipple onPress={() => {}}>
                                    <Icon name="heart" color="#4285F4" size={25} style={{padding: 2}} />
                                </TouchableRipple>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                            </View>

                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                            </View>
                            <TouchableRipple onPress={() => {}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
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
                            <View style={{flexDirection: 'row', marginLeft: 50}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>Pizza</Text>
                                <TouchableRipple onPress={() => {}}>
                                    <Icon name="heart" color="#4285F4" size={25} style={{padding: 2}} />
                                </TouchableRipple>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777' , fontSize: 15}}>1600 kcal</Text>
                            </View>

                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                <Text style={{color: '#777777', fontSize: 15}}>25/08/2021</Text>
                            </View>
                            <TouchableRipple onPress={() => {}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                    <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
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
    }
});
