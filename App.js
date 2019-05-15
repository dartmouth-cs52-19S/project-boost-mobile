import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Provider } from 'react-redux';

import * as firebase from 'firebase';
import {
  firebase_apiKey,
  firebase_authDomain,
  firebase_databaseURL,
  firebase_projectId,
  firebase_storageBucket,
  firebase_messagingSenderId,
} from 'react-native-dotenv';
import AppNavigator from './navigation/AppNavigator';
import store from './state/create_store';

const FireBaseConfig = {
  apiKey: firebase_apiKey.slice(0, -2),
  authDomain: firebase_authDomain.slice(0, -2),
  databaseURL: firebase_databaseURL.slice(0, -2),
  projectId: firebase_projectId.slice(0, -2),
  storageBucket: firebase_storageBucket.slice(0, -2),
  messagingSenderId: firebase_messagingSenderId.slice(0, -2),
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false,
    };

    // initialize firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(FireBaseConfig);
    }

    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  render() {
    if (
      (!this.state.isLoadingComplete || !this.state.isAuthenticationReady) &&
      !this.props.skipLoadingScreen
    ) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        </Provider>
      );
    }
  }

  onAuthStateChanged = user => {
    if (user) {
      this.setState({
        isAuthenticationReady: true,
        isAuthenticated: true,
      });
    } else {
      if (this.state.isAuthenticationReady) {
        this.setState(
          {
            isAuthenticationReady: false,
            isAuthenticated: false,
          },
          () => {
            this.setState({
              isAuthenticationReady: true,
            });
          }
        );
      } else {
        this.setState({
          isAuthenticationReady: true,
          isAuthenticated: false,
        });
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
