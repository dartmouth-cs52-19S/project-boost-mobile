import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    // header: null,
    title: 'VerifyAuth',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>
          This is where we will ask them about their initial setup questions for productivity
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
