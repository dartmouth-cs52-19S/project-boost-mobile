import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';

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
    };
  }

  componentDidMount = () => {
    this.getNewLocationData();
  };

  getNewLocationData = () => {
    // TODO: once backend is set, get actual data from user in database
    this.ListeningStateChangedEvent({ locations: fakeData });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <NavBar backgroundColor="#388CAB" />
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.topQuestionArea}>
              <Text style={styles.topQuestionAreaText}>How Productive Were You At...</Text>
            </View>
          </ScrollView>
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
