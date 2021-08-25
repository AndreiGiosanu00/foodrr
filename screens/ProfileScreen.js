import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class ProfileScreen extends Component {

    render() {
        return (
            <SafeAreaView style={styles.container}>

                <View style={styles.userInfoSection}>
                    <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Avatar.Image
                            source={{
                                uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
                            }}
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
                        <Title>1200 kcal</Title>
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
                            <Text style={styles.menuItemText}>Change your profile details</Text>
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
});
