import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from "firebase";

export function DrawerContent(props) {
    let state = {
        totalCaloriesPerDay: 0,
        totalScans: 0,
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
    };

    firebase.database().ref('/analyzed_food/')
        .on('value', snapshot => {
            if (snapshot.val() !== null) {
                state.analyzedFood = Object.values(snapshot.val());
                state.analyzedFood.forEach(foodItem => {
                    if (foodItem.user === firebase.auth().currentUser.uid) {
                        state.totalScans++;
                        if (foodItem.date === '06/8/2021') {
                            state.totalCaloriesPerDay += (+foodItem.nutrients[1][1]);
                        }
                    }
                });
                state = {
                    loading: false, profileModalShow: false, displayUser: {
                        name: state.currentUser.displayName,
                        location: 'Bucharest, Romania',
                        phone: '+40 753 844 087',
                        email: state.currentUser.email,
                        username: createUsername(),
                        totalCaloriesPerDay: state.totalCaloriesPerDay
                    }
                };
                let primaryView = [

                ];
            } else {
                state = {
                    loading: false, profileModalShow: false, displayUser: {
                        name: 'Andrei Giosanu',
                        location: 'Bucharest, Romania',
                        phone: '+40 753 844 087',
                        email: 'andreigiosanu0@gmail.com',
                        username: createUsername(),
                        totalCaloriesPerDay: 0
                    }
                };
            }
        });

    const paperTheme = useTheme();

    function createUsername() {
        let names = state.currentUser.displayName.split(' ');
        let username = names[0][0].toLowerCase() + names[1].toLowerCase();
        return username;
    }

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image
                                source={require('../assets/profile.jpeg')}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{state.displayUser.name}</Title>
                                <Caption style={styles.caption}>@{state.displayUser.username}</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Paragraph style={[styles.paragraph, styles.caption]}>Today: </Paragraph>
                            <Caption style={styles.caption}>5481.22 Kcal</Caption>
                        </View>
                        <View style={styles.row}>
                            <Paragraph style={[styles.paragraph, styles.caption]}>Average: </Paragraph>
                            <Caption style={styles.caption}>1960 Kcal</Caption>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                    name="account-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('ProfileScreen')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                    name="heart-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Favorites"
                            onPress={() => {props.navigation.navigate('FavoritesScreen')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                    name="history"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="History"
                            onPress={() => {props.navigation.navigate('HistoryScreen')}}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon
                            name="exit-to-app"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {firebase.auth().signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    paragraph: {
        fontWeight: 'bold',
        alignItems: 'center'
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
