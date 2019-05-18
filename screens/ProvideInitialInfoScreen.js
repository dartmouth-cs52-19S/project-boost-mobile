import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native';
import { white } from 'ansi-colors';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    // header: null,
    title: 'VerifyAuth',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.heading}>Lets Refine our Data on Your Productivity</Text>
          <Text style={styles.homeQuestion}>Enter Your Home Location:</Text>
          <FormLabel>Name</FormLabel>
          <FormInput />
          <FormValidationMessage>Error message</FormValidationMessage> <Text>Test 3</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#388CAB',
  },
  heading: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Railway',
    marginBottom: 50,
  },
  homeQuestion: {
    color: '#293C44',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Railway',
  },
});
