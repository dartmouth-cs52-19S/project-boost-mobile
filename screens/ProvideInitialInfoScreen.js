import React from 'react';
import { ScrollView, StyleSheet, Text, SafeAreaView, View, Switch, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button } from 'react-native-elements';
import axios from 'axios';

const fakeData = {
  locationAlgorithmOutput: {
    '44.308140 , -71.800171': [
      {
        startTime: '1234',
        endTime: '5678',
      },
    ],
    '41.148499 , -73.493698': [
      {
        startTime: '1324',
        endTime: '9876',
      },
      {
        startTime: '1234',
        endTime: '4321',
      },
    ],
  },
};

export default class ProvideInitialInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      homeLocation: null,
      homeLocationLatLong: [],
      locationLoaded: false,
      locationHistory: null,
      switch0: true,
      switch1: false,
    };
  }

  componentDidMount = () => {
    this.getLocationHistory();
  };

  static navigationOptions = {
    header: null,
    title: 'ProvideInitialInfo',
  };

  getLocationHistory = () => {
    const locations = [];
    Object.keys(fakeData.locationAlgorithmOutput).forEach(key => {
      locations.push({ coords: key, times: fakeData.locationAlgorithmOutput[key] });
    });
    // Sort by most frequently visited locations
    if (locations.length > 1) {
      locations.sort(function(a, b) {
        if (a.times.length === b.times.length) return 0;
        if (a.times.length > b.times.length) return -1;
        if (a.times.length < b.times.length) return 1;
      });
    }
    let promises = [];
    locations.map(value => {
      promises.push(
        new Promise((resolve, reject) => {
          this.getAddress(value.coords)
            .then(address => {
              resolve(address);
            })
            .catch(error => reject(error));
        })
      );
    });
    Promise.all(promises)
      .then(elements => {
        let output = [];
        elements.map((address, i) => {
          const key = `switch${i}`;
          this.setState({ [key]: true }, () => {
            output.push([
              <View style={styles.column}>
                <Text style={styles.columnText}>{address}</Text>
              </View>,
              <View style={styles.column}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>YES</Text>
                  <Switch
                    style={styles.switch}
                    value={this.state.switch0}
                    onValueChange={this.toggleSwitch}
                  />
                  <Text style={styles.switchText}>NO</Text>
                </View>
              </View>,
            ]);
          });
        });
        this.setState({
          locationHistory: output,
          locationLoaded: true,
        });
      })
      .catch(error => Alert.alert(error));
  };

  toggleSwitch = value => {
    this.setState({ switch0: value });
  };

  getAddress = coords => {
    const coordList = coords.split(' , ');
    return new Promise((resolve, reject) => {
      axios
        .get(
          // eslint-disable-next-line prettier/prettier
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordList[0]},${coordList[1]}&key=AIzaSyC-NzR3fMLRX_6R9-sFCX7EBLVPFUgRjgk`
        )
        .then(result => {
          resolve(result.data.results[0].formatted_address);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.heading}>Lets Refine our Data on Your Productivity</Text>
          <Text style={styles.formLabel}>Enter Your Home Location:</Text>
          <GooglePlacesAutocomplete
            placeholder="Your Home Location"
            placeholderTextColor="#BCC4C7"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              const latLong = [details.geometry.location.lat, details.geometry.location.long];
              this.setState({ homeLocation: data.description, homeLocationLatLong: latLong });
            }}
            getDefaultValue={() => ''}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyC-NzR3fMLRX_6R9-sFCX7EBLVPFUgRjgk',
              language: 'en', // language of the results
              types: 'address', // default: 'geocode'
            }}
            styles={{
              description: {
                fontWeight: 'bold',
              },
              textInputContainer: {
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                outline: 'none',
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#FEFEFE',
                fontFamily: 'Railway',
                backgroundColor: '#388CAB',
                borderBottomColor: '#FEFEFE',
                borderBottomWidth: 0.25,
                fontSize: 20,
                paddingBottom: 5,
                fontWeight: '300',
                paddingLeft: 5,
              },
              poweredContainer: {
                display: 'none',
              },
              row: {
                color: '#FEFEFE',
              },
            }}
            // currentLocation // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GooglePlacesDetailsQuery={{
              // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
              fields: 'formatted_address',
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'prominence',
            }}
            debounce={500} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
          <Text style={styles.formLabel}>
            We've Guessed Where You're Productive and Unproductive:
          </Text>
          <Text style={styles.formSubheading}>Change What We Got Wrong</Text>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>Location:</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>I am Productive:</Text>
            </View>
            {this.state.locationLoaded ? this.state.locationHistory : null}
          </View>
          <Button
            buttonStyle={styles.submitButton}
            color="#FEFEFE"
            onPress={() => {
              // TODO: form validation function
              this.props.navigation.navigate('App');
            }}
            title="Submit"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#388CAB',
  },
  container: {
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  heading: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Railway',
  },
  formLabel: {
    color: '#293C44',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Railway',
    marginBottom: 20,
    marginTop: 50,
  },
  text: {
    margin: 20,
  },
  input: {
    borderBottomColor: '#FEFEFE',
    borderBottomWidth: 0.25,
    fontSize: 20,
    paddingBottom: 5,
    color: '#FEFEFE',
    fontFamily: 'Railway',
    fontWeight: '300',
  },
  formSubheading: {
    color: '#FEFEFE',
    fontFamily: 'Raleway',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 25,
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  column: {
    width: '50%',
  },
  columnHeader: {
    color: '#293C44',
    fontFamily: 'Raleway',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  columnText: {
    color: '#FEFEFE',
    fontSize: 20,
    fontFamily: 'Raleway',
    fontWeight: '300',
  },
  submitButton: {
    backgroundColor: '#293C44',
    margin: 40,
  },
  switch: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  switchText: {
    color: '#FEFEFE',
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
