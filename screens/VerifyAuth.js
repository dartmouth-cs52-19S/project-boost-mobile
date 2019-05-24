import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
// import { red } from 'ansi-colors';
import { blue } from 'ansi-colors';
import * as api from '../datastore/api_requests';
import loadingGIF from '../assets/gifs/loading.gif';

import { setUserData } from '../state/actions';

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    api
      .getUserInfo(firebase.auth().currentUser.uid)
      .then(response => {
        if (!Object.keys(response).includes('homeLocation')) {
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
          <View styles={styles.loadingContainer}>
            <Image styles={styles.loagingGIF} source={loadingGIF} alt="Loading..." />
          </View>

          <TouchableOpacity
            onPress={() => {
              firebase.auth().signOut();
            }}>
            <Text style={styles.signOutButton}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 300,
  },
  loadingGIF: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    fontFamily: 'Raleway-Light',
    fontSize: 20,
    padding: 10,
    backgroundColor: '#293C44',
    color: '#e5e5e5',
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
