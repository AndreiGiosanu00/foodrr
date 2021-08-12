import React, {Component} from "react";
import {StyleSheet} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from "./ProfileScreen";
import HistoryScreen from "./HistoryScreen";
import DashboardScreen from "./DashboardScreen";
import {createStackNavigator} from "@react-navigation/stack";
import FavoritesScreen from "./FavoritesScreen";

const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();

class BottomTabs extends Component {
    render() {
        return (
            <Tab.Navigator
                initialRouteName="Foodrr - Dashboard"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={DashboardStackScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        )
                    }}
                />
                <Tab.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="FavoritesScreen"
                    component={FavoritesScreen}
                    options={{
                        tabBarLabel: 'Favorites',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="heart" color={color} size={size} />
                        ),
                    }}
                    style={{display: 'none'}}
                />
                <Tab.Screen
                    name="HistoryScreen"
                    component={HistoryScreen}
                    options={{
                        tabBarLabel: 'History',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="history" color={color} size={size} />
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

export default BottomTabs;

const DashboardStackScreen = ({navigation}) => (
    <DashboardStack.Navigator screenOptions={{
        headerShown: false
    }}>
        <DashboardStack.Screen name="Home" component={DashboardScreen} />
    </DashboardStack.Navigator>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
