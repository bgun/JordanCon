'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import globalStyles from '../globalStyles';


export default class FeedbackButton extends Component {

  render() {
    return (
      <TouchableOpacity style={ styles.button } onPress={ () => { this.props.navigation.navigate("Feedback", { subject: this.props.subject }) } }>
        <Text style={ styles.buttonText }>Submit feedback for { this.props.subject }</Text>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#779',
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center'
  }
});
