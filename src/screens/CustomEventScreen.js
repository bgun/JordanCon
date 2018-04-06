'use strict';

import base64 from 'base-64';
import React, { Component } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import globalStyles from '../globalStyles';

import Icon from 'react-native-vector-icons/Entypo';

import GuestItem from '../components/GuestItem';
import { H1, H2, H3, H4 } from '../components/Headings';


export default class CustomEventScreen extends Component {

  static navigationOptions = {
    title: "Create Custom To-Do",
    tabBarLabel: "Home",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="home" size={ 24 } color={ tintColor } />
    )
  };

  constructor(props) {
    super();
    const conName = global.Store.getConName();
    this.state = {
      day: null,
      description: null,
      time: null,
      title: null
    }
  }

  handleInput(text) {
    this.state.text = text;
  }

  handlePress() {
  }

  render() {
    const subject = this.state.subject;
    return (
      <ScrollView style={ styles.view }>
        <H2>Create a custom event</H2>
        <Text style={{ fontSize: 14, paddingVertical: 10 }}>
          Please enter your comments below. The feedback is anonymous. If you would like
          to be contacted with regard to your comment or question, please add contact details below.
          Thanks, we appreciate any and all feedback!
        </Text>
        <TouchableOpacity onPress={ () => this.handlePress() } style={ [styles.button, { backgroundColor: global.Store.getColor('highlight') }] }>
          <Text style={ styles.buttonText }>Submit</Text>
        </TouchableOpacity>
        <View style={ styles.inputContainer }>
          <TextInput
            multiline={ true }
            placeholder="Type your feedback here."
            onChangeText={ this.handleInput.bind(this) }
            style={ styles.input }
            value={ this.state.text }
          />
        </View>
        <TouchableOpacity onPress={ () => this.handlePress() } style={ [styles.button, { backgroundColor: global.Store.getColor('highlight') }] }>
          <Text style={ styles.buttonText }>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#FAFAFA',
    padding: 20
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    height: 200,
    padding: 10
  },
  button: {
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 50,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonText: {
    color: 'white'
  }
});
