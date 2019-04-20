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

import GuestItem from '../components/GuestItem';
import LabelColorPicker from '../components/LabelColorPicker';
import { H1, H2, H3, H4 } from '../components/Headings';

const FORM_INVALID_COLOR = '#DD0000AA';


export default class CustomEventScreen extends Component {

  constructor(props) {
    super();
    const conName = global.Store.getConName();
    
    let nextHour24 = moment().add(1, 'hour').hour();
    let nextHour12 = (nextHour24 > 12) ? nextHour24 % 12 : nextHour24;

    this._validationTimeout = null;

    this.state = {
      day: "", // moment().format('YYYY-MM-DD'),
      title: "",
      location: "",
      description: "",
      timeHours: ""+nextHour12,
      timeMins: "00",
      timeIsPM: nextHour24 >= 12,
      labelColor: null,
      formValid: false,
      formInvalidMessage: "Please select a day."
    }
  }

  handleDayPress(day) {
    this.validateForm();
    this.setState({ day: day });
  }

  handleHoursChange(val) {
    let valid = false;
    if (!isNaN(parseInt(val))) {
      val = parseInt(val);
      if (val < 1) {
        val = "00";
      } else if (val > 12) {
        val = val % 12;
      }
      valid = true;
    }
    this.setState({ timeHours: valid ? val : "" });
    this.validateForm();
  }

  handleMinsChange(val) {
    let valid = false;
    if (!isNaN(parseInt(val))) {
      val = parseInt(val);
      val = val % 60;
      if (val === 0) {
        val = "00";
      } else if (val < 10) {
        val = "0"+val;
      }
      valid = true;
    }
    this.setState({ timeMins: valid ? val : "" });
    this.validateForm();
  }

  handleLocationChange(val) {
    this.setState({ location: val });
  }

  handleDescChange(val) {
    this.setState({ description: val });
  }

  handleTitleChange(val) {
    this.validateForm();
    this.setState({ title: val });
  }

  handlePmChange(bool) {
    this.setState({ timeIsPM: bool });
  }

  handleColorChange(color) {
    this.setState({ labelColor: color });
  }

  handleSubmit() {
    let hour24 = this.state.timeIsPM ? ""+(parseInt(this.state.timeHours)+12) : parseInt(this.state.timeHours) % 12;
    if (hour24 === "24") {
      hour24 = "12";
    }
    let newTodo = {
      day: this.state.day,
      title: this.state.title,
      description: this.state.description,
      location: this.state.location,
      time: hour24+":"+this.state.timeMins,
      labelColor: this.state.labelColor
    };
    console.log(newTodo);
    global.Store.addCustomTodo(newTodo);
    this.props.navigation.goBack();
  }

  validateForm() {
    // Lovely form validation.
    // Remember to check in reverse priority 
    // of the error messages to be displayed.

    clearTimeout(this._validationTimeout);

    this._validationTimeout = setTimeout(() => {
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
    }, 200);
  }

  render() {
    const subject = this.state.subject;
    const days = global.Store.getConDays(true);
    const state = this.state;

    const hourString = ""+this.state.timeHours;
    const minString = ""+this.state.timeMins;

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
              <TextInput keyboardType='numeric' style={[styles.timeInput, { borderColor: hourString.length > 0 ? '#DDD' : '#F00' }]} value={ hourString } onChangeText={ this.handleHoursChange.bind(this) } />
            </View>
            <Text style={ styles.timeColon }>:</Text>
            <View style={ styles.timeInputContainer }>
              <TextInput keyboardType='numeric' style={[styles.timeInput, { borderColor: minString.length > 0 ? '#DDD' : '#F00' }] } value={ minString } onChangeText={ this.handleMinsChange.bind(this) } />
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
