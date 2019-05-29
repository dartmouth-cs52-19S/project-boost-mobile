import React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import * as firebase from 'firebase';
import Swipeout from 'react-native-swipeout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as api from '../datastore/api_requests';

import {
  setUserData,
  setFrequentLocations,
  setMostProductiveDays,
  setLeastProductiveDays,
  setMostProductiveLocations,
  setProductivityScores,
} from '../state/actions';

import NavBar from '../components/NavBar';
import AddressSearch from '../components/AddressSearch';

const LIGHT_BLUE = '#388CAB';
const DARK_BLUE = '#293C44';
const WHITE = '#FEFEFE';

class ProvideInitialInfoScreen extends React.Component {
  constructor(props) {
    super(props);

    let latLong;

    if (this.props.userData.latlongHomeLocation.length > 0) {
      // split up lat long for local state
      latLong = this.props.userData.latlongHomeLocation.split(',');

      latLong.forEach((obj, index) => {
        latLong[index] = obj.replace(/^\s+|\s+$/gm, '');
      });
    } else {
      latLong = ['', ''];
    }

    const frequentLocations = {};

    // build from frequent locations
    this.props.frequentLocations.output.forEach(object => {
      frequentLocations[object.address] = 0;
    });

    // add in any preset productive locations the user has created
    Object.keys(this.props.userData.presetProductiveLocations).forEach(location => {
      frequentLocations[location] = this.props.userData.presetProductiveLocations[location];
    });

    this.state = {
      // behavior: 'position', //position
      // behaviorTwo: 'position', //position
      homeLocation: this.props.userData.homeLocation
        ? this.props.userData.homeLocation
        : 'Enter Your Home Address', // home location info
      frequentLocations, // top visited locations from users background data plus any previously set preset places
      homeLocationLatLong: latLong, // lat long of home address
      locationNameToAdd: '', // address field in item to add
      locationProductivityToAdd: 0, // productivity field in item to add
      homeLocationDropdown: 'auto', // whether or not to display dropdown for home location search
      addLocationDropdown: 'auto', // whether or not to display dropdown for add location location search
    };
  }

  static navigationOptions = {
    header: null,
  };

  // checks if home location is provided
  isReadyToSave = () => {
    return (
      this.state.homeLocation !== 'Enter Your Home Address' &&
      this.state.homeLocation !== null &&
      this.state.homeLocation !== undefined &&
      this.state.homeLocation.length !== 0
    );
  };

  // save user info
  saveInfo = () => {
    const frequentLocations = this.state.frequentLocations;

    // add item to preset productive locations if user entered something
    if (this.state.locationNameToAdd.length > 0 && this.state.locationProductivityToAdd > 0) {
      frequentLocations[this.state.locationNameToAdd] = this.state.locationProductivityToAdd;
    }

    // set state, then call API to update settings
    this.setState(
      {
        frequentLocations,
        locationNameToAdd: '',
        locationProductivityToAdd: 0,
      },
      () => {
        if (this.isReadyToSave()) {
          api
            .updateUserSettings(
              firebase.auth().currentUser.uid,
              this.state.homeLocation,
              this.state.homeLocationLatLong,
              this.state.frequentLocations
            )
            .then(() => {
              const id = firebase.auth().currentUser.uid;

              // fire off all necessary API requests
              this.props.setUserData(id);
              this.props.setFrequentLocations(id, 10);
              this.props.setMostProductiveDays(id);
              this.props.setLeastProductiveDays(id);
              this.props.setMostProductiveLocations(id);
              this.props.setProductivityScores(id);

              // bring user to app
              this.props.navigation.navigate('App');
            })
            .catch(error => {
              Alert.alert(error.message);
            });
        } else {
          Alert.alert("You're almost there!", 'Please specify a home location.');
        }
      }
    );
  };

  // user's ability to enter their home location
  renderHomeLocationInput = () => {
    return (
      <AddressSearch
        placeholder={this.state.homeLocation}
        listViewDisplayed={this.state.homeLocationDropdown}
        handlePress={(data, details) => {
          const latLong = [details.geometry.location.lat, details.geometry.location.lng];
          this.setState({
            homeLocation: data.description,
            homeLocationLatLong: latLong,
            homeLocationDropdown: 'false',
          });
        }}
        placeholderTextColor={WHITE}
        inputColor={WHITE}
        inputBackgroundColor={LIGHT_BLUE}
        inputBorderBottomColor={WHITE}
        rowColor={LIGHT_BLUE}
      />
    );
  };

  renderPresetRows = () => {
    return Object.keys(this.state.frequentLocations).map((address, index) => {
      // define buttons for swipe
      const swipeBtns = [
        {
          text: 'Delete',
          backgroundColor: 'red',
          underlayColor: '#293C44',
          onPress: () => {
            delete this.state.frequentLocations[address];

            // update state to re-render
            this.setState({
              frequentLocations: this.state.frequentLocations,
            });
          },
        },
      ];

      // return row
      return (
        <Swipeout right={swipeBtns} autoClose backgroundColor="transparent" key={index}>
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
        </Swipeout>
      );
    });
  };

  addAnotherPreset = () => {
    return (
      <View>
        <Text style={styles.addAnotherPreset}>Add Another Location:</Text>
        <View style={styles.presetRow}>
          <View style={styles.locationColumn}>
            <AddressSearch
              placeholder={this.state.locationNameToAdd}
              listViewDisplayed={this.state.addLocationDropdown}
              handlePress={(data, details) => {
                this.setState({
                  locationNameToAdd: data.description,
                  addLocationDropdown: 'false',
                });
              }}
              placeholderTextColor={WHITE}
              inputColor={WHITE}
              inputBackgroundColor={LIGHT_BLUE}
              inputBorderBottomColor={WHITE}
              rowColor={LIGHT_BLUE}
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
        locationNameToAdd: '',
        locationProductivityToAdd: 0,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavBar backgroundColor="#388CAB" />
        <KeyboardAwareScrollView
          extraHeight="-20"
          innerRef={ref => {
            this.scroll = ref;
          }}>
          <View style={styles.settingsContainer}>
            <Text style={styles.title}>Let's Refine Our Data On Your Productivity</Text>
            <Text style={styles.formLabel}>Enter Your Home Location:</Text>
            {this.renderHomeLocationInput()}
            <Text style={styles.formLabel}>Frequent Locations:</Text>
            <Text style={styles.formDescription}>
              We found your top 10 most frequently visited locations from the data you provided.
              Please estimate your productivity at each location. You can also add locations in the
              text field below.
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
            {this.state.locationNameToAdd.length > 0 && this.state.locationProductivityToAdd > 0 ? (
              <Button
                buttonStyle={styles.nextButton}
                color="#FEFEFE"
                onPress={this.addLocation}
                title="Add Location"
              />
            ) : null}
          </View>
        </KeyboardAwareScrollView>
        <Button
          buttonStyle={styles.nextButton}
          color="#FEFEFE"
          onPress={() => {
            this.saveInfo();
          }}
          title="Save and Continue"
        />
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
    color: WHITE,
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
    color: WHITE,
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
)(ProvideInitialInfoScreen);
