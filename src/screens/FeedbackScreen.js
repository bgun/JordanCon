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

import GuestItem from '../components/GuestItem';
import { H1, H2, H3, H4 } from '../components/Headings';


export default class FeedbackScreen extends Component {

  static navigationOptions = { title: "Feedback" };

  constructor(props) {
    super();
    this.state = {
      text: null,
      subject: props.navigation.state.params
        ? props.navigation.state.params.subject
        : null
    }
  }

  handleInput(text) {
    this.state.text = text;
  }

  handlePress() {

    const MAILGUN_API_KEY = 'key-67e2b1cb3dedfd3e88f10c6293af177a';
    const domain = 'con-nexus.bgun.me';
    
    // let url = 'http://con-nexus.bgun.me/api/feedback';
    let url = "https://api.mailgun.net/v3/"+domain+"/messages";
    if (!this.state.text) {
      global.makeToast("You haven't entered any text yet!");
      return;
    }

    let formData = new FormData();
    formData.append("from", "ben@con-nexus.bgun.me");
    formData.append("to", "ben@bengundersen.com");

    let subject = this.state.subject ? [global.con_data.name, this.state.subject].join(' | ') : global.con_data.name
    formData.append("subject", subject);
    formData.append("text", this.state.text);

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + base64.encode("api:" + MAILGUN_API_KEY),
        'Accept': 'application/json',
        'Content-Type': 'x-www-form-urlencoded'
      },
      body: formData
    }).then(resp => {
      console.log(resp);
      Alert.alert("Thank you!", "Feedback submitted successfully.", [{ text: "Awesome!" }]);
      this.setState({ text: "" });
    }).catch(e => {
      console.log("email error", e);
      global.makeToast("Error submitting feedback");
    });
  }

  render() {
    const subject = this.state.subject || global.con_data.name;
    return (
      <ScrollView style={ styles.view }>
        <H2>Feedback for { subject }</H2>
        <Text style={{ fontSize: 14, paddingVertical: 10 }}>
          Please enter your comments below. The feedback is anonymous. If you would like
          to be contacted with regard to your comment or question, please add contact details below.
          Thanks, we appreciate any and all feedback!
        </Text>
        <H4>How was { subject }?</H4>
        <View style={ styles.inputContainer }>
          <TextInput
            multiline={ true }
            placeholder="Type your feedback here."
            onChangeText={ this.handleInput.bind(this) }
            style={ styles.input }
            value={ this.state.text }
          />
        </View>
        <TouchableOpacity onPress={ () => this.handlePress() } style={ styles.button }>
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
    backgroundColor: '#48D',
    borderRadius: 10,
    marginBottom: 50,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonText: {
    color: 'white'
  }
});
