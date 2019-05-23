import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { fetchUserInfo } from '../state/actions/index';

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.props
      .fetchUserInfo(firebase.auth().currentUser.uid)
      .then(response => {
        if (!Object.keys(response).includes('homeLocation')) {
          this.props.navigation.navigate('ProvideInitialInfo');
        } else {
          this.props.navigation.navigate('App');
        }
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text>Loading...</Text>

          <TouchableOpacity
            onPress={() => {
              firebase.auth().signOut();
            }}>
            <Text style={{ marginTop: 50 }}>sign out</Text>
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

export default connect(
  null,
  { fetchUserInfo }
)(VerifyAuth);
