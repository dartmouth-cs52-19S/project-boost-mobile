import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import * as api from '../datastore/api_requests';

import { setUserData } from '../state/actions';

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    api
      .getUserInfo(firebase.auth().currentUser.uid)
      .then(response => {
        if (response.homeLocation.length === 0) {
          this.props.setUserData(response);
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

const mapDispatchToProps = dispatch => {
  return {
    setUserData: object => {
      dispatch(setUserData(object));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(VerifyAuth);
