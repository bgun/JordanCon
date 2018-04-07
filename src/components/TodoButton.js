import React, { Component } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

import globalStyles from '../globalStyles';


export default class FeedbackButton extends Component {
  
  handleAddTodo() {
    global.Store.addTodo({ event_id: this.props.event.event_id });
    this.forceUpdate();
  }

  removeCustomEvent() {
    // Warn user if about to delete a custom event.
    Alert.alert(
      'Are you sure?',
      'This is a custom event. If you delete it, you will need to re-create it.',
      [
        { text: 'Delete it', onPress: () => {
            global.Store.removeTodo(this.props.event.event_id);
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 200);
          }
        },
        { text: 'Cancel' }
      ]
    );
  }

  handleRemoveTodo() {
    if (this.props.event.custom) {
      this.removeCustomEvent();
    } else {
      global.Store.removeTodo(this.props.event.event_id);
    }
    this.forceUpdate();
  }

  render() {
    const ev = this.props.event;
    console.warn(ev);

    if (ev.custom) {
      button = (
        <TouchableOpacity style={ styles.buttonRemoveCustom } onPress={ () => this.handleRemoveTodo() }>
          <Text style={ styles.buttonText }>Remove my custom event</Text>
        </TouchableOpacity>
      );
    } else if (global.Store.isTodo(ev.event_id)) {
      button = (
        <TouchableOpacity style={[styles.buttonRemove, { backgroundColor: global.Store.getColor('highlightDark')}]} onPress={ () => this.handleRemoveTodo() }>
          <Text style={ styles.buttonText }>Remove from todo list</Text>
        </TouchableOpacity>
      );
    } else {
      button = (
      <TouchableOpacity style={[styles.buttonAdd, { backgroundColor: global.Store.getColor('highlight') }]} onPress={ () => this.handleAddTodo() }>
        <Icon name="star" size={16} color="white" />
        <Text style={[styles.buttonText, { marginLeft: 10 }]}>Add to my todo list</Text>
      </TouchableOpacity>
      );
    }

    return (button);
  }

}

const styles = StyleSheet.create({
  buttonAdd: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonRemove: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonRemoveCustom: {
    alignItems: 'center',
    backgroundColor: '#D00',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonText: {
    color: '#FFFFFF'
  }
});
