import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

import globalStyles from '../globalStyles';


export default class FeedbackButton extends Component {

  handleAddTodo() {
    global.Store.addTodo(this.props.event.event_id);
    this.forceUpdate();
  }

  handleRemoveTodo() {
    globalStore.removeTodo(this.props.event.event_id);
    this.forceUpdate();
  }

  render() {
    return (
      <View>
        { global.Store.isTodo(this.props.event.event_id) ? (
          <TouchableOpacity style={ styles.buttonRemove } onPress={ () => this.handleRemoveTodo() }>
            <Text style={ styles.buttonText }>Remove from todo list</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={ styles.buttonAdd } onPress={ () => this.handleAddTodo() }>
            <Icon name="star" size={16} color="white" />
            <Text style={[styles.buttonText, { marginLeft: 10 }]}>Add to my todo list</Text>
          </TouchableOpacity>
        ) }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  buttonAdd: {
    alignItems: 'center',
    backgroundColor: globalStyles.COLORS.highlight,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonRemove: {
    alignItems: 'center',
    backgroundColor: globalStyles.COLORS.highlightDark,
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
