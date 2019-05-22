import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';

import NavBar from '../components/NavBar';

class DataScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected_timeframe: '',
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <NavBar backgroundColor="#293C44" />
          <View style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.selectorText}>ALL</Text>
            <Text style={styles.selectorText}>DAYS</Text>
            <Text style={styles.selectorText}>WEEKS</Text>
          </View>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={{ color: 'white', fontSize: 21, paddingLeft: 20 }}>Key Insights</Text>
            <View style={styles.insideScroll}>
              <View style={styles.card}>
                <Text>Card</Text>
              </View>
              <View style={styles.card}>
                <Text>Card</Text>
              </View>
              <View style={styles.card}>
                <Text>Card</Text>
              </View>
              <View style={styles.card}>
                <Text>Card</Text>
              </View>
              <View style={styles.card}>
                <Text>Card</Text>
              </View>
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
    backgroundColor: '#293C44',
  },
  container: {
    flex: 1,
    backgroundColor: '#293C44',
  },
  getStartedContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginLeft: 18,
    marginRight: 18,
  },
  contentContainer: {
    backgroundColor: '#293C44',
  },
  selectorText: {
    fontFamily: 'Raleway-Light',
    fontSize: 21,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 28,
    paddingRight: 28,
    justifyContent: 'center',
    color: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  insideScroll: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(254, 254, 254, 0.2)',
    margin: 20,
    width: 350,
    height: 300,
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
)(DataScreen);
