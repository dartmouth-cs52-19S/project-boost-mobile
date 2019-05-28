import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { set } from 'immutable';
import NavBar from '../components/NavBar';

class DataScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected_timeframe: 'ALL',
      productivePrecent: '30%',
      leastProductiveTime: '10:00 PM-12:00 AM',
      leastProductiveDay: 'FRIDAYS',
      MostProductiveTime: '2:00 PM - 5:00PM',
      MostProductiveDay: 'TUESDAYS',
    };
  }

  onSelectedTimeAll = () => {
    this.setState({
      selected_timeframe: 'ALL',
    });
  };
  onSelectedTimeDays = () => {
    this.setState({
      selected_timeframe: 'DAYS',
    });
  };
  onSelectedTimeWeeks = () => {
    this.setState({
      selected_timeframe: 'WEEKS',
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <NavBar backgroundColor="#293C44" />
          <View style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>
            <TouchableHighlight
              style={
                this.state.selected_timeframe === 'ALL' ? styles.selectedBox : styles.selectorBox
              }
              onPress={this.onSelectedTimeAll}>
              <Text style={styles.text}>ALL</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={
                this.state.selected_timeframe === 'DAYS' ? styles.selectedBox : styles.selectorBox
              }
              onPress={this.onSelectedTimeDays}>
              <Text style={styles.text}>DAYS</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={
                this.state.selected_timeframe === 'WEEKS' ? styles.selectedBox : styles.selectorBox
              }
              onPress={this.onSelectedTimeWeeks}>
              <Text style={styles.text}>WEEKS</Text>
            </TouchableHighlight>
          </View>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={{ color: 'white', fontSize: 21, paddingLeft: 20 }}>Key Insights</Text>
            <View style={styles.insideScroll}>
              <View style={styles.card}>
                <Text>YOU WERE</Text>
                <Text>{this.state.productivePrecent}</Text>
                <Text>THIS MONTH</Text>
              </View>
              <View style={styles.card}>
                <Text>YOU ARE THE LEAST PRODUCTIVE ON</Text>
                <Text>{this.state.leastProductiveDay}</Text>
                <Text>{this.state.leastProductiveTime}</Text>
              </View>
              <View style={styles.card}>
                <Text>YOU ARE MOST PRODUCTIVE ON</Text>
                <Text>{this.state.mostProductiveDay}</Text>
                <Text>{this.state.mostProductiveTime}</Text>
              </View>
              <Text style={{ color: 'white', fontSize: 21, paddingLeft: 20 }}>
                Aggregate Productivity
              </Text>
              <View style={styles.card}>
                <Text>Graph placeholder</Text>
              </View>
              <Text style={{ color: 'white', fontSize: 21, paddingLeft: 20 }}>
                Your Most Productive Locations
              </Text>
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
  selectorBox: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 28,
    paddingRight: 28,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  selectedBox: {
    backgroundColor: '#1A262B',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 28,
    paddingRight: 28,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  text: {
    fontFamily: 'Raleway-Light',
    fontSize: 21,
    justifyContent: 'center',
    color: 'white',
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
  console.log(state);
  return {
    uid: state.uid,
  };
};

export default connect(
  mapStateToProps,
  null
)(DataScreen);
