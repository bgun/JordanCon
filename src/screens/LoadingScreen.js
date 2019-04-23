import React from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';



export default class LoadingScreen extends React.Component {

  render() {
    return (
      <View style={ styles.loading }>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: '#222',
    flex: 1,
    justifyContent: 'center'
  }
});
