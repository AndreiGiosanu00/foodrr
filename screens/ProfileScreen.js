import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, Modal, Image, Linking, Dimensions} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple, TextInput,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Row, Rows, Table} from "react-native-table-component";
import {ScrollView} from "react-native-gesture-handler";

const {width, height} = Dimensions.get('window');

class ProfileScreen extends Component {
    state = {
        modalShow: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentDidMount() {
    }


    changeModalState(value) {
        this.state.modalShow = value;
    }

    closeModal() {
        this.state.modalShow = false;
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {/*Change user data Modal*/}
                <Modal animationType="slide"
                       transparent={true}
                       visible={this.state.modalShow}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{color: '#777777', fontWeight: 'bold', textAlign: 'center', fontSize: 20}}>Change your profile details</Text>
                            <TouchableRipple
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.closeModal()}
                            >
                                <Icon name="close" color="white" size={15}/>
                            </TouchableRipple>
                            <View style={styles.modalContent}>
                                <Text style={styles.inputLabel}>Your name</Text>
                                <TextInput placeholder={'Andrei Giosanu'} style={styles.textInput} value={'Andrei Giosanu'}/>
                                <Text style={styles.inputLabel}>Your username</Text>
                                <TextInput placeholder={'agiosanu'} style={styles.textInput} value={'agiosanu'}/>
                                <Text style={styles.inputLabel}>Your location</Text>
                                <TextInput placeholder={'Bucharest, Romania'} style={styles.textInput} value={'Bucharest, Romania'}/>
                                <Text style={styles.inputLabel}>Your email</Text>
                                <TextInput placeholder={'Email'} style={styles.textInput} value={'andreigiosanu0@gmail.com'}/>
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
                            }]}>Andrei Giosanu</Title>
                            <Caption style={styles.caption}>@agiosanu</Caption>
                        </View>
                    </View>
                </View>

                <View style={styles.userInfoSection}>
                    <View style={styles.row}>
                        <Icon name="map-marker-radius" color="#777777" size={20}/>
                        <Text style={{color:"#777777", marginLeft: 20}}>Bucharest, Romania</Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="phone" color="#777777" size={20}/>
                        <Text style={{color:"#777777", marginLeft: 20}}>+40 753 844 087</Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="email" color="#777777" size={20}/>
                        <Text style={{color:"#777777", marginLeft: 20}}>andreigiosanu0@gmail.com</Text>
                    </View>
                </View>

                <View style={styles.infoBoxWrapper}>
                    <View style={[styles.infoBox, {
                        borderRightColor: '#dddddd',
                        borderRightWidth: 1
                    }]}>
                        <Title>450 kcal</Title>
                        <Caption>Today's kcal</Caption>
                    </View>
                    <View style={styles.infoBox}>
                        <Title>7</Title>
                        <Caption>Total scans</Caption>
                    </View>
                </View>

                <View style={styles.menuWrapper}>
                    <TouchableRipple onPress={() => {}}>
                        <View style={styles.menuItem}>
                            <Icon name="heart-outline" color="#4285F4" size={25}/>
                            <Text style={styles.menuItemText}>Your Favorites</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => {}}>
                        <View style={styles.menuItem}>
                            <Icon name="account-check-outline" color="#4285F4" size={25}/>
                            <TouchableRipple onPress={this.changeModalState(true)}>
                                <Text style={styles.menuItemText}>Change your profile details</Text>
                            </TouchableRipple>
                        </View>
                    </TouchableRipple>
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
