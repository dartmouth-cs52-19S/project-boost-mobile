import React from 'react';
import { ScrollView, StyleSheet, Text, Button } from 'react-native';
import { connect } from 'react-redux';

import { TaskManager, Constants, Permissions, Location } from 'expo';
import { setProvidedBackgroundLocation } from '../state/actions';

// define background location data task for device
TaskManager.defineTask('GET_BACKGROUND_LOCATION_DATA', ({ data: { locations }, error }) => {
  if (error) {
    console.log(error.message);
  } else {
    // TODO: send data to server
    console.log(locations);
  }
});

class ProvideInitialInfoScreen extends React.Component {
  static navigationOptions = {
    // header: null,
    title: 'VerifyAuth',
  };

  constructor(props) {
    super(props);

    this.getUserLocation();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          This is where we will ask them about their initial setup questions for productivity
        </Text>

        <Text style={styles.text}>
          If they've already done this, they won't be asked again, and instead will be routed all
          the way into the app
        </Text>

        <Text style={styles.text}>Click the button below to go straight into the app for now</Text>

        <Button
          onPress={() => {
            this.props.navigation.navigate('App');
          }}
          title="navigate to app"
        />
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
        distanceInterval: 80, // ensure new location changed by 80 meters (about 0.05 miles)
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  text: {
    margin: 20,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    setProvidedBackgroundLocation: bool => {
      dispatch(setProvidedBackgroundLocation(bool));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ProvideInitialInfoScreen);
