import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    console.log('!!!!!');
    console.log('grab data about user from mongo');
    console.log(
      "if the data from mongo says we don't have their initial setup info, route them to ProvideInitialInfo"
    );
    console.log('else, route them to App');
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text>Loading...</Text>

          <Text
            style={{ marginTop: 50, textAlign: 'center', marginHorizontal: 25, marginBottom: 50 }}>
            the following buttons are temporary until we have the server routes created for users
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ProvideInitialInfo');
            }}>
            <Text style={{ textAlign: 'center', margin: 15 }}>
              if the data from mongo says we don't have their initial setup info, auto-navigate to
              ProvideInitialInfo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('App');
            }}>
            <Text>else route them straight to App</Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 50 }}>Proof of concept:</Text>
          <TouchableOpacity
            onPress={() => {
              firebase.auth().signOut();
            }}>
            <Text>sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
  },
});
