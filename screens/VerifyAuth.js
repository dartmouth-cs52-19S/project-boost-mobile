import React from 'react';
import { StyleSheet, View, Text, Alert, Image, SafeAreaView } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import {
  setUserData,
  setFrequentLocations,
  setMostProductiveDays,
  setLeastProductiveDays,
  setMostProductiveLocations,
  setProductivityScores,
} from '../state/actions';

import loadingGIF from '../assets/gifs/loading-white.gif';
import NavBar from '../components/NavBar';

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const id = firebase.auth().currentUser.uid;

    // fire off all necessary API requests
    this.props.setUserData(id);
    this.props.setFrequentLocations(id, 10);
    this.props.setMostProductiveDays(id);
    this.props.setLeastProductiveDays(id);
    this.props.setMostProductiveLocations(id);
    this.props.setProductivityScores(id);

    // TODO @faustino: make API call to get null productivity levels (push as promise to promises aray)

    // when all desired information has been received, redirect user
    // Promise.all(promises)
    //   .then(result => {
    //     // if the user must provide more information to proceed, then navigate to initial info screen, otherwise send to App
    //     if (this.mustProvideMoreInformation(result[0])) {
    //       this.props.navigation.navigate('ProvideInitialInfo');
    //     } else {
    //       this.props.navigation.navigate('App');
    //     }
    //   })
    //   .catch(error => {
    //     Alert.alert(error.message);
    //   });
  }

  componentWillUpdate(nextProps) {
    console.log(nextProps);
    // check if we have everything that we sent API requests for
    // if so, then see if we should go to initial auth screen or if we should go straight to the app
    // if not, do nothing
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
    alignItems: 'center',
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
    frequentLocations: state.user.frequentLocations,
    mostProductiveDays: state.user.mostProductiveDays,
    leastProductiveDays: state.user.leastProductiveDays,
    mostProductiveLocations: state.user.mostProductiveLocations,
    productivityScores: state.user.productivityScores,
    apiError: state.api_error,
  };
};

export default connect(
  mapStateToProps,
  {
    setUserData,
    setFrequentLocations,
    setMostProductiveDays,
    setLeastProductiveDays,
    setMostProductiveLocations,
    setProductivityScores,
  }
)(VerifyAuth);
