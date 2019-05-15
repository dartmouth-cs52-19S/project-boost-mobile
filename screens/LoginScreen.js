import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Google, Constants } from 'expo';
import * as firebase from 'firebase';
import { setUserID } from '../state/actions';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    if (firebase.auth().currentUser) {
      this.props.setUserID(firebase.auth().currentUser.uid);
      this.props.navigation.navigate('VerifyAuth');
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={this.signInGoogleAsync}>
            <Image source={require('../assets/images/google-signin.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // if the user tries to sign in with google, open pop up
  signInGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        // androidClientId: "Your Client ID",
        iosClientId: Constants.isDevice
          ? `911387247122-1g9m6a6tqhnq0i6vso3galottgdjh4pf.apps.googleusercontent.com`
          : '911387247122-1joui15ksueilqqsse016o2f94585tmt.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      // if successfully sign in via google, grab auth tokens and sign in with firebase
      if (result.type === 'success') {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken,
          result.accessToken
        );

        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(() => {
            this.props.setUserID(firebase.auth().currentUser.uid);
            this.props.navigation.navigate('VerifyAuth');
          });
      } else {
        console.log('User cancelled google sign in');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 50,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    setUserID: object => {
      dispatch(setUserID(object));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LoginScreen);
