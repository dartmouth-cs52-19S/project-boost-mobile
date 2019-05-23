import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import { Button } from 'react-native-elements';
import NavBar from '../components/NavBar';

const fakeData = [
  {
    _id: '123456',
    location: {
      // object from google places id
      id: '98765',
      address: '123 Something Road, Hanover, NH 05733, US',
      type: 'residence',
    },
    latLongLocation: '22234234, 234234234',
    startTime: 23423424,
    endTime: 2342342342,
    // productivity: 3, // won't exist as a field if user hasn't put it in
  },
  {
    _id: '234567',
    location: {
      // object from google places id
      id: '87654',
      address: '321 Another One, Hanover, NH 05733, US',
      type: 'airport',
    },
    latLongLocation: '4321431, 1234123',
    startTime: 23423424,
    endTime: 2342342342,
    // productivity: 3, // won't exist as a field if user hasn't put it in
  },
];

class SurveyScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      locations: null,
      currLocationIndex: 0,
      newData: true,
      loaded: false,
      starCount: 3,
      submit: false,
      atZero: true,
    };
  }

  componentDidMount = () => {
    this.getNewLocationData();
    this.setState({ loaded: true });
  };

  getNewLocationData = () => {
    // TODO: once backend is set, get actual data from user in database
    if (fakeData.length === 0) this.setState({ newData: false });
    this.setState({ locations: fakeData });
  };

  renderCurrentLocation = () => {
    let address = '';
    if (this.inLocationsIndex()) {
      const i = this.state.currLocationIndex;
      address = this.state.locations[i].location.address;
    } else {
      address = "That's it! Click submit when done. ";
    }
    return <Text style={styles.address}>{address}</Text>;
  };

  onStarRatingPress = rating => {
    this.setState({ starCount: rating });
  };

  loadLocationPrompts = () => {
    return this.state.newData ? (
      <View style={styles.reviewContainer}>
        {this.renderCurrentLocation()}
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
    ) : (
      <Text>No new locations to review, you're all set!</Text>
    );
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
        console.log(locations);
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
    }
  };

  inLocationsIndex = () => {
    return this.state.currLocationIndex < this.state.locations.length;
  };

  submit = () => {
    // TODO: Backend integration
    console.log('submit button clicked');
    this.props.navigation.navigate('LinksStack');
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <NavBar backgroundColor="#388CAB" />
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.topQuestionArea}>
              <Text style={styles.topQuestionAreaText}>How Productive Were You At...</Text>
              {this.state.loaded ? this.loadLocationPrompts() : <Text>Loading...</Text>}
              <View style={styles.ratingsLabelContainer}>
                {!this.state.submit
                  ? [
                      <Text style={styles.ratingsLabel}>Not Productive</Text>,
                      <Text style={styles.ratingsLabel}>Very Productive</Text>,
                    ]
                  : null}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.submit ? (
            <Button
              buttonStyle={styles.nextButton}
              color="#293C44"
              onPress={() => {
                // console.log('next button clicked');
                this.submit();
              }}
              title="SUBMIT"
            />
          ) : (
            <Button
              buttonStyle={styles.nextButton}
              color="#293C44"
              onPress={() => {
                // console.log('next button clicked');
                this.nextAddress();
              }}
              title="NEXT >"
            />
          )}
          {!this.state.atZero ? (
            <Button
              buttonStyle={styles.prevButton}
              color="#293C44"
              onPress={() => {
                // console.log('previous button clicked');
                this.prevAddress();
              }}
              title="< BACK"
            />
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
  },
  nextButton: {
    position: 'absolute',
    bottom: 35,
    right: 30,
    backgroundColor: 'transparent',
    fontFamily: 'Raleway-SemiBold',
    fontSize: 28,
    zIndex: 999,
    fontColor: 'red',
  },
  prevButton: {
    position: 'absolute',
    bottom: 35,
    left: 30,
    backgroundColor: 'transparent',
    fontFamily: 'Raleway-SemiBold',
    fontSize: 28,
  },
  buttonContainer: {
    zIndex: 999,
  },
});

const mapStateToProps = state => {
  return {
    userData: state.user.userData,
  };
};

export default connect(
  mapStateToProps,
  null
)(SurveyScreen);
