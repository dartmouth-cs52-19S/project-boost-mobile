import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SurveyScreen from '../screens/SurveyScreen';
import DataScreen from '../screens/DataScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: SurveyScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Survey',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="edit-location" />,
};

const LinksStack = createStackNavigator({
  Links: DataScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Data',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="insert-chart" />,
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="settings" />,
};

const BottomTabNavigatorConfig = {
  tabBarOptions: {
    activeTintColor: 'white',
    activeBackgroundColor: '#1A262B',
    labelStyle: {
      fontFamily: 'Raleway-Light',
      fontSize: 16,
      paddingBottom: 25,
    },
    tabStyle: {
      height: 85,
      paddingTop: 5,
    },
    style: {
      backgroundColor: '#293C44',
    },
  },
};

export default createBottomTabNavigator(
  {
    HomeStack,
    LinksStack,
    SettingsStack,
  },
  BottomTabNavigatorConfig
);
