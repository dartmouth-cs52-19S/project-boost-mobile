import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import LoginScreen from '../screens/LoginScreen';
import VerifyAuthScreen from '../screens/VerifyAuth';
import ProvideInitialInfoScreen from '../screens/ProvideInitialInfoScreen';

const AuthStack = createStackNavigator({
  Login: LoginScreen,
});

const GetInfoStack = createStackNavigator({
  VerifyAuth: VerifyAuthScreen,
  ProvideInitialInfo: ProvideInitialInfoScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthStack,
      GetInfo: GetInfoStack,
      App: MainTabNavigator,
    },
    {
      initialRouteName: 'Auth',
    }
  )
);
