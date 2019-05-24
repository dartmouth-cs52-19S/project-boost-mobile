import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { red } from 'ansi-colors';
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
<<<<<<< HEAD
        if (!Object.keys(response).includes('homeLocation')) {
          //   this.props.setUserData(response);
          //   this.props.navigation.navigate('ProvideInitialInfo');
          // } else {
          //   this.props.navigation.navigate('App');
=======
        if (response.homeLocation.length === 0) {
          this.props.setUserData(response);
          this.props.navigation.navigate('ProvideInitialInfo');
        } else {
          this.props.navigation.navigate('App');
>>>>>>> ca989cbf20e08200ff2054674f0352a789d4ffd0
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
          {/* <View styles={styles.loadingContainer}> */}
          <Image styles={styles.loagingGIF} source={loadingGIF} alt="Loading..." />
          {/* </View> */}

          <TouchableOpacity
            onPress={() => {
              firebase.auth().signOut();
            }}>
            <Text style={{ marginTop: 200 }}>sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {},
  loadingGIF: {
    justifyContent: 'center',
    marginTop: 50,
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
