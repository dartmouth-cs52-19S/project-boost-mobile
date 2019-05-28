import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import Modal from 'react-native-modal';
import NavBar from '../components/NavBar';
import MapPopup from '../components/MapPopup';

class DataScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTimeframe: 'ALL',
      selectedAddress: null,
    };
  }

  renderTopButtons = () => {
    const options = ['ALL', '7 DAYS', '30 DAYS'];

    return options.map((timeframe, index) => {
      return (
        <TouchableHighlight
          key={index}
          style={
            this.state.selectedTimeframe === timeframe ? styles.selectedBox : styles.selectorBox
          }
          onPress={() => {
            this.setState({
              selectedTimeframe: timeframe,
            });
          }}>
          <Text style={styles.text}>{timeframe}</Text>
        </TouchableHighlight>
      );
    });
  };

  getMostProductiveDay = () => {
    if (this.state.selectedTimeframe === '7 DAYS') {
      return this.props.mostProductiveDays.mostProductiveWeekDayLast7Days;
    } else if (this.state.selectedTimeframe === '30 DAYS') {
      return this.props.mostProductiveDays.mostProductiveWeekDayLast30Days;
    } else {
      return this.props.mostProductiveDays.mostProductiveWeekDayAllTime;
    }
  };

  getLeastProductiveDay = () => {
    if (this.state.selectedTimeframe === '7 DAYS') {
      return this.props.leastProductiveDays.leastProductiveWeekDayLast7Days;
    } else if (this.state.selectedTimeframe === '30 DAYS') {
      return this.props.leastProductiveDays.leastProductiveWeekDayLast30Days;
    } else {
      return this.props.leastProductiveDays.leastProductiveWeekDayAllTime;
    }
  };

  renderMostProductiveLocations = () => {
    let locations = [];

    // get 7 or 30 day if selectedTimeFrame is set
    this.props.mostProductiveLocations.forEach(obj => {
      if (
        (obj.days === 7 && this.state.selectedTimeframe === '7 DAYS') ||
        (obj.days === 30 && this.state.selectedTimeframe === '30 DAYS') ||
        (parseInt(obj.days, 10) > 30 && this.state.selectedTimeframe === 'ALL')
      ) {
        locations = obj.output;
      }
    });

    if (locations.length > 0) {
      return locations.map(location => {
        return (
          <TouchableOpacity
            onPress={() => {
              this.setState({ selectedAddress: location.address });
            }}>
            <Text style={styles.topLocation}>{location.address}</Text>
          </TouchableOpacity>
        );
      });
    } else {
      return (
        <Text
          style={
            styles.badLocationsData
          }>{`Uh oh! Looks like we don't have enough data for you in the last ${
          this.state.selectedTimeframe.split(' ')[0]
        } days.`}</Text>
      );
    }
  };

  renderChart = () => {
    if (this.state.selectedTimeframe === 'ALL') {
      return (
        <Text style={styles.badLocationsData}>
          Please select 7 or 30 days to view a chart of your average productivity levels over that
          period of time.
        </Text>
      );
    }

    let data = {};

    if (this.state.selectedTimeframe === '7 DAYS' && this.props.productivityScores['7']) {
      data = this.props.productivityScores['7'];
    } else if (this.state.selectedTimeframe === '30 DAYS' && this.props.productivityScores['30']) {
      data = this.props.productivityScores['30'];
    }

    if (Object.keys(data).length === 0) {
      return (
        <Text
          style={
            styles.badLocationsData
          }>{`Uh oh! Looks like we don't have enough data for you in the last ${
          this.state.selectedTimeframe.split(' ')[0]
        } days.`}</Text>
      );
    }

    const values = [];

    Object.keys(data).forEach(value => {
      values.push(data[value]);
    });

    return (
      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={Dimensions.get('window').width - 80} // from react-native
        height={300}
        chartConfig={{
          backgroundColor: '#586368',
          backgroundGradientFrom: '#586368',
          backgroundGradientTo: '#586368',
          color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <NavBar backgroundColor="#293C44" />
          <View style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>
            {this.renderTopButtons()}
          </View>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.insideScroll}>
              <Text style={styles.header}>Key Insights</Text>

              <View style={styles.card}>
                <Text style={styles.cardHeaderText}>YOU ARE MOST PRODUCTIVE ON</Text>
                <Text style={styles.cardText}>{`${this.getMostProductiveDay()}s`}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardHeaderText}>YOU ARE LEAST PRODUCTIVE ON</Text>
                <Text style={styles.cardText}>{`${this.getLeastProductiveDay()}s`}</Text>
              </View>

              <Text style={styles.header}>Aggregate Productivity</Text>

              <View style={styles.card}>
                <View style={styles.chartArea}>{this.renderChart()}</View>
              </View>

              <Text style={styles.header}>Most Productive Locations</Text>

              <View style={styles.card}>
                <View style={styles.topLocationArea}>{this.renderMostProductiveLocations()}</View>
              </View>
            </View>
          </ScrollView>
          <Modal
            isVisible={this.state.selectedAddress !== null}
            onBackdropPress={this.closeModal}
            onSwipeComplete={this.closeModal}
            animationIn="zoomIn"
            animationInTiming={400}
            animationOut="fadeOut">
            <MapPopup address={this.state.selectedAddress} />
          </Modal>
        </View>
      </SafeAreaView>
    );
  }

  closeModal = () => {
    this.setState({
      selectedAddress: null,
    });
  };
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
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  selectedBox: {
    backgroundColor: '#1A262B',
    paddingVertical: 18,
    paddingHorizontal: 24,
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
    backgroundColor: '#586368',
    borderRadius: 5,
    overflow: 'hidden',
    margin: 20,
    width: 350,
    height: 300,
  },
  header: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Raleway-SemiBold',
  },
  cardHeaderText: {
    fontFamily: 'Raleway-Light',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    paddingTop: 50,
    marginHorizontal: 20,
  },
  cardText: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 60,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
  },
  topLocation: {
    fontFamily: 'Raleway-Light',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  topLocationArea: {
    margin: 20,
  },
  badLocationsData: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  chartArea: {
    marginVertical: 20,
  },
});

const mapStateToProps = state => {
  return {
    userData: state.user.userData,
    mostProductiveDays: state.user.mostProductiveDays,
    leastProductiveDays: state.user.leastProductiveDays,
    mostProductiveLocations: state.user.mostProductiveLocations,
    productivityScores: state.user.productivityScores,
  };
};

export default connect(
  mapStateToProps,
  null
)(DataScreen);
