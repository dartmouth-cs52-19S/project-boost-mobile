import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import * as api from '../datastore/api_requests';
import loadingGIF from '../assets/gifs/loading-white.gif';
import NavBar from '../components/NavBar';

import { setUserData, setFrequentLocations } from '../state/actions';

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    api
      .getUserInfo(firebase.auth().currentUser.uid) // get user information
      .then(response => {
        this.props.setUserData(response); // saving user information

        // get the frequent locations about that specific user
        api.getFrequentLocations(firebase.auth().currentUser.uid, 15).then(response => {
          this.props.setFrequentLocations(response);
          // if there isnt a home location, then navigate to initial info screen
          if (!Object.keys(response).includes('homeLocation')) {
            this.props.navigation.navigate('ProvideInitialInfo');
            // else go to App
          } else {
            this.props.navigation.navigate('App'); //App
          }
        });
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  }

  saveInfo = () => {
    const presetProductiveLocations = this.state.presetProductiveLocations;

    if (this.state.locationNameToAdd.length > 0 && this.state.locationProductivityToAdd > 0) {
      presetProductiveLocations[
        this.state.locationNameToAdd
      ] = this.state.locationProductivityToAdd;
    }

    this.setState(
      {
        presetProductiveLocations,
        locationNameToAdd: '',
        locationProductivityToAdd: 0,
      },
      () => {
        api
          .updateUserSettings(
            firebase.auth().currentUser.uid,
            this.state.homeLocation,
            this.state.homeLocationLatLong,
            this.state.presetProductiveLocations
          )
          .then(() => {
            api
              .getUserInfo(firebase.auth().currentUser.uid)
              .then(response => {
                this.props.setUserData(response);
              })
              .catch(err => {
                Alert.alert(err.message);
              });
          });
      }
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

const mapDispatchToProps = dispatch => {
  return {
    setUserData: object => {
      dispatch(setUserData(object));
    },
    setFrequentLocations: object => {
      dispatch(setFrequentLocations(object));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(VerifyAuth);
