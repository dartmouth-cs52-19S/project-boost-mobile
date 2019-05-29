import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import * as api from '../datastore/api_requests';
import NavBar from '../components/NavBar';

import {
  setUserData,
  setFrequentLocations,
  setMostProductiveDays,
  setLeastProductiveDays,
  setMostProductiveLocations,
  setProductivityScores,
  setNewLocations,
  setProvidedBackgroundLocation,
} from '../state/actions';

class SurveyScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      id: firebase.auth().currentUser.uid,
      locations: null,
      currLocationIndex: 0,
      newData: true,
      loaded: false,
      starCount: 3,
      submit: false,
      atZero: true,
      submitInProgress: false,
      sentRequests: false,
    };
  }

  componentDidMount = () => {
    this.getNewLocationData();
    this.setState({ loaded: true });
  };

  componentWillUpdate(nextProps) {
    // determine if there was a server error
    if (Object.keys(nextProps.apiError).length > 0) {
      Alert.alert(nextProps.apiError.message);
    }
    // determine if we've received everything from the server
    else if (
      this.state.sentRequests &&
      !nextProps.setUserDataInProgress &&
      !nextProps.setFrequentLocationsInProgress &&
      !nextProps.setMostProductiveDaysInProgress &&
      !nextProps.setLeastProductiveDaysInProgress &&
      !nextProps.setMostProductiveLocationsInProgress &&
      !nextProps.setProductivityScoresInProgress &&
      !nextProps.setNewLocationsInProgress
    ) {
      // route user to data stack if done
      this.props.navigation.navigate('DataStack');
    }
  }

  getNewLocationData = () => {
    // TODO: once backend is set, get actual data from user in database
    if (this.props.newLocations.length === 0) this.setState({ newData: false });
    this.setState({ locations: this.props.newLocations });
  };

  renderCurrentLocation = () => {
    let address = '';
    if (this.inLocationsIndex()) {
      const i = this.state.currLocationIndex;
      address = this.state.locations[i].location.formatted_address;
    } else {
      address = "That's it! Click submit when done. ";
    }
    return (
      <View>
        <Text style={styles.address}>{address}</Text>
        {this.state.submitInProgress ? (
          <Text style={styles.address}>Submitting (this may take a few seconds)...</Text>
        ) : null}
      </View>
    );
  };

  onStarRatingPress = rating => {
    this.setState({ starCount: rating });
  };

  loadLocationPrompts = () => {
    return (
      <View style={styles.reviewContainer}>
        {this.renderCurrentLocation()}
        <Text style={styles.timeContainer}>{this.getLocationTimes()}</Text>
        {!this.state.submit ? (
          <StarRating
            disabled={false}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            iconSet={'Ionicons'}
            maxStars={5}
            rating={this.state.starCount}
            selectedStar={rating => this.onStarRatingPress(rating)}
            fullStarColor={'#293C44'}
          />
        ) : null}
      </View>
    );
  };

  getLocationTimes = () => {
    if (this.state.loaded && this.inLocationsIndex()) {
      const currIndex = this.state.currLocationIndex;
      const location = this.state.locations[currIndex];
      const start = location.startTime;
      const end = location.endTime;
      const startString = this.timeToString(start);
      const endString = this.timeToString(end);
      const timeFromNow = moment(end).fromNow();
      return `From ${startString} to ${endString}? (${timeFromNow})`;
    } else return '';
  };

  timeToString = time => {
    const hour = moment(time).format('h:mm a');
    return hour;
  };

  nextAddress = () => {
    if (this.inLocationsIndex()) {
      this.saveProductivityScore(this.state.currLocationIndex, this.state.starCount);
      this.setState(prevState => {
        const newIndex = prevState.currLocationIndex + 1;
        this.updateStarRating(newIndex);
        let submit = false;
        if (newIndex >= this.state.locations.length) submit = true;
        return { currLocationIndex: newIndex, submit, atZero: false };
      });
    }
  };

  prevAddress = () => {
    if (this.state.currLocationIndex > 0) {
      this.saveProductivityScore(this.state.currLocationIndex, this.state.starCount);
      this.setState(prevState => {
        const newIndex = prevState.currLocationIndex - 1;
        this.updateStarRating(newIndex);
        let atZero = false;
        if (newIndex === 0) atZero = true;
        return { currLocationIndex: prevState.currLocationIndex - 1, submit: false, atZero };
      });
    }
  };

  saveProductivityScore = (currIndex, rating) => {
    if (currIndex < this.state.locations.length) {
      this.setState(prevState => {
        // update location object with new productivity score
        const locations = prevState.locations.map((location, i) => {
          if (currIndex === i) location['productivity'] = rating;
          return location;
        });
        // update state
        return {
          locations,
        };
      });
    }
  };

  updateStarRating = newIndex => {
    if (
      newIndex < this.state.locations.length &&
      'productivity' in this.state.locations[newIndex]
    ) {
      const prodScore = this.state.locations[newIndex]['productivity'];
      this.setState({ starCount: prodScore });
    } else {
      this.setState({ starCount: 3 });
    }
  };

  inLocationsIndex = () => {
    return this.state.currLocationIndex < this.state.locations.length;
  };

  submit = () => {
    const promises = [];
    this.state.locations.forEach(location => {
      promises.push(
        api.updateLocationProductivity(
          location._id,
          firebase.auth().currentUser.uid,
          location.productivity
        )
      );
    });
    this.setState({ submitInProgress: true });
    Promise.all(promises)
      .then(() => {
        this.props.setUserData(this.state.id);
        this.props.setFrequentLocations(this.state.id, 10);
        this.props.setMostProductiveDays(this.state.id);
        this.props.setLeastProductiveDays(this.state.id);
        this.props.setMostProductiveLocations(this.state.id);
        this.props.setProductivityScores(this.state.id);
        this.props.setNewLocations(this.state.id);

        this.setState({
          sentRequest: true,
        });
      })
      .catch(error => {
        Alert.alert(`Internal error saving your input: ${error.message}`);
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavBar backgroundColor="#388CAB" />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {this.state.newData ? (
            <View style={styles.topQuestionArea}>
              <Text style={styles.topQuestionAreaText}>How Productive Were You At...</Text>
              {this.state.loaded ? (
                this.loadLocationPrompts()
              ) : (
                <Text style={styles.address}>Loading...</Text>
              )}
              <View style={styles.ratingsLabelContainer}>
                {!this.state.submit
                  ? [
                      <Text style={styles.ratingsLabel} key={0}>
                        Not Productive
                      </Text>,
                      <Text style={styles.ratingsLabel} key={1}>
                        Very Productive
                      </Text>,
                    ]
                  : null}
              </View>
            </View>
          ) : (
            <View style={styles.messageContainer}>
              <Text style={styles.address}>No new locations to review, you're all set!</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          {this.state.submit || !this.state.newData ? (
            <TouchableOpacity
              style={styles.nextButtonContainer}
              onPress={() => {
                this.submit();
              }}>
              <Text style={styles.navButton}>{this.state.newData ? 'SUBMIT' : 'CLOSE'}</Text>
            </TouchableOpacity>
          ) : (
            [
              <Text style={styles.progressText} key={0}>
                {this.state.currLocationIndex + (this.state.newData ? 1 : 0)}
                {this.state.loaded ? ` / ${this.state.locations.length}` : null}
              </Text>,
              <TouchableOpacity
                style={styles.nextButtonContainer}
                key={1}
                onPress={() => {
                  this.nextAddress();
                }}>
                <Text style={styles.navButton} key={2}>
                  NEXT >
                </Text>
              </TouchableOpacity>,
            ]
          )}
          {!this.state.atZero ? (
            <TouchableOpacity
              style={styles.prevButtonContainer}
              onPress={() => {
                this.prevAddress();
              }}>
              <Text style={styles.navButton}>{`< BACK`}</Text>
            </TouchableOpacity>
          ) : null}
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
    backgroundColor: '#388CAB',
    zIndex: 1,
  },
  contentContainer: {
    backgroundColor: '#388CAB',
    flexGrow: 1,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  topQuestionArea: {
    marginTop: 30,
    alignItems: 'center',
  },
  topQuestionAreaText: {
    fontSize: 35,
    color: 'white',
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
  },
  address: {
    fontFamily: 'Raleway-Bold',
    color: '#293C44',
    fontSize: 30,
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
  },
  ratingsLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingsLabel: {
    textAlign: 'center',
    fontFamily: 'Raleway-Light',
    color: '#FEFEFE',
    fontSize: 18,
    marginTop: 15,
    width: 120,
  },
  reviewContainer: {
    paddingLeft: 40,
    paddingRight: 40,
    width: '100%',
  },
  navButton: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 22,
    zIndex: 999,
    color: '#293C44',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 35,
    right: 30,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  prevButtonContainer: {
    position: 'absolute',
    bottom: 35,
    left: 30,
    backgroundColor: 'transparent',
  },
  progressText: {
    position: 'absolute',
    bottom: 35,
    textAlign: 'center',
    fontFamily: 'Raleway-Light',
    color: '#FEFEFE',
    fontSize: 28,
    alignContent: 'center',
    left: 0,
    right: 0,
  },
  buttonContainer: {
    zIndex: 999,
  },
  timeContainer: {
    textAlign: 'center',
    color: '#FEFEFE',
    fontSize: 28,
    fontFamily: 'Raleway-SemiBold',
    marginBottom: 40,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    userData: state.user.userData,
    newLocations: state.user.newLocations,
    apiError: state.api.error,
    setUserDataInProgress: state.api.setUserDataInProgress,
    setFrequentLocationsInProgress: state.api.setFrequentLocationsInProgress,
    setMostProductiveDaysInProgress: state.api.setMostProductiveDaysInProgress,
    setLeastProductiveDaysInProgress: state.api.setLeastProductiveDaysInProgress,
    setMostProductiveLocationsInProgress: state.api.setMostProductiveLocationsInProgress,
    setProductivityScoresInProgress: state.api.setProductivityScoresInProgress,
    setNewLocationsInProgress: state.api.setNewLocationsInProgress,
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
    setNewLocations,
    setProvidedBackgroundLocation,
  }
)(SurveyScreen);
