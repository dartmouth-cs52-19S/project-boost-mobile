import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import * as api from '../datastore/api_requests';
import loadingGIF from '../assets/gifs/loading-white.gif';
import NavBar from '../components/NavBar';

import { setUserData } from '../state/actions';

class VerifyAuth extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    api
      .getUserInfo(firebase.auth().currentUser.uid)
      .then(response => {
        if (!Object.keys(response).includes('homeLocation')) {
          this.props.setUserData(response);
          this.props.navigation.navigate('ProvideInitialInfo');
        } else {
          this.props.navigation.navigate('App');
        }
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavBar backgroundColor="#388CAB" />
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.loading}>Loading...</Text>
            <Image style={styles.loadingGIF} source={loadingGIF} />
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#388CAB',
  },
  contentContainer: {
    backgroundColor: '#388CAB',
  },
  loadingGIF: {
    width: 95,
    height: 95,
    marginBottom: 50,
  },
  loading: {
    fontFamily: 'Raleway-Light',
    fontSize: 20,
    color: '#e5e5e5',
    marginLeft: 10,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    setUserData: object => {
      dispatch(setUserData(object));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(VerifyAuth);
