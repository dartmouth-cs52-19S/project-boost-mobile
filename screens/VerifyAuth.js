import React from 'react';
import { StyleSheet, View, Text, Alert, Image, SafeAreaView } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import * as api from '../datastore/api_requests';
import loadingGIF from '../assets/gifs/loading-white.gif';
import NavBar from '../components/NavBar';

import {
  setUserData,
  setFrequentLocations,
  setMostProductiveDays,
  setLeastProductiveDays,
  setMostProductiveLocations,
  setProductivityScores,
} from '../state/actions';

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    // holds promises for API requests
    const promises = [];

    // get user information
    promises.push(
      new Promise((resolve, reject) => {
        api
          .getUserInfo(firebase.auth().currentUser.uid) // get user information
          .then(response => {
            this.props.setUserData(response); // saving user information
            resolve(response);
          })
          .catch(error => {
            Alert.alert(error.message);
          });
      })
    );

    // get frequent locations
    promises.push(
      new Promise((resolve, reject) => {
        api
          .getFrequentLocations(firebase.auth().currentUser.uid, 10) // get frequent locations
          .then(response => {
            this.props.setFrequentLocations(response.output); // saving frequent locations
            resolve(response.output);
          })
          .catch(error => {
            Alert.alert(error.message);
          });
      })
    );

    // get most productive days
    promises.push(
      new Promise((resolve, reject) => {
        api
          .getMostProductiveDays(firebase.auth().currentUser.uid)
          .then(response => {
            this.props.setMostProductiveDays(response);
            resolve(response);
          })
          .catch(error => {
            Alert.alert(error.message);
          });
      })
    );

    // get least productive days
    promises.push(
      new Promise((resolve, reject) => {
        api
          .getLeastProductiveDays(firebase.auth().currentUser.uid)
          .then(response => {
            this.props.setLeastProductiveDays(response);
            resolve(response);
          })
          .catch(error => {
            Alert.alert(error.message);
          });
      })
    );

    // set most productive locations
    promises.push(
      new Promise((resolve, reject) => {
        api
          .getMostProductiveLocations(firebase.auth().currentUser.uid)
          .then(response => {
            this.props.setMostProductiveLocations(response);
            resolve(response);
          })
          .catch(error => {
            Alert.alert(error.message);
          });
      })
    );

    // get productivity scores for graph
    promises.push(
      new Promise((resolve, reject) => {
        api
          .getProductivityScores(firebase.auth().currentUser.uid)
          .then(response => {
            this.props.setProductivityScores(response);
            resolve(response);
          })
          .catch(error => {
            Alert.alert(error.message);
          });
      })
    );

    // TODO @faustino: make API call to get null productivity levels (push as promise to promises aray)

    // when all desired information has been received, redirect user
    Promise.all(promises)
      .then(result => {
        // if the user must provide more information to proceed, then navigate to initial info screen, otherwise send to App
        if (this.mustProvideMoreInformation(result[0])) {
          this.props.navigation.navigate('ProvideInitialInfo');
        } else {
          this.props.navigation.navigate('App');
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  }

  // determine if user must provide more information before proceeding to app
  mustProvideMoreInformation = userData => {
    return (
      !Object.keys(userData).includes('homeLocation') ||
      userData.homeLocation === null ||
      userData.homeLocation === undefined ||
      userData.homeLocation.length === 0
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavBar backgroundColor="#388CAB" />
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.loading}>Loading...</Text>
            <Image style={styles.loadingGIF} source={loadingGIF} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#388CAB',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#388CAB',
  },
  contentContainer: {
    backgroundColor: '#388CAB',
  },
  loadingGIF: {
    width: 95,
    height: 95,
    marginBottom: 50,
  },
  loading: {
    fontFamily: 'Raleway-Light',
    fontSize: 20,
    color: '#e5e5e5',
    marginLeft: 10,
  },
});

const mapStateToProps = state => {
  return {
    userData: state.user.userData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserData: object => {
      dispatch(setUserData(object));
    },
    setFrequentLocations: object => {
      dispatch(setFrequentLocations(object));
    },
    setMostProductiveDays: object => {
      dispatch(setMostProductiveDays(object));
    },
    setLeastProductiveDays: object => {
      dispatch(setLeastProductiveDays(object));
    },
    setMostProductiveLocations: object => {
      dispatch(setMostProductiveLocations(object));
    },
    setProductivityScores: object => {
      dispatch(setProductivityScores(object));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyAuth);
