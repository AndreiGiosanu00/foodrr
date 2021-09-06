import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, Modal, Image, Linking, Dimensions} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple, TextInput,
} from 'react-native-paper';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from "firebase";

const {width, height} = Dimensions.get('window');

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileModalShow: false,
            chartModalShow: false,
            loading: false,
            currentUser: firebase.auth().currentUser,
            displayUser: {
                name: '',
                location: '',
                phone: '',
                email: '',
                photo: '',
                username: ''
            },
            totalCaloriesPerDay: 0,
            totalScans: 0
        };
    }

    componentDidMount() {
        firebase.database().ref('/analyzed_food/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    this.state.analyzedFood = Object.values(snapshot.val());
                    let totalCalories = 0;
                    this.state.analyzedFood.forEach(foodItem => {
                        if (foodItem.user === this.state.currentUser.uid) {
                            this.state.totalScans++;
                            if (foodItem.date === '06/8/2021') {
                                this.state.totalCaloriesPerDay += (+foodItem.nutrients[1][1]);
                            }
                        }
                    });
                    this.setState({loading: false, profileModalShow: false, displayUser: {
                            name: this.state.currentUser.displayName,
                            location: 'Bucharest, Romania',
                            phone: '+40 753 844 087',
                            email: this.state.currentUser.email,
                            username: this.createUsername(),
                            totalCaloriesPerDay: totalCalories
                        }});
                } else {
                    this.setState({loading: false, profileModalShow: false, displayUser: {
                            name: this.state.currentUser.displayName,
                            location: 'Bucharest, Romania',
                            phone: '+40 753 844 087',
                            email: this.state.currentUser.email,
                            username: this.createUsername(),
                            totalCaloriesPerDay: 0
                        }});
                }
            });
    }

    changeModalState(state) {
        this.setState({profileModalShow: state, displayUser: {
                name: this.state.currentUser.displayName,
                location: 'Bucharest, Romania',
                phone: '+40 753 844 087',
                email: this.state.currentUser.email,
                username: this.createUsername()
            }});
    }

    changeChartModalState(state) {
        this.setState({chartModalShow: state});
    }

    createUsername() {
        let names = this.state.currentUser.displayName.split(' ');
        let username = names[0][0].toLowerCase() + names[1].toLowerCase();
        return username;
    }

    render() {
        let modalTrigger = [
            <TouchableRipple onPress={() => {this.changeModalState(true)}}>
                <View style={styles.menuItem}>
                    <Icon name="account-check-outline" color="#4285F4" size={25}/>
                    <Text style={styles.menuItemText}>Change your profile details</Text>
                </View>
            </TouchableRipple>
        ];
        return (
            <SafeAreaView style={styles.container}>
                {/*kcal chart*/}
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.chartModalShow}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{color: '#777777', fontWeight: 'bold', textAlign: 'center', fontSize: 20}}>Your last week calories report</Text>
                            <TouchableRipple
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.changeChartModalState(false)}
                            >
                                <Icon name="close" color="white" size={15}/>
                            </TouchableRipple>
                            <View style={styles.modalContent}>
                                <Text style={{textAlign: 'center', color: '#777777'}}>Below is presented a chart that contains data from the last week using Foodrr application.
                                    Please consider that the values are rounded to have a clear view of the chart.
                                </Text>
                                <Text style={{marginTop: 15, color: '#777777', fontWeight: 'bold', fontSize: 15, textAlign: 'center'}}>@{this.state.displayUser.username}'s calories chart</Text>
                                <LineChart
                                    data={{
                                        labels: ["02/09", "03/09", "04/09", "05/09", "Yesterday", "Today"],
                                        datasets: [
                                            {
                                                data: [
                                                    0,
                                                    0,
                                                    1375,
                                                    840,
                                                    2590.32,
                                                    this.state.totalCaloriesPerDay
                                                ]
                                            }
                                        ]
                                    }}
                                    width={Dimensions.get("window").width - 30} // from react-native
                                    height={350}
                                    yAxisSuffix="kcal"
                                    yAxisInterval={1} // optional, defaults to 1
                                    chartConfig={{
                                        backgroundColor: "#4285F4",
                                        backgroundGradientFrom: "#4285F4",
                                        backgroundGradientTo: "#4285F4",
                                        decimalPlaces: 0, // optional, defaults to 2dp
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: "6",
                                            strokeWidth: "2",
                                            stroke: "#777777"
                                        }
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/*Change user data Modal*/}
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.profileModalShow}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{color: '#777777', fontWeight: 'bold', textAlign: 'center', fontSize: 20}}>Change your profile details</Text>
                            <TouchableRipple
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.changeModalState(false)}
                            >
                                <Icon name="close" color="white" size={15}/>
                            </TouchableRipple>
                            <View style={styles.modalContent}>
                                <Text style={styles.inputLabel}>Your name</Text>
                                <TextInput placeholder={'Name...'} style={styles.textInput} value={this.state.displayUser.name}/>
                                <Text style={styles.inputLabel}>Your username</Text>
                                <TextInput placeholder={'Username...'} style={styles.textInput} value={this.state.displayUser.username}/>
                                <Text style={styles.inputLabel}>Your location</Text>
                                <TextInput placeholder={'Location...'} style={styles.textInput} value={this.state.displayUser.location}/>
                                <Text style={styles.inputLabel}>Your email</Text>
                                <TextInput placeholder={'Email...'} style={styles.textInput} value={this.state.displayUser.email}/>
                                <Text style={styles.inputLabel}>Your new password</Text>
                                <TextInput placeholder={'New Password...'} style={styles.textInput}/>
                                <Text style={styles.inputLabel}>Please confirm your new password</Text>
                                <TextInput placeholder={'Confirm New Password...'} style={styles.textInput} />
                                <TouchableRipple style={[styles.buttonClose, {padding: 5, width: 100, alignItems: 'center', borderRadius: 25, marginLeft: 125}]}>
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>Submit</Text>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.userInfoSection}>
                    <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Avatar.Image
                            source={require('../assets/profile.jpeg')}
                            size={80}
                        />
                        <View style={{marginLeft: 20}}>
                            <Title style={[styles.title, {
                                marginTop:15,
                                marginBottom: 5,
                            }]}>{this.state.displayUser.name}</Title>
                            <Caption style={styles.caption}>@{this.state.displayUser.username}</Caption>
                        </View>
                    </View>
                </View>

                <View style={styles.userInfoSection}>
                    <View style={styles.row}>
                        <Icon name="map-marker-radius" color="#777777" size={20}/>
                        <Text style={{color:"#777777", marginLeft: 20}}>{this.state.displayUser.location}</Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="phone" color="#777777" size={20}/>
                        <Text style={{color:"#777777", marginLeft: 20}}>+40 753 844 087</Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="email" color="#777777" size={20}/>
                        <Text style={{color:"#777777", marginLeft: 20}}>{this.state.displayUser.email}</Text>
                    </View>
                </View>

                <View style={styles.infoBoxWrapper}>
                    <View style={[styles.infoBox, {
                        borderRightColor: '#dddddd',
                        borderRightWidth: 1
                    }]}>
                        <TouchableRipple onPress={() => {this.changeChartModalState(true)}}>
                            <Title>{this.state.totalCaloriesPerDay} kcal</Title>
                        </TouchableRipple>
                        <Caption>Today's kcal</Caption>
                    </View>
                    <View style={styles.infoBox}>
                        <Title>{this.state.totalScans}</Title>
                        <Caption>Total scans</Caption>
                    </View>
                </View>

                <View style={styles.menuWrapper}>
                    <TouchableRipple onPress={() => {this.props.navigation.navigate('FavoritesScreen')}}>
                        <View style={styles.menuItem}>
                            <Icon name="heart-outline" color="#4285F4" size={25}/>
                            <Text style={styles.menuItemText}>Your Favorites</Text>
                        </View>
                    </TouchableRipple>
                    {modalTrigger}
                </View>
            </SafeAreaView>
        );
    }
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBoxWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuWrapper: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    menuItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
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
        marginTop: 30
    },

    textInput: {
        width: 350,
        height: 30,
        borderRadius: 10,
        padding: 5,
        marginBottom: 15,
        marginTop: 5
    },

    inputLabel: {
        fontWeight: 'bold',
        color: '#777777',
    }
});
