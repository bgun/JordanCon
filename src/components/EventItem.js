'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import _      from 'lodash';

import Icon from 'react-native-vector-icons/Entypo';

import globalStyles from '../globalStyles';


export default class EventItem extends Component {

  constructor(props) {
    super();

    let event = global.Store.getEventById(props.event_id);
    
    this.state = event ? {
      event_id: event.event_id,
      event: event,
      isTodo: global.Store.isTodo(event.event_id)
    } : {};
  }

  render() {
    // This may happen if an event is in your todos and gets deleted.
    if (!this.state.event) {
      console.warn("Event not found!", this.props.event_id);
      return null;
    }

    const { navigate } = this.props.navigation;

    return (
      <TouchableOpacity style={[globalStyles.floatingListItem, styles.item]} onPress={ () => navigate("EventDetail", { navigation: this.props.navigation, event_id: this.state.event_id }) }>
        <View style={{ flex: 1 }}>
          <Text style={ styles.titleText }>{ this.state.event.title }</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={ styles.timeText  }>{ this.state.event.formattedDateTime }</Text>
            <Text style={ [styles.locationText, { color: global.Store.getColor('highlightAlt') }] }>{ this.state.event.location }</Text>
          </View>
        </View>
        { this.state.isTodo ? (
          <Icon name="star" color={ global.Store.getColor('highlight') } size={20} style={{ paddingTop: 8, paddingRight: 8 }} />
        ) : null }
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12
  },
  titleText: {
    fontSize: 16
  },
  timeText: {
    color: '#666666',
    fontSize: 13
  },
  locationText: {
    fontSize: 13,
    marginLeft: 13
  }
});
