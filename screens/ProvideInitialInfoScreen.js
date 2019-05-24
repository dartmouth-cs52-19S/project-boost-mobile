import React from 'react';
import { ScrollView, StyleSheet, Text, SafeAreaView, View, Switch, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button } from 'react-native-elements';
import axios from 'axios';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { setUserData } from '../state/actions';
// import console = require('console');

class ProvideInitialInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // home location info
      homeLocation: this.props.userData.homeLocation
        ? this.props.userData.homeLocation
        : 'Please Enter A Home Location',
      frequentLocations: Object,
      homeLocationDropdown: 'auto',
      locationNameToToggle: '',
      locationProductivityToToggle: false,
    };
  }

  componentDidMount = () => {
    this.getFrequentLocations();
  };

  static navigationOptions = {
    header: null,
  };

  // get frequentLocations to data from firebase
  getFrequentLocations = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          // eslint-disable-next-line prettier/prettier
            `/api/mostFrequentlyVisitedLocationsRanked?uid=${firebase.auth().currentUser.uid}=&numberOfItems=${10}`
        )
        .then(result => {
          resolve(this.setState({ frequentLocations: result }));
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // checks if home location is provided
  formValidation = () => {
    if (this.state.homeLocation === 'Please Enter A Home Location') {
      Alert.alert("You're almost there!", 'Please specify a home location');
    } else {
      const frequentLocations = this.state.frequentLocations;
      if ((this.state.locationNameToToggle = true)) {
        frequentLocations[
          this.state.locationNameToToggle
        ] = this.state.locationProductivityToToggle;
      }
      this.props.navigation.navigate('App');
    }
  };

  renderHomeLocationInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder={this.state.homeLocation}
        placeholderTextColor="#BCC4C7"
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
        listViewDisplayed={this.state.homeLocationDropdown} // true/false/undefined
        fetchDetails
        renderDescription={row => row.description} // custom description render
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          const latLong = [details.geometry.location.lat, details.geometry.location.lng];
          this.setState({
            homeLocation: data.description,
            homeLocationLatLong: latLong,
            homeLocationDropdown: 'false',
          });
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
            color: '#293C44',
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
            fontFamily: 'Raleway-Light',
            backgroundColor: '#388CAB',
            borderBottomColor: '#FEFEFE',
            borderBottomWidth: 0.25,
            fontSize: 20,
            paddingBottom: 5,
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
    );
  };

  renderFrequentLocationInput = () => {
    return Object.keys(this.state.frequentLocations).map((location, index) => {
      return (
        <View style={styles.presetRow} key={index}>
          <View style={styles.locationColumn}>
            <Text style={styles.address}>{location}</Text>
          </View>
          <View style={styles.productivityColumn} />
          <View>
            <Text>YES</Text>
            <Switch />
            <Text>NO</Text>
          </View>
        </View>
      );
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView style={styles.container}>
          <Text style={styles.heading}>Lets Refine our Data on Your Productivity</Text>
          <Text style={styles.formLabel}>Enter Your Home Location:</Text>
          {this.renderHomeLocationInput()}
          <Text style={styles.formLabel}>We've Found Your Top 10 Most Visited Places:</Text>
          <Text style={styles.formSubheading}>
            Tell Us Whether You're Productive or Unproductive at These Locations:
          </Text>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>Location:</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>I am Productive:</Text>
            </View>
            {this.renderFrequentLocationInput()}
          </View>
          <Button
            buttonStyle={styles.submitButton}
            color="#FEFEFE"
            onPress={() => {
              this.formValidation();
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
    fontFamily: 'Raleway-Bold',
  },
  formLabel: {
    color: '#293C44',
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
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
    fontFamily: 'Raleway-Light',
    fontWeight: '300',
  },
  formSubheading: {
    color: '#FEFEFE',
    fontFamily: 'Raleway-Bold',
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
    fontFamily: 'Raleway-Bold',
    fontSize: 20,
    marginBottom: 20,
  },
  columnText: {
    paddingTop: 5,
    color: '#FEFEFE',
    fontSize: 20,
    fontFamily: 'Raleway-Light',
  },
  submitButton: {
    backgroundColor: '#293C44',
    margin: 40,
  },
  switch: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: '#FEFEFE',
    color: 'rgba(0,0,0,0)',
  },
  switchText: {
    fontSize: 18,
    color: '#E5E5E5',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProvideInitialInfo);
