import React from 'react';
import { ScrollView, StyleSheet, Text, Button } from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    // header: null,
    title: 'VerifyAuth',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          This is where we will ask them about their initial setup questions for productivity
        </Text>

        <Text style={styles.text}>
          If they've already done this, they won't be asked again, and instead will be routed all
          the way into the app
        </Text>

        <Text style={styles.text}>Click the button below to go straight into the app for now</Text>

        <Button
          onPress={() => {
            this.props.navigation.navigate('App');
          }}
          title="navigate to app"
        />
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
  text: {
    margin: 20,
  },
});
