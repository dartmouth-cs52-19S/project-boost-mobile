import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { TaskManager, Constants, Permissions, Location } from 'expo';
import * as api from '../datastore/api_requests';

import { setUserData, setProvidedBackgroundLocation } from '../state/actions';

// define background location data task for device
TaskManager.defineTask('GET_BACKGROUND_LOCATION_DATA', ({ data: { locations }, error }) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log(locations);
    api.uploadBackgroundLocationData(firebase.auth().currentUser.uid, locations);
  }
});

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.getUserLocation();
  }

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

  // start stream to get user background location data
  getUserLocation = async () => {
    if (Constants.isDevice) {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status === 'granted') {
        this.props.setProvidedBackgroundLocation(true);
      }

      Location.startLocationUpdatesAsync('GET_BACKGROUND_LOCATION_DATA', {
        distanceInterval: 160, // ensure new location changed by 160 meters (about 0.1 miles)
      });
    }
  };
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
    setProvidedBackgroundLocation: bool => {
      dispatch(setProvidedBackgroundLocation(bool));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(VerifyAuth);
