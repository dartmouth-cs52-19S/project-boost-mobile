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

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    const latLong = this.props.userData.latlongHomeLocation.split(',');

    latLong.forEach((obj, index) => {
      latLong[index] = obj.replace(/^\s+|\s+$/gm, '');
    });

    this.state = {
      // home location info
      homeLocation: this.props.userData.homeLocation
        ? this.props.userData.homeLocation
        : 'Enter Your Home Addresss',
      presetProductiveLocations: this.props.userData.presetProductiveLocations,
      homeLocationLatLong: latLong.length > 0 ? latLong : [],
      locationNameToAdd: '',
      locationProductivityToAdd: 0,
      homeLocationDropdown: 'auto',
      addLocationDropdown: 'auto',
    };

    console.log(this.props.userData);
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
        // FOR THOMAS – placeid = result.data.results[0].place_id
        .then(result => {
          resolve(result.data.results[0].formatted_address);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

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
            color: '#388CAB',
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
            backgroundColor: '#293C44',
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

  renderPresetRows = () => {
    return Object.keys(this.state.presetProductiveLocations).map((location, index) => {
      return (
        <View style={styles.presetRow} key={index}>
          <View style={styles.locationColumn}>
            <Text style={styles.address}>{location}</Text>
          </View>
          <View style={styles.productivityColumn}>
            <StarRating
              disabled={false}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              iconSet={'Ionicons'}
              maxStars={5}
              starSize={25}
              rating={this.state.presetProductiveLocations[location]}
              selectedStar={rating => {
                const obj = this.state.presetProductiveLocations;
                obj[location] = rating;

                this.setState({
                  presetProductiveLocations: obj,
                });
              }}
              fullStarColor={'white'}
            />
          </View>
        </View>
      );
    });
  };

  addAnotherPreset = () => {
    return (
      <View>
        <Text style={styles.addAnotherPreset}>Add Another Preset Location:</Text>
        <View style={styles.presetRow}>
          <View style={styles.locationColumn}>
            <GooglePlacesAutocomplete
              placeholder={this.state.locationNameToAdd}
              placeholderTextColor="#BCC4C7"
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
                  color: '#388CAB',
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
                  backgroundColor: '#293C44',
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
                this.setState({
                  locationProductivityToAdd: rating,
                });
              }}
              fullStarColor={'white'}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <NavBar backgroundColor="#293C44" />
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.settingsContainer}>
              <Text style={styles.formLabel}>Your Home Location:</Text>
              {this.renderHomeLocationInput()}
              <Text style={styles.formLabel}>Preset Productive Locations:</Text>
              <Text style={styles.formDescription}>
                Whenever you visit these locations, we preset your productivity level with the value
                below.
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
            </View>
          </ScrollView>
          <Button
            buttonStyle={styles.saveButton}
            color="#FEFEFE"
            onPress={() => {
              this.saveInfo();
            }}
            title="Save"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#293C44',
  },
  container: {
    flex: 1,
    backgroundColor: '#293C44',
  },
  contentContainer: {
    backgroundColor: '#293C44',
  },
  settingsContainer: {
    marginLeft: 18,
    marginRight: 18,
  },
  heading: {
    fontSize: 35,
    color: 'white',
    fontFamily: 'Raleway-Bold',
  },
  formLabel: {
    color: '#FEFEFE',
    fontSize: 28,
    fontFamily: 'Raleway-Bold',
    marginTop: 30,
  },
  formDescription: {
    marginBottom: 20,
    fontFamily: 'Raleway-Light',
    fontSize: 16,
    color: 'white',
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
  presetContainer: {
    flex: 1,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addAnotherPreset: {
    color: '#FEFEFE',
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    marginVertical: 15,
  },
  address: {
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
    color: '#FEFEFE',
    fontSize: 20,
    fontFamily: 'Raleway-Light',
  },
  saveButton: {
    backgroundColor: '#388CAB',
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
)(SettingsScreen);
