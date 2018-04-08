'use strict';

import base64 from 'base-64';
import moment from 'moment';
import React, { Component } from 'react';

import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import globalStyles from '../globalStyles';

import Icon from 'react-native-vector-icons/Entypo';

import GuestItem from '../components/GuestItem';
import LabelColorPicker from '../components/LabelColorPicker';
import { H1, H2, H3, H4 } from '../components/Headings';

const FORM_INVALID_COLOR = '#DD0000AA';


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
      day: "", // moment().format('YYYY-MM-DD'),
      title: "",
      location: "",
      description: "",
      timeHours: ""+(moment().add(1, 'hour').hour() % 12),
      timeMins: "00",
      timeIsPM: moment().add(1, 'hour').hour() > 12,
      labelColor: null,
      formValid: false,
      formInvalidMessage: "Form invalid"
    }
  }

  handleDayPress(day) {
    this.setState({ day: day });
    setTimeout(() => this.validateForm(), 200);
  }

  handleHoursChange(val) {
    this.setState({ timeHours: val });
  }

  handleMinsChange(val) {
    this.setState({ timeMins: val });
  }

  handleLocationChange(val) {
    this.setState({ location: val });
  }

  handleDescChange(val) {
    this.setState({ description: val });
  }

  handleTitleChange(val) {
    this.setState({ title: val });
  }

  handlePmChange(bool) {
    this.setState({ timeIsPM: bool });
  }

  handleColorChange(color) {
    this.setState({ labelColor: color });
  }

  handleSubmit() {
    const hour = this.state.timeIsPM ? ""+(parseInt(this.state.timeHours)+12) : this.state.timeHours;
    let newTodo = {
      day: this.state.day,
      title: this.state.title,
      description: this.state.description,
      location: this.state.location,
      time: hour+":"+this.state.timeMins,
      labelColor: this.state.labelColor
    };
    global.Store.addCustomTodo(newTodo);
    this.props.navigation.goBack();
  }

  validateForm() {
    // Lovely form validation.
    // Remember to check in reverse priority 
    // of the error messages to be displayed.

    let valid = true;
    let invalidMsg = "";

    let hours = parseInt(this.state.timeHours);
    if (isNaN(hours)) {
      valid = false;
      invalidMsg = "Invalid hour.";
    }

    let mins  = parseInt(this.state.timeMins);
    if (isNaN(mins)) {
      valid = false;
      invalidMsg = "Invalid minutes.";
    }

    if (!(this.state.title && this.state.title.length > 0)) {
      valid = false;
      invalidMsg = "Please enter a title.";
    }

    if (!this.state.day) {
      valid = false;
      invalidMsg = "Please select a day.";
    }

    this.setState({
      formValid: valid,
      formInvalidMessage: invalidMsg
    });
  }

  render() {
    const subject = this.state.subject;
    const days = global.Store.getConDays(true);
    const state = this.state;

    let validHours = "";
    if (!isNaN(parseInt(state.timeHours))) {
      let h = parseInt(state.timeHours);
      if (h < 1) {
        h = "";
      }
      if (h > 12) {
        h = h % 12;
      }
      validHours = ""+h; // must return a string or the input will be blank
    }
    let validMins = "";
    if (!isNaN(parseInt(state.timeMins))) {
      let m = parseInt(state.timeMins);
      m = m % 60;
      if (m === 0) {
        validMins = "00";
      } else if (m < 10) {
        validMins = "0"+m;
      } else {
        validMins = ""+m;
      }
    }

    return (
      <KeyboardAvoidingView contentContainerStyle={{ flex: 1 }} behavior="padding">
        <ScrollView style={ styles.view }>
          <H2>Add a custom to-do item</H2>

          <Text style={{ fontSize: 14, paddingVertical: 10 }}>
            You can add a custom event to your to-do list below. Add items such as
            room parties, staff obligations, etc. to be shown alongside your Events.
          </Text>

          <H3>Select a day:</H3>
          { days.map(d => (
            <TouchableOpacity key={ d } onPress={ () => this.handleDayPress(d) } style={[styles.dayButton, { backgroundColor: d === this.state.day ? global.Store.getColor('highlight') : 'white' }]}>
              <Text style={ [styles.dayButtonText, { color: d === state.day ? 'white' : 'black' }] }>{ moment(d).format('dddd, MMMM D') }</Text>
            </TouchableOpacity>
          )) }

          <H3>Choose a time:</H3>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={ styles.timeInputContainer }>
              <TextInput keyboardType='numeric' style={[styles.timeInput, { borderColor: validHours.length > 0 ? '#DDD' : '#F00' }]} value={ validHours } onChangeText={ this.handleHoursChange.bind(this) } onBlur={ this.validateForm.bind(this) } />
            </View>
            <Text style={ styles.timeColon }>:</Text>
            <View style={ styles.timeInputContainer }>
              <TextInput keyboardType='numeric' style={[styles.timeInput, { borderColor: validMins.length > 0 ? '#DDD' : '#F00' }] } value={ validMins } onChangeText={ this.handleMinsChange.bind(this) } onBlur={ this.validateForm.bind(this) } />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
              <Text style={{ fontSize: 15, padding: 5 }}>AM</Text>
              <Switch onTintColor='#555' value={ state.timeIsPM } onValueChange={ this.handlePmChange.bind(this) } />
              <Text style={{ fontSize: 15, padding: 5 }}>PM</Text>
            </View>
          </View>

          <H3>Add a title:</H3>
          <View style={[styles.inputContainer, { borderColor: state.title.length > 0 ? '#DDD' : '#F00' }]}>
            <TextInput
              placeholder="Type your title here"
              onBlur={ this.validateForm.bind(this) }
              onChangeText={ this.handleTitleChange.bind(this) }
              style={ styles.lineInput }
              value={ state.title }
            />
          </View>

          <H3>Add a description (optional):</H3>
          <View style={ styles.inputContainer }>
            <TextInput
              multiline={ true }
              placeholder="Short description"
              onChangeText={ this.handleDescChange.bind(this) }
              style={ styles.descInput }
              value={ state.description }
            />
          </View>

          <H3>Add a location (optional):</H3>
          <View style={ styles.inputContainer }>
            <TextInput
              placeholder="Enter a location (optional)"
              onChangeText={ this.handleLocationChange.bind(this) }
              style={ styles.lineInput }
              value={ state.location }
            />
          </View>

          <H3>Label color:</H3>
          <LabelColorPicker onColorChange={ this.handleColorChange.bind(this) } />

          { this.state.formValid ? (
            <TouchableOpacity onPress={ this.handleSubmit.bind(this) } style={[ styles.submitButton, { backgroundColor: global.Store.getColor('highlight') } ]}>
              <Text style={{ color: 'white' }}>Add custom event</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={ this.validateForm.bind(this) } style={[ styles.submitButton, { backgroundColor: FORM_INVALID_COLOR } ]}>
              <Text style={{ color: 'white' }}>{ this.state.formInvalidMessage }</Text>
            </TouchableOpacity>
          ) }
          <View style={{ height: 250 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#FAFAFA',
    padding: 20
  },

  dayButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  dayButtonText: {
    color: '#444'
  },

  timeInputContainer: {
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderRadius: 5,
    borderWidth: 1,
  },
  timeInput: {
    fontSize: 18,
    height: 32,
    padding: 7,
    width: 50
  },
  timeColon: {
    fontSize: 18,
    paddingHorizontal: 4
  },

  inputContainer: {
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
  },
  lineInput: {
    fontSize: 18,
    height: 50,
    padding: 7
  },
  descInput: {
    fontSize: 18,
    height: 100,
    padding: 7
  },

  submitButton: {
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
});
