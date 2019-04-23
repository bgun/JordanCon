'use strict';

import _      from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Entypo } from '@expo/vector-icons';

import globalStyles from '../globalStyles';


export default class EventItem extends Component {

  render() {
    let event = global.Store.getEventById(this.props.event_id);
    const isTodo = global.Store.isTodo(event.event_id);


    // Event not found
    if (!event) {
      console.warn("Event not found for <EventItem>!", this.props.event_id);
      return null;
    }
    
    // Old item detected
    if (moment(event.day, "YYYY-MM-DD").year() !== moment().year()) {
      return null;
    }

    // "Hiding past events" is checked
    const eventIsPast = moment() > moment(event.day+" "+event.time).add(2, 'hour');
    if (global.Store.getSettings().hidePastEvents && eventIsPast) {
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

    let trackName = event.custom ? "Custom Event" : event.trackName;

    return (
      <TouchableOpacity style={[globalStyles.floatingListItem, styles.item, labelStyle ]} onPress={ () => navigate("EventDetail", { navigation: this.props.navigation, event_id: event.event_id }) }>
        <View style={{ flex: 1 }}>
          <Text style={ styles.titleText }>{ event.title }</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={ styles.timeText  }>{ event.formattedDateTime }</Text>
            <Text style={ [styles.locationText, { color: global.Store.getColor('highlightAlt') }] }>{ event.location }</Text>
          </View>
          { this.props.showTrack === true
           ? <Text style={ [styles.trackText, { color: global.Store.getColor('highlight') }]}>{ trackName }</Text>
           : null }
        </View>
        { isTodo ? (
          <Entypo name="star" color={ global.Store.getColor('highlight') } size={20} style={{ paddingTop: 8, paddingRight: 8 }} />
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
  },
  trackText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
});
