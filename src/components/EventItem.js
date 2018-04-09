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

  render() {
    let event = global.Store.getEventById(this.props.event_id);
    const isTodo = global.Store.isTodo(event.event_id);

    if (!event) {
      console.warn("Event not found for <EventItem>!", this.props.event_id);
      return null;
    }

    const { navigate } = this.props.navigation;

    let labelStyle = {};
    if (event.labelColor) {
      labelStyle = {
        borderLeftWidth: 8,
        borderLeftColor: event.labelColor
      };
    }

    return (
      <TouchableOpacity style={[globalStyles.floatingListItem, styles.item, labelStyle ]} onPress={ () => navigate("EventDetail", { navigation: this.props.navigation, event_id: event.event_id }) }>
        <View style={{ flex: 1 }}>
          <Text style={ styles.titleText }>{ event.title }</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={ styles.timeText  }>{ event.formattedDateTime }</Text>
            <Text style={ [styles.locationText, { color: global.Store.getColor('highlightAlt') }] }>{ event.location }</Text>
          </View>
        </View>
        { isTodo ? (
          <Icon name="star" color={ global.Store.getColor('highlight') } size={20} style={{ paddingTop: 8, paddingRight: 8 }} />
        ) : null }
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  item: {
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
