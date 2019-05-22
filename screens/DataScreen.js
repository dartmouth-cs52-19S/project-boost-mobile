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
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.getStartedContainer}>
              <Text style={styles.selector_text}>ALL</Text>
              <Text style={styles.selector_text}>DAYS</Text>
              <Text style={styles.selector_text}>WEEKS</Text>
            </View>
            <View>
              <Text style={{ color: 'white', fontSize: 21 }}>Key Insights</Text>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginLeft: 30,
    marginRight: 30,
  },
  contentContainer: {
    backgroundColor: '#293C44',
  },
  selector_text: {
    fontSize: 21,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 25,
    paddingRight: 25,
    justifyContent: 'center',
    color: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
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
