import React from 'react';
import { ScrollView, StyleSheet, Text, SafeAreaView, View, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import * as firebase from 'firebase';
import * as api from '../datastore/api_requests';
import { setUserData } from '../state/actions';

import NavBar from '../components/NavBar';

const LIGHT_BLUE = '#388CAB';
const DARK_BLUE = '#293C44';
const WHITE = '#FEFEFE';

class ProvideInitialInfoScreen extends React.Component {
  constructor(props) {
    super(props);

    const latLong = this.props.userData.latlongHomeLocation.split(',');

    latLong.forEach((obj, index) => {
      latLong[index] = obj.replace(/^\s+|\s+$/gm, '');
    });

    const frequentLocations = {};

    this.props.frequentLocations.forEach(object => {
      frequentLocations[object.address] = 0;
    });

    this.state = {
      // home location info
      homeLocation: this.props.userData.homeLocation
        ? this.props.userData.homeLocation
        : 'Enter Your Home Address',
      frequentLocations,
      homeLocationLatLong: latLong.length > 0 ? latLong : [],
      locationNameToAdd: '',
      locationProductivityToAdd: 0,
      homeLocationDropdown: 'auto',
      addLocationDropdown: 'auto',
    };
  }

  static navigationOptions = {
    header: null,
  };

  // makes google maps reverse geocoding api call with lat long input, returns an address if promise is resolved
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

  // checks if home location is provided
  formValidation = () => {
    return (
      this.state.homeLocation !== 'Enter Your Home Address' &&
      this.state.homeLocation !== null &&
      this.state.homeLocation !== undefined &&
      this.state.homeLocation.length !== 0
    );
  };

  saveInfo = () => {
    if (this.formValidation()) {
      api
        .updateUserSettings(
          firebase.auth().currentUser.uid,
          this.state.homeLocation,
          this.state.homeLocationLatLong,
          this.state.frequentLocations
        )
        .then(() => {
          api
            .getUserInfo(firebase.auth().currentUser.uid)
            .then(response => {
              this.props.setUserData(response);
              this.props.navigation.navigate('App');
            })
            .catch(error => {
              Alert.alert(error.message);
            });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } else {
      Alert.alert("You're almost there!", 'Please specify a home location.');
    }
  };

  renderHomeLocationInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder={this.state.homeLocation}
        placeholderTextColor={WHITE}
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
            color: WHITE,
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
            color: WHITE,
            fontFamily: 'Raleway-Light',
            backgroundColor: LIGHT_BLUE,
            borderBottomColor: WHITE,
            borderBottomWidth: 0.25,
            fontSize: 20,
            paddingBottom: 5,
            paddingLeft: 0,
          },
          poweredContainer: {
            display: 'none',
          },
          row: {
            color: WHITE,
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

  renderPresetRows = () => {
    return Object.keys(this.state.frequentLocations).map((address, index) => {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 10,
            paddingBottom: 12,
          }}
          key={index}>
          <Text style={styles.address}>{address}</Text>
          <StarRating
            disabled={false}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            iconSet={'Ionicons'}
            maxStars={5}
            starSize={25}
            rating={this.state.frequentLocations[address]}
            selectedStar={rating => {
              const frequentLocations = this.state.frequentLocations;
              frequentLocations[address] = rating;
              this.setState({
                frequentLocations,
              });
            }}
            fullStarColor={WHITE}
            emptyStarColor={WHITE}
          />
        </View>
      );
    });
  };

  addAnotherPreset = () => {
    return (
      <View>
        <Text style={styles.addAnotherPreset}>Add Another Location:</Text>
        <View style={styles.presetRow}>
          <View style={styles.locationColumn}>
            <GooglePlacesAutocomplete
              placeholder={this.state.locationNameToAdd}
              placeholderTextColor=""
              minLength={2} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              listViewDisplayed={this.state.addLocationDropdown} // true/false/undefined
              fetchDetails
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                this.setState({
                  locationNameToAdd: data.description,
                  addLocationDropdown: 'false',
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
                  color: WHITE,
                  padding: 0,
                },
                textInputContainer: {
                  padding: 0,
                  margin: 0,
                  width: 225,
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  outline: 'none',
                },
                textInput: {
                  color: WHITE,
                  fontFamily: 'Raleway-Light',
                  backgroundColor: LIGHT_BLUE,
                  borderBottomColor: WHITE,
                  borderBottomWidth: 0.25,
                  fontSize: 20,
                  padding: 0,
                  margin: 0,
                },
                poweredContainer: {
                  display: 'none',
                },
                row: {
                  color: WHITE,
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
          </View>
          <View style={styles.productivityColumn}>
            <StarRating
              disabled={false}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              iconSet={'Ionicons'}
              maxStars={5}
              starSize={25}
              rating={this.state.locationProductivityToAdd}
              selectedStar={rating => {
                this.setState({ locationProductivityToAdd: rating });
              }}
              fullStarColor={WHITE}
              emptyStarColor={WHITE}
            />
          </View>
        </View>
      </View>
    );
  };

  addLocation = () => {
    if (this.state.locationNameToAdd.length > 0 && this.state.locationProductivityToAdd > 0) {
      const frequentLocations = this.state.frequentLocations;
      frequentLocations[this.state.locationNameToAdd] = this.state.locationProductivityToAdd;

      this.setState({
        frequentLocations,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <NavBar backgroundColor="#388CAB" />
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.settingsContainer}>
              <Text style={styles.title}>Let's Refine Our Data On Your Productivity</Text>
              <Text style={styles.formLabel}>Enter Your Home Location:</Text>
              {this.renderHomeLocationInput()}
              <Text style={styles.formLabel}>Frequent Locations:</Text>
              <Text style={styles.formDescription}>
                Please estimate your productivity at each location. You can also add locations in
                the text field below.
              </Text>
              <View style={styles.presetRow}>
                <View style={styles.locationColumn}>
                  <Text style={styles.columnHeader}>Location:</Text>
                </View>
                <View style={styles.productivityColumn}>
                  <Text style={styles.columnHeader}>Productivity:</Text>
                </View>
              </View>
              <View style={styles.presetContainer}>{this.renderPresetRows()}</View>
              {this.addAnotherPreset()}

              <Button
                buttonStyle={styles.nextButton}
                color="#FEFEFE"
                onPress={this.addLocation}
                title="Add Location"
              />
            </View>
          </ScrollView>
          <Button
            buttonStyle={styles.nextButton}
            color="#FEFEFE"
            onPress={() => {
              this.saveInfo();
            }}
            title="Save and Continue"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: WHITE,
    fontSize: 28,
    fontFamily: 'Raleway-Bold',
    marginTop: 30,
  },
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_BLUE,
  },
  container: {
    flex: 1,
    backgroundColor: LIGHT_BLUE,
  },
  contentContainer: {
    backgroundColor: LIGHT_BLUE,
  },
  settingsContainer: {
    marginLeft: 18,
    marginRight: 18,
  },
  heading: {
    fontSize: 35,
    color: WHITE,
    fontFamily: 'Raleway-Bold',
  },
  formLabel: {
    color: DARK_BLUE,
    fontSize: 28,
    fontFamily: 'Raleway-Bold',
    marginTop: 30,
  },
  formDescription: {
    paddingTop: 10,
    marginBottom: 20,
    fontFamily: 'Raleway-Light',
    fontSize: 20,
    color: WHITE,
  },
  text: {
    margin: 20,
  },
  input: {
    borderBottomColor: WHITE,
    borderBottomWidth: 0.25,
    fontSize: 20,
    paddingBottom: 5,
    color: WHITE,
    fontFamily: 'Raleway-Light',
    fontWeight: '300',
  },
  formSubheading: {
    color: WHITE,
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
  presetContainer: {
    flex: 1,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addAnotherPreset: {
    color: WHITE,
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    marginVertical: 15,
  },
  address: {
    paddingLeft: 0,
    marginLeft: 0,
    width: 175,
    color: 'white',
    fontFamily: 'Raleway-Light',
    fontSize: 18,
  },
  score: {
    color: 'white',
    fontFamily: 'Raleway-Light',
    fontSize: 18,
    textAlign: 'center',
  },
  column: {
    width: '50%',
  },
  locationColumn: {
    width: '60%',
  },
  productivityColumn: {
    width: '35%',
    marginHorizontal: 20,
  },
  columnHeader: {
    color: '#e5e5e5',
    fontFamily: 'Raleway-Bold',
    fontSize: 20,
  },
  columnText: {
    paddingTop: 5,
    color: WHITE,
    fontSize: 20,
    fontFamily: 'Raleway-Light',
  },
  nextButton: {
    backgroundColor: DARK_BLUE,
    margin: 40,
  },
  switch: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    color: 'rgba(0,0,0,0)',
  },
  switchText: {
    fontSize: 18,
    color: '#293C44',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: DARK_BLUE,
    paddingHorizontal: 20,
    marginLeft: 10,
    margin: 20,
    padding: 10,
  },
  addLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => {
  return {
    userData: state.user.userData,
    frequentLocations: state.user.frequentLocations,
  };
};

// updating the reducer
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
)(ProvideInitialInfoScreen);
