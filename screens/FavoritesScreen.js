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
            noFavorites: true,
            loading: false
        }
    }

    changeModalState(value) {
        this.setState({modalShow: value});
    }

    openModal(foodItem) {
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
            return (
                <SafeAreaView style={styles.container}>
                    {/*More details Modal*/}
                    <Modal animationType="slide"
                           transparent={true}
                           visible={this.state.modalShow}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>{this.state.foodItem.food}</Text>
                                <Image style={{width: 75, height: 75, borderRadius: 50}} source={{uri: 'https://simply-delicious-food.com/wp-content/uploads/2021/03/Sesame-chicken-salad-3.jpg'}}/>
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
                                        <Text style={{color: '#777777', fontWeight: 'bold', textAlign: 'center', marginBottom: 5}}>Nutrients</Text>
                                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                            <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                                            <Rows data={this.state.foodItem.nutrients} textStyle={styles.text}/>
                                        </Table>
                                    </View>
                                    <Text style={{fontWeight: 'bold', color: '#777777'}}>Our recommendation:</Text>
                                    <Text style={{color: '#777777'}}>This dish goes well with Fresh Juice and some Bread on the side.</Text>
                                    <Text style={{color: '#777777', fontWeight: 'bold', marginTop: 5}}>Restaurants in your area that serve this food:</Text>
                                    <ScrollView style={{maxHeight: 130, marginTop: 5}}>
                                        <View style={{marginTop: 5, borderBottomColor: '#dddddd', borderBottomWidth: 1, padding: 5}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Image style={{width: 50, height: 50}} source={{uri: 'https://cdn3.vectorstock.com/i/1000x1000/12/02/restaurant-menu-icon-vector-4731202.jpg'}}/>
                                                <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10, marginLeft: 15}}>Nordsee</Text>
                                                <TouchableRipple style={{backgroundColor: '#4285F4', color: 'white', paddingBottom: 5, paddingTop: 5, alignItems: 'center', borderRadius: 50, width: 120, height: 35, marginLeft: 30, marginTop: 5}} onPress={() => Linking.openURL('google.navigation:q=Șoseaua București-Ploiești 42D')}>
                                                    <Text style={{color: 'white', fontWeight: 'bold'}}>Navigate <Icon name="google-maps" color="white" size={20}/></Text>
                                                </TouchableRipple>
                                            </View>
                                            <Text style={{color: '#777777'}}><Text style={{fontWeight: 'bold'}}>Location:</Text> Șoseaua București-Ploiești 42D, București -  <Text style={{fontWeight: 'bold'}}>2.6 km from your current location</Text></Text>
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
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>Your Favorite Dishes</Text>
                    </View>
                    <ScrollView style={styles.foodsContainer}>
                        <View style={styles.foodItem}>
                            <Image style={styles.foodImage} source={{uri: 'https://simply-delicious-food.com/wp-content/uploads/2021/03/Sesame-chicken-salad-3.jpg'}}/>
                            <View style={{marginLeft: 15}}>
                                <View style={{flexDirection: 'row', marginLeft: 50}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>Chicken salad</Text>
                                    <TouchableRipple onPress={() => {}}>
                                        <Icon name="heart" color="#4285F4" size={25} style={{padding: 2}} />
                                    </TouchableRipple>
                                </View>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777' , fontSize: 15}}>450 kcal</Text>
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777', fontSize: 15}}>27/08/2021</Text>
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
                            <Image style={styles.foodImage} source={{uri: 'data:image/jpeg;base64,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'}}/>
                            <View style={{marginLeft: 15}}>
                                <View style={{flexDirection: 'row', marginLeft: 50}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#777777', textAlign: 'center', marginRight: 15}}>Fried shrimps</Text>
                                    <TouchableRipple onPress={() => {}}>
                                        <Icon name="heart" color="#4285F4" size={25} style={{padding: 2}} />
                                    </TouchableRipple>
                                </View>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calculator-variant" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777' , fontSize: 15}}>1108 kcal</Text>
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Icon name="calendar" color="#4285F4" size={25} style={{marginRight: 10, marginLeft: 50}}/>
                                    <Text style={{color: '#777777', fontSize: 15}}>24/08/2021</Text>
                                </View>
                                <TouchableRipple onPress={() => {this.changeModalState(true);}} style={{padding: 5, marginTop: 5, marginLeft: 45}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name="unfold-more-vertical" color="#4285F4" size={25}/>
                                        <Text style={{color: '#4285F4', fontWeight: 'bold', marginLeft: 10, fontSize: 15}}>More details</Text>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
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
